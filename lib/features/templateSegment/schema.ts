import mongoose, { model, Schema } from 'mongoose'
import { TemplateSegmentSchema } from './interface'

const TemplateSegmentTranslationSchema = new Schema(
  {
    locale: { type: String, required: true }, // "fa", "en", "de", ...
    title: { type: String, required: true },
    content: {
      type: Schema.Types.Mixed, // whole page structure as JSON
      required: true,
    },
  },
  { _id: false },
)

const templateSegmentSchema = new Schema<TemplateSegmentSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    status: {
      type: String,
      enum: ['deactive', 'active'],
      default: 'active',
    },
    translations: [TemplateSegmentTranslationSchema], // 👈 لیست ترجمه‌ها
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// templateSegmentSchema
//   .pre('findOne', function (next: any) {
//     this.populate('user')
//     next()
//   })
//   .pre('find', function (next: any) {
//     this.populate('user')
//     next()
//   })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

templateSegmentSchema.set('toObject', {
  transform,
})

templateSegmentSchema.set('toJSON', {
  transform,
})
export default mongoose.models.templateSegment ||
  model<TemplateSegmentSchema>('templateSegment', templateSegmentSchema)
