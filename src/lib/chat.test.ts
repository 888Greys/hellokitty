import { describe, expect, it } from 'vitest'
import {
  buildChatPayload,
  chooseModel,
  createInitialSession,
  normalizeApiBase,
} from './chat'

describe('chat helpers', () => {
  it('normalizes api base by trimming trailing slash', () => {
    expect(normalizeApiBase('https://example.com/v1/')).toBe('https://example.com/v1')
  })

  it('prefers a saved model only when it still exists', () => {
    expect(chooseModel('b', ['a', 'b', 'c'])).toBe('b')
    expect(chooseModel('stale', ['a', 'b'])).toBe('a')
  })

  it('creates sessions with a system prompt', () => {
    const session = createInitialSession('system prompt')
    expect(session.messages).toHaveLength(1)
    expect(session.messages[0]?.role).toBe('system')
  })

  it('builds chat payload with openai-compatible fields', () => {
    const session = createInitialSession('system prompt')
    const payload = buildChatPayload(session.messages, 'model-1', 0.6, 0.9, 512, true)
    expect(payload.model).toBe('model-1')
    expect(payload.stream).toBe(true)
    expect(payload.messages[0]).toEqual({ role: 'system', content: 'system prompt' })
  })
})
