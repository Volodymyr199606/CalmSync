import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL("/", req.url));
  }

  // Allow authenticated users to access the home page if they want
  // (removed auto-redirect to dashboard)

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

