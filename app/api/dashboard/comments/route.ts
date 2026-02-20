import { NextResponse } from 'next/server'
import postCommentCtrl from '@/lib/features/post-comment/controller'
import parseQuery from '@/lib/utils/parseQuery'

export async function GET(req: Request) {
  try {
    const query = parseQuery(req)
    const commentsResult = await postCommentCtrl.find(query, false)
    return NextResponse.json(commentsResult)
  } catch (err) {
    console.error('Error fetching comments:', err)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 },
    )
  }
}
