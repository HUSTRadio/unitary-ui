import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const geistColorsSnapshot = "docs/geist-markdown-refs/foundations/colors.md";
const documents = {
  zh: ["README.md", "CREDITS.md"],
  en: ["README.en.md", "CREDITS.en.md"],
} as const;

async function readDocument(name: string): Promise<string> {
  return readFile(path.join(root, name), "utf8");
}

describe("color palette governance", () => {
  test("documents Vercel Geist Colors as the sole foundation palette", async () => {
    for (const name of [...documents.zh, ...documents.en]) {
      await expect(readDocument(name)).resolves.toContain("Vercel Geist Colors");
    }
  });

  test("keeps the Geist Colors snapshot and index.css as the foundation-scale owners", async () => {
    for (const name of ["CREDITS.md", "CREDITS.en.md"]) {
      await expect(readDocument(name)).resolves.toContain(geistColorsSnapshot);
    }

    const css = await readFile(path.join(root, "src/styles/index.css"), "utf8");
    expect(css).toContain("Geist 全色阶");
    for (const scale of ["gray", "blue", "red", "amber", "green", "teal", "purple", "pink"]) {
      expect(css).toContain(`--${scale}-100:`);
    }
  });

  test("describes --uni-* and Apple HIG as constraints rather than second palettes", async () => {
    for (const name of documents.zh) {
      const document = await readDocument(name);
      expect(document).toMatch(/--uni-\*.*语义映射层.*不是第二套调色盘/);
      expect(document).toMatch(/Apple HIG.*布局、行为和无障碍约束.*不是第二套调色盘/);
      expect(document).toContain("具名来源、理由和作用域");
    }

    for (const name of documents.en) {
      const document = await readDocument(name);
      expect(document).toMatch(/--uni-\*.*semantic mapping layer.*not a second palette/i);
      expect(document).toMatch(
        /Apple HIG.*layout, behavior, and accessibility constraints.*not a second palette/i,
      );
      expect(document).toContain("name its source, reason, and scope");
    }
  });
});
