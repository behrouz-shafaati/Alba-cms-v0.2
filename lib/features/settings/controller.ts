import { Update } from '@/lib/features/core/interface'
import metadataController from '@/lib/features/metadata/controller'
import getTranslation from '@/lib/utils/getTranslation'
import getCachedSettings from './cachedSettings'
import { revalidateTag } from 'next/cache'
import { GetSessingsProps, Settings, SettingsKey } from './interface'

class controller extends metadataController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the settingsController class extended of the main parent class baseController.
   *
   *
   *settingsCtrl
   * @beta
   */
  constructor() {
    super('setting')
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != 'object') return {}
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value != 'string') continue
      if (
        key == 'userName' ||
        key == 'fullName' ||
        key == 'email' ||
        key == 'mobile'
      )
        filters[key] = { $regex: new RegExp(value, 'i') }
      if (key == 'query' && filters?.query == '') {
        delete filters.query
      } else if (key == 'query') {
        filters.$expr = {
          $regexMatch: {
            input: {
              $concat: ['$title', '$content'],
            },
            regex: filters.query,
            options: 'i',
          },
        }
        delete filters.query
      }

      if (key == 'id') {
        filters._id = value
        delete filters.id
      }
    }
    return filters
  }

  async findOneAndUpdate(payload: Update) {
    const r = await super.findOneAndUpdate(payload)
    revalidateTag('site-settings', 'max')
  }
}

const settingsCtrl = new controller()
export default settingsCtrl

/**
 * Fetch site settings and return either the full settings object
 * or a specific value by key.
 *
 * @param {string} [key=''] - The key of the setting to retrieve.
 * If omitted or empty, the full settings object is returned.
 * @returns {Promise<Record<string, unknown> | unknown | null>}
 * - If no key is provided, returns the full settings object.
 * - If a key is provided, returns the value for that key or null if not found.
 */
export const getSettings = async ({
  key = '',
  lang = '',
}: GetSessingsProps = {}): Promise<
  Record<string, unknown> | unknown | null | Settings
> => {
  const settings: Settings = await getCachedSettings()

  if (!key) {
    return settings
  }

  const siteInfo = getTranslation({
    translations: settings?.general?.translations || [],
    lang,
  })
  const _settings = { ...settings, ...siteInfo }
  return Object.prototype.hasOwnProperty.call(_settings, key)
    ? _settings[key]
    : null
}
