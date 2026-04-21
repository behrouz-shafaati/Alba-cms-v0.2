import mongoose, { model, Schema } from 'mongoose'
import { TaxonomySchema } from './interface'

const TaxonomyTranslationSchema = new Schema(
  {
    locale: { type: String, required: true }, // "fa", "en", "de", ...
    title: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { _id: false },
)

const taxonomySchema = new Schema<TaxonomySchema>(
  {
    // 🎯 نوع taxonomy
    type: {
      type: String,
      enum: [
        'category',
        'tag',
        'product_cat',
        'product_tag',
        'brand',
        'attribute',
      ],
      required: true,
      index: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'taxonomy',
      default: null,
    },
    ancestors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'taxonomy',
      },
    ], // مسیر کامل به ریشه
    level: { type: Number, default: 0 }, // عمق: 0, 1, 2, ...
    slug: { type: String, required: true },
    translations: [TaxonomyTranslationSchema], // 👈 لیست ترجمه‌ها
    image: { type: Schema.Types.ObjectId, ref: 'file' },
    icon: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    // متادیتا
    // 🔧 متادیتا با Schema.Types.Mixed
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    count: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// ==================== Indexes ====================

// Unique slug per type (فقط برای غیر حذف شده‌ها)
// Partial Unique Index
taxonomySchema.index(
  { type: 1, slug: 1 },
  {
    unique: true,
    partialFilterExpression: { deleted: false },
  },
)

taxonomySchema.index({ type: 1, parent: 1 })
taxonomySchema.index({ type: 1, status: 1 })
taxonomySchema.index({ ancestors: 1 })
taxonomySchema.index({ 'translations.title': 1 })

// ==================== Middlewares ====================

// جلوگیری از parent بودن خودش
taxonomySchema.pre('save', function () {
  if (this.parent?.toString() === this._id?.toString()) {
    throw new Error('A taxonomy cannot be its own parent.')
  }
})

taxonomySchema
  .pre('save', function () {
    if (this.parent?.toString() === this._id?.toString()) {
      throw new Error('A taxonomy cannot be its own parent.')
    }
  })
  .pre(['findOne', 'find'], function () {
    this.populate({
      path: 'parent',
      select: '_id id translations.title translations.locale slug',
    })
    this.populate('image')
    this.where({ deleted: false })
  })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

taxonomySchema.set('toObject', {
  transform,
})

taxonomySchema.set('toJSON', {
  transform,
})
export default mongoose.models.taxonomy ||
  model<TaxonomySchema>('taxonomy', taxonomySchema)
