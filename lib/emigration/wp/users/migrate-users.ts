/**
 * کلاس اصلی مهاجرت کاربران
 * src/lib/migration/user-migration.ts
 */

import { WPClient, WPUser, createWPClient } from '../wp-client'
import {
  MigrationOptions,
  UserMigrationResult,
  MigrationRunResult,
  WP_ROLE_MAP,
  DEFAULT_ROLE,
  MigrationStats,
} from '../interface'
import crypto from 'crypto'
import { User } from '@/lib/features/user/interface'
import wpEmigrationCtrl from '../controller'
import userCtrl from '@/lib/features/user/controller'

// تنظیمات پیش‌فرض
const DEFAULT_OPTIONS: MigrationOptions = {
  batchSize: 100,
  concurrency: 5,
  dryRun: false,
  verbose: false,
  maxRetries: 3,
  skipExisting: true,
}

export class UserMigration {
  private wpClient: WPClient
  private logService: typeof wpEmigrationCtrl
  private options: MigrationOptions
  private logger: (message: string) => void

  constructor(
    connectionData: { baseUrl: string; apiKey: string },
    options: Partial<MigrationOptions> = {},
  ) {
    this.wpClient = createWPClient(connectionData)
    this.logService = wpEmigrationCtrl
    this.logService.setEntityType('user')
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.logger = this.options.verbose ? console.log : () => {} // No-op if not verbose
  }

  /**
   * تولید پسورد رندوم امن
   */
  private generateSecurePassword(length: number = 32): string {
    return crypto.randomBytes(length).toString('base64').slice(0, length)
  }

  /**
   * نگاشت نقش‌های وردپرس به نقش‌های جدید
   */
  private mapRoles(wpRoles: string[]): string[] {
    const mappedRoles = new Set<string>()

    wpRoles.forEach((role) => {
      const mapped = WP_ROLE_MAP[role.toLowerCase()]
      if (mapped) {
        mapped.forEach((r) => mappedRoles.add(r))
      }
    })

    // اگر هیچ نقشی نگاشت نشد، نقش پیش‌فرض
    if (mappedRoles.size === 0) {
      mappedRoles.add(DEFAULT_ROLE)
    }

    return Array.from(mappedRoles)
  }

  /**
   * ساخت metadata برای لاگ
   */
  private buildMetadata(wpUser: WPUser): any {
    return {
      userName: wpUser.userName?.toLowerCase(),
      email: wpUser.email?.toLowerCase(),
      firstName: wpUser.firstName || undefined,
      lastName: wpUser.lastName || undefined,
      mobile: wpUser.mobile || undefined,
      roles: wpUser.roles,
    }
  }

  /**
   * تبدیل کاربر WP به فرمت MongoDB
   */
  private transformUser(wpUser: WPUser): Partial<User> {
    // ترکیب نام کامل
    const fullName =
      [wpUser.firstName, wpUser.lastName].filter(Boolean).join(' ').trim() ||
      wpUser.displayName ||
      wpUser.userName

    const translations = [
      {
        locale: this.options.locale, // "fa", "en", "de", ...
        firstName: wpUser.firstName || null,
        lastName: wpUser.lastName || null,
      },
    ]

    return {
      email: wpUser.email.toLowerCase(),
      userName: wpUser.userName.toLowerCase(),
      password: this.generateSecurePassword(),
      passwordNeedsReset: true,
      translations,
      fullName:
        fullName ||
        `${wpUser.firstName} ${wpUser.lastName}` ||
        wpUser.email.toLowerCase() ||
        null,
      mobile: wpUser.mobile || null,
      roles: this.mapRoles(wpUser.roles),
      active: true,
      isVerified: true, // کاربران قدیمی تأیید شده در نظر گرفته می‌شوند
      metadata: { wpId: wpUser.wpId }, // ذخیره ID اصلی برای مراجعات بعدی
      createdAt: new Date(wpUser.registeredAt),
      updatedAt: new Date(),
    }
  }

  /**
   * بررسی وجود کاربر در MongoDB
   */
  private async checkExistingUser(
    wpUser: WPUser,
  ): Promise<{ exists: boolean; mongoId?: string; reason?: string }> {
    // بررسی با email
    const byEmail = await userCtrl.findOne({
      filters: { email: wpUser.email.toLowerCase() },
    })
    if (byEmail) {
      return {
        exists: true,
        mongoId: byEmail?.id.toString(),
        reason: 'email duplicate',
      }
    }

    // بررسی با userName
    const byUserName = await userCtrl.findOne({
      filters: { userName: wpUser.userName.toLowerCase() },
    })
    if (byUserName) {
      return {
        exists: true,
        mongoId: byUserName?.id.toString(),
        reason: 'userName duplicate',
      }
    }

    // بررسی با wpId (اگر قبلاً منتقل شده)
    const byWpId = await userCtrl.findOne({
      filters: { 'metadata.wpId': wpUser.wpId },
    })
    if (byWpId) {
      return {
        exists: true,
        mongoId: byWpId?.id.toString(),
        reason: 'wpId duplicate',
      }
    }

    return { exists: false }
  }

  /**
   * مهاجرت یک کاربر
   */
  private async migrateOneUser(wpUser: WPUser): Promise<UserMigrationResult> {
    const metadata = this.buildMetadata(wpUser)

    try {
      // بررسی وجود قبلی
      if (this.options.skipExisting) {
        const existing = await this.checkExistingUser(wpUser)
        if (existing.exists) {
          await this.logService.logSkipped(
            wpUser.wpId,
            existing.reason || 'already exists',
            metadata,
          )
          return {
            wpId: wpUser.wpId,
            status: 'skipped',
            mongoId: existing.mongoId,
            skippedReason: existing.reason,
          }
        }
      }

      // Dry Run - فقط لاگ کن
      if (this.options.dryRun) {
        this.logger(`[DRY RUN] Would migrate: ${wpUser.email}`)
        return {
          wpId: wpUser.wpId,
          status: 'success',
          mongoId: 'dry-run-id',
        }
      }

      // تبدیل و ذخیره
      const userData = this.transformUser(wpUser)
      const newUser = await userCtrl.create({ params: userData })

      const mongoId = newUser.id.toString()
      await this.logService.logSuccess(wpUser.wpId, mongoId, metadata)

      this.logger(`✓ Migrated: ${wpUser.email} -> ${mongoId}`)

      return {
        wpId: wpUser.wpId,
        status: 'success',
        mongoId,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      await this.logService.logFailure(wpUser.wpId, errorMessage, metadata)

      this.logger(`✗ Failed: ${wpUser.email} - ${errorMessage}`)

      return {
        wpId: wpUser.wpId,
        status: 'failed',
        error: errorMessage,
      }
    }
  }

  /**
   * شروع مهاجرت کامل
   */
  async startMigration(): Promise<MigrationRunResult> {
    const startedAt = new Date()
    const errors: Array<{ wpId: number; error: string }> = []
    let processed = 0
    let success = 0
    let failed = 0
    let skipped = 0

    this.logger('🚀 شروع مهاجرت کاربران...')
    this.logger(`تنظیمات: ${JSON.stringify(this.options, null, 2)}`)

    try {
      // ۱. دریافت همه ID ها از وردپرس
      this.logger('📋 دریافت لیست کاربران از وردپرس...')
      const allWpIds = await this.wpClient.getAllUserIds()
      this.logger(`تعداد کل کاربران در وردپرس: ${allWpIds.length}`)

      // ۲. فیلتر کردن موارد pending و failed
      const alreadySuccess = await this.logService.getIdMapping()
      const pendingIds = allWpIds.filter((id) => !alreadySuccess.has(id))

      // اضافه کردن failed ها برای retry
      const failedIds = await this.logService.getFailedWpIds(
        this.options.maxRetries,
      )
      const idsToProcess = [...new Set([...pendingIds, ...failedIds])]

      this.logger(`کاربران برای پردازش: ${idsToProcess.length}`)
      this.logger(`  - جدید: ${pendingIds.length}`)
      this.logger(`  - Retry: ${failedIds.length}`)

      if (idsToProcess.length === 0) {
        this.logger('✅ همه کاربران قبلاً منتقل شده‌اند!')
        return this.buildResult(
          startedAt,
          processed,
          success,
          failed,
          skipped,
          errors,
        )
      }

      // ۳. پردازش batch به batch
      for (let i = 0; i < idsToProcess.length; i += this.options.batchSize) {
        const batchIds = idsToProcess.slice(i, i + this.options.batchSize)
        const batchNumber = Math.floor(i / this.options.batchSize) + 1
        const totalBatches = Math.ceil(
          idsToProcess.length / this.options.batchSize,
        )

        this.logger(
          `\n📦 Batch ${batchNumber}/${totalBatches} (${batchIds.length} کاربر)`,
        )

        // دریافت اطلاعات کاربران از WP
        const wpUsersMap = await this.wpClient.getUsersBatch(
          batchIds,
          this.options.concurrency,
          (completed, total) => {
            if (this.options.verbose) {
              process.stdout.write(`\r  دریافت از WP: ${completed}/${total}`)
            }
          },
        )

        if (this.options.verbose) {
          console.log('') // New line after progress
        }

        // پردازش هر کاربر
        for (const [wpId, userOrError] of wpUsersMap) {
          if (userOrError instanceof Error) {
            // خطا در دریافت از WP
            await this.logService.logFailure(wpId, userOrError.message)
            errors.push({ wpId, error: userOrError.message })
            failed++
          } else {
            // مهاجرت کاربر
            const result = await this.migrateOneUser(userOrError)

            if (result.status === 'success') {
              success++
            } else if (result.status === 'failed') {
              failed++
              if (result.error) {
                errors.push({ wpId, error: result.error })
              }
            } else if (result.status === 'skipped') {
              skipped++
            }
          }
          processed++
        }

        // نمایش پیشرفت
        const progress = Math.round((processed / idsToProcess.length) * 100)
        this.logger(
          `  پیشرفت: ${progress}% | ✓ ${success} | ✗ ${failed} | ⊘ ${skipped}`,
        )
      }
    } catch (error) {
      this.logger(
        `❌ خطای کلی: ${error instanceof Error ? error.message : String(error)}`,
      )
      throw error
    }

    const result = this.buildResult(
      startedAt,
      processed,
      success,
      failed,
      skipped,
      errors,
    )
    this.logger('\n' + this.formatResult(result))

    return result
  }

  /**
   * فقط retry موارد failed
   */
  async retryFailed(): Promise<MigrationRunResult> {
    const startedAt = new Date()
    const errors: Array<{ wpId: number; error: string }> = []
    let processed = 0
    let success = 0
    let failed = 0
    let skipped = 0

    this.logger('🔄 شروع Retry موارد Failed...')

    const failedItems = await this.logService.getFailedWithDetails(
      this.options.maxRetries,
    )
    this.logger(`تعداد موارد برای Retry: ${failedItems.length}`)

    if (failedItems.length === 0) {
      this.logger('✅ موردی برای Retry وجود ندارد!')
      return this.buildResult(startedAt, 0, 0, 0, 0, [])
    }

    const wpIds = failedItems.map((f) => f.wpId)

    // دریافت اطلاعات کاربران از WP
    const wpUsersMap = await this.wpClient.getUsersBatch(
      wpIds,
      this.options.concurrency,
    )

    for (const [wpId, userOrError] of wpUsersMap) {
      if (userOrError instanceof Error) {
        await this.logService.logFailure(wpId, userOrError.message)
        errors.push({ wpId, error: userOrError.message })
        failed++
      } else {
        const result = await this.migrateOneUser(userOrError)

        if (result.status === 'success') {
          success++
        } else if (result.status === 'failed') {
          failed++
          if (result.error) {
            errors.push({ wpId, error: result.error })
          }
        } else if (result.status === 'skipped') {
          skipped++
        }
      }
      processed++
    }

    const result = this.buildResult(
      startedAt,
      processed,
      success,
      failed,
      skipped,
      errors,
    )
    this.logger('\n' + this.formatResult(result))

    return result
  }

  /**
   * دریافت آمار فعلی
   */
  async getStats(): Promise<MigrationStats> {
    return this.logService.getStats()
  }

  /**
   * تست اتصال به WP
   */
  async testConnection(): Promise<{
    success: boolean
    message: string
    userCount?: number
  }> {
    return this.wpClient.testConnection()
  }

  /**
   * ساخت نتیجه
   */
  private buildResult(
    startedAt: Date,
    processed: number,
    success: number,
    failed: number,
    skipped: number,
    errors: Array<{ wpId: number; error: string }>,
  ): MigrationRunResult {
    const finishedAt = new Date()
    return {
      startedAt,
      finishedAt,
      duration: finishedAt.getTime() - startedAt.getTime(),
      processed,
      success,
      failed,
      skipped,
      errors: errors.slice(0, 100), // حداکثر ۱۰۰ خطا
    }
  }

  /**
   * فرمت نتیجه برای نمایش
   */
  private formatResult(result: MigrationRunResult): string {
    const duration = Math.round(result.duration / 1000)
    const successRate =
      result.processed > 0
        ? Math.round((result.success / result.processed) * 100)
        : 0

    return `
═══════════════════════════════════════════
  📊 نتیجه مهاجرت کاربران
═══════════════════════════════════════════
  ⏱️  مدت زمان: ${duration} ثانیه
  📦 پردازش شده: ${result.processed}
  ✅ موفق: ${result.success} (${successRate}%)
  ❌ ناموفق: ${result.failed}
  ⊘ رد شده: ${result.skipped}
═══════════════════════════════════════════
    `.trim()
  }
}

// ✅ Export factory function
export function createUserMigration(
  connectionData: { baseUrl: string; apiKey: string },
  options?: Partial<MigrationOptions>,
): UserMigration {
  return new UserMigration(connectionData, options)
}
