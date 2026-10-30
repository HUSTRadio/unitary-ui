import { CodeBlock } from "@hustradio/unitary-ui";
import type { DocsLanguage } from "../i18n/language";
import { DocsPageTitle, DocsPageLead, DocsSection, DocsSectionTitle, DocsParagraph } from "../components/docs-typography";

const layoutExample = `// app/layout.tsx — Server Component
import "@hustradio/unitary-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}`;

const serverPageExample = `// app/page.tsx — Server Component（无 "use client"）
import { Badge, Separator } from "@hustradio/unitary-ui";
import { ClientPanel } from "./client-panel";

export default function Page() {
  return <main>
    <h1>Orders</h1>
    <Badge>New</Badge>
    <Separator />
    <ClientPanel />
  </main>;
}`;

const clientPanelExample = `// app/client-panel.tsx — Client Component
"use client";

import { useState } from "react";
import { Button } from "@hustradio/unitary-ui";

export function ClientPanel() {
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount((value) => value + 1)}>
    Count: {count}
  </Button>;
}`;

const errorExample = `// app/error.tsx — 必须是 Client Component
"use client";

import { ErrorCard, ErrorCardTitle, ErrorCardDescription, ErrorCardAction, Button } from "@hustradio/unitary-ui";

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorCard>
    <ErrorCardTitle>Something went wrong</ErrorCardTitle>
    <ErrorCardDescription>{error.message}</ErrorCardDescription>
    <ErrorCardAction><Button onClick={reset}>Try again</Button></ErrorCardAction>
  </ErrorCard>;
}`;

const tailwindExample = `/* app/globals.css — 与既有 Tailwind v4 样式共存 */
@import "tailwindcss";
@import "@hustradio/unitary-ui/styles.css";`;

const referenceExample = `/* 应用自有 CSS 需要读取库的主题变量时 */
@reference "@hustradio/unitary-ui/tailwind-reference.css";

.surface {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
}`;

const themeOverrideExample = `@import "tailwindcss";
@import "@hustradio/unitary-ui/styles.css";

/* 覆盖放在导入之后：同一层内后声明者胜出。@theme 必须在顶层。 */
@theme {
  --color-brand-500: oklch(0.62 0.19 258);
}`;

const transitionExample = `:root {
  /* 影响所有裸 transition-* 用法，包括库组件；默认绑定 --uni-duration-fast */
  --default-transition-duration: 200ms;
}`;

const sourceExample = `@import "tailwindcss";

/* 不要把 @source 指向 node_modules/@hustradio/unitary-ui：
   库内已 source(none) + 显式 @source，重复扫描会与库内响应式规则同层竞争。 */`;

const subpathExample = `import { AreaChart } from "@hustradio/unitary-ui/charts";
import { MotionProvider } from "@hustradio/unitary-ui/motion";
import { Device } from "@hustradio/unitary-ui/device";
import { CodeBlock } from "@hustradio/unitary-ui/code";

// 子路径与包根是同一份实现：ThemeProvider、i18n、toast store 共享实例。
import { Button } from "@hustradio/unitary-ui";`;

export function IntegrationsPage({ language }: { language: DocsLanguage }) {
  const zh = language === "zh-CN";
  return <article className="min-w-0 max-w-3xl">
    <DocsPageTitle>{zh ? "集成指南" : "Integrations"}</DocsPageTitle>
    <DocsPageLead>
      {zh
        ? "在 Next.js App Router、Vite 或其他 React 19 应用中接入本库：样式入口、字体边界、Server/Client Component 边界、错误边界，以及 Tailwind v4 共存与子路径入口的真实体积现状。"
        : "Adopt the library in a Next.js App Router project, Vite, or any React 19 app: style entry, font boundary, Server/Client Component boundaries, error boundaries, plus Tailwind v4 coexistence and the measured size reality of subpath entries."}
    </DocsPageLead>

    <DocsSection id="styles">
      <DocsSectionTitle>{zh ? "样式入口" : "Style entry"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "在应用根布局导入一次 @hustradio/unitary-ui/styles.css（已编译的运行样式，含字体与材质变量）。组件本身不注入样式；缺少该导入时组件会以无样式状态渲染。字体文件随包发布，CSS 通过相对路径引用，打包器会按常规规则收集。"
          : "Import @hustradio/unitary-ui/styles.css once in the application root layout. It is the compiled runtime stylesheet with fonts and material variables. Components inject no styles; without this import they render unstyled. Fonts ship with the package and the CSS references them relatively, so bundlers collect them through normal asset rules."}
      </DocsParagraph>
      <CodeBlock language="tsx">{layoutExample}</CodeBlock>
    </DocsSection>

    <DocsSection id="fonts">
      <DocsSectionTitle>{zh ? "字体边界" : "Font boundary"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "字体随包发布：dist/fonts 下 16 个 woff2，合计 25.2 MB，但不会全量下载。每个字族按 GB 18030 分级拆成多个 @font-face，用 unicode-range 串联，浏览器只抓页面实际命中的分级；族名带 Subset 后缀，字体栈把系统完整版排在前面，本机已装则零下载。"
          : "Fonts ship inside the package: 16 woff2 files under dist/fonts, 25.2 MB in total, but they are never downloaded in full. Each family is split into GB 18030 tiers chained through unicode-range, so a browser fetches only the tiers a page actually hits. Family names carry a Subset suffix and the stack lists the system family first, which means zero download when the font is installed locally."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "因此不要为这些族名自建 @font-face 覆盖，也不要把 dist/fonts 单独部署到别处：CSS 用相对路径 ./fonts/ 引用，两者必须同源同级。行高的墨迹补偿依赖 --uni-ink-shift 系列 token，换字体族会让垂直基线偏移。"
          : "So do not redeclare @font-face for these families, and do not deploy dist/fonts separately: the CSS references ./fonts/ relatively, so both must stay together. Vertical ink compensation depends on the --uni-ink-shift tokens, and swapping families shifts that baseline."}
      </DocsParagraph>
    </DocsSection>

    <DocsSection id="server-client">
      <DocsSectionTitle>{zh ? "Server 与 Client Component 边界" : "Server and Client Component boundaries"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "当前发布产物的根入口整体声明为 Client Component 边界（\"use client\"）。因此任何组件都可以从包根在 Server Component 中导入并直接渲染：它会被当作 client 引用处理，服务端完成首屏 HTML，浏览器接管后交互正常。纯展示组件同样经此路径使用。已发布的四个子路径（charts/motion/device/code）同样是 client 边界，都不提供 Server-Only 直渲染；按模块划分的 server-pure 粒度入口尚未发布，本页不描述未发布的入口。"
          : "The published root entry is declared as a Client Component boundary (\"use client\"), so any component can be imported from the package root inside a Server Component and rendered directly: it becomes a client reference that still produces server HTML, then hydrates for interaction. Purely presentational components follow the same path. The four published subpaths (charts/motion/device/code) are client boundaries as well, so none renders purely on the server; module-level server-pure entries are not published yet, and this page does not describe unreleased entries."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "需要 state、事件处理或浏览器 API 的封装组件必须自己声明 \"use client\"。不要在 Server Component 中给库组件传事件回调或创建 ref——那是 React 的边界规则，与本库无关。"
          : "Wrap stateful, event-driven, or browser-dependent compositions in your own \"use client\" module. Do not pass event callbacks to library components from a Server Component or create refs there; that is React's boundary rule, independent of this library."}
      </DocsParagraph>
      <CodeBlock language="tsx">{serverPageExample}</CodeBlock>
      <CodeBlock language="tsx">{clientPanelExample}</CodeBlock>
    </DocsSection>

    <DocsSection id="ssr">
      <DocsSectionTitle>{zh ? "SSR 不等于 RSC" : "SSR is not RSC"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "服务端渲染只证明 HTML 能在服务端生成，不证明模块图满足 App Router 的 client 边界规则。本库同时提供两种证据：Node 消费端的 SSR/水合测试，以及真实 Next App Router fixture（安装发布 tarball 后执行 next build 与浏览器交互断言）。"
          : "Server rendering only proves HTML can be produced on the server; it does not prove the module graph satisfies App Router client-boundary rules. The library ships both kinds of evidence: Node consumer SSR/hydration tests and a real Next App Router fixture that installs the published tarball, runs next build, and asserts browser interaction."}
      </DocsParagraph>
    </DocsSection>

    <DocsSection id="error-boundaries">
      <DocsSectionTitle>{zh ? "错误边界" : "Error boundaries"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "app/error.tsx 与 app/global-error.tsx 必须是 Client Component。可直接复用 ErrorCard 系列组件展示错误与重试动作；本库的 ErrorBoundary 适合放在更细的子树中捕获渲染错误，不能替代 Next 的路由级边界。"
          : "app/error.tsx and app/global-error.tsx must be Client Components. Reuse the ErrorCard family for the message and retry action. The library's ErrorBoundary is suited to finer-grained subtrees and does not replace Next's route-level boundaries."}
      </DocsParagraph>
      <CodeBlock language="tsx">{errorExample}</CodeBlock>
    </DocsSection>

    <DocsSection id="tailwind">
      <DocsSectionTitle>{zh ? "与 Tailwind v4 共存" : "Coexistence with Tailwind v4"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "两个样式入口职责不同，只能选一个作为样式表导入。styles.css 是编译产物：utility、组件样式、材质变量与 @font-face 全在里面，导入一次即可，默认选它；消费端不需要扫描库源码。"
          : "The two style entries have different jobs, and only one may be imported as a stylesheet. styles.css is the compiled artifact: utilities, component styles, material variables and @font-face all live there, imported once. That is the default, and consumers do not need to scan library sources."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "tailwind-reference.css 是与 src/styles/index.css 同源发布的 canonical 主题（含 @import \"tailwindcss\"、@theme 与 @source），只用于在应用自有 CSS 里 @reference 读库的主题变量。把它当普通样式表导入会再生成一遍 utility，体积与层叠顺序都会失控。"
          : "tailwind-reference.css is the canonical theme published from the same source as src/styles/index.css (including @import \"tailwindcss\", @theme and @source). Use it only through @reference from your own CSS to read library theme variables. Importing it as a stylesheet regenerates the utility set and destabilizes both size and cascade order."}
      </DocsParagraph>
      <CodeBlock language="css">{tailwindExample}</CodeBlock>
      <CodeBlock language="css">{referenceExample}</CodeBlock>
    </DocsSection>

    <DocsSection id="tailwind-theme">
      <DocsSectionTitle>{zh ? "@theme 顺序与覆盖" : "@theme order and overrides"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "库用 @theme inline 把语义 token 映射到基础变量，用 @theme static 无条件发射运行时变量——若不发射，未被 utility 引用的变量会被裁掉，主题切换随即失效。消费端覆盖时遵守两条：覆盖块放在导入之后（同一层内后声明者胜出），且必须留在顶层，@theme 不能写进 @layer 或选择器里。"
          : "The library maps semantic tokens to base variables with @theme inline and emits runtime variables unconditionally with @theme static; without that emission, variables no utility references would be pruned and theme switching would stop working. When overriding, follow two rules: put the override block after the library stylesheet, since later declarations win inside a layer, and keep it at the top level — @theme cannot live inside @layer or a selector."}
      </DocsParagraph>
      <CodeBlock language="css">{themeOverrideExample}</CodeBlock>
    </DocsSection>

    <DocsSection id="tailwind-dark">
      <DocsSectionTitle>{zh ? "深色变体的判定" : "How the dark variant resolves"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "深色由库定义的 @custom-variant dark (&:is(.dark *, [data-theme=\"dark\"] *)) 决定：祖先带 .dark 类或 data-theme=\"dark\" 时生效，两种挂载点任选其一。不要重复定义 dark——同一次构建里再写一处 @custom-variant dark 会替换掉库的判定，库内所有 dark: 变体随之改变。确实需要媒体查询策略时，在导入库样式之前定义，并重新回归深色外观。"
          : "Dark mode is decided by the library's @custom-variant dark (&:is(.dark *, [data-theme=\"dark\"] *)): it applies when an ancestor carries the .dark class or data-theme=\"dark\", and either mount point works. Do not redefine dark — a second @custom-variant dark in the same build replaces the library's rule and changes every dark: variant inside it. If you genuinely need a media-query strategy, define it before importing the library styles and re-verify the dark appearance."}
      </DocsParagraph>
    </DocsSection>

    <DocsSection id="tailwind-motion">
      <DocsSectionTitle>{zh ? "过渡时长与曲线" : "Transition duration and curve"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "库把 Tailwind 的隐式默认绑定到自己的档位：--default-transition-duration: var(--uni-duration-fast)、--default-transition-timing-function: var(--ease-snap)。所以裸 transition-*（不带 duration-/ease-* 类）也走库的节奏。在 :root 覆盖这两个变量会同时改变库组件，属于全局行为，请先回归再改。"
          : "The library binds Tailwind's implicit defaults to its own scale: --default-transition-duration: var(--uni-duration-fast) and --default-transition-timing-function: var(--ease-snap). Bare transition-* utilities therefore follow the library rhythm as well. Overriding either variable on :root also changes library components — treat it as a global behavior change and verify before shipping."}
      </DocsParagraph>
      <CodeBlock language="css">{transitionExample}</CodeBlock>
    </DocsSection>

    <DocsSection id="tailwind-source">
      <DocsSectionTitle>{zh ? "@source 与扫描边界" : "@source and the scan boundary"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "库的样式入口以 source(none) 导入 Tailwind，再用显式 @source \"../\" 与 @source inline(...) 补齐公共形状 utility。所以消费端既不需要、也不应该扫描库源码：反过来给 node_modules/@hustradio/unitary-ui 加 @source，会让消费端再生成一批基础 utility，并与库内响应式规则发生同层竞争（库因此改用非分层 [data-uni-responsive] 契约）。"
          : "The library imports Tailwind with source(none), then adds explicit @source \"../\" and @source inline(...) for the public shape utilities. Consumers therefore neither need nor should scan library sources: adding @source for node_modules/@hustradio/unitary-ui regenerates a second set of base utilities that competes with the library's responsive rules in the same layer (which is why the library moved visibility to the unlayered [data-uni-responsive] contract)."}
      </DocsParagraph>
      <CodeBlock language="css">{sourceExample}</CodeBlock>
    </DocsSection>

    <DocsSection id="subpaths">
      <DocsSectionTitle>{zh ? "子路径入口" : "Subpath entries"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "包发布四个子路径：charts（图表）、motion（动效运行时）、device（设备外壳）、code（代码展示）。它们与包根指向同一份实现，实例共享——ThemeProvider、i18n 与 toast store 不会出现双实例，可以混用。"
          : "The package publishes four subpaths: charts, motion, device and code. They resolve to the same implementation as the package root and share its instances, so ThemeProvider, i18n and the toast store never duplicate, and mixing entries is safe."}
      </DocsParagraph>
      <CodeBlock language="tsx">{subpathExample}</CodeBlock>
      <DocsParagraph>
        {zh
          ? "需要明确的现状：子路径目前不减少下载体积。四个入口实测 301–328 KB（gzip），根入口 301 KB——门面重导出共享同一份 bundle。请把子路径当作显式导入意图使用，不要当作体积手段；体积优化要等打包器支持保留模块边界后再评估。"
          : "One current fact matters: subpaths do not reduce download size yet. The four entries measure 301–328 KB gzip against 301 KB for the root, because they are facade re-exports of the same bundle. Treat subpaths as explicit entry intent, not as a size lever; real reduction waits for module-boundary preservation in the bundler."}
      </DocsParagraph>
    </DocsSection>

    <DocsSection id="tree-shaking">
      <DocsSectionTitle>{zh ? "Tree-shaking 的前提" : "Preconditions for tree-shaking"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "包在 package.json 声明 sideEffects: [\"**/*.css\"]，模块自身没有顶层副作用（字体度量已改为入口显式 installFontMetrics()）。但当前发布产物里仍有组件顶层的 displayName 赋值，消费端无法安全丢弃未使用导出：只导入 Button 的消费端实测 301 KB gzip，与整包同量级。"
          : "The package declares sideEffects: [\"**/*.css\"], and modules have no top-level side effects of their own (font metrics are installed explicitly through installFontMetrics()). The published artifact still contains component-level displayName assignments, though, so consumers cannot safely drop unused exports: a Button-only consumer measures 301 KB gzip, the same order as the whole package."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "在 tree-shaking 收敛之前，请按整包体积做预算，不要假设「只导入几个组件就会更小」。仓库内的 pnpm run test:budgets 持续跟踪这组数字，阈值与已知缺口记录在 tests/fixtures/package-budgets.json；缺口修复后阈值会同步收紧。"
          : "Until that converges, budget against the whole package and do not assume that importing a few components yields a smaller bundle. The repository's pnpm run test:budgets tracks these numbers, with thresholds and known gaps recorded in tests/fixtures/package-budgets.json; thresholds tighten as the gaps close."}
      </DocsParagraph>
    </DocsSection>

    <DocsSection id="verification">
      <DocsSectionTitle>{zh ? "接入后的自检" : "Verification after adoption"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "最小自检包含三项：在 Server Component 中渲染任意库组件并确认首屏 HTML 存在；在 Client Component 中完成一次交互并确认无 hydration 警告；为路由级错误边界接入 ErrorCard 并用一次受控错误触发。若三项均通过，说明样式入口与 client 边界均已正确接入。"
          : "A minimal self-check has three steps: render any library component from a Server Component and confirm the first HTML response contains it; complete one interaction from a Client Component with no hydration warnings; wire a route-level error boundary to ErrorCard and trigger one controlled error. Passing all three confirms both the style entry and the client boundary are wired correctly."}
      </DocsParagraph>
    </DocsSection>
  </article>;
}
