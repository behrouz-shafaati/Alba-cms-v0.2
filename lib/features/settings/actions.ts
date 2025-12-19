'use server'

import { getSettings } from './controller'
import { SettingsKey } from './interface'

export async function getSettingsAction(key: SettingsKey = '') {
  return getSettings(key)
}
