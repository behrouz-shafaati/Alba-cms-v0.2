import mongoose, { model, Schema } from 'mongoose'
import { CountrySchema } from './interface'

const countrySchema = new Schema<CountrySchema>(
  {
    name: {
      type: String,
      required: true,
    },
    name_fa: { type: String, default: '' },
    code: { type: String, default: '' },
    image: { type: Schema.Types.ObjectId, ref: 'file' },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

countrySchema.pre(['find', 'findOne'], function () {
  this.populate('image')
})

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
  return ret
}

countrySchema.set('toObject', { transform })

countrySchema.set('toJSON', { transform })
export default mongoose.models?.country ||
  model<CountrySchema>('country', countrySchema)
