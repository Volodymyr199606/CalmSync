import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isOnRoot = request.nextUrl.pathname === "/";

  // Redirect unauthenticated users away from protected routes
  if (isOnDashboard && !user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Always allow access to root page - never redirect away from it
  // Both authenticated and unauthenticated users should see the landing page
  if (isOnRoot) {
    return supabaseResponse;
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)"],
};
