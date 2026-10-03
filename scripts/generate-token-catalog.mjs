import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import postcss from "postcss";

export function collectGlobalTokens(css) {
  const root = postcss.parse(css);
  const entries = new Map();
  const runtimeReferences = new Set();
  root.walkDecls((decl) => {
    if (decl.parent.type === "atrule" && decl.parent.name === "theme") return;
    for (const [, name] of decl.value.matchAll(/var\(\s*(--[\w-]+)/g)) runtimeReferences.add(name);
  });
  root.walkDecls(/^--[\w-]+$/, (decl) => {
    const parent = decl.parent;
    const theme = parent.type === "atrule" && parent.name === "theme";
    const selectors = parent.type === "rule" ? parent.selectors : [];
    const global = selectors.some((selector) =>
      /^(?::root|\.dark|\[data-theme=["']?dark["']?\]|(?:html)?\[data-font-tier=["']?[\w-]+["']?\])$/.test(
        selector,
      ),
    );
    if (!theme && !global) return;
    const dark =
      !theme &&
      selectors.some(
        (selector) => selector === ".dark" || /^\[data-theme=["']?dark["']?\]$/.test(selector),
      );
    const fontTier = !theme && parent.selector.match(/data-font-tier=["']?([\w-]+)/)?.[1];
    const inline = theme && parent.params.split(/\s+/).includes("inline");
    const entry = entries.get(decl.prop) ?? {
      value: "",
      darkValue: "",
      kind: "mapping",
      variants: {},
    };
    const value = decl.value.replace(/\s+/g, " ").trim();
    if (!inline || runtimeReferences.has(decl.prop)) entry.kind = "runtime";
    if (dark) entry.darkValue = value;
    else if (fontTier) entry.variants[`font:${fontTier}`] = value;
    else entry.value = value;
    entry.group = groupFor(decl.prop);
    entries.set(decl.prop, entry);
  });
  return Object.fromEntries([...entries].sort(([a], [b]) => a.localeCompare(b, "en")));
}

function groupFor(name) {
  if (/^--(?:font|uni-(?:text|leading|ink|mixed-script))/.test(name)) return "typography";
  if (/^--(?:uni-(?:duration|motion|loop)|ease|animate|default-transition)/.test(name))
    return "motion";
  if (/^--radius/.test(name)) return "shape";
  if (/^--(?:uni-z|z-)/.test(name)) return "layers";
  if (/^--(?:material|shadow|overlay|uni-(?:shadow|overlay))/.test(name)) return "materials";
  if (/^--(?:breakpoint|spacing|uni-(?:size|control|popover|nav|doc))/.test(name)) return "layout";
  return "colors";
}

export function renderTokenCatalog(tokens) {
  return `// 由 scripts/generate-token-catalog.mjs 从 src/styles/index.css 生成，请勿手改。\n// Generated from the canonical stylesheet. Do not edit by hand.\nexport const GLOBAL_TOKENS = ${JSON.stringify(tokens, null, 2)} as const;\n\nexport type TokenName = keyof typeof GLOBAL_TOKENS;\nexport type TokenGroup = (typeof GLOBAL_TOKENS)[TokenName]["group"];\nexport type RuntimeTokenName = {\n  [Name in TokenName]: (typeof GLOBAL_TOKENS)[Name]["kind"] extends "runtime" ? Name : never\n}[TokenName];\n\nexport const TOKEN_NAMES = Object.keys(GLOBAL_TOKENS) as TokenName[];\nexport const RUNTIME_TOKEN_NAMES = TOKEN_NAMES.filter(\n  (name): name is RuntimeTokenName => GLOBAL_TOKENS[name].kind === "runtime",\n);\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const css = await readFile(new URL("../src/styles/index.css", import.meta.url), "utf8");
  const output = new URL("../src/lib/token-catalog.ts", import.meta.url);
  const expected = renderTokenCatalog(collectGlobalTokens(css));
  if (process.argv.includes("--check")) {
    if ((await readFile(output, "utf8").catch(() => "")) !== expected) {
      throw new Error("Token catalog drift: run pnpm run tokens:generate");
    }
    console.log("Token catalog check passed");
  } else {
    await writeFile(output, expected);
    console.log(`Generated ${Object.keys(collectGlobalTokens(css)).length} global tokens/mappings`);
  }
}
