import { describe, it, expect, beforeEach } from 'vitest'
import {
  writeState,
  readState,
  resetState,
  isInstallComplete,
} from '@/lib/install/state'
import fs from 'fs'
import path from 'path'

const STATE_PATH = path.join(process.cwd(), 'config/install.state.json')

describe('install state helpers', () => {
  beforeEach(() => {
    resetState()
  })

  it('should write and read state correctly', () => {
    writeState({ language: { done: true, value: 'fa' } })
    const state = readState()
    expect(state.language.done).toBe(true)
    expect(state.language.value).toBe('fa')
  })

  it('should detect complete installation', () => {
    writeState({
      language: { done: true },
      database: { done: true },
      admin: { done: true },
    })
    const state = readState()
    expect(isInstallComplete(state)).toBe(true)
  })

  it('should return false if installation incomplete', () => {
    writeState({ language: { done: true }, database: { done: true } })
    const state = readState()
    expect(isInstallComplete(state)).toBe(false)
  })
})
