// @vitest-environment node
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import postcss, { type AtRule, type Rule } from "postcss";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(import.meta.dirname, "..");
const STYLESHEET = path.join(ROOT, "src/styles/index.css");
const RUNTIME_DIRS = ["src/components", "src/lib", "src/vendor"];

/** 向上回溯，判断规则是否位于任何 @layer 内。 */
function layerAncestor(rule: Rule): string | null {
  let current = rule.parent;
  while (current && current.type !== "root") {
    if (current.type === "atrule" && (current as AtRule).name === "layer") return (current as AtRule).params;
    current = current.parent;
  }
  return null;
}

function mediaAncestor(rule: Rule): string | null {
  let current: Rule["parent"] = rule.parent;
  let media: string | null = null;
  while (current && current.type !== "root") {
    if (current.type === "atrule" && (current as AtRule).name === "media") media = (current as AtRule).params;
    current = current.parent;
  }
  return media;
}

function walkRuntimeFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkRuntimeFiles(target);
    return /\.(tsx?|mjs)$/.test(entry.name) ? [target] : [];
  });
}

/** 去掉注释后再扫描，避免文档性文字触发源码禁令。 */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

describe("responsive visibility contract", () => {
  const css = postcss.parse(readFileSync(STYLESHEET, "utf8"));
  const rules: Rule[] = [];
  css.walkRules((rule) => {
    if (rule.selectors.some((selector) => selector.includes("[data-uni-responsive="))) rules.push(rule);
  });

  it("declares responsive visibility as unlayered rules", () => {
    expect(rules.length).toBeGreaterThan(0);
    for (const rule of rules) {
      expect(layerAncestor(rule), `unexpected @layer for ${rule.selector}`).toBeNull();
    }
  });

  it("hides every responsive surface by default and restores it at its breakpoint", () => {
    const values = new Map<string, string>();
    for (const rule of rules) {
      const media = mediaAncestor(rule) ?? "base";
      for (const selector of rule.selectors) {
        rule.walkDecls((declaration) => {
          if (declaration.prop === "display") values.set(`${media}|${selector}`, declaration.value);
        });
      }
    }
    const display = (media: string, name: string) => values.get(`${media}|[data-uni-responsive="${name}"]`);

    for (const name of ["above-md", "above-lg", "above-xl", "above-md-flex"]) {
      expect(display("base", name), name).toBe("none");
    }
    expect(display("(min-width: 48rem)", "above-md")).toBe("block");
    expect(display("(min-width: 48rem)", "above-md-flex")).toBe("flex");
    expect(display("(min-width: 64rem)", "above-lg")).toBe("block");
    expect(display("(min-width: 80rem)", "above-xl")).toBe("block");
    expect(display("(min-width: 48rem)", "below-md")).toBe("none");
    expect(display("(min-width: 64rem)", "below-lg")).toBe("none");
    expect(display("(min-width: 80rem)", "below-xl")).toBe("none");
  });

  it("keeps components off the hidden + responsive display combination", () => {
    const offenders: string[] = [];
    const pairPattern = /["'`][^"'`\n]*\bhidden\b[^"'`\n]*\b(?:sm|md|lg|xl|2xl):(?:block|flex|grid|inline)\b[^"'`\n]*["'`]/;
    // 反向同样受级联影响：`md:hidden` 需要击败消费端重生成的基础 display 类。
    // 允许带前缀的自定义变体（如 max-grid-md:hidden）。
    const hidePattern = /["'`][^"'`\n]*(?:^|[^-\w])(?:sm|md|lg|xl|2xl):hidden\b[^"'`\n]*["'`]/;
    for (const dir of RUNTIME_DIRS) {
      for (const file of walkRuntimeFiles(path.join(ROOT, dir))) {
        const source = stripComments(readFileSync(file, "utf8"));
        if (pairPattern.test(source) || hidePattern.test(source)) offenders.push(path.relative(ROOT, file));
      }
    }
    expect(offenders).toEqual([]);
  });

  it("routes the known responsive surfaces through the contract", () => {
    for (const file of ["src/components/ui/site-navigation.tsx", "src/components/ui/browser.tsx", "src/components/ui/footer.tsx"]) {
      const source = stripComments(readFileSync(path.join(ROOT, file), "utf8"));
      expect(source.includes("data-uni-responsive"), file).toBe(true);
      expect(/["'`][^"'`\n]*\bhidden\b[^"'`\n]*\b(?:md|lg|xl):(?:block|flex)\b/.test(source), file).toBe(false);
    }
  });
});
