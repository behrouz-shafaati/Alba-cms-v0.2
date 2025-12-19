import { describe, it, expect, vi, beforeEach } from 'vitest'
import { writeState, resetState, readState } from '@/lib/install/state'
import { User } from '@/lib/db/models/user'

vi.mock('@/lib/db/models/user', () => ({
  User: { create: vi.fn().mockResolvedValue(true) },
}))

describe('Admin Step', () => {
  beforeEach(() => resetState())

  it('should mark admin step done after creating user', async () => {
    // شبیه‌سازی Server Action
    const email = 'admin@example.com'
    const password = 'secret123'
    await User.create({ email, password })
    writeState({ admin: { done: true } })

    const state = readState()
    expect(state.admin?.done).toBe(true)
  })
})
