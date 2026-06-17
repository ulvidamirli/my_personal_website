// Centralised environment access. Keeps the public site URL in one place
// (used by metadata, canonical URLs, sitemap and robots) and fails fast with a
// clear message when a required server-side variable is missing, instead of
// silently sending `undefined` to the GitHub API.

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ulvidamirli.com";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function githubToken(): string {
  return required("GITHUB_API_TOKEN");
}

export function githubRepo(): { owner: string; name: string } {
  return { owner: required("GITHUB_REPO_OWNER"), name: required("GITHUB_REPO_NAME") };
}
