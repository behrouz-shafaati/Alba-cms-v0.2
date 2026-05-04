import mongoose, { model, Schema } from 'mongoose'
import { TemplateSchema } from './interface'

const TemplateTranslationSchema = new Schema(
  {
    locale: { type: String, required: true }, // "fa", "en", "de", ...
    title: { type: String, required: true },
    content: {
      type: Schema.Types.Mixed, // whole page structure as JSON
      required: true,
    },
    description: { type: String, default: '' },
  },
  { _id: false },
)

const templateSchema = new Schema<TemplateSchema>(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'template',
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    templateFor: [{ type: String, required: false, unique: false }],
    status: {
      type: String,
      enum: ['deactive', 'active'],
      default: 'active',
    },
    translations: [TemplateTranslationSchema], // 👈 لیست ترجمه‌ها
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

templateSchema.set('toObject', {
  transform,
})

templateSchema.set('toJSON', {
  transform,
})
export default mongoose.models.Template ||
  model<TemplateSchema>('Template', templateSchema)
