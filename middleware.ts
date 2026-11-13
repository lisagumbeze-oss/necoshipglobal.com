import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { AppRole } from "@/lib/auth";
import {
  canAccessAdminRoutes,
  canAccessUserRoutes,
  isAdminPathname,
  isAuthLoginRegisterPathname,
  isCorporatePathname,
  isOperationsPathname,
  isUserAppPathname
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = await roleFromRequest(request);

  // Signed-in users don't need the marketing sign-in / sign-up again.
  if (isAuthLoginRegisterPathname(pathname) && (role === "customer" || role === "admin")) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isUserAppPathname(pathname) || isCorporatePathname(pathname)) {
    if (!canAccessUserRoutes(role)) {
      return redirectToLogin(request, { nextPath: pathname });
    }
    return NextResponse.next();
  }

  // Internal ops / fleet / warehouse / dispatch / deliveries — admin only (no auth bypass).
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
