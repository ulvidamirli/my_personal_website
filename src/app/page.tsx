import Link from "next/link";
import CardsList from "@/components/CardsList";
import { CardSkeleton } from "@/components/Card";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ulvi Damirli | Homepage",
  description:
    "Software Engineer who loves to design and build digital products.",
};

const Page = () => {
  return (
    <main className="max-w-screen-md mx-auto px-4">
      <section className="my-20">
        <header>
          <h1 className="mb-8 text-2xl uppercase font-semibold text-neutral-400">
            This is Ulvi
          </h1>
          <p className="text-4xl font-semibold leading-snug">
            Software Engineer who loves to design and build digital products.
          </p>
        </header>
      </section>

      <section className="my-20">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Latest Posts</h2>
          <Link
            href="/posts"
            className="group block text-xs uppercase hover:text-neutral-400 duration-200"
          >
            <span>All posts</span>
            <span className="inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none">
              &nbsp;-&gt;
            </span>
          </Link>
        </header>
        <Suspense
          fallback={Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        >
          <CardsList limit={3} offset={0} />
        </Suspense>
      </section>
    </main>
  );
};

export default Page;
