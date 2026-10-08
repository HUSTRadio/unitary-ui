// Command arrays preserve argv without a shell (including on Windows).
const script = (name) => ["script", name];
const node = (...args) => ["node", ...args];
const bin = (pkg, name, ...args) => ["bin", pkg, name, ...args];
const checks = (...steps) => ({ resource: "workspace-checks", steps });

export const LOCKED_PACKAGE_SCRIPTS = {
  build: checks(
    script("tokens:check"),
    bin("typescript", "tsc", "-b"),
    bin("vite", "vite", "build"),
  ),
  "build:lib": checks(
    script("tokens:check"),
    bin("typescript", "tsc", "-p", "tsconfig.lib.json"),
    bin("tsc-alias", "tsc-alias", "-p", "tsconfig.lib.json"),
    bin("vite", "vite", "build", "--mode", "lib"),
    node("scripts/fix-css-font-urls.mjs"),
  ),
  "build:docs": checks(
    script("tokens:check"),
    bin("vite", "vite", "build", "--config", "docs/vite.config.ts"),
  ),
  lint: checks(bin("oxlint", "oxlint")),
  test: checks(bin("vitest", "vitest", "run")),
  verify: checks(node("scripts/verify.mjs")),
  typecheck: checks(script("tokens:check"), bin("typescript", "tsc", "-b")),
  "tokens:generate": checks(node("scripts/generate-token-catalog.mjs")),
  "tokens:check": checks(node("scripts/generate-token-catalog.mjs", "--check")),
  "typecheck:tests": checks(bin("typescript", "tsc", "-p", "tsconfig.tests.json")),
  "test:package": checks(script("build:lib"), node("--test", "scripts/test-package-imports.mjs")),
  prepublishOnly: checks(script("test:package"), script("typecheck")),
  "test:docs-layout": checks(
    bin("@playwright/test", "playwright", "test", "-c", "playwright.config.ts"),
  ),
  "docs:readme:screenshots": checks(node("scripts/capture-readme-screenshots.mjs")),
  "docs:readme:screenshots:check": checks(
    node("scripts/capture-readme-screenshots.mjs", "--check"),
  ),
  "docs:llm:generate": checks(bin("tsx", "tsx", "scripts/generate-llm-docs.ts")),
  "docs:llm:check": checks(bin("tsx", "tsx", "scripts/generate-llm-docs.ts", "--check")),
};
