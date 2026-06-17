"use client";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { messages } from "@/i18n/messages";
import { getClientLocale } from "@/i18n/client";
import { defaultLocale, type Locale } from "@/i18n/config";

/*
The not-found file is used to render UI when the notFound
function is thrown within a route segment.
Along with serving a custom UI, Next.js will
also return a 404 HTTP status code.
*/

// The cookie is read once on the client; a no-op subscription is enough.
const noopSubscribe = () => () => {};
const serverLocale = (): Locale => defaultLocale;

export default function NotFound() {
  // Render "en" on the server/initial hydration, then the cookie value on the
  // client — without a hydration mismatch or setState-in-effect.
  const locale = useSyncExternalStore(noopSubscribe, getClientLocale, serverLocale);

  const t = messages[locale].notFound;

  return (
    <main className="prose prose-lg prose-invert max-w-screen-md mx-auto px-4 my-20">
      <h2>{t.title}</h2>
      <p>
        {t.body}
        <br />
        <br />
        <Link href="/posts">{t.viewPosts}</Link>
      </p>
    </main>
  );
}
