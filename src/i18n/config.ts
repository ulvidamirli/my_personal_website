export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

// BCP 47 tags for Intl formatting (dates, numbers) per locale.
export const localeTags: Record<Locale, string> = {
  en: "en-US",
  fr: "fr-FR",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
