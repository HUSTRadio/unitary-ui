# Glass CSS material replacement

Started: 2026-10-19. Final verification: 2026-10-20. Status: implementation delivered; two acceptance gaps remain below.

## Agreed direction

Replace the previous Glass appearance and SVG optical engine with an independent CSS material inspired by the rendered mechanisms of [whu.sb](https://www.whu.sb/). Reference inspected at upstream Luotopia commit `b734870ae8ebdfd0e4649eaad7484858b6b3485b`; no upstream source or assets are copied. Preserve Unitary colors, dimensions, radii and layout. Keep Solid, Acrylic and Aero behavior and the v2 preference migration.

| Preset | Light / dark fill | Blur | Use |
| --- | --- | --- | --- |
| Clear | 28% / 36% | 8px | Explicit media controls, with a separate readable backing |
| Regular | 56% / 76% | 10px | Independent secondary actions and toolbars |
| Dense | 80% / 86% | 20px | Menus, lists and floating text surfaces |

Fixed/sticky navigation uses a separate 24px blurred background layer; its out-of-bounds flyout samples independently. Saturation is 160% / 150%. Uniform translucent fill is separate from a restrained static directional sheen, fine inset rim and soft shadows. Worst-case black/white background tests rejected the initial 46% / 60% Regular fill (3.89:1 light independent action, 2.59:1 dark hovered toolbar); the final preset increases fill and limits dark sheen/glint peaks to 8%. Plain content cards remain unchanged; combine a `material-base/small/medium/large` utility with a `material-glass-clear/regular/dense` class to opt in. Plain cards have static sheen, without automatic movement or a global pointer tracker.

## Implementation

- Retire the internal SVG runtime, geometry/PNG cache, optical layer builder, physics and document input event bus. ThemeProvider no longer starts an optical manager. CSS capability and accessibility checks govern Glass on all engines.
- Keep the existing internal control hook for bounded, RAF-coalesced CSS glint coordinates. Fine pointers move a visible glint; contact freezes its position; keyboard contact is centered; touch only responds to contact. No control layout or author transform changes. Use existing feedback/state timing and honor `useMotionReduced()` and event cancellation.
- Preserve one backdrop sampler per functional layer, author background/filter/shadow priority, semantic states, focus rings, independent Portal surfaces and existing opaque stem/filtered-contour exceptions.
- Keep public `glass-blur`, `glass-overlay-blur`, `glass-opacity` tokens under their full `--material-texture-` prefix. Remove Glass ior, roughness, thickness, absorption, light-azimuth, light-intensity, ambient-intensity, ambient-color, refraction and edge-width tokens from declarations, types and docs. This breaking removal is explicitly approved: migration removes these old overrides, with no no-op aliases. No component props or dependencies are added.
- Maintain local preset/author override/reset precedence. Contrast-more uses 92% / 96% fill and stronger neutral contours; reduced transparency and forced colors resolve to Solid. Foreground text remains unfiltered.

## Verification and delivery

1. Record the starting workspace in ignored `.scratch/glass-css-replacement/start.json`; preserve unrelated changes. Run narrow hook, texture, token and browser regressions before broader verification.
2. Replace obsolete physics/SVG tests with CSS behavior: actual blur, unchanged foreground geometry, visible moving glint, interpolated hover, nested sampling, fixed navigation and independent flyouts, presets/author reset, Portal and live accessibility changes.
3. Cover six existing viewports, both themes and desktop DPR 1/2; real Chromium, Firefox and WebKit capability/fallback checks. An engine/host that fails an isolated backdrop-blur control remains missing paint evidence, never a passing blur test.
4. Migrate the production performance tool from SVG/map counters to CSS sampling and input/state measurements. Retain independent artifacts, first input versus stable phases, P95 <=20ms, no >50ms long tasks and no persistent idle RAF. Retain historical failed measurements.
5. Update canonical bilingual docs, examples and Changelog; generate token catalog and LLM corpus and check determinism. Review exact-path `verify -- --dry-run`, execute the relevant plan or focused equivalents if BLOCKED_SCOPE over-selects. Check impacted screenshots and all three templates. No commit or push.

## Evidence

All evidence below is task-scoped. Existing unrelated workspace edits are excluded. Browser JSON, screenshots, raw performance samples and build hashes are retained under ignored `.scratch/glass-css-replacement/`; package consumer evidence also uses `.scratch/template-package/`.

### Implementation and regression checks

- `pnpm run tokens:generate`: exit 0; 540 catalog entries. Obsolete physical Glass tokens are removed.
- `pnpm run typecheck`, `pnpm run typecheck:docs`, and the affected test TypeScript project: exit 0.
- Final focused hook/material/theme/docs/performance run: six suites, 121 passing tests, exit 0. Related API/token suites and the verification-policy regression were run separately; all passed after the deleted-test discovery fixture was corrected.
- The final v9 CSS performance harness has 18 passing unit tests. It records trusted input, actual value commits in the applicable control/lifecycle window, native open-list focus/scroll changes, all visible host/pseudo-element samplers, and surface/text position and size. Dense text retains raw viewport coordinates plus compensation for its real native scroll ancestors; host displacement and unrelated text movement still fail.
- Scoped `oxlint` and task-file `git diff --check`: exit 0.
- `pnpm run build:lib`: exit 0. No third-party runtime dependency is added.

### Rendered behavior

- Chromium core browser run: 139 passed, zero unexpected failures/skips/flaky cases. Includes three presets, six viewports, both themes, DPR 1/2, foreground geometry, actual pointer glint pixels, hover interpolation, Portal surfaces, live accessibility changes and native component behavior.
- Additional production preset/contrast/CSP cases: 3 passed. Final author-transition and CommandMenu mask/content single-sampler regressions: 3 passed. Related author image/filter, semantic/stem, accessibility restoration and Aero-preservation checks passed in independent focused runs.
- Worst black/white/photo background checks cover default, hovered, focused, pressed and selected states. Measured minimum text contrast: independent action 5.40:1 light / 4.76:1 dark; Toolbar 7.28:1 / 4.76:1; Clear with explicit backing 9.54:1 / 5.80:1; Dense 10.16:1 / 7.06:1.
- Real Firefox/WebKit run: 8 passed and 4 explicitly skipped. Pointer/state pixels pass in both themes. The isolated native backdrop-blur control does not paint on this host for either engine; their native blur paint acceptance remains incomplete. Changing a Chromium user agent is not counted as another engine.
- A final lifecycle audit found a separately disabled Tab can retain contact state. Two new regressions fail before the fix (exit 1). Cleanup now resets only invalid touched surfaces after each React commit, retaining other items' queued input; the hook suite passes 17/17. The final production artifact then passes all 20 interaction/state/geometry/pixel/motion browser cases and all nine package import/SSR/browser checks (exit 0). No observer or persistent frame loop is added.

### Documentation and consumers

- `pnpm run docs:llm:generate`, then `pnpm run docs:llm:check`: exit 0; 124 routes in each locale, no deterministic-generation drift.
- `pnpm run docs:readme:screenshots:check`: exit 0; eight styleguide pages in both themes, no managed screenshot drift.
- All three templates: type checks and production builds pass. Existing Solid matrix: 84/84 passed. Final Glass matrix: 36/36 passed (three templates, six viewports, both themes, DPR 2), including the repaired CommandMenu single-sampler boundary.
- `node scripts/test-template-package.mjs`: exit 0; all three independently installed tarball consumers pass type/build checks and all three portable browser smoke tests.
- `pnpm run test:package`: the first nine independent package import/SSR/hydration/geometry/font/license checks pass, but the overall command exits 1 when the existing unrelated `docs/site/build/motion-regression-fixture.tsx` imports repository-internal `src/components/ui/expand-panel` inside the installed documentation consumer. This task does not add a new public export or alter unrelated motion work to clear that failure.

### Production performance measurement corrections

The final production artifact is `production-tabs-final-20261019` in the task scratch directory (SHA-256 `436c41137876e76ffd63fe78c70e8db4713227107de1d218d97af3d2be8b6858`). Product sources are frozen during sampling.

- The v7 full-matrix attempt is interrupted after five recorded samples: Dense/Aero receives keyboard events but does not commit a changed value. Select defers focus changes, so the probe must wait for the focused option before Enter. Raw failure and interruption records remain; this run does not count as acceptance.
- The v8 three-condition Dense diagnostic then records Aero lifecycle tasks of 52ms and 54ms. The subsequent matrix is interrupted after seven samples when the Solid control records a 55ms task. These failures remain visible. No threshold is relaxed and no successful retry overwrites them.
- Audit confirms the old Dense `interaction` window repeatedly closes/recreates its Portal, restores focus and starts entry motion. It measures a complete selection lifecycle, rather than stable input on an already-open surface. The corrected tool separates that lifecycle and its value commits/long tasks from five seconds of open-list keyboard navigation or native touch scrolling. Stable interaction/scroll budgets remain P95 <=20ms and no >50ms task. Lifecycle costs are reported separately, never summarized as an all-phases absence of long tasks.
- A separate diagnostic-only Chromium timeline captures 12 selection/reopen cycles per material. Its largest main-thread tasks are approximately Solid 45ms, Glass 39ms and Aero 47ms, dominated by event dispatch/microtasks and repeated style/layout. This trace does not reproduce the earlier >50ms tasks and is not substituted for performance acceptance evidence.
- Fresh v9 lifecycle/steady regression: six conditions (desktop and native touch, dark DPR 2, Solid/Aero/Glass), exit 0. Stable interaction/scroll P95 is approximately 16.8ms, no >50ms stable tasks, and the same Portal remains open. Separately recorded lifecycle tasks reach 59ms for Aero and 56ms for Solid; Glass records a 50ms task. These lifecycle results remain visible and are not described as budget passes.

### Final production performance result

Command (exit 0):

```sh
node scripts/audit-glass-performance.mjs --artifact .scratch/glass-css-replacement/production-tabs-final-20261019 --output .scratch/glass-css-replacement/performance-v9-final --profiles desktop-light-1,desktop-dark-1,desktop-light-2,desktop-dark-2,mobile-light-2,mobile-dark-2 --usages clear,regular,dense --textures solid,aero,glass --repetitions 3 --phase verification
```

Fresh Chromium `151.0.7922.34` evidence: 162/162 unique independent cases pass the v9 stable contracts. Each of the six profiles has 27 cases; each material has 54. Desktop is 1280x900 at DPR 1/2 in both themes; mobile is 390x844 at DPR 2 in both themes with native touch input. Every stable interaction and scroll window exceeds 5,000ms (minimum 5,051ms), P95 is at most 16.8ms, with zero >50ms stable tasks, zero idle RAF requests and zero raster builds/encodes. These are page frame-scheduling intervals, not GPU presentation or INP.

Selection lifecycle costs remain separate and explicitly visible:

| Material | Stable cases | Maximum stable P95 | Lifecycle tasks >50ms | Longest lifecycle task |
| --- | ---: | ---: | ---: | ---: |
| Solid | 54 | 16.8ms | 23 | 64ms |
| Aero | 54 | 16.8ms | 35 | 70ms |
| Glass | 54 | 16.8ms | 18 | 60ms |

This result does not claim every complete Select selection/reopen cycle is free of long tasks. That workflow includes Portal creation, positioning, focus restoration and motion; its costs are retained rather than removed from the report.

The complete run is `.scratch/glass-css-replacement/performance-v9-final/2026-10-19T15-37-38-544Z-40c6db/`; the compact audit is `.scratch/glass-css-replacement/performance-final-report.json`. Summed case wall time is 2,729,171ms. Artifact SHA-256 is `436c41137876e76ffd63fe78c70e8db4713227107de1d218d97af3d2be8b6858`, source CSS SHA-256 is `aa4f5106dba1c3f2bbe0ca00e57d1eadcd2fb5c29def2075826bbebafd2b5667`, and measurement harness SHA-256 is `732d8fcc90c16330a7decec8b2663e482603a13013d0db2fc0bb06ba86f1ad7e`.

### Unified validation scope

The reviewed exact task-file `pnpm run verify -- --dry-run --path ...` exits 0, but shared styling, removed runtime files and documentation-shell inputs conservatively select 309 unit inputs, 57 browser specs, all layout routes and package acceptance. Executing that reviewed task-file invocation returns `BLOCKED_SCOPE` (exit 2, no checks executed). The guard is retained. The focused checks above provide fresh evidence for the affected contracts; no `--full` or mechanical broad override was used. `verify-final-dry-run.log` and `verify-final-execution.log` are retained in the task scratch directory; the execution log identifies its complete guarded summary under `.scratch/verification/`.

After the complete v9 matrix, a further planner refresh using the unchanged exact path list was requested but did not execute: automatic approval review could not complete because its usage limit was reached. This was a review availability failure, not a determination that the command was unsafe. The earlier dry-run/guard evidence remains recorded separately; it is not presented as a new post-matrix run. Final v9 harness tests (18/18), test TypeScript checking, scoped lint, task diff checking and the repeated complete bilingual corpus check all have fresh exit-0 evidence.

### Remaining acceptance gaps

1. Native blur paint acceptance on real Firefox/WebKit is incomplete on this host: four isolated-control cases are skipped rather than promoted to passes. Their interaction/fallback checks remain valid.
2. Full installed-documentation consumer acceptance remains blocked by the existing unrelated motion fixture's repository-internal ExpandPanel import. All three independent template consumers and the nine direct package checks pass.

The implementation-stage workspace audit confirmed the starting HEAD was unchanged, staging was empty and no file outside the task list changed relative to the starting snapshot. Earlier failed/interrupted performance runs remain available. Select lifecycle long tasks are a separately recorded limitation, not a claim of complete interaction latency acceptance.

No files were staged, committed or pushed during implementation and verification. On 2026-10-20 the user subsequently authorized a local commit. Delivery includes the required Glass component/fixture integration and selects only Glass hunks from shared files; unrelated workspace edits remain outside the commit. A separate motion commit advanced HEAD before this delivery audit. No push is requested.

### Delivery snapshot checks (2026-10-20)

The commit selects 52 files and isolates Glass hunks in six mixed files. Required component and fixture integrations are included. Getting-started, website/templates, Sheet, other verification-tooling work and the separate Tabs scrollbar fix remain outside this commit. The staged tree was exported to an ignored snapshot so these exclusions could be checked independently of the dirty workspace.

- Library TypeScript compilation and token-catalog check: exit 0.
- Seven applicable Glass/Navbar regression files: 125 passing cases across the initial run and the corrected 35-case theme rerun. Snapshot isolation first exposed 16 test targets belonging to uncommitted website/templates; that fixture-list hunk was removed from the index while preserving the working file. The separate Glass browser-association regression passes (one selected case, 39 intentionally unselected).
- Complete bilingual corpus check against the exact staged snapshot: exit 0, no drift.
- Refreshed 52-path `verify` dry-run: exit 0; reviewed execution still returns `BLOCKED_SCOPE` (exit 2, no checks executed). No broad override was used. Delivery logs are retained under `.scratch/glass-css-commit/`.
- Staged diff checking: exit 0. Existing performance/visual evidence is retained; no unchanged performance matrix was rerun solely for committing.
