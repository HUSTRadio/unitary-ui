# Unitary UI templates

[简体中文](./README.md)

These independent React + Vite + TypeScript + Tailwind applications are **dynamic consumers** of this library. They follow its current public API and recommended usage, and are updated alongside component usage changes. `workspace:*` selects the current workspace library rather than a published release; the repository lockfile still makes external dependencies and tools reproducible.

| Template                 | Scenario                                                             | Source development port |
| ------------------------ | -------------------------------------------------------------------- | ----------------------- |
| [homepage](./homepage)   | SaaS homepage: features, steps, pricing, FAQ, trial form             | 5221                    |
| [dashboard](./dashboard) | Project resources: overview, filtering, paging, details, settings    | 5222                    |
| [docs](./docs)           | Markdown docs: navigation, search, outline, code copying, pagination | 5223                    |

All templates default to Chinese and include English, light, dark, and system themes. Business data and actions are local demonstrations without a backend. Reloading resets business state; language and theme preferences can persist.

## Run inside this repository

Install dependencies at the repository root, then select an application:

```sh
pnpm install
pnpm --filter @hustradio/unitary-template-homepage dev:source
pnpm --filter @hustradio/unitary-template-dashboard dev:source
pnpm --filter @hustradio/unitary-template-docs dev:source
```

Each development command starts one application. Source mode maps public package imports to the current repository implementation for live updates. Application code continues to use the public `@hustradio/unitary-ui` entry point.

Normal package mode uses actual build artifacts without source aliases:

```sh
pnpm run build:lib
pnpm --filter @hustradio/unitary-template-homepage dev
pnpm --filter @hustradio/unitary-template-homepage build
pnpm --filter @hustradio/unitary-template-homepage preview
pnpm --filter @hustradio/unitary-template-homepage typecheck
```

Replace `homepage` with either other template. Vite assigns normal development and preview ports.

## Copy into another project

1. Copy the selected template directory, excluding `node_modules`, `dist`, and caches.
2. Change the `@hustradio/unitary-ui` dependency in its `package.json` from `workspace:*` to `beta` to follow the public beta distribution tag.
3. Run `pnpm install` in the new directory to create its own lockfile, followed by `pnpm dev` or `pnpm build`.
4. Optionally remove `vite.source.config.ts`, `tsconfig.source.json`, `source-reference.css`, and scripts ending in `:source`. Standalone mode does not use them.

The template directory is the complete copy unit. It needs no repository `src`, documentation application, or other template. Repository usage can advance ahead of npm releases; copying unpublished API usage requires the corresponding release or consuming the current library in your own workspace. Distribution tags resolve when dependencies are installed or updated; an existing lockfile does not upgrade automatically.

## Customize content

- homepage: `src/content.ts` owns the brand, bilingual copy, plans, features, and FAQ.
- dashboard: `src/data.ts` owns sample resources and projects; `src/content.ts` owns copy and navigation. Replace the business data source and actions when connecting a backend.
- docs: maintain paired Markdown in `src/content/zh-CN` and `src/content/en`. `src/documents.ts` owns titles, routes, groups, and ordering for navigation, search, and pagination. Body headings generate the section outline.
- Each template owns language state in `src/locale.tsx`. Its `src/index.css` keeps local shell geometry while using library visual tokens and the public Tailwind reference.

Compose standard components directly. Page sections are copyable without a page generator or cross-template runtime. Markdown dependencies belong only to the docs template.

## Verify

Run at the repository root:

```sh
pnpm run typecheck:templates
pnpm run build:templates
pnpm run test:templates
pnpm run test:templates:package
pnpm run verify -- --dry-run
pnpm run verify
```

Browser checks retain six layout viewports, both themes, and both languages. The standalone check copies every template to a temporary directory, installs the current library tarball with frozen dependencies, and checks types, production builds, and browser smoke behavior. Evidence is saved in `.scratch/template-package`; normal template browser output is `.scratch/template-browser.json`.

Use the same directory convention and add a browser spec for a new template. Verification discovers actual private workspace projects without a second template list. Changes to public APIs, components, styles, or shared dependencies verify every template.
