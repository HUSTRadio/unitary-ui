# Documentation code structure

[简体中文](./docs-architecture.md)

Documentation stays in the main repository. The private `@hustradio/unitary-ui-docs` workspace consumes the library's public API. `src/` owns component behavior and tokens; `docs/site/` owns user documentation. `docs/llm/` contains outputs generated from rendered pages.

| Path | Responsibility |
| --- | --- |
| `docs/package.json` | Direct documentation dependencies; never published to npm |
| `docs/vite.config.ts`, `docs/index.html` | Build configuration and application entry |
| `docs/site/src/components`, `pages` | Documentation presentation and page shell |
| `docs/site/src/content`, `data` | Bilingual guides, API registry, route metadata |
| `docs/site/src/examples` | Live examples and paired source; stable demo IDs |
| `docs/site/build` | Source preview and lazy example plugins |
| `src/styles` | Single maintained source of library styles and tokens |
| `public` | Single maintained source of shared media |

Documentation runtime code, types, and copyable examples import library symbols from `@hustradio/unitary-ui`. They do not use `@/`, private package paths, or relative paths into the root `src/`. Site modules use relative imports. Check existing public types before adding exports; expose a missing utility only when it has an independent public purpose.

Documentation CSS imports `@hustradio/unitary-ui/styles.css`, references theme and utility definitions through `@hustradio/unitary-ui/tailwind-reference.css`, and scans its own source. The build copies the reference and palette directly from canonical CSS; tokens are not maintained twice. The root living styleguide scans the shared docs examples separately. Docs shell geometry stays in docs CSS.

Local development resolves the public package contract to source so component and documentation edits remain immediate. `docs/site/tsconfig.source.json` checks source mode; standalone `docs/site/tsconfig.json` checks installed declarations without repository path mappings. Package mode disables source aliases.

In source mode, the normal stylesheet already provides the complete theme. The reference maps to an empty file to avoid referencing that same canonical CSS twice and suppressing runtime variables. Package mode uses the actual published reference file.

```sh
pnpm run build:docs
pnpm run test:docs:package
pnpm run docs:llm:generate
pnpm run docs:llm:check
```

`test:docs:package` reuses the single pack performed by `test:package`. The same tarball receives library entry checks and complete docs consumer checks. The independent consumer copies only the site source, configuration, plugins, and six declared media files. It does not copy library source, root configuration, or public fonts. A standalone lock freezes installation; the static application receives the full browser suite and bilingual corpus comparison. Evidence remains under ignored `.scratch/npm-release/`.

After publication, `build:docs:registry` validates the receipt's commit, exact version, and tarball integrity, then builds deployable files with the candidate consumer's dependency tree. `publish.yml` retains static files and verification metadata; hosting is configured separately. If static artifact production fails after publication, rerun that stage without republishing an existing npm version. See the [release guide](./npm-release.en.md).

New pages and component guides must keep API metadata, both locales, demo IDs, and generated corpus aligned. The AST import guard, package consumer, and unified `verify` enforce these boundaries. Tests may inspect implementation source for internal contracts; they do not replace actual package consumption checks.
