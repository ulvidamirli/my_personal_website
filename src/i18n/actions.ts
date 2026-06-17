"use server";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, type Locale } from "./config";

// Server action invoked by the language switcher to persist the chosen locale.
export async function setLocale(locale: Locale) {
  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
