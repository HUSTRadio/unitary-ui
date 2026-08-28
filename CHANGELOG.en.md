# Changelog

[← 简体中文版本：CHANGELOG.md](./CHANGELOG.md)

All notable changes to this project are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versioning follows Semantic Versioning.

## [Unreleased]

### Added

- **Bilingual component guide registry**: all 73 components have structured guides in Simplified Chinese (primary) and English (alternative) — when to use / when not to use / example index / accessibility / controlled behavior / responsive / theme — with examples referencing real existing demo keys; rendered on component docs pages.
- **LLM reference corpus**: `docs/llm/` generates 164 Markdown pages (82 docs routes × 2 locales) plus the machine-readable `index.json` (with content hashes); `docs:llm:generate` / `docs:llm:check` commands with drift detection.
- **Configurable AI documentation update contract**: `docs-agent.config.json` + JSON Schema define the agent CLI / model / impact scope / allowed write scope; fixed safety contract (fixed English update prompt, credentials never read or passed, no automatic commit or push, out-of-scope writes rejected, legitimate doc diffs abort the push for human review); `.githooks/pre-push` + explicit installer.
- **MIT license and attribution**: English `LICENSE` (legally authoritative) + Simplified Chinese reading guide `LICENSE.zh-CN.md` (unofficial, non-binding); bilingual `CREDITS.md` / `CREDITS.en.md` and `THIRD_PARTY_NOTICES.md` / `THIRD_PARTY_NOTICES.en.md`; the npm publish manifest includes the license and third-party notices.
- **Bilingual README**: `README.md` (Simplified Chinese) and `README.en.md` (English) for open-source users and LLMs — installation, minimal example, docs entry points, LLM usage flow, contributing, and security.
- **Documentation contract tests**: component-doc completeness, bilingual parity, LLM corpus export, license, README/AGENTS, and changelog contracts.
- Font metrics probe `src/lib/font-metrics.ts` (self-registering + `useFontMetrics` hook) with tier contract tests.
- Navigation shell component family (framework extension): Navbar / SidebarNav / Footer / HamburgerMenu / ExpandPanel / BottomSheet, unified 500ms cubic-bezier(0.32,0.72,0,1) animation with motion-reduce fallback, controlled/uncontrolled dual mode.
- Shell breakpoint exception: sidebar breakpoint kept at lg(1024px) (intentional deviation from the official xl(1200px), serving the VS Code embedded-browser scenario).
- Button press states (Apple HIG requirement) and default minimum width (min-w = height × 2.2); Progress label/labelPosition 8-direction labels and 300ms transition.
- `docs/geist/src/__tests__/parity-regression.test.ts`: source-assertion regression tests for parity fixes.

### Changed

- **Font stack strategy**: all @font-face rules renamed with Subset suffixes; system-first font stacks (machines with OPPO Sans / HarmonyOS Sans installed hit the system fonts with zero downloads, others fall back to self-hosted tiered subsets); manual tier declaration via root `data-font-tier="oppo|hmos|system"`; tier switches re-measure with a 120ms debounce (idempotent).
- **Table default alignment (breaking)**: removed implicit `last:text-right` from `TableHead` / `TableCell`; everything is left-aligned by default, matching official Geist. Numeric columns relying on the old implicit right alignment must now use explicit `align="right"` or `text-right`.
- Publish boundary: `files` now includes `LICENSE`, `LICENSE.zh-CN.md`, and the bilingual third-party notices; font subsets are distributed with `dist` (license status in THIRD_PARTY_NOTICES).
- OPPO Sans 4.0 licensing boundary: official terms are "free for commercial use but no download channel provided"; only tiered subsets are self-hosted; full fonts must be obtained from OPPO's official channels, and compliance confirmation is the user's responsibility.

### Fixed

- **Geist parity fixes (14 items, verified live with Playwright)**: inline error text converged to `--error-foreground`; `--link` corrected to official `#0072f5`; Entity description, JsonView punctuation, Textarea/Input text, and Badge pill text colors aligned with the official implementation; FileTree label and Video timestamp typography completed; Drawer/Modal trigger buttons changed to the default black-on-white; docs page H1 responsive sizing (24px mobile / 40px desktop).
- Tooling fix: the AI docs runner now rejects configurations that set both `--sandbox` and `--approve-for-me` (the flags are mutually exclusive; approve-for-me implies the workspace-write sandbox).
