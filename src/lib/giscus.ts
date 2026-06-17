import { POSTS_CATEGORY } from "@/lib/api";

export type GiscusConfig = {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
};

// All comments are stored in the single content category (giscus
// mapping="pathname" keys each thread by page path). Returns null when giscus
// isn't fully configured, so comments are simply hidden.
export function getGiscusConfig(): GiscusConfig | null {
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_POSTS_CATEGORY_ID;

  if (!repo || !repoId || !categoryId) return null;
  return { repo, repoId, category: POSTS_CATEGORY, categoryId };
}
