import mongoose, { model, Schema } from 'mongoose'
import { PostCommentSchema } from './interface'

const PostCommentTranslationSchema = new Schema(
  {
    locale: { type: String, required: true }, // "fa", "en", "de", ...
    excerpt: { type: String, default: '' },
    contentJson: { type: String, default: '' },
    readingTime: { type: Number, default: 0 },
  },
  { _id: false },
)

const postCommentSchema = new Schema<PostCommentSchema>(
  {
    // =================> populate with post field make unfiniti loop
    post: {
      type: Schema.Types.ObjectId,
      ref: 'post',
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'postComment',
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
    },
    authorName: { type: String, default: null },
    locale: { type: String, required: true },
    translations: [PostCommentTranslationSchema], // 👈 لیست ترجمه‌ها
    type: {
      type: String,
      enum: ['comment', 'question'],
      default: 'comment',
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

postCommentSchema.pre(['findOne', 'find', 'findOneAndUpdate'], function () {
  this.populate('author')
  this.populate({
    path: 'post',
    select: 'id href slug translations', // فقط translations رو بیار
    transform: (doc: any) => {
      if (!doc) return doc
      doc = doc.toObject()

      // 🔻 محدود کردن محتوای translations
      doc.translations = (doc?.translations || []).map((t: any) => ({
        locale: t.locale,
        title: t.title,
      }))

      return doc
    },
  })
})

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

postCommentSchema.set('toObject', {
  transform,
})

postCommentSchema.set('toJSON', {
  transform,
})
export default mongoose.models.postComment ||
  model<PostCommentSchema>('postComment', postCommentSchema)
