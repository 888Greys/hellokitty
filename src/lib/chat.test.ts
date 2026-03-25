import { describe, expect, it } from 'vitest'
import {
  buildChatPayload,
  chooseModel,
  createInitialSession,
  createMessage,
  isLegacyArchitectPrompt,
  normalizeApiBase,
  sanitizeSessions,
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

  it('detects the legacy architect prompt', () => {
    expect(isLegacyArchitectPrompt('### SYSTEM ROLE: ARCHITECT-PRIME')).toBe(true)
    expect(isLegacyArchitectPrompt('normal assistant prompt')).toBe(false)
  })

  it('resets legacy sessions to the current default system prompt', () => {
    const sessions = [
      {
        id: '1',
        title: 'Old Session',
        updatedAt: 1,
        messages: [
          createMessage('system', '### SYSTEM ROLE: ARCHITECT-PRIME'),
          createMessage('user', 'hello'),
          createMessage('assistant', 'PHASE 1: THE BLUEPRINT'),
        ],
      },
    ]

    const sanitized = sanitizeSessions(sessions, 'clean prompt')
    expect(sanitized[0]?.title).toBe('New Chat')
    expect(sanitized[0]?.messages).toHaveLength(1)
    expect(sanitized[0]?.messages[0]?.content).toBe('clean prompt')
  })
})
