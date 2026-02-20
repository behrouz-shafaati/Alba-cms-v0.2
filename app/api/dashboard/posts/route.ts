import { NextResponse } from 'next/server'
import postCtrl from '@/lib/features/post/controller'
import parseQuery from '@/lib/utils/parseQuery'

export async function GET(req: Request) {
  try {
    console.log('#2340238974 =========== in find post api')
    const query = parseQuery(req)

    const postResult = await postCtrl.find(query)
    console.log('#23 postResult: ', postResult)
    return NextResponse.json(postResult)
  } catch (err) {
    console.error('Error fetching comments:', err)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 },
    )
  }
}
