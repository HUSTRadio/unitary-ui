# HIG 布局与元件实现计划（分两期）

> 状态：待确认（重合项整合策略保留用户指示权）
> 日期：2026-09-17
> 范围：8 个 Apple HIG 页面 → 组件库能力落地

## 一、需求背景

按 Apple HIG（Human Interface Guidelines）为组件库新增 8 组元件/布局能力。与现有组件生态位重合者优先合并（设计风格合并或同组件变体）或替代：

| # | HIG 页面 | 对应能力 |
|---|---|---|
| 1 | Layout and Organization | 布局原语（SafeArea/Stack/自适应约束） |
| 2 | Edit Menus | 编辑菜单（标准编辑操作 + 自定义操作） |
| 3 | Home Screen Quick Actions | 主屏快速操作（长按大图标列表） |
| 4 | Pop-up Buttons | 弹出按钮（显示当前选中项的单选菜单） |
| 5 | Pull-Down Buttons | 下拉按钮（固定命令标签 + 默认命令执行） |
| 6 | The Menu Bar | 菜单栏（水平多级菜单 + 快捷键） |
| 7 | Toolbars | 工具栏（分组 + 溢出折叠） |
| 8 | Activity Views | 活动视图（分享面板：目标网格 + 操作列表） |

注意：developer.apple.com 页面需 JS 渲染无法抓取正文，HIG 规范要点基于既有知识总结（见第三节）。

## 二、已确认方向（用户问答结果，2026-09-17 更新）

1. **视觉路线**：Geist 风格 + HIG 行为——沿用现有 token 体系，行为遵循 HIG 规范，与 Select/Menu 同族。不做 Apple 拟真样式。
2. **实施范围**：分两期全做（一期重合合并项 + ActivityView；二期 MenuBar/Toolbar/Layout）。
3. **整合策略**（用户最终指示，取代原"等待进一步指示"）：
   - **Edit Menus = 独立组件**：它是 text select 悬浮胶囊式快捷操作菜单（选中文字后浮现的胶囊条），与 context-menu（右键/长按菜单）是两种组件 → 新建 `edit-menu.tsx`。
   - **Quick Actions = context-menu 的长按变体**：触屏逻辑 vs 桌面逻辑，不另立组件 → 并入 `context-menu.tsx`，加注 touchscreen only。
   - **Pop-up Button = Select**：确认就是 Select，不做新组件；学习 Select 的 PC 端/移动端设计风格，仅做文档对齐与演示。
   - **Pull-down Button = split-button 的"悬浮卡片"变体**：当前 split-button 是按钮+菜单形式；pulldown 变体为卡片从按钮的（左上|左下|右上|右下）角向对向展开。
   - **Layout & Organization = 文档导航重组**：将当前"网格"（Grid）、"排版"（Typography）装进新的"排版与布局"（Layout & Organization）顶层分组，与"组件"同级，并纳入新布局原语。

## 三、生态位重合分析（2026-09-17 修正）

| HIG 页面 | 定位结论 |
|---|---|
| Edit Menus | **独立组件**：text selection 悬浮胶囊（iOS 选中文字的 Cut/Copy/Paste 胶囊条），非右键菜单形态 |
| Home Screen Quick Actions | **context-menu 长按变体**（touchscreen only）：Radix ContextMenu 触屏长按已内建，补 QuickActions 形态的内容层变体 |
| Pop-up Buttons | **= Select**：形态/行为等价（显示当前值 + 弹出单选菜单 + 打开高亮当前项）；仅文档对齐 |
| Pull-Down Buttons | **SplitButton 悬浮卡片变体**：非菜单列表形态，卡片从按钮角向对向展开 |
| The Menu Bar | 全新组件（radix-ui 统一包 Menubar 待验证） |
| Toolbars | 全新组件 |
| Activity Views | 全新组件（复用 sheet 容器） |
| Layout & Organization | 文档导航重组 + 布局原语组件 |

## 四、HIG 规范要点摘要（行为依据）

1. **Edit Menus**：文本/内容长按（iOS）或右键（macOS）出现；标准操作 Cut/Copy/Paste/Select…/Select All/Look Up/Share/Translate；开发者可追加自定义操作或替换标准操作；操作按上下文智能显隐（无选择时只显示 Select All 等）。
2. **Home Screen Quick Actions**：app 图标长按（原 3D Touch）；竖排居中列表、每项图标+标题+可选副标题；背景模糊 + 图标缩放动画；静态/动态快捷操作；菜单底部系统项（移除 App、编辑主屏幕、共享 App）。
3. **Pop-up Buttons**（macOS NSPopUpButton）：触发器显示当前选中值，点击弹出菜单从中单选；菜单打开时高亮当前项。
4. **Pull-Down Buttons**（macOS NSPullDownButton）：触发器显示固定命令标签（非选中值）+ chevron，点击弹出命令菜单；首项常为默认命令——点击按钮主体直接执行首项（工具栏常见，如 "New ▾"）。
5. **The Menu Bar**：屏幕顶部全局菜单栏；App 菜单 + 应用菜单（File/Edit/View/Window/Help）；菜单项支持右对齐键盘快捷键、分隔线、子菜单、勾选/混合态、禁用；ARIA menubar 键盘模型（左右方向键切换顶级菜单、上下键进入菜单项、Escape 逐级关闭）。
6. **Toolbars**：macOS 位于窗口标题栏下方、iOS 位于屏幕底部；工具项分组（可插分隔）；空间不足时折叠进溢出；可含搜索字段/分段控件；macOS 支持用户自定义。
7. **Activity Views**（UIActivityViewController）：底部 sheet；上方分享目标网格（app/服务图标+名称，横向滚动或网格）；下方操作列表（Copy/Print/Save to Files 等，图标+标题）；操作完成后可显示完成提示。
8. **Layout & Organization**：safe area（避开圆角/刘海/系统栏）、一致边距、自适应布局（size class/窗口尺寸/多列）、对齐与网格、视觉层级（z-order、模态栈）、动态缩放（Dynamic Type）。

## 五、关键代码位置（勘察结论）

### 重合组件
- `src/components/ui/menu.tsx` — Menu 基元：MenuContainer/MenuButton/Menu/MenuItem/MenuItemLocked/MenuLink/MenuDivider/MenuSection；`import { DropdownMenu as MenuPrimitive } from "radix-ui"`；position 映射表、stateful 上下文、`--material-shadow-menu` 阴影。
- `src/components/ui/context-menu.tsx` — ContextMenu：Radix ContextMenu（右键 + 长按），Content/Item/Separator；样式独立于 menu.tsx（未复用 MenuItem）。
- `src/components/ui/select.tsx` — Select：Radix Select 完整封装，组合式 API（Select/SelectGroup/SelectSeparator/SelectItem），size 三档、prefix/suffix、error、layout。
- `src/components/ui/split-button.tsx` — SplitButton：官方 props API（buttonProps/menuButtonLabel/menuItems/menuAlignment/menuProps）+ 已废弃 compound API；useElementWidth 做菜单锚点偏移。
- `src/components/ui/dots-menu.tsx` — DotsMenu：基于 menu.tsx 的薄封装（**EditMenu 薄封装路线的直接先例**）。
- `src/components/ui/navbar.tsx` — Navbar：泛用顶栏（scrollBehavior/variant/height），无菜单能力。
- `src/components/ui/sheet.tsx`、`bottom-sheet.tsx` — 弹层容器；BottomSheet 支持 detents 多档拖拽，注释含"与 Drawer 有意不合并"的边界先例（变体 vs 独立组件决策参考）。
- `src/components/ui/keyboard-input.tsx` — 键帽渲染（⌘ 符号），MenuBar 快捷键右对齐显示的复用候选（该文件近期有本地修改，勿覆盖）。
- `src/components/ui/phone-chrome.tsx`、`device.tsx`、`browser.tsx` — 拟真 Chrome 组件（仅可作 demo 容器）。
- `src/lib/clipboard.ts` — `copyTextToClipboard`（Clipboard API + execCommand 降级；EditMenu 的 Cut/Copy 集成候选）。
- `src/lib/control-layout.ts` — ControlLayout 统一尺寸 API。
- `src/lib/index.ts` — 组件导出口（第 94-97 行可见 ContextMenu/DotsMenu 导出模式）。

### 样式 token
- `src/styles/index.css` — 浮层圆角已按 Apple HIG 口径（约 479 行起）；字号映射 HIG Text Styles（约 1472 行起 `--uni-text-*`）；`--material-shadow-menu`；`material-menu`/`material-small` 材质类。规划 QuickActions/ActivityView 时需检查 backdrop-blur 材质 token 是否已有。

## 六、文档注册链与验证命令（每个新组件都要走）

### 文档链
1. `docs/site/src/data/components.ts` — 组件注册 `{ name, label, labelZh, description, official, bestPractices[] }`（第 255 行 context-menu、330 行 dots-menu、1113 行 split-button 为格式参考）。
2. `docs/site/src/data/component-api.ts` — API 表。
3. `docs/site/src/data/docs-routes.ts` — 路由/侧栏（NAV_GROUPS 由其投影）。
4. `docs/site/src/content/component-guides/` — guides-01..18.ts 双语指南 + index.ts。
5. `docs/site/src/examples/<name>/` — 演示目录 + `examples/registry.ts`。
6. `docs/site/src/components/patterns/app-shell-demo.tsx` — patterns 先例（MenuBar/Toolbar 组合演示候选落点）。
7. `tests/` — vitest 回归测试。

### 验证命令
- `pnpm run typecheck` / `pnpm run test` / `pnpm run build` / `pnpm run lint`（oxlint）
- `pnpm run docs:llm:generate && pnpm run docs:llm:check`（确定性校验）
- `pnpm run docs:readme:screenshots && pnpm run docs:readme:screenshots:check`（导航/组件变化时）
- `pnpm run test:docs-layout`（Playwright 双主题布局审计）

### 硬约束
- 遵守仓库 AGENTS.md：公共 API 稳定、最小可维护变更、复用现有基元；不 commit/push 除非用户明确要求。
- 工作区有大量未提交的无关本地修改（docs/、`input.tsx`、`keyboard-input.tsx`、`phone-chrome.tsx`、`project-banner.tsx` 等），勿动。
- 新增 UI 文案一律 `useI18n t()`（`src/lib/framework-messages.ts` 注册词条；参考 dots-menu.tsx 中 `t("Menu")` 模式）。

## 七、整合策略（已确认，取代原"待确认决策点"）

用户 2026-09-17 指示，最终策略如下（原 A/B/C 选项作废）：

| HIG 项 | 策略 | 落点 |
|---|---|---|
| Edit Menus | 独立新组件 | `src/components/ui/edit-menu.tsx`（text selection 悬浮胶囊） |
| Quick Actions | ContextMenu 变体 | `src/components/ui/context-menu.tsx` 内新增长按变体（touchscreen only 注释） |
| Pop-up Button | 不做，= Select | 文档 bestPractices 对齐 + examples/select/ 演示 |
| Pull-down Button | SplitButton 变体 | `src/components/ui/split-button.tsx` 新增"悬浮卡片"变体 |
| Layout | 导航重组 | `docs-routes.ts` 新顶层分组"排版与布局"，迁入 Typography/Grid |

### 本轮补充勘察结论（2026-09-17）

1. **无 floating-ui 依赖**：`package.json` dependencies 仅 radix-ui 1.6.7 / cmdk / lucide-react 等。EditMenu 的选区悬浮定位需手写：`document.getSelection()` + `range.getBoundingClientRect()` + fixed 定位 + selectionchange/mouseup/touchend 监听。
2. **context-menu.tsx 现状**（132 行）：纯 Radix ContextMenu 封装（Root/Trigger/Content/Item/Separator），itemClassName 为 h-9 横排样式；原先把 Content 的 `max-sm:w-full max-sm:rounded-b-none` 当作移动端全宽贴底先例；2026-09-26 实测证明 Radix 浮层包装层内的 `w-full` 并不产生视口全宽，且菜单没有贴底定位。当前 ContextMenu（含 Quick Actions 变体）采用锚定式四角圆角浮层。
3. **Select 设计风格要点**（供 Pop-up 对齐与其他浮层组件参照）：
   - PC 端：Trigger 为全宽按钮（shadow ring 边框体系，`--gray-alpha-400` ring + hover/focus 加深 + focus 4px 光环）；Content 为 `material-menu` popper（`min-w-(--radix-select-trigger-width)`、`max-h-[min(available-height,376px)]`、`zoom-in-95 fade-in-0 duration-(--uni-duration-fast)` + `motion-reduce:animate-none`）；Item h-9、`rounded-overlay-item`、高亮 `bg-gray-alpha-100`、选中仅加粗+右侧 Check 不留背景。
   - 移动端（2026-09-26 校正）：Select、MultiSelect 与 ContextMenu 均保留触发器/指针锚定及四角圆角；不是全宽贴底面板。需要真正底部面板时须另行实现并验证视口宽度、底部安全区域和键盘行为。
   - 组合式 API + 尺寸档（small 32 / default 36 / large 40）+ ControlLayout 统一布局 API。
4. **split-button.tsx 现状**（219 行）：官方 props API（buttonProps/menuButtonLabel/menuItems/menuAlignment/menuProps）+ deprecated compound API；内部用 `useElementWidth` 测触发器宽度做 `alignOffset` 锚点偏移；菜单基于 menu.tsx 的 MenuContainer/MenuButton/Menu。pulldown 卡片变体加 `variant?: "split" | "pulldown"`（默认 split）+ `expandCorner?: "top-left" | "top-right" | "bottom-left" | "bottom-right"`。
5. **docs-routes.ts 分组结构**：`DocsGroupId = "foundations" | "api" | "components" | "patterns"`；`DOCS_GROUPS` 数组定义分组标题（41-45 行）；Typography（73-79 行）与 Grid（88-95 行）当前是 foundations 下的 static 页（renderer: `{ kind: "static", page }`）。新分组需：`DocsGroupId` 加 `"layout"` + DOCS_GROUPS 加 `{ id: "layout", title: "Layout & Organization", titleZh: "排版与布局" }` + 两条路由 group 改为 `"layout"` + 布局原语组件注册进 components.ts 并以 component-detail 渲染、group 为 layout（需验证 component-index/侧栏投影对非 components 分组的兼容性）。

## 八、第一期实施方案

### 1. EditMenu（新文件 `src/components/ui/edit-menu.tsx`，独立组件）

**定位**：text selection 悬浮胶囊式快捷操作菜单——用户选中文本后在选区上方浮现的横向胶囊条（Cut/Copy/Paste/…）。与 ContextMenu（右键/长按菜单）是两种组件，形态与触发机制完全不同，文件头注释写明此边界。

**API 草案**：
```tsx
interface EditMenuAction { label: React.ReactNode; onSelect: () => void; disabled?: boolean; }
interface EditMenuProps {
  /** 承载可选文本的容器（选区检测范围），胶囊浮层挂载其内 */
  children: React.ReactNode;
  /** 自定义操作，追加在标准操作之后 */
  actions?: EditMenuAction[];
  /** 启用哪些标准项，默认 ["cut","copy","paste","selectAll","lookUp","share"]，按传入顺序渲染 */
  standardActions?: ("cut" | "copy" | "paste" | "selectAll" | "lookUp" | "share")[];
  /** 粘贴回调（不传则 Paste 禁用） */
  onPaste?: (text: string) => void;
  onSelectAll?: () => void;
  onLookUp?: (text: string) => void;
  onShare?: (text: string) => void;
  /** 胶囊相对选区的偏移，默认 8px */
  offset?: number;
}
```

**实现要点**（无 floating-ui，手写定位）：
- 选区检测：容器上监听 `mouseup` / `touchend` + `document.selectionchange`；`document.getSelection()` 非空且 `range.getBoundingClientRect()` 有宽高且选区在容器内时打开。
- 定位：胶囊 `position: fixed`，水平居中于选区（`left = rect.left + rect.width/2`，translateX(-50%)），垂直在选区上方 `top = rect.top - offset`；上方空间不足翻转到选区下方；水平越界 clamp 到视口边距内。滚动/resize/选区取消（collapsed）时关闭。
- 形态：横向胶囊 `rounded-full bg-[var(--color-bg-elevated)] shadow-[var(--material-shadow-menu)]`，项为透明按钮 `h-7 px-2.5 text-label-13`，项间细分隔线（`w-px bg-gray-alpha-400`），Cut/Copy/Paste 图标可选；入场 `fade-in-0 zoom-in-95` + motion-reduce 降级。
- Cut/Copy 用 `copyTextToClipboard(selectedText)`；无选中文本时 Cut/Copy/Share 禁用，无 onPaste 时 Paste 禁用（上下文智能禁用）。
- 文案 `t()` 注册 framework-messages（Cut/Copy/Paste/Select All/Look Up/Share）。
- 点击胶囊项后清除选区并关闭；胶囊本身 `select-none`，pointer 事件不取消选区（`onMouseDown preventDefault`）。

### 2. QuickActions（并入 `src/components/ui/context-menu.tsx`，长按变体）

**定位**：context-menu 的触屏长按形态（touchscreen only）——居中竖排、大图标+标题+副标题、背景模糊遮罩。不另立组件文件；Radix ContextMenu 触屏长按触发已内建，只补内容层变体。

**API 草案**（context-menu.tsx 内新增导出）：
```tsx
interface QuickActionsItemProps extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> {
  icon: React.ReactNode;   // 大图标（size-5 档）
  subtitle?: React.ReactNode; // 可选副标题
}
/** 触屏长按形态的菜单内容（touchscreen only；桌面右键仍用 ContextMenuContent） */
const ContextMenuQuickActionsContent = ...; // 复用 Root/Trigger，仅替换 Content 层
const ContextMenuQuickActionsItem = ...;
```

**实现要点**：
- Content 形态：不再 `w-max`，改为定宽（min-w-56）居中于触发元素上方（Radix ContextMenuContent 的定位由 trigger 长按坐标锚定——验证长按时 content 对齐行为，必要时 `align="center"` + `avoidCollisions`）；项为 `h-auto py-2.5` 大图标 + 标题（text-label-14）+ 副标题（text-copy-13 text-gray-900）；系统尾项（如"移除 App"）用 Separator 隔开、destructive 红色。
- 背景模糊遮罩：Content 打开时渲染兄弟层 overlay（`backdrop-blur + bg-black/40`，fixed inset-0，`data-[state=open]` 过渡）；需检查 styles 是否已有材质 token，无则加最小 token。
- 文件头与组件注释标注 **touchscreen only**（触屏长按逻辑；桌面右键场景用标准 ContextMenu）。
- `src/lib/index.ts` 导出新组件。

### 3. Pop-up Button（= Select，不做新组件）

**定位**：确认 Select 就是 Pop-up Button（显示当前选中值 + chevron 弹出单选菜单 + 打开时高亮当前项，Radix Select 均已具备）。

**动作**：
- 学习并参照 Select 的 PC/移动端设计风格（见第七节勘察结论 3：PC=全宽 ring 触发器 + material-menu popper；移动=max-sm 全宽贴底）——此风格认知服务于第一期其他浮层组件（EditMenu 胶囊、QuickActions、ActivityView）的形态统一。
- `components.ts` Select 条目 bestPractices 补 HIG Pop-up Button 对齐说明（打开高亮当前项、单选语义、选项 Title Case）。
- `examples/select/` 增加 "As a pop-up button" 演示（强调"显示当前值"用法，与表单 Select 场景区分）。
- 零组件代码改动。

### 4. Pull-down Button（SplitButton 新增"悬浮卡片"变体）

**定位**：`split-button.tsx` 增加 `variant?: "split" | "pulldown"`（默认 "split" 完全向后兼容）。split=现有按钮+菜单列表形态；pulldown=悬浮卡片形态——卡片从按钮的指定角向对向展开（transform-origin 锚定角 + zoom/translate 展开），内容为命令卡片（图标+标题+描述的命令集），非菜单列表。

**API 变更**：
```tsx
interface SplitButtonProps {
  variant?: "split" | "pulldown";             // 默认 "split"
  /** pulldown 卡片展开角：卡片锚定按钮该角、向对向展开（split 模式忽略） */
  expandCorner?: "top-left" | "top-right" | "bottom-left" | "bottom-right"; // 默认 "bottom-right"（锚按钮左上角向下右展开→对应按钮下方的常规下拉观感）
  ...现有 props
}
```
（expandCorner 语义：值为卡片固定住的按钮角——"top-left" 表示卡片贴按钮左上角、向右下方向展开；"bottom-left" 贴左下角、向右上展开，余类推。）

**实现要点**：
- 卡片定位：用现有 MenuContainer/Menu 的 Radix `side`+`align`+`alignOffset/sideOffset` 组合实现 4 角锚定（top-left→side:bottom align:start；top-right→side:bottom align:end；bottom-left→side:top align:start；bottom-right→side:top align:end），复用 `useElementWidth` 偏移先例。
- 展开动画：卡片容器 `transform-origin` 设为锚定角（如 top-left → `origin-top-left`），`data-[state=open]:zoom-in-95 + fade-in-0` 从该角缩放展开；motion-reduce 降级。
- 卡片视觉：`rounded-overlay bg-[var(--color-bg-elevated)] shadow-[var(--material-shadow-menu)] p-2`，命令项复用 SplitButtonMenuItem（icon+title+description）的卡片化排布（可网格 grid-cols-2 或竖排，由 demo 决定，API 不约束布局）。
- variant="pulldown" 时菜单按钮 chevron 保留（展开指示），主按钮仍执行 buttonProps.onClick（HIG 默认命令语义由调用方用首项命令填充）。
- 注释与文档写清 split 与 pulldown 的差异：split=按钮+菜单列表；pulldown=角向展开的悬浮命令卡片。

### 5. ActivityView（新文件 `src/components/ui/activity-view.tsx`）

**定位**：基于 sheet.tsx 容器的分享面板内容层。

**API 草案**：
```tsx
interface ActivityTarget { icon: React.ReactNode; title: string; onSelect: () => void; }
interface ActivityAction { icon: React.ReactNode; title: string; onSelect: () => void; destructive?: boolean; }
interface ActivityViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 分享目标网格 */
  targets: ActivityTarget[];
  /** 操作列表 */
  actions?: ActivityAction[];
  /** 标题（可选，如共享内容名），默认 t("Share") */
  title?: string;
}
```

**实现要点**：
- 外壳复用 Sheet（或 Dialog 底部 sheet 形态，与 BottomSheet 对齐 rounded-t-overlay）。
- 上方 targets 横向网格（grid-flow-col 或 flex wrap + 滚动），下方 actions 列表（图标+标题行，destructive 红色）。
- 文案 t("Share") 等注册 framework-messages。

### 第一期顺序与验证

顺序：EditMenu → QuickActions → Pop-up(文档+演示) → Pull-down → ActivityView。
每项完成即走文档链（第六节）+ vitest；期未统一跑 build、docs:llm:generate+check、readme:screenshots+check、test:docs-layout。

## 九、第二期实施方案

### 6. MenuBar（新文件 `src/components/ui/menu-bar.tsx`）

**定位**：水平菜单栏，macOS Menu Bar 的 Geist 化实现。

**技术选型**：radix-ui 1.6.7 统一包的 Menubar primitive（`import { Menubar as MenubarPrimitive } from "radix-ui"`），自带 ARIA menubar 键盘模型（左右切顶级、上下进菜单、Esc 逐级关），不手写导航逻辑。

**API 草案**：
```tsx
<MenuBar>                        // role=menubar 容器
  <MenuBarMenu label="File">     // 顶级菜单触发器
    <MenuItem shortcut="⌘N">New</MenuItem>      // 复用/对齐 menu.tsx 的 MenuItem 形态
    <MenuDivider />
    <MenuBarSub label="Open Recent">…</MenuBarSub>  // 子菜单
  </MenuBarMenu>
</MenuBar>
```

**实现要点**：
- 菜单项支持：右对齐快捷键（复用 `keyboard-input.tsx` 键帽渲染或文本形态）、勾选态（checkbox/radio item）、禁用、分隔线、子菜单。
- 快捷键仅展示（不绑定全局键），行为由调用方接入。
- 浮层样式对齐 menu.tsx：material-menu、--material-shadow-menu、rounded-overlay、入场缩放淡入 + motion-reduce 降级。
- 与 Navbar 的边界写入注释：Navbar=页面级导航容器（链接+滚动行为），MenuBar=应用级命令菜单（动词命令+快捷键）。

### 7. Toolbar（新文件 `src/components/ui/toolbar.tsx`）

**定位**：窗口级工具操作组容器。

**API 草案**：
```tsx
<Toolbar>
  <ToolbarGroup slot="leading">…</ToolbarGroup>   // 左组
  <ToolbarGroup slot="center">…</ToolbarGroup>    // 中组（可选）
  <ToolbarGroup slot="trailing">…</ToolbarGroup>  // 右组
</Toolbar>
```

**实现要点**：
- 容器：水平 flex + 组间分隔线（border-l），高度与 padding 对齐 control-layout 尺寸档。
- 溢出折叠：ResizeObserver 监听容器宽度，空间不足时组内尾部项折叠进 DotsMenu 溢出菜单（`data-overflow` 标记 + 隐藏 class 切换）。
- 组内可放任意控件（按钮、MenuButton、分段控件、搜索输入）。
- 与 Navbar 边界：Navbar=页面级导航（路由/锚点/滚动），Toolbar=工具操作组（命令按钮/输入控件），二者可组合使用。
- app-shell-demo patterns 页可加 MenuBar+Toolbar 组合演示（浏览器窗口形态）。

### 8. Layout & Organization（文档导航重组 + 布局原语）

**定位**：分两层——(a) 文档站新增顶层分组"排版与布局"（Layout & Organization），与"组件"分组同级，把现有 Typography（排版）、Grid（网格）两个 foundations 静态页迁入；(b) 新增布局原语组件（SafeArea/Stack），组件页也挂在该分组下。

**导航重组**（`docs/site/src/data/docs-routes.ts`）：
- `DocsGroupId` 联合类型加 `"layout"`。
- `DOCS_GROUPS`（41-45 行）插入 `{ id: "layout", title: "Layout & Organization", titleZh: "排版与布局" }`——置于 "components" 之后或之前（执行时按侧栏信息架构习惯定，倾向 foundations → layout → components → patterns 或 components 前）。
- Typography（73-79 行）、Grid（88-95 行）两条路由 `group` 从 `"foundations"` 改为 `"layout"`（to/renderer 不变，静态页内容不动）。
- 验证点：component-index 渲染器与侧栏 `NAV_GROUPS` 投影是否假设组件只在 "components" 分组——布局原语组件注册 `components.ts` 后路由 group 用 `"layout"`，需通读路由生成与侧栏代码确认兼容；不兼容则布局原语也走 static/localized 页模式（执行时定）。
- 检查项：`docs:llm:generate`、`test:docs-layout`（Playwright 双主题布局审计）、`docs:readme:screenshots` 对分组变化的敏感度，按第六节命令全跑。

**布局原语**（新文件，具体拆分执行时定：`safe-area.tsx` / `stack.tsx`）：
```tsx
<SafeArea edges="top bottom" padding="md">…</SafeArea>  // 安全区边距容器
<Stack direction="row" gap="md" align="center">…</Stack> // 方向+间距堆叠
```
- **SafeArea**：padding 容器，`edges` 控制方向（top/right/bottom/left/all），走现有 spacing token，纯 CSS 无行为。
- **Stack**：flex 预设（direction/gap/align/wrap），语义化 + 尺寸档统一，避免随机 gap 值。
- 边界：先通读 `grid.tsx`、`scroller.tsx`、`control-layout.ts`、`side-panel.tsx`；现有 Grid 组件已覆盖的栅格场景不重复造轮子。注释写明：本组为布局原语（无行为语义）；组件 `grid.tsx`（Spacing/栅格组件）与静态页"Grid"（栅格准则）的关系也在此页说明。

## 十、里程碑与验证

| 里程碑 | 内容 | 验证 |
|---|---|---|
| M1 | 第一期 4 项组件实现（EditMenu/QuickActions/Pull-down/ActivityView）+ Select 文档对齐 + 各项文档链 | typecheck + vitest + lint |
| M2 | 第一期整体 | build、docs:llm:generate+check、readme:screenshots+check、test:docs-layout |
| M3 | 第二期 MenuBar/Toolbar/Layout 实现 + 单项文档链 | typecheck + vitest + lint |
| M4 | 第二期整体 + patterns 组合演示 | 同 M2 全量 |

- 全程不 commit/push，除非用户明确要求。
- 保留工作区既有未提交改动，不触碰无关文件。

## 十一、风险与备注

1. **radix-ui Menubar 可用性**（二期）：需确认 1.6.7 统一包导出 Menubar；若未导出则回退 DropdownMenu 组装方案（MenuContainer 横向排列 + 手写 menubar 键盘模型）。
2. **EditMenu 手写选区定位**：无 floating-ui 依赖，选区 rect 定位/翻转/越界 clamp 均手写；jsdom 下 Selection API 行为有限，vitest 以逻辑单测（禁用态、开关条件）为主，定位做 mock rect 单测。
3. **QuickActions 触屏行为验证**：Radix ContextMenu 长按触发在桌面浏览器难以端到端验证（需触屏/移动仿真）；实现以形态与数据结构为主，演示页注明 touchscreen only；Playwright 可用 touch 事件模拟长按（执行时评估）。
4. **backdrop-blur 材质**：QuickActions 遮罩需检查 styles 中是否已有材质 token；没有则新增最小 token，不引入外部体系。
5. **Pull-down 卡片与 Radix Menu 的契合度**：Menu primitive 的列表语义（role=menu）与"命令卡片"形态的张力——保留 role=menu + MenuItem 语义（可访问性优先），卡片化只体现在容器视觉与项排布。
6. **layout 分组兼容性**（二期）：component-index/侧栏投影可能假设组件仅在 components 分组，执行时通读验证。
7. **文档体量**：每组件双语 guide 较大，写入时分段，避免单次输出超时。
8. **测试**：EditMenu/Pull-down/QuickActions 行为测试（禁用逻辑、variant 渲染）放 tests/；docs-layout Playwright 审计覆盖新路由双主题。
