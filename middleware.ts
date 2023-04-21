import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { i18nConfig } from './utils/config';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);

  if (i18nConfig.locales.some(locale => request.nextUrl.pathname.startsWith(`/${locale}`))) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    })
    response.cookies.set("prefered_language", request.nextUrl.pathname.split('/')[1]);
    return response;
  }

  if (!request.cookies.has("prefered_language")) {
    const locales = getLocales(request.headers.get("accept-language"));
    request.cookies.set("prefered_language", locales[0]);
  }

  const locale = request.cookies.get("prefered_language") as RequestCookie;
  const response = NextResponse.rewrite(new URL(`/${locale.value}${request.nextUrl.pathname}`, request.url), {
    request: {
      headers: requestHeaders,
    }
  });
  response.cookies.set("prefered_language", locale.value);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|favicon|_next/static|_next/image|assets|site.webmanifest|.*.xml|.*.png|.*.jpg).*)'
  ],
}

function getLocales(headerLocales: string | null) {
  if (headerLocales) {
    const locale = headerLocales.replaceAll(/;q=\S{3}/g, "").split(",").filter((locale) => i18nConfig.locales.includes(locale));
    if (Array.isArray(locale) && !locale.length) {
      return [i18nConfig.defaultLocale];
    }
    return locale;
  }
  return [i18nConfig.defaultLocale];
}