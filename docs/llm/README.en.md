# Unitary UI LLM Reference Corpus

[Simplified Chinese primary](README.md)

This directory contains Chinese and English Markdown generated from the documentation site for AI assistants and retrieval systems.

## Entry point and sources of truth

- Machine-readable entry point: [`index.json`](index.json)
- Chinese pages: `pages/zh-CN/**`
- English pages: `pages/en-US/**`
- Canonical routes: `docs/site/src/data/docs-routes.ts`
- Canonical component source: `src/components/ui/**`
- Versioned LLM task packages and prompt paths: [`../../.agents/README.en.md`](../../.agents/README.en.md)

`index.json` lists both locales’ file paths, titles, categories, and SHA-256 checksums in route order. To correct an error, update the component, route, API data, example, or guide first, then regenerate.

## Generate and verify

```bash
vp run docs:llm:generate
vp run docs:llm:check
```

`docs:llm:generate` starts its own preview server, generates Markdown from page HTML, and replaces the output files when complete. `docs:llm:check` generates a temporary copy and compares it byte by byte with the repository files. Differences produce a non-zero exit code; the check does not modify files.

## Usage boundaries

1. Read `index.json` first.
2. Load only pages relevant to the current task.
3. Verify real exports, TypeScript props, and demo source.
4. Do not infer APIs, states, or behavior that the page does not document.
5. Do not edit `pages/**` or `index.json` by hand.
