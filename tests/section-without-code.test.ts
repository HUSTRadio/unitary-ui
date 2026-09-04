import { test, expect } from "vitest";
import { docsPageSource } from "./helpers/docs-page-source";
import { EXAMPLE_SOURCE } from "../docs/geist/src/examples/registry";

test("list sections without code prop", async () => {
  const src = docsPageSource;
  const extraStart = src.indexOf("function renderExtraSections(");
  const caseMarks = [...src.matchAll(/case "([^"]+)":/g)]
    .filter((m) => (m.index ?? 0) > extraStart)
    .map((m) => ({ slug: m[1], pos: m.index ?? 0 }));

  const sectionPattern = /<Section title="([^"]+)">/g;
  const sections: { slug: string; title: string }[] = [];
  for (const m of src.matchAll(sectionPattern)) {
    const pos = m.index ?? 0;
    const openTag = src.slice(pos, pos + 300).split(">")[0];
    if (!/code=\{sectionCode\(/.test(openTag)) {
      const nearest = [...caseMarks].reverse().find((c) => c.pos < pos);
      sections.push({ slug: nearest?.slug ?? "?", title: m[1] });
    }
  }
  const lines = sections.map(
    (s) =>
      `${s.slug} | ${s.title}${EXAMPLE_SOURCE[s.slug]?.[s.title] !== undefined ? " [数据有]" : " [数据缺]"}`,
  );
  expect(sections, `无 code 的 Section（${sections.length} 条）:\n` + lines.join("\n")).toEqual([]);
});
