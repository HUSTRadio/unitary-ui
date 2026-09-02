# Changelog

[← 简体中文版本：CHANGELOG.md](./CHANGELOG.md)

All notable changes to this project are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versioning follows Semantic Versioning.

## [Unreleased]

### Added

- **BottomSheet and ErrorBoundary documentation**: adds package-root type exports for `BottomSheetProps` and `ErrorBoundaryProps`, plus bilingual API references, best practices, live examples, and LLM reference pages for both components.
- **Public component exports and API references**: the package root now exports `ContextMenuTrigger`, `ContextMenuContent`, `FieldsetFooterActions`, `ErrorText`, `WarningText`, and `DisabledWall`; the component API registry, bilingual guides, and LLM reference synchronize those exports and their related implemented props.
- **Bilingual component guide registry**: all 75 components have structured guides in Simplified Chinese (primary) and English (alternative) — when to use / when not to use / example index / accessibility / controlled behavior / responsive / theme — with examples referencing real existing demo keys; rendered on component docs pages.
- **LLM reference corpus**: `docs/llm/` generates 168 Markdown pages (84 docs routes × 2 locales) plus the machine-readable `index.json` (with content hashes); `docs:llm:generate` / `docs:llm:check` commands with drift detection.
- **LLM corpus documentation**: added `docs/llm/README.md` and its English alternative covering the canonical source, index structure, generation, and zero-drift verification flow.
- **Versioned LLM task packages**: `.agents/registry.json` registers task manifests; safety, Git, documentation, and task-specific prompt fragments are assembled in manifest order; the unified `llm` CLI provides list/check/dry-run/manual modes, while pre-push only adapts Git-ref context. An LLM can locate prompt paths directly from `AGENTS.md` and `.agents/README.en.md` without executing a command.
- **MIT license and attribution**: English `LICENSE` (legally authoritative) + Simplified Chinese reading guide `LICENSE.zh-CN.md` (unofficial, non-binding); bilingual `CREDITS.md` / `CREDITS.en.md` and `THIRD_PARTY_NOTICES.md` / `THIRD_PARTY_NOTICES.en.md`; the npm publish manifest includes the license and third-party notices.
- **Bilingual README**: `README.md` (Simplified Chinese) and `README.en.md` (English) provide installation, a minimal example, documentation entry points, and dual-theme living-styleguide screenshots; LLMs enter dedicated documentation only through the top-level `AGENTS.md` link.
- **README example-image generator**: `docs:readme:screenshots` discovers pages from the living-styleguide top navigation and captures light/dark screenshots for every page at a fixed 1440×900 viewport; `docs:readme:screenshots:check` provides formatter-stable drift detection.
- **Documentation contract tests**: component-doc completeness, bilingual parity, LLM corpus export, license, README/AGENTS, and changelog contracts.
- Font metrics probe `src/lib/font-metrics.ts` (self-registering + `useFontMetrics` hook) with tier contract tests.
- Navigation shell component family (framework extension): Navbar / SidebarNav / Footer / HamburgerMenu / ExpandPanel / BottomSheet, unified 500ms cubic-bezier(0.32,0.72,0,1) animation with motion-reduce fallback, controlled/uncontrolled dual mode.
- Shell breakpoint exception: sidebar breakpoint kept at lg(1024px) (intentional deviation from the official xl(1200px), serving the VS Code embedded-browser scenario).
- Button press states (Apple HIG requirement) and default minimum width (min-w = height × 2.2); Progress label/labelPosition 8-direction labels and 300ms transition.
- `docs/geist/src/__tests__/parity-regression.test.ts`: source-assertion regression tests for parity fixes.

### Changed

- **Package-root surface cleanup (breaking)**: `ExpandPanel`, `Grabber`, `PhoneStatusBar`, and `PhoneSafariChrome` are no longer exported from the package root and remain implementation details of HamburgerMenu, BottomSheet, and Device; Navbar, SidebarNav, Footer, and RatingPill now expose their public props/data types, and unreachable API registry data was removed.
- **Device is now the canonical device-frame documentation surface**: the former Phone page is migrated to Device with iPhone, Pixel, Galaxy, and iPad models; the old `/components/phone` URL keeps a compatibility mapping, while the runtime `Phone` alias remains for migrating existing iPhone 17 call sites.
- **Font stack strategy**: all @font-face rules renamed with Subset suffixes; system-first font stacks (machines with OPPO Sans / HarmonyOS Sans installed hit the system fonts with zero downloads, others fall back to self-hosted tiered subsets); manual tier declaration via root `data-font-tier="oppo|hmos|system"`; tier switches re-measure with a 120ms debounce (idempotent).
- **Table default alignment (breaking)**: removed implicit `last:text-right` from `TableHead` / `TableCell`; everything is left-aligned by default, matching official Geist. Numeric columns relying on the old implicit right alignment must now use explicit `align="right"` or `text-right`.
- Publish boundary: `files` now includes `LICENSE`, `LICENSE.zh-CN.md`, and the bilingual third-party notices; font subsets are distributed with `dist` (license status in THIRD_PARTY_NOTICES).
- The library package now externalizes npm dependencies, omits sourcemaps, and removes stale demo/app artifacts. All 15 processed font subsets remain included; the Maple OFL-1.1 text ships with the package, while the README explicitly discloses the OPPO Sans / HarmonyOS Sans redistribution-evidence risk.
- The LLM generator now selects an available port and starts an exclusive preview for every run instead of reusing a potentially stale service; generated Markdown remains formatter-stable.
- `AGENTS.md` is now a portable repository-level LLM entry point that links the canonical source, Geist docs, and `docs/llm/index.json`, without personal environment details, signing identities, or bindings to a specific Agent tool.
- The versioned agent task package moved to top-level `.agents/` with no legacy-directory compatibility alias; runner, schema, prompt discovery, pre-push impact paths, contract tests, and Git ignore/line-ending policy now use the new path.
- Pre-push now combines README screenshot drift detection with the existing documentation/LLM update gate in one orchestrator: real changed paths are the sole gate decision, while Angular/Conventional Commit type and scope are diagnostic signals that cannot override path impact. Screenshot drift regenerates managed files and aborts the push; every blocked push identifies the incomplete operation and prints recovery steps for human review, commit, and retry.
- Living-styleguide examples now use the current component APIs and realistic action semantics. The bounded `docs-update` task may synchronize `src/App.tsx`, `src/examples/**`, and managed screenshots, with zero screenshot drift enforced as a deterministic validator.

### Fixed

- **Device chrome capability warnings**: development warnings now fire only when the selected model truly lacks `statusBar`, `safari`, or `dynamicIsland`, avoiding false “ignored” warnings for valid iPhone 17 chrome options.
- **AI docs pre-push teardown**: the runner now treats the Codex process `exit` as the execution boundary and closes its pipe readers, avoiding a wait-until-timeout when a helper keeps stdout/stderr handles open.
- **Geist parity fixes (14 items, verified live with Playwright)**: inline error text converged to `--error-foreground`; `--link` corrected to official `#0072f5`; Entity description, JsonView punctuation, Textarea/Input text, and Badge pill text colors aligned with the official implementation; FileTree label and Video timestamp typography completed; Drawer/Modal trigger buttons changed to the default black-on-white; docs page H1 responsive sizing (24px mobile / 40px desktop).
- Tooling fix: the AI docs runner now rejects configurations that set both `--sandbox` and `--approve-for-me` (the flags are mutually exclusive; approve-for-me implies the workspace-write sandbox).
- Hook security hardening: production uses a fixed Codex template and deterministic validations, a minimal environment allowlist, suppressed raw Agent stderr, and checks for mutations to existing untracked files and Git metadata; the emergency skip returns a Git-compatible success code while retaining a prominent warning.
- Documentation accuracy: corrected the Button, Toast, Progress, and Feedback API/guide descriptions to match real exports and props; capped the Middle Truncate demo on mobile and allowed long paths to wrap inside structured guide cards, eliminating horizontal overflow at a 320px viewport.
- Input affixes now form a flush three-segment control while preserving the fixed role of styled affixes when disabled; Select now associates explicit or visible labels with its trigger. The examples also fix filtered bulk selection, reset actions, and table-header semantics.
