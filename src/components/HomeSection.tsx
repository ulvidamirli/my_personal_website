import type { ReactNode } from "react";
import Link from "next/link";
import Card, { CardSkeleton } from "@/components/Card";
import PhotoGallery from "@/components/PhotoGallery";
import { getContentList, getPhotos } from "@/lib/api";
import { CONTENT_BASE_PATH, type CardType } from "@/lib/content";
import type { Locale } from "@/i18n/config";

// Homepage content sections. Unlike the dedicated /posts, /projects and /photos
// listing pages (which show an "empty" message), the homepage hides a section
// entirely — header and "see all" link included — when it has no content.

const SeeAllLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="group block text-xs uppercase text-muted-foreground hover:text-foreground duration-200"
  >
    <span>{label}</span>
    <span className="inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none">
      &nbsp;-&gt;
    </span>
  </Link>
);

const SectionHeader = ({
  title,
  seeAllHref,
  seeAllLabel,
}: {
  title: string;
  seeAllHref: string;
  seeAllLabel: string;
}) => (
  <header className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-semibold">{title}</h2>
    <SeeAllLink href={seeAllHref} label={seeAllLabel} />
  </header>
);

type CardsSectionProps = {
  type: CardType;
  locale: Locale;
  limit: number;
  title: string;
  seeAllHref: string;
  seeAllLabel: string;
};

export const HomeCardsSection = async ({
  type,
  locale,
  limit,
  title,
  seeAllHref,
  seeAllLabel,
}: CardsSectionProps) => {
  const items = await getContentList(type, locale, limit);
  if (items.length === 0) return null;

  const basePath = CONTENT_BASE_PATH[type];

  return (
    <section className="my-20">
      <SectionHeader
        title={title}
        seeAllHref={seeAllHref}
        seeAllLabel={seeAllLabel}
      />
      {items.map((item) => (
        <Card
          key={item.number}
          id={item.number}
          title={item.title}
          date={item.updatedAt}
          locale={locale}
          basePath={basePath}
        />
      ))}
    </section>
  );
};

type PhotosSectionProps = {
  limit: number;
  title: string;
  seeAllHref: string;
  seeAllLabel: string;
  labels: { empty: string; close: string; view: string };
};

export const HomePhotosSection = async ({
  limit,
  title,
  seeAllHref,
  seeAllLabel,
  labels,
}: PhotosSectionProps) => {
  const photos = await getPhotos(limit);
  if (photos.length === 0) return null;

  return (
    <section className="my-20">
      <SectionHeader
        title={title}
        seeAllHref={seeAllHref}
        seeAllLabel={seeAllLabel}
      />
      <PhotoGallery photos={photos} labels={labels} />
    </section>
  );
};

// Skeletons shown while a section streams in. They mirror the section layout
// (header included) so non-empty sections don't shift; an empty section simply
// collapses once it resolves to null.
const SectionSkeleton = ({ children }: { children: ReactNode }) => (
  <section className="my-20">
    <header className="flex justify-between items-center mb-6">
      <div className="h-8 w-40 rounded bg-muted animate-pulse" />
      <div className="h-4 w-16 rounded bg-muted animate-pulse" />
    </header>
    {children}
  </section>
);

export const CardsSectionSkeleton = () => (
  <SectionSkeleton>
    {Array.from({ length: 3 }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </SectionSkeleton>
);

const photoSkeletonHeights = ["h-44", "h-60", "h-52", "h-72", "h-40", "h-56"];

export const PhotosSectionSkeleton = () => (
  <SectionSkeleton>
    <div className="columns-2 sm:columns-3 gap-4">
      {photoSkeletonHeights.map((height, i) => (
        <div
          key={i}
          className={`mb-4 break-inside-avoid rounded-xl bg-muted animate-pulse ${height}`}
        />
      ))}
    </div>
  </SectionSkeleton>
);
