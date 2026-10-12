// @vitest-environment node
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { build, loadConfigFromFile, mergeConfig, type UserConfig } from "vite";
import ts from "typescript";
import postcss from "postcss";
import { copyTailwindReference } from "../scripts/copy-tailwind-reference.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const fixtures: string[] = [];

function fixture() {
  const root = realpathSync(mkdtempSync(path.join(os.tmpdir(), "unitary-css-boundary-")));
  fixtures.push(root);
  mkdirSync(path.join(root, "src/styles"), { recursive: true });
  return root;
}

afterEach(() => {
  for (const root of fixtures.splice(0)) rmSync(root, { recursive: true, force: true });
});

async function libraryConfig() {
  const loaded = await loadConfigFromFile({ command: "build", mode: "production" }, path.join(ROOT, "vite.lib.config.ts"), ROOT);
  if (!loaded) throw new Error("Library configuration did not load");
  return loaded;
}

async function cssOutput(config: UserConfig) {
  const result = await build(config);
  const outputs = Array.isArray(result) ? result : [result];
  const css: string[] = [];
  for (const output of outputs) {
    if (!("output" in output)) throw new Error("Unexpected watching build");
    for (const item of output.output) {
      if (item.type === "asset" && item.fileName.endsWith(".css")) css.push(String(item.source));
    }
  }
  return css.join("\n");
}

describe("library and documentation build boundaries", () => {
  it("loads the production library configuration without any docs or styleguide configuration dependency", async () => {
    const loaded = await libraryConfig();
    expect(loaded.dependencies.some(file => /[\\/]docs[\\/]/.test(file))).toBe(false);
    expect(loaded.dependencies).not.toContain(path.join(ROOT, "vite.config.ts"));
    expect(loaded.config.build?.lib).toMatchObject({ entry: path.join(ROOT, "src/lib/bundle.ts") });
    const plugins: unknown[] = await Promise.all(((loaded.config.plugins ?? []) as unknown[]).flat(Infinity));
    expect(plugins.filter(Boolean).map(plugin => plugin !== null && typeof plugin === "object" && "name" in plugin ? plugin.name : undefined))
      .not.toContain("unitary-example-source");
  });

  it("keeps the private CSS bundle entry out of published declarations", () => {
    const file = path.join(ROOT, "tsconfig.lib.json");
    const config = ts.readConfigFile(file, ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, ROOT);
    expect(parsed.errors).toEqual([]);
    expect(parsed.fileNames).toContain(path.join(ROOT, "src/lib/index.ts").replaceAll("\\", "/"));
    expect(parsed.fileNames).not.toContain(path.join(ROOT, "src/lib/bundle.ts").replaceAll("\\", "/"));
  });

  it("copies reference CSS and its palette byte-for-byte from their canonical sources", () => {
    const root = fixture();
    const reference = Buffer.from('@import "./color-schemes.css";\r\n@theme { --color-unitary: #123456; }\r\n');
    const palette = Buffer.from(':root { --scheme-name: "单一来源"; }\r\n');
    writeFileSync(path.join(root, "src/styles/index.css"), reference);
    writeFileSync(path.join(root, "src/styles/color-schemes.css"), palette);
    copyTailwindReference(root);
    expect(readFileSync(path.join(root, "dist/tailwind-reference.css"))).toEqual(reference);
    expect(readFileSync(path.join(root, "dist/color-schemes.css"))).toEqual(palette);
    expect(existsSync(path.join(root, "dist/types/lib/bundle.d.ts"))).toBe(false);
  });

  it("emits color aliases and public utilities when compiling the source docs CSS entry", async () => {
    const root = fixture();
    const entry = path.join(root, "entry.js");
    const stylesheet = path.join(ROOT, "docs/site/src/index.css").replaceAll("\\", "/");
    writeFileSync(entry, `import ${JSON.stringify(stylesheet)}; export const fixture = true;\n`);
    vi.stubEnv("UNITARY_DOCS_MODE", "source");
    vi.stubEnv("UNITARY_DOCS_TEST_FIXTURES", "0");
    try {
      const loaded = await loadConfigFromFile({ command: "build", mode: "production" }, path.join(ROOT, "docs/vite.config.ts"), ROOT);
      if (!loaded) throw new Error("Documentation configuration did not load");
      const css = postcss.parse(await cssOutput(mergeConfig(loaded.config, {
        configFile: false,
        logLevel: "silent",
        publicDir: false,
        build: { write: false, lib: { entry, formats: ["es"] } },
      })));
      const rootVariables = new Map<string, string>();
      const selectors = new Set<string>();
      css.walkRules(rule => {
        for (const selector of rule.selectors) selectors.add(selector);
        if (rule.selectors.some(selector => selector === ":root" || selector === ":host")) {
          rule.walkDecls(declaration => { rootVariables.set(declaration.prop, declaration.value); });
        }
      });
      // The color catalog reads these emitted aliases directly, including unused static levels.
      for (const scale of [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]) {
        expect(rootVariables.get(`--color-gray-${scale}`), `Missing emitted gray alias: ${scale}`).toBe(`var(--gray-${scale})`);
      }
      expect(rootVariables.get("--color-background-100")).toBe("var(--background-100)");
      expect(rootVariables.get("--color-background-200")).toBe("var(--background-200)");
      for (const utility of ["bg-gray-100", "text-gray-1000", "rounded-circle", "rounded-circular", "rounded-pill", "rounded-capsule", "rounded-continuous"]) {
        expect(selectors.has(`.${utility}`), `Missing public docs utility: ${utility}`).toBe(true);
      }
    } finally {
      vi.unstubAllEnvs();
    }
  }, 30_000);

  it("includes docs demo utilities only in the living styleguide stylesheet", async () => {
    const root = fixture();
    const docs = path.join(root, "docs/site/src/examples");
    mkdirSync(docs, { recursive: true });
    symlinkSync(path.join(ROOT, "node_modules"), path.join(root, "node_modules"), process.platform === "win32" ? "junction" : "dir");
    writeFileSync(path.join(root, "package.json"), '{"type":"module"}\n');
    for (const name of ["index.css", "color-schemes.css"]) copyFileSync(path.join(ROOT, "src/styles", name), path.join(root, "src/styles", name));
    copyFileSync(path.join(ROOT, "src/styleguide.css"), path.join(root, "src/styleguide.css"));
    writeFileSync(path.join(root, "src/library.tsx"), 'export const library = <div className="m-[617px]" />;\n');
    writeFileSync(path.join(docs, "demo.example.tsx"), 'export const docs = <div className="p-[619px]" />;\n');
    const entry = path.join(root, "src/entry.js");
    const run = async (stylesheet: string) => {
      writeFileSync(entry, `import ${JSON.stringify(stylesheet)}; export const fixture = true;\n`);
      const { config } = await libraryConfig();
      return cssOutput(mergeConfig(config, {
        root,
        configFile: false,
        logLevel: "silent",
        publicDir: false,
        build: { write: false, lib: { entry, formats: ["es"] } },
      }));
    };
    const library = await run("./styles/index.css");
    expect(library).toContain("margin:617px");
    expect(library).not.toContain("padding:619px");
    const selectors = new Set<string>();
    postcss.parse(library).walkRules(rule => { for (const selector of rule.selectors) selectors.add(selector); });
    for (const shape of ["circle", "circular", "pill", "capsule", "continuous"]) {
      expect(selectors.has(`.rounded-${shape}`), `Missing public shape utility: ${shape}`).toBe(true);
    }
    const styleguide = await run("./styleguide.css");
    expect(styleguide).toContain("margin:617px");
    expect(styleguide).toContain("padding:619px");
  });
});
