'use server'

import mongoose from 'mongoose'
import { AppConfig, writeConfig } from './config'
import z from 'zod'

export async function checkConnectionAction(uri: string): Promise<boolean> {
  if (!uri || typeof uri !== 'string') return false

  try {
    // جلوگیری از reuse کانکشن‌های قبلی
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000, // fail fast
      connectTimeoutMS: 3000,
    })

    // ping ساده برای اطمینان
    await mongoose.connection.db.admin().ping()

    return true
  } catch (error) {
    console.error('[MONGOOSE CONNECTION ERROR]', error)
    return false
  } finally {
    // installer نباید کانکشن باز نگه دارد
    try {
      await mongoose.disconnect()
    } catch {}
  }
}

export async function writeConfigAction(config: Partial<AppConfig>) {
  writeConfig(config)
}
