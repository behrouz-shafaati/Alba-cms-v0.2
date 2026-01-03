import 'server-only'
import { unstable_cache } from 'next/cache'
import fs from 'fs/promises'
import path from 'path'

type AppConfig = {
  jwt?: {
    secret?: string
  }
}

const CONFIG_DIR = path.join(process.cwd(), 'config')
const CONFIG_PATH = path.join(CONFIG_DIR, 'app.config.json')

const loadJwtSecret = async (): Promise<string> => {
  const file = await fs.readFile(CONFIG_PATH, 'utf-8')
  const config: AppConfig = JSON.parse(file)

  const secret = config.jwt?.secret

  if (!secret || secret.trim().length === 0) {
    throw new Error('JWT secret is missing or empty')
  }

  return secret
}

/**
 * Cached ONLY if secret exists
 */
export const getJwtSecret = unstable_cache(
  async () => {
    // اگر اینجا خطا بده → هیچ چیزی cache نمی‌شود
    return loadJwtSecret()
  },
  ['jwt-secret'],
  {
    revalidate: false,
  }
)
