'use server'

import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const CONFIG_DIR = path.join(process.cwd(), 'config')
const CONFIG_PATH = path.join(CONFIG_DIR, 'app.config.json')

export async function generateAndSaveJwtSecret() {
  // 1️⃣ تولید JWT_SECRET امن
  const jwtSecret = crypto.randomBytes(48).toString('hex')

  let config: Record<string, any> = {}

  // 2️⃣ اگر فایل config وجود دارد، بخوان
  try {
    const existing = await fs.readFile(CONFIG_PATH, 'utf-8')
    config = JSON.parse(existing)
    if (config.jwt?.secret) {
      return { success: true }
    }
  } catch (err) {
    // اگر فایل وجود نداشت، مشکلی نیست
    config = {}
  }

  // 3️⃣ ست کردن مقدار JWT
  config.jwt = {
    ...(config.jwt || {}),
    secret: jwtSecret,
  }

  // 4️⃣ ذخیره فایل
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')

  return {
    success: true,
    jwtSecret,
  }
}
