import { createWPTaxonomyClient, WPTaxonomyClient } from './wp-taxonomy-client'
import wpEmigrationCtrl from '../controller'
import {
  MigrationOptions,
  MigrationRunResult,
  WpTaxonomy,
  WPUser,
} from '../interface'
import taxonomyController from '@/lib/features/taxonomy/controller'
import {
  Taxonomy,
  TaxonomyType,
  WpTaxonomyType,
} from '@/lib/features/taxonomy/interface'
import { WPImageMigrationHelper } from '@/lib/html-to-tiptap/helpers/ImageMigrationHelper'
import { HtmlToTiptapConverter } from '@/lib/html-to-tiptap/HtmlToTiptapConverter'

// تنظیمات پیش‌فرض
const DEFAULT_OPTIONS: MigrationOptions = {
  batchSize: 100,
  concurrency: 5,
  dryRun: false,
  verbose: false,
  maxRetries: 3,
  skipExisting: true,
}

type TaxonomyItem = {
  id: number
  parent: number | null
}

export default class TaxonomyMigration {
  private wpClient: WPTaxonomyClient
  private logService: typeof wpEmigrationCtrl

  private options: MigrationOptions
  private logger: (message: string) => void

  constructor(
    connectionData: { baseUrl: string; apiKey: string },
    options: MigrationOptions,
  ) {
    this.wpClient = createWPTaxonomyClient(connectionData)
    this.logService = wpEmigrationCtrl
    this.logService.setEntityType('taxonomy')
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.logger = this.options.verbose ? console.log : () => {} // No-op if not verbose
  }

  sortHierarchically(items: TaxonomyItem[]): TaxonomyItem[] {
    const addedIds = new Set<number>()

    function add(parentId: number | null): TaxonomyItem[] {
      return items
        .filter((item) => item.parent === parentId && !addedIds.has(item.id))
        .flatMap((item) => {
          addedIds.add(item.id)
          return [item, ...add(item.id)]
        })
    }

    return add(null)
  }

  async startMigration() {
    const startedAt = new Date()
    const errors: Array<{ wpId: number; error: string }> = []
    let processed = 0
    let success = 0
    let failed = 0
    let skipped = 0

    this.logger('🚀 شروع مهاجرت taxonomies...')
    this.logger(`تنظیمات: ${JSON.stringify(this.options, null, 2)}`)

    // ۱. دریافت همه ID ها از وردپرس
    this.logger('📋 دریافت لیست تاکسونومی از وردپرس...')
    let allWpTaxonomies =
      (await this.wpClient.getTaxonomyIds()) as TaxonomyItem[]
    allWpTaxonomies = this.sortHierarchically(allWpTaxonomies)
    console.log('#2394ss876 allWpTaxonomies :', allWpTaxonomies)
    const allWpIds = allWpTaxonomies.map((taxonomy) => Number(taxonomy.id)) //استخراج ids
    console.log('#2394876 allWpIds :', allWpIds)
    this.logger(`تعداد کل تاکسونومی در وردپرس: ${allWpIds.length}`)

    // اگر داخل logService‌ نباشد یعنی هیچ تلاشی برای دریافت آن انجام نشده
    this.logger(`فیلتر تاکسونومی‌های منتقل شده یا در حال پردازش...`)
    // ۲. فیلتر کردن موارد pending و failed
    const alreadySuccess = await this.logService.getIdMapping()
    const pendingIds = allWpIds.filter((id) => !alreadySuccess.has(id))

    // اضافه کردن failed ها برای retry
    const failedIds = await this.logService.getFailedWpIds(
      this.options.maxRetries,
    )

    const idsToProcess = [...new Set([...pendingIds, ...failedIds])]

    this.logger(`تاکسونومی‌ها برای پردازش: ${idsToProcess.length}`)
    this.logger(`  - جدید: ${pendingIds.length}`)
    this.logger(`  - Retry: ${failedIds.length}`)

    if (idsToProcess.length === 0) {
      this.logger('✅ همه تاکسونومی‌ها قبلاً منتقل شده‌اند!')
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

      // دریافت اطلاعات تاکسونومی‌ها از WP
      const wpTaxonomiesMap = await this.wpClient.getBatch(
        batchIds,
        'taxonomies',
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

      // پردازش هر تاکسونومی
      for (const [wpId, taxonomyOrError] of wpTaxonomiesMap) {
        if (taxonomyOrError instanceof Error) {
          // خطا در دریافت از WP
          await this.logService.logFailure(wpId, taxonomyOrError.message)
          errors.push({ wpId, error: taxonomyOrError.message })
          failed++
        } else {
          // مهاجرت تاکسونومی
          console.log(
            `start taxonomy migrate with id ${taxonomyOrError?.wpId} and type ${taxonomyOrError?.taxonomy}`,
          )
          const result = await this.migrateOneTaxonomy(taxonomyOrError)

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
    }

    const result = this.buildResult(
      startedAt,
      processed,
      success,
      failed,
      skipped,
      errors,
    )
    this.logger(cvsresult)

    return result
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

  mapToAlbaTaxonomyType(wpTaxonomyType: WpTaxonomyType): TaxonomyType {
    const mapping: Record<WpTaxonomyType, TaxonomyType> = {
      category: 'category',
      post_tag: 'tag',
      product_cat: 'product_cat',
      product_tag: 'product_tag',
      brand: 'brand',
      attribute: 'attribute',
    }

    return mapping[wpTaxonomyType]
  }

  /**
   * بررسی وجود taxonomy در MongoDB
   */
  private async checkExisting(
    wpTaxonomy: WPUser,
  ): Promise<{ exists: boolean; mongoId?: string; reason?: string }> {
    const taxonomyCtrl = new taxonomyController(
      this.mapToAlbaTaxonomyType(wpTaxonomy.taxonomy),
    )
    // بررسی با slug
    const slug = wpTaxonomy.slug.toLowerCase()
    const bySlug = await taxonomyCtrl.findOne({
      filters: { slug },
    })
    if (bySlug) {
      console.log(
        `#234908 taxonomy with wpId ${wpTaxonomy.wpId} have duplicate slug ${slug}`,
      )
      return {
        exists: true,
        mongoId: bySlug?.id.toString(),
        reason: 'slug duplicate',
      }
    }

    // بررسی با wpId (اگر قبلاً منتقل شده)
    const byWpId = await taxonomyCtrl.findOne({
      filters: { 'metadata.wpId': wpTaxonomy.wpId },
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
   * تبدیل کاربر WP به فرمت MongoDB
   */
  // example input :
  //  {"wpId":17,"name":"agri","slug":"/acriculture","taxonomy":"product_cat","description":"","parent":null,"ancestors":[],"children":[],"count":2,"meta":{"order":["0"],"product_count_product_cat":["2"]},"link":"http://localhost/jewellery/product-category/%d8%af%d8%b3%d8%aa-%d8%a8%d9%86%d8%af/"}
  private async transformTaxonomy(
    wpTaxonomy: WpTaxonomy,
  ): Promise<Partial<Taxonomy | null>> {
    const taxonomyType = this.mapToAlbaTaxonomyType(wpTaxonomy.taxonomy)
    let parentId = null
    if (wpTaxonomy.parent) {
      const taxonomyCtrl = new taxonomyController(taxonomyType)
      const parentResult = await taxonomyCtrl.findOne({
        filters: {
          type: taxonomyType,
          'metadata.wpId': wpTaxonomy.parent,
        },
      })
      if (!parentResult) return null
      parentId = parentResult.id
    }
    const imageMigeration = new WPImageMigrationHelper()
    const HtmlToTiptapjsonConverter = new HtmlToTiptapConverter({
      defaultDir: 'rtl',
      logErrors: true,
      skipImages: false,
      imageMigrationHelper: imageMigeration,
    })
    let description = {}
    const convertResult = await HtmlToTiptapjsonConverter.convert(
      wpTaxonomy.description,
    )
    console.log('#8876 convert taxonomy description result:', convertResult)
    if (convertResult?.success) description = convertResult.document
    return {
      type: taxonomyType,
      parent: parentId,
      ancestors: [],
      level: 0,
      slug: decodeURI(wpTaxonomy.slug),
      translations: {
        locale: this.options.locale,
        title: wpTaxonomy.name,
        description: JSON.stringify(description),
      },
      // image: wpTaxonomy.thumbnail,
      icon: '',
      status: 'active',
      user: null,
      metadata: { wpId: wpTaxonomy.wpId }, // ذخیره ID اصلی برای مراجعات بعدی
      count: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  /**
   * مهاجرت یک تاکسونومی
   */
  private async migrateOneTaxonomy(
    wpTaxonomy: WPUser,
  ): Promise<MigrationResult> {
    //   const metadata = this.buildMetadata(wpTaxonomy)
    const metadata = wpTaxonomy
    let newTaxonomy
    try {
      // بررسی وجود قبلی
      if (this.options.skipExisting) {
        const existing = await this.checkExisting(wpTaxonomy)
        if (existing.exists) {
          await this.logService.logSkipped(
            wpTaxonomy.wpId,
            existing.reason || 'already exists',
            wpTaxonomy,
          )

          const result = {
            wpId: wpTaxonomy.wpId,
            status: 'skipped',
            mongoId: existing.mongoId,
            skippedReason: existing.reason,
          }
          console.log('234987 result:', result)
          return result
        }
      }

      // Dry Run - فقط لاگ کن
      if (this.options.dryRun) {
        this.logger(`[DRY RUN] Would migrate: ${wpTaxonomy.slug}`)
        return {
          wpId: wpTaxonomy.wpId,
          status: 'success',
          mongoId: 'dry-run-id',
        }
      }

      // تبدیل و ذخیره
      const taxonomyCtrl = new taxonomyController(
        this.mapToAlbaTaxonomyType(wpTaxonomy.taxonomy),
      )
      const taxonomyData = await this.transformTaxonomy(wpTaxonomy)
      console.log(
        `#88 transformed wpTaxonomy with id ${wpTaxonomy.wpId} =`,
        wpTaxonomy,
      )
      if (taxonomyData?.parent !== undefined) {
        newTaxonomy = await taxonomyCtrl.create({ params: taxonomyData })

        const mongoId = newTaxonomy.id.toString()
        await this.logService.logSuccess(wpTaxonomy.wpId, mongoId, metadata)

        this.logger(`✓ Migrated: ${newTaxonomy.slug} -> ${mongoId}`)

        return {
          wpId: wpTaxonomy.wpId,
          status: 'success',
          mongoId,
        }
      } else {
        console.log('#2349867 -->Parent of ', taxonomyData)
        console.log('#88 wpTaxonomy=', wpTaxonomy)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      await this.logService.logFailure(
        newTaxonomy?.wpId,
        errorMessage,
        metadata,
      )

      this.logger(`✗ Failed: ${newTaxonomy.slug} - ${errorMessage}`)

      return {
        wpId: newTaxonomy.wpId,
        status: 'failed',
        error: errorMessage,
      }
    }
  }
}
