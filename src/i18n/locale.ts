import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, defaultLocale, isEnabledLocale, type Locale } from "./config";

/**
 * Resolves the active locale for the current request:
 *   1. the NEXT_LOCALE cookie (set when the user switches manually), else
 *   2. the browser's Accept-Language header, else
 *   3. the default locale.
 *
 * Note: reading cookies/headers opts pages into dynamic rendering.
 */
export async function getLocale(): Promise<Locale> {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  // Only honor a locale that is currently enabled, so a stale cookie or a
  // browser preferring a disabled language still falls back to the default.
  if (isEnabledLocale(cookieLocale)) return cookieLocale;

  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  for (const part of acceptLanguage.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isEnabledLocale(code)) return code;
  }

  return defaultLocale;
}
