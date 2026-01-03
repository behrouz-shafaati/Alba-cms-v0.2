import { getSettings } from '@/lib/features/settings/controller'
import { Settings } from '@/lib/features/settings/interface'
import nodemailer from 'nodemailer'
import getTranslation from '../utils/getTranslation'

export async function sendEmail(to: string, subject: string, html: string) {
  const settings: Settings = (await getSettings()) as Settings
  const siteInfo = getTranslation({
    translations: settings?.general?.translations || [],
  })
  console.log('#234 Email settings:', settings?.email)
  const transporter = nodemailer.createTransport({
    host: settings?.email?.mail_host,
    port: Number(settings?.email?.mail_port),
    secure: false, // اگر 465 استفاده می‌کنی true باشه
    auth: {
      user: settings?.email?.mail_username,
      pass: settings?.email?.mail_password,
    },
  })
  try {
    const info = await transporter.sendMail({
      from: `${siteInfo?.site_title} <${settings?.email?.mail_username}>`,
      to,
      subject,
      html,
    })
    console.log('#2655 send Email info', info)
    console.log('Email sent: %s', info.messageId)
    return info
  } catch (error) {
    console.error('Email send error:', error)
    throw new Error('ارسال ایمیل با مشکل مواجه شد')
  }
}
