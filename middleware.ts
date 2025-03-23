import NextAuth from "next-auth";
import { protectedRoutes, authRoutes, authConfig } from "./lib/auth";

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
const { auth } = NextAuth({ ...authConfig });

export default auth(async function middleware(req) {
  const session = req.auth;
  const isAuthenticated = (session as any)?.user?.accessToken;
  // const hasCallback = req.nextUrl.searchParams.get("callbackUrl");

  const isOnProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  const isOnAuthRoute = authRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isOnProtectedRoute && !isAuthenticated && !isOnAuthRoute) {
    return Response.redirect(new URL("/sign-in", req.url));
  }

  if (isOnAuthRoute && isAuthenticated) {
    // if (hasCallback) {
    //   return Response.redirect(new URL(hasCallback, req.url));
    // }
    return Response.redirect(new URL("/", req.url));
  }
});
