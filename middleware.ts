import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // COMPLETELY BYPASS ALL CHECKS IN DEVELOPMENT MODE
  if (process.env.NODE_ENV === "development") {
    console.log(`DEV MODE: Bypassing ALL auth checks in middleware for: ${req.nextUrl.pathname}`)
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  console.log(`Middleware processing: ${req.nextUrl.pathname}`)
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    console.log(`Authenticated user: ${session.user.email}`)
  } else {
    console.log('No authenticated session')
  }

  // Special handling for skool-boss route
  if (req.nextUrl.pathname.startsWith("/skool-boss")) {
    // Skip sign-in page check
    if (req.nextUrl.pathname === "/skool-boss/sign-in") {
      return res
    }

    // If not signed in, redirect to skool-boss sign-in
    if (!session) {
      console.log(`Redirecting unauthenticated user from ${req.nextUrl.pathname} to skool-boss sign-in`)
      return NextResponse.redirect(new URL("/skool-boss/sign-in", req.url))
    }

    // If not the admin email, redirect to sign-in with error
    if (session.user.email !== "vtu8022@gmail.com") {
      console.log(`User ${session.user.email} is not authorized for skool-boss`)
      return NextResponse.redirect(new URL("/skool-boss/sign-in?error=unauthorized", req.url))
    }

    // Allow access for authorized admin
    return res
  }

  // Standard protected routes that require authentication
  const protectedRoutes = [
    "/account",
    "/account/orders",
    "/account/products",
    "/account/settings",
    "/checkout/success",
    "/api/checkout", 
    "/admin",
    "/api/blog",
  ]

  // Auth pages that users with a session shouldn't access
  const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"]

  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname === route)

  // If accessing a protected route without a session, redirect to login
  if (isProtectedRoute && !session) {
    console.log(`Redirecting unauthenticated user from ${req.nextUrl.pathname} to login`)
    const redirectUrl = new URL("/sign-in", req.url)
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing auth page with a session, redirect to account
  if (isAuthRoute && session) {
    console.log(`Redirecting authenticated user from ${req.nextUrl.pathname} to account`)
    return NextResponse.redirect(new URL("/account", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/account/:path*", 
    "/sign-in", 
    "/sign-up", 
    "/forgot-password", 
    "/checkout/:path*", 
    "/api/checkout", 
    "/admin/:path*", 
    "/api/blog/:path*",
    "/skool-boss/:path*",
  ],
}

