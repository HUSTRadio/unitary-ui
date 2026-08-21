/**
 * Best Practices i18n 契约测试：
 * 1. 每个有英文 bestPractices 的组件，在 COMPONENT_BEST_PRACTICES_ZH 都有翻译
 * 2. 中文条目数量与英文一致（不允许漏条或增条）
 * 3. localizeComponentMetadata 注入 bestPracticesZh
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { COMPONENTS } from "../docs/geist/src/data/components";
import { localizeComponentMetadata } from "../docs/geist/src/i18n/components-zh";
import COMPONENT_BEST_PRACTICES_ZH from "../docs/geist/src/i18n/best-practices-zh";

const zhSource = await readFile(
  resolve(import.meta.dirname, "../docs/geist/src/i18n/best-practices-zh.ts"),
  "utf8",
);

describe("Best Practices i18n contract", () => {
  test("every component with English bestPractices has a Chinese translation", () => {
    const withEn = COMPONENTS.filter((c) => c.bestPractices?.length);
    const missing = withEn
      .filter((c) => !COMPONENT_BEST_PRACTICES_ZH[c.name])
      .map((c) => c.name);
    expect(missing, "缺中文翻译的组件").toEqual([]);
  });

  test("Chinese translation entry count matches English", () => {
    const mismatches = COMPONENTS.filter((c) => c.bestPractices?.length).filter(
      (c) => COMPONENT_BEST_PRACTICES_ZH[c.name]?.length !== c.bestPractices?.length,
    );
    expect(
      mismatches.map((c) => `${c.name}: en=${c.bestPractices?.length} zh=${COMPONENT_BEST_PRACTICES_ZH[c.name]?.length}`),
      "条目数不一致",
    ).toEqual([]);
  });

  test("localizeComponentMetadata injects bestPracticesZh", () => {
    const withEn = COMPONENTS.find((c) => c.bestPractices?.length);
    expect(withEn).toBeDefined();
    const localized = localizeComponentMetadata(withEn!);
    expect(localized.bestPracticesZh).toBeDefined();
    expect(localized.bestPracticesZh!.length).toBe(withEn!.bestPractices!.length);
  });

  test("translation file is valid TSX (no stray template backticks)", () => {
    const backtickCount = (zhSource.match(/`/g) ?? []).length;
    expect(backtickCount, "翻译文件不应包含模板反引号").toBe(0);
  });
});
