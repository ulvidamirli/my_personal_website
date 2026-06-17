import CardsList from "@/components/CardsList";
import { CardSkeleton } from "@/components/Card";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";
import { clampLimit, CONTENT_DICT_KEY, type CardType } from "@/lib/content";
import { Suspense } from "react";
import type { Metadata } from "next";

// Shared listing page for posts and projects (identical layout, different
// content type + dictionary section).

type ContentListPageProps = {
  type: CardType;
  searchParams: Promise<{ limit?: string }>;
};

export function makeListMetadata(type: CardType) {
  return async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const section = getDictionary(locale)[CONTENT_DICT_KEY[type]];
    return {
      title: section.title,
      description: section.metaDescription,
    };
  };
}

export default async function ContentListPage({
  type,
  searchParams,
}: ContentListPageProps) {
  const { limit } = await searchParams;
  const parsedLimit = clampLimit(limit);

  const locale = await getLocale();
  const section = getDictionary(locale)[CONTENT_DICT_KEY[type]];

  return (
    <main className="max-w-screen-md mx-auto px-4">
      <section className="my-20">
        <header>
          <h1 className="text-4xl font-semibold mt-20 mb-6">{section.title}</h1>
        </header>
        <Suspense
          fallback={Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        >
          <CardsList
            type={type}
            locale={locale}
            limit={parsedLimit}
            emptyMessage={section.empty}
          />
        </Suspense>
      </section>
    </main>
  );
}
