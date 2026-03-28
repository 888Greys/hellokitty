import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, FormEvent, HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  APP_TITLE,
  DEFAULT_MAX_TOKENS,
  DEFAULT_PROFILE,
  DEFAULT_RESPONSE_STYLE,
  DEFAULT_STREAM,
  DEFAULT_SYSTEM_PROMPT,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  buildChatPayload,
  buildSessionTitle,
  buildSystemPrompt,
  chooseModel,
  createInitialSession,
  createMessage,
  estimateTokens,
  formatTime,
  isVagueAssistantReply,
  makeDefaultApiBase,
  normalizeApiBase,
  sanitizeSessions,
  type AssistantProfile,
  type ChatSession,
  type ChatSettings,
  type ResponseStyle,
} from './lib/chat'

const SETTINGS_KEY = 'bb.chat.settings.v2'
const SESSIONS_KEY = 'bb.chat.sessions.v2'
const REQUEST_TIMEOUT_MS = 90_000

const PROFILE_OPTIONS: Array<{ value: AssistantProfile; label: string }> = [
  { value: 'engineer', label: 'Counsel' },
  { value: 'reviewer', label: 'Review' },
  { value: 'debugger', label: 'Risk Check' },
]

const RESPONSE_STYLE_OPTIONS: Array<{ value: ResponseStyle; label: string }> = [
  { value: 'concise', label: 'Concise' },
  { value: 'engineer', label: 'Counsel' },
  { value: 'deep', label: 'Deep dive' },
]

const PROMPT_TEMPLATES = [
  {
    label: 'Issue Spotting',
    prompt:
      'Review this legal issue under Kenyan law. Start with the most likely risk or missing fact, then give the shortest defensible path to fix it.',
  },
  {
    label: 'Draft review',
    prompt:
      'Review this like a senior Kenyan lawyer. Focus on contradictions, missing facts, legal risk, drafting weakness, and anything that should block approval. Keep the findings concrete.',
  },
  {
    label: 'Matter strategy',
    prompt:
      'Propose the simplest legal workflow or matter strategy that will hold up in practice. Call out tradeoffs, bottlenecks, and what should be avoided.',
  },
  {
    label: 'Redraft',
    prompt:
      'Redraft this safely. Suggest the smallest changes that improve clarity, legal defensibility, and review readiness without changing the client's intent.',
  },
  {
    label: 'Urgent risk',
    prompt:
      'Treat this like an urgent Kenyan legal risk. Give immediate triage steps, the likely legal exposure, the facts that must be confirmed, and the fastest safe path to contain the issue.',
  },
]

type StatusTone = 'ready' | 'busy' | 'error' | 'warn'
type ErrorKind = 'auth' | 'model' | 'server' | 'context' | 'network' | 'timeout' | ''

type RuntimeStatus = {
  label: string
  tone: StatusTone
}

type RequestError = Error & {
  status?: number
}

const defaultSettings = (): ChatSettings => ({
  apiBase: makeDefaultApiBase(),
  selectedModel: '',
  temperature: DEFAULT_TEMPERATURE,
  topP: DEFAULT_TOP_P,
  maxTokens: DEFAULT_MAX_TOKENS,
  stream: DEFAULT_STREAM,
})

function loadSettings(): ChatSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY)
    if (!raw) return defaultSettings()
    const parsed = JSON.parse(raw) as Partial<ChatSettings>
    return {
      apiBase: normalizeApiBase(parsed.apiBase),
      selectedModel: parsed.selectedModel ?? '',
      temperature: Number(parsed.temperature ?? DEFAULT_TEMPERATURE),
      topP: Number(parsed.topP ?? DEFAULT_TOP_P),
      maxTokens: Number(parsed.maxTokens ?? DEFAULT_MAX_TOKENS),
      stream: Boolean(parsed.stream ?? DEFAULT_STREAM),
    }
  } catch {
    return defaultSettings()
  }
}

function loadSessions(): ChatSession[] {
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY)
    if (!raw) return [createInitialSession(DEFAULT_SYSTEM_PROMPT)]
    const parsed = JSON.parse(raw) as ChatSession[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [createInitialSession(DEFAULT_SYSTEM_PROMPT)]
    }
    return sanitizeSessions(parsed, DEFAULT_SYSTEM_PROMPT)
  } catch {
    return [createInitialSession(DEFAULT_SYSTEM_PROMPT)]
  }
}

function classifyError(message: string, status?: number, timedOut = false): ErrorKind {
  const normalized = message.toLowerCase()

  if (status === 401 || normalized.includes('authentication required')) return 'auth'
  if (timedOut || normalized.includes('timed out')) return 'timeout'
  if (status === 404 || normalized.includes('model changed') || normalized.includes('no live model')) return 'model'
  if (status && status >= 500) return 'server'
  if (normalized.includes('context') || normalized.includes('8192')) return 'context'
  return 'network'
}

function App() {
  const [settings, setSettings] = useState<ChatSettings>(() => loadSettings())
  const [draftSettings, setDraftSettings] = useState<ChatSettings>(() => loadSettings())
  const [sessions, setSessions] = useState<ChatSession[]>(() => loadSessions())
  const [activeSessionId, setActiveSessionId] = useState<string>(() => loadSessions()[0]?.id ?? '')
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [composer, setComposer] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [sessionQuery, setSessionQuery] = useState('')
  const [status, setStatus] = useState<RuntimeStatus>({ label: 'Ready', tone: 'ready' })
  const [errorText, setErrorText] = useState('')
  const [errorKind, setErrorKind] = useState<ErrorKind>('')
  const [needsLogin, setNeedsLogin] = useState(false)
  const [activeModel, setActiveModel] = useState(settings.selectedModel)
  const [isSending, setIsSending] = useState(false)
  const [copiedToken, setCopiedToken] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const composerRef = useRef<HTMLTextAreaElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? sessions[0],
    [activeSessionId, sessions],
  )

  const contextEstimate = useMemo(() => {
    if (!activeSession) return 0
    return estimateTokens(activeSession.messages)
  }, [activeSession])

  const visibleMessages = activeSession?.messages.filter((message) => message.role !== 'system') ?? []
  const isEmptyState = visibleMessages.length === 0
  const activeProfile = activeSession?.profile ?? DEFAULT_PROFILE
  const activeResponseStyle = activeSession?.responseStyle ?? DEFAULT_RESPONSE_STYLE

  const filteredSessions = useMemo(() => {
    const needle = sessionQuery.trim().toLowerCase()

    return sessions
      .slice()
      .sort(
        (left, right) =>
          Number(Boolean(right.pinned)) - Number(Boolean(left.pinned)) || right.updatedAt - left.updatedAt,
      )
      .filter((session) => {
        if (!needle) return true
        const haystack = [session.title, session.messages.find((message) => message.role === 'user')?.content ?? '']
          .join(' ')
          .toLowerCase()
        return haystack.includes(needle)
      })
  }, [sessionQuery, sessions])

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    setDraftSettings(settings)
  }, [settings])

  useEffect(() => {
    if (!activeSession && sessions[0]) {
      setActiveSessionId(sessions[0].id)
    }
  }, [activeSession, sessions])

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [sessions, activeSessionId])

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      const isModifier = event.metaKey || event.ctrlKey

      if (isModifier && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        composerRef.current?.focus()
      }

      if (event.key === 'Escape') {
        setShowSettings(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function updateSession(mutator: (session: ChatSession) => ChatSession) {
    setSessions((current) =>
      current.map((session) => (session.id === activeSessionId ? mutator(session) : session)),
    )
  }

  function buildSessionPrompt(profile: AssistantProfile, responseStyle: ResponseStyle) {
    return buildSystemPrompt(profile, responseStyle)
  }

  function handleNewChat() {
    const next = createInitialSession(buildSessionPrompt(activeProfile, activeResponseStyle), {
      profile: activeProfile,
      responseStyle: activeResponseStyle,
    })
    setSessions((current) => [next, ...current])
    setActiveSessionId(next.id)
    setComposer('')
    setErrorText('')
    setErrorKind('')
    setStatus({ label: 'Ready', tone: 'ready' })
  }

  function handleClearContext() {
    updateSession((session) => ({
      ...session,
      title: 'New Chat',
      updatedAt: Date.now(),
      messages: [
        createMessage(
          'system',
          buildSessionPrompt(session.profile ?? DEFAULT_PROFILE, session.responseStyle ?? DEFAULT_RESPONSE_STYLE),
        ),
      ],
    }))
    setStatus({ label: 'Context Cleared', tone: 'ready' })
    setErrorText('')
    setErrorKind('')
  }

  function updateActiveSessionPreset(nextProfile: AssistantProfile, nextResponseStyle: ResponseStyle) {
    updateSession((session) => {
      const nextMessages = [...session.messages]
      nextMessages[0] = createMessage('system', buildSessionPrompt(nextProfile, nextResponseStyle))
      return {
        ...session,
        profile: nextProfile,
        responseStyle: nextResponseStyle,
        updatedAt: Date.now(),
        messages: nextMessages,
      }
    })
    setStatus({ label: 'Preset Updated', tone: 'ready' })
  }

  async function refreshModels(preferred = settings.selectedModel) {
    const response = await fetch(`${settings.apiBase}/models`, {
      headers: { Accept: 'application/json' },
    })

    if (response.status === 401) {
      const unauthorizedError = new Error('Authentication required. Open the hosted login once, then retry.') as RequestError
      unauthorizedError.status = 401
      throw unauthorizedError
    }

    if (!response.ok) {
      const refreshError = new Error(`Model refresh failed (${response.status})`) as RequestError
      refreshError.status = response.status
      throw refreshError
    }

    const payload = (await response.json()) as { data?: Array<{ id?: string }> }
    const models = (payload.data ?? []).map((item) => item.id).filter((id): id is string => Boolean(id))
    setAvailableModels(models)
    const resolved = chooseModel(preferred, models)
    if (resolved) {
      setActiveModel(resolved)
      setSettings((current) => ({ ...current, selectedModel: resolved }))
    }
    return models
  }

  function applyAssistantContent(content: string, titleSeed?: string) {
    updateSession((session) => {
      const messages = [...session.messages]
      const last = messages[messages.length - 1]
      if (last?.role === 'assistant') {
        last.content = content
      }

      return {
        ...session,
        title: session.title === 'New Chat' && titleSeed ? buildSessionTitle(titleSeed) : session.title,
        updatedAt: Date.now(),
        messages,
      }
    })
  }

  async function copyText(token: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedToken(token)
      window.setTimeout(() => {
        setCopiedToken((current) => (current === token ? '' : current))
      }, 1400)
    } catch {
      setErrorText('Copy failed. Clipboard access was blocked.')
      setErrorKind('network')
      setStatus({ label: 'Clipboard Blocked', tone: 'warn' })
    }
  }

  async function submitPrompt(userText: string) {
    if (!userText.trim() || !activeSession || isSending) return

    const assistantPlaceholder = createMessage('assistant', '')
    const userMessage = createMessage('user', userText.trim())
    const titleSeed = userText.trim()

    setComposer('')
    setErrorText('')
    setErrorKind('')
    setNeedsLogin(false)
    setStatus({ label: settings.stream ? 'Thinking / Streaming' : 'Thinking', tone: 'busy' })
    setIsSending(true)

    updateSession((session) => ({
      ...session,
      updatedAt: Date.now(),
      messages: [...session.messages, userMessage, assistantPlaceholder],
    }))

    let timedOut = false

    try {
      let model = activeModel || settings.selectedModel
      if (!model) {
        const models = await refreshModels()
        model = chooseModel(settings.selectedModel, models)
      }
      if (!model) {
        throw new Error('No live model available from /v1/models')
      }

      const payload = buildChatPayload(
        [...activeSession.messages, userMessage],
        model,
        settings.temperature,
        settings.topP,
        settings.maxTokens,
        settings.stream,
      )

      const controller = new AbortController()
      const timeoutId = window.setTimeout(() => {
        timedOut = true
        controller.abort()
      }, REQUEST_TIMEOUT_MS)
      abortRef.current = controller

      const response = await fetch(`${settings.apiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      window.clearTimeout(timeoutId)

      if (response.status === 401) {
        const unauthorizedError = new Error('Authentication required. Open the hosted login once, then retry.') as RequestError
        unauthorizedError.status = 401
        throw unauthorizedError
      }

      if (response.status === 404) {
        const models = await refreshModels()
        const fallback = chooseModel('', models)
        if (fallback && fallback !== model) {
          setSettings((current) => ({ ...current, selectedModel: fallback }))
          setActiveModel(fallback)
          applyAssistantContent(`Model changed to ${fallback}. Retry the prompt.`, titleSeed)
          setStatus({ label: 'Model Updated', tone: 'warn' })
          return
        }
      }

      if (!response.ok) {
        const message = await response.text()
        throw Object.assign(new Error(`HTTP ${response.status}: ${message}`), { status: response.status }) as RequestError
      }

      if (!settings.stream || !response.body) {
        const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> }
        applyAssistantContent(data.choices?.[0]?.message?.content ?? '', titleSeed)
        setStatus({ label: 'Ready', tone: 'ready' })
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      let sseBuffer = ''

      while (true) {
        const { done, value } = await reader.read()
        sseBuffer += decoder.decode(value ?? new Uint8Array(), { stream: !done })

        const events = sseBuffer.split('\n\n')
        sseBuffer = events.pop() ?? ''

        for (const eventChunk of events) {
          const lines = eventChunk.split('\n')
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const payloadLine = line.slice(6).trim()
            if (!payloadLine || payloadLine === '[DONE]') continue
            try {
              const data = JSON.parse(payloadLine) as {
                choices?: Array<{ delta?: { content?: string } }>
              }
              const token = data.choices?.[0]?.delta?.content ?? ''
              if (!token) continue
              fullText += token
              applyAssistantContent(fullText, titleSeed)
            } catch {
              // keep incomplete fragments in the rolling buffer path
            }
          }
        }

        if (done) break
      }

      setStatus({ label: 'Ready', tone: 'ready' })
    } catch (error) {
      const requestError = error as RequestError
      const message =
        timedOut && requestError.name === 'AbortError'
          ? 'Request timed out. Retry with a shorter prompt or lower max tokens.'
          : requestError instanceof Error
            ? requestError.message
            : 'Request failed'
      const statusCode = requestError?.status
      const nextErrorKind = classifyError(message, statusCode, timedOut)
      setNeedsLogin(nextErrorKind === 'auth')
      setErrorKind(nextErrorKind)
      applyAssistantContent(`Error: ${message}`, titleSeed)
      setErrorText(message)
      setStatus({ label: 'Connection Error', tone: 'error' })
    } finally {
      abortRef.current = null
      setIsSending(false)
    }
  }

  async function sendPrompt(event?: FormEvent) {
    event?.preventDefault()
    const userText = composer.trim()
    if (!userText) return
    await submitPrompt(userText)
  }

  function stopGeneration() {
    abortRef.current?.abort()
    abortRef.current = null
    setIsSending(false)
    setStatus({ label: 'Stopped', tone: 'warn' })
  }

  function saveSettings() {
    const next = {
      ...draftSettings,
      apiBase: normalizeApiBase(draftSettings.apiBase),
    }
    setSettings(next)
    setActiveModel(next.selectedModel)
    setShowSettings(false)
    setStatus({ label: 'Settings Saved', tone: 'ready' })
  }

  function openHostedLogin() {
    window.open('https://badztmaruintel.breachbase.lol/chat.html', '_blank', 'noopener,noreferrer')
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendPrompt()
    }
  }

  function replayLastPrompt(mode: 'retry' | 'edit') {
    const lastUser = [...(activeSession?.messages ?? [])].reverse().find((item) => item.role === 'user')
    if (!lastUser) return

    if (mode === 'edit') {
      setComposer(lastUser.content)
      composerRef.current?.focus()
      return
    }

    void submitPrompt(lastUser.content)
  }

  function togglePin(sessionId: string) {
    setSessions((current) =>
      current.map((session) =>
        session.id === sessionId ? { ...session, pinned: !session.pinned, updatedAt: Date.now() } : session,
      ),
    )
  }

  function applyTemplate(prompt: string) {
    setComposer(prompt)
    composerRef.current?.focus()
  }

  async function importFiles(files: FileList | File[]) {
    const selected = Array.from(files).slice(0, 4)
    if (!selected.length) return

    const blocks = await Promise.all(
      selected.map(async (file) => {
        const text = await file.text().catch(() => '')
        return text
          ? `\n\n[Attached: ${file.name}]\n\`\`\`\n${text.slice(0, 12000)}\n\`\`\``
          : ''
      }),
    )

    const next = blocks.filter(Boolean).join('\n')
    if (next) {
      setComposer((current) => `${current}${next}`.trim())
      composerRef.current?.focus()
    }
  }

  async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.length) return
    await importFiles(event.target.files)
    event.target.value = ''
  }

  async function handleComposerPaste(event: React.ClipboardEvent<HTMLTextAreaElement>) {
    if (!event.clipboardData.files.length) return
    event.preventDefault()
    await importFiles(event.clipboardData.files)
  }

  async function handleDrop(event: DragEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsDragOver(false)
    if (!event.dataTransfer.files.length) return
    await importFiles(event.dataTransfer.files)
  }

  function renderMarkdown(content: string, messageId: string) {
    return (
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            return <>{children}</>
          },
          code(props) {
            const typedProps = props as {
              inline?: boolean
              className?: string
              children?: ReactNode
            } & HTMLAttributes<HTMLElement>
            const { className, children, ...rest } = typedProps
            const value = String(children).replace(/\n$/, '')
            const inline = typedProps.inline ?? (!className && !value.includes('\n'))

            if (inline) {
              return (
                <code className={className} {...rest}>
                  {children}
                </code>
              )
            }

            const token = `code-${messageId}-${value.slice(0, 24)}`
            const language = className?.replace('language-', '') || 'text'

            return (
              <div className="code-block">
                <div className="code-toolbar">
                  <span>{language}</span>
                  <button type="button" className="ghost-button mini-button" onClick={() => void copyText(token, value)}>
                    {copiedToken === token ? 'Copied' : 'Copy code'}
                  </button>
                </div>
                <SyntaxHighlighter
                  language={language}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    padding: '14px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: '#0d1117',
                  }}
                >
                  {value}
                </SyntaxHighlighter>
              </div>
            )
          },
        }}
      >
        {content}
      </Markdown>
    )
  }

  const statusClass =
    status.tone === 'ready'
      ? 'status-ready'
      : status.tone === 'busy'
        ? 'status-busy'
        : status.tone === 'warn'
          ? 'status-warn'
          : 'status-error'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-shell">
          <div className="brand-mark">AI</div>
          <div className="brand-copy">
            <div className="brand-kicker">Local Chat</div>
            <h1>{APP_TITLE}</h1>
          </div>
        </div>

        <div className="sidebar-actions">
          <button className="primary-button" type="button" onClick={handleNewChat}>
            New chat
          </button>
          <button className="secondary-button" type="button" onClick={handleClearContext}>
            Clear
          </button>
        </div>

        <label className="session-search">
          <span>Search chats</span>
          <input
            value={sessionQuery}
            onChange={(event) => setSessionQuery(event.target.value)}
            placeholder="Find a chat..."
          />
        </label>

        <div className="session-list">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className={`session-row ${session.id === activeSession?.id ? 'session-row-active' : ''}`}
            >
              <button type="button" className="session-card" onClick={() => setActiveSessionId(session.id)}>
                <span className="session-title">{session.title}</span>
                <span className="session-time">{formatTime(session.updatedAt)}</span>
              </button>
              <button
                type="button"
                className={`ghost-button mini-button session-pin ${session.pinned ? 'session-pin-active' : ''}`}
                onClick={() => togglePin(session.id)}
              >
                {session.pinned ? 'Pinned' : 'Pin'}
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="topbar-left">
            <div className={`status-pill ${statusClass}`}>{status.label}</div>
            <div className="topbar-meta">
              <span>
                Model <strong>{activeModel || 'Auto detect'}</strong>
              </span>
              <span>
                Context <strong>{contextEstimate}</strong> / 8192
              </span>
            </div>
          </div>
          <div className="topbar-actions">
            <button type="button" className="ghost-button" onClick={() => setShowSettings(true)}>
              Settings
            </button>
            <button
              type="button"
              className="ghost-button"
              onClick={() => {
                refreshModels()
                  .then(() => {
                    setNeedsLogin(false)
                    setErrorText('')
                    setErrorKind('')
                    setStatus({ label: 'Models Refreshed', tone: 'ready' })
                  })
                  .catch((error: RequestError) => {
                    const nextErrorKind = classifyError(error.message, error.status)
                    setNeedsLogin(nextErrorKind === 'auth')
                    setErrorKind(nextErrorKind)
                    setErrorText(error.message)
                    setStatus({ label: nextErrorKind === 'auth' ? 'Login Required' : 'Model Refresh Failed', tone: 'warn' })
                  })
              }}
            >
              Refresh Models
            </button>
          </div>
        </header>

        <section className="chat-panel" ref={scrollRef}>
          <div className="chat-column">
            {isEmptyState ? (
              <section className="empty-state">
                <h2>How can I help?</h2>
                <p>Ask code, debugging, architecture, or review questions. The live model is ready.</p>
                <div className="template-grid">
                  {PROMPT_TEMPLATES.map((template) => (
                    <button
                      key={template.label}
                      type="button"
                      className="template-chip"
                      onClick={() => applyTemplate(template.prompt)}
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            {visibleMessages.map((message) => (
              <article
                key={message.id}
                className={`message-card ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
              >
                <div className="message-role">{message.role === 'user' ? 'You' : 'Assistant'}</div>
                {message.role === 'assistant' ? (
                  <div className="markdown-body">
                    {message.content ? renderMarkdown(message.content, message.id) : <div className="typing-indicator">Thinking<span /><span /><span /></div>}
                  </div>
                ) : (
                  <div className="message-plain">{message.content}</div>
                )}
                <div className="message-actions">
                  {message.role === 'assistant' && message.content ? (
                    <>
                      <button
                        type="button"
                        className="ghost-button mini-button"
                        onClick={() => void copyText(`reply-${message.id}`, message.content)}
                      >
                        {copiedToken === `reply-${message.id}` ? 'Copied' : 'Copy'}
                      </button>
                      <button type="button" className="ghost-button mini-button" onClick={() => replayLastPrompt('retry')}>
                        Retry
                      </button>
                      <button
                        type="button"
                        className="ghost-button mini-button"
                        onClick={() => void submitPrompt('Continue from where you stopped. Do not repeat prior content.')}
                      >
                        Continue
                      </button>
                      {isVagueAssistantReply(message.content) ? (
                        <button
                          type="button"
                          className="ghost-button mini-button"
                          onClick={() =>
                            void submitPrompt(
                              'Rewrite your last answer with only concrete steps, exact commands, and specific file changes. Remove vague language.',
                            )
                          }
                        >
                          Make concrete
                        </button>
                      ) : null}
                    </>
                  ) : null}
                  {message.role === 'user' ? (
                    <button type="button" className="ghost-button mini-button" onClick={() => setComposer(message.content)}>
                      Edit
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="composer-panel">
          {errorText ? (
            <div className={`error-banner ${errorKind ? `error-${errorKind}` : ''}`}>
              <span className="error-badge">{errorKind || 'error'}</span>
              <span className="error-copy">{errorText}</span>
              {needsLogin ? (
                <button type="button" className="ghost-button error-action" onClick={openHostedLogin}>
                  Open Login Page
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="composer-toolbar">
            <div className="composer-toolbar-left">
              <button type="button" className="ghost-button mini-button" onClick={() => setShowAdvanced((current) => !current)}>
                {showAdvanced ? 'Hide controls' : 'Show controls'}
              </button>
              <button type="button" className="ghost-button mini-button" onClick={() => fileInputRef.current?.click()}>
                Attach text/log
              </button>
            </div>
            <div className="composer-toolbar-meta">
              <span>{settings.stream ? 'Streaming on' : 'Streaming off'}</span>
              <span>{settings.maxTokens} max tokens</span>
              <span>Ctrl/Cmd+K focuses composer</span>
            </div>
          </div>

          <div className="preset-row">
            <label>
              <span>Profile</span>
              <select
                value={activeProfile}
                onChange={(event) => updateActiveSessionPreset(event.target.value as AssistantProfile, activeResponseStyle)}
              >
                {PROFILE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Style</span>
              <select
                value={activeResponseStyle}
                onChange={(event) => updateActiveSessionPreset(activeProfile, event.target.value as ResponseStyle)}
              >
                {RESPONSE_STYLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {showAdvanced ? (
            <div className="controls-grid">
              <label>
                <span>Temperature</span>
                <input
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, temperature: Number(event.target.value) }))
                  }
                />
              </label>
              <label>
                <span>Max Tokens</span>
                <input
                  type="number"
                  min="64"
                  max="4096"
                  step="64"
                  value={settings.maxTokens}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, maxTokens: Number(event.target.value) }))
                  }
                />
              </label>
              <label>
                <span>Top P</span>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.topP}
                  onChange={(event) => setSettings((current) => ({ ...current, topP: Number(event.target.value) }))}
                />
              </label>
              <label>
                <span>Stream</span>
                <select
                  value={String(settings.stream)}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, stream: event.target.value === 'true' }))
                  }
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </label>
            </div>
          ) : null}

          <form
            onSubmit={sendPrompt}
            className={`composer-form ${isDragOver ? 'composer-form-dragover' : ''}`}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(event) => void handleDrop(event)}
          >
            <textarea
              ref={composerRef}
              className="composer"
              value={composer}
              onChange={(event) => setComposer(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              onPaste={(event) => void handleComposerPaste(event)}
              placeholder="Ask for code, architecture, debugging, or reviews..."
              rows={5}
            />
            <div className="template-row">
              {PROMPT_TEMPLATES.map((template) => (
                <button
                  key={template.label}
                  type="button"
                  className="template-chip template-chip-small"
                  onClick={() => applyTemplate(template.prompt)}
                >
                  {template.label}
                </button>
              ))}
            </div>
            <div className="composer-actions">
              <button type="submit" className="primary-button" disabled={isSending}>
                Send
              </button>
              <button type="button" className="secondary-button" onClick={() => replayLastPrompt('edit')}>
                Edit last
              </button>
              <button type="button" className="danger-button" onClick={stopGeneration} disabled={!isSending}>
                Stop
              </button>
            </div>
          </form>

          <input
            ref={fileInputRef}
            hidden
            type="file"
            multiple
            accept=".txt,.log,.md,.json,.js,.ts,.tsx,.py,.go,.rs,.html,.css,.yaml,.yml,.sh"
            onChange={(event) => void handleFileInputChange(event)}
          />
        </section>
      </main>

      {showSettings ? (
        <div className="modal-shell" onClick={() => setShowSettings(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Settings</h2>
                <p>API base, model preference, and generation behavior.</p>
              </div>
              <button type="button" className="ghost-button" onClick={() => setShowSettings(false)}>
                Close
              </button>
            </div>

            <div className="settings-grid">
              <label>
                <span>API Base</span>
                <input
                  value={draftSettings.apiBase}
                  onChange={(event) =>
                    setDraftSettings((current) => ({ ...current, apiBase: event.target.value }))
                  }
                />
              </label>

              <label>
                <span>Model</span>
                <select
                  value={draftSettings.selectedModel}
                  onChange={(event) =>
                    setDraftSettings((current) => ({ ...current, selectedModel: event.target.value }))
                  }
                >
                  <option value="">Auto detect</option>
                  {availableModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Temperature</span>
                <input
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={draftSettings.temperature}
                  onChange={(event) =>
                    setDraftSettings((current) => ({ ...current, temperature: Number(event.target.value) }))
                  }
                />
              </label>

              <label>
                <span>Top P</span>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={draftSettings.topP}
                  onChange={(event) =>
                    setDraftSettings((current) => ({ ...current, topP: Number(event.target.value) }))
                  }
                />
              </label>

              <label>
                <span>Max Tokens</span>
                <input
                  type="number"
                  min="64"
                  max="4096"
                  step="64"
                  value={draftSettings.maxTokens}
                  onChange={(event) =>
                    setDraftSettings((current) => ({ ...current, maxTokens: Number(event.target.value) }))
                  }
                />
              </label>

              <label>
                <span>Stream</span>
                <select
                  value={String(draftSettings.stream)}
                  onChange={(event) =>
                    setDraftSettings((current) => ({ ...current, stream: event.target.value === 'true' }))
                  }
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setDraftSettings(defaultSettings())}>
                Reset
              </button>
              <button type="button" className="primary-button" onClick={saveSettings}>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
