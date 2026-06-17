"use client";
import Giscus from "@giscus/react";
import type { GiscusConfig } from "@/lib/giscus";

type CommentsProps = GiscusConfig & {
  // UI language for the giscus widget (e.g. "en", "fr").
  lang?: string;
};

// Thin client wrapper around the official @giscus/react component. All giscus
// values are resolved on the server (see getGiscusConfig) and passed in.
export default function Comments({
  repo,
  repoId,
  category,
  categoryId,
  lang = "en",
}: CommentsProps) {
  return (
    <section className="max-w-screen-md mx-auto px-4 my-16">
      <Giscus
        id="comments"
        repo={repo as `${string}/${string}`}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="dark"
        lang={lang}
        loading="lazy"
      />
    </section>
  );
}
