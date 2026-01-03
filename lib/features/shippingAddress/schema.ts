import mongoose, { model, Schema } from 'mongoose'
import { ShippingAddressSchema } from './interface'

const shippingAddressSchema = new Schema<ShippingAddressSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
    },
    name: { type: String, required: true },
    companyName: { type: String, default: '' },
    countryId: {
      type: Schema.Types.ObjectId,
      ref: 'country',
      default: null,
    },
    provinceId: {
      type: Schema.Types.ObjectId,
      ref: 'province',
      default: null,
    },
    cityId: {
      type: Schema.Types.ObjectId,
      ref: 'city',
      default: null,
    },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    email: { type: String, default: '' },
    mobile: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

shippingAddressSchema
  .pre('findOne', function () {
    this.populate('countryId provinceId cityId')
  })
  .pre('find', function () {
    this.populate('countryId provinceId cityId')
  })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id.toHexString()

  ret.country = ret.countryId
  ret.province = ret.provinceId
  ret.city = ret.cityId
  ret.countryId = ret.countryId.id
  ret.provinceId = ret.provinceId.id
  ret.cityId = ret.cityId.id

  delete ret._id
  delete ret.__v
  return ret
}

shippingAddressSchema.set('toObject', { transform })

shippingAddressSchema.set('toJSON', { transform })
export default mongoose.models?.shippingAddress ||
  model<ShippingAddressSchema>('shippingAddress', shippingAddressSchema)
