export interface InstallState {
  language?: { done: boolean; value?: string }
  database?: { done: boolean; value?: string }
  admin?: { done: boolean; value?: { email: string } }
}

// حافظه سریع برای Edge Runtime
let cachedState: InstallState | null = null

/** خواندن state نصب */
export function readState(): InstallState | null {
  if (cachedState) return cachedState

  try {
    // اگر Node Runtime است، می‌توانیم از فایل استفاده کنیم
    if (
      typeof process !== 'undefined' &&
      process.env.NODE_ENV !== 'production'
    ) {
      const fs = require('fs')
      const path = require('path')
      const STATE_PATH = path.join(process.cwd(), 'config/install.state.json')
      if (fs.existsSync(STATE_PATH)) {
        cachedState = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'))
        return cachedState
      }
    }
  } catch {
    // ignore، fallback به cachedState
  }

  // اگر فایل موجود نیست یا Edge Runtime → یک state خالی
  cachedState = {}
  return cachedState
}

/** نوشتن state نصب */
export function writeState(state: Partial<InstallState>) {
  cachedState = { ...cachedState, ...state }

  try {
    const fs = require('fs')
    const path = require('path')
    const STATE_PATH = path.join(process.cwd(), 'config/install.state.json')
    fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true })
    fs.writeFileSync(STATE_PATH, JSON.stringify(cachedState, null, 2))
  } catch {
    // اگر Edge Runtime است → فقط در حافظه نگه داشته شود
  }
}

/** پاک کردن state نصب */
export function resetState() {
  cachedState = {}
}
