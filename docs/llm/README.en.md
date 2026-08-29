# Unitary UI LLM Reference Corpus

[Simplified Chinese primary](README.md)

This directory provides stable Markdown generated from the real documentation pages for AI agents and retrieval systems. Simplified Chinese is the primary locale; English is the alternative locale.

## Entry point and sources of truth

- Machine-readable entry point: [`index.json`](index.json)
- Chinese pages: `pages/zh-CN/**`
- English pages: `pages/en-US/**`
- Canonical routes: `docs/geist/src/data/docs-routes.ts`
- Canonical component source: `src/components/ui/**`
- Versioned LLM task packages and prompt paths: [`../../llm/README.en.md`](../../llm/README.en.md)

`index.json` lists both locale paths, titles, categories, and SHA-256 values in canonical route order. Generated pages are not independent sources of truth. Fix the real component, route, API registry, demo, or guide first, then regenerate.

## Generate and verify

```bash
vp run docs:llm:generate
vp run docs:llm:check
```

`docs:llm:generate` starts a preview owned exclusively by the current command, generates every page from semantic HTML, and atomically replaces the artifacts. `docs:llm:check` generates a temporary result and compares bytes without writing tracked files; drift exits non-zero.

## Usage boundaries

1. Read `index.json` first.
2. Load only pages relevant to the current task.
3. Verify real exports, TypeScript props, and demo source.
4. Do not infer APIs, states, or behavior that the page does not document.
5. Do not edit `pages/**` or `index.json` by hand.
