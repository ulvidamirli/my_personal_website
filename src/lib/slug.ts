// Utilities for building and parsing detail URLs of the form
// <base>/<slug>-<id>, e.g. /posts/my-post-1 or /projects/my-project-2. The
// trailing numeric id is the source of truth; the slug is derived from the
// title for readability/SEO.

export function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics (accents)
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumeric -> hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
  return slug || "post";
}

// The slug segment for an item, e.g. "my-post-1".
export function postSlug(id: number, title: string): string {
  return `${slugify(title)}-${id}`;
}

// The full path under a base segment, e.g. "/posts/my-post-1".
export function discussionPath(base: string, id: number, title: string): string {
  return `${base}/${postSlug(id, title)}`;
}

export function postPath(id: number, title: string): string {
  return discussionPath("/posts", id, title);
}

export function projectPath(id: number, title: string): string {
  return discussionPath("/projects", id, title);
}

// Extracts the trailing numeric id from a slug ("my-post-1" -> "1"). Also
// accepts a bare id ("1"). Returns null when no trailing id is present.
export function parsePostId(slug: string): string | null {
  const match = slug.match(/(\d+)$/);
  return match ? match[1] : null;
}
