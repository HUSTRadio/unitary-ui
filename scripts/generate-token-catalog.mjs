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
      status: "active",
    };
    const comment = decl.prev();
    if (comment?.type === "comment" && comment.text.startsWith("@token ")) {
      const metadata = comment.text.match(/^@token (reserved|deprecated)(?: (--[\w-]+))?$/);
      if (!metadata || (metadata[1] === "deprecated") !== Boolean(metadata[2])) {
        throw decl.error(`Invalid token lifecycle annotation: ${comment.text}`);
      }
      entry.status = metadata[1];
      if (metadata[2]) entry.replacement = metadata[2];
    }
    const value = decl.value.replace(/\s+/g, " ").trim();
    // 断点在构建时展开为媒体条件；发射 CSS 变量并不使条件可运行时修改。
    // Breakpoints compile into media conditions even when their variables are emitted.
    if (decl.prop.startsWith("--breakpoint-")) entry.kind = "mapping";
    else if (!inline || runtimeReferences.has(decl.prop)) entry.kind = "runtime";
    if (dark) entry.darkValue = value;
    else if (fontTier) entry.variants[`font:${fontTier}`] = value;
    else entry.value = value;
    entry.group = groupFor(decl.prop);
    entries.set(decl.prop, entry);
  });
  for (const [name, entry] of entries) {
    if (entry.replacement && (entry.replacement === name || !entries.has(entry.replacement))) {
      throw new Error(`Invalid token replacement for ${name}: ${entry.replacement}`);
    }
  }
  return Object.fromEntries([...entries].sort(([a], [b]) => a.localeCompare(b, "en")));
}

function groupFor(name) {
  if (/^--(?:font|uni-(?:text|leading|ink|mixed-script))/.test(name)) return "typography";
  if (/^--(?:uni-(?:duration|motion|loop)|ease|animate|default-transition)/.test(name))
    return "motion";
  if (/^--radius/.test(name)) return "shape";
  if (/^--(?:uni-z|z-)/.test(name)) return "layers";
  if (/^--(?:material|shadow|overlay|uni-(?:shadow|overlay))/.test(name)) return "materials";
  if (/^--(?:breakpoint|spacing|uni-(?:size|control|popover|nav|doc|drawer))/.test(name)) return "layout";
  return "colors";
}

export function renderTokenCatalog(tokens) {
  return `// 由 scripts/generate-token-catalog.mjs 从 src/styles/index.css 生成，请勿手改。\n// Generated from the canonical stylesheet. Do not edit by hand.\nexport const GLOBAL_TOKENS = ${JSON.stringify(tokens, null, 2)} as const;\n\nexport type TokenName = keyof typeof GLOBAL_TOKENS;\nexport type TokenGroup = (typeof GLOBAL_TOKENS)[TokenName]["group"];\nexport type RuntimeTokenName = {\n  [Name in TokenName]: (typeof GLOBAL_TOKENS)[Name]["kind"] extends "runtime" ? Name : never\n}[TokenName];\n\nexport const TOKEN_NAMES = Object.keys(GLOBAL_TOKENS) as TokenName[];\nexport const RUNTIME_TOKEN_NAMES = TOKEN_NAMES.filter(\n  (name): name is RuntimeTokenName => GLOBAL_TOKENS[name].kind === "runtime",\n);\n`;
}

/** CSS remains the sole source; this small module keeps Hitu's SSR defaults independent of the full catalog. */
export function renderMotionEasings(tokens) {
  const curves = Object.fromEntries(Object.entries(tokens).filter(([name]) => name.startsWith("--ease-")).map(([name, token]) => {
    const match = token.value.match(/^cubic-bezier\(\s*([^)]*)\)$/i);
    const parts = match?.[1].split(",").map((part) => part.trim());
    const points = parts?.every(part => /^[+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?$/i.test(part)) ? parts.map(Number) : [];
    if (points.length !== 4 || points.some((point) => !Number.isFinite(point))
      || points[0] < 0 || points[0] > 1 || points[2] < 0 || points[2] > 1
      || (points[0] === points[1] && points[2] === points[3])) {
      throw new Error(`Motion token must be a nonlinear cubic Bezier: ${name}`);
    }
    return [name, points];
  }));
  return `// Generated from src/styles/index.css by scripts/generate-token-catalog.mjs. Do not edit.\nexport const MOTION_EASINGS = ${JSON.stringify(curves, null, 2)} as const;\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const css = await readFile(new URL("../src/styles/index.css", import.meta.url), "utf8");
  const tokens = collectGlobalTokens(css);
  const outputs = [
    [new URL("../src/lib/token-catalog.ts", import.meta.url), renderTokenCatalog(tokens)],
    [new URL("../src/lib/motion-easing-defaults.ts", import.meta.url), renderMotionEasings(tokens)],
  ];
  if (process.argv.includes("--check")) {
    for (const [output, expected] of outputs) {
      if ((await readFile(output, "utf8").catch(() => "")) !== expected) {
        throw new Error(`Token catalog drift (${fileURLToPath(output)}): run pnpm run tokens:generate`);
      }
    }
    console.log("Token catalog check passed");
  } else {
    for (const [output, expected] of outputs) await writeFile(output, expected);
    console.log(`Generated ${Object.keys(tokens).length} global tokens/mappings and motion defaults`);
  }
}
