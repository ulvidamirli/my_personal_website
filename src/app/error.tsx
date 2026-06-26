"use client";
import { useEffect, useSyncExternalStore } from "react";
import { messages } from "@/i18n/messages";
import { getClientLocale } from "@/i18n/client";
import { defaultLocale, type Locale } from "@/i18n/config";

// The cookie is read once on the client; a no-op subscription is enough.
const noopSubscribe = () => () => {};
const serverLocale = (): Locale => defaultLocale;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Render "en" on the server/initial hydration, then the cookie value on the
  // client — without a hydration mismatch or setState-in-effect.
  const locale = useSyncExternalStore(noopSubscribe, getClientLocale, serverLocale);

  useEffect(() => {
    // Log the full error for debugging without exposing details to the visitor.
    console.error(error);
  }, [error]);

  const t = messages[locale].error;

  return (
    <main className="prose prose-lg max-w-screen-md mx-auto px-4 my-20">
      <h2>{t.title}</h2>
      <p>
        {t.body}
        {error.digest && (
          <>
            <br />
            <br />
            {t.reference} {error.digest}
          </>
        )}
      </p>
      <button
        className="underline"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        {t.tryAgain}
      </button>
    </main>
  );
}
