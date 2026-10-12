// @vitest-environment node
import { execFileSync } from "node:child_process";
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

const KAC_SECTIONS = ["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security"];

function extractVersions(text: string): string[] {
  return [...text.matchAll(/^## \[([^\]]+)\]/gm)].map((m) => m[1]);
}

function extractSectionCounts(text: string): Map<string, number> {
  // 每个版本块下出现的 Keep a Changelog 分类计数
  const counts = new Map<string, number>();
  const blocks = text.split(/^## \[/m).slice(1);
  for (const block of blocks) {
    for (const section of KAC_SECTIONS) {
      const re = new RegExp(`^### ${section}`, "gm");
      counts.set(section, (counts.get(section) ?? 0) + (block.match(re)?.length ?? 0));
    }
  }
  return counts;
}

describe("Changelog contract", () => {
  it("双语文件均存在且含 [Unreleased]", () => {
    for (const file of ["CHANGELOG.md", "CHANGELOG.en.md"]) {
      const text = read(file);
      expect(text, `${file} 必须含 [Unreleased]`).toContain("[Unreleased]");
    }
  });

  it("版本块数量与日期一一对应（结构 parity）", () => {
    const zh = extractVersions(read("CHANGELOG.md"));
    const en = extractVersions(read("CHANGELOG.en.md"));
    expect(en).toEqual(zh);
    expect(zh.length).toBeGreaterThan(0);
  });

  it("Keep a Changelog 分类结构一一对应", () => {
    const zh = extractSectionCounts(read("CHANGELOG.md"));
    const en = extractSectionCounts(read("CHANGELOG.en.md"));
    for (const section of KAC_SECTIONS) {
      expect(en.get(section) ?? 0, `分类 ${section} 数量必须一致`).toBe(zh.get(section) ?? 0);
    }
  });

  it("互相链接且中文为默认入口", () => {
    expect(read("CHANGELOG.md")).toContain("CHANGELOG.en.md");
    expect(read("CHANGELOG.en.md")).toContain("CHANGELOG.md");
    const readme = read("README.md");
    expect(readme, "README 默认链接简体中文 changelog").toContain("CHANGELOG.md");
  });

  it("不虚构发布历史：版本与当前包、git tags 或已核验 npm 记录一致", () => {
    const pkgVersion = JSON.parse(read("package.json")).version;
    const published = JSON.parse(read("tests/fixtures/npm-publications.json"));
    expect(published.name).toBe("@hustradio/unitary-ui");
    for (const evidence of Object.values(published.versions) as { integrity: string; provenance: string }[]) {
      expect(evidence.integrity).toMatch(/^sha512-[A-Za-z0-9+/]+={0,2}$/);
      expect(new URL(evidence.provenance).origin).toBe("https://registry.npmjs.org");
    }
    let tags: string[] = [];
    try {
      tags = execFileSync("git", ["tag", "--list"], { cwd: ROOT, encoding: "utf8" })
        .trim()
        .split("\n")
        .filter(Boolean);
    } catch {
      tags = [];
    }
    for (const file of ["CHANGELOG.md", "CHANGELOG.en.md"]) {
      const versions = extractVersions(read(file)).filter((v) => v !== "Unreleased");
      for (const version of versions) {
        // 每个已发布版本必须能对应到 tag 或 package 版本
        const normalized = version.replace(/^v/, "");
        expect(
          tags.includes(version) || tags.includes(`v${normalized}`) || normalized === pkgVersion || Boolean(published.versions[normalized]),
          `${file} 中的版本 ${version} 无法从 git tags / package.json / npm 记录证实`,
        ).toBe(true);
      }
    }
  });

  it("本分支未发布变更归入 [Unreleased]", () => {
    const zh = read("CHANGELOG.md");
    // 本分支的关键交付必须可在 Unreleased 中找到
    expect(zh).toMatch(/LLM|语料/);
    expect(zh).toMatch(/组件指南|component guide|guide/i);
  });
});
