// Small HTML helpers built on the rehype/hast parser we already depend on, so
// we parse markup properly instead of with brittle regexes.
import { unified } from "unified";
import rehypeParse from "rehype-parse";

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function parse(html: string): HastNode {
  return unified()
    .use(rehypeParse, { fragment: true })
    .parse(html) as unknown as HastNode;
}

function findFirst(
  node: HastNode,
  predicate: (n: HastNode) => boolean
): HastNode | null {
  if (node.type === "element" && predicate(node)) return node;
  for (const child of node.children ?? []) {
    const found = findFirst(child, predicate);
    if (found) return found;
  }
  return null;
}

function collectText(node: HastNode, out: string[]): void {
  if (node.type === "text" && node.value) out.push(node.value);
  for (const child of node.children ?? []) collectText(child, out);
}

// Returns the first <img> (src + alt) in a rendered discussion body, or null.
export function extractFirstImage(
  html: string
): { src: string; alt: string } | null {
  const img = findFirst(parse(html), (n) => n.tagName === "img");
  const src = img?.properties?.src;
  if (typeof src !== "string" || !src) return null;
  const alt = img?.properties?.alt;
  return { src, alt: typeof alt === "string" ? alt : "" };
}

// Flattens rendered HTML to its visible text (for meta descriptions).
export function htmlToText(html: string): string {
  const parts: string[] = [];
  collectText(parse(html), parts);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

// A short, plain-text excerpt of a rendered body for card previews. Truncates
// on a word boundary and appends an ellipsis when the text is longer than
// `maxLength`.
export function excerpt(html: string, maxLength = 160): string {
  const text = htmlToText(html);
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${(lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated).trimEnd()}…`;
}
