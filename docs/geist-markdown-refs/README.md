# Vercel Geist 设计系统 — 本地规范快照

> **来源**：https://vercel.com/geist/introduction（官方文档，含 /geist/* 与 /font）
> **抓取日期**：2026-08-08
> **抓取方式**：Playwright 独立浏览器进程 × 12 并行子代理，自动展开每个组件页的 "Show code" 代码块；截图存 `screenshots/`（light 主题默认）
> **用途**：本框架（unitary-ui，视觉基准 Vercel Geist）的本地设计规范参考；**严格声明仍以官方页面为准**，本快照用于离线查值与快速对照。
> **复核日期**：2026-08-09；72 组件本地复刻验收见 [`../site-replica-acceptance.md`](../site-replica-acceptance.md)。

## 目录结构

| 目录           | 内容                                                    | 文件数 |
| -------------- | ------------------------------------------------------- | ------ |
| `foundations/` | introduction / colors / typography / materials          | 4      |
| `brands/`      | brands（Vercel/Next.js/Turbo/v0/eve/AI SDK 锚点）/ font | 2      |
| `components/`  | 72 个组件文档（含完整示例代码）                         | 72     |
| `screenshots/` | 每页 light 主题截图（PNG）                              | 79     |

## Foundations 要点

- **Colors**（`foundations/colors.md`）：92 个 `--ds-*` token 的 **Dark + Light 双主题完整色值**（从页面 computed style 解析，hsla→hex；alpha 色阶为 8 位 hex）。注意官方页面本身不显示数值文本，色值需右键复制或解析 CSS 变量——本快照已补全。
- **Typography**（`foundations/typography.md`）：`text-heading-*` / `text-button-*` / `text-label-*` / `text-copy-*` 工具类清单与用途（含 mono 变体、Subtle/Strong 修饰符）。
- **Materials**（`foundations/materials.md`）：材质层级（base/small/medium/large + tooltip/menu/modal/fullscreen）与圆角、用途、无障碍规范。

## 组件索引（72）

avatar, badge, banner, book, breadcrumbs, browser, button, calendar, checkbox, choicebox, clearable-input, code, code-block, collapse, combobox, command-menu, context-card, context-menu, copy-button, description, destructive-action-modal, dots-menu, drawer, empty-state, entity, error, error-card, feedback, fieldset, file-tree, gauge, grid, input, json-view, keyboard-input, label, load-more-button, loading-dots, menu, middle-truncate, modal, multi-select, note, pagination, phone, pill, progress, project-banner, radio, relative-time-card, scroller, search-input, select, separator, sheet, show-more, skeleton, slider, snippet, spinner, split-button, status-dot, switch, table, tabs, text-with-copy-button, textarea, theme-switcher, toast, toggle, tooltip, video

每个组件页包含：组件说明、尺寸/变体/状态（hover/disabled/loading 等）、完整 TSX 示例代码、Best Practices，以及**「渲染参数（官方页面实测）」引用块**（每组件所有 demo 区块在 light/dark 双主题下的容器与控件 computed style 实测值——高度/padding/字号/字重/颜色/圆角/边框，供实现时精确对齐视觉）。

## 项目内样式消费指南（src/index.css 已实现）

本快照的规范已编制为项目内可复用的样式资产（`src/index.css`），实现 UI 时按以下清单消费，**禁止凭想象猜参数**：

### 色板（92 token，双主题）

- 全色阶工具类：`bg-gray-200` / `text-blue-700` / `border-red-300` 等（`--color-*` 映射，Light/Dark 自动切换）
- 语义角色：`bg-primary` / `text-muted-foreground` / `border-border` / `bg-destructive` 等（业务状态绑定语义 token，不用 raw hex）
- `gray-alpha-*`：半透明边框 / 分隔线 / 遮罩 / hover 层（Dark=白 alpha，Light=黑 alpha）
- 关键常量：主行动蓝 `blue-700=#006efe`、破坏红 `red-700=#e5484d`、警告琥珀 `amber-700=#ffb224`、成功绿 `green-700=#46a758`

### 排版（官方实测值）

- `text-heading-*`：14/16/20/24/32/40/48/56/64/72（行高 1:1、负 letter-spacing，官方实测）
- `text-button-*`：12/14/16（仅按钮内部）
- `text-label-*`：12/13/14/16/18/20 + `text-label-12/13/14-mono`
- `text-copy-*`：13/14/16/18/20/24 + `text-copy-13-mono`
- **Subtle/Strong 修饰**：`<strong>` 嵌套自动切换（Heading→500、Label→500、Copy→550）
- 数字/ID/表格数值用 `tabular-nums`，代码语境才用 mono

### 材质（8 级）

- `material-base` / `material-small` / `material-medium` / `material-large`：页面卡片
- `material-tooltip` / `material-menu` / `material-modal` / `material-fullscreen`：浮层
- 圆角：base/small/tooltip=6px，medium/large/menu/modal=12px，fullscreen=16px
- 禁止同一元素堆叠两个材质；材质与 z-index 层级对齐

### 焦点环 / 间距

- 所有可交互元素统一 `focus-ring`（2px 表面色描边 + 4px 主色 ring，官方实测）；页面禁止自定义 outline/ring
- 间距用标准 Tailwind 尺度（4px 倍数 = Geist 官方 4/8/12/16/24/32/40/64/96）；组内紧凑、组间适中

### 组件实现流程

1. 读 `components/<name>.md` 顶部「渲染参数」块（容器 b/r/bg + 控件 h/pad/字号/颜色，双主题）
2. 消费 `src/components/ui/*` 基础组件（已按官方实测对齐）
3. 视觉结果用浏览器截图 + vision 复核，不凭代码推断

## 注意事项

- `geistcn-icons` 页面在官方已 307 重定向到 introduction（Vercel 已移除独立图标页），未保留。
- `screenshots/` 为 light 主题；如需 dark 对照可重跑抓取脚本加 `--dark` 参数。
- 渲染参数由 `geist-styles.js` 实测生成（2026-08-08），若官方样式更新可重跑刷新；table.md 另有独立维护的参数表，两者可共存。
- 抓取脚本（临时）：`C:/Users/Leon/.hermes/cache/geist-crawl/geist-crawl.js` 与 `geist-styles.js`
