import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const protectedPaths = ['/dashboard', '/editor', '/posts', '/templates', '/ideas', '/analytics', '/media', '/profile', '/settings', '/categories']
const authPaths = ['/login', '/register', '/forgot-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('session')?.value

  const isProtected = protectedPaths.some(p => pathname.startsWith(p))
  const isAuth = authPaths.some(p => pathname.startsWith(p))

  if (isProtected) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    try {
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'writespace-fallback-secret')
      await jwtVerify(sessionCookie, secret)
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (isAuth && sessionCookie) {
    try {
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'writespace-fallback-secret')
      await jwtVerify(sessionCookie, secret)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch {
      // Invalid token, let them access auth pages
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*', '/editor/:path*', '/posts/:path*', '/templates/:path*',
    '/ideas/:path*', '/analytics/:path*', '/media/:path*', '/profile/:path*',
    '/settings/:path*', '/categories/:path*', '/login', '/register', '/forgot-password'
  ]
}
