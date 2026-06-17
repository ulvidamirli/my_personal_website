import CodeHighlightedContent from "@/components/CodeHighlightedContent";
import Comments from "@/components/Comments";
import { getDiscussion } from "@/lib/api";
import { getGiscusConfig } from "@/lib/giscus";
import { getLocale } from "@/i18n/locale";
import { htmlToText } from "@/lib/html";
import { parsePostId, postSlug, postPath, projectPath } from "@/lib/slug";
import type { CardType } from "@/lib/content";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";

// Posts and projects render identically and differ only by content type and
// the path builder, so both detail routes are generated from these factories.

type DetailParams = { params: Promise<{ slug: string }> };

const DETAIL_PATH: Record<CardType, (id: number, title: string) => string> = {
  post: postPath,
  project: projectPath,
};

const ARTICLE_PROSE_CLASS =
  "prose prose-lg mx-auto prose-neutral prose-invert prose-img:rounded-lg prose-img:w-full prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-pre:bg-[#0c1117] prose-pre:p-2 prose-pre:rounded-xl";

export function makeDetailMetadata(type: CardType) {
  return async function generateMetadata({
    params,
  }: DetailParams): Promise<Metadata> {
    const { slug } = await params;
    const id = parsePostId(slug);
    if (!id) notFound();

    const item = await getDiscussion(type, id);
    return {
      title: item.title,
      description: htmlToText(item.bodyHTML).slice(0, 150),
      alternates: {
        canonical: DETAIL_PATH[type](item.number, item.title),
      },
    };
  };
}

export function makeDetailPage(type: CardType) {
  return async function Page({ params }: DetailParams) {
    const { slug } = await params;
    const id = parsePostId(slug);
    if (!id) notFound();

    const item = await getDiscussion(type, id);

    // Redirect non-canonical URLs (a bare id or an outdated slug) to the
    // canonical <base>/<slug>-<id> form. Use a permanent (308) redirect so
    // search engines consolidate ranking onto the canonical URL.
    if (slug !== postSlug(item.number, item.title)) {
      permanentRedirect(DETAIL_PATH[type](item.number, item.title));
    }

    const locale = await getLocale();
    const giscus = getGiscusConfig();

    return (
      <main className="px-4 my-20">
        <article className={ARTICLE_PROSE_CLASS}>
          <h1>{item.title}</h1>
          <CodeHighlightedContent content={item.bodyHTML} />
        </article>
        {giscus && <Comments {...giscus} lang={locale} />}
      </main>
    );
  };
}
