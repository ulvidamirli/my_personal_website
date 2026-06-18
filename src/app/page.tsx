import {
  HomeCardsSection,
  HomePhotosSection,
  CardsSectionSkeleton,
  PhotosSectionSkeleton,
} from "@/components/HomeSection";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";
import { Suspense } from "react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return {
    title: { absolute: t.site.homeTitle },
    description: t.site.description,
  };
}

const Page = async () => {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <main className="max-w-screen-md mx-auto px-4">
      <section className="my-20">
        <header>
          <h1 className="mb-8 text-2xl uppercase font-semibold text-neutral-400">
            {t.home.kicker}
          </h1>
          <p className="text-4xl font-semibold leading-snug">{t.home.hero}</p>
        </header>
      </section>

      {/* Each section streams in independently and hides itself when it has no
          content (see HomeSection), so the hero still paints immediately. */}
      <Suspense fallback={<CardsSectionSkeleton />}>
        <HomeCardsSection
          type="post"
          locale={locale}
          limit={3}
          title={t.home.latestPosts}
          seeAllHref="/posts"
          seeAllLabel={t.home.allPosts}
        />
      </Suspense>

      <Suspense fallback={<CardsSectionSkeleton />}>
        <HomeCardsSection
          type="project"
          locale={locale}
          limit={3}
          title={t.home.projects}
          seeAllHref="/projects"
          seeAllLabel={t.home.allProjects}
        />
      </Suspense>

      <Suspense fallback={<PhotosSectionSkeleton />}>
        <HomePhotosSection
          limit={6}
          title={t.home.photos}
          seeAllHref="/photos"
          seeAllLabel={t.home.allPhotos}
          labels={{
            empty: t.photos.empty,
            close: t.photos.close,
            view: t.photos.view,
          }}
        />
      </Suspense>
    </main>
  );
};

export default Page;
