import path from "node:path";
import { affectsScreenshots } from "./pre-push-classifier.mjs";

const names = (text) => text.trim().split(/\s+/);
const unitFiles = (text) => names(text).map((name) => `tests/${name}`);

/** Explicit non-import inputs. Exact test identities make new opaque consumers fail closed. */
export const INDIRECT_INPUT_GROUPS = [
  {
    tests:
      unitFiles(`ai-docs-pre-push.test.ts ai-docs-prompt-contract.test.ts llm-task-contract.test.ts
      llm-task-runner.test.ts llm-task-docs-contract.test.ts pre-push-context.test.ts
      pre-push-orchestrator.test.ts pre-push-classifier.test.ts package-script-lock.test.ts
      verification-context.test.ts verification-policy.test.ts verification-runner.test.ts verification-discovery.test.ts`),
    inputs: [
      "scripts/**",
      ".agents/**",
      ".githooks/**",
      ".github/**",
      "tests/fixtures/**",
      "package.json",
      "AGENTS.md",
      "README*.md",
      ".gitignore",
    ],
  },
  {
    tests: [
      "docs/site/src/__tests__/parity-regression.test.ts",
      "docs/site/src/__tests__/prose-owner-parity.test.ts",
      ...unitFiles(
        "component-examples-plugin.test.ts section-scope-check.test.ts section-without-code.test.ts table-docs-card.test.ts",
      ),
    ],
    inputs: ["docs/**", "src/**", "tests/audit/**"],
  },
  {
    tests: unitFiles("verification-layout.test.ts"),
    inputs: ["tests/e2e/**", "playwright.config.ts", "docs/site/src/data/**"],
  },
  {
    tests: unitFiles(`audit/comparator-context.test.ts audit/comparator-exemptions.test.ts
      audit/comparator-icon.test.ts audit/comparator-provenance.test.ts audit/comparator-v3.test.ts
      audit/collector-v2.test.ts audit/description-contract.test.ts audit/evidence-cell-v2.test.ts
      audit/evidence-v2.test.ts audit/evidence-v2-builder.test.ts audit/evidence-v2-metrics.test.ts
      audit/ledger-collector.test.ts audit/ledger-comparator.test.ts audit/ledger-consumers.test.ts
      audit/ledger-design-gate.test.ts audit/ledger-schema.test.ts audit/ledger-v2.test.ts
      audit/manifest-v2-contract.test.ts audit/manifest-v2-semantics.test.ts audit/evidence-v2.test.ts`),
    inputs: ["tests/audit/**", "docs/site-replica-acceptance.md", "docs/audits/**"],
  },
  {
    tests:
      unitFiles(`color-palette-governance.test.ts continuous-surface-tokens.test.tsx duration-tokens.test.ts
      ease-tokens.test.ts error-foreground-token.test.ts foundation-colors.test.ts foundation-materials.test.ts
      foundation-contract.test.ts global-token-catalog.test.ts layer-tokens.test.ts motion-duration-governance.test.ts
      overlay-backdrop-tokens.test.ts overlay-blur-boundary.test.ts radius-tokens.test.ts raw-color-governance.test.ts
      reduced-motion-coverage.test.ts surface-shadow-contract.test.ts texture-materials.test.ts texture-theme.test.tsx
      theme-switching.test.ts theme-token-pairing.test.ts token-namespace.test.ts touch-targets-contract.test.ts
      typography-tokens.test.ts visual-fixes-regression.test.ts audit/uni-token-contract.test.ts`),
    inputs: [
      "src/**",
      "docs/site/**",
      "docs/geist-markdown-refs/**",
      "docs/audits/**",
      "README*.md",
      "CREDITS*.md",
      "public/**",
    ],
  },
  {
    tests:
      unitFiles(`component-api-registry.test.ts component-i18n-source.test.ts docs-api-category.test.ts
      device-mobileonly-contract.test.ts docs-caption.test.tsx docs-block-spacing.test.tsx docs-command-search.test.tsx
      docs-components-page.test.tsx docs-component-subgroups.test.ts docs-controlled-fields.test.ts docs-coverage.test.ts
      docs-foundations.test.tsx docs-i18n.test.ts docs-layout-harness.test.ts docs-registry-integrity.test.ts
      docs-shell-geometry.test.ts docs-shell-nav-tiers.test.tsx docs-showcode.test.ts docs-typography-rhythm.test.tsx
      example-source-imports.test.ts example-source-plugin.test.ts library-docs-export-parity.test.ts
      showcode-audit-lib.test.ts showcode-coverage.test.ts showcode-typecheck.test.ts color-schemes.test.ts`),
    inputs: [
      "docs/**",
      "src/**",
      "tests/e2e/**",
      "tests/audit/showcode*",
      "scripts/generate-llm-docs.ts",
      "scripts/generate-token-catalog.mjs",
    ],
  },
  {
    tests:
      unitFiles(`badge-api.test.ts bottom-sheet.test.tsx breadcrumbs-api.test.tsx book.test.tsx button-api.test.ts
      checkbox-api.test.ts checkbox-matrix.test.ts code-api.test.ts collapse-api.test.tsx combobox-api.test.ts
      context-card-api.test.ts context-card-visual-contract.test.ts context-menu-api.test.ts copy-button-api.test.ts
      description-api.test.ts destructive-action-modal-state.test.tsx dots-menu-api.test.ts drawer-api.test.ts
      edit-menu-exit-timing.test.ts empty-state-api.test.ts error-boundary.test.tsx feedback-rating-bar.test.tsx
      fieldset-api.test.tsx hamburger-menu-modes.test.tsx input-api.test.ts json-view-api.test.ts keyboard-input-api.test.ts
      label-api.test.ts layout-primitives.test.tsx menu.test.ts middle-truncate-api.test.ts modal-api.test.ts
      modal-typography-geometry.test.ts multi-select-api.test.tsx nav-surface-parity.test.tsx phone-mockframe.test.ts
      progress-api.test.ts quick-actions-api.test.tsx qz-public-api.test.ts radio-api.test.tsx relative-time-card.test.tsx
      search-input-api.test.ts select-api.test.ts select-consumer-contract.test.ts separator-api.test.ts sheet-api.test.ts
      side-panel-api.test.tsx slider-api.test.tsx slider-toggle-docs-alignment.test.ts split-button-api.test.ts
      status-dot-visual.test.tsx step-point-geometry.test.tsx table-api.test.ts table-consumers.test.ts switch-api.test.tsx
      text-with-copy-button-api.test.ts textarea-api.test.ts toast-api.test.ts toggle-api.test.ts tooltip-api.test.ts
      tooltip-tip.test.ts video-api.test.ts`),
    inputs: ["src/**", "docs/site/**", "docs/llm/**", "docs/geist-markdown-refs/**", "public/**"],
  },
  { tests: unitFiles("changelog-contract.test.ts"), inputs: ["CHANGELOG*.md", "package.json"] },
  {
    tests: unitFiles("gitignore-policy.test.ts readme-agents-contract.test.ts"),
    inputs: [".gitignore", "AGENTS.md", "README*.md"],
  },
  {
    tests: unitFiles("license-contract.test.ts"),
    inputs: [
      "LICENSE*",
      "OFL*",
      "THIRD_PARTY_NOTICES*.md",
      "CREDITS*.md",
      "public/**",
      "package.json",
      "README*.md",
    ],
  },
  {
    tests: unitFiles("llm-docs-export.test.ts"),
    inputs: ["docs/**", "scripts/generate-llm-docs.ts", "package.json"],
  },
  {
    tests: unitFiles("playwright-discovery.test.ts"),
    inputs: ["playwright*.config.ts", "tests/e2e/**", ".github/**"],
  },
  {
    tests: unitFiles("readme-screenshots-contract.test.ts readme-screenshot-comparison.test.ts"),
    inputs: [
      "README*.md",
      "images/styleguide/**",
      "src/**",
      "public/**",
      "scripts/**",
      "package.json",
      "vite.config.ts",
    ],
  },
];

export const matches = (file, patterns) =>
  patterns.some((pattern) => path.posix.matchesGlob(file.replaceAll("\\", "/"), pattern));
const isTestFile = (file) => /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(file);
export const isUnitTest = (file) => isTestFile(file) && !file.startsWith("tests/e2e/");
export const isBrowserTest = (file) => file.startsWith("tests/e2e/") && isTestFile(file);
export const isBrowserSpec = (file) =>
  isBrowserTest(file) &&
  !file.split("/").some((part) => part.startsWith(".")) &&
  !matches(file, ["**/_tmp-*", "**/*.tmp.*"]);
const browserSpecFile = (name) => `tests/e2e/${isTestFile(name) ? name : `${name}.spec.ts`}`;

/** Playwright file arguments are regular expressions; preserve literal Git filenames. */
export const browserFileFilters = (files) =>
  files.map((file) => file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

// Renderer identities come from docs-routes; these are dependency owners, not a second route list.
export const BROWSER_RENDERER_INPUTS = {
  static: {
    introduction: "docs/site/src/components/docs-pages.tsx",
    colors: "docs/site/src/components/docs-pages.tsx",
    typography: "docs/site/src/components/docs-pages.tsx",
    materials: "docs/site/src/components/docs-pages.tsx",
    icons: "docs/site/src/components/docs-icons.tsx",
    grid: "docs/site/src/components/docs-grid-page.tsx",
  },
  localized: {
    "state-and-events": "docs/site/src/pages/state-and-events.tsx",
    "app-shell": "docs/site/src/components/patterns/app-shell-demo.tsx",
    charts: "docs/site/src/pages/charts-gallery.tsx",
    tokens: "docs/site/src/pages/tokens.tsx",
    "api-overview": "docs/site/src/pages/api-overview.tsx",
    layer: "docs/site/src/pages/layer.tsx",
    "color-schemes": "docs/site/src/color-schemes/page.tsx",
    "color-scheme-api": "docs/site/src/pages/color-scheme-api.tsx",
  },
};
export const BROWSER_COMPONENT_RENDERER = "docs/site/src/components/docs-components-page.tsx";
export const BROWSER_SHELL_INPUTS = ["docs/site/src/App.tsx", "docs/site/src/main.tsx"];
// Generated dispatch imports are expanded by their physical example owners separately.
export const BROWSER_DISPATCH_INPUTS = [
  "docs/site/src/data/page-loaders.ts",
  "docs/site/src/examples/registry.ts",
];

// Broad probes keep their complete assertions. Narrow probes declare their component owners.
export const BROWSER_INPUT_GROUPS = [
  {
    specs: names(
      "docs-layout component-geometry continuous-surface-review reduced-motion scroll-owner-bounds touch-targets",
    ),
    inputs: ["src/**", "docs/site/**"],
  },
  {
    specs: names(
      "docs-startup docs-network-navigation docs-api-origin docs-layout-tokens docs-mobile-navigation docs-mobile-toolbar command-search",
    ),
    inputs: ["docs/site/**"],
    owners: names("hamburger-menu navbar toolbar command-menu sidebar-nav paged-media prefetch"),
  },
  {
    specs: names("activity-view-scroll-edges activity-view-detents"),
    owners: names("activity-view drawer sheet responsive-drawer"),
  },
  {
    specs: names("app-shell-frame layout-api-layer"),
    owners: names("app-shell navbar sidebar-nav toolbar layer layer-context layer-primitives"),
    inputs: ["docs/site/src/pages/**"],
  },
  { specs: names("carousel-variants"), owners: names("carousel") },
  { specs: names("choicebox-custom-content"), owners: names("choicebox") },
  { specs: names("color-schemes"), inputs: ["docs/site/src/color-schemes/**"] },
  {
    specs: names("combobox-panel-material multi-select-keyboard"),
    owners: names("combobox multi-select command-menu"),
  },
  {
    specs: names("context-menu-quick-actions-touch quick-actions-destructive-confirm"),
    owners: names("context-menu quick-actions dots-menu"),
  },
  {
    specs: names("docs-feedback-typography"),
    owners: names("feedback feedback-rating-bar"),
    inputs: ["docs/site/src/content/**", "docs/site/src/components/docs-prose*"],
  },
  { specs: names("edit-menu"), owners: names("edit-menu") },
  {
    specs: names("motion-hitu"),
    owners: names("motion hitu-player empty-state"),
    inputs: [
      "src/lib/motion*.ts*",
      "src/vendor/hitu/**",
      "docs/site/src/components/docs-pages.tsx",
    ],
  },
  {
    specs: names("global-tokens"),
    inputs: ["src/lib/token*", "src/styles/**", "docs/site/src/pages/localized/tokens*"],
  },
  {
    specs: names("hamburger-menu-states"),
    owners: names("hamburger-menu hamburger-trigger hamburger-icon"),
  },
  { specs: names("input-rounded-capsule"), owners: names("input clearable-input search-input") },
  {
    specs: names("menu-token-contract menu-bar-overlay menu-bar-content-height"),
    owners: names("menu menu-bar menu-surface dropdown-menu"),
  },
  {
    specs: names("mobile-overlay-form overlay-route-dismiss overlay-dynamic-viewport"),
    owners: names("modal drawer sheet activity-view select responsive-drawer menu"),
  },
  {
    specs: names("nav-surface-parity"),
    owners: names("navbar toolbar hamburger-menu sidebar-nav"),
  },
  { specs: names("paged-media"), owners: names("paged-media") },
  { specs: names("prefetch"), owners: names("prefetch lazy-load") },
  { specs: names("radio-scroll"), owners: names("radio") },
  {
    specs: names("readme-screenshot-settle"),
    inputs: ["src/**", "scripts/*readme-screenshots*", "scripts/lib/readme-screenshots.mjs"],
  },
  { specs: names("scroll-tracking"), owners: names("sidebar-nav navbar scroller") },
  {
    specs: names("selection-indicator"),
    owners: names("selection-indicator checkbox radio choicebox"),
  },
  {
    specs: names("texture glass-controls mask-unification material-lines"),
    inputs: ["src/styles/**", "docs/site/src/components/docs-materials*", "src/lib/token*"],
    owners: names("button modal calendar-panel menu tooltip navbar toolbar"),
  },
];

export function selectBrowserSpecs(paths, files, routes, groups = BROWSER_INPUT_GROUPS) {
  const available = files.filter(isBrowserSpec);
  const declared = new Set(groups.flatMap(({ specs }) => specs.map(browserSpecFile)));
  const missing = available.filter((file) => !declared.has(file));
  const selected = new Set(paths.filter(isBrowserSpec));
  for (const { specs, inputs = [], owners = [] } of groups) {
    const patterns = [
      ...inputs,
      ...owners.flatMap((name) => [
        `src/components/ui/${name}.*`,
        `docs/site/src/examples/${name}/**`,
      ]),
    ];
    if (
      paths.some((file) => matches(file, patterns)) ||
      routes.some((route) => owners.some((name) => route.endsWith(`/${name}`))) ||
      (routes.includes("/materials") && specs.includes("texture"))
    ) {
      for (const name of specs) selected.add(browserSpecFile(name));
    }
  }
  if (routes.length) selected.add("tests/e2e/docs-layout.spec.ts");
  return { selected: [...selected].filter((file) => available.includes(file)).sort(), missing };
}

export function indirectTests(paths, available) {
  return [
    ...new Set(
      INDIRECT_INPUT_GROUPS.filter(({ inputs }) => paths.some((file) => matches(file, inputs)))
        .flatMap(({ tests: files }) => files)
        .filter((file) => available.includes(file)),
    ),
  ].sort();
}

export function classifyVerification(context, full = false) {
  const reasons = full ? ["Explicit --full"] : [];
  const scope = {
    unit: full,
    fullUnit: full,
    browser: full,
    fullBrowser: full,
    appBuild: full,
    docsBuild: full,
    corpus: full,
    screenshots: full,
    package: full,
    lint: full,
    typecheck: full,
  };
  const localSources = [];
  for (const change of context.changes) {
    const { file, status } = change;
    if (["D", "R", "C", "T", "U", "X", "B"].includes(status)) reasons.push(`${status}: ${file}`);
    if (
      matches(file, [
        "src/styles/**",
        "src/lib/**",
        "src/hooks/**",
        "src/**/index.*",
        "public/**",
        "package.json",
        "pnpm-lock.yaml",
        "*config*",
        "docs/*config*",
        "src/types/**",
      ])
    ) {
      reasons.push(`Shared input: ${file}`);
    } else if (file.startsWith("src/components/ui/")) {
      if (!/^src\/components\/ui\/[^/]+\.[cm]?[jt]sx?$/.test(file))
        reasons.push(`Unknown component input: ${file}`);
      Object.assign(scope, {
        unit: true,
        appBuild: true,
        typecheck: true,
        corpus: true,
        screenshots: true,
        browser: true,
        lint: true,
      });
      localSources.push(file);
    } else if (matches(file, ["src/App.tsx", "src/examples/**", "src/main.tsx", "index.html"])) {
      Object.assign(scope, {
        unit: true,
        fullUnit: true,
        browser: true,
        fullBrowser: true,
        appBuild: true,
        typecheck: true,
        screenshots: true,
        lint: true,
      });
    } else if (file.startsWith("docs/site/") || file === "docs/index.html") {
      Object.assign(scope, {
        unit: true,
        docsBuild: true,
        typecheck: true,
        corpus: true,
        browser: true,
        lint: true,
      });
      if (!file.startsWith("docs/site/src/examples/")) scope.fullBrowser = true;
    } else if (
      file.startsWith("scripts/") ||
      file.startsWith(".agents/") ||
      file.startsWith(".githooks/") ||
      file.startsWith(".github/")
    ) {
      Object.assign(scope, { unit: true, typecheck: true, appBuild: true, lint: true });
      if (matches(file, ["scripts/fix-css-font-urls.mjs", "scripts/test-package-imports.mjs"]))
        scope.package = true;
      if (
        matches(file, [
          "scripts/*verify*",
          "scripts/run-locked-script.mjs",
          "scripts/lib/verification*",
          "scripts/lib/locked-package-scripts.mjs",
          "scripts/lib/package-*.mjs",
        ])
      )
        scope.fullUnit = true;
      if (
        matches(file, [
          "scripts/*llm-docs*",
          "scripts/*readme-screenshots*",
          "scripts/lib/readme-screenshots.mjs",
        ])
      )
        Object.assign(scope, { corpus: true, screenshots: true });
    } else if (file.startsWith("tests/") || isUnitTest(file) || file.startsWith("docs/")) {
      scope.unit = true;
      if (isBrowserSpec(file)) scope.browser = true;
      if (file.startsWith("tests/e2e/") && !isBrowserSpec(file))
        Object.assign(scope, { browser: true, fullBrowser: true });
      if (
        file.startsWith("tests/") &&
        !isUnitTest(file) &&
        !matches(file, ["tests/fixtures/**", "tests/audit/**", "tests/e2e/**"])
      )
        reasons.push(`Unknown fixture dependency: ${file}`);
      if (
        file.startsWith("docs/") &&
        !matches(file, ["docs/llm/**", "docs/audits/**", "docs/site-replica-acceptance.md"])
      )
        reasons.push(`Unknown documentation input: ${file}`);
      if (file.startsWith("docs/llm/")) scope.corpus = true;
    } else if (
      matches(file, [
        "AGENTS.md",
        "README*.md",
        "CHANGELOG*.md",
        "CREDITS*.md",
        "LICENSE*",
        "OFL*",
        "THIRD_PARTY_NOTICES*.md",
        ".gitignore",
        "images/styleguide/**",
      ])
    ) {
      scope.unit = true;
      if (affectsScreenshots(file)) scope.screenshots = true;
      if (matches(file, ["LICENSE*", "OFL*", "THIRD_PARTY_NOTICES*.md"])) scope.package = true;
    } else reasons.push(`Unknown path: ${file}`);
  }
  if (reasons.length)
    Object.keys(scope).forEach((key) => {
      scope[key] = true;
    });
  return { scope, reasons: [...new Set(reasons)], localSources };
}
