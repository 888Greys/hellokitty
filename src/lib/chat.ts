export const APP_TITLE = 'Command Deck'
export const DEFAULT_TEMPERATURE = 0.6
export const DEFAULT_TOP_P = 0.95
export const DEFAULT_MAX_TOKENS = 1024
export const DEFAULT_STREAM = false
export const DEFAULT_PROFILE = 'engineer' as const
export const DEFAULT_RESPONSE_STYLE = 'engineer' as const

export type AssistantProfile = 'engineer' | 'reviewer' | 'debugger'
export type ResponseStyle = 'concise' | 'engineer' | 'deep'

const PROFILE_PROMPTS: Record<AssistantProfile, string> = {
  engineer:
    'You are a principal software engineer with 30 years of experience shipping production systems. Be direct, technically rigorous, and practical. Only suggest approaches that are likely to work in the real world. If something is risky, brittle, or incomplete, say so plainly and give the workable path instead.',
  reviewer:
    'You are a senior code reviewer with 30 years of experience. Prioritize correctness, regressions, missing tests, and operational risk. Call out what will break, why, and the minimal fix that will actually hold up in production.',
  debugger:
    'You are a senior debugging and incident-response engineer with 30 years of experience. Isolate the likely failure mode quickly, use concrete evidence, and prioritize the shortest path to a real fix over theory.',
}

const STYLE_PROMPTS: Record<ResponseStyle, string> = {
  concise:
    'Keep answers short. Prefer direct prose. Use bullets only when they materially improve clarity.',
  engineer:
    'Use concise prose by default, but use Markdown when it improves clarity: short headings, bullets, numbered steps, bold for key decisions, and fenced code blocks for code.',
  deep:
    'Go deeper on tradeoffs, failure modes, and implementation details. Use clear sections, bullet lists, and concrete examples when they help.',
}

export const DEFAULT_SYSTEM_PROMPT = buildSystemPrompt(DEFAULT_PROFILE, DEFAULT_RESPONSE_STYLE)

const PREVIOUS_DEFAULT_SYSTEM_PROMPTS = new Set([
  'You are a pragmatic coding assistant. Answer directly and clearly. Use normal prose by default.',
])

export type ChatRole = 'system' | 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

export type ChatSession = {
  id: string
  title: string
  updatedAt: number
  pinned?: boolean
  profile?: AssistantProfile
  responseStyle?: ResponseStyle
  messages: ChatMessage[]
}

export type ChatSettings = {
  apiBase: string
  selectedModel: string
  temperature: number
  topP: number
  maxTokens: number
  stream: boolean
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: createId(),
    role,
    content,
  }
}

export function buildSystemPrompt(profile: AssistantProfile, responseStyle: ResponseStyle) {
  return `${PROFILE_PROMPTS[profile]} ${STYLE_PROMPTS[responseStyle]} Avoid hype, filler, and made-up details.`
}

export function createInitialSession(
  systemPrompt: string,
  options: Partial<Pick<ChatSession, 'profile' | 'responseStyle' | 'pinned'>> = {},
): ChatSession {
  return {
    id: createId(),
    title: 'New Chat',
    updatedAt: Date.now(),
    pinned: options.pinned ?? false,
    profile: options.profile ?? DEFAULT_PROFILE,
    responseStyle: options.responseStyle ?? DEFAULT_RESPONSE_STYLE,
    messages: [createMessage('system', systemPrompt)],
  }
}

export function isLegacyArchitectPrompt(content: string) {
  const normalized = content.toLowerCase()
  return (
    normalized.includes('architect-prime') ||
    normalized.includes('phase 1: the blueprint') ||
    normalized.includes('high-performance, live prototype')
  )
}

export function sanitizeSession(session: ChatSession, systemPrompt: string): ChatSession {
  const firstMessage = session.messages[0]
  const profile = session.profile ?? DEFAULT_PROFILE
  const responseStyle = session.responseStyle ?? DEFAULT_RESPONSE_STYLE
  const nextSystemPrompt = buildSystemPrompt(profile, responseStyle)

  if (firstMessage?.role !== 'system') {
    return {
      ...session,
      pinned: session.pinned ?? false,
      profile,
      responseStyle,
      messages: [createMessage('system', nextSystemPrompt), ...session.messages],
    }
  }

  if (!isLegacyArchitectPrompt(firstMessage.content)) {
    if (!PREVIOUS_DEFAULT_SYSTEM_PROMPTS.has(firstMessage.content)) {
      return {
        ...session,
        pinned: session.pinned ?? false,
        profile,
        responseStyle,
      }
    }

    return {
      ...session,
      pinned: session.pinned ?? false,
      profile,
      responseStyle,
      messages: [createMessage('system', systemPrompt), ...session.messages.slice(1)],
    }
  }

  return {
    ...session,
    title: 'New Chat',
    updatedAt: Date.now(),
    pinned: session.pinned ?? false,
    profile,
    responseStyle,
    messages: [createMessage('system', nextSystemPrompt)],
  }
}

export function sanitizeSessions(sessions: ChatSession[], systemPrompt: string) {
  return sessions.map((session) => sanitizeSession(session, systemPrompt))
}

export function buildSessionTitle(input: string) {
  return input.trim().replace(/\s+/g, ' ').slice(0, 44) || 'New Chat'
}

export function isVagueAssistantReply(content: string) {
  const normalized = content.toLowerCase()
  return (
    normalized.includes('it depends') ||
    normalized.includes('could be') ||
    normalized.includes('might want to') ||
    normalized.includes('one option') ||
    normalized.includes('for example') ||
    normalized.includes('you can consider')
  )
}

export function normalizeApiBase(input?: string) {
  const fallback = makeDefaultApiBase()
  if (!input?.trim()) return fallback
  return input.trim().replace(/\/+$/, '')
}

export function makeDefaultApiBase() {
  return 'https://badztmaruintel.breachbase.lol/v1'
}

export function chooseModel(preferred: string, models: string[]) {
  if (preferred && models.includes(preferred)) {
    return preferred
  }
  return models[0] ?? ''
}

export function buildChatPayload(
  messages: ChatMessage[],
  model: string,
  temperature: number,
  topP: number,
  maxTokens: number,
  stream: boolean,
) {
  return {
    model,
    messages: messages.map(({ role, content }) => ({ role, content })),
    temperature,
    top_p: topP,
    max_tokens: maxTokens,
    stream,
  }
}

export function estimateTokens(messages: ChatMessage[]) {
  const text = messages.map((message) => message.content).join(' ')
  return Math.ceil(text.length / 4)
}

export function formatTime(value: number) {
  return new Date(value).toLocaleString(undefined, {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
