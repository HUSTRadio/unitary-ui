# Nonlinear motion curve specification

[简体中文](./apple-motion-curves.md)

The component library, website, living styleguide and Hitu illustrations share nonlinear time curves: controls respond quickly, state changes finish softly, and back-and-forth motion starts and ends smoothly. The design reference is [Apple Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion). The following values are this project's choices, not official Apple parameters, and do not claim to reproduce platform physics springs.

## Curves and durations

`src/styles/index.css` is the only parameter source. The existing token generator derives a small internal JS default table from CSS for Hitu and shared time-progress solving. The table adds no package-root public API and must not be edited manually. Server rendering reads generated values without browser globals.

| Meaning | Bezier parameters | CSS tokens | Uses |
| --- | --- | --- | --- |
| Quick response, soft finish | `(0.22, 1, 0.36, 1)` | `--ease-snap`, `--ease-pop`, `--ease-stagger`, `--ease-toast`, `--ease-out` | Control feedback, entering, selection indicators, overlay opening and closing |
| Smooth start and finish | `(0.42, 0, 0.58, 1)` | `--ease-in-out` | Programmatic scrolling, default Hitu segments, breathing and shimmer |
| Accelerating exit | `(0.4, 0, 1, 1)` | `--ease-in` | Existing independent exit phases |

All three defaults are monotonic, avoid overshoot and reach exact endpoints. Time progress is solved against the Bezier x coordinate before computing y; time must not be used directly as the Bezier parameter.

| Tier | Default duration | Semantic token |
| --- | --- | --- |
| feedback | 150ms | `--uni-motion-feedback` |
| state | 250ms | `--uni-motion-state` |
| overlay | 350ms | `--uni-motion-overlay` |
| expansive | 500ms | `--uni-motion-expansive` |

Existing durations, delays and choreography remain. Tailwind's default transition uses feedback timing and a quick-finish curve; enter and exit utilities explicitly select their tokens. Both themes use the same parameters, and scoped CSS overrides remain available.

## Contracts for each animation implementation

- **CSS**: components, CSS modules and the website consume curve tokens instead of hard-coded easing. ProgressCircle value feedback, Avatar, Skeleton and CopyButton follow the same contract.
- **Motion**: the `useMotionTransition(tier, options)` signature is unchanged. Every tier reads `--ease-snap`, retaining `TokenOptions` scoping and unit conversion. Valid custom nonlinear curves remain supported. Missing, invalid, linear, identity-Bezier, zero-duration or reduced-motion configurations complete instantly, without adding a numeric duration fallback.
- **Hitu**: missing, invalid or identity-linear `HituFrame.cubic` uses the smooth-start-and-finish curve. Valid explicit nonlinear configurations remain supported and apply to the segment starting at that keyframe. Sparse transforms inherit prior values and endpoints are exact. Motion owns the outer node and Hitu owns internal SVG layers, keeping transform ownership separate.
- **Charts**: AreaChart, BarChart, LineChart and ComboChart disable Recharts' built-in Tooltip movement animation. The wrapper uses CSS feedback timing and `--ease-snap`. Reduced motion removes that transition; coordinates, clipping and content interactions retain their meaning. Data-line geometry interpolation is unchanged.

Existing Modal, Drawer, Toast, Collapse and Tabs animation implementations remain, without adding a second UI animation engine. Curve changes preserve component focus, presence, measurement, callbacks and cancellation.

Select retains its CSS exit-animation name and completes with the existing global `0.01ms` reduced-motion duration, without visible motion. This lifecycle exception lets Radix Presence receive `animationend`, unmount content and release the scroll lock when reduced motion is enabled during exit. Removing the animation name must not bypass that lifecycle.

## Programmatic scrolling and exceptions

Scroller direction buttons, SidebarNav / Tabs active-item tracking, chart legend buttons and website anchors share RAF scrolling with state timing and `--ease-in-out`.

- A container has at most one active animation. New requests start from the current position, with targets clamped to the scroll range.
- Wheel, touch, drag and relevant keyboard input cancel active animations; direct manipulation remains native.
- Enabling reduced motion during a scroll reaches the target immediately. Unmounting cleans up RAF and listeners.
- Horizontal and vertical axes, RTL, anchor offsets and local scroll-container semantics remain. Do not overlap the animation with native smooth scrolling.
- The App Shell example prevents default navigation for mobile-menu section anchors, preserving the documentation hash route while scrolling only its local container.
- Legend-button state follows actual scrolling and completion events instead of fixed-duration position estimates.

Continuous loading rotations remain constant-rate, with exceptions registered by purpose. Other time animations must not configure linear or identity Beziers. Static gradients, data geometry interpolation and instant state updates are not time curves and are not animation violations. Curve governance complements duration governance without changing existing loop durations.

## Migration steps

1. Replace `fade-linear` with `fade` in `CarouselVariant` uses and selectors. The public union is `"slide" | "fade" | "fade-scale"`; every effect uses a quick-finish curve. The default remains `slide` and duration remains 500ms.
2. Replace scoped `linear` or identity-Bezier overrides consumed by `useMotionTransition` with valid nonlinear `cubic-bezier(...)` values. The old overrides now complete instantly; deliberate instant changes should use zero duration or a reduced-motion policy.
3. Hitu segments that previously omitted `cubic` now start and finish smoothly. Supply an explicit nonlinear tuple for another curve; frame counts, playback controls and ref methods are unchanged.
4. Use shared programmatic scrolling instead of overlapping native smooth scrolling or fixed-duration state updates. Native user input needs no adaptation.

See the [Hitu + Motion guide](../guides/hitu-motion.en.md), [carousel example](../site/src/examples/carousel/variants.example.tsx) and [paged media styleguide](../../src/examples/PagedMediaExample.tsx) for real usage. The initial Hitu integration's package sizes and validation remain in the [historical report](../audits/hitu-motion-2026-10-08.md); they do not establish that this curve migration has passed verification.

## Verification requirements

Curve tests check endpoints, intermediate progress, monotonicity, CSS / JS parameter consistency, valid scoped overrides and invalid configurations. Behavioral regressions cover rapid reversals, repeated scrolling, user interruption, RTL, dynamic reduced motion, StrictMode, unmounting, SSR and hydration. Browser checks retain both themes, desktop and mobile viewports, focus behavior and existing performance budgets. Consumer builds measure gzip increments separately for ordinary components, Motion and Hitu.

Generation and validation claims require fresh command exit codes and artifacts. The commands below are required steps, not statements that they have passed:

```sh
pnpm run tokens:generate
pnpm run tokens:check
pnpm run docs:llm:generate
pnpm run docs:llm:check
pnpm run docs:readme:screenshots
pnpm run docs:readme:screenshots:check
pnpm run verify -- --full
```
