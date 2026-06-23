import { LOCALE_COOKIE, defaultLocale, isEnabledLocale, type Locale } from "./config";

// Reads the active locale from the cookie on the client. Used by error/not-found
// boundaries which render as Client Components and can't await server helpers.
export function getClientLocale(): Locale {
  if (typeof document === "undefined") return defaultLocale;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]+)`)
  );
  const value = match?.[1];
  // Ignore cookies for locales that aren't currently enabled.
  return isEnabledLocale(value) ? value : defaultLocale;
}
