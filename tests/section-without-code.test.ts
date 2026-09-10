import { test, expect } from "vitest";
import { docsPageSource } from "./helpers/docs-page-source";

test("list sections without code prop", async () => {
  const src = docsPageSource;
  const sectionTags = [...src.matchAll(/<Section\b[^>]*>/gs)].map((match) => match[0]);
  expect(sectionTags.length, "guard: docs page must render at least one Section").toBeGreaterThan(0);
  const missingCode = sectionTags.filter((tag) => !/\bcode=\{record\.source\}/.test(tag));
  expect(missingCode, `无 code 的 Section（${missingCode.length} 条）`).toEqual([]);
});
