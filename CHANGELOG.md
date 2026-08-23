# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] — 2026-08-23

### Changed — 系统优先字体栈 + 手动档位声明 + 字体度量探针

- **@font-face 全部改名 Subset 后缀**（OPPO Sans 4.0 Subset / HarmonyOS Sans SC Subset / TC Subset），避免与本机同名系统字体冲突。CSS 规范里同名 @font-face 会遮蔽系统字体；实测改名后本机已装 OPPO Sans 4.0 / HarmonyOS Sans 的机器零下载直接命中系统完整版，未装机器才 fallback 到自托管分级子集（unicode-range 按需加载）。
- **手动档位声明**：根元素 `data-font-tier="oppo|hmos|system"` 切换字体栈，不搞自动切换。默认 `oppo`（系统优先），`hmos` = HarmonyOS Sans SC → TC（先 SC 后 TC fallback），`system` = 纯系统字体栈（不加载任何自托管）。
- **字体度量探针** `src/lib/font-metrics.ts`：`document.fonts.ready` 后 canvas 测量 CJK:ASCII 比例、数字最大宽、基线偏移，写入 `--font-metric-cjk-ratio` / `--font-metric-digit-w` / `--font-metric-baseline`，结果缓存 localStorage 与档位绑定。三处消费：
  - `.phone-status-time`：基线校正 `translateY(var(--font-metric-baseline, 0.25px))`
  - 表格数字列：`tabular-nums` + `--font-metric-digit-w` 列宽对齐
  - 代码块：等宽不受档位影响（已验证）
- 档位切换 `MutationObserver` 监听 `data-font-tier` / `style` 变化，防抖 120ms 重测（幂等：值不变不重写 style，避免循环）。

### Added

- `src/lib/font-metrics.ts`：字体度量探针模块（自注册 + `useFontMetrics` hook）。
- `tests/foundation-contract.test.ts`：档位声明 + 度量探针契约测试（9 项全部通过）。

### Noted — OPPO Sans 4.0 授权边界

- OPPO Sans 4.0 官方条款为「免费商用但不提供下载渠道」。本框架仅自托管**分级子集**（~0.9MB/1.6MB，已显著裁剪），**不含完整字体文件**。完整字体需用户自行从 OPPO 官方渠道获取并安装到系统，随后通过系统优先栈零下载使用。CSS 注释已注明，使用库者需自行确认合规。

## [Unreleased] — 2026-08-20

- nav item：`py-1.5 text-copy-13`（30px 行高）→ `h-10 text-copy-14`（40px，官方 40px/14px/20px）
- item 行间距：0 → `space-y-0.5`（官方 2px）
- 分组标题：`py-2 text-copy-13` → `h-10 flex items-center text-[14px] leading-5 font-medium mb-0.5`（官方同款）
- 组间距：0 → `gap-4`（官方 space-y-4 = 16px）

### Added — 框架扩展（有意偏离官方 Geist）：壳层断点 lg(1024px)

> 官方 Geist 文档站侧栏断点为 xl(1200px)，实测 1100/1190px 视口均为移动形态。本地有意保持 **lg(1024px)**：目标使用环境包含 VS Code 内嵌浏览器（约 1100px），该宽度内容区足以承载常驻侧栏，落入汉堡形态会显著损伤可用性。依据用户明确指示（2026-08-23），覆盖「官方是唯一权威基准」原则的可用性例外。

### Added — 导航壳层组件族（框架扩展）

> 官方 Vercel Geist 无对应壳层实现；为满足本项目可复用应用壳层需求而添加。全部组件统一 500ms cubic-bezier(0.32,0.72,0,1) 动画曲线并带 motion-reduce 降级，受控/非受控双模。

- **Navbar**：定位与外观全可配的顶栏（`<header data-slot="navbar">`）。关键可配项：`scrollBehavior`（static / pinned / auto-hide，默认 pinned）、`variant`（solid / transparent）、transparent 下 `solidOnScroll` 滚动后自动补色、`height`（默认 h-16）。
- **SidebarNav**：通用侧边导航，渲染 nav>ul>li>a，激活项 aria-current="page"。关键可配项：`groups` 分组数据、`activeTo`、`onNavigate`、`side`（分隔边框侧，默认 left）。
- **Footer**：通用页脚（上边框 gray-alpha-400 + py-8 + text-copy-13 muted）。关键可配项：`columns` 链接列、`slotLeading`/`slotTrailing` 具名槽位、`sticky` 视口底部吸附。
- **HamburgerMenu**：汉堡触发 + ExpandPanel 展开 + 内建搜索过滤的复合组件。关键可配项：`anchor`（topbar 面板自顶栏底边延伸落下 / sidebar 自对侧滑入）、`direction`、`maxExpandedHeight`（默认 100dvh）/`maxExpandedWidth`（默认 80vw）、`content`（merged/split）、`items` 过滤数据源；搜索时列表收起、清空一键还原，「Ctrl K」提示仅精确指针设备渲染。
- **ExpandPanel**：参数化四向展开容器（top/bottom/left/right），Radix Dialog 承载焦点陷阱/Esc/外点关闭。关键可配项：`anchorElement`（side=top 时面板对齐锚元素底边且同宽——「navbar 延伸」形态）、`maxHeight`/`maxWidth`。
- **BottomSheet**：多档位底部弹层，拖拽跟手→松手吸附最近档位，背景点击/Esc 关闭。关键可配项：`detents` 档位（默认 [0.5, 1]）、`showIndicator`（automatic=多档位才显示指示条）、`gestures` 三手势独立开关（拖拽调高/上拉展开/下拉收起）。
  - **BottomSheet 与 Grabber 遵循 Apple HIG grabber 规格**：36×5px 圆角指示条、mt-8px、命中区 ≥44px、点按循环档位（role="slider" + aria-valuemin/max/now），双主题对比度 ≥3:1（规格依据 `.hermes/plans/2026-08-23_011500-apple-hig-grabber-spec.md`）。

## [Unreleased] — 2026-08-20

### Changed — Table 默认对齐（breaking）

- **`TableHead` / `TableCell` 删除隐式 `last:text-right`**：此前每一行的最后一列被强制右对齐（组件基类硬编码），与官方 Geist 默认全左对齐不符，且让调用方无法让最后一列保持左对齐（`cn()` 后者不覆盖前者时产生幽灵右对齐）。现在默认显式 `text-left align-middle`，右对齐由调用方通过 `align="right"`（item 11 新增）或 `className="text-right"` 显式声明。
  - 迁移：依赖旧隐式右对齐的数值列需自行补 `text-right` 或 `align="right"`（仓库内 docs 表格 demo 的 Charge 数值列已同步补 `text-right`）。

### Fixed — Geist parity 修复（14 项，现场 Playwright 验证）

深度 parity 审计（74 组件全量采集 + 文本层对比 + 三轮子代理独立审核）确认的官方 Vercel Geist 差异修复：

**颜色语义**

- 内联错误文字（`Error`、`ErrorCard`、`Input`、`Select`、`Textarea`、`MenuItem type="error"`、`Snippet type="error"`）：官方 light `#cb2a2f` / dark `#ff6166` 收敛为 `--error-foreground`；不动 `--danger`，destructive 按钮 `#da2f35` 保持不变
- `Entity` 描述：`text-gray-1000` → `text-muted-foreground`
- `JsonView` 标点（`: { } …`）：`text-muted-foreground` → `text-foreground`
- `Textarea` / `Input` 输入文字：`text-foreground` → `text-black dark:text-white`（官方纯黑/纯白）
- `Badge` pill 变体文字：`text-foreground` → `text-black dark:text-white`

**全局 token（1 项）**

- `--link`：`#006efe` → `#0072f5`（官方链接蓝，影响全部 27 处 `text-link`）

**排版（2 项）**

- `FileTree` label：补 `leading-7 text-center`（官方 lineHeight 28px / textAlign center）
- `Video` 时间戳：补 `text-center`

**Demo 配置（2 项）**

- Drawer / Modal 打开按钮：`type="secondary"` → `type="default"`（官方黑底白字）

**响应式（1 项）**

- 文档页 H1：`text-heading-40` → `text-heading-24 sm:text-heading-40`（官方 640px 断点：移动端 24px/32px，桌面 40px/48px）

### Added

- `docs/geist/src/__tests__/parity-regression.test.ts`：14 项修复的源码断言回归测试（vitest），防止未来改动重新引入差异

### Added — 框架扩展（有意偏离官方 Geist）

> 官方 Vercel Geist 无对应实现；为满足本项目/平台可用性要求而添加，逐条注明偏离依据。

- **Button 按压态 `active:`**：官方 Geist 有意不做 `:active` 按压样式，但 Apple HIG「Buttons」硬性要求自定义按钮必须提供按压态（"Always include a press state for a custom button"）。实心变体（default / error / warning）按压 `active:brightness-90`，表面变体（secondary / tertiary）按压 `active:bg-gray-alpha-300`。

- **Button 默认最小宽度（min-w = 高度 × 2.2）**：官方按钮无 min-width，宽度纯由 padding + 文本决定，短标签（尤其中文两字）会缩至宽高比 ~1.25 显得局促。定标官方 Upload 按钮自然比例（small 70/32=2.19、medium 78/36=2.17、large 92/40=2.30），size 四档 min-w 52/70/80/88px；svgOnly 以 `min-w-0` 覆盖保持正方形。长标签不受影响。

- **Progress label / labelPosition（8 方位标签系统）与 animated 过渡（300ms ease-out）**：官方 Progress 无 label props 且填充无过渡（computed transition 0s）。本地扩展服务「Step 2 of 4 · Building」等场景；animated 有 motion-reduce 降级。

### Not changed（YAGNI）

- `--danger` token：保持 `#e5484d`（destructive-action-modal 按钮官方 `#da2f35` 已正确，改全局会破坏）
- `Progress` / `Tooltip` error variant：本地官方快照已展示 `type="error"`；Progress 复用 `--color-destructive`，Tooltip 复用 `--destructive` / `--destructive-foreground`，不引入组件专属色值

**验证：** `pnpm exec tsc --noEmit` ✓ / `pnpm exec oxlint` ✓ / `vitest run` 12 断言 PASS / Playwright 现场验证 17/17 PASS（light 14 + dark 3）+ menu/snippet 修复复测通过。
