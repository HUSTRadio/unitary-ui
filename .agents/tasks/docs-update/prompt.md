# Documentation synchronization task

## Procedure

1. Read `CHANGELOG.md` and `CHANGELOG.en.md` first. Inspect `[Unreleased]` and the target release entries before reading the wider documentation tree.
2. Compare those entries with the pushed commits, changed paths, and bounded diff supplied by the runner. Use the changelog as a fast freshness signal, never as sufficient proof.
3. If a public behavior or API change has no changelog entry, update both changelogs: Simplified Chinese first in `CHANGELOG.md`, with an equivalent English alternative in `CHANGELOG.en.md`.
4. Reconcile the canonical source, living demo pages in `src/App.tsx` and `src/examples/**`, Show Code, API registry, human documentation, and generated LLM reference corpus against the actual implementation.
5. Treat the living styleguide as documentation: update only `src/App.tsx` and `src/examples/**` when their examples drift from the current public component API. Do not change component runtime behavior or edit `src/components/**` as part of this task.
6. When living demos, themes, navigation, or screenshot metadata change, run `pnpm run docs:readme:screenshots`, review the generated README assets, then run `pnpm run docs:readme:screenshots:check`.
7. Run every deterministic generation and validation command supplied by the runner. A changelog entry never overrides a failing deterministic check; fix the underlying documentation drift instead.

## Completion criteria

Stop only when:

- every changed public behavior has a bilingual changelog entry;
- the human documentation, LLM reference corpus, and API registry match the implementation;
- every deterministic check supplied by the runner passes;
- no file outside the task manifest's allowlisted documentation paths was modified.

If any check fails or any required fact cannot be verified from the repository, report the blocker explicitly instead of guessing.
