// @vitest-environment node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(rel: string): string {
  const filePath = path.join(ROOT, rel);
  expect(existsSync(filePath), `${rel} 必须存在`).toBe(true);
  return readFileSync(filePath, "utf8");
}

describe("License contract", () => {
  it("根目录存在标准英文 MIT LICENSE", () => {
    const license = read("LICENSE");
    expect(license).toContain("MIT License");
    expect(license).toContain("Permission is hereby granted, free of charge");
    expect(license).toContain('THE SOFTWARE IS PROVIDED "AS IS"');
    expect(license).toContain("Copyright (c) 2026 HUSTRadio");
  });

  it("LICENSE.zh-CN.md 明确非官方/非约束性且以英文为准", () => {
    const zh = read("LICENSE.zh-CN.md");
    expect(zh).toMatch(/非官方|非约束性/);
    expect(zh).toMatch(/LICENSE|英文/);
  });

  it("package.json license 为 MIT", async () => {
    const pkg = JSON.parse(read("package.json"));
    expect(pkg.license).toBe("MIT");
  });

  it("双语 README 互链且链接对应语言的 License / Credits / Notices", () => {
    for (const [file, localeLink] of [
      ["README.md", "LICENSE.zh-CN.md"],
      ["README.en.md", "LICENSE"],
    ] as const) {
      const readme = read(file);
      expect(readme, `${file} 应链接 ${localeLink}`).toContain(localeLink);
      expect(readme, `${file} 应链接对应语言 Credits`).toMatch(/CREDITS(\.en)?\.md/);
      expect(readme, `${file} 应链接对应语言 Notices`).toMatch(/THIRD_PARTY_NOTICES(\.en)?\.md/);
      // 语言切换链接
      expect(readme, `${file} 应提供语言切换`).toMatch(/README(\.en)?\.md/);
    }
    expect(read("README.md")).not.toContain("Private — HUSTRadio");
    expect(read("README.en.md")).not.toContain("Private — HUSTRadio");
  });

  it("THIRD_PARTY_NOTICES 中的相对链接大小写真实存在", () => {
    for (const file of ["THIRD_PARTY_NOTICES.md", "THIRD_PARTY_NOTICES.en.md"]) {
      const notices = read(file);
      const links = [...notices.matchAll(/\]\(([^)#]+)\)/g)].map((m) => m[1]);
      for (const link of links) {
        if (/^https?:/.test(link)) continue;
        const target = path.join(ROOT, link);
        expect(existsSync(target), `${file} 链接目标必须存在（区分大小写）: ${link}`).toBe(true);
      }
    }
  });

  it("Credits 双语 parity（相同资产条目）", () => {
    const zh = read("CREDITS.md");
    const en = read("CREDITS.en.md");
    for (const asset of [
      "react-mockframe",
      "devices.css",
      "telephone",
      "liquidframe",
      "Maple Mono",
      "OPPO Sans",
      "HarmonyOS Sans",
      "Material Symbols Rounded",
    ]) {
      expect(zh, `CREDITS.md 必须含 ${asset}`).toContain(asset);
      expect(en, `CREDITS.en.md 必须含 ${asset}`).toContain(asset);
    }
  });

  it("tracked 字体均在 credits/notices 中登记，且不笼统声明为 MIT", () => {
    const fonts = readdirSync(path.join(ROOT, "public", "fonts"));
    expect(fonts.length).toBeGreaterThan(0);
    const notices = read("THIRD_PARTY_NOTICES.md");
    const credits = read("CREDITS.md");
    const combined = `${notices}\n${credits}`;
    for (const family of ["Maple Mono", "OPPO Sans", "HarmonyOS Sans"]) {
      expect(combined, `字体 ${family} 必须登记`).toContain(family);
    }
    // OFL 字体不得声明为 MIT
    const mapleSection = combined.split("Maple Mono")[1]?.slice(0, 800) ?? "";
    expect(mapleSection, "Maple Mono 应标注 OFL 而非 MIT").toMatch(/OFL|SIL Open Font/i);
  });

  it("发布包携带 Maple OFL 原文，并在 README 披露其他字体子集的许可风险", () => {
    const ofl = read("OFL-1.1.txt");
    expect(ofl).toContain("SIL OPEN FONT LICENSE Version 1.1");
    expect(ofl).toContain("The Maple Mono Project Authors");

    const pkg = JSON.parse(read("package.json"));
    expect(pkg.files).toContain("OFL-1.1.txt");

    for (const file of ["README.md", "README.en.md"]) {
      const readme = read(file);
      expect(readme).toContain("OPPO Sans");
      expect(readme).toContain("HarmonyOS Sans");
      expect(readme).toMatch(/风险|risk/i);
    }
  });

  it("库构建不发布 sourcemap，并把 npm 依赖保留为外部依赖", () => {
    const vite = read("vite.lib.config.ts");
    expect(vite).toContain("const dependencies = Object.keys(pkg.dependencies ?? {})");
    expect(vite).toContain("dependencies.some");
    expect(vite).toMatch(/sourcemap:\s*false/);
  });

  it("registers every shipped font family including the modified Material Symbols subset", () => {
    const fonts = readdirSync(path.join(ROOT, "public/fonts"));
    expect(fonts).toHaveLength(16);
    expect(fonts).toContain("material-symbols-rounded-keycaps.woff2");
    for (const file of ["THIRD_PARTY_NOTICES.md", "THIRD_PARTY_NOTICES.en.md"]) {
      const notices = read(file);
      expect(notices).toContain("16");
      expect(notices).toContain("material-symbols-rounded-keycaps.woff2");
      expect(notices).toContain("fonttools");
      expect(notices).toContain("Apache License");
      for (const codepoint of ["U+EAE7", "U+E5F2", "U+EAE8", "U+EAE6"]) expect(notices).toContain(codepoint);
    }
  });
});
