# v0.1.0 — GitHub Release 草稿 / Draft

这是准备材料，尚不代表 npm 发布成功。创建 Release 时检查 tag `v0.1.0`，取消 prerelease 标记；仅发布正式 Release 才触发工作流。

## 简体中文

Unitary UI 首个公开 npm 版本，提供基于 Vercel Geist 设计语言的 React 19 组件、设计 token、明暗主题、Solid / Hybrid / Glass 材质、Motion 动效、Hitu 插画和图表。

```sh
pnpm add @hustradio/unitary-ui@0.1.0
```

```tsx
import { Button } from '@hustradio/unitary-ui';
import '@hustradio/unitary-ui/styles.css';
export function App() { return <Button>开始使用</Button>; }
```

支持包根的原生 ESM / CJS 和 SSR；浏览器应用须显式引入 CSS。字体和第三方资产按各自许可分发，OPPO Sans、HarmonyOS Sans 的现有再分发风险披露见双语第三方声明。

## English

The first public npm release of Unitary UI includes React 19 components based on Vercel Geist, design tokens, light/dark themes, Solid / Hybrid / Glass materials, Motion animations, Hitu illustrations and charts.

Install `@hustradio/unitary-ui@0.1.0` and explicitly import `@hustradio/unitary-ui/styles.css` in browser applications. The package root supports native ESM / CJS and SSR. Fonts and third-party assets retain their respective licenses; see the bilingual notices for existing OPPO Sans and HarmonyOS Sans redistribution risks.

完整变更 / Full changes: [中文 Changelog](../../CHANGELOG.md) · [English changelog](../../CHANGELOG.en.md)
