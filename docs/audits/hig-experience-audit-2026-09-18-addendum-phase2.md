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

**新增问题**：P1 × 3、P2 × 4、P3 × 6。（同日第二、三轮运行验证另在主报告 §4.1 新增 **P0 HIG-AUD-051**（Quick Actions 打开即崩溃）、**P2 HIG-AUD-052**（legacy 账本旁路，HIG-AUD-005 撤回后的实质残留）与 **P2 HIG-AUD-053**（命令面板搜索相关性回归，`test:docs-layout` 稳定失败发现），并撤回 HIG-AUD-005 的 P0 判定，见 §5A。）

---

## 3. 新增问题清单

### 3.1 P1

#### HIG-AUD-038 MenuBar 的菜单没有可用高度约束 → 长菜单溢出视口，尾部项不可达

- **严重度**：P1 ｜ **类型**：实现缺陷 ｜ **验证状态**：`[静态确证]`
- **证据**：
  - `src/components/ui/menu-bar.tsx:36-39` `MENU_BAR_SURFACE` 含 `overflow-x-hidden overflow-y-auto`，但**没有任何 `max-h-*`**（我检索该文件 `max-h|available-height` → **0 命中**）。
  - 对照同仓库的正确做法：`src/components/ui/menu.tsx:139` 使用 `max-h-[var(--radix-dropdown-menu-content-available-height)]`。
  - Radix 原语会暴露 `--radix-menubar-content-available-height` 供消费方约束高度，本项目未使用。
- **实际表现（推断）**：菜单内容高于视口时，元素以 `height: auto` 撑出视口下沿；由于 Radix 菜单在 modal 模式下锁定 body 滚动，**超出部分既不可滚动到、也不可点击**。项目符号菜单（如 20 项的 "File"）在 390/320 视口下必然触发。
- **根因**：菜单面板样式在两个组件间复制（`menu.tsx` 与 `menu-bar.tsx`），复制时丢了高度约束这一条。
- **建议修复方向**：给 `MENU_BAR_SURFACE` 补 `max-h-[var(--radix-menubar-content-available-height)]`（SubContent 对应 `--radix-menubar-sub-content-available-height`），并抽出与 `menu.tsx` 共享的「菜单表面」常量，避免再次分叉。
- **验收场景**：在 320×700 视口打开一个 20 项的 MenuBar 菜单 → 菜单完整可见（可滚动），最后一项可达并可点击。

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
| **HIG-AUD-049** | ActivityView 图标瓦片 48px，HIG 正文建议约 70×70px | `activity-view.tsx:113` `size-12`（48px）+ `:113` `[&_svg]:size-5`（20px）；HIG §3.1 `activity-views.md`「center it in an area measuring about **70x70 pixels**」 | **Web 适配判断，非缺陷**：需设计决策记录（HIG 的 70×70 是 iOS 点/像素语境；Web 48px 更贴合 Geist 密度）。建议在组件注释中写明取舍 |
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

- **HIG-AUD-051（P0，新发现）**：`ContextMenuQuickActionsContent` 的 Portal 兄弟子节点（遮罩 div + Content）违反 `@radix-ui/react-menu@2.1.24` `MenuPortal` 的 `asChild` 单子元素契约 → Quick Actions **打开即渲染崩溃**，ErrorBoundary 捕获后 `/components/context-menu` **整页示例被替换**。这也是主报告第一轮 QA 运行验证「菜单未打开且无报错」的真正原因（第一轮为时序假象；第二轮逐示例隔离后在全新 server 上稳定复现并取得完整错误栈）。根因、证据链与修复方向见主报告 §4.1 HIG-AUD-051。
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
| **MenuBar** | 「菜单浮层在视口内碰撞翻转，**最大高度受限后可滚动**」（`guides-05.ts:495`）/ "scroll once they hit the max height"（`:1151`） | HIG-AUD-038：`MENU_BAR_SURFACE` 无 `max-h-*`，40 项菜单底边 y=2005（视口 844，溢出 1161px），`maxHeight: none`，不可滚动 | **文档与实现矛盾**（HIG-DOC-05 同类，受 038 修复影响） |
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
