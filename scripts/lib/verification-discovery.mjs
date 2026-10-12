import { readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import {
  INDIRECT_INPUT_GROUPS,
  isUnitTest,
  BROWSER_RENDERER_INPUTS,
  BROWSER_COMPONENT_RENDERER,
  BROWSER_SHELL_INPUTS,
  BROWSER_DISPATCH_INPUTS,
} from "./verification-policy.mjs";

/** Inspect repository imports without executing test modules or arbitrary computed imports. */
export function repositoryImports(root, files, stopAt = new Set()) {
  const available = new Set(files);
  const cache = new Map();
  const inspect = (file) => {
    if (cache.has(file)) return cache.get(file);
    const result = { imports: [], opaque: false };
    cache.set(file, result);
    if (stopAt.has(file) || !/\.[cm]?[jt]sx?$/.test(file)) return result;
    const source = readFileSync(path.join(root, file), "utf8");
    const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    if (parsed.parseDiagnostics?.length) throw new Error(`Cannot inspect imports: ${file}`);
    const imports = new Set(
      ts.preProcessFile(source, true, true).importedFiles.map(({ fileName }) => fileName),
    );
    const visit = (node) => {
      if (
        ts.isCallExpression(node) &&
        (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          (ts.isIdentifier(node.expression) && node.expression.text === "require"))
      ) {
        if (node.arguments.length !== 1 || !ts.isStringLiteralLike(node.arguments[0]))
          result.opaque = true;
        else imports.add(node.arguments[0].text);
      }
      ts.forEachChild(node, visit);
    };
    visit(parsed);
    for (const imported of imports) {
      if (/^(?:node:)?(?:fs(?:\/promises)?|child_process)$/.test(imported)) result.opaque = true;
      if (!imported.startsWith(".") && !imported.startsWith("@/") &&
          !imported.startsWith("@hustradio/unitary-ui")) continue;
      const id = imported.split("?", 1)[0];
      const publicInputs = {
        "@hustradio/unitary-ui": "src/lib/index.ts",
        "@hustradio/unitary-ui/styles.css": "src/styles/index.css",
        "@hustradio/unitary-ui/tailwind-reference.css": "src/styles/index.css",
      };
      const relative = publicInputs[id] ?? (imported.startsWith("@/")
        ? `src/${id.slice(2)}`
        : path.posix.normalize(path.posix.join(path.posix.dirname(file), id)));
      if (relative.startsWith("../")) throw new Error(`Import leaves the repository: ${file}`);
      const candidates = [
        relative,
        ...[".ts", ".tsx", ".mjs", ".js", ".mts", ".cts", ".json"].map(
          (ext) => `${relative}${ext}`,
        ),
        `${relative}/index.ts`,
        `${relative}/index.tsx`,
        relative.replace(/\.js$/, ".ts"),
      ];
      const resolved = candidates.find((candidate) => available.has(candidate));
      if (resolved) result.imports.push(resolved);
      else result.opaque = true;
    }
    return result;
  };
  const closure = (file) => {
    const visited = new Set();
    const pending = [file];
    let opaque = false;
    while (pending.length) {
      const item = pending.pop();
      if (visited.has(item)) continue;
      visited.add(item);
      const data = inspect(item);
      opaque ||= data.opaque;
      pending.push(...data.imports);
    }
    return { files: visited, opaque };
  };
  return { closure };
}

export function missingIndirectInputs(root, tests, files, groups = INDIRECT_INPUT_GROUPS) {
  const declared = new Set(
    groups.filter(({ inputs }) => inputs.length).flatMap(({ tests: names }) => names),
  );
  const graph = repositoryImports(root, files);
  return tests.filter((file) => !declared.has(file) && graph.closure(file).opaque).sort();
}

export function discoverBrowserRoutes(root, files, changed, registry) {
  const graph = repositoryImports(root, files, new Set(BROWSER_DISPATCH_INPUTS));
  const changedSet = new Set(changed);
  const affected = (file, imports = graph) =>
    files.includes(file) &&
    [...imports.closure(file).files].some((dependency) => changedSet.has(dependency));
  const affectedExamples = files.filter(
    (file) => /^docs\/site\/src\/examples\/[^/]+\/.*\.example\.tsx$/.test(file) && affected(file),
  );
  const components = new Set(affectedExamples.map((file) => file.split("/")[4]));
  for (const file of changed) {
    const match = /^src\/components\/ui\/([^/.]+)\.[jt]sx?$/.exec(file);
    if (match) components.add(match[1]);
  }
  const uncovered = [...components].filter(
    (name) =>
      !registry.some(
        (route) =>
          route.renderer.kind === "component-detail" && route.renderer.componentName === name,
      ),
  );
  const entryFor = (renderer) =>
    ["component-index", "component-detail"].includes(renderer.kind)
      ? BROWSER_COMPONENT_RENDERER
      : BROWSER_RENDERER_INPUTS[renderer.kind]?.[renderer.page];
  const entries = registry.map(({ renderer }) => entryFor(renderer));
  for (let index = 0; index < entries.length; index++) {
    if (!entries[index] || !files.includes(entries[index]))
      uncovered.push(`Missing renderer owner: ${registry[index].to}`);
  }
  const shell = repositoryImports(
    root,
    files,
    new Set([...BROWSER_DISPATCH_INPUTS, ...entries.filter(Boolean)]),
  );
  if (BROWSER_SHELL_INPUTS.some((file) => affected(file, shell)))
    uncovered.push("Shared documentation shell");
  const routes = registry
    .filter(
      (route) =>
        affected(entryFor(route.renderer)) ||
        (route.renderer.kind === "component-detail" &&
          components.has(route.renderer.componentName)),
    )
    .map(({ to }) => to);
  return { routes, uncovered };
}

// Vite/Vitest 关联发现不得改变后续构建继承的环境，且须保留未设置与空值的区别。
// Vite/Vitest discovery must not change later builds' environment or conflate unset and empty values.
const DISCOVERY_ENV_KEYS = [
  "NODE_ENV",
  "TEST",
  "VITEST",
  "VITEST_MODE",
  "MODE",
  "BASE_URL",
  "PROD",
  "DEV",
  "VITE_USER_NODE_ENV",
];

/** Vitest resolves the actual configured module graph, including the example-source plugins. */
export async function discoverVerification(root, files, changed, related = true) {
  const environment = DISCOVERY_ENV_KEYS.map((key) => [key, process.env[key]]);
  let ctx;
  let available;
  try {
    const { createVitest } = await import("vitest/node");
    ctx = await createVitest("test", {
      root,
      config: path.join(root, "vitest.config.ts"),
      watch: false,
      related: related ? changed.map((file) => path.join(root, file)) : undefined,
    });
    available = [
      ...new Set(
        (await ctx.globTestSpecifications()).map(({ moduleId }) =>
          path.relative(root, moduleId).replaceAll("\\", "/"),
        ),
      ),
    ].sort();
    const missing = missingIndirectInputs(root, available, files);
    const selected =
      related && !missing.length
        ? [
            ...new Set(
              (await ctx.getRelevantTestSpecifications()).map(({ moduleId }) =>
                path.relative(root, moduleId).replaceAll("\\", "/"),
              ),
            ),
          ].sort()
        : available;
    const { DOCS_ROUTE_SEQUENCE } = await ctx.import(
      path.join(root, "docs/site/src/data/docs-routes.ts"),
    );
    const { routes, uncovered } = discoverBrowserRoutes(root, files, changed, DOCS_ROUTE_SEQUENCE);
    return {
      available: available.filter(isUnitTest),
      selected: selected.filter(isUnitTest),
      missing,
      routes,
      routeRegistry: DOCS_ROUTE_SEQUENCE.map((route) => route.to),
      uncovered,
    };
  } catch (error) {
    if (available) error.available = available;
    throw error;
  } finally {
    try {
      await ctx?.close();
    } finally {
      for (const [key, value] of environment) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  }
}
