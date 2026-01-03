import fs from 'fs'
import path from 'path'
import { InstallStepKey } from './installStepsOrder'

const CONFIG_DIR = path.join(process.cwd(), 'config')
const CONFIG_PATH = path.join(CONFIG_DIR, 'app.config.json')

export function resolveInstallStep(): InstallStepKey {
  if (!fs.existsSync(CONFIG_PATH)) {
    return 'dashboard_lang'
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))

  if (!config.language?.dashboardDefault) return 'dashboard_lang'
  if (!config.db?.uri) return 'db'
  if (!config.admin?.email) return 'admin'
  if (!config.language?.siteDefault || !config.jwt?.secret) return 'locales'

  return 'finish'
}
