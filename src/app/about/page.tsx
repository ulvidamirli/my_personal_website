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
      <section className="relative my-20 sm:my-28">
        {/* Full-bleed dot-grid backdrop, faded out toward the edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[60rem] w-screen -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_55%_60%_at_30%_45%,black,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_55%_60%_at_30%_45%,black,transparent_75%)]"
        />
        <header className="flex flex-col items-start text-left">
          <h1 className="text-2xl uppercase font-semibold text-muted-foreground">
            {t.about.kicker}
          </h1>

          <p className="mt-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-4xl font-bold leading-tight tracking-tight text-balance text-transparent">
            {t.about.lead}
          </p>
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
