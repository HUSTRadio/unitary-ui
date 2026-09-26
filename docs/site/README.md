# docs/site — Unitary 文档站

独立 Vite 应用，通过 alias（`@` → 根仓库 `src/`）与 CSS `@source` 直接消费根仓库的
shadcn/ui 元件（`src/components/ui/*`）、Geist token/排版/材质（`src/styles/index.css`）
与 `src/lib/*`（theme.tsx、utils.ts），不复制元件代码。

## 命令（在仓库根目录执行）

```bash
# 启动开发服务器
vp dev docs

# 生产构建
vp build docs

# 独立类型检查（使用 docs/site/tsconfig.json）
cd docs/site && npx tsc --noEmit
```

## 结构说明

- `vite.config.ts`：`@` alias → 根 `src/`；`publicDir` → 根 `public/`（共享 HarmonyOS Sans SC woff2 等静态资源）
- `src/index.css`：直接 `@import "../../../src/styles/index.css"`，复用根样式中自托管的
  OPPO Sans、HarmonyOS Sans 与 JetBrains Maple Mono 分级 `@font-face`；随后通过
  `@source "../../../src/components"` 让 Tailwind v4 扫描根仓库元件类名
- `index.html`：复制根 `index.html` 的首帧防闪烁脚本（storage key `geist-theme-preference`）
- `src/main.tsx`：`ThemeProvider`（来自根 `src/lib/theme.tsx`）+ `HashRouter` 挂载
- `tsconfig.json`：extends 根 `tsconfig.app.json`，独立 `include: ["src"]`，`@/*` 指向根 `src/*`
