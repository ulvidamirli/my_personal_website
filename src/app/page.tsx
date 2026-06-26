import {
  HomeCardsSection,
  HomePhotosSection,
  CardsSectionSkeleton,
  PhotosSectionSkeleton,
} from "@/components/HomeSection";
import { Button } from "@/components/ui/button";
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
        <header className="flex flex-col items-center">
          <img src="/ulvi-damirli-profile-pic.png" alt="" className="h-50 w-50 mx-auto" />
          <h1 className="my-8 text-3xl font-semibold text-neutral-400">
            {t.home.kicker}
          </h1>
          <div className="mt-8 space-y-4 text-base leading-relaxed">
            <p>{t.home.bio.intro}</p>
            <p>{t.home.bio.focus}</p>
            {/* <p>{t.home.bio.philosophy}</p> */}
            {/* <div>
              <p className="font-semibold">{t.home.bio.careAbout}</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                {t.home.bio.areas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div> */}
            {/* <p>{t.home.bio.interests}</p> */}
            {/* <p>{t.home.bio.personal}</p> */}
            <p>{t.home.bio.future}</p>
          </div>
          <div className="mt-8">
            <a href="https://linkedin.com/in/ulvidamirli" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
              <Button variant="default" size="lg" className="cursor-pointer">
                Connect with me on LinkedIn
              </Button>
            </a>
          </div>
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
