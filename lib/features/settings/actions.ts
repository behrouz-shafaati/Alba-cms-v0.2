'use server'

import { getSettings } from './controller'
import { GetSessingsProps, Settings } from './interface'

export async function getSettingsAction({
  key = '',
  lang = '',
}: GetSessingsProps = {}): Promise<Settings> {
  return getSettings({ key, lang })
}
