import ObjectID from 'bson-objectid'

export default function objectId(): string {
  return ObjectID().toHexString()
}
