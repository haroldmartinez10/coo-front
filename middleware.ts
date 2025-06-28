import { NextResponse, NextRequest } from "next/server";

import { auth } from "./auth";

// Definir los diferentes grupos de rutas
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/error",
  "/404",
  "/500",
  "/terms",
  "/privacy",
  // Agrega aquí todas tus rutas públicas
];

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  // Agrega aquí todas tus rutas de autenticación
];

// Las rutas privadas no necesitan definirse explícitamente
// porque cualquier ruta que no sea pública o de auth será considerada privada

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth routes to avoid interfering with NextAuth.js
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Verificar si la ruta es pública
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Verificar si la ruta es de autenticación
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Verificar si la ruta es privada (no es pública ni de auth)
  const isPrivateRoute = !isPublicRoute && !isAuthRoute;

  const session = await auth();

  // Si es una ruta pública, permitir acceso sin restricciones
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Si es una ruta de autenticación
  if (isAuthRoute) {
    // Si ya tiene sesión, redirigir a la página principal de la app
    if (session) {
      return NextResponse.redirect(new URL("/standard-prices", request.url));
    }
    // Si no tiene sesión, permitir acceso a las rutas de auth
    return NextResponse.next();
  }

  // Si es una ruta privada
  if (isPrivateRoute) {
    // Si no tiene sesión, redirigir al login
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Si tiene sesión, permitir acceso
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static files (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|js|css|woff|woff2|ttf|eot)).*)",
  ],
};
