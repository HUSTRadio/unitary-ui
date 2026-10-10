# Nonlinear motion curve verification

[简体中文](./apple-motion-curves-2026-10-10.md)

The implementation, complete unified verification and actual release-package checks pass. The signed implementation commit is `a0760356c8377743949e6ed6aae2f43b2a24ada5`, with signature status `G`. The design reference is [Apple's motion guidelines](https://developer.apple.com/design/human-interface-guidelines/motion); curve values are project choices, not official Apple constants or a claim to reproduce platform spring physics.

## Implementation contracts

[src/styles/index.css](../../src/styles/index.css) is the only parameter source. The [token generator](../../scripts/generate-token-catalog.mjs) derives a small internal JS default table without another public entry or a manually maintained copy of project defaults. Full contracts appear in the [curve specification](../design/apple-motion-curves.en.md) and [Hitu + Motion guide](../guides/hitu-motion.en.md).

| Purpose | Bezier parameters | Tokens |
| --- | --- | --- |
| Quick response, soft finish | `(0.22, 1, 0.36, 1)` | `--ease-snap`, `--ease-pop`, `--ease-stagger`, `--ease-toast`, `--ease-out` |
| Smooth start and finish | `(0.42, 0, 0.58, 1)` | `--ease-in-out` |
| Accelerating exit | `(0.4, 0, 1, 1)` | `--ease-in` |

All three defaults are monotonic, avoid overshoot and reach exact endpoints. The feedback / state / overlay / expansive tiers remain 150 / 250 / 350 / 500ms. Delays, choreography, loading-loop periods and data geometry interpolation retain their meaning.

- **CSS / Motion**: every [useMotionTransition](../../src/lib/motion.tsx) tier reads scoped `--ease-snap`, retaining `TokenOptions`, `ms` / `s` conversion and valid nonlinear overrides. Missing, invalid, linear, identity-Bezier, zero-duration or reduced-motion configurations complete instantly without a numeric duration fallback. Default CSS transitions finish softly, and existing independent exits accelerate out. Constant-rate exceptions are registered only for continuous loading rotations.
- **Hitu**: [layer interpolation](../../src/vendor/hitu/interpolation.ts) uses the smooth default for missing, invalid or identity-linear `cubic`, retaining valid authored curves and sparse-keyframe inheritance. Hitu and scrolling share a pure function that solves Bezier x for time before calculating y; Motion parses parameters from the same module and delegates execution to its engine. SSR defaults need no browser globals. Motion owns outer nodes, while Hitu owns internal SVG layers.
- **Carousel / charts**: the [Carousel](../../src/components/ui/carousel.tsx) union is `"slide" | "fade" | "fade-scale"`, migrating `fade-linear` to `fade`. All three effects retain 500ms and use the quick-finish curve. The four charts disable Recharts' built-in Tooltip movement animation; wrappers use feedback timing and `--ease-snap`, remove transitions under reduced motion, and retain coordinates and geometry interpolation.
- **Scrolling / lifecycle**: [shared RAF scrolling](../../src/lib/scroll-animation.ts) applies state timing and `--ease-in-out` to Scroller, SidebarNav / Tabs active-item tracking, chart legends and website anchors. It retains per-container exclusivity, replacement from the current position, user interruption, immediate targets under dynamic reduced motion and unmount cleanup. RTL, bounds, local containers and anchor offsets remain, and legend state follows actual scrolling. [Select](../../src/components/ui/select.tsx) retains its exit name under reduced motion and completes Presence unmounting and scroll-lock release with the existing global `0.01ms` duration, without visible motion. [HamburgerMenu](../../src/components/ui/hamburger-menu.tsx) and [ExpandPanel](../../src/components/ui/expand-panel.tsx) return trigger focus with `focus({ preventScroll: true })`, preventing native scrolling caused by that operation.

Existing engines, focus, presence, measurement and callbacks remain. Hitu's [pinned provenance and local-modification record](../../src/vendor/hitu/SOURCE.md) and [complete MIT license](../../src/vendor/hitu/LICENSE) remain, with subsequent easing maintenance owned by this project.

## Findings and fixes during implementation

| Finding | Fix and regression |
| --- | --- |
| A cancellation callback synchronously started a new scroll, but the older request overwrote it and left two RAFs. | Per-container request sequencing makes the latest request win; regressions check one RAF, isolation of old handles and an exact destination. |
| Anchor migration omitted `scroll-padding`, and centering omitted asymmetric margins. | Read container start/end padding, target start/end margins and borders, covering local start/center alignment. |
| App Shell could run different-owner animations in parallel when replacing an inner anchor scroll with outer Sheet centering. | Explicitly cancel the handle before replacement and on unmount, covering cross-container changes. |
| Default navigation for mobile-menu section anchors changed the documentation hash. | The consumer prevents local anchor default navigation, preserving the documentation route and local scrolling. |
| HamburgerMenu / ExpandPanel focus return must leave ancestor scrolling unchanged. | Add `preventScroll` policy regressions; this path is not identified as the cause of the outer jump observed in this browser run. |
| Playwright automatically scrolled during click retries while waiting for the scrim, invalidating a baseline recorded too early. | First run `navigation.click({ trial: true })` to finish actionability checks and automatic scrolling, then record the baseline and perform the real click. Strict hash, local-offset and ancestor-position assertions remain; all four final cases pass on the first attempt. |
| Enabling reduced motion during Select exit removed animation-name without finishing Presence, leaving content and scroll locks. | Retain the exit name and complete the end event with `0.01ms`; real-browser tests verify unmounting, focus and lock release. |
| The duration ledger retained an obsolete `0s` exception after Drawer immediate state became `transition: none`. | Remove the stale entry, retaining exact correspondence between ledger and source. |
| The new chart browser spec lacked unified-verification mappings, stopping complete verification fail-closed. | Register the four charts, preference module and styles; rerun complete verification after all 35 mapping regressions pass. |

Curve governance also covers JSX, keyframe arrays, identity Beziers and CSS configuration, retaining the meaning of static gradients and data geometry interpolation.

## Complete verification evidence

`pnpm run verify -- --full` checks the final uncommitted tree on baseline `cf5da135b478ccab74773f82c2841f25b732cf19`. Run `b49fa9a8` is `PASS`, exit 0, `inputsChanged=false`; all 15 / 15 steps exit 0, taking 4,073,350ms. Source then remains unchanged and is signed as `a0760356`. This record does not claim that complete verification was rerun after committing.

| Check | Observed result |
| --- | --- |
| Unit tests | All 288 files and 2092 tests pass. |
| lint | Exit 0 with 20 warnings: 17 existing, plus two intentional sparse-array regression warnings and one unnecessary-escape style warning in this change's tests. |
| Tokens / types | Token checking, source typecheck and test typecheck each exit 0. |
| Production builds | Styleguide, website and library each exit 0. |
| Package-root checks | 9 / 9 pass, exit 0. |
| Complete browser run | All 48 specs and 516 cases pass on the first attempt: 0 flaky, 0 unexpected, 0 skipped, no missing or incomplete cases; duration 2,928,731.815ms. |
| Related motion behavior | Includes 16 chart cases, four anchor cases, four Motion intermediate-progress cases, dynamic reduced motion in Select and Hitu, carousel, scroll and focus regressions, all passing on the first attempt. |
| Performance | The existing 20ms scroll-frame budget is retained and passes; this does not guarantee frame rates on other devices. |
| LLM corpus | Deterministic checking of 240 bilingual pages exits 0. |
| README screenshots | Eight pages × two themes = 16 images; drift checking exits 0 and both managed regions contain the complete references. Actual visual review of all 1440×900 images finds no blanks, broken images or error states. |

Screenshots capture a fixed viewport: lower Tabs on the components page and later paged-media content naturally extend below the frame. Static image review does not replace complete browser animation and interaction evidence.

Environment: Node 24.21.0, pnpm 11.20.0, React / ReactDOM 19.2.8, Vite 8.2.1, Motion 14.0.0, Vitest 4.1.10 and Playwright 1.62.1.

## Actual release package

Actual packing and archive inspection exit 0. The archive contains 194 entries, including 186 dist files, 16 fonts and two ESM / CJS lazy chunks. Intended entries, declarations, the complete Hitu MIT license and bilingual third-party notices are present. Archived dist files match the verified build byte for byte. Running the existing [package checks](../../scripts/test-package-imports.mjs) against the unpacked archive passes 9 / 9, exit 0, with no SSR / hydration errors.

- Archive size: 25,909,246 bytes.
- SHA256: `1d00d386e02688c9e8e153bfc4302bf3b233f004b0d2214a6ed1cfadb3c77767`.

## Consumer build measurements

[measure-motion-bundles.mjs](../../scripts/measure-motion-bundles.mjs) builds actual package-root consumers without source aliases. Every fixture includes React, Button and published CSS, adding Motion, both Hitu assets or their combination. The final `node scripts/measure-motion-bundles.mjs` command exits 0.

Every emitted JS / CSS file is independently gzip-compressed at level 9 and summed, including lazy chunks. Only separately emitted font, image and sourcemap files are not counted individually; embedded resources remain part of their containing JS / CSS files. This measures complete output rather than initial transfer, and unified root exports do not guarantee zero cost for every consumer.

| Consumer | Final JS bytes | Baseline JS gzip bytes | Final JS gzip bytes | Same-fixture before/after delta | Increment over final Button |
| --- | ---: | ---: | ---: | ---: | ---: |
| Button | 1,127,822 | 295,831 | 297,590 | +1,759 | 0 |
| Motion | 1,218,311 | 329,621 | 331,026 | +1,405 | +33,436 |
| Hitu, both assets | 1,132,199 | 297,920 | 299,369 | +1,449 | +1,779 |
| Combined | 1,222,674 | 331,520 | 332,835 | +1,315 | +35,245 |

The baseline is the built pre-change `cf5da13` snapshot with the same fixtures. Final CSS is 648,483 bytes / 279,879 gzip bytes in every fixture. Baseline CSS gzip is 279,845, a +34-byte before/after change in each fixture, with zero CSS increment relative to final Button.

Principal reproduction commands:

```sh
pnpm run verify -- --full
pnpm run build:lib
pnpm run test:package
node scripts/measure-motion-bundles.mjs
```

This report records observed implementation, verification, archive and consumer-build evidence. Final local-mainline merging and restoration of the original power settings are checked separately at delivery.
