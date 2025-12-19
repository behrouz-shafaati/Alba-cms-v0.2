import fs from 'fs'
import path from 'path'

export interface AppConfig {
  locale: 'fa' | 'en'
  db: {
    uri: string
  }
  admin: {
    email: string
  }
}

const CONFIG_PATH = path.join(process.cwd(), 'config/app.config.json')

export function readConfig(): AppConfig | null {
  if (!fs.existsSync(CONFIG_PATH)) return null
  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
  return JSON.parse(raw) as AppConfig
}

export function writeConfig(config: AppConfig) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))
}
