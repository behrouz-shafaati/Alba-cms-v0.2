import { describe, it, expect, vi } from 'vitest'
import mongoose from 'mongoose'
import { connectMongo } from '@/lib/db/mongoose'

// Mock کردن mongoose connect
vi.mock('mongoose', () => {
  const actual = vi.importActual('mongoose')
  return {
    ...actual,
    connect: vi.fn().mockResolvedValue(true),
    connection: { close: vi.fn() },
  }
})

describe('MongoDB connection', () => {
  it('should connect using singleton', async () => {
    const client = await connectMongo()
    expect(mongoose.connect).toHaveBeenCalled()
    expect(client).toBeTruthy()
  })
})
