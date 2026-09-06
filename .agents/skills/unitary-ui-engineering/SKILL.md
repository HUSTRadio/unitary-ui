---
name: unitary-ui-engineering
description: Use when refactoring or extending unitary-ui.
version: 0.1.0
---

# Unitary UI Engineering

## Principle

Preserve observable contracts while making the smallest change that localizes real complexity. Repository evidence outranks file size, convention, and model self-report.

## Before changing code

1. Read the root `AGENTS.md`; inspect the current implementation, consumers, tests, package entry, and canonical documentation sources.
2. Before extracting or deleting code, establish why it exists. Use available history when intent is unclear. Do not infer an abstraction from line count or a fixed number of callers.
3. Name the contracts being protected: named/default exports, package-root symbols, props, controlled and uncontrolled callbacks, cancellation, accessibility, DOM hooks, styles, examples, and generated documentation.

## Make the boundary earn its cost

Extract only when the new boundary hides coherent complexity or localizes an expected class of change. A pass-through module, a constants-only file, or several callers is not sufficient evidence. If no independently useful boundary exists, leave the structure intact and improve characterization coverage instead.

Move behavior without renaming or exporting internals. Verify the actual export chain: a new package-root symbol usually changes the source entry; it does not imply that `package.json.exports` needs a new subpath. Never claim named/default compatibility without reading the declarations.

## Evidence and documentation

- Existing verified repository contracts can protect an internal refactor. A new Geist parity claim requires relevant official evidence. If that evidence is unavailable, block only the unverified claim; do not guess or automatically block unrelated internal work.
- Derive the documentation surface from the current repository and generators. Do not invent filenames, extensions, demo IDs, commands, or export paths. Generated `docs/llm/**` files are outputs, not the source of truth.
- Policies listed in a task manifest govern that task. In particular, the docs-update agent's documentation-only allowlist does not prohibit the primary implementation from changing source under the root `AGENTS.md` contract.

## When the documentation agent is unavailable

Manually reconcile the canonical bilingual docs and generated corpus, then run the deterministic validators. `UNITARY_DOCS_HOOK_SKIP=1` is an explicit emergency bypass evaluated before the runner; it is not validation and has no source-defined “local versus CI” distinction. Use it only with the authorization appropriate to the push, record that it was used, and never report the skipped gate as passed.

A blocker is not Definition of Done. Report the exact missing evidence, affected surface, commands and exits, and recovery condition. If required documentation still drifts, status remains `BLOCKED` even if a push can be bypassed.

## Verification

Run the narrowest behavior checks first, then every repository gate required by the changed contract. For package-boundary changes, inspect the built package through the existing package test. Report actual commands, exit codes, protected contracts, and unresolved risks; never substitute test counts, source-string matches, or an agent's answer for observed behavior.

## Red flags

- “The file is large, so split it into N files.”
- “Multiple consumers prove this abstraction.”
- “The component keeps its default export” without reading the export.
- “Root export” interpreted as a new `package.json.exports` entry without tracing the bundle entry.
- Task-specific write rules applied to every contributor.
- `SKIP=1`, `BLOCKED`, or a build reported as documentation or interaction proof.
