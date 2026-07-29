import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  getPathLocale,
  isLocale,
  normalizeLocale,
  stripLocale,
  type Locale,
} from "@/lib/i18n";

function hasClerkKeys() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.CLERK_SECRET_KEY,
  );
}

function preferredLocale(req: NextRequest): Locale {
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const accepted = req.headers
    .get("accept-language")
    ?.split(",")
    .map((item) => item.trim().split(";")[0]);

  const match = accepted?.find((value) => isLocale(value.split("-")[0]));
  return normalizeLocale(match ?? DEFAULT_LOCALE);
}

function isApiPath(pathname: string) {
  return pathname.startsWith("/api/") || pathname === "/api";
}

function isAdminPath(pathname: string) {
  const unlocalized = stripLocale(pathname);
  return unlocalized === "/admin" || unlocalized.startsWith("/admin/");
}

function localizedResponse(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const pathLocale = getPathLocale(pathname);
  const locale = pathLocale ?? preferredLocale(req);
  const headers = new Headers(req.headers);
  headers.set(LOCALE_HEADER, locale);

  if (isApiPath(pathname)) {
    return NextResponse.next({ request: { headers } });
  }

  if (!pathLocale && !isAdminPath(pathname)) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname =
      pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  if (pathLocale) {
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = stripLocale(pathname);
    const response = NextResponse.rewrite(rewriteUrl, { request: { headers } });
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.next({ request: { headers } });
}

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!hasClerkKeys()) {
    return localizedResponse(req);
  }

  return clerkMiddleware(async (auth, request) => {
    if (isAdminPath(request.nextUrl.pathname) || request.nextUrl.pathname.startsWith("/api/admin")) {
      await auth.protect();
    }

    return localizedResponse(request);
  })(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|woff2?|ttf|map)).*)",
    "/(api|trpc)(.*)",
  ],
};
