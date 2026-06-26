import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { githubRepo, githubToken } from "@/lib/env";
import { excerpt, extractFirstImage } from "@/lib/html";
import type {
  AboutContent,
  AboutSearchProps,
  CardItem,
  Labels,
  Photo,
  PhotosProps,
  PostDetail,
  PostDetailProps,
  PostsListProps,
} from "@/types/PostProps";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

// All content lives in a single Discussions category (default "Posts") and is
// distinguished by labels: a type (Post/Project/Photo), a language
// (English/French) and an optional "Draft" label that hides it from the site.
export const POSTS_CATEGORY = process.env.GITHUB_POSTS_CATEGORY ?? "Posts";

export type ContentType = "post" | "project" | "photo";

const TYPE_LABEL: Record<ContentType, string> = {
  post: "Post",
  project: "Project",
  photo: "Photo",
};
const DRAFT_LABEL = "Draft";
// Single discussion labelled this drives the /about page content.
const ABOUT_LABEL = "About me";

// How long a GitHub response is cached before it is revalidated in the
// background.
const REVALIDATE_SECONDS = 3600;

function languageLabel(locale: string): string {
  return locale === "fr" ? "French" : "English";
}

function hasLabel(labels: Labels, name: string): boolean {
  return labels.nodes.some(
    (label) => label.name.toLowerCase() === name.toLowerCase()
  );
}

type GraphQLError = { type?: string; message: string };

type GraphQLResponse<T> = {
  data: T | null;
  errors?: GraphQLError[];
};

// Thrown when GitHub reports that a requested node does not exist, so callers
// can translate it into a 404 instead of a server error.
class GitHubNotFoundError extends Error {}

/**
 * Performs a single GraphQL request against the GitHub API.
 *
 * Values are passed as GraphQL variables (never interpolated into the query
 * string) to avoid injection. Caching is layered on top by `fetchGitHub`.
 */
async function requestGitHub<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(
      `GitHub API request failed: ${res.status} ${res.statusText}`
    );
  }

  // GraphQL reports query-level failures with HTTP 200 and an `errors` array.
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    // GitHub reports a missing node (e.g. an unknown discussion number) as a
    // NOT_FOUND-typed error rather than a null field.
    if (
      json.errors.some(
        (e) => e.type === "NOT_FOUND" || /could not resolve/i.test(e.message)
      )
    ) {
      throw new GitHubNotFoundError(json.errors[0].message);
    }
    throw new Error(
      `GitHub GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`
    );
  }
  if (!json.data) {
    throw new Error("GitHub GraphQL response contained no data");
  }

  return json.data;
}

/**
 * Cached GraphQL fetch.
 *
 * GitHub GraphQL is POST-only, and Next's fetch Data Cache does not cache POST
 * requests — so a `next: { revalidate }` option on the fetch would be a no-op
 * and we'd hit the API (and its rate limits, especially the 30 req/min Search
 * limit) on every render. `unstable_cache` caches the *result* regardless of
 * method, keyed by the query + variables. Thrown errors are not cached, so a
 * `GitHubNotFoundError` still propagates to the caller.
 */
function fetchGitHub<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  return unstable_cache(
    () => requestGitHub<T>(query, variables),
    ["github-graphql", query, JSON.stringify(variables)],
    { revalidate: REVALIDATE_SECONDS }
  )();
}

// GitHub's search query syntax is the only way to filter discussions by label
// server-side: the `discussions` connection only filters by category/state, so
// the previous approach fetched a large page and filtered labels in code. Type,
// language and "Draft" are fixed, trusted constants, so we build the query
// string here and pass it as a GraphQL variable (never interpolated into the
// query document). All content shares one category and giscus comment threads
// carry no type label, so filtering by labels alone already excludes them — no
// category lookup is needed.
const SEARCH_MAX = 100; // GraphQL `search` returns at most 100 nodes per page.

function buildSearchQuery(
  typeLabel: string,
  locale: string | null,
  sort: string
): string {
  const { owner, name } = githubRepo();
  const parts = [`repo:${owner}/${name}`, "is:open", `label:"${typeLabel}"`];
  // A null locale opts out of language filtering: photos are language-agnostic,
  // so the "Photo" label alone is enough and the same set is shown in every
  // locale. Posts/projects pass a real locale so each language shows only its
  // own translations.
  if (locale !== null) {
    parts.push(`label:"${languageLabel(locale)}"`);
  }
  parts.push(`-label:"${DRAFT_LABEL}"`, `sort:${sort}`);
  return parts.join(" ");
}

const LIST_QUERY = `
  query SearchDiscussions($q: String!, $first: Int!) {
    search(type: DISCUSSION, query: $q, first: $first) {
      nodes {
        ... on Discussion {
          title
          updatedAt
          number
          bodyHTML
        }
      }
    }
  }
`;

// Lists published content of a given type for a locale (most recent first).
// Each entry carries a preview image (the first <img> in the body, if any) and
// a short plain-text excerpt so list cards can show image + title + summary.
export async function getContentList(
  type: ContentType,
  locale: string,
  limit: number
): Promise<CardItem[]> {
  const data = await fetchGitHub<PostsListProps>(LIST_QUERY, {
    q: buildSearchQuery(TYPE_LABEL[type], locale, "updated-desc"),
    first: Math.min(SEARCH_MAX, limit),
  });

  return data.search.nodes.map((node) => {
    const image = extractFirstImage(node.bodyHTML);
    return {
      number: node.number,
      title: node.title,
      updatedAt: node.updatedAt,
      image: image && { src: image.src, alt: image.alt || node.title },
      description: excerpt(node.bodyHTML),
    };
  });
}

const DETAIL_QUERY = `
  query Discussion($owner: String!, $name: String!, $number: Int!) {
    repository(owner: $owner, name: $name, followRenames: true) {
      discussion(number: $number) {
        bodyHTML
        publishedAt
        updatedAt
        title
        number
        labels(first: 20) {
          nodes {
            name
          }
        }
      }
    }
  }
`;

// Fetches a single discussion by number for a given content type. The type is
// enforced via labels (see below), so this is used for both posts and projects.
export async function getDiscussion(
  type: ContentType,
  id: string
): Promise<PostDetail> {
  // Route params are untrusted strings; the GraphQL `number` argument is an Int.
  const number = Number(id);
  // GitHub's GraphQL Int is 32-bit; reject non-positive or out-of-range ids.
  if (!Number.isInteger(number) || number <= 0 || number > 2_147_483_647) {
    notFound();
  }

  let data: PostDetailProps;
  try {
    data = await fetchGitHub<PostDetailProps>(DETAIL_QUERY, {
      ...githubRepo(),
      number,
    });
  } catch (error) {
    // A missing discussion is a 404, not a server error. (notFound() throws,
    // and this catch does not wrap it, so the 404 propagates correctly.)
    if (error instanceof GitHubNotFoundError) notFound();
    throw error;
  }

  const discussion = data.repository.discussion;
  if (!discussion) notFound();
  // Drafts aren't published — don't expose them even via a direct URL.
  if (hasLabel(discussion.labels, DRAFT_LABEL)) notFound();
  // Enforce that the discussion really is the requested type. Without this any
  // discussion number would render here — a project served under /posts, a
  // photo, or even a giscus-created comment thread (which has no type label) —
  // leaking unrelated content and creating duplicate URLs.
  if (!hasLabel(discussion.labels, TYPE_LABEL[type])) notFound();

  return discussion;
}

const PHOTOS_QUERY = `
  query SearchPhotos($q: String!, $first: Int!) {
    search(type: DISCUSSION, query: $q, first: $first) {
      nodes {
        ... on Discussion {
          number
          title
          bodyHTML
        }
      }
    }
  }
`;

// A "Photo" discussion whose body has no <img> is dropped below, so request a
// few extra to still return up to `limit` photos.
const PHOTO_OVERFETCH = 5;

// Lists published photos (label "Photo", not Draft). Unlike posts/projects,
// photos are not filtered by language — the same set is shown for every locale.
export async function getPhotos(limit: number): Promise<Photo[]> {
  const data = await fetchGitHub<PhotosProps>(PHOTOS_QUERY, {
    q: buildSearchQuery(TYPE_LABEL.photo, null, "created-desc"),
    first: Math.min(SEARCH_MAX, limit + PHOTO_OVERFETCH),
  });

  return data.search.nodes
    .map((node) => {
      const image = extractFirstImage(node.bodyHTML);
      if (!image) return null;
      return {
        id: node.number,
        src: image.src,
        alt: image.alt || node.title,
        title: node.title,
      };
    })
    .filter((photo): photo is Photo => photo !== null)
    .slice(0, limit);
}

const ABOUT_QUERY = `
  query SearchAbout($q: String!, $first: Int!) {
    search(type: DISCUSSION, query: $q, first: $first) {
      nodes {
        ... on Discussion {
          number
          title
          bodyHTML
          labels(first: 20) {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`;

// The "About me" page is driven by a single discussion labelled "About me".
// Language isn't filtered server-side: a site may have one language-agnostic
// "About me" post or one per language, so we fetch all matches and prefer the
// one whose language label matches the locale, falling back to the first. The
// page count is tiny, so a handful of nodes is plenty. Returns null when no
// published "About me" discussion exists, letting the page show static content.
export async function getAboutContent(
  locale: string
): Promise<AboutContent | null> {
  const { owner, name } = githubRepo();
  const q = [
    `repo:${owner}/${name}`,
    "is:open",
    `label:"${ABOUT_LABEL}"`,
    `-label:"${DRAFT_LABEL}"`,
  ].join(" ");

  const data = await fetchGitHub<AboutSearchProps>(ABOUT_QUERY, { q, first: 10 });
  const nodes = data.search.nodes;
  if (nodes.length === 0) return null;

  const lang = languageLabel(locale);
  const match = nodes.find((node) => hasLabel(node.labels, lang)) ?? nodes[0];
  return { title: match.title, bodyHTML: match.bodyHTML };
}
