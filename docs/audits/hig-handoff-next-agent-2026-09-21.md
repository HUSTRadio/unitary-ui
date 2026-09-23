# Unitary UI · HIG 工作交付书（给下一个 Agent）

- **生成时间**：2026-09-21 ｜ **最近修订**：2026-09-23（HIG-AUD-010/019、008 已提交（`1045dd0` / `5d63437`，台账 `4b725d3` / `a1b8efa`）；**HIG-AUD-017 修复完成并运行确认、尚未提交**；再上一批 HIG-AUD-009/011/012 为 `8d528b8` + `0ed630a`；本文件按最新进度全文对账）
- **工作区**：`d:/Projects/GitHub/HUSTRadio/unitary-ui`
- **仓库状态**：分支 `master`，领先 `origin/master` **83** commits；**0 staged、0 未提交改动**（截至 2026-09-23，`git status --short` 仅剩未跟踪 `.tmp-logo/`；开工时以 `git status` 为准）
- **口径**：只记**可核对的静态事实**与**已验证命令输出**；推断处显式标注；未能核实的条目集中列在 §9。

---

## 0. 先读这一条：上下文预算纪律（强制）

### 0.1 警告

本任务的核心材料是**高密度长文档**，且分散在 4 个互相交叉的台账中。**不使用 subagent、直接在主代理里 `read_file` 这些文件，会在几分钟内吃光上下文**，典型后果依次是：输出被截断 → 早期结论丢失 → 开始凭记忆编造行号与条目 ID → 重复劳动 → 任务中途失败。

这不是假设。本轮会话在同类材料上已实际发生两次：
1. **输出 token 超限中断**一次；
2. 首轮枚举子代理的返回**前两节被截断**（被迫补跑第二个子代理才拿到完整 HIG-AUD 清单）。

纯主代理路径下做同类枚举，几乎必然重复这一失败。

### 0.2 量化证据（实测行数）

| 文件 | 行数 | 说明 |
|---|---|---|
| `docs/audits/hig-experience-audit-2026-09-18.md` | **912** | 主台账，53 条问题的主要来源 |
| `docs/audits/hig-coverage-matrix-2026-09-18.md` | 415 | 覆盖矩阵 + `HIG-VER-*` 验证清单 §E |
| `docs/audits/hig-experience-audit-2026-09-18-addendum-phase2.md` | 478 | 二期新增 13 条 + §5A–§5K 修复记录 |
| `docs/audits/geist-component-and-responsive-remediation-design.md` | 277 | 既有整改门禁台账（与 HIG 交叉点仅 3 处） |
| `PLAN-HIG-COMPONENTS.md` | 262 | 计划与验收标准 |
| `docs/audits/motion-duration-audit-2026-09-20.md` | 78 | 动效债务（含 2026-09-23 迁移状态列） |
| `docs/audits/tests-typecheck-debt.md` | 23 | 类型债务 |
| **审核+计划小计** | **≈ 2 445** | 一次全读 ≈ 数万 token 量级（2026-09-23 实测行数） |
| `docs/geist/src/content/component-guides/*.ts`（21 个） | **≈ 11 200** | 双语指南正文；**绝不可全量读** |
| `docs/llm/index.json` | 1 673 | 机器可读索引 |
| `docs/llm/pages/` | 208 文件 / **1 837 KB** | 生成语料；**绝不可全量读** |

即：「审核 4 件 + 计划 1 件 + 指南全量」量级 ≥ **25 000 行 / 2 MB**，超出任何可用上下文。

### 0.3 强制做法

**必须**用 `code-explorer` 子代理承接所有枚举/普查，并在 prompt 里写明输出契约：

- 派子代理时明确要求「**只回表格 + 结构化列表，不粘原文、不复述章节**」；
- **分域并行**（① HIG-AUD 状态枚举 ② 计划待办枚举 ③ 债务/验证枚举），互不重叠；
- 子代理单次回包控制在 **≤ 60 行**；超了就拆成多次调用；
- 主代理仅在需要「某 1–3 行具体证据」时才 `read_file`，**且始终带 `offset`/`limit`**；
- ❌ 禁止无 `limit` 读取 `hig-experience-audit-2026-09-18.md`；
- ❌ 禁止 `read_file` 任意 `guides-*.ts` 全文（单文件最大 1 295 行）；
- ❌ 禁止全量遍历 `docs/llm/pages/` 或 `docs/llm/index.json`。

**预算红线（自我检查）**：主代理同时持有的审核类原文合计 ≤ **100 行**；一旦发现自己在「回忆」条目 ID 或行号，立即停手，改用子代理或带 `limit` 的定点读取重新取证。

---

## 1. 已完成部分（**不要重做**）

| 事项 | 证据 |
|---|---|
| **HIG-AUD-001**（Quick Actions 遮罩层级压住内容）已修复 | 遮罩 `z-[var(--uni-z-drawer)]`(200) < 内容 `--uni-z-popover`(2001)；`src/components/ui/context-menu.tsx:154-156`、`:212` |
| **HIG-AUD-051**（Quick Actions 打开即崩溃：Portal 多子节点）已修复 | `Portal` 只保留 `ContextMenuPrimitive.Content` 一个子节点（`context-menu.tsx:205-218`）；遮罩改由 `QuickActionsScrim`（`:165-180`）在 `Content` 子树内自行 portal（`:216`） |
| **HIG-AUD-002**（ContextMenu 无键盘打开路径）已修复 | `ContextMenuTrigger` 自定义组件识别 `ContextMenu` 键 / `Shift+F10`，在触发器中心派发合成 `contextmenu`；`tabIndex={tabIndex ?? 0}` + `focus-ring`（`context-menu.tsx:27-61`） |
| **HIG-AUD-003**（BottomSheet 面板级指针捕获吞内部滚动）已修复 | 四个手势 handler 只挂 `<Grabber>`，面板内容区不绑定指针事件（`bottom-sheet.tsx:111-116`、`:201-208`）；由 `1866616`（2026-09-19）完成，本轮复核并转为回归保护 |
| **HIG-AUD-004**（EditMenu 键盘不可达）已修复 | `role="toolbar"` roving tabindex（`edit-menu.tsx:141-143/:377-378/:485`）+ 焦点入首项（`:380-396`）+ 文档级 `Escape`（`:398-409`）+ 焦点归还（`:277-281`）；附带动画期测量缺陷改用 `offsetWidth/offsetHeight` |
| 上述五条的**运行确认** | Playwright 复跑：右键 → `[role="menu"]` ×1、`[data-slot="context-menu-quick-actions-overlay"]` ×1、`pageerror` 0；Escape 关闭后遮罩移除；同页 `div[aria-label="Context menu target"]` 前后恒为 5；002 键盘路径与右键菜单位置逐像素一致、004 键盘选区后焦点入首个可用项 |
| **HIG-AUD-054**（`/components/feedback` @320 根级横向溢出 10px，2026-09-22 门禁新发现，P2）已修复 | 根因：demo 收起态胶囊自然宽 285px，占位层 `[data-feedback-inline]` 作为 flex item 被压缩而内层**绝对定位**胶囊不参与 shrink → 胶囊右缘突破视口。修复：占位层补 `shrink-0`（`src/components/ui/feedback.tsx`）。独立探针实测：双主题 × 6 视口 `scrollWidth - clientWidth = 0`，@320 胶囊 18..303px（左右留白 18/17 对称）。台账落点：增补 §5C、本交付书 §7.1 |
| **HIG-AUD-038**（MenuBar 长菜单无高度约束，P1）已于 2026-09-22 修复并运行确认 | 修复：`menu-bar.tsx` 的 `MenuBarContent` 补 `max-h-[var(--radix-menubar-content-available-height)]`、`MenuBarSubContent` 补 `max-h-[var(--radix-popper-available-height)]`。**实况修正**：Radix menubar **不生成** sub 命名空间变量（dist + 运行时双重实测），SubContent 唯一可用约束源为 popper 原生变量（与 dropdown-menu SubContent 官方做法一致）。新增永久回归 `tests/e2e/menu-bar-content-height.spec.ts`（2 passed，注意顶级触发器 role 为 `menuitem` 非 `button`）；门禁：typecheck + `menu-bar-api` 5/5 + `docs-layout chunk 2/11` 双主题 2/2 全绿；双主题 × 双视口几何核查通过。附带补强 044 证据（320 视口子菜单横向溢出 107px，未修）。台账落点：增补 §5D、矩阵 `:245/:346`、主报告 §1.2 P1 行 |
| **HIG-AUD-006/007**（SidePanel 焦点丢失 + noOverlay 语义，P1，成对）已于 2026-09-22 修复并运行确认 | 修复（`side-panel.tsx`）：006 = `SidePanelContent` 自实现归还（`onOpenAutoFocus` 记录 + `onCloseAutoFocus` preventDefault + `setTimeout` 归还；**不导出 SidePanelTrigger**——与 024 导出决策纠缠）；007 = `Root` 补 `modal={!noOverlay}`（不锁滚动/不 hideOthers/无陷阱；外点仍 onDismiss，消费者决定关闭）。回归：`tests/side-panel-api.test.tsx` 追 4 用例 **12/12 passed**（**jsdom 经验**：滚动锁断言用 `data-scroll-locked` 属性而非 `body.style.overflow`（后者在 jsdom 下两种模式恒空=假阳性）；Radix 外点在 jsdom 不触发，须真实浏览器）。真实浏览器核查（临时探针，已删）：SidePanel 无 docs 路由，经 vite `/@fs/` 动态 import harness（dev root 是 `docs/geist`；`.scratch` 点目录 vite 不服务），双主题一致：Escape 后 `activeElement=触发按钮`、模态 `data-scroll-locked:true`、noOverlay `false` + `elementFromPoint` 命中页面 + 真实外点关闭。门禁：typecheck exit 0。台账落点：增补 §5E、矩阵 `:153/:200/:278/:314-315`、主报告 §4.2 两条目 + §1.2 P1 行 |
| **HIG-AUD-055**（移动导航面板三处视觉缺陷：① 关闭按钮重复 ② 外框贴合边圆角 ③ 内容贴边，P2，2026-09-23 用户实测反馈）已修复并运行确认 | 修复：`hamburger-menu.tsx`（`renderCloseButton = showCloseButton && !belowTopbar`——belowTopbar 下 topbar 触发按钮即关闭控件；toolbar 左内边距随关闭按钮取 `pl-0`/`pl-4`；触发按钮补 `aria-label`，此前实测 `aria-label=null`（`HamburgerIcon` 为 `aria-hidden`）；`menu-nav`/`menu-results` `px-2`→`px-4`）、`expand-panel.tsx`（`side=left` 的 belowTopbar 分支 `rounded-tl-none`→`rounded-none`，原值对 left 本就无效）、`docs-shell.tsx`（不传 `showCloseButton`；工具行 `[&>[data-slot=panel-toolbar]]:md:hidden`）。探针实测（双主题 × 390/900，数值两主题一致）：`panel-close` 计数 0、四角圆角全 0px、`menu-nav` padding-left 16px（标题 x=16、条目块 x=16/宽 259）、900 视口工具行 `display:none` 且 nav 上移。回归：`hamburger-menu-modes` / `docs-shell-nav-tiers`（重写）/ `docs-shell-geometry` → 定向 **6 files / 53 tests 全绿** + `docs-layout --grep "drawer behaviors"` **3 passed (49.8s)**。**全量 `pnpm test` 8 failed 经 `git stash` 基线对照判定为既有失败/flaky**（7 个 `tests/audit/*` + `showcode-typecheck` 单跑通过），与本轮无关。台账落点：增补 §5F、本交付书 §1 |
| **HIG-AUD-040**（ActivityView 面板无可访问名称，P1，根因在 `bottom-sheet`）已于 2026-09-23 修复并运行确认 | 修复：`bottom-sheet.tsx` 新增可选 `"aria-label"` / `"aria-labelledby"` props 透传到 `DialogPrimitive.Content`（对齐 drawer / destructive-action-modal 惯例；皆不传时行为不变）；`activity-view.tsx` 用 `useId()` 生成 `titleId`、标题行带 `id`、BottomSheet 传 `aria-labelledby`（有标题）/ `aria-label`（`title=null` 回退），置于 `{...sheetProps}` 前可被覆盖；`component-api.ts` 登记两个新 props。回归：新增 `tests/activity-view-a11y.test.tsx`（4）+ `bottom-sheet.test.tsx`（+1）+ `component-api-registry.test.ts`（+2）→ 定向 **4 files / 30 tests 全绿**；typecheck exit 0。真实浏览器探针（390×844 × 双主题，跑完即删）：`aria-labelledby` 解析到「共享」、不双重命名、**Radix「requires a DialogTitle」警告消除**、视觉无回归。台账落点：增补 §5G、矩阵 `040` 行、本交付书 §1/§2 |
| **HIG-AUD-013**（触屏命中区 < 44pt，P1，跨 11 个组件）已于 2026-09-23 修复并运行确认 | **方案裁决**：密集行布局不能伪元素外扩（相邻命中区重叠反造误触）→ 采用 `pointer-coarse:` 变体：**触屏下 `min-h-11`/`min-w-11` 抬到 44×44、桌面维持 Geist 原视觉**（依据：HIG 44pt 针对触屏；WCAG 2.5.8 AA 桌面仅需 24×24，36px 菜单项已达标）。13 处声明覆盖 11 文件（行类补高、短标签/图标/胶囊同时补宽——实测 MenuBarTrigger「编辑」仅 35.7px）。**绕开原依赖**：主报告路线 2.5 原依赖 027（Select 移动形态）决策，本方案无需等 027。回归：新增源码契约 `tests/touch-targets-contract.test.ts`（15 断言）+ 永久 e2e `tests/e2e/touch-targets.spec.ts` → **9 passed (33.6s)**（触屏 context 实测 boundingBox ≥44×44：宽视口 6 静态目标 + 菜单项 + MultiSelect 行；窄视口 Toolbar 溢出菜单项）。**e2e 踩坑**：`actionTimeout` 未设则元素缺失时 `boundingBox()` 无限等待（首轮卡满 15m）；Radix zoom 动画中间帧低报（42.5px）；窄屏下 Toolbar 项被折叠不可静态测量。台账落点：增补 §5J、矩阵 `013` 行、本交付书 §1/§2 |
| **HIG-AUD-037**（破坏性项无二次确认，P1，HIG `pull-down-buttons` 依据）已于 2026-09-23 修复并运行确认 | **方案裁决**：不内建确认浮层（HIG 允许 action sheet 或 alert，形态留给消费方；既有 `DestructiveActionModal` 的 `verificationPhrase` 必填属高门控，不适合 Remove App 级确认）→ 组件只给红色语义 + 消费方串接确认 + 示例演示 + JSDoc/指南写下约定。改动：Quick Actions 与 ActivityView 两个示例改为「破坏项 → Modal 确认（取消/确认两路径，取消无副作用）」；`context-menu` / `activity-view` / `split-button` 三处 `destructive` JSDoc 写明契约；guides-04/05/13 双语 accessibility 段与示例描述同步。**永久回归**：新增 `tests/e2e/quick-actions-destructive-confirm.spec.ts`（2 用例：红字断言 `rgb(238,0,0)` → 点击弹确认 → 取消状态不变 → 确认才执行；ActivityView 同）**2 passed (29.6s)**；定向 vitest 3 files 全绿；双主题视觉核查通过。台账落点：增补 §5I、矩阵 `037` 行、本交付书 §1/§2 |
| **HIG-AUD-039 + 050**（Toolbar 折叠丢弃非 ToolbarItem 内容 / 溢出项丢 disabled+active / Fragment 收集失败，P1+P3）已于 2026-09-23 修复并运行确认 | 修复（`toolbar.tsx`）：`CollapsedItem` 增 `disabled`/`active` 并透传（溢出项 `disabled=` + `data-active` + `aria-current` + 常驻高亮）；新增 `isCollapsibleGroup()`——显式 `collapsible` 优先，未指定时仅全 ToolbarItem 组折叠，混合内容组常驻（显式折叠 + 混合内容时 dev 告警）；新增 `flattenChildren()` 递归展平 Fragment/数组（050 随之闭环）。**踩坑实况**：`ToolbarGroup` 函数签名的 `collapsible = true` 默认值必须移除，否则收集器（读原始 props）与组件（读解构值）判定不一致 → 组被折叠且溢出菜单为空。回归：新增 `tests/toolbar-collapse.test.tsx`（6 用例，jsdom + mock ResizeObserver）+ `toolbar-api` 契约补强 → 定向 **3 files / 19 tests 全绿**。真实浏览器探针（320×700 × 双主题，跑完即删）：溢出菜单 6 项中「网格视图」`data-active="true"` + `aria-current="true"`（修复前全丢），其余项正确为 null；截图确认 active 项常驻高亮。台账落点：增补 §5H、矩阵 `039`/`050` 行、本交付书 §1/§2 |
| **HIG-AUD-009 / 011 / 012**（z-index 三态并存 / 退场动画不对称 / 时长 token 覆盖不全，P1，浮层 token 化三件套）已于 2026-09-23 修复并运行确认 | **基线校正**：三条目自 09-18 后代码已漂移——Select / EditMenu / Toast 的退场与时长在既往修复中已 token 化，本轮按实况收敛。**009**：destructive-action-modal 遮罩+卡片 `z-50` 与 command-menu `z-100` → `--uni-z-modal`；ContextMenuContent（**决策**：可在 drawer/modal 内唤起 → popover 带，与同文件 QuickActions 对齐）、multi-select、feedback、relative-time-card、calendar 组合框（`z-[99999999]`）→ popover 带；index.css tip 九位数字面量 → `--uni-z-context-card`；新增 `--uni-z-header: 40`（navbar 回退显式化，保留 `,40` 不破坏锁定测试）+ z token 组补层级序/配对约定注释。**011**：menu / menu-bar（`MENU_BAR_SURFACE`）/ context-menu（含 QuickActions）/ multi-select 退场补 `zoom-out-95`；relative-time-card 补整套退场。**012**：menu 族补 `duration-(--uni-duration-fast)`、destructive-action-modal 补 `--uni-motion-overlay + ease-pop`（对齐 modal）、context-card 补 base 档、bottom-sheet / responsive-drawer `300ms` 与 drawer `500ms` 内联、command-menu `0.3s/0.4s` → 档位 token、`sheet` 官方对齐的 `ease-in-out` 走**内建显式化**（`--ease-in-out` 与 Tailwind v4 内建值严格相等，computed 零变化）。**账本清账**：`motion-duration-allowlist` 12→7（移除 0.3s / 0.4s / 300ms / 500ms）；`bottom-sheet.test.tsx:114` 硬断言随迁移更新（motion 审核 §9 遗留闭环）。**回归**：`layer-tokens` / `duration-tokens` / `ease-tokens` 治理扩展 + 8 个组件测试；定向 **23 files / 184 tests passed**；typecheck exit 0。**双主题探针（跑完即删）**：computed 实测 menu 50/0.15s、modal 卡片与遮罩 300/0.35s/ease-pop、multi-select 2001、command-menu 300、context-menu 2001、hover-card 2001；退场经 `animationstart` 实测 `exit` + `--tw-exit-scale` 生效、command-menu `command-menu-scale-out`。台账落点：增补 §5K、主报告 §4.2 + §1.2、矩阵、motion 审核 §4/§8/§9、本交付书 §1/§2/批次 C/§6 |
| **HIG-AUD-010**（Overlay 背板 5 种写法，P1，一致性）已于 2026-09-23 修复并运行确认 | **方案裁决（与条目原建议不同）**：5 种写法实为**两种有官方出处的遮罩角色**（表面洗色 `#f2f2f2`/`#000`@0.8 = 官方 Modal scrim + 官方 Sheet overlay；暗化 `rgba(0,0,0,.4)` = 官方 Drawer overlay）→ 不做「全迁 backdrop 族」（会破坏 Drawer 官方 parity），改为**两族并行登记**：新增 `--uni-overlay-scrim-color`（alpha 内联，护 `backdrop-filter` 合成）与合成色 `--uni-overlay-backdrop`（`color-mix`，供 Content 是 Overlay 子节点的 modal，避免元素 opacity 把内容一起降透明）；7 处写法收敛、computed 零变化，唯 `destructive-action-modal` 孤例 `bg-black/50`→0.4；`command-menu` 保持 design-gate 冻结的官方 cmdk 写法（单列例外，契约锁定）。验收 grep 为空。回归：新增 `tests/overlay-backdrop-tokens.test.ts`（6 用例）+ 同步 9 个旧断言测试 + `raw-color-allowlist` 清账。**探针（跑完即删，双主题 12 passed）**：旧写法与 token **渲染像素逐字节等价**、族内 computed 一致（`rgba(0,0,0,0.4)`）、modal 遮罩满覆盖 + 卡片精确居中 + 内容未被降透明。台账落点：增补 §5L、主报告 `010`、矩阵 `:229`/`:150-154`/`:318` |
| **HIG-AUD-019**（reduced-motion 覆盖不完整，P1，WCAG 2.3.3）已于 2026-09-23 修复并运行确认 | **根因（本轮新发现）**：`data-[state=open]:animate-in` 的 specificity 0,2,0 **压过**单类名 `motion-reduce:animate-none`（0,1,0）→ 22 个 tw-animate 浮层的组件级 reduce 类**一直是空操作**，实际只有全局 `0.01ms !important` 兜底（原审核「28 文件包含 motion-reduce」属**虚假覆盖**）。修复：animation kill switch 统一 **`motion-reduce:animate-none!`**（末尾 important；`skeleton` 的 v3 前缀写法归一）；过渡侧实测 plain `motion-reduce:transition-none` 已生效、无需 important；点名缺口 `theme-switcher`/`combobox` 补齐，**`drawer` 面板缺口经复核不成立**（行号漂移）。回归：永久 e2e `tests/e2e/reduced-motion.spec.ts`（**8 passed**：reduce 下 modal/quick-actions/bottom-sheet/command-menu 的 computed `animation-name: none` + 功能正常）+ `tests/reduced-motion-coverage.test.ts`（5 用例，含免动画清单与全局兜底冻结）。**环境教训**：`test.use({reducedMotion})` 在本项目配置下不生效，须用 `page.emulateMedia()`。台账落点：增补 §5L、主报告 `019`、矩阵 `:232`/`:327`、motion 审核 §5/§8 |
| **HIG-AUD-008**（i18n key 缺失 3 处，P1）已于 2026-09-23 修复并运行确认 | **补齐 3 key**（en/zh 双侧行序镜像）：`"Close menu"`→`关闭菜单`（`hamburger-menu.tsx:234,278`）、`"Ctrl K"`→两侧同值（`:324` 的 `<kbd>`，快捷键不翻译）、`"Resize height"`→`调整高度`（`grabber.tsx:45`，**key 由中文改英文写法**，修掉英文站显示中文）。**根因修复**：`framework-messages.ts` 增 `FrameworkMessageKey`，`i18n.tsx` 把 locale 消息表注解为 `Record<FrameworkMessageKey, string>` → 缺 key 变**编译错误**（不再靠人工同步）。回归：`component-i18n-source` 新增键集双向相等 + 钉住 3 key + **全 `src` 扫描 `t("…")` 字面量 key 存在性**（补上让 3 key 漏过的缺口；含条件分支/模板前缀族 + 收集器健康度断言）；`framework-i18n` 增 grabber 双语言断言；`grabber.test.tsx:31` 旧中文断言更新。**变异测试证明守护有效**（删 zh 一个 key → tsc TS2322 + 键集 + 调用点扫描三道同时报警）。**探针 4 passed**：bottom-sheet grabber `调整高度`/`Resize height`、导航面板 `菜单→关闭菜单`/`Menu→Close menu` 且无 key 原文回显。全 `src` 扫描确认这三处即全部缺失项。台账落点：增补 §5M、主报告 `008`、矩阵 `:137`/`:196`/`:316` |
| **HIG-AUD-017**（无路由变化即关闭浮层机制，P1，机制性）已于 2026-09-23 修复并运行确认 | **组件层**：`hamburger-menu.tsx:379-395` 导航列表项此前只调 `onNavigate` **不关面板**（与同文件搜索结果项 `:466-469` 及 prop 注释矛盾、且无测试覆盖）→ 统一「激活即关闭」，保留修饰键/中键（新标签页）语义，`onNavigate` 时机不变。**库层**：新增 `src/lib/navigation.ts` 的 `useDismissOnNavigate`（`hashchange` + `popstate`，不耦合路由库）并从包入口导出；库内浮层默认不自动关闭，由消费方接入。**文档消费方**：`docs-shell`（面板）+ `App.tsx`（命令面板）各接一行 → 覆盖前进/后退与程序化导航。回归：`hamburger-menu-groups` 增 2 用例、新增 `navigation-dismiss`（4 用例）、新增永久 e2e `tests/e2e/overlay-route-dismiss.spec.ts`（**2 passed**）。**变异测试**：停用消费方接入 → 「后退关闭」用例失败而「点击条目」仍过，证明两条路径各自独立生效。**未验证**：`context-menu`/`menu` 的 `href` 条目依赖 Radix Item 默认关闭（未实测），见 §9。台账落点：增补 §5N、主报告 `017`、矩阵 `:137` |
| 三份审核文档已同步标注 | 主报告、增补、矩阵均已改；原「修复前证据」段落**保留作对照**，仅加注「行号取自修复前版本」 |
| 临时复现脚本已删除 | `tests/e2e/` 现有 **9 个永久 spec**（`command-search` / `component-geometry` / `context-menu-quick-actions-touch` / `continuous-surface-review` / `docs-feedback-typography` / `docs-layout` / `menu-bar-content-height` / `quick-actions-destructive-confirm` / `touch-targets`），**无 audit 临时 spec**（含 009/011/012 会话探针，一并跑完即删）；`.scratch/` 整体由 `.gitignore:22` 忽略 |
| 已验证明令（最新轮次 = 2026-09-23 009/011/012 会话） | `pnpm run typecheck` → **exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings（存量）**；定向 `vitest run` → **23 files / 184 tests passed**；`typecheck:tests` 命中项均为存量（见批次 F）。**注意**：全量 `pnpm test` 自 2026-09-23 起的当前实测为 **exit 1**（基线构成见 §7，非单轮引入）；2026-09-21 的历史记录为 228 files / 1424 tests passed |

---

## 2. 剩余工作量总账

| 口径 | 总数 | 已完成 | **剩余** |
|---|---|---|---|
| **HIG-AUD 问题（主报告 ∪ 增补 并集）** | **54**（新增 054） | **21**（001–005、006/007、008、009/011/012、010、013、017、019、037、038、039、040、051、054；另 `049` 判非缺陷关闭；2026-09-23 批次已并入） | **32** |
| ├ P0 | 6（含 1 条判定撤回） | 5 | **0** |
| ├ P1 | 24 | 14（006/007、008、009/011/012、010、013、017、019、037、038、039、040，2026-09-22~23） | **10** |
| ├ P2 | 13（新增 054） | 1（054） | **12** |
| └ P3 | 11 | 1（050，随 039 成对修复） | **9** |
| **PLAN-HIG-COMPONENTS 交付项** | **90** | 67 完成 / 18 部分 / 5 缺失 | **23** |
| **债务台账（类型 9 + 动效 8 + 测试 1）** | **18**（可执行 13） | 4（动效账本迁移 0.3s/0.4s/300ms/500ms，2026-09-23） | **14** |
| **`HIG-VER-*` 验证项** | 见 §9（未逐条计数，不臆造） | 1 | 余量未闭环 |

计划完成度三口径（子代理统计，附证据链）：**产物存在性 ≈ 93%**、**加权 ≈ 84%**、**逐项严格判定 ≈ 74%**。三者必须与「验证缺口」一起读，否则会高估。

> **口径已对账（2026-09-23，按 ID 级重算）**：P0 6/5/0、P1 24/14/10、P2 13/1/12、P3 11/1/9；合计 已完成 21 + `049` 判非缺陷关闭 1 + 剩余 32 = 54，与总行自洽。历史注记：`005` 改记为 `052`（P2）、`049` 关闭，均已计入上述口径；`010`/`019` 于 2026-09-23 修复（增补 §5L）、`008` 同日修复（增补 §5M）、`017` 同日修复（增补 §5N，**待提交**）。

> **门禁新发现（2026-09-22 已闭环）**：`test:docs-layout` 首轮 `aggregate` 报出 3 条断言失败（详见 §7.1）→ 分诊结论：**1 条真实产品缺陷**（`/components/feedback` @320 横向溢出，记为 **HIG-AUD-054**，已修复并计入上表）+ **2 条断言缺陷**（`/colors` 前缀无关比较、`/grid` 容器断点预期，均已修）。

---

## 3. 剩余清单（按批次）

### 批次 A：开放 P0（3 条）— ✅ 已于 2026-09-21 全部关闭

| ID | 问题 | 结论（修复 + 证据） |
|---|---|---|
| HIG-AUD-002 | ContextMenu 无键盘打开路径 | ✅ 已修复 + 运行确认：`context-menu.tsx:27-61`；主报告 `hig-experience-audit-2026-09-18.md:212` |
| HIG-AUD-003 | BottomSheet 吞掉内部滚动 | ✅ 已修复 + 运行确认：`bottom-sheet.tsx:111-116`、`:201-208`；由 `1866616` 修复，主报告 `:230` |
| HIG-AUD-004 | EditMenu 键盘不可达 | ✅ 已修复 + 运行确认：`edit-menu.tsx:141-143/:377-409`；主报告 `:249` |

> HIG-AUD-005（原始色治理）P0 判定**已撤回**，实质残留改记为 HIG-AUD-052（P2）。矩阵 `:312` 已同步订正为「P0 判定已撤回」，**跨文档口径冲突已消除**。

### 批次 B：计划交付缺口（5 项，✅ 已全部闭环）

| 编号 | 缺口 | 依据 | 收口状态（2026-09-22 核对） |
|---|---|---|---|
| PLAN §六.6 / E11 / M4 | `patterns/app-shell` **组合演示未落**（`app-shell-demo.tsx` 未导入 MenuBar/Toolbar） | `PLAN-HIG-COMPONENTS.md:86`、`:283`、`:312` | ✅ 已闭环：`522e53f` 落地 MenuBar + Toolbar 组合演示并重生成语料 |
| PLAN §六 readme:截图 | `readme:screenshots`(+`:check`) **无执行证据**，与 HIG 新页无绑定 | `PLAN-HIG-COMPONENTS.md:92` | ✅ 已闭环：`99f2a3b` 重生成 PNG；`docs:readme:screenshots:check` 5 页 × 2 主题通过 |
| PLAN §十一.3 / G3 | Quick Actions **触屏长按仿真验证未做** | `PLAN-HIG-COMPONENTS.md:321` | ✅ 已闭环：新增永久回归 `tests/e2e/context-menu-quick-actions-touch.spec.ts`（CDP `Input.dispatchTouchEvent` 真实 touch），`2 passed (12.6s)`；断言长按 900ms 后遮罩可见且 `backdrop-filter: blur(8px)`、菜单计算宽 `224px`，短按 150ms（阈值 700ms 以下）不打开。**注意**：Radix `ContextMenuTrigger` 的触屏长按是自实现 `setTimeout(handleOpen, 700)`，**不派发原生 `contextmenu`** |
| PLAN §十一.4 / G4 | **backdrop-blur 材质 token 未新增**，仍是字面量 `bg-black/40 backdrop-blur-sm` | `PLAN-HIG-COMPONENTS.md:322`；`context-menu.tsx:154-156` | ✅ 已闭环：新增 `--uni-overlay-backdrop-blur: 8px`（`src/styles/index.css` 遮罩 token 组），`context-menu.tsx` 与 `destructive-action-modal.tsx` 改走 `backdrop-blur-(--uni-overlay-backdrop-blur)`；真实浏览器双主题实测计算值 `blur(8px)`、遮罩色仍 40% / 50% |
| PLAN M1–M4 门禁 | `pnpm test` exit 1（9 基线失败）、`test:docs-layout` exit 1、lint 无证据 | `…-addendum-phase2.md:225-227` | ✅ **汇总口径已闭环（2026-09-22 04:21，独占运行）**：`typecheck`、`build`、`lint`（0 error）、`pnpm test`（228 files / 1424 tests）均 exit 0；**`test:docs-layout` 可信汇总行已取得** → `2 failed / 1 flaky / 119 passed (42.8m)`，exit 1。failed = `command-search.spec.ts:49`（HIG-AUD-053，已知基线）+ `docs-layout.spec.ts:619` `static routes (light)`（环境卡死，见 §4）；flaky = `docs-layout.spec.ts:642` `aggregate layout audit gate`（首轮 3 条**真实**断言失败，重试被清空掩盖，见 §7.1） |

### 批次 C：P1（剩余 10 条；`038`、`006`/`007`、`013`、`037`、`039`、`040`、`009`/`011`/`012`、`010`、`019`、`008`、`017` 已修复，见 §1）

`014` Toast Tab 序列/计时 ｜ `015` Tooltip 强注 tabIndex ｜ `016` MultiSelect 热区/Tab 锁 ｜ `018` 受控能力缺口 ｜ `020` EditMenu 触屏缺陷 ｜ `021` EditMenu 定位/语义边界 ｜ `022` Grabber slider 无键盘 ｜ `023` 7 个导出组件未注册 ｜ `024` SidePanel 未导出/被门禁 ｜ `036` EditMenu 指针设备形态

> `009`/`011`/`012` 的受影响清单已扩充到 MenuBar / Toolbar / pull-down（**已于 2026-09-23 修复，见 §1**）；`013`/`018`/`025` 的扩充清单改动时注意连带面。
>
> `010`/`019` **已于 2026-09-23 修复并运行确认**（§1、增补 §5L）。两条目都带**口径教训**：`010` 的「5 种写法」实为两种官方遮罩角色（不可简单合并）；`019` 的「28 个文件包含 motion-reduce」实为虚假覆盖（specificity 压过，文件数达标 ≠ 生效）。改动其连带面（`--uni-overlay-*` 族、`motion-reduce:` 写法）前先读增补 §5L。

> **枚举已完成（2026-09-22 晚，subagent 交叉核对主报告 §4.2 + 矩阵 + 增补 + 本交付书；2026-09-23 更新）**：未修 P1 = 上面 10 条（014、015、016、018、020–024、036；`038`、`006`/`007`、`013`、`037`、`039`、`040`、`009`/`011`/`012`、`010`、`019`、`008`、`017` 已修）。口径提示：主报告 §1.2 按 P1 计 23 条（原口径），与本清单差 6，**以本清单并集为准**；`037` 在主报告的状态列未回填（增补已升级 [运行确认]），属时序差。推荐起手顺序（2026-09-23 三刷）：**`018`**（受控能力缺口——API 契约，含 Combobox `open`、BottomSheet detent、Toasts 受控 store、SplitButton `menuButtonDisabled`，属「新增 props + 契约测试」型任务）→ `014`/`015`/`016` 组件内独立小修（可并行）→ 其余按编号推进。**方法教训（三轮各得一条）**：① 凡「覆盖率/一致性」类结论必须落到运行时断言，不得只看文件级计数或字面量 grep（`019` 的虚假覆盖即由此产生）；② 缺 key / 缺声明类问题则相反——**静态扫描 + 编译期约束**才是正解（`008`），且新增守护必须做**变异测试**证明它真的会报警；③ 机制类条目（`017`）先拆「组件层契约」与「库层原语 + 消费方接入」两层分别验证，变异测试可定位每条路径的真实承担者。

### 批次 D：P2（12 条）

`025` 浮层 loading/empty 缺失 ｜ `026` 用 vh 而非 dvh ｜ `027` Select 缺移动贴底形态 ｜ `028` 滚动条宽度补偿缺失 ｜ `029` 移动断点零散/无 vv ｜ `030` 屏幕阅读器播报 3 处 ｜ `041` 5 个测试为**源码字符串契约**（非行为验收） ｜ `042` 目标横滚无边缘提示 ｜ `043` ActivityView 固定单档 ｜ `044` MenuBar 层级与溢出提示 ｜ `052` legacy 账本只增不减 ｜ `053` 命令面板搜索相关性回归（由 `test:docs-layout` 失败发现）

> `054`（`/components/feedback` @320 根级横向溢出）为 2026-09-22 门禁新发现，**已当场修复并复核**（§7.1、增补 §5C），不计入剩余。

### 批次 E：P3（剩余 9 条；`050` 已随 `039` 修复、`049` 判非缺陷关闭）

`031` 破坏色非语义 token ｜ `032` DotsMenu/Menu 表面不一致 ｜ `033` Combobox 字面量阴影 ｜ `034` EditMenu 无退场闪现 ｜ `035` 模糊用途边界未文档化 ｜ `045` SafeArea style 可覆盖 ｜ `046` SafeArea/Stack 双档表 ｜ `047` MenuBar 快捷键无效承诺 ｜ `048` pull-down 允许上方展开 ｜ `049` 图标瓦片 48px vs 70px（**已判为非缺陷**，✅ 已于 2026-09-22 关闭：设计决策注释已落 `activity-view.tsx` 瓦片处，增补 §3.3 已回填） ｜ ~~`050` Fragment 包裹收集失败~~（**✅ 已随 `039` 修复，2026-09-23，增补 §5H**）

### 批次 F：债务台账（18 条，可执行 13 条）

- **类型债务**（`docs/audits/tests-typecheck-debt.md`）：`tests/` 存量约 150 条类型错误；收紧批次 1（清零 TS7017）/ 批次 2（按文件清零 audit 系列）/ 批次 3（开 strict 并接入 `ci.yml`）**均未执行**（`:23-25`）。
- **动效债务**（`docs/audits/motion-duration-audit-2026-09-20.md`）：**2026-09-23 更新**——账本 12→7（~~8 条待迁移~~ → **4 条待迁移**：`0.15s`/`0.2s`/`150ms`/`250ms`；另有 3 条刻意保留：`0s`/`0.01ms`/`2s`）；~~浮层同族漂移~~ **已收敛**（bottom-sheet/responsive-drawer 300ms→overlay 档、drawer 500ms→expansive 同值、modal 系对齐）；~~退场动画不对称~~ **已修**（并案 HIG-AUD-011 ✅）；~~`tests/bottom-sheet.test.tsx:114` 硬断言~~ **已随迁移更新**；**仍待**：组件级免动画清单与 reduced-motion 全覆盖（并案 HIG-AUD-019，未修）。

### 批次 G：**用户已明确暂缓**（不要擅自启动）

| 事项 | 状态 |
|---|---|
| LLM 语料重新生成（`docs:llm:generate` + `check`） | **暂缓**。当前 `docs:llm:check` exit 1，3 处漂移：`pages/en-US/components/context-menu.md`、`pages/zh-CN/components/context-menu.md`、`index.json`；根因是 `guides-01.ts`/`guides-04.ts` 新增 `ctxmenu-quick-actions` 条目 |
| 真机 / AT / 非 Chromium 验证 | 环境不具备，文档已标注「未验证·环境不支持」 |

---

## 4. 环境阻塞与已知干扰（先读，否则会浪费大量时间）

| 干扰 | 现象 | 应对 |
|---|---|---|
| **IDE safe-delete shim** | 单次删除 > **500** 文件被拦：`Safe delete needs confirmation for this bulk deletion (629 item(s), threshold 500)`。`docs:llm:generate` 会先 `rmSync(docs/llm/pages)`，因此**必然失败** | 需**人工在 IDE 中确认/手动删除**后才可重跑；**不要**重试，也不要改写成删除父目录/逐个删除/换脚本——shim 明确禁止规避 |
| 同类历史案例 | 删 `.scratch/playwright-results` 时同样被拦（主报告 `:866`、增补 `:228`、矩阵 `:375` 均记为「环境干扰非产品缺陷」） | 先清 `.scratch` 子目录再跑 Playwright |
| **Vitest 被判定为 watch 命令** | `pnpm exec vitest run …` 直接执行时 harness 判定 `isWatchCommand: true`，输出为空/超时 | 重定向到日志再读：`… > .scratch\vitest-audit.log 2>&1; Get-Content .scratch\vitest-audit.log -Tail 45` |
| **`npx` 被 devEngines 拒绝（2026-09-23 实测）** | `npx playwright …` 直接报 `npm error EBADDEVENGINES … Invalid name "pnpm" does not match "npm"`，命令不执行 | 一律用 **`pnpm exec`**：`pnpm exec playwright test -c playwright.config.ts <spec>`、`pnpm exec vitest run …` |
| **watch 误判后进程残留并锁住重定向日志（2026-09-23 实测）** | vitest/playwright 被 harness 判为 watch 后进程仍在后台运行，持有 `> log 2>&1` 的文件句柄；紧接的重试报 `The process cannot access the file because it is being used by another process` | 换新日志名，或先用 `findstr` 查旧日志是否已出现汇总行（后台进程自然结束后可读）；勿对同一日志名立即重跑 |
| **共享的外置 dev server 会中途掉线（2026-09-22 实测）** | `PW_REUSE_SERVER=1` 复用外部 dev server 跑到 `component routes chunk 4/11` 时该 server 消失，其后 71 个用例全部 `page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:5211/…`，最后 `51 passed (19.3m)`——**这不是有效结论**，只是级联假失败 | 门禁运行**不要**依赖外置 server，用 Playwright 默认的独占启动；`PW_REUSE_SERVER=1` 只用于本地人工视觉核查 |
| **同一 5211 被多份 Playwright 运行共享（2026-09-22 实测）** | 环境里另有一份 `playwright test -c playwright.config.ts`（`cli.js test -c playwright.config.ts`，02:47:50 起）持有 dev server 并在跑；两份 `full registry matrix` 同时打同一 server 后，`docs-layout.spec.ts:619` 的 `static routes (light)` 直接撞满用例上限：`x 49 … (15.2m)`，门禁无法产出可信汇总 | 跑前确认独占：`Get-NetTCPConnection -LocalPort 5211 -State Listen` 取 `OwningProcess`，再 `Get-CimInstance Win32_Process -Filter "ProcessId=<pid>"` 看命令是否 `vite … dev docs/geist --port 5211`；同时清点 `cli.js test -c playwright.config.ts` 进程数。确认是遗留/多余的运行后**需人工确认**再 `taskkill /T /F /PID <pid>`（本会话的 `taskkill` 请求因审批弹窗不可见而超时，未能执行） |
| **同一 page 连续整页导航约 18–19 条后渲染进程失去响应（2026-09-22 已修复）** | 旧 `static routes` 在**同一个 page** 上连续整页导航逐条路由：第 19 条（`/charts`，`?docs-layout-navigation=19`）起 `page.goto` 永不返回 → 用例撞满 15 分钟上限（**两次独立复现：04:21 门禁、13:11 单独运行**）。诊断证据：JSONL 停在 **108 组合 = 18 条路由 × 6 视口**不再增长且 `page.evaluate` 不返回；卡住时该 page 有 ≈35 个模块请求 pending >30s，而同一时刻 `Invoke-WebRequest` 请求相同 URL 全部 `HTTP 200`（0.01–0.19s）、server CPU 0 → 卡点在**浏览器/渲染进程侧**，不是 docs 应用或 dev server 的 bug。旁证：`static routes (dark)` 单跑通过（1.3m），全部 component chunk（fresh page 形态）长期稳定绿 | ✅ **已修复（2026-09-22）**：静态路由改为与 component routes 相同的**分块**（`chunk(STATIC_ROUTES, 8)` → 3 个用例，各自全新 page/context，单页导航 ≤8 条），并把无限等待改为**有界**（`loadDocsRoute`：`goto` 60s → 复位 `about:blank` 15s → 重试一次；`settle` 的 `document.fonts.ready` 加 15s 上限）。**实测 `static routes chunk 1–3` 双主题 `6 passed (3.1m)`**（light 34.5s / 36.6s / 16.5s，dark 33.3s / 34.1s / 19.3s）——light 侧此前**从未跑通过**。断言与采集逻辑未改，只改等待与编排方式 |
| Playwright / 子进程超时 | `tests/llm-task-runner.test.ts`（超时）、`tests/showcode-typecheck.test.ts`（safe-delete ETIMEDOUT）为已知 flaky | 单独重跑确认，不要当成回归 |
| **仓库被并发会话写入** | 矩阵 `:6` 记录审核期间仓库被并发写入（`b68d3f0 → … → 5d173ca`） | 每次开工先 `git status` 重新确认基线，不要沿用本交付书的状态 |

---

## 5. 工作区状态：**不得误提交**的东西

- **当前实测（2026-09-23）**：0 未提交改动（审核线 009/011/012 已入库 `8d528b8` fix + `0ed630a` docs）；未跟踪仅 `.tmp-logo/`。历史注（2026-09-22）：未提交改动数随并行会话波动（9 处 modified + 2 处未跟踪）→ **禁止** `git add -A` / `git add .`；只 stage 显式文件。
- **未跟踪的 scratch（禁止提交）**：`.tmp-logo/`（临时 logo 生成脚本 `*.mjs`、字体 `*.ttf`、`*.png`、`textpath.json` 等）。
- **并行会话（logo 线）未完成工作（不要动、不要提交）**：`brand/unitary-app-icon.svg`、`brand/unitary-mark.svg`、`brand/unitary-logo-horizontal.svg`、`docs/geist/src/components/unitary-logo.tsx`、`docs/geist/src/examples/badge/compact-rounded-7c41e2a8.example.tsx`。
- **遗留临时 spec（2026-09-22 发现）**：`tests/e2e/tmp-triage-probe.spec.ts`（并行线遗留，非审核线产物）——按「跑完即删」纪律应在 logo 线收尾时删除，**勿提交**；审核线自己的探针（`tmp-sec71-*.spec.ts` 等）均已删净。
- **2026-09-23（009/011/012 会话）**：实现与测试由 `8d528b8` 提交（fix：`src/components/ui` 13 个组件文件 + `src/styles/index.css`，`tests` 13 个文件 = 治理 3 + 组件 9 + allowlist 1）；5 份 audits 台账由 `0ed630a` 提交（docs），工作区回归干净；探针与日志已删净。
- 除用户明确要求外，**不得 commit、不得 push**（AGENTS.md 硬约束）。
- 所有临时脚本（Playwright 复现、测量脚本、日志）**跑完即删**；`.scratch/` 产物不得进版本库。

---

## 6. 建议执行顺序

1. **只读取证**（不写任何文件）：跑真实 `pnpm test` 与 `pnpm run test:docs-layout`，按 §7 的**当前基线构成**对照确认无新增回归——`pnpm test` = 7 个 `tests/audit/*` 环境类稳定失败 + 并发 flaky（单跑可过）；`test:docs-layout` = 唯一稳定红点 HIG-AUD-053。判定回归必须先做基线对照（`git stash` 或单跑可疑文件）。
2. ~~**批次 A（3 个开放 P0）**~~ → ✅ **已于 2026-09-21 完成闭环**（每条均走：复现 → 修复 → 加/改回归测试 → 双主题视觉核查 → 三份台账同步；含行号与「修复后证据」）。
3. **批次 B（计划缺口）**：~~优先 E11 `app-shell` 组合演示与 G4 材质 token（两者影响文档链与语料）~~ → ✅ E11（`522e53f`）、G4（`--uni-overlay-backdrop-blur`）、G3（`tests/e2e/context-menu-quick-actions-touch.spec.ts`）均已闭环；~~剩余 M1–M4 的 `test:docs-layout` 汇总口径~~ → ✅ 汇总口径已闭环（§7，`2 failed / 1 flaky / 119 passed (42.8m)`）；~~接续项 = §7.1 的三条断言分诊~~ → ✅ 已分诊闭环（§7.1：1 真实缺陷修复为 HIG-AUD-054 + 2 断言缺陷修正，增补台账 §5C）。
4. **批次 C → D → E**：按严重度推进；~~`049` 可直接判定关闭~~ → ✅ **已关闭（2026-09-22）**：设计决策注释已落 `activity-view.tsx` 瓦片处，台账已回填；批次 C 剩余 P1 = **14 条**（008、010、014–024、036；2026-09-23 增量：009/011/012 已修复；枚举与推荐顺序见批次 C 节注）。
5. **批次 F（债务）**：建议在 P0/P1 收敛后再做，且批次 1→2→3 顺序不可颠倒。
6. **批次 G**：等用户解除暂缓并完成 safe-delete 人工确认。

每批收尾都必须重跑：`pnpm run typecheck` + 定向 `vitest` + 受影响路由的双主题浏览器核查。

---

## 7. 验收门禁（命令 + 期望）

| 命令 | 期望 | 备注 |
|---|---|---|
| `pnpm run typecheck` | exit 0 | 本轮已验证为 0 |
| `pnpm exec vitest run <定向文件>` | exit 0 | 需重定向到日志文件读取（§4） |
| `pnpm run test` | ~~**exit 0（2026-09-21 实测）**~~ → **exit 1（2026-09-23 复跑：8–12 failed / 218–221 passed / 229–230 files，随并发 flaky 计数浮动）** | 2026-09-21 的 **228 files / 1424 tests passed**；此前的「9 个基线失败 / 3 文件」（`docs-foundations`、`foundation-contract`、`keyboard-input-api`）在该轮未复现。**基线构成（2026-09-23 两次全量 + `git stash` 对照定性）**：① **7 个稳定基线失败** = `tests/audit/{comparator-context,comparator-exemptions,comparator-icon,comparator-provenance,comparator-v3,ledger-comparator,ledger-consumers}`（stash 后同样失败；根因 = 用例 `execFileSync("python", …)` 的**环境类**失败）；② **并发 flaky（单跑均通过）** = `tests/showcode-typecheck.test.ts`（tsc 子进程）、`tests/button-api.test.ts`（扫描型用例）、`tests/audit/evidence-v2.test.ts`（git/hash 遍历型用例）、`tests/llm-task-runner.test.ts`、`tests/pre-push-orchestrator.test.ts`（后两者见 §4）。**判定回归必须做基线对照（stash 或单跑可疑文件）**，勿直接把失败数记为当轮引入 |
| `pnpm run test:docs-layout` | 基线（2026-09-22 04:21，独占运行）：`2 failed / 1 flaky / 119 passed (42.8m)`，exit 1（failed = HIG-AUD-053 + `static routes (light)` 卡死）。**harness 修复后（2026-09-22 14:05）**：静态路由双主题 `7 passed (2.8m)`（含 `aggregate layout audit gate` 空失败集）、`component routes chunk 1/11` 双主题 `3 passed (1.0m)` → **矩阵内已无已知红点，唯一稳定红点仍是 `command-search.spec.ts:49`（HIG-AUD-053）**；`aggregate` 的「重试清空失败集」机制未修（分块+加固后未再复现首败） | 布局改动必须跑，且**必须独占**：`PW_REUSE_SERVER=0`（由 Playwright 自己拉起 dev server）+ 跑前确认没有另一份 `playwright test -c playwright.config.ts` 持有 5211（探测命令见 §4）。**用例名已变**：静态路由现为 `static routes chunk k/3 (${theme})`（`docs-layout.spec.ts:683`），临时重跑用 `-g 'static routes chunk'`（原 `-g 'static routes \(dark\)'` 已不再匹配）；`aggregate` 在 `:707`。**注意**：命令行传含 `|` 的 grep 会被中间层截断，需要多条件时把 `grep` 写进临时配置文件 |
| `pnpm run docs:llm:check` | **当前 exit 1**（3 处漂移） | **已暂缓**；解除后需先人工清 `docs/llm/pages` 再 `docs:llm:generate` |
| `pnpm run build` | exit 0 | 计划文档记录为绿 |
| `pnpm run lint` | **exit 0（2026-09-21 实测）** | oxlint：**0 errors / 16 warnings**（872 files / 96 rules）；16 条 warning 为既有存量，非本轮引入 |
| `pnpm exec playwright test tests/e2e/context-menu-quick-actions-touch.spec.ts` | **exit 0（2026-09-22 实测）** | **2 passed (12.6s)**；触屏长按回归（G3）。spec 自带 `test.use({ hasTouch: true, isMobile: true })`，用 CDP `Input.dispatchTouchEvent` 派发真实 touch；如需复用已起的 dev server 可设 `PW_REUSE_SERVER=1` |

### 7.1 2026-09-22 门禁首轮真实断言失败（3 条，已分诊闭环）

`aggregate layout audit gate`（`tests/e2e/docs-layout.spec.ts:642`，断言进程内 `ALL_FAILURES` 为空）在**第一次执行**时输出的非空内容原文如下（断言实现行号 = `docs-layout.spec.ts`）：

| # | 断言 | 路由 / 视口 / 主题 | 失败原文（首条） | 初判 |
|---|---|---|---|---|
| 1 | `no-root-horizontal-overflow` | `/components/feedback` @320x700，**light + dark 各 1 行** | `documentElement.scrollWidth 330 > clientWidth 320 + 1` | 疑似**真实缺陷**：320 宽下根节点横向溢出 10px。断言为纯测量（`:384-392`），无归一化问题 |
| 2 | `colors-computed-value-contract` | `/colors` @1440x900、1100x800、1024x768、768x1024、390x844、320x700，**仅 dark**（6 视口 × 3 token = 18 行） | `swatch --color-background-100 显示值 "0a0a0a" ≠ computed "#0a0a0a"`（另 `--color-amber-500 "70400b"`、`--color-pink-1000 "fdf1f7"`） | **断言侧嫌疑**：卡片内显示值**故意去掉 `#`**（`docs/geist/src/components/docs-pages.tsx:276-279`，完整值在 `title`），断言做字符串全等（`:488-497`）。**为何仅 dark、仅这 3 个 token 未定**，需定点复核 |
| 3 | `grid-responsive-columns` | `/grid` @1440x900、1100x800、1024x768，**仅 dark** | `responsive-breakpoints 列数 2 ≠ 预期 3` | 存疑：断言为真实列数比较（`:517-526`，≥1024 预期 3）。仅 dark 且仅 ≥1024，需复核是否主题切换后容器/媒体查询未重算 |

**分诊结论与修复（2026-09-22，含独立复核）**：三条已全部定性并修复。复核方式 = 临时探针 spec（跑完即删）在**独占 dev server** 下逐条路由 × 双主题 × 6 视口重新测量（36 组合，`6 passed (1.6m)`，证据 `.scratch/triage-probe.jsonl`）：

| # | 定性 | 修复落点 | 独立实测（本轮探针，非沿用他人结论） |
|---|---|---|---|
| 1 | **真实产品缺陷** → 新记 **HIG-AUD-054**（P2，见增补 §5C） | `src/components/ui/feedback.tsx`：占位层 `[data-feedback-inline]` 补 `shrink-0`（占位层是 flex item，被 demo 卡内容区压到 230px；内层**绝对定位**胶囊不参与 shrink 仍为 285px，且 demo 卡 `overflow-visible` 不裁切 → 胶囊右缘突破视口；解除压缩后 `justify-center` 容器令占位层两侧对称溢出，LTR 左侧溢出不产生滚动宽度） | 12/12 组合 `scrollWidth - clientWidth = 0`；@320 胶囊 18..303px（宽 285，左右留白 18/17 对称），双主题一致 |
| 2 | **断言缺陷**（非产品缺陷） | `tests/e2e/docs-layout.spec.ts` 第 9a 组：改**前缀无关**比较（卡内紧凑显示按约定省略 `#`，完整值在 `title` 与剪贴板，clipboard 契约测试本就前缀无关） | `/colors` 页面 92 个 swatch：**严格全等 92/92 全部「不一致」**（差异全部只是 `#` 前缀），**前缀无关不一致 0/12 组合**（realDrift=0，与增补 §5C 记录一致）→ 「仅 dark」是**观测假象**（light 侧证据随 `static routes (light)` 卡死丢失，见 §4） |
| 3 | **断言缺陷**（非产品缺陷） | 同文件第 11 组：改**容器感知**预期——`responsive-breakpoints` demo 用 `unstable_useContainer`，断点按**容器**宽度解析；采集容器宽度 + Grid 内联断点变量 `--{xs,sm,smd,md,lg}-grid-columns`，按与 `grid.module.css` 一致的阈值（xs≤400 / sm 401–600 / smd 601–768 / md 769–960 / lg≥961）与 fallback 链推导预期 | `/grid` 12/12 组合 `列数 == 预期`：@1440 容器 863px → md 层 → 2 列；@1100 容器 743px、@1024 容器 667px → smd 链 → 2 列；@390/@320 容器 350/280px → xs 层 → 1 列 |

**门禁自身缺陷（重要）**：`aggregate layout audit gate` 断言的是**worker 进程内数组**（`ALL_FAILURES`，`:543`），而 Playwright 的重试会**重启 worker → 数组清空**，于是「首次 fail + 重试 pass」被记为 `1 flaky`。**重试会静默掩盖真实布局断言失败**：判定矩阵是否全绿必须看**首次执行**的 aggregate 结果，不能只看最终 `119 passed / 1 flaky` 汇总。

**门禁侧改动（2026-09-22 本轮）**：

- `loadDocsRoute` / `settle` 改为**有界等待 + 一次重试**（整页导航 `goto` 60s → 复位 `about:blank` 15s → 重试；navbar 可见 90s；`document.fonts.ready` 15s 上限），把「静默撞满 15 分钟用例上限」变成「带路由名的有界失败」。
- 静态路由**分块**（`chunk(STATIC_ROUTES, 8)` → 每主题 3 个用例，各自全新 page/context），与 component routes 同形态（详见 §4）。
- **仍未修**：`aggregate` 的失败清单只存在 worker 内存里，重试重启 worker 即清空 → 建议把失败清单持久化到 JSONL 证据文件后再断言。

> 说明：本节原另有一份分诊表，已与上表合并（同一结论不留两处口径）；两条来源的原始记录见增补台账 §5C。

**权威复核（真实门禁，2026-09-22 14:05；独立于增补 §5C 记录的 6 passed 运行）**：静态路由分块后，用临时配置（5212 端口 + 把 `grep` 写进配置，因命令行传含 `|` 的模式会被中间层截断）跑 `static routes chunk` + `aggregate layout audit gate` → **7 passed (2.8m)**，其中 **`aggregate` 失败集为空**（「`ALL_FAILURES` 为空」断言成立）→ 20 条静态路由 × 6 视口 × 双主题的**全部断言**首次运行全绿，`static routes (light)` **首次跑完**。另跑 `component routes chunk 1/11` + `aggregate` 双主题 → **3 passed (1.0m)**，证明本次导航/字体「有界等待」加固未引入回归。附：`pnpm run typecheck` exit 0；`pnpm exec vitest run tests/feedback-rating-bar.test.tsx tests/docs-feedback.test.tsx` → **2 files / 29 tests passed**（两项均本轮独立复跑，非沿用他人结论）。

**复跑记录（2026-09-22，修复后定向门禁）**：`tsc -b` 通过；定向 vitest（`feedback-rating-bar` + `docs-feedback`）2 文件 / 29 测试通过；`docs-feedback-typography.spec.ts` 13 通过（1.3m）；`docs-layout --grep "component routes chunk 7"`（含 /components/feedback，双主题 @320）2 通过（1.4m）；`docs-layout --grep "static routes \(dark\)"`（含 /colors、/grid 断言修正）1 通过（1.3m）。全绿。

**遗留（未修）**：上文「门禁自身缺陷」（重试清空 `ALL_FAILURES` 的掩蔽）仍在——三处断言源头修复后，该掩蔽当前已无被掩盖对象，但机制性风险未消除，建议后续把失败清单持久化到文件。

**下一接续项（2026-09-23 更新）**：**批次 C P1 修复**——`038`、`006`/`007`、`013`、`037`、`039`、`040`、`009`/`011`/`012` 已修（§1），剩余 **14 条**，推荐起手 `010`/`019`（浮层背板 token 与 reduced-motion 全覆盖，与 009/012 同族收尾）→ `008`（i18n，独立）；每条走「实现 + 回归测试 + 双主题视觉核查 + 门禁 + 三台账同步」全流程，每会话 1–2 条并先派 subagent 取证。`049` 已关闭、`050` 已随 `039` 修复（批次 E）。**本轮独立复核补充（2026-09-22 深夜）**：`menu-bar-content-height.spec.ts` 独占复跑 **2/2 passed**（SubContent 运行时 `--radix-popper-available-height=700px` 实测成立）；`side-panel-api` + `menu-bar-api` 组合 vitest **17/17 passed**（一次 `body.style.overflow` 断言时序 flaky 后重跑全绿，与 §1 的 jsdom 假阳性经验同源）；`tsc -b` exit 0。**环境实况注意**：(a) `vp dev`（docs/geist）对 root 外 `/@fs/` 模块可能 serve 过期快照（本轮实测 serve 出 21KB 旧版 `side-panel`，磁盘为 8KB 当前版），`/@fs/` 动态 import 探针结论仅在其运行时刻有效，复用前须重验；(b) 上轮运行残留的 Playwright 进程树 + dev server 会占住 5211（且 `taskkill` 审批弹窗可能超时不可见），跑门前先查端口。

### 7.2 2026-09-23 会话门禁记录（HIG-AUD-009/011/012 三件套）

- `pnpm run typecheck` → **exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings（存量）**；`typecheck:tests` 命中项均为存量（`TS7017`（`globalThis.IS_REACT_ACT_ENVIRONMENT`）等，无新增；收紧见批次 F 类型债务）。
- 定向 vitest（23 文件：`layer-tokens` / `duration-tokens` / `ease-tokens` / `motion-duration-governance` + 13 个受影响组件契约 + 其余治理）→ **23 files / 184 tests passed**。
- 双主题视觉核查（临时 Playwright 探针，跑完即删；webServer 独占启动，单轮约 30–60s）：computed 实测 menu `z 50 / 0.15s`、destructive-action-modal 卡片与遮罩 `z 300 / 0.35s / ease-pop`、multi-select / context-menu / hover-card / feedback `z 2001`、command-menu 遮罩与面板 `z 300 / 0.35s`；退场经 `animationstart` 实测播放且 `--tw-exit-scale` 生效。
- **经验（写进探针范式）**：tw-animate 退场统一 `animation-name: exit`，zoom 镜像经 `--tw-exit-*` 变量表达——断言退场**应捕获 `animationstart` 事件并读变量**，不要找 `zoom-out` 动画名（会把通过案例误判为失败）；右键菜单的渲染目标为 `[aria-label="Context menu target"]`（演示页触发器）。

### 7.3 2026-09-23 会话门禁记录（HIG-AUD-010/019）

- `pnpm run typecheck`（`tsc -b`）→ **exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings（存量）**。
- 定向 vitest（18 文件）→ **18 files / 112 tests passed**：新增 `tests/overlay-backdrop-tokens.test.ts`(6) + `tests/reduced-motion-coverage.test.ts`(5)；其余为受影响组件契约与治理（`modal-api`/`sheet-api`/`side-panel-api`/`drawer-api`/`bottom-sheet`/`responsive-drawer`/`expand-panel`/`quick-actions-api`/`destructive-action-modal-state`/`command-menu-api`/`menu-surface`/`menu-bar-api`/`relative-time-card`/`visual-fixes-regression`/`skeleton-motion`/`raw-color-governance`）。
- 永久 e2e：`pnpm exec playwright test -c playwright.config.ts tests/e2e/reduced-motion.spec.ts` → **8 passed (47.6s)**（双主题 × modal / quick-actions / bottom-sheet / command-menu；reduce 下 `animation-name: none` 且功能正常）。该 spec 自带 `page.emulateMedia()`，**不依赖 `test.use`**（原因见下）。
- 临时视觉探针（跑完即删）→ **12 passed (1.0m)**：① 旧写法展开与 token 的**渲染像素逐字节等价**；② CSSOM 规则采集（`.motion-reduce\:animate-none\!` 位于 reduce 块内、值为 `animation: … none !important`）；③ reduce 层叠最小复现（plain → `enter`，important → `none`）；④ 真实 DOM 族内一致（`rgba(0, 0, 0, 0.4)`，quick-actions 仍 `blur(8px)`）；⑤ modal 几何与内容透明度（遮罩满覆盖、卡片精确居中、内容未被降透明）。
- 审计验收 grep（`bg-black/4|bg-black/5|bg-[#f2f2f2]` in `src/components/ui`）→ **为空**。
- 全量 `pnpm run test` → **exit 1，`Test Files 8 failed | 226 passed (234)` ＝ 文档基线**（7 个 `tests/audit/*` 环境类 + 并发 flaky）。**首轮曾抓出本会话引入的 2 处回归并已修复**（记录在案以示范纪律）：① `tests/token-namespace.test.ts`——我在 `index.css` 两处族注释里写了**退役的 `--ds-*` 前缀**（该测试全量扫描 `src/` 与 `docs/geist/src`，且**不过滤注释**）；② `tests/modal-typography-geometry.test.ts:68`——仍锁 `bg-[#f2f2f2]/80 dark:bg-black/80` 旧字面量。修复后单跑两者 **2 passed**；`tests/button-api.test.ts` 单跑 **1 passed**（确认属文档记录的并发 flaky，非回归）。**教训**：改 token 注释时不得复述外部命名空间前缀；改遮罩写法前先 grep 全仓（含 `tests/` 与 `docs/`）的旧字面量。
- **本轮新增环境事实（务必遵守）**：
  1. `test.use({ reducedMotion: "reduce" })` 在本项目配置下**不生效**（探针读 `matchMedia("(prefers-reduced-motion: reduce)").matches === false`）→ 必须用显式 `page.emulateMedia({ reducedMotion: "reduce" })`。否则动画类断言会在「无模拟」下**假失败**，并可能误导根因判断（本轮已实际踩到一次）。
  2. 探针的跨 worker 证据必须**每条即时落盘**：Playwright 重试会换 worker，模块级对象 + `afterAll` 整文件写入会互相覆盖，只剩最后一个 worker 的数据。
  3. 半透明色块的像素比对必须叠在**同一不透明底色**上（否则页底内容不同会造成假失败）；色值 alpha 解析要兼容 `oklab(a b c / 0.8)`、`rgba(a, b, c, 0.4)`、`rgb(0 0 0 / 40%)` 三种序列化。

### 7.4 2026-09-23 会话门禁记录（HIG-AUD-008）

- `pnpm run typecheck`（`tsc -b`）→ **exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings（存量，与上轮一致）**。
- 定向 vitest（13 文件）→ **13 files / 80 tests passed**：`component-i18n-source`（含新增 3 用例：键集双向相等 / 钉住 3 key / 全 `src` `t("…")` 扫描）/ `framework-i18n`（含新增 grabber 双语言断言）/ `i18n-remaining` / `i18n-controls` / `feedback-i18n` / `grabber` / `hamburger-menu` / `hamburger-menu-groups` / `hamburger-menu-modes` / `hamburger-trigger-layout` / `hamburger-icon` / `docs-i18n` / `docs-i18n-parity`。
- 全量 `pnpm run test` → exit 1，`Test Files 8 failed | 226 passed (234)` ＝ 文档基线（7 个 `tests/audit/*` 环境类 + `button-api` 并发 flaky），**无新增回归**。
- **变异测试（守护有效性证据）**：临时删除 zh-CN 的 `"Close menu"` → ① `tsc -b`：`src/lib/i18n.tsx(36,11): error TS2322 … is not assignable to type 'Record<…>'`；② 键集同构用例：`zh-CN 缺失的 key: expected [ 'Close menu' ] to deeply equal []`；③ 调用点扫描：`src/components/ui/hamburger-menu.tsx: "Close menu" 不在 zh-CN`（2 处调用点）。**恢复后复跑 13 files passed，工作区无残留**。
- 临时浏览器探针（跑完即删，4 passed (26.8s)）：见增补 §5M。
- **本轮新增方法论**：新增「守护类测试」必须做**变异测试**（故意破坏一次并确认报警），否则无法区分「守护有效」与「守护恒真」——与 §7.3 的「文件级计数 ≠ 生效」是同一类风险的两面。

### 7.5 2026-09-23 会话门禁记录（HIG-AUD-017）

- `pnpm run typecheck`（`tsc -b`）→ **exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings（存量）**。
- 定向 vitest（5 文件）→ **5 files / 55 tests passed**：新增 `navigation-dismiss`(4) 与 `hamburger-menu-groups`(+2 用例)；另 `hamburger-menu`、`hamburger-menu-modes`、`docs-shell-geometry` 一并复跑通过。
- 永久 e2e：`pnpm exec playwright test -c playwright.config.ts tests/e2e/overlay-route-dismiss.spec.ts` → **2 passed (30.9s)**（① 点击条目关闭 + 路由切换；② 浏览器后退关闭）。
- **变异测试（守护有效性）**：停用 `docs-shell.tsx` 的 `useDismissOnNavigate` 接入 → 「浏览器后退关闭」用例 **失败**（`not.toBeVisible()` 超时、面板仍可见），而「点击条目关闭」仍通过 → 证明两条路径**各自独立生效**（组件层契约 vs 库层原语 + 消费方接入）；恢复后复跑 2 passed。
- 全量 `pnpm test` → exit 1，`Test Files 9 failed | 226 passed (235)`：7 个 `tests/audit/*`（python 环境类）为文档基线；`tests/button-api.test.ts`、`tests/showcode-typecheck.test.ts`、**`tests/llm-task-runner.test.ts`** 为并发 flaky——三者**单跑均通过**（`llm-task-runner` 本轮单跑 **1 file / 9 tests passed**，16.3s；全量中它跑满 51.5s 才失败，属资源竞争型抖动）。**结论：无新增回归。**
- **基线清单更新**：把 `tests/llm-task-runner.test.ts`（spawn 重型、9 用例）并入「并发 flaky，须单跑复验」名单，与 `button-api` / `showcode-typecheck` 同类。

---

## 8. 强制纪律（仓库规则 + 用户长期记忆）

1. **视觉核查强制**：任何 UI/样式改动完成后，必须用临时 Playwright 脚本（跑完即删）打开对应文档站页面截图或测量元素几何（间距/居中/对齐），确认视觉符合预期后才能提交；**不能只靠类型检查与单元测试**。
2. **双语 parity**：新增用户可见文档必须中英同步；`docs-i18n-parity` 测试会把关。
3. **不得臆造**：props、默认值、事件、可访问性行为、demo 标识符一律不得编造；以 `src/components/ui` 实现为准。
4. **文档链同步**：改组件时同步 `docs/geist/src/data`（注册/API 表）、双语 `component-guides`、示例 registry，以及生成语料。
5. **证据格式**：报告给证据必须落到 `文件:行号`；修复后保留「修复前证据」作对照，不要删除原结论。
6. **临时脚本清理**：`tests/e2e/` 下不得留下 audit 专用临时 spec（**长期回归测试除外**，如 `context-menu-quick-actions-touch.spec.ts`）；`.scratch/` 不得进入提交。

---

## 9. 本交付书的**不确证项**（下一个 Agent 必须自行核实）

1. **`HIG-VER-*` 的完整条目数与逐条状态未逐条计数**（以矩阵 §E 为准）。已知碎片：`HIG-VER-11`（像素级对比度测量）未做；MenuBar 键盘模型、pull-down 定位与展开动画仍未验证；`[静态确证，待运行确认]`（主报告 `:226`）、`[静态推断，待真机验证]`（`:489`）；真机 / AT / 非 Chromium 全部未验证（矩阵 `:47`）。
2. ~~**9 个基线失败的具体用例名**来自文档记录，本轮未重跑全量 `pnpm test` 复核。~~ **已于 2026-09-21 复核**：全量 `pnpm test` 实测 **228 files / 1424 tests passed，exit 0**，原 9 项基线失败**未复现**。
3. ~~**`pnpm test` 的 221 文件 / 1343 用例**为旧文档计数，静态枚举得 225 个用例文件……~~ **已订正（2026-09-21 实测）**：`pnpm test` = **228 files / 1424 tests passed（exit 0）**；旧计数（221 / 1343）作废。
4. ~~**`motion-duration-audit-2026-09-20.md` 有两处描述已过期**：账本实为 11 条（文档写 12 条）……~~ **已订正（2026-09-23）**：账本随迁移更新为 **7 条**（该文档 §4 计数与迁移状态列同步、§8/§9 遗留项已标注闭环，增补 §5K）；`duration-(--uni-motion-*)` 消费者清单无需再标注（现已多处消费）。
5. ~~**lint 门禁状态**无任何执行证据。~~ **已取证（2026-09-21）**：`pnpm run lint`（oxlint）→ **0 errors / 16 warnings，exit 0**。
6. **各文档间的口径冲突**（改文档时必须先裁决）：
   - ~~HIG-AUD-005 严重度：矩阵 `:312` 仍为 P0，主报告 `:278`/`:631` 已撤回为 P2 等价；~~ **已订正（2026-09-21）**：矩阵 `:312` 已同步改为「P0 判定已撤回」；
   - 主报告 §4.5 `:663-670` 的「结论」列仍写「审核未覆盖」，同段 `:663-664` 声明以补充报告为准 → 表内文字已过时；
   - `PLAN-HIG-COMPONENTS.md:3` 状态仍为「待确认」，`:296` 的「safe-area.tsx / stack.tsx 执行时定」实际已合并为 `layout.tsx`，均未回填。
7. **`docs/llm/` 语料当前与文档源不一致**（3 处漂移），属已知且**用户已暂缓**。
8. ~~**`test:docs-layout` 的可信汇总行本轮（2026-09-22）仍未取得**：三次尝试分别被「外置 server 掉线级联」「`5211 already used`」「并发运行共享 server 致 15 分钟超时」阻断（细节见 §4 末两行）。~~ **已取得（2026-09-22 04:21，独占运行，汇总行见 §7）**：`2 failed / 1 flaky / 119 passed (42.8m)`，exit 1 → (a) **HIG-AUD-053 稳定复现**（`tests/e2e/command-search.spec.ts:49`，fail + retry fail）；(b) `static routes (light)` 为**环境卡死**（§4 末两行）；(c) `aggregate layout audit gate` 首轮**真实**失败 3 条断言（§7.1），重试因 worker 重启清空 `ALL_FAILURES` 而通过。~~**仍未核实**：§7.1 第 2、3 条的分诊结论（需定点复核）。~~ **已于 2026-09-22 分诊闭环**（§7.1：#1 真实缺陷修复为 HIG-AUD-054；#2/#3 为断言缺陷，已修）。**同日追加**：(b) 的 `static routes (light)` 卡死已在 harness 侧消除（静态路由分块 + 有界等待，见 §4、§7.1），矩阵内**已无已知红点，唯一稳定红点 = HIG-AUD-053**；`aggregate` 的「重试清空失败集」机制**仍未修**（未能稳定复现首败，故未改）。
9. **HIG-AUD-054 的台账落点尚不齐**：目前只登记在增补台账 §5C 与本交付书（§1、§2、§7.1），`hig-experience-audit-2026-09-18.md`（主报告）与 `hig-coverage-matrix-2026-09-18.md` 尚未登记该编号 → 三份台账编号口径未完全对齐，同步时以「主报告 ∪ 增补」为准。
10. **静态路由用例改名与调用方式（2026-09-22 harness 修复的副作用）**：`static routes (${theme})` → `static routes chunk k/3 (${theme})`（`docs-layout.spec.ts:683`，`aggregate` 在 `:707`）。因此**旧文档/日志里 `-g 'static routes \(dark\)'` 之类的命令已不再匹配任何用例**（增补 §5C 引用的该命令即属此类，属历史记录，重跑请改用 `-g 'static routes chunk'`）。另：命令行传含 `|` 的 grep 会被中间层截断，多条件筛选需把 `grep` 写进配置文件。
11. **「覆盖率」类结论不得只看文件级计数（2026-09-23 HIG-AUD-019 的教训）**：`src/components/ui` 里「多少文件包含 `motion-reduce`」与「reduce 下是否真的不播动画」是两件事——`data-[state=*]:animate-in/out`（specificity 0,2,0）压过单类名 reduce 工具类，故此前 22 个浮层的组件级保护**全是空操作**（审核原文的「28 个文件」因此是虚假覆盖）。今后同类结论必须落到运行时断言（`tests/e2e/reduced-motion.spec.ts`）。
12. **HIG-AUD-010 的验收口径已被本轮修订**（增补 §5L）：由「所有浮层同一个 token」改为「**族内一致**（backdrop 族 / scrim 族）+ 组件层无颜色字面量」，因为两族各有官方实测出处；照原口径「全迁 backdrop 族」会破坏 Drawer 官方 parity。改 `--uni-overlay-*` 族或 `motion-reduce:` 写法前先读 §5L。
13. **浮层内 `href` 条目的「Radix 自动关闭」未经实测（HIG-AUD-017 遗留面）**：`context-menu.tsx:124-140`、`menu.tsx:208-227`（含 `dots-menu`、`menu-bar` 透传路径）在带 `href` 时渲染 `asChild` + `<a>`，仓库**无任何显式关闭代码**，关闭行为被推断来自 Radix `Item` 的 select 语义。本轮**未改动、未做浏览器实测**；若后续验证不成立，需在这两处补 `onSelect` 关闭（做法同 `hamburger-menu` 的组件层修复）。
14. **i18n 键集约束的覆盖边界（HIG-AUD-008，增补 §5M）**：编译期约束只覆盖「locale ↔ locale」漂移；「组件 ↔ key」漂移（组件用了字典里根本没有的 key）由 `tests/component-i18n-source.test.ts` 的静态扫描在**测试期**守护。`t()` 参数**未**收窄为 `FrameworkMessageKey`——现有 5 处动态 key 调用（`t(topicName)`、`t(label)`、`t(menuButtonLabel)`、`t(STATUS_LABELS[state])`、`` t(`JSON ${node.type}`) ``）会被误伤，收窄前需先把它们改成显式联合类型（属可选债务）。另：文档站导航面板不渲染搜索行，`"Search"`/`"Search…"`/`"Ctrl K"` 无浏览器级证据（前两者由键集 + 静态扫描守护；`"Ctrl K"` 两侧同值，浏览器断言本身无区分度）。

---

## 10. 交接时的一句话总结

> 截至 2026-09-23（最近修订 = HIG-AUD-010/019、008、017 三个会话）：累计修复 **21/54** 个审核问题（按 ID 计：P0 001–005、051 **清零**；P1 006/007、**008**、009/011/012、**010**、013、**017**、**019**、037/038/039/040；P2 054；P3 050；另 **`049` 判非缺陷关闭**）。**010/019/008 已提交**（`1045dd0` fix 43 files、`5d63437` fix 6 files，台账 `4b725d3` + `a1b8efa`）；**017 的实现 + 测试 + 台账改动尚未提交**，**未 push**。**余下 32 条审核问题（无开放 P0；批次 C 剩 10 条 P1，推荐起手 `018`，见批次 C 节注）、计划缺口、14 条债务**构成下一阶段主体工作量；动效账本 12→7。门禁侧：typecheck（`tsc -b`）exit 0 / lint 0 errors（16 warnings 存量）/ 定向 vitest 18·112（010/019）+ 13·80（008）+ 5·55（017）全绿 / 新增 e2e：`reduced-motion` **8 passed**、`overlay-route-dismiss` **2 passed**（§7.3~§7.5）。**三轮四条硬教训**：① `test.use({ reducedMotion })` 在本项目配置下不生效，必须用 `page.emulateMedia()`；②「文件级覆盖计数」不等于「生效」（specificity 压过）；③ 新增守护测试必须做**变异测试**（`008`：删一个 zh key，三道守护同时报警）；④ 机制类条目要拆「组件层契约 / 库层原语 + 消费方接入」分别验证——`017` 的变异测试表明两条路径确实各由不同代码承担。**并发 flaky 名单**（单跑复验即过）：`button-api`、`showcode-typecheck`、`llm-task-runner`。`test:docs-layout` 可信汇总行 `2 failed / 1 flaky / 119 passed` → 矩阵内**唯一稳定红点 = HIG-AUD-053**；该门禁的**重试仍会静默掩盖失败**（机制未修，遗留项）；全量 `pnpm test` 当前 exit 1（基线构成见 §7，非单轮引入）。LLM 语料重生成与真机验证因环境/用户指令暂缓。**做任何枚举前先派 subagent，否则本任务会在中途因上下文耗尽而失败。**

