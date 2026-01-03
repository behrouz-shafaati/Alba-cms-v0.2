export type InstallStepKey =
  | 'dashboard_lang'
  | 'db'
  | 'admin'
  | 'locales'
  | 'finish'

export const INSTALL_STEPS_ORDER: InstallStepKey[] = [
  'dashboard_lang',
  'db',
  'admin',
  'locales',
  'finish',
]
