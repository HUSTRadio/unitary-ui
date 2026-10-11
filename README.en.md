# Unitary UI

[简体中文](./README.md)

To LLM Agents: see [AGENTS.md](./AGENTS.md) for llm-specified documentation.

A React component library based on the Vercel Geist design language, with design tokens, base components, composed examples, and bilingual documentation.

## Features

- Light and dark themes with semantic design tokens
- Common Geist components and local extensions
- TypeScript APIs, live examples, and copyable code
- Motion.dev interaction animations and controllable Hitu SVG illustrations
- Composed form, data table, workflow, and settings examples
- Simplified Chinese and English documentation

## Installation

```bash
pnpm add @hustradio/unitary-ui
```

## Quick start

```tsx
import { Button } from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles.css";

export function App() {
  return <Button>Deploy Project</Button>;
}
```

The package root supports native Node ESM `import` and CommonJS `require` without a CSS loader. Browser applications must still import `@hustradio/unitary-ui/styles.css` explicitly; this file includes Device frame styles. Do not import the CSS file directly in Node server code.

## Screenshots

<!-- STYLEGUIDE_SCREENSHOTS_START -->

| Page                     | Light                                                                  | Dark                                                                 |
| ------------------------ | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Pagination and media     | ![Pagination and media Light](images/styleguide/paged-media-light.png) | ![Pagination and media Dark](images/styleguide/paged-media-dark.png) |
| Components overview      | ![Components overview Light](images/styleguide/components-light.png)   | ![Components overview Dark](images/styleguide/components-dark.png)   |
| Form example             | ![Form example Light](images/styleguide/form-light.png)                | ![Form example Dark](images/styleguide/form-dark.png)                |
| Data table               | ![Data table Light](images/styleguide/table-light.png)                 | ![Data table Dark](images/styleguide/table-dark.png)                 |
| Workflow                 | ![Workflow Light](images/styleguide/workflow-light.png)                | ![Workflow Dark](images/styleguide/workflow-dark.png)                |
| Settings panel           | ![Settings panel Light](images/styleguide/settings-light.png)          | ![Settings panel Dark](images/styleguide/settings-dark.png)          |
| Global tokens            | ![Global tokens Light](images/styleguide/tokens-light.png)             | ![Global tokens Dark](images/styleguide/tokens-dark.png)             |
| Motion and illustrations | ![Motion and illustrations Light](images/styleguide/motion-light.png)  | ![Motion and illustrations Dark](images/styleguide/motion-dark.png)  |

<!-- STYLEGUIDE_SCREENSHOTS_END -->

## Documentation

- Documentation site: `vp dev docs`
- Motion and illustrations: [`Hitu + Motion guide`](./docs/guides/hitu-motion.en.md)
- Nonlinear motion and migration: [`Curve specification`](./docs/design/apple-motion-curves.en.md)
- Integration verification: [`Tests and bundle measurements`](./docs/audits/hitu-motion-2026-10-08.md)
- Official specification snapshot: [`docs/geist-markdown-refs`](./docs/geist-markdown-refs)
- Changelog: [`CHANGELOG.en.md`](./CHANGELOG.en.md)

## Color guidelines

The foundation scales use **Vercel Geist Colors**, with a reference snapshot in `docs/geist-markdown-refs/foundations/colors.md` and definitions in `src/styles/index.css`. `--uni-*` maps these colors to specific uses. Apple HIG guides layout, interaction, and accessibility without adding another palette. Color overrides must document their source, reason, and scope.

## Development

```bash
pnpm install
pnpm dev
pnpm test
pnpm typecheck
```

Package validation before publishing (automatically run by `prepublishOnly`):

```bash
pnpm exec playwright install chromium
pnpm run test:package
```

This rebuilds and packs the library, installs the tarball in an independent consumer, checks TypeScript, ESM/CJS, server rendering and hydration, then verifies the published CSS in Chromium in both themes. Validated tarballs, file lists and digests are saved under `.scratch/npm-release/`.

Publishing is prepared for formal GitHub Releases: all CI and browser checks must pass before the exact validated tarball is published. The initial `0.1.0` uses a temporary environment token; later versions use npm trusted publishing. See the [publishing guide](https://github.com/HUSTRadio/unitary-ui/blob/master/docs/guides/npm-release.en.md) and [Release draft](https://github.com/HUSTRadio/unitary-ui/blob/master/docs/guides/npm-release-0.1.0.md) for external configuration and recovery.

## Continuous integration

[`CI`](./.github/workflows/ci.yml) runs on pushes to `master`, all pull requests, and manual dispatches. Three parallel jobs cover static checks and the full unit suite, the application build and package contracts, and the documentation build and LLM corpus consistency. Jobs use Ubuntu 24.04, Node.js 24, and the pnpm version declared in `package.json`, installing dependencies with `pnpm install --frozen-lockfile`.

Image audit tests in the full unit suite require Python 3.12 and Pillow; CI installs the pinned dependency. Before running locally, use `python -m pip install --requirement tests/audit/requirements.txt`.

[`Nightly browser checks`](./.github/workflows/e2e-nightly.yml) run daily at 18:00 UTC (02:00 Beijing time) and support manual dispatches. Ubuntu runs documentation layout checks across all viewports and both themes; Windows 2025 runs the read-only README screenshot check. Failed runs upload reports, traces, and screenshots with a 7-day retention period. Documentation or screenshot drift fails CI; generate and review updates locally.

## Credits

See [`CREDITS.en.md`](./CREDITS.en.md) for design references and third-party assets. Redistribution of OPPO Sans and HarmonyOS Sans carries licensing risk; see [`THIRD_PARTY_NOTICES.en.md`](./THIRD_PARTY_NOTICES.en.md).

## License

MIT © 2026 HUSTRadio. See [`LICENSE`](./LICENSE) for the legal text and [`LICENSE.zh-CN.md`](./LICENSE.zh-CN.md) for a Simplified Chinese reading guide.
