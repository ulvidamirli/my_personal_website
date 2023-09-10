import CardsList from "@/components/CardsList";
import { CardSkeleton } from "@/components/Card";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ulvi Damirli | Posts",
  description:
    "Software Engineer who loves to design and build digital products.",
};

type PageProps = {
  searchParams: {
    limit: number;
    offset: number;
  };
};

// TODO: Implement infinite scroll

const Page = ({ searchParams }: PageProps) => {
  const { limit = 10, offset = 0 } = searchParams;

  return (
    <main className="max-w-screen-md mx-auto px-4">
      <section className="my-20">
        <header>
          <h1 className="text-4xl font-semibold mt-20 mb-6">Posts</h1>
        </header>
        <Suspense
          fallback={Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        >
          <CardsList limit={limit} offset={offset} />
        </Suspense>
      </section>
    </main>
  );
};

export default Page;
