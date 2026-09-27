# Unitary UI

[简体中文](./README.md)

To LLM Agents: see [AGENTS.md](./AGENTS.md) for llm-specified documentation.

A React component library based on the Vercel Geist design language, with design tokens, base components, composed examples, and bilingual documentation.

## Features

- Light and dark themes with semantic design tokens
- Common Geist components and local extensions
- TypeScript APIs, live examples, and copyable code
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

| Page                | Light                                                                | Dark                                                               |
| ------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Components overview | ![Components overview Light](images/styleguide/components-light.png) | ![Components overview Dark](images/styleguide/components-dark.png) |
| Form example        | ![Form example Light](images/styleguide/form-light.png)              | ![Form example Dark](images/styleguide/form-dark.png)              |
| Data table          | ![Data table Light](images/styleguide/table-light.png)               | ![Data table Dark](images/styleguide/table-dark.png)               |
| Workflow            | ![Workflow Light](images/styleguide/workflow-light.png)              | ![Workflow Dark](images/styleguide/workflow-dark.png)              |
| Settings panel      | ![Settings panel Light](images/styleguide/settings-light.png)        | ![Settings panel Dark](images/styleguide/settings-dark.png)        |

<!-- STYLEGUIDE_SCREENSHOTS_END -->

## Documentation

- Documentation site: `vp dev docs`
- Official specification snapshot: [`docs/geist-markdown-refs`](./docs/geist-markdown-refs)
- Changelog: [`CHANGELOG.en.md`](./CHANGELOG.en.md)

## Palette governance

The sole foundation reference palette is **Vercel Geist Colors**. Its evidence snapshot is `docs/geist-markdown-refs/foundations/colors.md`; `src/styles/index.css` is the runtime owner of the foundation scales. `--uni-*` is a semantic mapping layer, not a second palette; Apple HIG supplies layout, behavior, and accessibility constraints only, not a second palette. A user-forced override must name its source, reason, and scope.

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

This rebuilds the library, checks ESM/CJS imports, SSR, and highlighting in separate Node processes, then verifies Device geometry with the published CSS in Chromium. It does not rely on source aliases or a CSS loader.

## Credits

See [`CREDITS.en.md`](./CREDITS.en.md) for design references and third-party assets. Redistribution of OPPO Sans and HarmonyOS Sans carries licensing risk; see [`THIRD_PARTY_NOTICES.en.md`](./THIRD_PARTY_NOTICES.en.md).

## License

MIT © 2026 HUSTRadio. See [`LICENSE`](./LICENSE) for the legal text and [`LICENSE.zh-CN.md`](./LICENSE.zh-CN.md) for a Simplified Chinese reading guide.
