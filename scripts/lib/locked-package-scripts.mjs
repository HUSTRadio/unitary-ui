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
    node("scripts/clean-library-output.mjs"),
    bin("typescript", "tsc", "-p", "tsconfig.lib.json"),
    bin("tsc-alias", "tsc-alias", "-p", "tsconfig.lib.json"),
    bin("vite", "vite", "build", "--config", "vite.lib.config.ts"),
    node("scripts/fix-css-font-urls.mjs"),
  ),
  "build:docs": checks(
    script("tokens:check"),
    bin("typescript", "tsc", "-p", "docs/site/tsconfig.source.json"),
    bin("vite", "vite", "build", "--config", "docs/vite.config.ts"),
  ),
  "test:docs:package": checks(script("test:package")),
  "typecheck:website": checks(bin("typescript", "tsc", "-p", "website/tsconfig.json")),
  "build:website": checks(
    script("tokens:check"),
    script("typecheck:website"),
    script("typecheck:docs"),
    bin("vite", "vite", "build", "--config", "website/vite.config.ts"),
    bin("vite", "vite", "build", "--config", "website/docs.vite.config.ts"),
  ),
  "test:website": checks(
    script("build:website"),
    bin("@playwright/test", "playwright", "test", "-c", "website/playwright.config.ts"),
  ),
  "typecheck:dev-shell": checks(
    bin("typescript", "tsc", "-p", "packages/dev-shell-contract/tsconfig.json"),
    bin("typescript", "tsc", "-p", "packages/dev-shell-server/tsconfig.json"),
    bin("typescript", "tsc", "-p", "packages/dev-shell/tsconfig.json"),
  ),
  "test:dev-shell": checks(
    bin("vitest", "vitest", "run", "-c", "packages/dev-shell-server/vitest.config.ts"),
    bin("vitest", "vitest", "run", "-c", "packages/dev-shell/vitest.config.ts"),
  ),
  "build:dev-shell": checks(
    script("typecheck:dev-shell"),
    bin("vite", "vite", "build", "-c", "packages/dev-shell/vite.config.ts"),
  ),
  "test:dev-shell:e2e": checks(
    script("build:dev-shell"),
    bin("@playwright/test", "playwright", "test", "-c", "packages/dev-shell/playwright.config.ts"),
  ),
  "verify:dev-shell": checks(
    script("typecheck:dev-shell"),
    script("test:dev-shell"),
    script("test:dev-shell:e2e"),
  ),
  "build:docs:registry": checks(node("scripts/build-docs-registry.mjs")),
  lint: checks(bin("oxlint", "oxlint")),
  test: checks(bin("vitest", "vitest", "run")),
  verify: checks(node("scripts/verify.mjs")),
  typecheck: checks(script("tokens:check"), bin("typescript", "tsc", "-b")),
  "typecheck:docs": checks(bin("typescript", "tsc", "-p", "docs/site/tsconfig.source.json")),
  "typecheck:templates": checks(node("scripts/check-templates.mjs", "typecheck")),
  "build:templates": checks(script("build:lib"), node("scripts/check-templates.mjs", "build")),
  "test:templates": checks(bin("@playwright/test", "playwright", "test", "-c", "playwright.templates.config.ts")),
  "test:templates:package": checks(script("build:lib"), node("scripts/test-template-package.mjs")),
  "tokens:generate": checks(node("scripts/generate-token-catalog.mjs")),
  "tokens:check": checks(node("scripts/generate-token-catalog.mjs", "--check")),
  "typecheck:tests": checks(bin("typescript", "tsc", "-p", "tsconfig.tests.json")),
  "test:package": checks(script("build:lib"), node("scripts/test-packed-package.mjs")),
  prepack: checks(script("build:lib")),
  prepublishOnly: checks(script("test:package"), script("typecheck")),
  "test:docs-layout": checks(
    bin("@playwright/test", "playwright", "test", "-c", "playwright.config.ts"),
  ),
  "test:motion": checks(node("scripts/test-motion-browsers.mjs")),
  "docs:readme:screenshots": checks(node("scripts/capture-readme-screenshots.mjs")),
  "docs:readme:screenshots:check": checks(
    node("scripts/capture-readme-screenshots.mjs", "--check"),
  ),
  "docs:llm:generate": checks(bin("tsx", "tsx", "scripts/generate-llm-docs.ts")),
  "docs:llm:check": checks(bin("tsx", "tsx", "scripts/generate-llm-docs.ts", "--check")),
};
