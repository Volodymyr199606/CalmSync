import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL("/", req.url));
  }

  // Redirect authenticated users from landing page to dashboard
  if (req.nextUrl.pathname === "/" && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

