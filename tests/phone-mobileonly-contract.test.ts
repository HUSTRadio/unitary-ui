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

describe("phone mobileOnly contract", () => {
  test("ComponentMeta carries an optional mobileOnly flag and phone opts in", () => {
    expect(componentsSource).toMatch(/mobileOnly\?: boolean/);
    // phone 条目显式开启
    const phoneBlock = componentsSource.match(
      /name:\s*"phone",[\s\S]*?^\s*\},/m,
    )?.[0];
    expect(phoneBlock).toMatch(/mobileOnly:\s*true/);
  });

  test("detail page and overview card render a conditional badge", () => {
    expect(pageSource).toContain("meta.mobileOnly &&");
    expect(pageSource).toContain("component.mobileOnly &&");
    expect(pageSource).toContain("demoText(language, \"Mobile only\")");
  });

  test("mobileOnly copy is translated in the demo catalog", () => {
    expect(demoSource).toContain('"Mobile only": "仅移动端"');
  });
});
