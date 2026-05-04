import mongoose, { model, Schema } from 'mongoose'
import { FormSchema } from './interface'

const FieldSchema = new Schema(
  {
    name: { type: String, required: true }, // name فیلد در HTML
    type: {
      type: String,
      enum: [
        'text',
        'email',
        'textarea',
        'select',
        'checkbox',
        'radio',
        'number',
        'date',
      ],
      required: true,
    },
    options: [String], // برای select یا radio
    required: { type: Boolean, default: false },
    label: String,
    placeholder: String,
    description: String,
    defaultValue: String,
  },
  { _id: false },
)
const FormTranslationSchema = new Schema(
  {
    locale: { type: String, required: true }, // "fa", "en", "de", ...
    title: { type: String, required: true },
    content: {
      type: Schema.Types.Mixed, // whole form structure as JSON
      required: true,
    },
    fields: [FieldSchema],
    successMessage: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false },
)

const formSchema = new Schema<FormSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    translations: [FormTranslationSchema],
    status: {
      type: String,
      enum: ['deactive', 'active'],
      default: 'active',
    },
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

formSchema.set('toObject', {
  transform,
})

formSchema.set('toJSON', {
  transform,
})
export default mongoose.models.Form || model<FormSchema>('Form', formSchema)
