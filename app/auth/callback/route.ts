import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Supabase Auth Callback Route
 * Handles the redirect after user clicks the magic link in their email
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error_description = requestUrl.searchParams.get("error_description");
  const error_code = requestUrl.searchParams.get("error_code");
  
  // Always redirect to dashboard after successful auth
  const redirectTo = "/dashboard";

  // Handle errors from Supabase (like PKCE errors)
  if (error_description || error_code) {
    console.error("[AUTH CALLBACK] Error in callback:", { error_description, error_code });
    // Still redirect to dashboard - the middleware will handle auth check
    // But we could also show an error message
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error_description || "Authentication failed")}`, requestUrl.origin));
  }

  if (!code) {
    console.error("[AUTH CALLBACK] No code parameter found in URL");
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent("Missing authentication code")}`, requestUrl.origin));
  }

  // Create a response object for the redirect to dashboard
  const redirectResponse = NextResponse.redirect(new URL(redirectTo, requestUrl.origin));

  // Create Supabase client with proper cookie handling for route handlers
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            redirectResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Exchange the code for a session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  
  if (error) {
    console.error("[AUTH CALLBACK] Error exchanging code for session:", error);
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error.message)}`, requestUrl.origin));
  }

  if (!data.session) {
    console.error("[AUTH CALLBACK] No session created after code exchange");
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent("Failed to create session")}`, requestUrl.origin));
  }

  console.log("[AUTH CALLBACK] Successfully exchanged code for session, redirecting to:", redirectTo);

  // Return the redirect response with session cookies
  return redirectResponse;
}

