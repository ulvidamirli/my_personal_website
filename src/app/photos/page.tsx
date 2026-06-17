import PhotosGrid from "@/components/PhotosGrid";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";
import { Suspense } from "react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return {
    title: t.photos.title,
    description: t.photos.metaDescription,
  };
}

const skeletonHeights = [
  "h-44",
  "h-60",
  "h-52",
  "h-72",
  "h-40",
  "h-56",
  "h-64",
  "h-48",
  "h-60",
];

const PhotosSkeleton = () => (
  <div className="columns-2 sm:columns-3 gap-4">
    {skeletonHeights.map((height, i) => (
      <div
        key={i}
        className={`mb-4 break-inside-avoid rounded-xl bg-neutral-800 animate-pulse ${height}`}
      />
    ))}
  </div>
);

const Page = async () => {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <main className="max-w-screen-lg mx-auto px-4">
      <section className="my-20">
        <header>
          <h1 className="text-4xl font-semibold mt-20 mb-6">{t.photos.title}</h1>
        </header>
        <Suspense fallback={<PhotosSkeleton />}>
          <PhotosGrid limit={48} />
        </Suspense>
      </section>
    </main>
  );
};

export default Page;
