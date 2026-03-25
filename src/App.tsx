import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  APP_TITLE,
  DEFAULT_MAX_TOKENS,
  DEFAULT_STREAM,
  DEFAULT_SYSTEM_PROMPT,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  buildChatPayload,
  chooseModel,
  createInitialSession,
  createMessage,
  estimateTokens,
  formatTime,
  makeDefaultApiBase,
  normalizeApiBase,
  sanitizeSessions,
  type ChatSession,
  type ChatSettings,
} from './lib/chat'

const SETTINGS_KEY = 'bb.chat.settings.v2'
const SESSIONS_KEY = 'bb.chat.sessions.v2'

type StatusTone = 'ready' | 'busy' | 'error' | 'warn'

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

function App() {
  const [settings, setSettings] = useState<ChatSettings>(() => loadSettings())
  const [draftSettings, setDraftSettings] = useState<ChatSettings>(() => loadSettings())
  const [sessions, setSessions] = useState<ChatSession[]>(() => loadSessions())
  const [activeSessionId, setActiveSessionId] = useState<string>(() => loadSessions()[0]?.id ?? '')
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [composer, setComposer] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [status, setStatus] = useState<RuntimeStatus>({ label: 'Ready', tone: 'ready' })
  const [errorText, setErrorText] = useState('')
  const [needsLogin, setNeedsLogin] = useState(false)
  const [activeModel, setActiveModel] = useState(settings.selectedModel)
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? sessions[0],
    [activeSessionId, sessions],
  )

  const contextEstimate = useMemo(() => {
    if (!activeSession) return 0
    return estimateTokens(activeSession.messages)
  }, [activeSession])

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
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [sessions, activeSessionId])

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

  function updateSession(mutator: (session: ChatSession) => ChatSession) {
    setSessions((current) =>
      current.map((session) => (session.id === activeSessionId ? mutator(session) : session)),
    )
  }

  function handleNewChat() {
    const next = createInitialSession(DEFAULT_SYSTEM_PROMPT)
    setSessions((current) => [next, ...current])
    setActiveSessionId(next.id)
    setComposer('')
    setErrorText('')
    setStatus({ label: 'Ready', tone: 'ready' })
  }

  function handleClearContext() {
    updateSession((session) => ({
      ...session,
      title: 'New Chat',
      updatedAt: Date.now(),
      messages: [createMessage('system', DEFAULT_SYSTEM_PROMPT)],
    }))
    setStatus({ label: 'Context Cleared', tone: 'ready' })
    setErrorText('')
  }

  function applyAssistantContent(content: string, titleSeed?: string) {
    updateSession((session) => {
      const messages = [...session.messages]
      const last = messages[messages.length - 1]
      if (last?.role === 'assistant') {
        last.content = content
      }

      const title =
        session.title === 'New Chat' && titleSeed ? titleSeed.slice(0, 44).trim() || session.title : session.title

      return {
        ...session,
        title,
        updatedAt: Date.now(),
        messages,
      }
    })
  }

  async function sendPrompt(event?: FormEvent) {
    event?.preventDefault()
    if (!composer.trim() || !activeSession || isSending) return

    const userText = composer.trim()
    const assistantPlaceholder = createMessage('assistant', '')
    const userMessage = createMessage('user', userText)
    const titleSeed = userText

    setComposer('')
    setErrorText('')
    setStatus({ label: settings.stream ? 'Thinking / Streaming' : 'Thinking', tone: 'busy' })
    setIsSending(true)

    updateSession((session) => ({
      ...session,
      updatedAt: Date.now(),
      messages: [...session.messages, userMessage, assistantPlaceholder],
    }))

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
          setErrorText('')
          return
        }
      }

      if (!response.ok) {
        const message = await response.text()
        throw new Error(`HTTP ${response.status}: ${message}`)
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

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payloadLine = line.slice(6).trim()
          if (payloadLine === '[DONE]') continue
          try {
            const data = JSON.parse(payloadLine) as {
              choices?: Array<{ delta?: { content?: string } }>
            }
            const token = data.choices?.[0]?.delta?.content ?? ''
            if (!token) continue
            fullText += token
            applyAssistantContent(fullText, titleSeed)
          } catch {
            // ignore fragmented SSE lines
          }
        }
      }

      setStatus({ label: 'Ready', tone: 'ready' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed'
      const statusCode = (error as RequestError | undefined)?.status
      setNeedsLogin(statusCode === 401)
      applyAssistantContent(`Error: ${message}`, titleSeed)
      setErrorText(message)
      setStatus({ label: 'Connection Error', tone: 'error' })
    } finally {
      abortRef.current = null
      setIsSending(false)
    }
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
        <div className="brand-card">
          <div className="brand-kicker">Local Control Surface</div>
          <h1>{APP_TITLE}</h1>
          <p>Desktop Vite client for your gated vLLM stack.</p>
        </div>

        <button className="primary-button" type="button" onClick={handleNewChat}>
          New Chat
        </button>
        <button className="secondary-button" type="button" onClick={handleClearContext}>
          Clear Context
        </button>

        <div className="session-list">
          {sessions
            .slice()
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((session) => (
              <button
                key={session.id}
                type="button"
                className={`session-card ${session.id === activeSession?.id ? 'session-card-active' : ''}`}
                onClick={() => setActiveSessionId(session.id)}
              >
                <span className="session-title">{session.title}</span>
                <span className="session-time">{formatTime(session.updatedAt)}</span>
              </button>
            ))}
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className={`status-pill ${statusClass}`}>{status.label}</div>
          <div className="topbar-meta">
            <span>
              Model: <strong>{activeModel || 'Auto detect'}</strong>
            </span>
            <span>
              Context: <strong>{contextEstimate}</strong> / 8192 est.
            </span>
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
                    setStatus({ label: 'Models Refreshed', tone: 'ready' })
                  })
                  .catch((error: RequestError) => {
                    if (error.status === 401) {
                      setNeedsLogin(true)
                      setErrorText(error.message)
                      setStatus({ label: 'Login Required', tone: 'warn' })
                      return
                    }
                    setErrorText(error.message)
                    setStatus({ label: 'Model Refresh Failed', tone: 'error' })
                  })
              }}
            >
              Refresh Models
            </button>
          </div>
        </header>

        <section className="chat-panel" ref={scrollRef}>
          {activeSession?.messages
            .filter((message) => message.role !== 'system')
            .map((message) => (
              <article
                key={message.id}
                className={`message-card ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
              >
                <div className="message-role">{message.role === 'user' ? 'User' : 'Assistant'}</div>
                {message.role === 'assistant' ? (
                  <div className="markdown-body">
                    <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                  </div>
                ) : (
                  <div className="message-plain">{message.content}</div>
                )}
              </article>
            ))}
        </section>

        {errorText ? (
          <div className="error-banner">
            <span>{errorText}</span>
            {needsLogin ? (
              <button type="button" className="ghost-button error-action" onClick={openHostedLogin}>
                Open Login Page
              </button>
            ) : null}
          </div>
        ) : null}

        <section className="composer-panel">
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

          <form onSubmit={sendPrompt}>
            <textarea
              className="composer"
              value={composer}
              onChange={(event) => setComposer(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder="Ask for code, architecture, debugging, or reviews..."
              rows={5}
            />
            <div className="composer-actions">
              <button type="submit" className="primary-button" disabled={isSending}>
                Send
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  const lastUser = [...(activeSession?.messages ?? [])].reverse().find((item) => item.role === 'user')
                  if (lastUser) setComposer(lastUser.content)
                }}
              >
                Retry Last
              </button>
              <button type="button" className="danger-button" onClick={stopGeneration} disabled={!isSending}>
                Stop
              </button>
            </div>
          </form>
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
