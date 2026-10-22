# Unitary website

The product homepage is a private workspace app built with the public Unitary UI components. Its five screens show interactive controls, themes and materials, motion, and a quick start.

```sh
pnpm run dev:website
```

Open `http://127.0.0.1:5180/`. The same development entry starts the docs server and proxies `/docs/`. Both servers close together when you stop the command.

```sh
pnpm run build:website
pnpm run preview:website
pnpm run test:website
```

The deployable directory is `website/dist/`: the homepage lives at `/`, and the existing hash-routed documentation lives at `/docs/`. Deploy this entire directory, including shared public assets at both levels. Standalone documentation builds remain independent.

The homepage supports `?lang=zh-CN` and `?lang=en-US`; a valid URL selection takes precedence over saved choice and browser language. Theme controls use the library's shared system/light/dark preference. Screen navigation uses `FullPageScroller`, including keyboard, touch, nested scrolling, and reduced-motion behavior.

The installation command and first-component example are owned by `docs/site/src/content/getting-started.ts` and shared with the documentation introduction. The original SVG assets under `brand/` own the logo and hero mark.

Website browser checks run against the built joint artifact using an independent Playwright configuration. `pnpm run verify` includes their fresh JSON evidence, without adding website cases to the npm package's documentation audit.
