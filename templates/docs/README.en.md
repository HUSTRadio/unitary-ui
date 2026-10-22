# docs

[简体中文](./README.md)

An independent bilingual dynamic consumer. See the [template guide](../README.en.md) for copying, source development, and package mode.

Start at the repository root:

```sh
pnpm --filter @hustradio/unitary-template-docs dev:source
```

After copying outside the repository, change the library dependency to `beta` and run:

```sh
pnpm install
pnpm dev
pnpm run typecheck
pnpm run build
pnpm preview
```

Copy only this directory. Source-mode configuration can be removed. Business actions use local sample data.
