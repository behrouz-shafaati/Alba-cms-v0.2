import fs from 'fs'
import path from 'path'

export interface AppConfig {
  db: {
    uri: string
  }
  admin: {
    email: string
  }
  language: {
    siteDefault?: string
    dashboardDefault?: string
  }
  jwt: { secret: string }
}

const CONFIG_DIR = path.join(process.cwd(), 'config')
const CONFIG_PATH = path.join(CONFIG_DIR, 'app.config.json')

/**
 * Read config safely
 */
export function readConfig(): Partial<AppConfig> {
  if (!fs.existsSync(CONFIG_PATH)) return {}

  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
  return JSON.parse(raw) as Partial<AppConfig>
}

/**
 * Write config with merge
 */
export function writeConfig(patch: Partial<AppConfig>) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true })
  }

  const prev = readConfig()

  const nextConfig: Partial<AppConfig> = {
    ...prev,
    ...patch,
    db: {
      ...prev.db,
      ...patch.db,
    },
    admin: {
      ...prev.admin,
      ...patch.admin,
    },
    language: {
      ...prev.language,
      ...patch.language,
    },
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(nextConfig, null, 2), 'utf-8')
}
