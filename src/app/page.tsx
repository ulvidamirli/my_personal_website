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
import Link from "next/link";
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
      <section className="relative my-20 sm:my-28">
        {/* Full-bleed dot-grid backdrop, faded out toward the edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[60rem] w-screen -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_55%_60%_at_30%_45%,black,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_55%_60%_at_30%_45%,black,transparent_75%)]"
        />
        <header className="flex flex-col items-start text-left">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-border/60 via-muted/40 to-transparent blur-md"
            />
            {/* <img
              src="/ulvi-damirli-profile-pic.png"
              alt="Ulvi Damirli"
              className="relative h-32 w-32 rounded-full object-cover ring-1 ring-black/10 shadow-sm sm:h-32 sm:w-32"
            /> */}
          </div>

          <h1 className="mt-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-4xl font-bold leading-tight tracking-tight text-balance text-transparent">
            {t.home.hero}
          </h1>

          <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-foreground/80 text-pretty">
            <p>{t.home.bio.focus}</p>
            <p>{t.home.bio.future}</p>
          </div>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <a
              href="https://linkedin.com/in/ulvidamirli"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default" size="lg" className="cursor-pointer gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                  className="size-4"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                </svg>
                Connect on LinkedIn
              </Button>
            </a>
            <Link href="/about">
              <Button variant="outline" size="lg" className="cursor-pointer">
                More about me
              </Button>
            </Link>
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
