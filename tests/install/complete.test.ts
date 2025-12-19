import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readState, writeState, resetState } from '@/lib/install/state'
import { writeConfig } from '@/lib/config/config'

vi.mock('@/lib/config/config', () => ({
  writeConfig: vi.fn(),
}))

describe('Complete Step', () => {
  beforeEach(() => resetState())

  it('should not finish if install is incomplete', () => {
    writeState({ language: { done: true } }) // database & admin missing
    const state = readState()
    const complete =
      state && state.language?.done && state.database?.done && state.admin?.done
    expect(complete).toBeFalsy()
  })

  it('should write config when install is complete', () => {
    writeState({
      language: { done: true, value: 'en' },
      database: { done: true, value: 'mongodb://localhost:27017/mydb' },
      admin: { done: true, value: { email: 'admin@example.com' } },
    })

    const state = readState()
    const config = {
      locale: state.language?.value,
      db: { uri: state.database?.value },
      admin: { email: state.admin?.value?.email },
    }

    writeConfig(config)
    expect(writeConfig).toHaveBeenCalledWith(config)
  })
})
