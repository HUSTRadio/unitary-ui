import { test, expect } from "vitest";
import { readFile } from "node:fs/promises";
import { DEMO_CODE } from "../docs/geist/src/data/demo-code";

test("list sections without code prop", async () => {
  const src = await readFile("docs/geist/src/components/docs-components-page.tsx", "utf8");
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
      `${s.slug} | ${s.title}${DEMO_CODE[s.slug]?.[s.title] !== undefined ? " [数据有]" : " [数据缺]"}`,
  );
  expect(sections, `无 code 的 Section（${sections.length} 条）:\n` + lines.join("\n")).toEqual([]);
});
