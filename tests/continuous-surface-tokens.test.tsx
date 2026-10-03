import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import postcss, { type Root } from "postcss";
import { compile } from "tailwindcss";
import { beforeAll, describe, expect, test } from "vitest";

const require = createRequire(import.meta.url);
const cssPath = path.resolve("src/styles/index.css");
const loadStylesheet = async (id: string, base: string) => {
  const file = id === "tailwindcss"
    ? require.resolve("tailwindcss/index.css")
    : id === "tw-animate-css"
      ? path.resolve("node_modules/tw-animate-css/dist/tw-animate.css")
      : path.resolve(base, id);
  return { path: file, base: path.dirname(file), content: await readFile(file, "utf8") };
};

let utilities: Root;
beforeAll(async () => {
  const compiled = await compile(await readFile(cssPath, "utf8"), {
    base: path.dirname(cssPath), loadStylesheet,
  });
  utilities = postcss.parse(compiled.build([
    "rounded-circle", "rounded-circular", "rounded-pill", "rounded-capsule",
    "rounded-continuous", "rounded-md", "rounded-lg",
  ]));
});

function radius(selector: string) {
  const values: string[] = [];
  utilities.walkRules(selector, (rule) => {
    rule.walkDecls("border-radius", (decl) => { values.push(decl.value); });
  });
  expect(values, `Missing or ambiguous compiled utility: ${selector}`).toHaveLength(1);
  return values[0];
}

describe("shape utilities compiled from the canonical stylesheet", () => {
  test("emits circular and capsule geometry, preserving legacy names", () => {
    expect(radius(".rounded-circular")).toBe("50%");
    expect(radius(".rounded-circle")).toBe("50%");
    expect(radius(".rounded-capsule")).toBe("9999px");
    expect(radius(".rounded-pill")).toBe("9999px");
  });

  test("inlines the continuous fallback expression and keeps fixed radii independent", () => {
    expect(radius(".rounded-continuous")).toBe("var(--radius-md)");
    expect(radius(".rounded-md")).toBe("var(--radius)");
    expect(radius(".rounded-lg")).toBe("0.5rem");
  });

  test("builds Grid viewport queries from tier bounds and retains pixel container conditions", async () => {
    const modulePath = path.resolve("src/components/ui/grid.module.css");
    const compiled = await compile(await readFile(modulePath, "utf8"), {
      base: path.dirname(modulePath), loadStylesheet,
    });
    const css = postcss.parse(compiled.build([]));
    const media: string[] = [];
    const containers: string[] = [];
    css.walkAtRules("media", (rule) => { media.push(rule.params.replace(/\s+/g, "")); });
    css.walkAtRules("container", (rule) => { containers.push(rule.params.replace(/\s+/g, "")); });
    expect(media).toEqual([
      "(width<=25rem)", "(width>25rem)and(width<=37.5rem)",
      "(width>37.5rem)and(width<=48rem)", "(width>48rem)and(width<=60rem)", "(width>60rem)",
    ]);
    expect(containers).toEqual([
      "(max-width:400px)", "(min-width:401px)and(max-width:600px)",
      "(min-width:601px)and(max-width:768px)", "(min-width:769px)and(max-width:960px)", "(min-width:961px)",
    ]);
  });

  test("rebuilding a tier bound updates viewport queries without moving container boundaries", async () => {
    const modulePath = path.resolve("src/components/ui/grid.module.css");
    const compiled = await compile(await readFile(modulePath, "utf8"), {
      base: path.dirname(modulePath),
      loadStylesheet: async (id, base) => {
        const sheet = await loadStylesheet(id, base);
        if (sheet.path !== cssPath) return sheet;
        const source = postcss.parse(sheet.content);
        source.walkDecls("--breakpoint-grid-xs", (decl) => { decl.value = "26rem"; });
        return { ...sheet, content: source.toString() };
      },
    });
    const css = postcss.parse(compiled.build([]));
    const media: string[] = [];
    const containers: string[] = [];
    css.walkAtRules("media", (rule) => { media.push(rule.params.replace(/\s+/g, "")); });
    css.walkAtRules("container", (rule) => { containers.push(rule.params.replace(/\s+/g, "")); });
    expect(media.slice(0, 2)).toEqual([
      "(width<=26rem)", "(width>26rem)and(width<=37.5rem)",
    ]);
    expect(containers.slice(0, 2)).toEqual([
      "(max-width:400px)", "(min-width:401px)and(max-width:600px)",
    ]);
  });
});
