import { NextResponse, NextRequest } from "next/server";

import { auth } from "./auth";

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/error",
  "/404",
  "/500",
  "/terms",
  "/privacy",
];

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  const isPrivateRoute = !isPublicRoute && !isAuthRoute;

  const session = await auth();

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (session) {
      return NextResponse.redirect(new URL("/quotes", request.url));
    }

    return NextResponse.next();
  }

  if (isPrivateRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|js|css|woff|woff2|ttf|eot)).*)",
  ],
};
