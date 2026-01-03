// lib/installer/getStepFromPath.ts
import { InstallStepKey } from './installStepsOrder'

export function getStepFromPath(pathname: string): InstallStepKey | null {
  if (pathname.includes('/install/language')) return 'dashboard_lang'
  if (pathname.includes('/install/database')) return 'db'
  if (pathname.includes('/install/admin')) return 'admin'
  if (pathname.includes('/install/locales')) return 'locales'
  if (pathname.includes('/install/finish')) return 'finish'
  return null
}
