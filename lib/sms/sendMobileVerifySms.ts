import { sendSmsVerifyFarazSms } from './farazSms'

export async function sendMobileVerifySms(
  to: string,
  code: string
): Promise<{ success: boolean; mesage: string }> {
  // console.log('#======================> (to, code):', to, ' - ', code)
  return sendSmsVerifyFarazSms(to, code)
}
