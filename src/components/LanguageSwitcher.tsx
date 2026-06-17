"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/i18n/actions";
import { locales, type Locale } from "@/i18n/config";

type LanguageSwitcherProps = {
  current: Locale;
};

export default function LanguageSwitcher({ current }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const change = (locale: Locale) => {
    if (locale === current) return;
    startTransition(async () => {
      await setLocale(locale);
      // Re-render server components with the new locale cookie.
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-1 text-xs uppercase" aria-label="Language">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-neutral-700">/</span>}
          <button
            type="button"
            onClick={() => change(locale)}
            disabled={isPending}
            aria-current={locale === current ? "true" : undefined}
            className={
              locale === current
                ? "text-white font-semibold"
                : "text-neutral-500 hover:text-neutral-300 duration-200 disabled:opacity-50"
            }
          >
            {locale}
          </button>
        </span>
      ))}
    </div>
  );
}
