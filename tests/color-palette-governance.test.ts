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

  test("keeps both runtime foundation palettes identical to the Vercel Geist Colors snapshot", async () => {
    const [css, snapshot] = await Promise.all([
      readFile(path.join(root, "src/styles/index.css"), "utf8"),
      readFile(path.join(root, geistColorsSnapshot), "utf8"),
    ]);

    const darkSnapshot = snapshot.slice(
      snapshot.indexOf("## 完整色板（Dark 主题）"),
      snapshot.indexOf("## 完整色板（Light 主题）"),
    );
    const lightSnapshot = snapshot.slice(snapshot.indexOf("## 完整色板（Light 主题）"));
    const darkCss = cssBlock(css, '.dark,\n[data-theme="dark"]');
    const lightCss = cssBlock(css, ":root");

    expectFoundationMatchesSnapshot(darkCss, darkSnapshot);
    expectFoundationMatchesSnapshot(lightCss, lightSnapshot);
  });

  test("does not admit a second foundation color scale", async () => {
    const css = await readFile(path.join(root, "src/styles/index.css"), "utf8");
    const foundationPrefixes = [...css.matchAll(/--([a-z][a-z0-9-]*)-(?:100|200|300|400|500|600|700|800|900|1000)\s*:/g)]
      .map((match) => match[1])
      .filter((prefix) => !prefix.startsWith("color-") && !prefix.startsWith("uni-"));

    expect([...new Set(foundationPrefixes)].sort()).toEqual([
      "amber",
      "background",
      "blue",
      "gray",
      "gray-alpha",
      "green",
      "pink",
      "purple",
      "red",
      "teal",
    ]);
  });
});

function cssBlock(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  expect(start, `missing ${selector} block`).toBeGreaterThanOrEqual(0);
  const bodyStart = css.indexOf("{", start) + 1;
  const end = css.indexOf("\n}", bodyStart);
  expect(end, `unterminated ${selector} block`).toBeGreaterThan(bodyStart);
  return css.slice(bodyStart, end);
}

function expectFoundationMatchesSnapshot(css: string, snapshot: string): void {
  const expected = Object.fromEntries(
    [...snapshot.matchAll(/--ds-([a-z-]+-\d+)\s*\|\s*(#[0-9a-f]{6,8})/gi)].map((match) => [
      match[1],
      match[2].toLowerCase(),
    ]),
  );
  expect(Object.keys(expected)).toHaveLength(92);

  const actual = Object.fromEntries(
    [...css.matchAll(/--([a-z-]+-\d+)\s*:\s*(#[0-9a-f]{6,8})\s*;/gi)]
      .filter((match) => match[1] in expected)
      .map((match) => [match[1], match[2].toLowerCase()]),
  );
  expect(actual).toEqual(expected);
}
