import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const componentsSource = readFileSync(
  resolve(import.meta.dirname, "../docs/geist/src/data/components.ts"),
  "utf8",
);
const pageSource = readFileSync(
  resolve(import.meta.dirname, "../docs/geist/src/components/docs-components-page.tsx"),
  "utf8",
);
const demoSource = readFileSync(
  resolve(import.meta.dirname, "../docs/geist/src/i18n/components-demo.ts"),
  "utf8",
);

/** 提取某个组件条目的整块源码（从 name: "x" 到下一个条目边界）。 */
function componentBlock(source: string, name: string): string {
  const start = source.indexOf(`name: "${name}"`);
  expect(start).toBeGreaterThan(-1);
  const next = source.slice(start + 1).search(/name: "[a-z-]+",/);
  return next === -1 ? source.slice(start) : source.slice(start, start + 1 + next);
}

describe("device mobileOnly contract", () => {
  test("ComponentMeta carries an optional mobileOnly flag with the Smartphone-icon doc comment", () => {
    expect(componentsSource).toMatch(/mobileOnly\?: boolean/);
    // 字段注释与新标注形态保持一致（灰色 Smartphone 图标，而非胶囊 Badge）
    expect(componentsSource).toContain("仅移动端可用（详情页标题与总览卡片渲染灰色 Smartphone 图标）");
  });

  test("device is NOT marked mobileOnly (marketing chrome, not mobile-only UI)", () => {
    const deviceBlock = componentBlock(componentsSource, "device");
    expect(deviceBlock).not.toMatch(/mobileOnly:\s*true/);
  });

  test("drawer IS marked mobileOnly", () => {
    const drawerBlock = componentBlock(componentsSource, "drawer");
    expect(drawerBlock).toMatch(/mobileOnly:\s*true/);
  });

  test("detail page and overview card render MobileOnlyMark instead of a badge", () => {
    expect(pageSource).toContain("meta.mobileOnly &&");
    expect(pageSource).toContain("component.mobileOnly &&");
    // 新辅助组件存在且被使用
    expect(pageSource).toMatch(/function MobileOnlyMark\(/);
    expect(pageSource).toContain("MobileOnlyMark language={language}");
    // 旧「仅移动端」Badge 渲染彻底移除
    expect(pageSource).not.toMatch(/<Badge[^>]*>\s*\{demoText\(language, "Mobile only"\)\}/s);
  });

  test("mobileOnly copy is translated in the demo catalog", () => {
    expect(demoSource).toContain('"Mobile only": "仅移动端"');
  });
});
