import { InstallStepKey } from './installStepsOrder'

export function segmentToStep(segment: string): InstallStepKey | null {
  switch (segment) {
    case 'language':
      return 'dashboard_lang'
    case 'db':
      return 'db'
    case 'admin':
      return 'admin'
    case 'locales':
      return 'locales'
    case 'finish':
      return 'finish'
    default:
      return null
  }
}
