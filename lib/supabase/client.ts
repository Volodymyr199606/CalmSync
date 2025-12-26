import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Parse all cookies from document.cookie
          return document.cookie.split('; ').map(cookie => {
            const [name, ...rest] = cookie.split('=')
            return { name, value: decodeURIComponent(rest.join('=')) }
          }).filter(cookie => cookie.name)
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Build cookie string with all options
            let cookieString = `${name}=${encodeURIComponent(value)}`
            
            if (options?.path) cookieString += `; path=${options.path}`
            if (options?.maxAge) cookieString += `; max-age=${options.maxAge}`
            if (options?.domain) cookieString += `; domain=${options.domain}`
            if (options?.sameSite) cookieString += `; samesite=${options.sameSite}`
            if (options?.secure) cookieString += `; secure`
            if (options?.httpOnly) {
              // httpOnly cookies can't be set from client-side JavaScript
              // This will be handled by the server
              console.warn('[SUPABASE CLIENT] httpOnly cookie option ignored in browser client')
            }
            
            document.cookie = cookieString
          })
        },
      },
    }
  )
}

