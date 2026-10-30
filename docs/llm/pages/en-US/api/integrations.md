# Integrations

> Route: `/api/integrations`

# Integrations

Adopt the library in a Next.js App Router project, Vite, or any React 19 app: style entry, font boundary, Server/Client Component boundaries, error boundaries, plus Tailwind v4 coexistence and the measured size reality of subpath entries.

## Style entry

Import @hustradio/unitary-ui/styles.css once in the application root layout. It is the compiled runtime stylesheet with fonts and material variables. Components inject no styles; without this import they render unstyled. Fonts ship with the package and the CSS references them relatively, so bundlers collect them through normal asset rules.

```tsx
// app/layout.tsx — Server Component
import "@hustradio/unitary-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

## Font boundary

Fonts ship inside the package: 16 woff2 files under dist/fonts, 25.2 MB in total, but they are never downloaded in full. Each family is split into GB 18030 tiers chained through unicode-range, so a browser fetches only the tiers a page actually hits. Family names carry a Subset suffix and the stack lists the system family first, which means zero download when the font is installed locally.

So do not redeclare @font-face for these families, and do not deploy dist/fonts separately: the CSS references ./fonts/ relatively, so both must stay together. Vertical ink compensation depends on the --uni-ink-shift tokens, and swapping families shifts that baseline.

## Server and Client Component boundaries

The published root entry is declared as a Client Component boundary ("use client"), so any component can be imported from the package root inside a Server Component and rendered directly: it becomes a client reference that still produces server HTML, then hydrates for interaction. Purely presentational components follow the same path. The four published subpaths (charts/motion/device/code) are client boundaries as well, so none renders purely on the server; module-level server-pure entries are not published yet, and this page does not describe unreleased entries.

Wrap stateful, event-driven, or browser-dependent compositions in your own "use client" module. Do not pass event callbacks to library components from a Server Component or create refs there; that is React's boundary rule, independent of this library.

```tsx
// app/page.tsx — Server Component（无 "use client"）
import { Badge, Separator } from "@hustradio/unitary-ui";
import { ClientPanel } from "./client-panel";

export default function Page() {
  return (
    <main>
      <h1>Orders</h1>
      <Badge>New</Badge>
      <Separator />
      <ClientPanel />
    </main>
  );
}
```

```tsx
// app/client-panel.tsx — Client Component
"use client";

import { useState } from "react";
import { Button } from "@hustradio/unitary-ui";

export function ClientPanel() {
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount((value) => value + 1)}>Count: {count}</Button>;
}
```

## SSR is not RSC

Server rendering only proves HTML can be produced on the server; it does not prove the module graph satisfies App Router client-boundary rules. The library ships both kinds of evidence: Node consumer SSR/hydration tests and a real Next App Router fixture that installs the published tarball, runs next build, and asserts browser interaction.

## Error boundaries

app/error.tsx and app/global-error.tsx must be Client Components. Reuse the ErrorCard family for the message and retry action. The library's ErrorBoundary is suited to finer-grained subtrees and does not replace Next's route-level boundaries.

```tsx
// app/error.tsx — 必须是 Client Component
"use client";

import {
  ErrorCard,
  ErrorCardTitle,
  ErrorCardDescription,
  ErrorCardAction,
  Button,
} from "@hustradio/unitary-ui";

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorCard>
      <ErrorCardTitle>Something went wrong</ErrorCardTitle>
      <ErrorCardDescription>{error.message}</ErrorCardDescription>
      <ErrorCardAction>
        <Button onClick={reset}>Try again</Button>
      </ErrorCardAction>
    </ErrorCard>
  );
}
```

## Coexistence with Tailwind v4

The two style entries have different jobs, and only one may be imported as a stylesheet. styles.css is the compiled artifact: utilities, component styles, material variables and @font-face all live there, imported once. That is the default, and consumers do not need to scan library sources.

tailwind-reference.css is the canonical theme published from the same source as src/styles/index.css (including @import "tailwindcss", @theme and @source). Use it only through @reference from your own CSS to read library theme variables. Importing it as a stylesheet regenerates the utility set and destabilizes both size and cascade order.

```tsx
/* app/globals.css — 与既有 Tailwind v4 样式共存 */
@import "tailwindcss";
@import "@hustradio/unitary-ui/styles.css";
```

```tsx
/* 应用自有 CSS 需要读取库的主题变量时 */
@reference "@hustradio/unitary-ui/tailwind-reference.css";

.surface {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
}
```

## @theme order and overrides

The library maps semantic tokens to base variables with @theme inline and emits runtime variables unconditionally with @theme static; without that emission, variables no utility references would be pruned and theme switching would stop working. When overriding, follow two rules: put the override block after the library stylesheet, since later declarations win inside a layer, and keep it at the top level — @theme cannot live inside @layer or a selector.

```tsx
@import "tailwindcss";
@import "@hustradio/unitary-ui/styles.css";

/* 覆盖放在导入之后：同一层内后声明者胜出。@theme 必须在顶层。 */
@theme {
  --color-brand-500: oklch(0.62 0.19 258);
}
```

## How the dark variant resolves

Dark mode is decided by the library's @custom-variant dark (&:is(.dark \*, \[data-theme="dark"\] \*)): it applies when an ancestor carries the .dark class or data-theme="dark", and either mount point works. Do not redefine dark — a second @custom-variant dark in the same build replaces the library's rule and changes every dark: variant inside it. If you genuinely need a media-query strategy, define it before importing the library styles and re-verify the dark appearance.

## Transition duration and curve

The library binds Tailwind's implicit defaults to its own scale: --default-transition-duration: var(--uni-duration-fast) and --default-transition-timing-function: var(--ease-snap). Bare transition-\* utilities therefore follow the library rhythm as well. Overriding either variable on :root also changes library components — treat it as a global behavior change and verify before shipping.

```tsx
:root {
  /* 影响所有裸 transition-* 用法，包括库组件；默认绑定 --uni-duration-fast */
  --default-transition-duration: 200ms;
}
```

## @source and the scan boundary

The library imports Tailwind with source(none), then adds explicit @source "../" and @source inline(...) for the public shape utilities. Consumers therefore neither need nor should scan library sources: adding @source for node\_modules/@hustradio/unitary-ui regenerates a second set of base utilities that competes with the library's responsive rules in the same layer (which is why the library moved visibility to the unlayered \[data-uni-responsive\] contract).

```tsx
@import "tailwindcss";

/* 不要把 @source 指向 node_modules/@hustradio/unitary-ui：
   库内已 source(none) + 显式 @source，重复扫描会与库内响应式规则同层竞争。 */
```

## Subpath entries

The package publishes four subpaths: charts, motion, device and code. They resolve to the same implementation as the package root and share its instances, so ThemeProvider, i18n and the toast store never duplicate, and mixing entries is safe.

```tsx
import { AreaChart } from "@hustradio/unitary-ui/charts";
import { MotionProvider } from "@hustradio/unitary-ui/motion";
import { Device } from "@hustradio/unitary-ui/device";
import { CodeBlock } from "@hustradio/unitary-ui/code";

// 子路径与包根是同一份实现：ThemeProvider、i18n、toast store 共享实例。
import { Button } from "@hustradio/unitary-ui";
```

One current fact matters: subpaths do not reduce download size yet. The four entries measure 301–328 KB gzip against 301 KB for the root, because they are facade re-exports of the same bundle. Treat subpaths as explicit entry intent, not as a size lever; real reduction waits for module-boundary preservation in the bundler.

## Preconditions for tree-shaking

The package declares sideEffects: \["\*\*/\*.css"\], and modules have no top-level side effects of their own (font metrics are installed explicitly through installFontMetrics()). The published artifact still contains component-level displayName assignments, though, so consumers cannot safely drop unused exports: a Button-only consumer measures 301 KB gzip, the same order as the whole package.

Until that converges, budget against the whole package and do not assume that importing a few components yields a smaller bundle. The repository's pnpm run test:budgets tracks these numbers, with thresholds and known gaps recorded in tests/fixtures/package-budgets.json; thresholds tighten as the gaps close.

## Verification after adoption

A minimal self-check has three steps: render any library component from a Server Component and confirm the first HTML response contains it; complete one interaction from a Client Component with no hydration warnings; wire a route-level error boundary to ErrorCard and trigger one controlled error. Passing all three confirms both the style entry and the client boundary are wired correctly.
