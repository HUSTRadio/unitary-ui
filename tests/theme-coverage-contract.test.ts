import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, test } from "vitest";

import { defaultTokens } from "../src/lib/color-schemes/default";
import { GLOBAL_TOKENS } from "../src/lib/token-catalog";
import { COMPONENTS } from "../docs/site/src/data/components";

/**
 * C5 双主题覆盖清单（M3-06）。
 *
 * 只守两件事：
 * 1. 清单里的语义 token 必须是 catalog 中的 runtime token，且在 Default 方案的 light/dark 两档都有定义；
 * 2. 清单里的代表组件必须存在、已在文档注册，并且源码里真实出现其中至少一个 token。
 *
 * 刻意不做：对比度计算、axe/ARIA、视觉截图断言——这些属于无障碍与视觉回归专项。
 */

interface ThemeCoverageFixture {
  schemaVersion: number;
  updatedAt: string;
  scope: Record<string, string>;
  tokens: Record<string, string[]>;
  pairs: [string, string][];
  components: { name: string; tokens: string[]; themes: string[] }[];
  required: string[];
}

const root = path.resolve(import.meta.dirname, "..");
const fixture = JSON.parse(
  readFileSync(path.join(root, "tests/fixtures/theme-coverage.json"), "utf8"),
) as ThemeCoverageFixture;

const listedTokens = Object.values(fixture.tokens).flat();
const registeredNames = new Set(COMPONENTS.map((component) => component.name));

const isRuntime = (token: string) =>
  Object.prototype.hasOwnProperty.call(GLOBAL_TOKENS, token) &&
  (GLOBAL_TOKENS as Record<string, { kind: string }>)[token].kind === "runtime";

const hasValue = (mode: "light" | "dark", token: string) =>
  Object.prototype.hasOwnProperty.call(defaultTokens[mode], token) &&
  Boolean((defaultTokens[mode] as Record<string, string>)[token]);

describe("C5 theme coverage ledger", () => {
  test("declares a schema, an update date and an explicit scope", () => {
    expect(fixture.schemaVersion).toBe(1);
    expect(fixture.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(fixture.scope.contrast).toBe("out-of-scope");
    expect(fixture.scope.axe).toBe("out-of-scope");
  });

  test("lists no duplicate tokens across groups", () => {
    expect(new Set(listedTokens).size).toBe(listedTokens.length);
  });

  test("every listed token is a runtime token", () => {
    for (const token of listedTokens) {
      expect(isRuntime(token), `${token} is not a runtime token`).toBe(true);
    }
  });

  test("every listed token is defined in both light and dark", () => {
    for (const token of listedTokens) {
      expect(hasValue("light", token), `${token} missing in light`).toBe(true);
      expect(hasValue("dark", token), `${token} missing in dark`).toBe(true);
    }
  });

  test("every paired token exists and is defined in both modes", () => {
    for (const [first, second] of fixture.pairs) {
      for (const token of [first, second]) {
        expect(isRuntime(token), `${token} (pair) is not a runtime token`).toBe(true);
        expect(hasValue("light", token), `${token} (pair) missing in light`).toBe(true);
        expect(hasValue("dark", token), `${token} (pair) missing in dark`).toBe(true);
      }
    }
  });

  test("covers every component named as required", () => {
    const covered = new Set(fixture.components.map((component) => component.name));
    for (const name of fixture.required) {
      expect(covered.has(name), `required component missing from theme coverage: ${name}`).toBe(true);
    }
  });

  test("keeps one entry per component", () => {
    const names = fixture.components.map((component) => component.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test("each component exists, is documented and claims both themes", () => {
    for (const component of fixture.components) {
      const source = path.join(root, "src/components/ui", `${component.name}.tsx`);
      expect(existsSync(source), `missing implementation: ${component.name}`).toBe(true);
      expect(registeredNames.has(component.name), `not registered in docs: ${component.name}`).toBe(true);
      expect(component.themes.slice().sort()).toEqual(["dark", "light"]);
    }
  });

  test("each component only claims tokens that exist", () => {
    for (const component of fixture.components) {
      expect(component.tokens.length, `${component.name} claims no token`).toBeGreaterThan(0);
      for (const token of component.tokens) {
        expect(isRuntime(token), `${component.name} claims unknown token: ${token}`).toBe(true);
      }
    }
  });

  test("each component really references at least one claimed token", () => {
    for (const component of fixture.components) {
      const source = readFileSync(path.join(root, "src/components/ui", `${component.name}.tsx`), "utf8");
      const hits = component.tokens.filter((token) => source.includes(token.replace(/^--/, "")));
      expect(hits.length, `${component.name} references none of ${component.tokens.join(", ")}`).toBeGreaterThan(0);
    }
  });
});
