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
  if (cached!.conn) {
    return cached!.conn
  }

  console.log('☢️ MongoDB connection MONGO_URI')
  const MONGO_URI = readConfig()?.db?.uri
  if (!MONGO_URI) {
    console.log('🟥 MongoDB connection string is missing')
    throw new Error('MongoDB connection string is missing')
  }

  if (!cached!.promise) {
    console.log('🔴 try connect mongo db')
    cached!.promise = mongoose.connect(MONGO_URI as string).then((m) => m) // ⬅️ m = Mongoose connection
  }

  cached!.conn = await cached!.promise
  return cached!.conn
}
