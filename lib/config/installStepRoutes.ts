import { InstallStepKey } from './installStepsOrder'

export const INSTALL_STEP_ROUTES: Record<InstallStepKey, string> = {
  dashboard_lang: '/install/language',
  db: '/install/database',
  admin: '/install/admin',
  locales: '/install/locales',
  finish: '/install/finish',
}
