import { getSettings } from '@/lib/features/settings/controller'
import { Settings } from '@/lib/features/settings/interface'
import axios from 'axios'

export async function sendSmsVerifyFarazSms(to: string, code: string) {
  const settings: Settings = (await getSettings()) as Settings
  try {
    const base_url = `https://edge.ippanel.com/v1`
    const from_number = settings?.sms?.farazsms?.from_number || ''
    const patternCode = settings?.sms?.farazsms?.verifyPatternCode || ''
    const apiKey = settings?.sms?.farazsms?.apiKey || ''
    const response = await axios.post(
      `${base_url}/api/send`,
      {
        sending_type: 'pattern',
        from_number, // شماره فرستنده خدماتی
        code: patternCode, // کد الگو که در پنل ساخته‌ای
        recipients: [to], // شماره گیرنده
        // مقادیر جایگزینی در الگو
        params: {
          code: code,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${apiKey}`,
        },
      }
    )

    return { success: true, message: 'پیامک با موفقیت ارسال شد' }
  } catch (error: any) {
    console.error('❌ SMS Send Error:', error.response?.data || error.message)
    return { success: false, message: 'ارسال پیامک با مشکل مواجه شد' }
  }
}
