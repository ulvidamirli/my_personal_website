const Page = () => {
  return (
    <main className="max-w-screen-md mx-auto px-4">
      <section className="my-20">
        <header>
          <h1 className="mb-8 text-2xl uppercase font-semibold text-neutral-400">
            About me
          </h1>
          <p className="text-4xl font-semibold leading-snug">
            I love to design and build digital products from scratch to
            production.
          </p>
        </header>
      </section>
      <section className="prose prose-invert max-w-none my-20">
        <p>
          Building, designing and helping companies create digital products is
          what I’ve been doing for the last 8 years working as a Software
          Engineer.
          <br />
          <br />
          My domain knowledge includes: Team leadership, Product Development,
          Fullstack Web Development, REST API, Data modeling, SQL & NoSQL,
          Kubernetes, Cloud, Serverless Architecture, Data mining (scraping),
          ETL and Test Automation.
        </p>
        <h3>My teck stack:</h3>
        <ul className="list-outside pl-4">
          <li>
            <span className="font-bold">Frontend: </span>
            React, Next.js, Svelte, SvelteKit, Tailwind CSS
          </li>
          <li>
            <span className="font-bold">Backend: </span>
            Express, Prisma, Drizzle, Kysely, FastAPI, Flask, Django DRF,
            PostgreSQL, MongoDB, Redis, Celery, RabbitMQ, Supabase
          </li>
          <li>
            <span className="font-bold">DevOps: </span>
            Docker, Docker Compose, Linux, NGINX, Traefik, AWS, GCP
          </li>
          <li>
            <span className="font-bold">Automation/ Web scraping: </span>
            Pandas, Scrapy, BeautifulSoup4, Playwright, Selenium, Crawlee,
            Cheerio, Apify
          </li>
          <li>
            <span className="font-bold">Others: </span>
            Figma, Miro, Strapi, Directus, OpenAI, Agile Methodology
          </li>
        </ul>
      </section>
    </main>
  );
};

export default Page;
