import type { Metadata } from "next";
import CodeHighlightedContent from "@/components/CodeHighlightedContent";
import { getAboutContent } from "@/lib/api";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return {
    title: t.about.metaTitle,
    description: t.about.metaDescription,
  };
}

const Page = async () => {
  const locale = await getLocale();
  const t = getDictionary(locale);
  // Content comes from a GitHub Discussion labelled "About me" (locale-aware).
  const about = await getAboutContent(locale);

  return (
    <main className="max-w-screen-md mx-auto px-4">
      <section className="my-20">
        <header>
          <h1 className="mb-8 text-2xl uppercase font-semibold text-muted-foreground">
            {t.about.kicker}
          </h1>
          <p className="text-4xl font-semibold leading-snug">{t.about.lead}</p>
        </header>
      </section>
      <section className="prose max-w-none my-20">
        {about ? (
          // GitHub sanitizes discussion bodyHTML server-side; see
          // CodeHighlightedContent for why we don't re-sanitize here.
          <CodeHighlightedContent content={about.bodyHTML} />
        ) : (
          // Fallback shown until a published "About me" discussion exists.
          <>
            <p>
              {t.about.intro}
              <br />
              <br />
              {t.about.domainsIntro} {t.about.domains}
            </p>
            <h3>{t.about.stackTitle}</h3>
            <ul className="list-outside pl-4">
              <li>
                <span className="font-bold">{t.about.frontend} </span>
                React, Next.js, Svelte, SvelteKit, Tailwind CSS
              </li>
              <li>
                <span className="font-bold">{t.about.backend} </span>
                Express, Prisma, Drizzle, Kysely, FastAPI, Flask, Django DRF,
                PostgreSQL, MongoDB, Redis, Celery, RabbitMQ, Supabase
              </li>
              <li>
                <span className="font-bold">{t.about.devops} </span>
                Docker, Docker Compose, Linux, NGINX, Traefik, AWS, GCP
              </li>
              <li>
                <span className="font-bold">{t.about.automation} </span>
                Pandas, Scrapy, BeautifulSoup4, Playwright, Selenium, Crawlee,
                Cheerio, Apify
              </li>
              <li>
                <span className="font-bold">{t.about.others} </span>
                Figma, Miro, Strapi, Directus, OpenAI, Agile Methodology
              </li>
            </ul>
          </>
        )}
      </section>
    </main>
  );
};

export default Page;
