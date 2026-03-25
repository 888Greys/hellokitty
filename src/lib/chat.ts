export const APP_TITLE = 'Command Deck'
export const DEFAULT_TEMPERATURE = 0.6
export const DEFAULT_TOP_P = 0.95
export const DEFAULT_MAX_TOKENS = 1024
export const DEFAULT_STREAM = true
export const DEFAULT_SYSTEM_PROMPT =
  'You are a pragmatic coding assistant. Answer directly and clearly. Use normal prose by default.'

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

export function createInitialSession(systemPrompt: string): ChatSession {
  return {
    id: createId(),
    title: 'New Chat',
    updatedAt: Date.now(),
    messages: [createMessage('system', systemPrompt)],
  }
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
