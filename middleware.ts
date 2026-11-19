import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { AppRole } from "@/lib/auth";
import {
  canAccessAdminRoutes,
  isAdminPathname,
  isAuthLoginRegisterPathname,
  isOperationsPathname
} from "@/lib/auth-routes";

const INSECURE_DEV_SECRET = "dev-nextauth-secret";

async function roleFromRequest(request: NextRequest): Promise<AppRole> {
  const secret = process.env.NEXTAUTH_SECRET?.trim();
  if (process.env.NODE_ENV === "production") {
    if (!secret || secret === INSECURE_DEV_SECRET || secret.length < 32) {
      return "guest";
    }
  }
  const token = await getToken({
    req: request,
    secret: secret || INSECURE_DEV_SECRET
  });
  if (token?.role === "admin") return "admin";
  if (token?.role === "customer") return "customer";
  return "guest";
}

function redirectToLogin(request: NextRequest, opts: { nextPath: string; requireAdmin?: boolean }) {
  const url = new URL("/login", request.url);
  url.searchParams.set("next", opts.nextPath);
  if (opts.requireAdmin) {
    url.searchParams.set("requiredRole", "admin");
  }
  return NextResponse.redirect(url);
}

/** Map legacy operations URLs into the unified admin console. */
function legacyOpsRedirect(pathname: string): string | null {
  if (pathname === "/operations" || pathname === "/operations/dashboard") return "/admin/dashboard";
  if (pathname.startsWith("/operations/")) {
    const rest = pathname.slice("/operations".length);
    return `/admin/operations${rest}`;
  }
  if (pathname === "/fleet" || pathname.startsWith("/fleet/")) return `/admin${pathname}`;
  if (pathname === "/warehouses" || pathname.startsWith("/warehouses/")) return `/admin${pathname}`;
  if (pathname === "/dispatch" || pathname.startsWith("/dispatch/")) return `/admin${pathname}`;
  if (pathname === "/deliveries" || pathname.startsWith("/deliveries/")) return `/admin${pathname}`;
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = await roleFromRequest(request);

  // Legacy customer / corporate portals removed — send bookmarks to tracking or login.
  if (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/shipments" ||
    pathname.startsWith("/shipments/") ||
    pathname === "/corporate" ||
    pathname.startsWith("/corporate/")
  ) {
    return NextResponse.redirect(new URL("/tracking", request.url));
  }

  const opsTarget = legacyOpsRedirect(pathname);
  if (opsTarget) {
    return NextResponse.redirect(new URL(opsTarget, request.url));
  }

  // Signed-in staff: skip marketing auth screens.
  if (isAuthLoginRegisterPathname(pathname) && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  if (pathname === "/register") {
    return NextResponse.redirect(new URL("/login?requiredRole=admin", request.url));
  }
  if (isAuthLoginRegisterPathname(pathname) && role === "customer") {
    // Customer portal removed — guests go to tracking after any residual customer session.
    return NextResponse.redirect(new URL("/tracking", request.url));
  }

  if (isOperationsPathname(pathname) || isAdminPathname(pathname)) {
    if (!canAccessAdminRoutes(role)) {
      return redirectToLogin(request, { nextPath: pathname, requireAdmin: true });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
