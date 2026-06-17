import type { ContentType } from "@/lib/api";

// The two content types that render as cards/detail pages (photos have their
// own gallery UI).
export type CardType = Extract<ContentType, "post" | "project">;

export const CONTENT_BASE_PATH: Record<CardType, string> = {
  post: "/posts",
  project: "/projects",
};

// Maps a card type to the matching dictionary section key.
export const CONTENT_DICT_KEY: Record<CardType, "posts" | "projects"> = {
  post: "posts",
  project: "projects",
};

// A `?limit=` search param is an untrusted string; parse and clamp it.
export function clampLimit(value: string | undefined, fallback = 10): number {
  return Math.min(Math.max(Number(value) || fallback, 1), 100);
}
