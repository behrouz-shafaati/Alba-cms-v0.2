import mongoose, { type Mongoose } from 'mongoose'
import { readConfig } from '@/lib/config/config'

type MongooseCache = {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export default async function dbConnect(): Promise<Mongoose> {
  const MONGO_URI = readConfig()?.db?.uri
  if (!MONGO_URI) {
    throw new Error('MongoDB connection string is missing')
  }

  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGO_URI as string).then((m) => m) // ⬅️ m = Mongoose connection
  }

  cached!.conn = await cached!.promise
  return cached!.conn
}
