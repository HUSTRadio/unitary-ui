# Unitary 文档站 — 问题记录

> 目标界面：https://vercel.com/geist/introduction · 日期：2026-08-08
> 摘要：本文记录文档站初版验收发现；当前 registry 和 Live Demo 已覆盖官方 72 个组件，另保留纯本地 Step Point。条目中的“当前状态”以 2026-08-09 迁移结果为准。

---

## F1: 文档站外壳组件缺失

- **当前状态**：Banner / Pagination / Feedback 已沉淀为共享基础组件；Sidebar 仍为文档站专用外壳，继续按 YAGNI 保留在 `docs/geist/`。
- **复现路径**：`docs/geist/src/App.tsx` 引入上述外壳组件，全部为 docs 专用文件。
- **期望**：框架提供可直接复用的站点外壳基础组件。
- **影响**：低。文档站独占使用，根仓库其他消费方暂不需要；如需在更多页面复用，需先沉淀为基础组件。
- **建议**：如需复用再抽（YAGNI）；保持组合实现即可。

## F2: SearchInput 组件（已解决）

- **当前状态**：已新增共享 `SearchInput`，组件 registry、导航和 Live Demo 均已接线。
- **复现路径**：打开任意页面 → Banner 中部搜索框。
- **期望**：官方有完整 SearchInput（含快捷键聚焦、结果面板）。
- **影响**：低。当前为占位展示；快捷键聚焦等交互待后续接入。
- **建议**：新增 `SearchInput` 基础组件（含 kbd 提示与 `/` 或 `Ctrl+K` 聚焦），文档站与根仓库 styleguide 共用。

## F3: 主题切换形态差异（已解决）

- **当前状态**：统一使用官方三态 `ThemeSwitcher`，文档站和根 styleguide 直接复用同一实现。
- **复现路径**：`docs/geist/src/components/docs-shell.tsx` 与 `src/App.tsx` 均引用 `theme-switcher.tsx`。
- **期望**：两种形态各有用武之地（banner 三态 segmented 省空间、设置页下拉可带更多信息）。
- **影响**：无功能影响；两种形态并存。
- **结论**：不保留下拉旧实现或双轨 API；三态控件直接复用 `src/lib/theme.tsx`。

## F4: CopyButton 组件缺失

- **现象**：代码块（`docs-components-page.tsx`）与 Introduction 终端行（`docs-cards.tsx`）的 Copy 功能各自维护一份 icon-only Button + `navigator.clipboard` + execCommand 降级逻辑（两处重复 ~30 行）。
- **复现路径**：`/components/button` 详情页代码块右上角；首页 Components 卡终端行。
- **期望**：一个 CopyButton 基础组件（复制 + 成功态反馈 + 降级）。
- **影响**：中。两处重复实现，后续第三处使用会继续复制。
- **建议**：新增 `CopyButton` 基础组件，抽离 clipboard 降级逻辑（隐藏 textarea + execCommand），两处改用。

## F5: Radio 组件缺失

- **现象**：反馈区 emoji radio 用原生 `<input type="radio" className="sr-only">` + `<label>` 组合（`docs-feedback.tsx`），`role="radiogroup"` 为逐条声明。
- **复现路径**：任意页面底部 Give feedback 胶囊。
- **期望**：框架提供 Radio 基础组件（Radix RadioGroup 封装 + Geist 样式）。
- **影响**：低。原生 radio 语义正确（键盘方向键可操作，已实测 ArrowRight 正常移动选中）；仅样式层（选中 ring）为本层自定义。
- **建议**：新增 Radio 基础组件（radix-ui RadioGroup + Geist 视觉），反馈区改用。

## F6: 文档卡片 ≠ material 卡片

- **现象**：官方文档首页卡片是**发丝线网格单元**（无圆角/背景/阴影，仅 border-r/border-b 分隔），与框架 `material-*` 圆角卡片是两种视觉语言。文档站 `DocsCardGrid` 正确复刻了发丝线网格。
- **复现路径**：首页 6 卡网格 vs `/brands` 页 Brands 卡（material-base）。
- **期望**：无偏差——这是官方设计区分（首页网格 vs 内容页材质卡）。
- **影响**：无。设计决策，非缺陷。
- **建议**：保持现状；文档站内两套视觉语言并存属官方语义。

## F7: 装饰工具类缺失

- **现象**：点阵背景（首页 Brand Assets 预览）、虚线字体盒（Typeface 预览）、栅格装饰均用**作用域内样式**（Tailwind arbitrary property 或组件内 className），未抽成全局工具类。
- **复现路径**：`docs-cards.tsx` 中 `[background-image:radial-gradient(...)]`、`border-dashed`。
- **期望**：如多处使用，抽点阵/栅格/虚线工具类。
- **影响**：低。当前仅文档站预览使用。
- **建议**：如需全局化装饰（如登录页点阵背景），抽 `bg-dot-grid` / `bg-grid` 工具类到 `src/styles/index.css`。

## F8: 品牌资产近似

- **现象**：Vercel logo（三角）仍为文档站内联近似；Feedback 评分表情已改为官方 SVG 整体引用，不再使用 Unicode 近似。
- **复现路径**：Banner logo（`docs-shell.tsx` 内联 SVG）、反馈区 emoji。
- **期望**：官方品牌资产为设计基准，不复制其商标资产入库。
- **影响**：无。合理近似。
- **建议**：Vercel logo 继续保持近似；Feedback 表情维持 `feedback-faces.tsx` 的官方整体 SVG 和语义 token 引用，不拆解 path。

## F9: 官方 72 组件覆盖度（已解决接线缺口）

- **当前状态**：`components.ts` 与 Live Demo renderer 均覆盖官方 **72/72**；纯本地 Step Point 单独保留。侧栏由 registry 自动生成，不再维护重复清单。
- **验收边界**：接线完成不等于视觉验收完成；仍需逐组件完成双主题、四视口、状态和交互对照。

## F10: Grid 卡 → Materials 卡（设计决策）

- **现象**：官方首页 6 卡中有 **Grid** 卡；本框架未实现 Grid 元件，文档站以 **Materials** 卡替代（框架主打材质体系）。
- **复现路径**：对比官方 vercel.com/geist/introduction 与本站首页卡片集合。
- **期望**：如有 Grid 需求，先实现 Grid 元件再恢复官方卡片集合。
- **影响**：无功能影响；首页内容与官方略异。
- **建议**：findings 仅记录；如需恢复 Grid 卡，先实现 Grid 元件（`src/components/ui/grid.tsx`）。

## F-mono: text-copy-14-mono 不存在

- **现象**：官方排版表有 copy 的 14 mono 变体；框架 `src/styles/index.css` 快照仅定义 `text-copy-13-mono`。Task 3 实现时以 `text-label-14-mono` 替代（终端行、代码块文件头）。
- **复现路径**：`grep "copy-14-mono" src/styles/index.css` 无结果；`docs-cards.tsx` 终端行用 `text-label-14-mono`。
- **期望**：copy-14/16 等 mono 变体与官方一致。
- **影响**：低。字号近似（label-14 vs copy-14 同为 14px，行高不同）。
- **建议**：在 `src/styles/index.css` 补 `text-copy-14-mono` / `text-copy-16-mono` 变体（与官方实测值一致），或在 Typography 页标注缺口（已标注）。

## F-radix-1: indeterminate 非 boolean prop

- **现象**：radix-ui 1.6.7 的 Checkbox `indeterminate` 不是 boolean prop——半选态通过 `checked="indeterminate"`（CheckedState 字符串值）表达；组件文档与示例代码若写 `<Checkbox indeterminate />` 属误导。
- **复现路径**：`docs/geist/src/components/docs-components-page.tsx` CheckboxDemo 中 `parentState: boolean | "indeterminate"`。
- **期望**：组件文档标注正确 API。
- **影响**：低。实现已正确处理（`data-state="indeterminate"` 实测渲染正常）；仅文档示例（components.ts 中 code 片段写 `indeterminate` prop）需标注。
- **建议**：在 Checkbox 组件文档中标注：半选态传 `checked="indeterminate"`，非 boolean prop。

## F-radix-2: Menu destructive item（已解决）

- **当前状态**：共享 `MenuItem` 暴露 `type="error"`，由包装层统一 destructive 颜色和焦点状态，不要求消费方自行传入 className。
- **复现路径**：`docs-components-page.tsx` 的 Menu demo 使用 `MenuItem type="error"`。
- **期望**：组件文档标注；或包装层补 variant。
- **影响**：低。实现正确（实测 destructive 样式生效）。
- **结论**：消费方直接使用 `MenuItem type="error"`。

## F-shadcn-path: components.json css 路径

- **现象**：`components.json` 写 `"css": "src/index.css"`，但实际样式文件在 `src/styles/index.css`。文档站不在此目录跑 shadcn CLI（不受影响），但未来在根仓库跑 `npx shadcn add` 会报路径错误。
- **复现路径**：`cat components.json` → `tailwind.css: "src/index.css"`；`ls src/index.css` 不存在。
- **期望**：`"css": "src/styles/index.css"`。
- **影响**：低（当前）；中（未来 shadcn CLI 使用）。
- **建议**：改为 `src/styles/index.css`；同时确认 `baseColor` / `cssVariables` 与根样式一致。

---

## Task 7 自检修复记录（本任务）

### 响应式（四视口 375 / 768 / 1440 / 1920，puppeteer 实测）

| 视口 | 结论       | 说明                                                                                          |
| ---- | ---------- | --------------------------------------------------------------------------------------------- |
| 375  | ✅         | 单列网格（grid-cols-1）、侧栏隐藏（lg 以下）、搜索隐藏（md 以下）、无横向溢出                 |
| 768  | ✅         | md 两列网格（grid-cols-2）、侧栏仍隐藏、搜索可见（md:block）                                  |
| 1440 | ✅         | 完整三栏（Banner + Sidebar + 内容）、内容区 1136px 不拉伸                                     |
| 1920 | ✅（修复） | **修复前内容区 1616px 全宽拉伸** → `App.tsx` 内容区加 `mx-auto max-w-[1280px]`，修复后 1280px |

### 双主题（light / dark，1440×900 截图）

- ✅ Banner / Sidebar / 发丝线（light `#ebebeb` / dark `#2e2e2e` 均在背景上可见）
- ✅ 点阵背景（light 黑色 alpha / dark 白色 alpha，均渲染）
- ✅ 色条、材质方块、语义 token 表、代码块、反馈区全部双主题反转正常
- ✅ 语义 token 全走 `bg-background / text-foreground / border-border / bg-selected`，无硬编码色值

### 无障碍

- ✅ Banner 搜索 `aria-label="搜索文档"`、`role="search"`
- ✅ 主题切换 `ThemeSwitcher` 为 Light / System / Dark 三态 radio group，并为每个图标提供可访问名称
- ✅ 反馈 radio 组 `role="radiogroup" aria-label="反馈评分"`，ArrowRight 键盘实测可移动选中
- ✅ 全部 icon-only Button 有 aria-label（复制命令/复制代码/Collaborate/Shield）
- ✅ Tab 全遍历 40 个焦点停靠点，全部有可见焦点指示（focus-ring 双环 / input-focus-ring 柔光）
- ✅ 卡片链接语义：首页网格 `<a href="#/...">`、侧栏 NavLink、分页 NavLink
- ✅ 对比度：muted-foreground 实测 light `#4d4d4d`/`#ffffff` = **8.45:1**，dark `#a1a1a1`/`#0a0a0a` = **7.66:1**（均 ≥ 4.5:1 AA）
- ✅ 控制台无 JS 错误

### Phase 5 高风险组件复验（2026-08-17）

| 维度       | 覆盖范围                                                             | 结果                                                                                                |
| ---------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 响应式结构 | Feedback / Combobox / Modal / Collapse / Toast；375、768、1440、1920 | 40 个视口/主题/路由组合均无 document/body 横向溢出，demo 卡片越界 `0`                               |
| 主题       | 5 个高风险路由 × 4 视口 × light/dark                                 | light 20 组 `#fff/#171717`，dark 20 组 `#000/#ededed`                                               |
| 动画       | Toggle / Switch / Menu / Collapse / Tooltip / Modal / Toast          | CDP computed 与官方 duration/easing/状态时序一致；Collapse 高度中间帧和 Modal reduced-motion 已实测 |
| Toast 语义 | Modal focus trap + action + dismiss + stack                          | action 可鼠标触发，Modal 保持打开，`Copy reverted` 出现，焦点恢复 Modal 内触发按钮                  |
| 视觉       | Feedback 官方/本地同尺寸标注对比图                                   | `gpt-5.6-sol` 返回 `PASS`；确认四枚表情、蓝色泪痕、琥珀色眼睛、间距与裁切对齐                       |

确定性门禁：根 tsc 0；docs tsc 15 个既有 TS6133/TS1117、非基线 0；`vp test` 82 files / 496 tests；`vp build` 成功。
