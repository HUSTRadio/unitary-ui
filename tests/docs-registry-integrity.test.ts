import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, test } from "vitest";

import { demoSectionTitle } from "../docs/geist/src/i18n/components-demo";

interface RegistryRecord {
  slug: string;
  id: string;
  renderInSection: boolean;
}

const source = readFileSync(
  resolve(process.cwd(), "docs/geist/src/examples/registry.ts"),
  "utf8",
);

function parseRecords(): RegistryRecord[] {
  const records: RegistryRecord[] = [];
  const pattern = /\{\s*slug:\s*"([^"]+)",\s*id:\s*"([^"]+)",[^}]*\}/g;
  for (const match of source.matchAll(pattern)) {
    records.push({
      slug: match[1],
      id: match[2],
      renderInSection: !match[0].includes("renderInSection: false"),
    });
  }
  return records;
}

describe("docs registry 完整性（2026-09-15 治理基线）", () => {
  test("registry 记录可解析且规模未退化", () => {
    const records = parseRecords();
    expect(records.length).toBeGreaterThan(300);
  });

  test("每个组件的可见 section 标题在两种语言下均唯一（防页面可见重复示例）", () => {
    const records = parseRecords();
    const bySlug = new Map<string, RegistryRecord[]>();
    for (const record of records) {
      const list = bySlug.get(record.slug) ?? [];
      list.push(record);
      bySlug.set(record.slug, list);
    }

    const violations: string[] = [];
    for (const [slug, list] of bySlug) {
      // 页面渲染规则（docs-components-page.tsx）：primary 优先 id==="default"，否则首条；
      // 其余记录 renderInSection !== false 才作为 section 渲染。
      const primary = list.find((record) => record.id === "default") ?? list[0];
      const visible = list.filter((record) => record !== primary && record.renderInSection);
      const seenZh = new Map<string, string>();
      const seenEn = new Map<string, string>();
      for (const record of visible) {
        const zh = demoSectionTitle("zh-CN", record.id);
        const en = demoSectionTitle("en-US", record.id);
        if (seenZh.has(zh)) {
          violations.push(`${slug}: zh 标题「${zh}」重复（${seenZh.get(zh)} 与 ${record.id}）`);
        } else {
          seenZh.set(zh, record.id);
        }
        if (seenEn.has(en)) {
          violations.push(`${slug}: en 标题「${en}」重复（${seenEn.get(en)} 与 ${record.id}）`);
        } else {
          seenEn.set(en, record.id);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  test("同一 slug 的可见 section 标题不与其 primary 标题重复", () => {
    const records = parseRecords();
    const bySlug = new Map<string, RegistryRecord[]>();
    for (const record of records) {
      const list = bySlug.get(record.slug) ?? [];
      list.push(record);
      bySlug.set(record.slug, list);
    }

    const violations: string[] = [];
    for (const [slug, list] of bySlug) {
      const primary = list.find((record) => record.id === "default") ?? list[0];
      if (primary.id !== "default") continue; // 仅 default 主示例有稳定标题语义
      const primaryZh = demoSectionTitle("zh-CN", primary.id);
      for (const record of list) {
        if (record === primary || !record.renderInSection) continue;
        if (demoSectionTitle("zh-CN", record.id) === primaryZh) {
          violations.push(`${slug}: section ${record.id} 与 primary 标题重复`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
