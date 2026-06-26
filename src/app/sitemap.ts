import type { MetadataRoute } from "next";
import { getContentList } from "@/lib/api";
import { postPath, projectPath } from "@/lib/slug";
import { siteUrl } from "@/lib/env";
import type { CardItem } from "@/types/PostProps";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/posts",
    "/projects",
    "/photos",
    "/about",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  try {
    // Include published posts and projects in both languages.
    const [postsEn, postsFr, projectsEn, projectsFr] = await Promise.all([
      getContentList("post", "en", 100),
      getContentList("post", "fr", 100),
      getContentList("project", "en", 100),
      getContentList("project", "fr", 100),
    ]);

    const toRoute =
      (build: (id: number, title: string) => string) => (node: CardItem) => ({
        url: `${siteUrl}${build(node.number, node.title)}`,
        lastModified: new Date(node.updatedAt),
      });

    const routes = [
      ...staticRoutes,
      ...[...postsEn, ...postsFr].map(toRoute(postPath)),
      ...[...projectsEn, ...projectsFr].map(toRoute(projectPath)),
    ];

    // De-duplicate by URL.
    return Array.from(new Map(routes.map((r) => [r.url, r])).values());
  } catch {
    // If the API is unavailable (e.g. no token at build time), still emit the
    // static routes rather than failing the build.
    return staticRoutes;
  }
}
