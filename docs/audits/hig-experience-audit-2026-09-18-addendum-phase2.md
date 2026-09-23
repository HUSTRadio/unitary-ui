# HIG 体验审核 · 补充报告（二期新增组件补审）

> 审核日期：2026-09-18
> 审核类型：**只读审核**，未修改任何产品实现、未 commit / 未 push
> 主报告：`docs/audits/hig-experience-audit-2026-09-18.md`
> 覆盖矩阵：`docs/audits/hig-coverage-matrix-2026-09-18.md`
> 规范依据：`docs/audits/hig-experience-audit-2026-09-18.md` §3.1（已由 chromium 渲染取得的 HIG 正文）

---

## 0. 基线（含移动目标说明）

审核期间仓库持续被并发写入，HEAD 观测序列：`b68d3f0` → `92a5b42` → `5d173ca` → `16d0863` → **`d6d5429`**（本补充报告的落笔基线）。

**三个 P1 结论已在 `d6d5429` 上复验可复现**（静态复验；038/039/040 已于同日第二轮完成**运行确认**，见 §5A）：

| 编号 | 复验方式 | 结果 |
|---|---|---|
| HIG-AUD-038 | 检索 `menu-bar.tsx` 的 `max-h\|available-height` | **0 命中** → 无可用高度约束，问题仍在 |
| HIG-AUD-039 | 检索 `toolbar.tsx` 的 `CollapsedItem` / `disabled` | `CollapsedItem` 仍只有 `key/label/icon/onSelect`；`ToolbarItem` 仍通过 `...props` 接受 `disabled`（`:204`）而收集器不复制 → 问题仍在 |
| HIG-AUD-040 | 检索 `activity-view.tsx` 的 `aria-labelledby\|useId\|activity-view-title` | 只有 `:94` 的 `<h2 data-slot="activity-view-title">`，**无 id、无关联** → 问题仍在 |

工作区在交付复核时**干净**（`git status --porcelain` 仅剩本次审核新增的 3 个 `docs/audits/*.md`），并发会话的改动均已提交。

---

## 1. 本轮目的与范围

主报告完成时，并发会话在审核后段落地了 HIG 二期能力。主报告已将这些实现单列为**「已实现但审核未覆盖」的审核盲区**（矩阵 §B.9）。

本轮补齐该盲区，对以下 6 项按与 L1 相同的维度（触发/关闭契约、状态覆盖、键盘与 ARIA、动效与 token、材质与层级、触屏、i18n）做深度静态审核：

| 组件 | 文件 | 规模 | 注册 | 指南 |
|---|---|---|---|---|
| MenuBar | `src/components/ui/menu-bar.tsx` | 221 行 | `components.ts:365-377` | `guides-05.ts:456,1110` |
| Toolbar | `src/components/ui/toolbar.tsx` | 221 行 | `components.ts:395-398` | `guides-05.ts:507,1163` |
| SafeArea / Stack | `src/components/ui/layout.tsx` | 123 行 | `components.ts:379-393` | `guides-05.ts:558,599,1216,1259` |
| ActivityView | `src/components/ui/activity-view.tsx` | 166 行 | `components.ts:352-363` | `guides-05.ts:406,1058` |
| SplitButton pull-down 变体 | `src/components/ui/split-button.tsx` | 272 行 | `components.ts:1127` | `guides-13.ts:5` |

同时核对 5 个新增测试文件的覆盖质量。

**覆盖状态**：矩阵 §B.9 的「审核盲区」**已关闭**。HIG-VER-14 **已解决**。

---

## 2. 结论摘要

| 维度 | 结论 |
|---|---|
| **总体** | 二期实现的**方向与 HIG 正文一致**，且有几处做法优于一期（见 §4）。但存在 **3 个 P1 缺陷**，其中 2 个会导致「用户看不到 / 点得到不该点的东西」。 |
| 排版与层次 | MenuBar / Toolbar / ActivityView 均沿用既有 token 与 44px（ActivityView 操作行）等惯例，观感与一期同族。 |
| 层级 | MenuBar 沿用 `--uni-z-menu`（=50）→ 与主报告 HIG-AUD-009 同源问题。 |
| 动效 | MenuBar 与 pull-down **完整继承**了一期的缺陷（退场缺 `zoom-out`、无时长/缓动 token）→ HIG-AUD-011 / 012 的受影响清单需扩充。 |
| 可访问性 | MenuBar 复用 Radix Menubar（APG 键盘模型）✓、pull-down 保持 `role="menu"` ✓、ActivityView 操作行 44px ✓；但 ActivityView 面板**无可访问名称**。 |
| 测试质量 | **5 个新增测试全部是「源码字符串契约」**，断言实现文本而非行为，且把待修缺陷固化成契约 → 违反 `AGENTS.md` 的测试期望。 |

**新增问题**：P1 × 3、P2 × 4、P3 × 6。（同日第二、三轮运行验证另在主报告 §4.1 新增 **P0 HIG-AUD-051**（Quick Actions 打开即崩溃，**已于 2026-09-21 修复**，并连带修复 HIG-AUD-001）、**P2 HIG-AUD-052**（legacy 账本旁路，HIG-AUD-005 撤回后的实质残留）与 **P2 HIG-AUD-053**（命令面板搜索相关性回归，`test:docs-layout` 稳定失败发现），并撤回 HIG-AUD-005 的 P0 判定，见 §5A。）

---

## 3. 新增问题清单

### 3.1 P1

#### HIG-AUD-038 MenuBar 的菜单没有可用高度约束 → 长菜单溢出视口，尾部项不可达 ✅ 已修复（2026-09-22）

- **严重度**：P1 ｜ **类型**：实现缺陷 ｜ **验证状态**：`[已修复 + 运行确认]`（2026-09-22，修复与复测记录见 §5D）
- **证据**：
  - `src/components/ui/menu-bar.tsx:36-39` `MENU_BAR_SURFACE` 含 `overflow-x-hidden overflow-y-auto`，但**没有任何 `max-h-*`**（我检索该文件 `max-h|available-height` → **0 命中**）。
  - 对照同仓库的正确做法：`src/components/ui/menu.tsx:139` 使用 `max-h-[var(--radix-dropdown-menu-content-available-height)]`。
  - Radix 原语会暴露 `--radix-menubar-content-available-height` 供消费方约束高度，本项目未使用。
- **实际表现（推断）**：菜单内容高于视口时，元素以 `height: auto` 撑出视口下沿；由于 Radix 菜单在 modal 模式下锁定 body 滚动，**超出部分既不可滚动到、也不可点击**。项目符号菜单（如 20 项的 "File"）在 390/320 视口下必然触发。
- **根因**：菜单面板样式在两个组件间复制（`menu.tsx` 与 `menu-bar.tsx`），复制时丢了高度约束这一条。
- **建议修复方向**：给 `MENU_BAR_SURFACE` 补 `max-h-[var(--radix-menubar-content-available-height)]`（SubContent 对应 `--radix-menubar-sub-content-available-height`），并抽出与 `menu.tsx` 共享的「菜单表面」常量，避免再次分叉。
  - **修复时实况修正**：`@radix-ui/react-menubar` **不为 SubContent 生成** `--radix-menubar-sub-content-available-height`（dist 实测 0 命中，运行时 `getPropertyValue` 为空），`@radix-ui/react-menu` 也不暴露任何 available 变量；SubContent 实际采用 `--radix-popper-available-height`（与 react-dropdown-menu SubContent 的官方 re-namespace 做法语义一致）。共享常量抽取未做（最小改动，避免跨文件连带），留待债务台账。
- **验收场景**：在 320×700 视口打开一个 20 项的 MenuBar 菜单 → 菜单完整可见（可滚动），最后一项可达并可点击。✅ 已按此场景落为永久回归（§5D）。

#### HIG-AUD-039 Toolbar 折叠时静默丢弃非 `ToolbarItem` 内容，且丢失 `disabled` 态

- **严重度**：P1 ｜ **类型**：实现缺陷（两个独立缺陷） ｜ **验证状态**：`[静态确证]`
- **证据**：
  1. **静默丢弃**：`src/components/ui/toolbar.tsx:167` —— `if (collapsed && collapsible) return null;`（整组从 DOM 移除）；`:81-98` `collectCollapsedItems` **只**收集 `node.type === ToolbarItem` 的直接子元素（`:77`、`:88`）。因此组内的搜索框、`MenuButton`、分段控件、自定义控件被折叠后**从界面消失且无任何入口**。文件注释（`:11-13`）承认了这一点，但 `collapsible` 的**默认值是 `true`**（`:160`）→ 默认行为即静默隐藏任意控件。
     - 边界：`React.Children.forEach` **不展开 Fragment**（`:83`、`:87`）→ 用 `<>…</>` 包裹分组时连 `ToolbarItem` 也收集不到。
  2. **丢失 disabled**：`collectCollapsedItems` 只复制 `label`/`icon`/`onSelect`（`:90-94`），**不复制 `disabled` 与 `active`**；`DotsMenuItem` 因此只拿到 `onSelect`（`:147`）。于是**在工具栏里被禁用的操作，折叠进溢出菜单后变成可点击**。
- **实际表现**：窄视口下工具栏可能丢控件；且「禁用」语义在折叠态失效 —— 用户能执行一个本应被禁用的命令。
- **根因**：折叠被建模为「组级显隐 + 按元素类型挑选」，而不是「显式声明哪些项可进溢出菜单」；跨渲染路径的状态未被传递。
- **建议修复方向**：
  - (a) `collapsible` 默认改为 `false`（显式选入），或在折叠组含非 `ToolbarItem` 内容时于开发模式告警；
  - (b) `CollapsedItem` 增加 `disabled`、`active` 并透传到 `DotsMenuItem`；
  - (c) 用 `React.Fragment` 展平或改为 `data-overflow-item` 标记驱动，替代 `node.type` 判定。
- **验收场景**：`<ToolbarGroup slot="leading"><ToolbarItem disabled label="Reload" …/></ToolbarGroup>` 在折叠后，溢出菜单中该项**仍为禁用**；组内放搜索框 + `collapsible` 未显式开启 → 搜索框始终可见。

#### HIG-AUD-040 ActivityView 渲染了标题却没有可访问名称

- **严重度**：P1 ｜ **类型**：实现缺陷 ｜ **验证状态**：`[静态确证]`
- **证据**：
  - `src/components/ui/activity-view.tsx:93-97` 渲染 `<h2 data-slot="activity-view-title">`，但**未生成 id、也未传给容器**。
  - 容器来自 `src/components/ui/bottom-sheet.tsx:85-92` → `<BottomSheet>` 内是 `DialogPrimitive.Content`（`bottom-sheet.tsx:152`），其 class 与 props 中**没有 `aria-labelledby` / `aria-label`**（只有 `tabIndex={-1}`）。
  - 因此该 `role="dialog"` 元素**没有可访问名称**；屏幕阅读器只会播报「dialog」。
- **影响**：分享面板对 AT 用户不可辨识（不知是分享面板还是别的对话框）；与主报告 HIG-AUD-016（multi-select 无名 dialog）同一类问题，说明这是**跨组件的系统性遗漏**而非个例。
- **建议修复方向**：`ActivityView` 生成 `useId()`，把 `<h2 id>` 关联到容器（`BottomSheet` 增加 `aria-labelledby` 透传，或由 `ActivityView` 通过 `className` 之外的 props 传入）；`title === null` 时回退到 `aria-label`。并给 `BottomSheet` 补同样的能力。
- **验收场景**：打开 ActivityView，屏幕阅读器播报「分享，对话框」；`title={null}` 时仍有名称。

### 3.2 P2

#### HIG-AUD-041 二期 5 个测试全部是「源码字符串契约」，锁定实现细节并把待修缺陷固化成契约

- **严重度**：P2 ｜ **类型**：测试质量 / 文档问题 ｜ **验证状态**：`[静态确证]`
- **证据**：全部为 `readFileSync` + `expect(source).toContain(...)`：
  | 测试 | 断言对象 |
  |---|---|
  | `tests/menu-bar-api.test.ts:12-51` | 源文本（含 `"ml-auto pl-4"` 这类 Tailwind 类名字符串） |
  | `tests/toolbar-api.test.ts:9-36` | 源文本（`"requiredWidthRef.current + 24"` 等表达式文本） |
  | `tests/layout-api.test.ts:13-43` | 源文本 + `docs-routes.ts` 文本（`'max(${spacing}, env(safe-area-inset-top))'` 精确模板串） |
  | `tests/activity-view-api.test.ts:12-34` | 源文本 |
  | `tests/pull-down-button-api.test.ts:14-40` | 源文本（`EXPAND_CORNER_PROPS` 字面量） |
- **三个具体危害**：
  1. **不保护行为**：这些用例在组件「渲染为空」「折叠逻辑失效」「定位算错」时**依然全绿** —— 而 HIG-AUD-038/039 正是这类未被覆盖的缺陷。
  2. **锁死重构**：`layout-api.test.ts:15` 精确匹配模板字符串，把 `SafeArea` 的实现方式冻结为契约 —— 即便改用 CSS 自定义属性（行为等价或更好）也会让测试失败。
  3. **固化缺陷**：`activity-view-api.test.ts:34` 断言 `'action.destructive ? "text-[#ee0000]" : "text-gray-1000"'` → **修复 HIG-AUD-005（迁移到语义 token）必须同时改测试**；`pull-down-button-api.test.ts:22-25` 同样逐字冻结了定位映射表。
- **对照仓库自身规范**：`AGENTS.md`「Testing expectations」明确要求「**Prefer behavioral contracts over brittle snapshots or broad source-string checks**」。
- **说明（公平起见）**：该模式有先例（`tests/split-button-api.test.ts`，`pull-down` 测试注释自述「与 split-button-api.test.ts 一致的做法」），属**既有模式被延续**，不是新发明的问题；但二期把它的应用面扩大到了 5 个新组件，风险随之放大。
- **建议修复方向**：
  - 改为行为断言（RTL/jsdom 渲染 + `getByRole`/`aria-*` 断言），至少覆盖：Toolbar 折叠后溢出菜单项与 `disabled` 透传、MenuBar 菜单可滚动、ActivityView 可访问名称、pull-down 的 `side`/`align`/`origin` 实际落到 DOM；
  - 保留少量「公开 API 契约」字符串断言是合理的（导出名、默认值），但**不要**断言视觉类名与表达式文本。
- **验收场景**：把 `ToolbarGroup` 折叠实现换成纯 CSS 方案后，行为测试仍通过；把 `#ee0000` 迁移为语义 token 后无需改动行为测试。

#### HIG-AUD-042 ActivityView 目标横向滚动无边缘提示（与仓库自身最佳实践矛盾）

- **严重度**：P2 ｜ **类型**：实现缺陷（一致性）
- **证据**：`src/components/ui/activity-view.tsx:100-103` 目标区为 `flex gap-3 overflow-x-auto overscroll-x-contain pb-1`，**无边缘渐隐/阴影提示**。
  - 而 `docs/geist/src/data/components.ts:789` 在 `scroller` 的最佳实践中明确写：「**Show edge fade or shadow affordances on the clipped axis so users see there's more content past the viewport.**」
  - `tests/activity-view-api.test.ts:22` 反而把 `overflow-x-auto` 断言为契约。
  - 同类问题也存在于 `MenuBar` 根容器（`menu-bar.tsx:65` `overflow-x-auto`，无提示）→ 一并记为 HIG-AUD-044 的一部分。
- **影响**：目标多于 4–5 个时，用户不知道右侧还有内容（HIG「share sheet 上方为横向滚动的目标区」）。
- **建议修复方向**：复用 `Scroller` 组件或补边缘渐隐 token；或在目标区改为可换行网格（HIG 允许 grid）。
- **验收场景**：目标 8 个时，右侧出现可见的溢出提示；键盘 Tab 到被裁切的目标时容器自动滚动入视。

#### HIG-AUD-043 ActivityView 固定单档位且禁用扩展，长操作列表无法放大查看

- **严重度**：P2 ｜ **类型**：实现缺陷（可用性）
- **证据**：`src/components/ui/activity-view.tsx:85-91` 硬编码 `detents={[0.6]}`、`showIndicator={false}`、`gestures={{ resize: false, expandUp: false }}`。
- **影响**：面板固定占 60% 视口高，内容超出后在面板内滚动（`overflow-y-auto`，`:91`），用户**无法把面板拉高**以一次看到更多操作项。操作项较多（如 10 项 + 目标网格）时体验受限。
- **建议修复方向**：至少允许两档（如 `[0.6, 0.9]`）或把档位/手势暴露为 props（`ActivityViewProps` 目前不透传 `detents`/`gestures`）。
- **验收场景**：390×844 视口、8 个目标 + 8 个操作 → 面板可拉高至近全屏并完整浏览。

#### HIG-AUD-044 MenuBar 层级与溢出提示

- **严重度**：P2 ｜ **类型**：实现缺陷（一致性）
- **证据**：
  1. `src/components/ui/menu-bar.tsx:37` 使用 `z-[var(--uni-z-menu)]`（`index.css:956` = **50**）→ 低于 drawer(200) / modal(300) / popover(2001)。在抽屉或模态内使用 MenuBar 时菜单会被遮挡（与主报告 HIG-AUD-009 同源）。
  2. `src/components/ui/menu-bar.tsx:65` 根容器 `overflow-x-auto` 且无边缘提示（同 HIG-AUD-042 的一致性口径）。
- **建议修复方向**：并入 HIG-AUD-009 的 z 层级统一治理；溢出提示并入 HIG-AUD-042。
- **验收场景**：在 Modal 内打开 MenuBar 菜单 → 菜单在遮罩之上且可点击。

### 3.3 P3

| 编号 | 问题 | 证据 | 建议 |
|---|---|---|---|
| **HIG-AUD-045** | `SafeArea` 的 `style` 透传可静默覆盖安全区内边距 | `layout.tsx:54-60`：`padding*` 之后展开 `...style` | 文档标注「style 会覆盖安全区内边距」，或改为合并而非覆盖 |
| **HIG-AUD-046** | `SafeArea` 的档位表与 `Stack` 的 gap 表是**两份平行知识** | `layout.tsx:22-28`（`SPACING_VALUE`）与 `:30-36`（`STACK_GAP_CLASS`）。当前二者数值一致（gap-1=0.25rem=`calc(var(--spacing)*1)`，…，gap-8=2rem），但改档位需同时改两处 | 由单一常量派生两者，或加守护测试断言二者同步 |
| **HIG-AUD-047** | MenuBar 的快捷键是「不可用的承诺」 | `menu-bar.tsx:46-55`：快捷键仅展示且 `aria-hidden="true"`；组件不绑定按键（`:18`）。视觉用户看到 `⌘N` 会以为可用 | 文档明确「仅展示」；或提供 `onShortcut` 由调用方接线；不建议对视觉用户展示未绑定的快捷键 |
| **HIG-AUD-048** | pull-down 允许卡片出现在按钮**上方**，与「pull-down（下拉）」隐喻相悖 | `split-button.tsx:44-52`：`bottom-left`/`bottom-right` → `top-start`/`top-end`。默认 `top-left`（卡片在下方）✓ 正确 | 文档标注「上方展开用于工具栏位于底部等场景」，或收窄可选角 |
| **HIG-AUD-049** | ActivityView 图标瓦片 48px，HIG 正文建议约 70×70px | `activity-view.tsx:113` `size-12`（48px）+ `:113` `[&_svg]:size-5`（20px）；HIG §3.1 `activity-views.md`「center it in an area measuring about **70x70 pixels**」 | **Web 适配判断，非缺陷**：需设计决策记录（HIG 的 70×70 是 iOS 点/像素语境；Web 48px 更贴合 Geist 密度）。~~建议在组件注释中写明取舍~~ → **已于 2026-09-22 关闭**：设计决策注释已落 `activity-view.tsx`（瓦片 `size-12` 处），布局无改动 |
| **HIG-AUD-050** | `collectCollapsedItems` 不展平 Fragment，用 `<>…</>` 包裹分组时收集失败 | `toolbar.tsx:83,87` `React.Children.forEach` | 递归展平 Fragment，或文档禁止用 Fragment 包裹分组 |

---

## 4. 值得保留的做法（正面对照）

审核尺度不只看问题，以下是二期**优于一期**或值得作为全库范例的实现：

| 做法 | 证据 | 为什么好 |
|---|---|---|
| **SafeArea 用 `max(档位, env(safe-area-inset-*))`** | `layout.tsx:55-58` | 正是 HIG `layout.md`「respect system-defined safe areas」的 Web 正确落地：既不小于设计档位，也不会被刘海/圆角/系统栏遮挡。比硬编码 padding 更符合规范。 |
| **Toolbar 折叠带 24px 滞回** | `toolbar.tsx:117-119` | 避免临界宽度下反复折叠/展开的抖动（对应 HIG Motion「避免不必要的动效/抖动」）。 |
| **Toolbar 折叠以「组」为单位而非逐项** | `toolbar.tsx:166-167` + 注释 | 避免把任意控件塞进菜单 —— 设计意图正确（缺陷在于默认值与状态透传）。 |
| **ActivityView 操作行与取消行 `h-11`（44px）** | `activity-view.tsx:133,156` | **全库最接近 HIG 44pt 的触控目标**，可作为 HIG-AUD-013 整改的现成范式。 |
| **ActivityView 一次性动作语义** | `activity-view.tsx:75-82`（执行后即关闭） | 与 HIG `activity-views.md`「An activity view dismisses immediately after people complete the task」一致。 |
| **ActivityView 不在面板内做进度提示** | 同上（组件无 loading/progress UI） | 与 HIG「Use your **main app** to denote the progress of a lengthy operation」一致 —— **刻意不做**比做错更符合规范。 |
| **MenuBar 复用 Radix Menubar** | `menu-bar.tsx:2,57-70` | 直接获得 ARIA `menubar` 键盘模型（左右切顶级、上下进菜单、Esc 逐级关闭），避免手写导航逻辑。 |
| **pull-down 坚持 `role="menu"` 语义** | `split-button.tsx:168-179`（仍用 `Menu`/`MenuItem`） | 卡片化只体现在容器视觉与动画原点，**可访问性优先**于形态拟真 —— 这正是 `PLAN-HIG-COMPONENTS.md:323` 定下的取舍，执行到位。 |
| **pull-down 默认角正确** | `split-button.tsx:108` `expandCorner = "top-left"` → 卡片在按钮下方 | 与「pull-down 下拉」隐喻一致，未因可选性而破坏默认语义。 |
| **`MenuBarShortcut` 对 AT 隐藏** | `menu-bar.tsx:48-50` | 因快捷键未绑定，对 AT 隐藏可避免播报无效承诺（对视觉用户仍是问题，见 HIG-AUD-047）。 |

---

## 5. 对主报告的修订

1. **矩阵 §B.9「审核盲区」关闭**：6 项实现已补审，结论见本文。
2. **HIG-VER-14 已解决**。
3. **受影响清单扩充**（主报告 §4.2 / §4.3 的条目）：
   | 主报告条目 | 新增受影响组件 |
   |---|---|
   | HIG-AUD-011 退场动画缺失（缺 `zoom-out`） | **MenuBar**（`menu-bar.tsx:39`）、**pull-down 变体**（经 `Menu` 继承） |
   | HIG-AUD-012 动效 token 覆盖不全 | **MenuBar**、**pull-down 变体** |
   | HIG-AUD-009 z-index 不统一 | **MenuBar**（`--uni-z-menu` = 50，见 HIG-AUD-044） |
   | HIG-AUD-013 触控目标 < 44pt | **MenuBarTrigger**（`h-7` = 28px，`menu-bar.tsx:83`）、**ToolbarItem**（`h-8` = 32px，`toolbar.tsx:199`） |
   | HIG-AUD-018 受控能力缺口 | **pull-down 变体**（下拉触发按钮仍不能单独 `disabled`） |
   | HIG-AUD-025 loading/empty 缺失 | **MenuBar**、**Toolbar**（溢出菜单无空态） |
   | HIG-AUD-037 破坏性项无二次确认 | **ActivityView**（`activity-view.tsx:131` 直接执行并关闭） |
   | HIG-AUD-005 原始色治理 | **ActivityView**（`:134`）；**新增影响**：`tests/activity-view-api.test.ts:34` 把该字面量固化为契约，修复需同时改测试 |
4. **问题计数更新**（主报告 §1.2）：P1 20 → **23**、P2 6 → **10**、P3 5 → **9**。
5. **整改路线**：HIG-AUD-038/039/040 归入**阶段 1**（阻断与可访问性）；041–044 归入**阶段 2**（一致性与测试治理）；045–050 归入**阶段 3**。测试治理（041）建议与阶段 2 的守护测试建设合并执行。

---

## 5A. 运行时验证补录（2026-09-18 同日第二轮）

本节补齐 §6 所列「运行时确认」缺口。**基线**：HEAD `d6d5429`（工作区干净，仅本审核新增的 `docs/audits/*.md` 未跟踪）。**方法**：Playwright chromium + **全新 dev server**（端口 5212/5213，排除长跑 server 缓存漂移；脚本自包含启动与 `taskkill` 清理）。**脚本**：`.scratch/hig-audit-2026-09-18/verify-phase2-findings.mjs`、`verify-fresh-server.mjs`、`repro-slot-error.mjs`；截图 4 张存 `.scratch/hig-audit-2026-09-18/screenshots/`。

| 编号 | 原验证状态 | 运行结果（实测值） | 新验证状态 |
|---|---|---|---|
| **HIG-AUD-038** MenuBar 长菜单溢出 | `[静态确证]` | 390×844 视口，向 MenuBar 菜单注入 40 个合成菜单项后打开：菜单底边 **y=2005**（视口高 844 → **溢出 1161px**），`maxHeight: none`，容器内**不可滚动**（`canScrollInside: false`），触发器 28px。合成项仅用于放大既有溢出，静态缺陷（无 `max-h-*`）不依赖注入即可证。 | **`[运行确认]`** |
| **HIG-AUD-039** Toolbar 折叠丢 `disabled`/状态 | `[静态确证]` | 320px 视口折叠后：溢出菜单 **6 个溢出项全部丢失** `aria-pressed` / `data-active` / `disabled`；溢出入口为 DotsMenu 按钮（32px，aria-label「菜单」）。 | **`[运行确认]`** |
| **HIG-AUD-040** ActivityView 无可访问名称 | `[静态确证]` | 打开分享面板：`role="dialog"` 元素 `aria-label: null`、`aria-labelledby: null`；`<h2>` 文本「共享」但 **`id=""`**（无法被关联）；操作行实测 **44px** ✓（正面项一并确认）。 | **`[运行确认]`** |
| **HIG-AUD-037** 破坏性项无二次确认 | `[静态确证]`（ActivityView 受影响清单） | 点击「屏蔽用户」（Block User）后：`dialogCount: 0`（无任何确认对话框出现），日志直接记录 `"Block User"` 执行。 | **`[运行确认]`** |

**附带发现（记入主报告 §4.1）**：

- **HIG-AUD-051（P0，新发现；已于 2026-09-21 修复）**：`ContextMenuQuickActionsContent` 的 Portal 兄弟子节点（遮罩 div + Content）违反 `@radix-ui/react-menu@2.1.24` `MenuPortal` 的 `asChild` 单子元素契约 → Quick Actions **打开即渲染崩溃**，ErrorBoundary 捕获后 `/components/context-menu` **整页示例被替换**。这也是主报告第一轮 QA 运行验证「菜单未打开且无报错」的真正原因（第一轮为时序假象；第二轮逐示例隔离后在全新 server 上稳定复现并取得完整错误栈）。根因、证据链与修复方向见主报告 §4.1 HIG-AUD-051。
- **HIG-AUD-005 撤回**：治理测试实际为绿（4/4 passed, exit 0），账本已注册全部 3 个文件；初版判定读取了过时快照。实质残留（legacy `files[]` 只增不减旁路）记为 **HIG-AUD-052（P2）**。

**命令退出码（主报告 HIG-VER-08 部分，第三轮 @ `834f19d8` 全部取得）**：
- `pnpm run typecheck` → **exit 0**；`pnpm run docs:llm:check` → **exit 0**（corpus 确定性）；`pnpm run build` → **exit 0**。
- `pnpm test` → **exit 1**。分类：**稳定基线失败** 9 用例/3 文件（`docs-foundations` ×3、`foundation-contract` ×1、`keyboard-input-api` ×5——后者为字符串断言过时，属 HIG-AUD-041 脆性模式的实例）；**flaky/环境**：`llm-task-runner`（超时）、`showcode-typecheck`（IDE 安全删除 shim ETIMEDOUT，环境干扰非产品缺陷）。
- `pnpm run test:docs-layout` → **exit 1**（116 用例 13.3m：**113 passed / 1 failed / 2 flaky**）。1 failed = **HIG-AUD-053（新发现，P2）**：zh-CN 搜 "toast" Enter 落到「堆叠」——根因链：`docs-routes.ts:42` layout 分组排在 components 之前 + `getRouteSearchText`（`:166`）把分组名 "Layout & Organization" 拼进 item 搜索文本 + cmdk `commandScore` 子序列匹配且不重排 DOM → stack 成为首个选中项。2 flaky（chunk 7/11 light 首试 90s 超时 retry 过、aggregate-gate retry 过）为 dev server 冷启动波动。完整条目见主报告 §4.1 HIG-AUD-053。
- 环境备注：`test:docs-layout` 首跑被 IDE safe-delete shim 拦截（Playwright outputDir 含 1999 个残留文件 > 500 删除阈值，`SAFE_DELETE_BULK_CONFIRM_REQUIRED`），预清 `.scratch/playwright-results` 后正常执行——与 `showcode-typecheck` ETIMEDOUT 同属 IDE 环境干扰，非产品缺陷。
- 原始日志：`.scratch/hig-audit-2026-09-18/cmdlogs/{typecheck,docs-llm-check,build,test-docs-layout,gitlog}.log` + `summary.json`。

---

## 5B. 英文指南正文核对（6 项二期能力，guides-05 / guides-13）

逐条核对 `guides-05.ts`（activity-view `:406/:1057`、menu-bar `:455/:1109`、toolbar `:506/:1162`、safe-area `:557/:1215`、stack `:598/:1258`）与 `guides-13.ts`（split-button `:4/:267`）的双语段。

**双语 parity：6/6 对齐** —— summary / whenToUse / whenNotToUse / examples（id 与 demoKey 一致）/ 四个 behavior 小节的 status 与语义均逐条对应，未发现中英内容漂移。

**与实现的一致性：2 处矛盾 + 1 处缺口（均为指南声称了实现未兑现的行为）**：

| 组件 | 指南声称（zh / en 双语同述） | 实现实况（已运行确认） | 定性 |
|---|---|---|---|
| **MenuBar** | 「菜单浮层在视口内碰撞翻转，**最大高度受限后可滚动**」（`guides-05.ts:495`）/ "scroll once they hit the max height"（`:1151`） | HIG-AUD-038：`MENU_BAR_SURFACE` 无 `max-h-*`，40 项菜单底边 y=2005（视口 844，溢出 1161px），`maxHeight: none`，不可滚动 | **文档与实现矛盾**（HIG-DOC-05 同类）——**已于 2026-09-22 随 HIG-AUD-038 修复消解**：实现现消费 available-height 变量，指南表述恢复真实，双语正文无需改动（见 §5D） |
| **Toolbar** | 「选中态通过 **aria-pressed** 暴露」（`:531`）/ "exposed through aria-pressed"（`:1189`） | HIG-AUD-039：折叠进溢出菜单后 6 个溢出项**全部丢失** `aria-pressed` / `data-active` / `disabled`（未折叠的本体路径未单独实测） | **文档与实现矛盾**（受 039 修复影响；修复后指南即恢复真实） |
| **pull-down 变体** | —（`guides-13.ts` split-button 双语指南**完全未提及** pull-down 变体：无 `expandCorner` 说明、无变体示例、无卡片化形态差异） | `split-button.tsx:44-52` 已实现 `expandCorner` 四角；HIG-AUD-048 建议的「上方展开场景」文档不存在 | **文档缺口**：二期变体无用户文档（注册链存在但正文零覆盖） |

其余组件（ActivityView / SafeArea / Stack / split-button 基础形态）：指南与实现一致，未发现虚构 props 或行为。ActivityView 的 a11y 段未声称面板可访问名称（未撒谎，但 HIG-AUD-040 的缺陷仍在，修复时可在指南同步补充）；「破坏性操作仅用颜色加语义标签区分」与实现相符（红色 + 不同文案）。

---

## 6. 本轮未完成事项（2026-09-18 第二轮后更新）

| 项 | 原因 | 恢复动作 |
|---|---|---|
| ~~HIG-AUD-038/039/040 的运行时确认~~ | ✅ **已完成**（§5A，全新 dev server 实测） | — |
| 二期 5 个组件的**运行验证** | **部分完成**：折叠实际行为（039）、面板可访问名称（040）、长菜单溢出（038）、破坏性确认（037）已实测；**MenuBar 键盘模型、pull-down 定位与展开动画仍待** | 复用 `scripts/runtime-interaction-audit.mjs` 的真实 CDP 输入范式，为 MenuBar / pull-down 各加一条 |
| ~~命令退出码（`pnpm test` / `typecheck` / `build` / `docs:llm:check` / `test:docs-layout`）~~ | ✅ **已全部取得并分类**（§5A 第三轮 @ `834f19d8`：typecheck/docs:llm:check/build 全绿；`pnpm test` exit 1 基线失败；`test:docs-layout` exit 1 = 新发现 HIG-AUD-053 + 2 环境性 flaky） | — |
| ~~新增 6 项能力的**英文指南正文**逐条核对~~ | ✅ **已完成**（§5B）：双语 parity 6/6 对齐；发现 2 处文档与实现矛盾（MenuBar 可滚动声明、Toolbar aria-pressed 声明）与 1 处 pull-down 文档缺口 | 矛盾随 HIG-AUD-038/039 修复自动消解；pull-down 文档缺口建议并入 HIG-AUD-048 的整改 |

---

## 7. 审核过程声明

- 本次**只读**：未修改 `src/`、`docs/geist/` 或任何测试；未新增或修改公共 API；未 commit、未 push。
- 本轮**新增文件仅限本文件**。
- 所有结论基于**冻结时刻的源码文本**；仓库在审核期间持续变动，复验前请先固定 commit。

---

## 5C. 聚合门禁首轮可信运行的三条断言分诊（2026-09-22）

聚合门禁修复（§5A）后首次可信运行（见 `hig-handoff-next-agent-2026-09-21.md` §7.1）暴露 3 条断言失败，经双主题实测分诊闭环：

- **HIG-AUD-054（P2，新发现；已于 2026-09-22 修复）**：`/components/feedback` @320 根级横向溢出（`documentElement.scrollWidth 330 > 320`，light + dark）。
  - **根因**：Inline demo 收起态胶囊自然宽 285px；占位层（`data-feedback-inline`）作为 flex item 被容器（demo 卡 `p-6` 内容区 230px）压缩，而内层**绝对定位**胶囊不参与 shrink、保持 285px，demo 卡 `overflow-visible` 不裁切 → 胶囊右缘突破视口 10px。
  - **修复**：占位层加 `shrink-0`（`src/components/ui/feedback.tsx`）。压缩解除后 `justify-center` 容器令占位层两侧对称溢出，LTR 下左侧溢出不产生滚动宽度，胶囊完整可见。
  - **修复后实测**：双主题 @320 `rootScrollWidth = clientWidth = 320`，胶囊 18–303px（左右留白 18/17px 对称）。
  - **回归**：`test:docs-layout` 的 `no-root-horizontal-overflow`（/components/feedback @320 × 双主题）。
- **`colors-computed-value-contract`（18 行，仅 dark 观测）→ 断言缺陷，非产品缺陷（已修）**：卡内紧凑显示按约定省略 `#` 前缀（完整值在 `title` 与剪贴板，clipboard 契约测试本就前缀无关比较），断言误用全等。实测 92 个 swatch 双主题「前缀无关」比较全部一致（真实漂移 0）。「仅 dark」为观测假象：light 静态路由运行环境卡死，证据随 Playwright worker 隔离丢失。修复：断言改前缀无关比较（`tests/e2e/docs-layout.spec.ts` 9a）。
- **`grid-responsive-columns`（≥1024，仅 dark 观测）→ 断言缺陷，非产品缺陷（已修）**：`responsive-breakpoints` demo 使用 `unstable_useContainer`，断点按**容器**宽度解析：视口 1440 时容器（`grid-system-wrapper`）仅 863px → md 层（769–960）→ 2 列为正确行为；断言误按视口宽度预期 3 列。「仅 dark」同为观测假象。修复：断言改容器感知——采集容器宽度与 Grid 内联断点变量，按与 `grid.module.css` `@media`/`@container` 一致的阈值（xs≤400 / sm 401–600 / smd 601–768 / md 769–960 / lg≥961）与 fallback 链推导预期列数（`docs-layout.spec.ts` 11）。双主题 × 6 视口全 PASS。
- **复跑记录（2026-09-22，修复后定向门禁）**：`tsc -b` 通过；定向 vitest（`feedback-rating-bar` + `docs-feedback`）2 文件 / 29 测试通过；`docs-feedback-typography.spec.ts` 13 通过（1.3m）；`docs-layout --grep "component routes chunk 7"`（含 /components/feedback，双主题 @320）2 通过（1.4m）；`docs-layout --grep "static routes \(dark\)"`（含 /colors、/grid 断言修正）1 通过（1.3m）。全绿。
- **遗留（未修）**：`aggregate layout audit gate` 的重试掩蔽缺陷（Playwright 重试重启 worker → 进程内 `ALL_FAILURES` 清空 → 首败重过被记 flaky）仍在。三处断言源头修复后当前已无被掩盖对象，但机制性风险未消除；建议后续把失败清单持久化到文件（如 JSONL 证据文件）而非 worker 内存。

**门禁复跑证据（2026-09-22，均为独占 dev server 依次运行）**：

- `pnpm run typecheck` → **exit 0**。
- `pnpm exec vitest run tests/feedback-rating-bar.test.tsx tests/docs-feedback.test.tsx` → **2 files / 29 tests passed，exit 0**。
- `pnpm exec playwright test tests/e2e/docs-feedback-typography.spec.ts` → **13 passed (1.3m)，exit 0**（胶囊几何专项未受 `shrink-0` 影响）。
- `pnpm exec playwright test tests/e2e/docs-layout.spec.ts --grep 'component routes chunk 7'` → **2 passed (1.4m)，exit 0**（feedback 在 84 个组件路由中索引 55 → chunk 7/11；含 `/components/feedback` @320 双主题 `no-root-horizontal-overflow` 回归）。
- `pnpm exec playwright test tests/e2e/docs-layout.spec.ts --grep 'static routes \(dark\)'` → **1 passed (1.3m)，exit 0**（含 `/colors` 6 视口 × 3 token 原 18 行、`/grid` ≥1024 原失败项，经断言修正后全绿）。
- 双主题视觉核查（临时 Playwright 探针，跑完即删）：feedback @320 胶囊 18–303px 完整可见（左右留白 18/17px 对称）、`rootScrollWidth = clientWidth = 320`；`/grid` 双主题 × 6 视口按容器感知预期全 PASS；`/colors` 92 swatch 双主题前缀无关全一致。
- 原始日志：`.scratch/gate-{typecheck,vitest,e2e-feedback,layout-chunk7,layout-static-dark}.log`。

---

## 5D. HIG-AUD-038 修复记录（2026-09-22）

- **修复**：`src/components/ui/menu-bar.tsx` — `MenuBarContent` 补 `max-h-[var(--radix-menubar-content-available-height)]`；`MenuBarSubContent` 补 `max-h-[var(--radix-popper-available-height)]`（两处均在组件 `cn()` 处而非共享常量——顶级与子菜单可用变量不同）。
- **变量名实况（修复时实测修正原建议）**：
  - `@radix-ui/react-menubar` dist 仅生成 `--radix-menubar-content-available-width/height`（顶级 Content 包装层 re-namespace 自 `--radix-popper-available-*`）；
  - **不生成** `--radix-menubar-sub-content-available-height`（dist 0 命中；运行时 `getPropertyValue` 为空 → 原建议该变量对 SubContent 无效）；
  - `@radix-ui/react-menu` 不暴露任何 available 变量（dist 0 命中）；
  - SubContent 元素上唯一可用约束源为 popper 原生 `--radix-popper-available-height`，与 `react-dropdown-menu` SubContent 的官方 re-namespace 做法语义一致。
- **回归**：新增永久回归 `tests/e2e/menu-bar-content-height.spec.ts`（2 用例）：320×700 注入 20 合成项后断言 ① 顶级菜单 `maxHeight ≠ none`、底边 ≤ 视口、`scrollHeight > clientHeight`、滚到底后尾部原生项（Export 子菜单触发器）可见可点击；② 子菜单同样受约束且可滚动。**注意**：Radix Menubar 顶级触发器 `role="menuitem"`（非 `button`）。
- **修复后实测（几何，双主题 × 320×700 / 1280×800）**：
  - 顶级菜单：`maxHeight=335.56px`（320 视口）/ `386px`（1280×800），bottom 恰达视口底（与 `menu.tsx` dropdown 同语义），双主题几何完全一致；
  - 子菜单：`maxHeight=700px/800px`（popper cross-axis 退化值）+ `avoidCollisions` shift 将其整体移入视口（实测 top=0、bottom=700），可滚动、完整可见。
- **视觉核查（临时 Playwright 探针，跑完即删）**：双主题 × 双视口几何采集如上；`bottomGap=0` 为全库菜单统一形态（available-height 语义），未加 `collisionPadding`（与 `menu.tsx` 保持一致）。
- **附带发现（补强 HIG-AUD-044 证据，未修）**：320 宽视口下子菜单横向 `rightGap=-107px`（left=235, right=427, 视口 320）——父菜单（49–241px）左右两侧均放不下 192px 宽子菜单，popper 选右侧溢出。属 044「子菜单碰撞翻转后溢出视口」范围，本轮不扩。
- **门禁**：`pnpm run typecheck` → exit 0；`pnpm exec vitest run tests/menu-bar-api.test.ts` → 5/5 passed；回归 e2e `menu-bar-content-height.spec.ts` → **2 passed**；`docs-layout --grep 'component routes chunk 2/11'`（含 /components/menu-bar，双主题 @320）→ **2 passed (2.2m)**。
- **HIG-DOC-05 关联**：§5B 所记「指南声称最大高度受限可滚动 vs 实现无约束」矛盾随本修复消解，双语指南正文无需改动。

---

## 5E. HIG-AUD-006/007 修复记录（2026-09-22，SidePanel 成对处理）

- **修复**：`src/components/ui/side-panel.tsx` —
  - **006（焦点归还）**：`SidePanelContent` 内部 `lastFocusedRef` + `onOpenAutoFocus` 记录（该事件在 Radix 把焦点移入面板**之前**派发，此刻的 `activeElement` 即触发元素——比 drawer 的 effect 模式时序更准）+ `onCloseAutoFocus` 里 `preventDefault()` 后 `setTimeout` 归还（不用 rAF——后台标签页会挂起，drawer 注释的先例教训）。与 modal.tsx/bottom-sheet.tsx 的库内惯例同款；未导出 `SidePanelTrigger`（台账建议 (a) 与 HIG-AUD-024 的「导出 vs 内部化」决策纠缠，本轮不扩）。
  - **007（noOverlay 语义）**：`DialogPrimitive.Root` 补 `modal={!noOverlay}`——noOverlay 时不锁 body 滚动、不 `hideOthers` 遮蔽外部内容、无焦点陷阱，「页面保持可操作」契约兑现；外点仍触发 `onDismiss`（受控语义：是否真的关闭由消费者决定），不加 sheet 式 `onPointerDownOutside preventDefault`（那是 sheet 的常驻语义，不强加）。`{...rootProps}` 在后：消费者显式传 `modal` 仍可覆盖派生值。
  - 注释块与 `noOverlay` prop JSDoc 同步改写（原「焦点：Radix 默认管理」「页面保持可操作由消费者负责」的错误表述一并修正）。
- **回归**：`tests/side-panel-api.test.tsx` 追加 4 个行为用例（12/12 passed）：Escape / 显式关闭按钮两路径的焦点归还（`activeElement === trigger`）；noOverlay 无 `data-scroll-locked` + 无 aria-hidden 遮蔽 + Escape 仍关闭；默认模式对照（有锁 + 有遮蔽，模态语义保持）。**断言经验**：jsdom 下 react-remove-scroll 不设 `body.style.overflow`（假阳性陷阱），真实锁标记是 `data-scroll-locked` 属性（`styles/index.css:2364` 正是消费它）；Radix 外点（pointerdown outside）在 jsdom 手动 dispatch 下不触发，须真实浏览器验证。
- **真实浏览器核查（临时探针，跑完即删）**：SidePanel 无 docs 路由（024 未决），探针经 vite dev `/@fs/` 绝对路径动态 import harness（dev server root 是 `docs/geist`，URL 相对 root，仓库根文件须 `/@fs/`；点目录 `.scratch` vite 不服务），在真实页面挂载受控面板。双主题（light/dark）结果一致：Escape 后 `activeElement = 触发按钮`；模态模式 `data-scroll-locked: true`；noOverlay 模式 `data-scroll-locked: false` + `elementFromPoint@40%` 命中页面内容 + 外部内容无 aria-hidden + **真实指针外点**触发 onDismiss 关闭。
- **门禁**：`pnpm run typecheck` → exit 0；`vitest run tests/side-panel-api.test.tsx` → **12/12 passed**；docs-layout 不涉及（SidePanel 无路由）。
- **连带面**：HIG-AUD-024（未导出/未注册）未动；R5 根因（「Radix 默认」以偏概全）自此消除一处实例，其余组件既有自实现归还不受影响。

---

## 5F. HIG-AUD-055 修复记录（2026-09-23，移动导航面板三处视觉缺陷）

**来源**：用户实测反馈（2026-09-23，`<lg` 汉堡导航面板展开态截图）——① 关闭按钮重复；② 外框不应有圆角；③ 内部几乎贴着边沿。三项同源（同一面板、同一批次），合并为一条。

- **改动前实测（临时 Playwright 探针 @390×844 / 900×800，双主题）**：
  - **① 关闭入口重复**：`[data-slot="panel-close"]`（面板首行 X，`x=0, y=73.5, 44×44`）与 `[data-slot="hamburger-trigger"]`（topbar 触发按钮，打开态同为 X，`x=0, y=9.5, 44×44`）**x 完全相同**、垂直相距 64px（belowTopbar 面板顶边 = navbar 底边）→ 两个同功能关闭控件上下相邻。原 `showCloseButton` JSDoc 所称「几何与触发前汉堡图标视口重合」是**面板覆盖 topbar**（非 belowTopbar）的形态；belowTopbar 下 topbar 保持可见，重合前提不成立。
  - **② 贴合边圆角**：面板实测 `border-radius` = `tl 0 / tr 6px / br 6px / bl 0`，而 belowTopbar 下顶边贴 navbar 底边、底边贴视口底、左边贴视口左缘——三边贴合，圆角只会在接缝处留下缺口。原 `data-[below-topbar]:rounded-tl-none` 无效（`side=left` 本就无左圆角）。
  - **③ 内容贴边**：`menu-nav` 水平内边距 8px（`px-2`）→ 分组标题 `x=8`、条目高亮块 `x=8`、条目文字左缘 22px；同面板 toolbar 右内边距 16px、桌面 sidebar `px-6`(24px)，移动面板明显更贴边。
- **修复**：
  | 文件 | 改动 |
  |---|---|
  | `src/components/ui/hamburger-menu.tsx` | `renderCloseButton = showCloseButton && !belowTopbar`（belowTopbar 下 topbar 可见可交互，触发按钮即关闭控件）；toolbar 左内边距随关闭按钮取 `pl-0` / `pl-4`；触发按钮补 `aria-label`（打开态 `t("Close menu")` / 关闭态 `t("Menu")`——`HamburgerIcon` 是 `aria-hidden`，此前该按钮**无任何可访问名称**，实测 `aria-label=null`）；`menu-nav` / `menu-results` 水平内边距 `px-2` → `px-4` |
  | `src/components/ui/expand-panel.tsx` | `SIDE_CLASSES.left` 的 `data-[below-topbar]:rounded-tl-none` → `data-[below-topbar]:rounded-none`（含文件头 left 分支说明） |
  | `docs/geist/src/components/docs-shell.tsx` | 不再传 `showCloseButton`；传 `className="[&>[data-slot=panel-toolbar]]:md:hidden"`——≥md 时 topbar 已有搜索/主题/语言入口、slots 无内容，工具行整行隐藏（否则留下 64px 空行）；slots 内容去掉各自的 `md:hidden`（隐藏意图收敛为行级唯一真相） |
- **修复后实测（同探针，双主题 × 双视口，两主题数值完全一致）**：
  - `panel-close` 计数 **0**；触发按钮 `aria-label="Close menu"`（打开态）；
  - 面板四角 `border-radius` 全 **0px**；
  - `menu-nav` padding-left **16px**，分组标题 `x=16`，条目高亮块 `x=16 / 宽 259`（右缘 275，与 toolbar 右端同栅格；改前 8 / 275）；
  - `390` 工具行 `display:flex`（搜索 + 主题 + 语言）；`900` 工具行 `display:none` 且 `menu-nav` 上移至面板顶（`y=64`；改前 128）。
- **回归**：`tests/hamburger-menu-modes.test.tsx`（belowTopbar 抑制关闭按钮 + 触发按钮可访问名随开合翻转 + `menu-nav` 类名断言更新）、`tests/docs-shell-nav-tiers.test.tsx`（**重写**为「关闭控件 = topbar 触发按钮」「工具行是 md 隐藏唯一宿主」——原「close button stays available on all tiers」断言面板内必须有 X，与新契约直接冲突）、`tests/docs-shell-geometry.test.ts`（组装断言由「含 showCloseButton」改为「不含」+ 工具行 md 隐藏）。定向 **6 files / 53 tests 全绿**。
- **门禁**：`pnpm run typecheck` → **exit 0**；`pnpm run lint` → **0 error / 16 warning（存量）**；定向 vitest **6 files / 53 tests passed**；`playwright test tests/e2e/docs-layout.spec.ts --grep "drawer behaviors"` → **3 passed (49.8s)**（768×1024 / 390×844 / 320×700：打开、`aria-current`、长页滚动、Escape 焦点归还、关闭；该用例已有 `panel-close` 计数分支，关闭后自动走 Escape 路径，无需改动）。
- **全量 `pnpm test` 基线对照（重要）**：`8 failed / 221 passed (229 files)`，失败文件 = `tests/audit/{comparator-context, comparator-exemptions, comparator-icon, comparator-provenance, comparator-v3, ledger-comparator, ledger-consumers}` + `tests/showcode-typecheck.test.ts`。**均为既有失败 / flaky，与本轮改动无关**，证据：
  - `git stash` 移除本轮全部改动后重跑这 8 个文件 → **7 failed / 1 passed**（唯一通过者即 `showcode-typecheck`）⇒ 7 个 `tests/audit/*` 在基线下同样失败；
  - `tests/showcode-typecheck.test.ts` 单独复跑 → **1 passed**（fixtures 416 个、`tsc exit 0`、0 错误）⇒ 全量并发下的子进程超时 flaky（交付书 §4 已记录该文件为「已知 flaky」）。
  - 注：交付书 §7 记录的「228 files / 1424 tests passed（exit 0，2026-09-21）」在本次全量重跑中**未复现**；`tests/audit/*` 的 7 文件失败属该日期之后的基线漂移，需后续单独分诊（不在本轮范围）。
- **连带面**：`belowTopbar` 下 `showCloseButton` 语义收窄已写入 props JSDoc（其他消费者若依赖该组合需改用触发按钮）；`side=right` 分支无 below-topbar 定位类（既存不一致，本轮未动，无消费方）。
- **台账落点**：本文件 §5F、矩阵 `:359`、交付书 §1。主报告未登记（与 `054` 同——`054` 的主报告/矩阵补登记仍为交付书 §9 第 9 项未决缺口）。

---

## 5G. HIG-AUD-040 修复记录（2026-09-23，ActivityView 面板可访问名称）

**来源**：交付书批次 C 推荐起手 `037`/`039`/`040` 中改动面最小、验证最直接的一条（纯附加 a11y 属性，不改视觉与交互）。

- **改动前证据（增补 §5B 所记运行确认，2026-09-22）**：面板为 BottomSheet 的 `DialogPrimitive.Content`（`role="dialog"`），`aria-label: null`、`aria-labelledby: null`；内部渲染 `<h2 data-slot="activity-view-title">` 但 `id=""` → 无可访问名称，屏幕阅读器只播报「dialog」。
- **根因（两处）**：
  1. `BottomSheet` 未提供命名能力——Content 上无 `aria-label` / `aria-labelledby`（`bottom-sheet.tsx`）；
  2. `ActivityView` 渲染标题却未生成 id、未关联容器（`activity-view.tsx`）；`title=null` 时更无任何命名来源。
- **修复**：
  | 文件 | 改动 |
  |---|---|
  | `src/components/ui/bottom-sheet.tsx` | 新增可选 `"aria-label"` / `"aria-labelledby"` props（对齐 `drawer.tsx` / `destructive-action-modal.tsx` 的命名透传惯例），落到 `DialogPrimitive.Content`；两者皆不传时渲染行为不变（**向后兼容：现有消费方零行为变化**） |
  | `src/components/ui/activity-view.tsx` | `React.useId()` 生成 `titleId`；标题行 `<h2 id={titleId}>`；BottomSheet 传 `aria-labelledby={title !== null ? titleId : undefined}`、`aria-label={title === null ? t("Share") : undefined}`（置于 `{...sheetProps}` 之前，消费者仍可显式覆盖） |
  | `docs/geist/src/data/component-api.ts` | bottom-sheet 条目登记两个新 props（双语行） |
- **回归**：新增 `tests/activity-view-a11y.test.tsx`（4 用例：默认标题 `aria-labelledby` 指向非空 id 且不双重命名 / 自定义标题 / `title=null` 回退 `aria-label` 且无标题行 / `sheetProps` 转义覆盖仍在）；`tests/bottom-sheet.test.tsx` 追 1 用例（aria 透传 + IDREF 可解析）；`tests/component-api-registry.test.ts` 追 2 断言。定向 **4 files / 30 tests 全绿**。
- **真实浏览器核查（临时探针，跑完即删；390×844 × 双主题）**：`/#/components/activity-view` → Share 按钮打开面板 → `aria-labelledby="_r_e_"` 解析到标题文本「共享」、`aria-label=null`（不双重命名）、**控制台无 Radix「DialogContent requires a DialogTitle」警告**（改动前面板无任何名称，该警告在场）；双主题数值一致；截图确认面板视觉无回归。
- **门禁**：`pnpm run typecheck` → **exit 0**；`pnpm run lint` → **0 error / 16 warning（存量）**；定向 vitest **4 files / 30 tests passed**。文档链：`docs/llm/pages/{zh-CN,en-US}/components/bottom-sheet.md` 的 API 表（`:96`）将因 registry 新增两行产生漂移，并入既有的 3 处暂缓漂移，待解除后 `docs:llm:generate` 一并生成（该命令受 safe-delete 阻断需人工确认，见交付书 §9.7）；指南正文未改——accessibility 段未声称面板名称，不构成矛盾。
- **全量 `pnpm test` 对照（重要）**：`12 failed / 218 passed (230 files)`。与 055 建立的基线（8 failed）差异 4 个文件，**单独复跑全部通过** ⇒ 并发资源型 flaky，与本轮无关：`tests/button-api.test.ts`（扫描消费者 variant 用法的用例全量下 15.3s、单跑毫秒级通过）、`tests/audit/evidence-v2.test.ts`（git/hash 遍历用例全量下 18.4s、单跑通过）、`tests/llm-task-runner.test.ts` 与 `tests/pre-push-orchestrator.test.ts`（交付书 §4 已记录为已知 flaky）。7 个稳定基线失败（`tests/audit/comparator-*` / `ledger-*`）不变——根因已确认为这些用例 `execFileSync("python", …)` 调用对比脚本（环境类，`ledger-consumers.test.ts:125/146/177` 等）。
- **连带面**：`bottom-sheet` 示例与 `app-shell-demo` 的面板未自行命名（能力已提供，属消费者责任，本轮不扩）；HIG-AUD-016（MultiSelect 无名 dialog）为同类系统性问题，未动。
- **台账落点**：本文件 §5G、矩阵 P 清单、交付书 §1 + §2。

---

## 5H. HIG-AUD-039 修复记录（2026-09-23，Toolbar 折叠状态透传与混合内容组）

**来源**：交付书批次 C 推荐起手（`037`/`039`/`040`；`040` 已于同日修复，见 §5G）。同代码面顺带闭环 **HIG-AUD-050**（Fragment 展平，P3）。

- **改动前证据（增补 §5B 运行确认，2026-09-22）**：320px 折叠后 6 个溢出项**全部丢失** `aria-pressed` / `data-active` / `disabled`；`CollapsedItem` 仅携带 `label/icon/onSelect`，收集器只认 `node.type === ToolbarItem`。
- **根因（三处，同一代码面）**：
  1. **状态丢失**：溢出菜单项不带 `disabled` / `active` → 「界面禁用、菜单可点」与「选中态消失」的分裂；
  2. **混合内容组静默消失**：`ToolbarGroup` 折叠时整组 `return null`，而收集器只认 ToolbarItem → 组内搜索框 / MenuButton / 自定义控件既不可见也无溢出入口；
  3. **Fragment 不展平（= HIG-AUD-050）**：`React.Children.forEach` 不递归 → `<>…</>` 包裹分组或条目时收集失败。
- **修复（`src/components/ui/toolbar.tsx`）**：
  | 缺陷 | 改动 |
  |---|---|
  | ① 状态透传 | `CollapsedItem` 增 `disabled` / `active`；收集时复制；溢出项渲染 `disabled={item.disabled}`、`data-active`、`aria-current="true"`（active）与常驻高亮 className（溢出菜单是命令菜单、非 stateful，故不走 `MenuItem` 的 active 机制） |
  | ② 混合内容组 | 新增 `isCollapsibleGroup()`：显式 `collapsible` 优先；未指定时仅当组内全部是 ToolbarItem 才折叠。收集器与 `ToolbarGroup` 渲染共用同一判定；**`ToolbarGroup` 函数签名的 `collapsible = true` 默认值必须移除**——否则两处输入不一致（本轮实测踩坑：收集器读原始 props=undefined、组件读解构值=true → 组被折叠且溢出菜单为空） |
  | ② 补充 | 显式 `collapsible={true}` 且组内含非 ToolbarItem 内容 → `import.meta.env.DEV` 下 `console.warn`（对齐 device.tsx 先例），不再静默消失 |
  | ③ Fragment | 新增 `flattenChildren()`（递归展平 Fragment / 数组），收集器顶层与组内均改用；`hasOnlyToolbarItems()` 同基于展平结果 |
- **回归**：新增 `tests/toolbar-collapse.test.tsx`（6 用例，jsdom + mock ResizeObserver/布局触发折叠）：溢出项保留 disabled/active、点击禁用项不触发 onSelect、混合组默认常驻且无溢出入口、显式 `collapsible={false}` 对照、Fragment 包裹收集、显式折叠 + 混合内容 dev 告警。`tests/toolbar-api.test.ts` 源码契约同步（新增 039/050 两组断言，原 `if (groupProps.collapsible === false) return;` 断言更新为 `isCollapsibleGroup`）。定向 **3 files / 19 tests 全绿**。
- **真实浏览器核查（临时探针，跑完即删；320×700 × 双主题）**：`/#/patterns/app-shell` 折叠后溢出菜单 **6 项**（同页 `[role="menuitem"]` 查询另有 3 项为 MenuBar 顶级触发器——038 已记录该 role 实况）；**`网格视图` 项 `data-active="true"` + `aria-current="true"`**（修复前该项状态在菜单中完全丢失），其余项正确为 null；双主题一致；截图确认 active 项在菜单中带常驻高亮。
- **门禁**：`pnpm run typecheck` → **exit 0**；`pnpm run lint` → **0 error / 16 warning（存量）**；定向 vitest **3 files / 19 tests 全绿**。文档链：guides-05（zh/en）的 accessibility 与 responsiveBehavior 段同步新契约；`component-api.ts` 的 `collapsible` 行改述（默认按内容决定，去掉 `defaultValue: "true"`）→ `docs/llm/pages/{zh-CN,en-US}/components/toolbar.md` 将产生漂移，并入暂缓集合（同 §5G 说明）。
- **连带面**：**HIG-AUD-050 随本轮一并闭环**（同代码面）；`013`（ToolbarItem 32px 触控目标）未动；`025`（溢出菜单空态）未动；`041`（toolbar-api 源码字符串契约）顺势补强为 039/050 的契约断言。
- **台账落点**：本文件 §5H、矩阵 `039`/`050` 行、交付书 §1 + §2。

---

## 5I. HIG-AUD-037 修复记录（2026-09-23，破坏性项「红字 + 二次确认」成对）

**来源**：交付书批次 C 推荐起手最后一条（`037`/`039`/`040` 三条至此全部闭环）。

- **改动前证据（主报告 §4.2 + 增补运行确认 2026-09-22）**：`destructive` 只做红字，`onSelect` 直接执行；运行确认点「屏蔽用户」→ `dialogCount: 0`、日志直接记录；三处示例（Quick Actions / ActivityView / pull-down）全部示范「直接执行」。
- **HIG 依据（`pull-down-buttons.md`）**：破坏性项需「红字 + 请用户确认意图」——确认应出现在**菜单之外的异位**且需刻意关闭（action sheet / alert），「help people avoid losing data by mistake」。
- **方案裁决（本轮定案）**：**不内建确认浮层**，采用「组件只给红色语义 + 消费方串接确认 + 示例演示 + JSDoc/指南写明约定」：
  1. HIG 允许 action sheet **或 alert**，形态选择应留给消费方；
  2. 仓库既有 `DestructiveActionModal` 的 `verificationPhrase` 为**必填**（输入资源名的高门控），不适合「移除 App」级确认，内建会把语义与形态一起锁死；
  3. 内建需在 Radix 菜单卸载后维持浮层（状态提到 Root + 新依赖），复杂度与耦合不成比例。
  台账原建议的「至少让 examples 演示确认流程」即本方案下界，本轮取「示例 + 组件 JSDoc 契约 + 三处指南」完整形态。
- **改动**：
  | 文件 | 改动 |
  |---|---|
  | `docs/geist/src/examples/context-menu/quick-actions-8d41b0e7.example.tsx` | Remove App → 打开 Modal 确认（标题/描述/取消/红色确认按钮）；取消不动、确认才 `setLog` |
  | `docs/geist/src/examples/activity-view/default-9e4c2b57.example.tsx` | Block User → 面板关闭（一次性活动）+ Modal 确认；同上两路径 |
  | `src/components/ui/context-menu.tsx` | `ContextMenuQuickActionsItem.destructive` JSDoc：组件只负责红色语义，确认由消费方在 `onSelect` 串接（菜单之外、可取消） |
  | `src/components/ui/activity-view.tsx` | `ActivityAction.destructive` 同款 JSDoc |
  | `src/components/ui/split-button.tsx` | `SplitButtonMenuItemProps.menuItemProps` JSDoc 补破坏性约定（`type: "error"` 红字 + 消费方确认），覆盖 pull-down 变体 |
  | guides-04 / guides-05 / guides-13（zh+en） | accessibility 段补「破坏性项需二次确认」条；context-menu 示例描述补「点击后先弹确认浮层」 |
- **回归（永久）**：新增 `tests/e2e/quick-actions-destructive-confirm.spec.ts`（2 用例，真实浏览器）：① Quick Actions —— 右键唤起 → 破坏项**红字断言**（`rgb(238, 0, 0)`）→ 点击弹确认（未确认前状态不变）→ **取消**后状态不变 → 再次**确认**后才写入结果；② ActivityView —— 点破坏操作 → 面板关闭 + 确认浮层出现 → 取消无副作用 → 确认后写入结果。实测 **2 passed (29.6s)**。
- **双主题视觉核查（临时探针，跑完即删）**：Modal 确认浮层双主题形态正确（标题/描述/取消左·红色破坏动作右）。**探针踩坑**：ActivityView 面板本身即 `role="dialog"`，退场动画期间与 Modal 共存 → `[role="dialog"]` 严格模式冲突，须用 `[data-slot="modal-content"]` 精确定位（永久 e2e 因先等面板卸载故不受影响）。
- **门禁**：`pnpm run typecheck` → **exit 0**；`pnpm run lint` → **0 error / 16 warning（存量）**；定向 vitest（styleguide-examples / quick-actions-api / activity-view-api）**3 files 全绿**；e2e **2 passed**。文档链：guides-04/05/13 双语 + 两个示例 → `docs/llm` 的 context-menu / activity-view / split-button 页将产生漂移，并入暂缓集合（同 §5G/§5H）。
- **连带面（未动）**：`split-button` 的 pull-down 示例未新增破坏性项（037 未涉及；矩阵 `:212` 记为「pull-down 变体本条未审核」），约定已写入其 JSDoc 与指南；`031`（破坏色 token）未动——本轮 e2e 把 `text-[#ee0000]` 红字固化为断言的一部分，token 化时需同步该断言。
- **台账落点**：本文件 §5I、矩阵 `037` 行、交付书 §1 + §2。

---

## 5J. HIG-AUD-013 修复记录（2026-09-23，触屏命中区 ≥44×44）

**来源**：交付书批次 C 推荐起手收敛后的首条（横跨 11 个组件）。

- **改动前证据（主报告 §4.2 013 表 + 增补扩充）**：MenuItem 36px、DotsMenu 触发 32px、Select 项 36px、MultiSelect 行 28px、Toast 关闭 24px / action 32px、ThemeSwitcher 24/32px、汉堡搜索清除 28px、DestructiveActionModal 按钮 32px、EditMenu 胶囊 28px；增补扩充：MenuBarTrigger 28px、ToolbarItem 32px。主报告方向「视觉尺寸不变 + 命中区外扩」；验收「e2e 在 320/390 断言 ≥44×44」。
- **方案裁决（触屏媒体查询）**：
  - 密集行布局（菜单/列表项）**不能**用伪元素外扩——相邻项命中区会重叠（行距 28–36px < 44px），制造误触；伪元素模式只适用于四周有余量的独立控件（`multi-select.tsx:240`、`slider.tsx:280` 先例）。
  - 采用 `pointer-coarse:` 变体：**触屏下 `min-h-11`/`min-w-11` 抬到 44×44，桌面维持 Geist 原视觉**。依据：HIG 44pt 针对触屏；WCAG 2.5.8（AA）桌面仅需 24×24，36px 菜单项已达标——无条件放大既偏离 Geist 规范也无据。
  - 实测（临时探针）：Playwright **`hasTouch: true` 即触发 `(pointer: coarse)`**（**无需 isMobile**，避免移动 UA 副作用）；桌面 context 为 `fine`。
  - 命中区统一 44 档：行类只补高度；短标签/图标/胶囊同时补宽度（实测 MenuBarTrigger「编辑」仅 **35.7px** 宽，只补高度不达标）。
- **改动（13 处声明 / 11 个组件文件）**：`menu.tsx`(MenuItem)、`dots-menu.tsx`(触发)、`select.tsx`(触发器三档 + Item，4 处)、`multi-select.tsx`(行 + 触发器)、`toast.tsx`(action + 关闭)、`theme-switcher.tsx`(24/32px 圆形)、`destructive-action-modal.tsx`(确认主按钮)、`edit-menu.tsx`(胶囊)、`menu-bar.tsx`(Trigger)、`toolbar.tsx`(Item)、`hamburger-menu.tsx`(搜索清除)——行类 `pointer-coarse:min-h-11`；短标签/图标按钮 `pointer-coarse:min-h-11 pointer-coarse:min-w-11`。
- **回归**：
  - **源码契约** `tests/touch-targets-contract.test.ts`（15 断言）：逐组件锁定声明 + 仅允许 44 档 + 多处覆盖计数（Select ≥4 / Toast ≥2 / MultiSelect ≥2）；
  - **e2e 门禁** `tests/e2e/touch-targets.spec.ts`（**9 用例 → 9 passed (33.6s)**）：触屏 context 实测 `boundingBox` ≥44×44——宽视口（1024 / iPad 形态）覆盖 ToolbarItem / MenuBarTrigger / MultiSelect 触发器 / Select 触发器 / ThemeSwitcher / DotsMenu / 菜单项 / MultiSelect 行（下拉内）；窄视口（390）覆盖 Toolbar 折叠后的溢出菜单项。
- **门禁**：`pnpm run typecheck` → **exit 0**；`pnpm run lint` → **0 error / 16 warning（存量）**；契约测试 **1 file passed**；e2e **9 passed (33.6s)**；双主题视觉核查（触屏形态截图，跑完即删）通过——菜单项/工具项更高、更接近 iOS 观感，暗色正常。
- **e2e 踩坑（已写入 spec 注释）**：
  1. **`actionTimeout` 必须显式设置**——项目 config 未设（默认 0 = 无限），元素缺失时 `boundingBox()` **无限等待**并撞满 15 分钟用例上限（首轮实测：第一个用例卡满 15.0m）；
  2. **视口选择**：窄屏（390）下 Toolbar 项移入溢出菜单 → `toolbar-item` 不存在，静态测量必须在宽视口做；
  3. **Radix 浮层 zoom-in 动画**：菜单项在中间帧实测 42.5 / 43.4px（<44）→ 测量前等动画收敛（600ms）；
  4. docs 站汉堡面板传 `disableSearch` → `search-clear` 在该路径不可达，其命中区由源码契约覆盖。
- **连带面（未动）**：`029`（移动断点零散，与 013 共享 R8 根因）未动；`027`（Select 缺移动贴底形态）未动——主报告路线 2.5「触控目标统一策略」原依赖 027 的形态决策，本轮以「桌面视觉零变化 + 触屏命中区提升」**绕开该依赖**，无需等 027；`031`（破坏色 token）未动。
- **台账落点**：本文件 §5J、矩阵 `013` 相关行、交付书 §1 + §2。

---

## 5K. HIG-AUD-009 / 011 / 012 修复记录（2026-09-23，浮层 token 化三件套）

**来源**：交付书批次 C 推荐起手（z-index / 退场动画 / 动效 token——三件套受影响面高度重叠，合并一轮处理）。**基线校正**：三条目自 2026-09-18 审核后代码已漂移——Select / EditMenu / Toast 的退场与时长在既往修复中已 token 化，本轮复核实况而非台账原判。

- **修复（z 层级，009）**：
  - `destructive-action-modal.tsx` 遮罩 + 卡片 `z-50` → `z-[var(--uni-z-modal)]`（与 `modal.tsx` 同族；台账「本应同族却左右不一致」项闭环）；`command-menu.tsx` 遮罩 + 面板 `z-100` → `z-[var(--uni-z-modal)]`（dialog 类）；
  - `context-menu.tsx` `ContextMenuContent` 补 `z-[var(--uni-z-popover)]`（**决策**：内容可在 drawer/modal 内被唤起，menu 带 50 会被容器遮罩 200/300 覆盖；与同文件 QuickActions 内容 2001 对齐）；`multi-select.tsx` 内容补 popover 带；`feedback.tsx`、`relative-time-card.tsx` `z-50` → popover 带；`calendar-classes.ts` 组合框 `z-[99999999]` → popover 带；
  - `index.css` context-card-tip `z-index: 999999999` → `var(--uni-z-context-card)`（弹层内部局部堆叠，computed 等效）；新增 `--uni-z-header: 40`（navbar 既有回退值的显式化；navbar 消费保留 `,40` 回退，不破坏既有锁定测试）；z token 组注释补**层级序**与**「遮罩 vs 内容」配对约定**（009 建议项）。
- **修复（退场镜像，011）**：`menu.tsx`、`menu-bar.tsx`（`MENU_BAR_SURFACE`，含增补扩充的 MenuBar / pull-down 连带面）、`context-menu.tsx`（标准 Content + `QUICK_ACTIONS_CONTENT_CLASS`）、`multi-select.tsx` 退场补 `data-[state=closed]:zoom-out-95`；`relative-time-card.tsx` 补整套退场（`animate-out` + `fade-out-0` + `zoom-out-95`——原为仅有入场）。
- **修复（时长/缓动 token，012）**：`menu` / `menu-bar` / `context-menu` / `multi-select` 一律补 `duration-(--uni-duration-fast)`（对齐 select / feedback / edit-menu 既有族规）；`destructive-action-modal.tsx` 遮罩与卡片补 `duration-(--uni-motion-overlay) ease-pop`（对齐 modal，含台账「300ms 族左右不一致」闭环）；`context-card.tsx` 补 `duration-(--uni-duration-base)`（hover 卡片族，与 relative-time-card 同档）；`bottom-sheet.tsx` `duration-300` + 内联 `height 300ms` → `var(--uni-motion-overlay)`（overlay 档 350ms，与拖拽吸附仍同档）；`responsive-drawer.tsx` 内联 `height 300ms` 同迁；`drawer.tsx` 内联 `transform 500ms` → `var(--uni-motion-expansive)`（同值替换）；`index.css` command-menu 工具类 `0.3s`→`var(--uni-motion-overlay)`、`0.4s`→`var(--uni-motion-expansive)`、遮罩曲线 `ease-out/ease-in`→`var(--ease-pop)`（与 modal 遮罩统一）；`sheet.tsx` 官方对齐的 `transition ease-in-out` 走**内建显式化**路径——`index.css` 新增 `--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)`（与 Tailwind v4 内建值严格相等，声明后纳入项目 token 真源，computed 零变化、类名与官方实测字符串不变）。
- **棘轮账本清账**：`tests/audit/motion-duration-allowlist.json` 移除 `0.3s`、`0.4s`、`300ms`（bottom-sheet + responsive-drawer）、`500ms`（drawer）四条冻结账目（12 → 7 条）。
- **回归**：
  - 治理测试扩展：`layer-tokens.test.ts`（header token 声明 + 消费矩阵 7 项 + 裸字面量移除 5 项 + tip 字面量收敛）、`duration-tokens.test.ts`（「浮层动画必须引用时长 token」15 文件矩阵 + 3 处内联 transition + command-menu 工具类无 `0.3s/0.4s`）、`ease-tokens.test.ts`（5 曲线 token，含 `--ease-in-out` 显式化断言）；
  - 组件测试：`menu-surface`（退场镜像 + fast 档）、`menu-bar-api`、`context-menu-api`、`multi-select-api`、`relative-time-card`、`context-card-api`、`command-menu-api`（双 z 断言）、`destructive-action-modal-state`（z 计数 2 + overlay/motion token）、`bottom-sheet`（**motion 审核 §9 遗留**：`duration-300` 硬断言随迁移更新为 `duration-(--uni-motion-overlay)`）；
  - 定向 vitest：**23 files / 184 tests passed**（含全部治理棘轮与 `motion-duration-governance` 双向棘轮）。
- **真实浏览器核查（临时 Playwright 探针，跑完即删；双主题各一轮）**：computed 实测——menu `z-index 50 / animation-duration 0.15s`；destructive-action-modal 卡片与遮罩 `z-index 300 / 0.35s / ease-pop(cubic-bezier(0.175, 0.885, 0.32, 1.1))`；multi-select `z-index 2001 / 0.15s`；command-menu 遮罩与面板 `z-index 300 / 0.35s`；relative-time-card 与 feedback `z-index 2001`；context-menu 内容 `z-index 2001`。退场经 `animationstart` 事件实测（tw-animate 退场统一 `animation-name: exit`、zoom 经 `--tw-exit-scale` 变量表达）：menu / multi-select / context-menu / hover-card 退场 `--tw-exit-scale` 均生效（zoom 镜像真实存在）、modal 内容 `exit@destructive-action-modal` 0.35s、command-menu 走 `command-menu-scale-out`。双主题截图（menu / destructive modal / command-menu）人工目检无异常。
- **门禁**：`pnpm run typecheck` → exit 0；定向 vitest 全绿；`typecheck:tests` 按基线对照（命中项均为存量 `TS7017`（`globalThis.IS_REACT_ACT_ENVIRONMENT`），无新增）。
- **连带面（未动）**：`044`（MenuBar z=50 与子菜单碰撞溢出）保持独立——层级议题与 009 同源但含溢出/翻转设计决策；~~`010`（背板 5 种写法）未动~~ → **已随 §5L 修复（2026-09-23）**；`dominant`「menu 独立带」语义锁保持不变（测试中显式锁定）。
- **台账落点**：本文件 §5K、主报告 §4.2 三条目 + §1.2 P1 行、矩阵 `009`/`011`/`012` 行与 `:228`/`:300`、motion 审核 §4/§8/§9、交付书 §1/§2/批次 C/§6。
- **提交状态**：实现与测试已由 `8d528b8` 提交（`fix(components): 浮层 z 层级/退场镜像/动效时长 token 化（HIG-AUD-009/011/012）`，27 files / +198 / −64）；本文件与其余台账随同名 docs 提交入库。

---

## 5L. HIG-AUD-010 / 019 修复记录（2026-09-23，遮罩两族 token + reduced-motion 真实覆盖）

**来源**：交付书批次 C 推荐起手（010/019 与已闭环的 009/012 同族）。**基线校正（关键）**：两条目的原始证据都有失真——010 的「5 种写法」被读作「同一角色的重复写法」，实际是**两种有官方出处的遮罩角色**；019 的「28 个文件包含 motion-reduce」实为**虚假覆盖**（根因见下）。

- **010 方案裁决（两族并行，不做「全迁」）**：官方实测出处 —— `backdrop` 族（表面洗色 `#f2f2f2` light / `#000` dark @ 0.8）源自官方 Modal scrim（2026-08-15 live computed，独立 backdrop 元素）与官方 Sheet overlay（`--ds-overlay-backdrop-color`）；`scrim` 族（暗化 `rgba(0,0,0,.4)`）源自官方 Drawer overlay（2026-08-13 live computed）。照条目原建议「全迁 backdrop 族」会让 Drawer 光模式由「暗化 40%」变「近白洗色 80%」，破坏官方 parity → 裁决为两族各自成族、写法收敛到 token，并同步修订验收口径为「族内一致 + 组件层无字面量」。
- **010 实现**：
  - `index.css` 新增 `--uni-overlay-scrim-color: rgb(0 0 0 / 40%)`（暗化族；**alpha 内联在颜色里**——本族消费者 `quick-actions` 遮罩与 `destructive-action-modal` 带 `backdrop-filter`，元素 `opacity<1` 会把模糊按组一起降透明）与合成色 `--uni-overlay-backdrop`（`color-mix(in oklab, <color> calc(<opacity> * 100%), transparent)`，自动跟随两值，专供 `modal`——其 `Dialog.Content` 是 `Overlay` 的**子节点**，用元素 `opacity` 会把内容一起降透明）；族注释写明出处、消费者清单、`command-menu` 例外与「模糊是显式开关」。
  - 迁移（computed 零变化）：`drawer.tsx:221`、`bottom-sheet.tsx:170`、`responsive-drawer.tsx:257`、`expand-panel.tsx:130`、`context-menu.tsx:209` 的 `bg-black/40` 与 `modal.tsx:58` 的字面量；`destructive-action-modal.tsx:119` 由 `bg-black/50` 并入 scrim 族 0.4（**唯一刻意的观感变化**，该 50% 无出处）。
  - 注释同步（条目明确要求）：`drawer.tsx:19-21`、`bottom-sheet.tsx:14-15`、`side-panel.tsx:23-26`、`modal.tsx:13-18`、`command-menu.tsx:46-48`。
- **019 根因（本轮新发现，须回填审核口径）**：`data-[state=open]:animate-in[data-state="open"]` 的 specificity 为 **0,2,0**，高于单类名 `motion-reduce:animate-none`（0,1,0）→ 22 个 tw-animate 浮层的「组件级 reduce 类」**一直是空操作**，实际只有全局兜底（`animation-duration: 0.01ms !important`）在起作用。探针最小复现（reduce 模拟已生效）：plain → `animation-name: enter`；`motion-reduce:animate-none!` → `none`；过渡侧 plain `motion-reduce:transition-none` → `transition-property: none`（单类名，**无需** important）。**旁证**：`skeleton.tsx:92`、`expand-panel.tsx:160` 沿用 Tailwind v3 前缀写法 `motion-reduce:!animate-none`——实测在本版 Tailwind 下仍会生成规则（不致命），已统一到末尾形式。
- **019 实现**：22 个 tw-animate 浮层文件（modal / sheet / drawer / bottom-sheet / responsive-drawer / side-panel / expand-panel / destructive-action-modal / context-menu / context-card / menu / menu-bar / select / multi-select / combobox / tooltip / toast / edit-menu / calendar / feedback / relative-time-card / loading-dots）+ `skeleton` 统一 `motion-reduce:animate-none!`；审计点名缺口 `theme-switcher.tsx:54`、`combobox.tsx:114,117` 补 `motion-reduce:transition-none`；**`drawer` 面板缺口经复核不成立**（`drawer.tsx:142` 早有 reduce 类，属审核行号漂移）。
- **回归**：
  - 新增 `tests/overlay-backdrop-tokens.test.ts`（6 用例）、`tests/reduced-motion-coverage.test.ts`（5 用例，分桶 A/B/C/D/E：A 21 个组件级浮层必须带 kill switch、B command-menu 样式表兜底块与 keyframes 存活、C 点名过渡缺口、D JS 门控 3 文件、E 组件级免动画清单 13 项 + 全局兜底 4 条声明冻结）；
  - 新增永久 e2e `tests/e2e/reduced-motion.spec.ts`（**8 passed (47.6s)**：`page.emulateMedia({reducedMotion:"reduce"})` 下 modal 遮罩/内容、quick-actions 遮罩与菜单、bottom-sheet 面板、command-menu 遮罩/面板 computed `animation-name === "none"`，且打开/关闭/输入功能正常）；
  - 同步更新断言旧写法的既有测试：`modal-api`、`drawer-api`、`expand-panel`、`quick-actions-api`、`side-panel-api`、`bottom-sheet`、`responsive-drawer`、`relative-time-card`、`menu-surface`、`menu-bar-api`、`visual-fixes-regression`、`skeleton-motion`、`destructive-action-modal-state`；`tests/audit/raw-color-allowlist.json` 清 `#f2f2f2 @ modal.tsx`（陈旧条目棘轮）。
- **真实浏览器核查（临时探针，跑完即删；双主题 12 passed）**：① 旧写法展开与 token **渲染像素逐字节等价**（同底色色块截图比对，不依赖序列化字符串）；② CSSOM 采集到 `.motion-reduce\:animate-none\!` 规则（`@media (prefers-reduced-motion: reduce)` 内 `animation: … none !important`）；③ 真实 DOM 族内一致——`bottom-sheet` 与 quick-actions 遮罩同为 `rgba(0, 0, 0, 0.4)`（后者 `backdrop-filter: blur(8px)`）；④ modal 遮罩 `oklab(0.961145 … / 0.8)`（light）/ `oklab(0 0 0 / 0.8)`（dark）、元素 `opacity: 1`、卡片 `rgb(255,255,255)` / `rgb(10,10,10)`（未被降透明）；⑤ 几何：遮罩 1280×720 满覆盖、卡片中心 (640,360) 精确居中。
- **门禁**：`pnpm run typecheck`（`tsc -b`）exit 0；`pnpm run lint` 0 errors / 16 warnings（存量）；定向 vitest **18 files / 112 tests passed**；e2e **8 passed**；审计验收 grep（`bg-black/4|bg-black/5|bg-[#f2f2f2]` in `src/components/ui`）为空。
- **全量回归对照**：`pnpm run test` → exit 1，`Test Files 8 failed | 226 passed (234)` ＝ 文档基线（7 个 `tests/audit/*` 环境类 + 并发 flaky）。**首轮抓出并修复了本会话引入的 2 处回归**：① `tests/token-namespace.test.ts`（`index.css` 族注释含退役 `--ds-*` 前缀——该测试全量扫 `src/` 且**不忽略注释**）；② `tests/modal-typography-geometry.test.ts:68`（锁旧字面量）→ 修复后单跑 2 passed；`tests/button-api.test.ts` 单跑 1 passed（并发 flaky，非回归）。
- **环境教训（写入探针范式）**：① `test.use({ reducedMotion: "reduce" })` 在本项目配置下**不生效**（探针实测 `matchMedia(…).matches === false`），必须用显式 `page.emulateMedia()`，否则断言会在「无模拟」下假失败并掩盖真实结论；② Playwright 重试会换 worker，探针用模块级对象 + `afterAll` 落盘会丢掉其他 worker 的证据，须**每条记录即时落盘**；③ 半透明色块的像素比对必须叠在**同一不透明底色**上，否则会因页底内容不同而假失败。
- **文档链**：本轮只改组件内部类名与 CSS token，无 props / API / 示例 / 路由变化 → `docs/geist/src/data` 与双语 guides 无需同步；LLM 语料按交付书批次 G 仍**暂缓**（`docs:llm:check` 的 3 处既有漂移与本轮无关）。
- **台账落点**：本文件 §5L、主报告 `010`/`019` 条目（标题 + 验证状态 + 修复记录）、矩阵 `:229`/`:232`/`:150-154`/`:318`/`:327`、motion 审核 §5/§8、交付书 §1/§2/批次 C/§7.3/§9/§10。

---

## 5M. HIG-AUD-008 修复记录（2026-09-23，i18n 缺 key + 键集同构）

**来源**：交付书批次 C 推荐起手（`008`，独立、低风险）。**基线校正**：条目三处行号已漂移（`hamburger-menu.tsx:242/287` → 实测 `:234`/`:278`/`:324`；`grabber.tsx:32` → `:45`），key 本身缺失的属性不变。

- **补齐 3 个 key**（`src/lib/framework-messages.ts`，en/zh **双侧就近插入并保持行序镜像**）：
  - `"Close menu"` → zh `关闭菜单`（消费点 `hamburger-menu.tsx:234` 触发按钮展开态名称、`:278` 面板关闭按钮）；插入在 `Menu` 之后；
  - `"Ctrl K"` → 两侧同值 `"Ctrl K"`（消费点 `hamburger-menu.tsx:324` 的 `<kbd>` 快捷键提示；快捷键字面量按仓库既有惯例不翻译，与 `"JSON {type}": "JSON {type}"` 同类）；插入在 `"Press Command K to open the Command Menu"` 之后；
  - `"Resize height"` → zh `调整高度`（消费点 `grabber.tsx:45`）——**key 由中文写法改为英文写法**，修正「英文站显示中文」；插入在 `"Scroll right"` 之后（直接操纵类把手/滚动标签同族）。
- **根因修复（键集同构，条目建议方向）**：`framework-messages.ts` 新增 `export type FrameworkMessageKey = keyof typeof FRAMEWORK_MESSAGES.en;`；`i18n.tsx` 把 locale 消息表在**实现处**注解为 `Record<FrameworkMessageKey, string>`（并让 `fallback` 复用同一类型）→ 任一 locale 缺 key（含拼写差异）**立即是编译错误**，不再依赖人工同步。
- **回归**：
  - `tests/component-i18n-source.test.ts` 新增 3 用例：① `en`/`zh-CN` 键集**双向相等**（运行期双保险）；② 钉住本条目 3 个 key 存在于两个 locale；③ **全 `src` 扫描 `t("…")` 字面量 key 必须存在于两个 locale**——补齐了原守卫只查「裸 JSX 文案」、从不查 `t()` key 是否存在的缺口（正是 3 个 key 漏过的原因）；扫描含条件表达式分支（`t(playing ? "Pause video" : "Play video")`）与模板前缀族（`` t(`JSON ${node.type}`) `` → 必须有同前缀 key），并带**收集器健康度断言**（扫到的 key 数 > 50）防止空过。
  - `tests/framework-i18n.test.tsx` 新增 grabber 双语言渲染断言（默认 en `Resize height` / zh `调整高度`）；`tests/grabber.test.tsx:31` 的旧中文断言更新为英文默认值。
  - 全 `src` 扫描结论：**本条目的 3 处即全部缺失项**（无其他缺 key、无前缀孤儿）。
- **守护有效性（变异测试，2026-09-23）**：临时删除 zh 的 `"Close menu"`，三道守护同时报警——① `tsc -b`：`src/lib/i18n.tsx(36,11): error TS2322 ... is not assignable to type 'Record<…>'`；② 键集同构用例：`zh-CN 缺失的 key: expected [ 'Close menu' ] to deeply equal []`；③ 调用点扫描：`src/components/ui/hamburger-menu.tsx: "Close menu" 不在 zh-CN`（2 处调用点）。恢复后 `typecheck` exit 0、13 files passed。
- **运行确认（临时探针，跑完即删，4 passed (26.8s)）**：① `/components/bottom-sheet` 打开 `Open Deployment Actions` → `[data-slot="grabber"]` 的 `aria-label` 实测 zh-CN `调整高度` / en-US `Resize height`；② 文档站 768×1024（<lg，汉堡可见）展开导航面板 → 触发按钮 `菜单`→`关闭菜单`（zh）/ `Menu`→`Close menu`（en），面板 `textContent` 无 key 原文回显。**覆盖说明**：该面板未渲染搜索行（`showCloseButton` 分支同理未渲染 `panel-close`），故 `"Search"`/`"Search…"`/`"Ctrl K"` 仅由键集同构 + 静态扫描守护，无浏览器级证据（`"Ctrl K"` 两侧同值，浏览器断言本身不具区分度）。
- **门禁**：`pnpm run typecheck`（`tsc -b`）exit 0；`pnpm run lint` **0 errors / 16 warnings（存量，与上轮一致）**；定向 vitest **13 files / 80 tests passed**（含 `component-i18n-source`、`framework-i18n`、`i18n-remaining`、`i18n-controls`、`feedback-i18n`、`grabber`、`hamburger-*` 5 文件、`docs-i18n`/`docs-i18n-parity`）；全量 `pnpm run test` → exit 1，`Test Files 8 failed | 226 passed (234)` ＝ 文档基线（7 个 `tests/audit/*` 环境类 + `button-api` 并发 flaky），**无新增回归**。
- **已知限制（写入交付书 §9）**：编译期约束覆盖「locale ↔ locale」漂移；「组件 ↔ key」漂移由静态扫描在**测试期**守护——`t()` 参数**未**收窄为键集，因为现有 5 处动态 key 调用（`t(topicName)`、`t(label)`、`t(menuButtonLabel)`、`t(STATUS_LABELS[state])`、`` t(`JSON ${node.type}`) ``）会被误伤，需先改造调用点类型（后续可选债务）。
- **文档链**：未改 props/API/示例/路由；`docs/geist` 双语 guide 与 LLM 语料不涉及（语料按批次 G 仍暂缓）。
- **台账落点**：本文件 §5M、主报告 `008` 条目（标题 + 验证状态 + 修复记录）、矩阵 `:137`/`:196`/`:316`、交付书 §1/§2/批次 C/§7.4/§9/§10。

---

## 5N. HIG-AUD-017 修复记录（2026-09-23，导航即关闭浮层）

**来源**：交付书批次 C 推荐起手（`017`/`018` 中的机制性一条）。**基线校正**：条目行号已漂移（`hamburger-menu.tsx:358` → 实测列表项在 `:379-402`），key 事实不变；另经 subagent 取证确认「库内 `href` 条目**无任何显式关闭代码**，依赖 Radix `Item` 的 select 语义」。

- **组件层契约修正（审计明确要求的「至少为带 href 的菜单项在选中后关闭」）**：`hamburger-menu.tsx:379-395` 的导航列表项点击此前只调 `onNavigate`、**不关面板**（与同文件搜索结果项 `:466-469` 以及 prop 注释「随后关闭面板」都不一致）→ 现统一「激活即关闭」，并按 `sidebar-nav.createNavigateHandler` 的既有语义**保留修饰键 / 中键**（新标签页意图不关面板）；`onNavigate` 的调用时机保持不变（不改消费方导航链路——文档站正是靠它交给 react-router）。
- **库层「可选路由感知」（条目建议方向）**：新增 `src/lib/navigation.ts` 导出 `useDismissOnNavigate(onDismiss, enabled?)`——监听 `hashchange` + `popstate`，**不耦合任何路由库**（库不能假设消费方用 react-router / next / 自研路由），内部用 ref 转发保证始终调最新闭包；并从 `src/lib/index.ts` 导出。**库内浮层默认不自动关闭**（保持既有行为，AGENTS.md「除非任务要求否则不改运行时行为」），由消费方显式接入。
- **文档消费方接入**：`docs/geist/src/components/docs-shell.tsx`（汉堡面板 `setMenuOpen(false)`）与 `docs/geist/src/App.tsx`（命令面板 `setCmdOpen(false)`）各一行 → 覆盖前进/后退、程序化 navigate、浮层外链接等**没有点击回调**的路由变化。
- **回归**：
  - `tests/hamburger-menu-groups.test.tsx` 新增 2 用例：分组条目激活 → `onNavigate(to)` 且 `onOpenChange(false)`；修饰键激活 → 保留面板（`onOpenChange` 未被调 false）。该文件此前只断言过链接文本与 `aria-labelledby`，**列表项关闭路径无任何覆盖**（也是本条目此前无人发现的直接原因）。
  - 新增 `tests/navigation-dismiss.test.tsx`（4 用例）：`hashchange` + `popstate` 均触发 / `enabled=false` 不订阅 / 卸载后解绑（无泄漏回调）/ 重渲染后调最新回调（无陈旧闭包）。
  - 新增永久 e2e `tests/e2e/overlay-route-dismiss.spec.ts`（**2 passed**）：① 点击导航条目 → 面板关闭且路由已切换（验收场景原文）；② 浏览器后退 → 面板关闭。
- **守护有效性（变异测试）**：临时停用 `docs-shell.tsx` 的接入 → e2e「浏览器后退关闭」**失败**（`not.toBeVisible()` 超时，面板仍可见），而「点击条目关闭」仍通过 → 证明两条路径**各自独立生效**（组件层修复 vs 原语接入），恢复后 `2 passed`。
- **未验证项（写入交付书 §9）**：`context-menu.tsx:124-140`、`menu.tsx:208-227`（含 `dots-menu`/`menu-bar` 透传路径）的 `href` 条目**依赖 Radix `Item` 的 select-关闭**，仓库无显式处理、本轮也未做浏览器实测 → 未纳入修复面，列为不确证项。
- **门禁**：`pnpm run typecheck`（`tsc -b`）exit 0；`pnpm run lint` **0 errors / 16 warnings（存量）**；定向 vitest **5 files / 55 tests passed**（`navigation-dismiss`、`hamburger-menu-groups`、`hamburger-menu`、`hamburger-menu-modes`、`docs-shell-geometry`）；e2e `overlay-route-dismiss` **2 passed**；全量 `pnpm run test` 见交付书 §7.5（与文档基线一致）。
- **文档链**：改动含 `docs/geist/src` 两处消费方接线（非 props/API/示例/路由变化）→ `docs/geist/src/data` 与双语 guides 无需同步；LLM 语料按批次 G 仍暂缓。
- **台账落点**：本文件 §5N、主报告 `017` 条目（标题 + 验证状态 + 修复记录）、矩阵 `:137` 与 017 受影响行、交付书 §1/§2/批次 C/§7.5/§9/§10。

---

## 5O. HIG-AUD-018 修复记录（2026-09-23，受控能力缺口 4/4 闭环）

**来源**：交付书批次 C（`018`）。**基线校正**：条目行号均已漂移（实测 combobox 的 `setOpen` 在 `:185`/`:239`/`:431`/`:441`/`:527`；bottom-sheet 档位 state 在 `:104`、写入点 `:153`/`:226`；split-button 触发按钮在 `:161-171`）。**取证结论（subagent）**：四缺口风险排序 **SplitButton < BottomSheet < Combobox < Toasts**；并纠偏一处——仓库**没有** Drawer `slide` API，真实受控先例是 BottomSheet 的 `open`（`:93-102`）与各文件里的 `isControlled = prop !== undefined` 双模写法。

- **已完成 3/4**（细节见主报告 `018` 修复记录）：
  - **Combobox 受控 `open`/`onOpenChange`**：4 处写入点收敛到统一 `setOpen`（选中 / 键盘导航 / 根与输入面点击 / Radix Escape 与外点），受控时只上报；新增 `tests/combobox-controlled.test.tsx`。
  - **BottomSheet 受控 `detent`**：复用同文件 `open` 双模，`current` → `detent`/`detentState`，两处写入点统一；越界/非整数**钳到合法档位**（否则面板高度 NaN 崩）；`tests/bottom-sheet.test.tsx` 增用例。
  - **SplitButton `menuButtonDisabled`**：纯属性透传到 `MenuButton`（`disabled` 已可达原生按钮）；新增 `tests/split-button-controlled.test.tsx`。
- **文档注册同步**：`docs/geist/src/data/component-api.ts` 三处补行（combobox `open`/`onOpenChange`、bottom-sheet `detent`、split-button `menuButtonDisabled`）+ `tests/component-api-registry.test.ts` 三处断言 → **9 tests passed**。
- **验证**：定向 vitest 全绿（受控契约 + 既有契约 + 注册表）；**真实浏览器回归探针（跑完即删，3 passed）**确认三组件既有非受控行为不变——重点是 **Radix Popover 的受控语义**（单测覆盖不到）；`typecheck` / `lint` 见交付书 §7.6。
- **第 4 项：Toasts 受控 store 注入（同会话完成）**：把模块级单例（`toast.tsx` 的 `toastRecords`/`toastListeners`/`nextToastId`）收进 `createToastStore()` 闭包，导出 `ToastStore` / `ToastRecord` 类型（`Toasts store?` + `useToasts(store?)` 绑定同一实例，`dismiss`/`subscribe`/`getSnapshot` 走注入实例）；**默认全局 store 保持既有行为**（既有示例与测试零改动通过）。回归：新增 `tests/toasts-controlled.test.tsx`（4 用例，含「注入 store 与另一 store 相互隔离」这一全局单例做不到的断言）；`tests/toast-api.test.ts` 导出断言放宽为「包含」式；`component-api.ts` toast 条目补 `store` + `createToastStore` 行并同步注册表 `toEqual` 列表；真实浏览器 docs `/components/toast` 弹出/关闭路径不变。**踩坑**：`createToastStore` 同时出现在函数声明与末尾导出表 → `Duplicated export` 导致测试文件**静默 0 test**（改为仅末尾导出）。
- **方法论沉淀**：受控能力改造的验收必须**双断言**——①「传受控值时内部不自行变更」；②「既有非受控路径不回归」（单测覆盖不到 Radix 语义时用一次性浏览器探针补齐）。另：`.ts` 测试文件**不能含 JSX**（本轮踩到一次，改为 `.tsx` 后通过）。
- **台账落点**：本文件 §5O、主报告 `018`（标题 + 验证状态 + 修复记录）、矩阵 `:326`、交付书 §1/§3/§7.6/§9/§10。

---

## 5P. HIG-AUD-015 修复记录（2026-09-23，Tooltip 不再制造焦点）

**来源**：交付书批次 C（`015`，与 `014`/`016` 同批次的独立小修）。**基线校正**：条目行号取自修复前版本，实测触发元素构造在 `tooltip.tsx:50-61`；**另外发现 `tests/tooltip-focus.test.tsx` 的既有用例①正是在锁定本条目要修的行为**（「makes a non-interactive element child keyboard-focusable」）——「测试把缺陷固化成契约」的现象值得后续留意。

- **实现**：触发元素构造改为只**透传**调用方声明的 `tabIndex`（去掉 `?? 0`）；非元素子节点的兜底 `<span>` 去掉强注的 `tabIndex={0}`；源码注释写明「**不制造焦点**」契约与两种推荐做法（调用方声明 `tabIndex`，或改用可聚焦元素）。
- **消费面复核（全仓 22 个使用点）**：内部三处**本就显式声明** `tabIndex={0}`（`tabs.tsx:210`、`progress.tsx:154`、`description.tsx:45`）、一处包裹真按钮（`text-with-copy-button.tsx:135`）→ **仓库内键盘可达性无回归**；docs 示例中包裹纯文本 / `<span>` / `<Badge>` / `<Spinner>` 的触发器按预期不再进 Tab 序列（即条目验收场景）。
- **回归**：`tests/tooltip-focus.test.tsx` 重写用例①（→「静态子元素无 `tabindex` 属性且 `tabIndex === -1`」）并新增「可聚焦子元素保持 `tabIndex 0` 且 `focus()` 后取得焦点」；显式 `tabIndex={-1}` 透传用例保留（共 3 用例）；`tooltip-api` / `tooltip-tip` / `loading-icon-layout` 复跑通过 → 定向 **4 files / 16 tests**。
- **真实浏览器验收（临时探针，跑完即删，1 passed）**：`/components/tooltip` 上所有 `span` 触发器**无 `tabindex` 属性**、所有 `button` 触发器保持 `tabIndex 0`；聚焦被 Tooltip 包裹的 `<Button>` 仍打开 `[role="tooltip"]`（**focus 通道未回归**）。
- **门禁**：`pnpm run typecheck` exit 0；`pnpm run lint` 0 errors / 16 warnings（存量）；全量 `pnpm run test` → `8 failed | 230 passed (238)` ＝ 文档基线。
- **文档链**：未改 props / 示例 / 路由（无新 prop），`component-api.ts` 无需变更；受影响的旧契约断言已按新行为更新。
- **台账落点**：本文件 §5P、主报告 `015`（标题 + 验证状态 + 修复记录）、矩阵 `:88`/`:323`、交付书 §1/§2/批次 C/§7.7/§10。
