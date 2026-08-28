// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(rel: string): string {
  const filePath = path.join(ROOT, rel);
  expect(existsSync(filePath), `${rel} 必须存在`).toBe(true);
  return readFileSync(filePath, "utf8");
}

function screenshotPaths(markdown: string): string[] {
  return [...markdown.matchAll(/!\[[^\]]*\]\((images\/[^)]+)\)/g)].map((match) => match[1]);
}

describe("README 示例截图生成合同", () => {
  it("提供可直接运行的截图生成命令，并在双语 README 中说明", () => {
    const pkg = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
    expect(pkg.scripts?.["docs:readme:screenshots"]).toBe(
      "node scripts/capture-readme-screenshots.mjs",
    );

    expect(read("README.md")).toContain("vp run docs:readme:screenshots");
    expect(read("README.en.md")).toContain("vp run docs:readme:screenshots");
  });

  it("截图生成器覆盖 README 引用的全部示例图片", () => {
    const zhPaths = screenshotPaths(read("README.md"));
    const enPaths = screenshotPaths(read("README.en.md"));
    expect(zhPaths.length).toBeGreaterThan(0);
    expect(enPaths).toEqual(zhPaths);

    const generator = read("scripts/capture-readme-screenshots.mjs");
    for (const imagePath of new Set(zhPaths)) {
      expect(existsSync(path.join(ROOT, imagePath)), `${imagePath} 必须存在`).toBe(true);
      expect(generator, `生成器必须覆盖 ${imagePath}`).toContain(
        JSON.stringify(path.basename(imagePath)),
      );
    }
  });
});
