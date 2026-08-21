import { test, expect } from "vitest";
import { readFile } from "node:fs/promises";

test("全部无 code Section 位于 renderExtraSections 内", async () => {
  const src = await readFile("docs/geist/src/components/docs-components-page.tsx", "utf8");
  const extraStart = src.indexOf("function renderExtraSections(");
  // renderExtraSections 函数体结束：找它的右花括号（简化：找其后第一个顶层 function 定义）
  const nextFn = src.indexOf("\nfunction ", extraStart + 1);
  const extraEnd = nextFn === -1 ? src.length : nextFn;

  const sectionPattern = /<Section title="([^"]+)">/g;
  const offenders: { line: number; title: string }[] = [];
  for (const m of src.matchAll(sectionPattern)) {
    const pos = m.index ?? 0;
    const openTag = src.slice(pos, pos + 300).split(">")[0];
    if (!/code=\{sectionCode\(/.test(openTag)) {
      const line = src.slice(0, pos).split("\n").length;
      if (pos < extraStart || pos > extraEnd) {
        offenders.push({ line, title: m[1] });
      }
    }
  }
  expect(offenders, "不在 renderExtraSections 内的无 code Section").toEqual([]);
});
