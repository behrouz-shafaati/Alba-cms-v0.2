import { describe, it, expect } from 'vitest'
import { getDictionary, getDir } from '@/lib/i18n/index'

describe('i18n', () => {
  it('should load dictionaries correctly', () => {
    const faDict = getDictionary('fa')
    expect(faDict.language).toBe('فارسی')

    const enDict = getDictionary('en')
    expect(enDict.language).toBe('English')
  })

  it('should return correct direction', () => {
    expect(getDir('fa')).toBe('rtl')
    expect(getDir('en')).toBe('ltr')
  })
})
