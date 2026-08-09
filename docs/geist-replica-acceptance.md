# Geist 组件复刻验收报告

> 验收日期：2026-08-09
>
> 官方依据：<https://vercel.com/geist/> 实时页面、页面实际加载的 Geist bundle、`docs/geist-markdown-refs/` 本地快照
>
> 范围：72 个官方组件；`Step Point` 是本框架纯本地扩展，不计入官方复刻数量

## 结论

72 个官方组件已完成实现、文档接线、双主题、四视口、视觉与适用交互验收。未保留已迁移的本地旧组件路径或双轨 API。允许差异仅限：

- HarmonyOS Sans SC 与项目自托管等宽字体；
- Lucide 图标路径差异，默认描边保持 2px；
- 纯本地 `Step Point` 组件；
- 官方页面本身已经下线或重定向的示例，采用快照与官方 bundle 作为补充依据。

## 验收矩阵

| Gate                                 |                                              覆盖 | 结果                             |
| ------------------------------------ | ------------------------------------------------: | -------------------------------- |
| 官方快照 → metadata → Live Demo 覆盖 |                                    72 个官方 slug | 72/72                            |
| 文档运行时健康检查                   |                         72 路由 × 2 主题 × 4 视口 | 576/576                          |
| 视觉截图矩阵                         |                         72 组件 × 2 主题 × 4 视口 | 576/576 PNG 可解码并完成分组复核 |
| 可信输入交互                         | 键盘、鼠标、Esc、焦点返还、Portal、ARIA、状态转换 | 29/29                            |
| TypeScript                           |                             根应用 + `docs/geist` | 通过                             |
| oxlint                               |               `src/`、`docs/geist/src/`、`tests/` | 0 warning / 0 error              |
| Vitest                               |                registry、迁移零残留、`cn()`、Menu | 通过                             |
| 生产构建                             |                             根应用 + `docs/geist` | 通过                             |

四视口固定为 375、768、1440、1920px。运行时健康检查会验证目标路由标题、非空 Live Demo、主题应用和根级横向溢出；视觉矩阵按每个 Live Demo 的完整 `getBoundingClientRect()` 裁剪，不再使用 800×720 的人工上限，避免宽组件或高组件的验收证据被截断。

## 交互覆盖

适用组件覆盖以下行为：

- 原生与 Radix 选择控件：Checkbox、Choicebox、Radio、Select、Switch、Toggle、Multi Select；
- 键盘导航：Calendar、Menu、Tabs、Slider；
- 弹层与 Portal：Combobox、Command Menu、Context Menu、Dots Menu、Modal、Drawer、Sheet、Destructive Action Modal、Split Button；
- Escape 关闭与焦点返还；
- 类型确认门、Toast 打开/关闭、Tooltip hover、Show More 展开、Clearable/Search Input 清除、JsonView/Collapse 状态切换、Load More busy 状态、Theme Switcher 主题同步。

## 破坏性 API 迁移

以下旧 API 已删除，不提供 alias、wrapper、re-export、旧路由或双轨实现：

- `DropdownMenu` → `Menu`；
- `SegmentedControl` → 语义对应的 `Switch` 或 `Select`；
- `ThemeSwitch` → `ThemeSwitcher`；
- Radix compound `Select` 调用 → 官方原生 `<Select><option /></Select>`；
- 旧 `MultiSelect/MultiSelectItem` → 官方受控 `MultiSelectRoot/MultiSelectRow`；
- Banner、Breadcrumbs、Browser、Avatar、Book、Empty State、Pagination、Tabs、Toast、Tooltip、Video 的旧 compound exports → 各组件官方单一契约；
- Copy Button、Gauge、Grid、Label、Middle Truncate、Note、Snippet、Status Dot、Text With Copy Button 的旧 prop alias → 官方 prop 名称。

`tests/docs-coverage.test.ts` 会递归扫描 tracked 与 untracked 源文件，阻止旧 API 回流。

## 已修正的快照事实

`components/toggle.md` 原记录 medium/large checked 位移为 18px。2026-08-09 从官方实时页面实际加载的 bundle 复核到：

- small：`translate-x-[14px]`；
- medium：`translate-x-[16px]`；
- large：`translate-x-[16px]`。

本地实现原 16px 值正确，已修正文档而非错误修改组件。

## 可复现命令

```bash
vp test
node_modules/.bin/tsc -b --noEmit --force
node_modules/.bin/tsc -p docs/geist/tsconfig.json --noEmit
node_modules/.bin/oxlint src/ docs/geist/src/ tests/
vp build
node node_modules/vite/bin/vite.js build docs/geist --config docs/geist/vite.config.ts
DOCS_URL=http://localhost:5201 node tests/runtime-docs-audit.mjs
DOCS_URL=http://localhost:5201 node tests/runtime-interaction-audit.mjs
DOCS_URL=http://localhost:5201 node tests/capture-visual-matrix.mjs
```

视觉矩阵默认写入 `C:/Users/Leon/geist-acceptance/final-shots`，不进入 Git。
