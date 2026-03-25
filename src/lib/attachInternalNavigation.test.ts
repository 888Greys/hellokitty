import { describe, expect, it } from 'vitest'
import { isInternalHref } from './attachInternalNavigation'

describe('isInternalHref', () => {
  it('returns true for app-relative paths', () => {
    expect(isInternalHref('/auth')).toBe(true)
    expect(isInternalHref('/register/admin')).toBe(true)
  })

  it('returns false for in-page anchors', () => {
    expect(isInternalHref('#features')).toBe(false)
  })

  it('returns false for external URLs', () => {
    expect(isInternalHref('https://example.com')).toBe(false)
  })
})
