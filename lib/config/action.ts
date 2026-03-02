'use server'

import mongoose from 'mongoose'
import { AppConfig, writeConfig } from './config'
import { env } from 'node:process'

type checkVariablesResult = {
  dbConnection: boolean
  jwtSecret: boolean
}

export async function checkVariablesAction(): Promise<checkVariablesResult> {
  const dbConnection = await ckechDbConnection()
  const jwtSecret =
    env?.JWT_SECRET != '' &&
    env?.JWT_SECRET != null &&
    env?.JWT_SECRET != undefined
  return {
    dbConnection,
    jwtSecret,
  }
}

async function ckechDbConnection() {
  try {
    // جلوگیری از reuse کانکشن‌های قبلی
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }

    await mongoose.connect(env.DB_URI, {
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
  // ⛔️ Cannot create files in the cloud
  writeConfig(config)
}
