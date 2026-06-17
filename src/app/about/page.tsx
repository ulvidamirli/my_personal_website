import type { Metadata } from "next";
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

  return (
    <main className="max-w-screen-md mx-auto px-4">
      <section className="my-20">
        <header>
          <h1 className="mb-8 text-2xl uppercase font-semibold text-neutral-400">
            {t.about.kicker}
          </h1>
          <p className="text-4xl font-semibold leading-snug">{t.about.lead}</p>
        </header>
      </section>
      <section className="prose prose-invert max-w-none my-20">
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
      </section>
    </main>
  );
};

export default Page;
