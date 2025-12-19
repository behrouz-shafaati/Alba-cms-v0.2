import { describe, it, expect, beforeEach } from 'vitest'
import {
  writeState,
  resetState,
  isInstallComplete,
  readState,
} from '@/lib/install/state'

describe('Installer flow', () => {
  beforeEach(() => resetState())

  it('should reset if installation incomplete', () => {
    writeState({ language: { done: true } })
    expect(isInstallComplete(readState())).toBe(false)
    resetState()
    expect(readState()).toBeNull()
  })

  it('should mark complete if all steps done', () => {
    writeState({
      language: { done: true },
      database: { done: true },
      admin: { done: true },
    })
    expect(isInstallComplete(readState())).toBe(true)
  })
})
