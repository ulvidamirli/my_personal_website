import { describe, expect, it } from "vitest";
import {
  slugify,
  postSlug,
  postPath,
  projectPath,
  parsePostId,
} from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("My First Post")).toBe("my-first-post");
  });

  it("strips diacritics/accents", () => {
    expect(slugify("Café déjà vu")).toBe("cafe-deja-vu");
  });

  it("collapses runs of non-alphanumerics and trims hyphens", () => {
    expect(slugify("  Hello,   World!!  ")).toBe("hello-world");
  });

  it("falls back to 'post' when nothing is left", () => {
    expect(slugify("!!!")).toBe("post");
    expect(slugify("")).toBe("post");
  });
});

describe("postSlug / paths", () => {
  it("appends the id to the slug", () => {
    expect(postSlug(7, "Hello World")).toBe("hello-world-7");
  });

  it("builds base-scoped paths", () => {
    expect(postPath(7, "Hello World")).toBe("/posts/hello-world-7");
    expect(projectPath(7, "Hello World")).toBe("/projects/hello-world-7");
  });
});

describe("parsePostId", () => {
  it("extracts the trailing id from a slug", () => {
    expect(parsePostId("hello-world-7")).toBe("7");
  });

  it("keeps the id even when the title contains digits", () => {
    expect(parsePostId("top-10-tips-42")).toBe("42");
  });

  it("accepts a bare id", () => {
    expect(parsePostId("42")).toBe("42");
  });

  it("returns null when there is no trailing id", () => {
    expect(parsePostId("hello-world")).toBeNull();
    expect(parsePostId("")).toBeNull();
  });
});
