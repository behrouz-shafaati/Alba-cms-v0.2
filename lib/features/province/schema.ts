import mongoose, { model, Schema } from 'mongoose'
import { ProvinceSchema } from './interface'

const provinceSchema = new Schema<ProvinceSchema>(
  {
    countryId: {
      type: Schema.Types.ObjectId,
      ref: 'country',
      required: true,
    },
    name: { type: String, required: true },
    slug: { type: String, default: '' },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
  return ret
}

provinceSchema.set('toObject', { transform })

provinceSchema.set('toJSON', { transform })
export default mongoose.models?.province ||
  model<ProvinceSchema>('province', provinceSchema)
