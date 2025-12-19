import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const isInstalled = process.env.APP_INSTALLED === 'true'
  if (!isInstalled) {
    const pathname = request.nextUrl.pathname
    console.log('#234 pathname:', pathname)
    if (pathname.startsWith('/install')) {
      return NextResponse.next()
    }
    const instalUrl = new URL('/install/language', request.url)
    return NextResponse.redirect(instalUrl)
  }

  // اجازه ادامه مسیر
  return NextResponse.next()
}

// مسیرهایی که middleware اعمال شود
export const config = {
  matcher: ['/dashboard/:path*'],
}

// export function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname

//   if (!pathname.startsWith('/dashboard')) {
//     return NextResponse.next()
//   }

//   const session = request.cookies.get('session')?.value

//   if (!session) {
//     const loginUrl = new URL('/login', request.url)
//     loginUrl.searchParams.set('callbackUrl', pathname)
//     return NextResponse.redirect(loginUrl)
//   }

//   return NextResponse.next()
// }
