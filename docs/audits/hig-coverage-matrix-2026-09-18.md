# HIG 体验审核 — 覆盖矩阵（2026-09-18）

> 配套主报告：`docs/audits/hig-experience-audit-2026-09-18.md`
> 补审报告（二期新增组件）：`docs/audits/hig-experience-audit-2026-09-18-addendum-phase2.md`
> 原始证据：`.scratch/hig-audit-2026-09-18/baseline-and-evidence.md`
> 基线：审核期间仓库被并发写入（`b68d3f0` → `92a5b42` → `5d173ca`）。**复验前必须冻结 revision。**

---

## A. 覆盖口径与统计

### A.1 四类集合

> ⚠️ **数量在审核期间发生变化**（并发会话在审核后段落地了 HIG 二期）。下表给出「审核开始时」与「交付复核时」两组数值；**M2 复核那组以 `src/lib/index.ts` 当前内容为准**。

| 集合 | 审核开始时 | **交付复核时** | 来源 |
|---|---|---|---|
| 包入口导出的组件模块 | 85 | **89**（+`activity-view`、`menu-bar`、`toolbar`、`layout`） | `src/lib/index.ts` |
| 文档注册组件（`COMPONENTS`） | 78 | **83**（+`activity-view`、`menu-bar`、`toolbar`、`safe-area`、`stack`） | `docs/geist/src/data/components.ts`（`safe-area`:379、`stack`:387、`toolbar`:395） |
| 双语指南（slug） | 78 | **83** | `docs/geist/src/content/component-guides/guides-01..18.ts`（`locale: "zh-CN"` 合计 = 83；`guides-05.ts:406,456,507,558,599` + 对应 en 段） |
| examples 演示目录 | 79 | **84**（+5 个新组件目录） | `docs/geist/src/examples/` |
| 文档路由分组 | 4 组 | **5 组**（新增 `layout`） | `docs-routes.ts:6,42` |

**已核实的两个重要事实（修正初审误报）**：
1. `edit-menu` **已注册**（`components.ts:338`）**且有完整双语指南**（`guides-05.ts:355-375` 中文 / `:774-796` 英文）→ `tests/component-doc-completeness.test.ts:24-27` 的「指南数 = 注册数」不变量**未破坏**。
2. 「注册组件数 = 双语指南数 = 78」成立，指南侧**无缺口**；缺口在**注册侧的 7 个已导出组件**（见 A.3）。

### A.2 差异集合

| 差异 | 数量 | 组件 |
|---|---|---|
| 已从包入口导出、但**未注册**文档 | **7** | `SidebarNav`、`Navbar`、`Footer`、`Phone`/`PhoneScreen`、`HamburgerMenu`、`RatingPill`、`SkeletonMask` |
| 有组件文件、但**既未注册也未从包入口导出** | **1** | `SidePanel`（`src/components/ui/side-panel.tsx:155`；仅被 `tests/side-panel-api.test.tsx` 引用） |
| 内部辅助（**有意不导出**，由 `tests/library-docs-export-parity.test.ts:105-110` 守护） | **4 个导出名 / 3 个文件** | `ExpandPanel`、`Grabber`、`PhoneStatusBar`、`PhoneSafariChrome` |
| 其余内部辅助（未导出，无「不得导出」断言） | **5** | `CalendarPanel`、`Feedback*Face`、`FieldError`、`HamburgerIcon`、`LoadingIcon` |
| 有 examples + 专用测试、但未注册 | **1** | `SkeletonMask` |
| 已注册 + 有 examples、但**无专用测试文件** | **7** | `error-card`、`file-tree`、`loading-dots`、`pagination`、`pill`、`show-more`、`spinner` |

> 本表「专用测试」口径 = `tests/` 下存在与组件同名的 `*.test.ts(x)`；上表 7 个组件仅被横切测试间接覆盖（`component-api-registry`、`docs-coverage`、`i-p-public-api` 等）。

### A.3 审核深度分层（本文档的诚实性声明）

| 层级 | 数量 | 组件 | 审核内容 |
|---|---|---|---|
| **L1 深度静态审核** | 25 + 2 | 一期 19：`menu`、`context-menu`（含 Quick Actions）、`edit-menu`、`dots-menu`、`split-button`、`select`、`multi-select`、`combobox`、`command-menu`、`sheet`、`bottom-sheet`、`drawer`、`modal`、`destructive-action-modal`、`tooltip`、`toast`、`hamburger-menu`、`side-panel`、`theme-switcher`；二期 6（补审）：`menu-bar`、`toolbar`、`safe-area`+`stack`（`layout.tsx`）、`activity-view`、`split-button` pull-down 变体 + `src/lib/{i18n,theme}` | 全文阅读；逐项核对触发/关闭契约、状态覆盖、键盘与 ARIA、动效与 token、材质与层级、触屏、i18n |
| **L2 清单级审核** | 其余 67 个导出模块 + 8 个内部辅助 | 见 §B 全表 | 导出/注册/指南/示例/测试链路一致性、i18n key 存在性、`raw-color` 治理、`motion-reduce` 覆盖、双主题 token 使用、`max-sm` 断点、z-index 写法 |
| **L3 未逐项运行验证** | **全部** | — | 浏览器行为、真机、AT、非 Chromium 均**未验证**（见 §E） |

> 本文档中「✔ 已审核·未发现阻断」≠「已验证正确」。它只表示在上述静态维度内未发现可确认缺陷。**任何运行时结论都必须以 §E 的验证补齐为准。**

---

## B. 逐组件覆盖记录

图例：**导出** = 从 `src/lib/index.ts` 导出；**注册** = 在 `docs/geist/src/data/components.ts` 注册；**指南** = 双语指南；**示例** = examples 目录；**结论** = 本轮审核结论。

- `✔` 静态维度内未发现可确认缺陷
- `⚠` 已审核并发现问题（编号见主报告）
- `—` 不适用

### B.1 核心控件（表单与选择）

| 组件 | 导出 | 注册 | 指南 | 示例 | 结论 |
|---|---|---|---|---|---|
| `button` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `input` | ✔ | ✔ | ✔ | ✔ | ✔（`field-error` 关联已抽取） |
| `select` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-005、009、011、013、027 |
| `switch` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `checkbox` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `radio` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `toggle` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `slider` | ✔ | ✔ | ✔ | ✔ | ✔（有 `slider-range-input-clamp` 回归测试） |
| `textarea` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `calendar` | ✔ | ✔ | ✔ | ✔ | ⚠ 内部 `COMBO_MENU_CLASS` 使用 `z-[99999999]` 硬编码（`calendar-classes.ts:89`）→ 并入 HIG-AUD-009 |
| `choicebox` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `clearable-input` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `combobox` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-011、018、025、029、033 |
| `search-input` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `multi-select` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-009、013、016、025、027 |
| `label` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `fieldset` | ✔ | ✔ | ✔ | ✔ | ✔（含 `ErrorText`/`WarningText`/`DisabledWall`） |

### B.2 反馈与状态

| 组件 | 导出 | 注册 | 指南 | 示例 | 结论 |
|---|---|---|---|---|---|
| `toast` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-011、013、014、025、030、031 |
| `tooltip` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-013、015 |
| `progress` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `skeleton` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `skeleton-mask` | ✔ | — | — | ✔ | ⚠ HIG-AUD-023（有导出/示例/测试，但未注册、无独立指南） |
| `spinner` | ✔ | ✔ | ✔ | ✔ | ✔（无专用测试，仅横切覆盖） |
| `loading-dots` | ✔ | ✔ | ✔ | ✔ | ✔（无专用测试） |
| `empty-state` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `error` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `error-card` | ✔ | ✔ | ✔ | ✔ | ✔（无专用测试） |
| `error-boundary` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `feedback` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-009（`feedback.tsx:458` 硬编码 `z-50`） |
| `destructive-action-modal` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-009、010、011、012、013、025、031；**正面：loading + error + 门控是本仓库最完整的破坏性保护实现** |

### B.3 数据展示

| 组件 | 导出 | 注册 | 指南 | 示例 | 结论 |
|---|---|---|---|---|---|
| `table` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `collapse` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `code` / `code-block` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `copy-button` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `description` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `entity` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `json-view` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `snippet` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `file-tree` | ✔ | ✔ | ✔ | ✔ | ✔（无专用测试） |
| `gauge` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `relative-time-card` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `status-dot` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `step-point` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `middle-truncate` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `keyboard-input` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `pill` | ✔ | ✔ | ✔ | ✔ | ✔（无专用测试） |
| `badge` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `avatar` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `rating-pill` | ✔ | — | — | — | ⚠ HIG-AUD-023（唯一「已导出但页面/指南/示例全缺」的组件） |
| `separator` | ✔ | ✔ | ✔ | ✔ | ✔ |

### B.4 导航

| 组件 | 导出 | 注册 | 指南 | 示例 | 结论 |
|---|---|---|---|---|---|
| `breadcrumbs` | ✔ | ✔ | ✔ | ✔ | ✔（`max-sm:overflow-x-auto` 已有） |
| `pagination` | ✔ | ✔ | ✔ | ✔ | ✔（无专用测试） |
| `link` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `sidebar-nav` | ✔ | — | — | — | ⚠ HIG-AUD-023 |
| `navbar` | ✔ | — | — | — | ⚠ HIG-AUD-023 |
| `footer` | ✔ | — | — | — | ⚠ HIG-AUD-023 |
| `command-menu` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-009、012、026、030 |
| `hamburger-menu` | ✔ | — | — | — | ⚠ HIG-AUD-008、017、023、025 |
| `menu` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-011、012、013、025 |
| `dots-menu` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-011、012、013、032 |
| `context-menu` | ✔ | ✔ | ✔ | ✔ | ⚠ **HIG-AUD-001（P0，✅ 已修复）**、**002（P0，✅ 已修复）**、005、009、010、011、012、025、031 |
| `edit-menu` | ✔ | ✔ | ✔ | ✔ | ⚠ **HIG-AUD-004（P0，✅ 已修复）**、011、013、019、020、021、025、030、034 |
| `split-button` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-011、012、018、025 |
| `theme-switcher` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-013、019 |
| `command-menu`（搜索模式） | — | — | ✔ | ✔ | ✔ `docs-shell.tsx:38,90,102` 的 `"toolbar"` 是搜索模式名，非组件 |

### B.5 浮层容器

| 组件 | 导出 | 注册 | 指南 | 示例 | 结论 |
|---|---|---|---|---|---|
| `sheet` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-010（正面：overlay 已 token 化）、012；**面板缺 `safe-area-inset-bottom`** |
| `drawer` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-010、012、019；**正面：焦点归还实现带竞态注释，是本仓库的范本** |
| `bottom-sheet` | ✔ | ✔ | ✔ | ✔ | ⚠ **HIG-AUD-003（P0，✅ 已修复）**、008、010、012、018、022、026 |
| `side-panel` | — | — | — | — | ⚠ ~~HIG-AUD-006、007~~（**已于 2026-09-22 修复并运行确认**，增补 §5E）、024（未导出、无注册/指南/示例） |
| `modal` | ✔ | ✔ | ✔ | ✔ | ⚠ HIG-AUD-010、026；**正面：唯一进出场对称 + token 完整 + `aria-modal`** |
| `context-card` | ✔ | ✔ | ✔ | ✔ | ✔（进出场对称 + `zoom-out-95` ✓） |
| `popover`（`feedback` 内） | — | — | — | — | ⚠ HIG-AUD-009 |

### B.6 移动与设备

| 组件 | 导出 | 注册 | 指南 | 示例 | 结论 |
|---|---|---|---|---|---|
| `device` | ✔ | ✔ | ✔ | ✔ | ✔（`phone.md` → `device` 别名见 `docs-routes.ts:163`） |
| `phone` / `PhoneScreen` | ✔ | — | — | — | ⚠ HIG-AUD-023（由 `device` 页面代表） |
| `browser` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `book` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `video` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `project-banner` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `hamburger-icon`（内部） | — | — | — | — | ✔ 内部辅助 |
| `phone-chrome`（内部，`PhoneStatusBar`/`PhoneSafariChrome`） | — | — | — | — | ✔ 内部辅助，受「不得导出」断言守护 |

### B.7 布局与高级

| 组件 | 导出 | 注册 | 指南 | 示例 | 结论 |
|---|---|---|---|---|---|
| `grid` | ✔ | ✔ | ✔ | ✔ | ✔（`grid.module.css` 辅助） |
| `scroller` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `continuous-surface` | ✔ | ✔ | ✔ | ✔ | ✔（有像素级 e2e `continuous-surface-review.spec.ts`） |
| `tabs` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `collapse` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `note` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `banner` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `show-more` | ✔ | ✔ | ✔ | ✔ | ✔（无专用测试） |
| `load-more-button` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `text-with-copy-button` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `copy-button` | ✔ | ✔ | ✔ | ✔ | ✔ |
| `json-view` | ✔ | ✔ | ✔ | ✔ | ✔ |

### B.8 内部辅助（未从包入口导出，非缺陷）

| 文件 | 结论 |
|---|---|
| `calendar-panel.tsx` | ✔ 内部辅助（`calendar` 消费） |
| `expand-panel.tsx` | ✔ 内部辅助；⚠ `expand-panel.tsx:125` `bg-black/40`、`:154` `shadow-lg` 字面量 → 并入 HIG-AUD-010 |
| `feedback-faces.tsx` | ✔ 内部辅助（`rating-pill` 消费） |
| `field-error.tsx` | ✔ 内部辅助（`input`/`select`/`textarea` 消费） |
| `grabber.tsx` | ⚠ HIG-AUD-008（`t("调整高度")`）、022（`role="slider"` 无键盘）；**正面：`:44-46` 记录实测对比度并说明 token 取舍** |
| `hamburger-icon.tsx` | ✔ 内部辅助 |
| `loading-icon.tsx` | ✔ 内部辅助（`button` 消费） |
| `phone-chrome.tsx` | ✔ 内部辅助 |
| `side-panel.tsx` | ⚠ HIG-AUD-006、007（**已于 2026-09-22 修复并运行确认**，增补 §5E）、024（未导出，但被测试与 design-gate 当公共组件） |

### B.9 复核后新增的 HIG 能力组件（**✅ 已补审**）

这些实现在我完成 L1 深度静态审核**之后**由并发会话落地并提交。它们已由补充报告 `hig-experience-audit-2026-09-18-addendum-phase2.md` 按同一维度完成深度静态审核，**审核盲区已关闭**。逐项结论见该报告的 §3.1–3.3 与 §4（正面对照）。

| 组件 / 文件 | 导出 | 注册 | 指南 | 已知结论 |
|---|---|---|---|---|
| `activity-view.tsx`（`ActivityView`） | ✔ `src/lib/index.ts:97` | ✔ `components.ts:352-363` | ✔ `guides-05.ts:406,1058` | ⚠ **仅**发现 HIG-AUD-005（`:134` `#ee0000` 未登记）；其余维度**未审核** |
| `menu-bar.tsx`（`MenuBar` 等 10 个导出） | ✔ `:98-99` | ✔ `components.ts:365-377` | ✔ `guides-05.ts:456,1110` | **未审核** |
| `toolbar.tsx`（`Toolbar`/`ToolbarGroup`/`ToolbarItem`） | ✔ `:100-101` | ✔ `components.ts:395-398` | ✔ `guides-05.ts:507,1163` | **未审核** |
| `layout.tsx`（`SafeArea` / `Stack`） | ✔ `:102-103` | ✔ `components.ts:379-393` | ✔ `guides-05.ts:558,599,1216,1259` | **未审核** |
| `split-button.tsx` pull-down 变体 | ✔ | ✔ | ✔ | **未审核**；HIG 正文要求破坏性项二次确认 → HIG-AUD-037 |
| `examples/select/pop-up-button-*.example.tsx` | — | — | — | 文档对齐，方向与 HIG 正文一致 |

> 注：这些文件的**存在与注册状态**已由我在复核时逐一核实（见「证据」列行号）；未核实的是它们的**行为契约、状态覆盖、键盘、动效、材质、可访问性**。

---

## C. HIG 能力矩阵

图例：**已覆盖** / **部分覆盖** / **缺失** / **原生专属不适用** / **待验证**（环境不支持，不计为缺陷）

### C.1 基础原则

| HIG 原则 | 状态 | 证据与说明 |
|---|---|---|
| 信息层级与排版节奏 | 已覆盖 | token 化 `--uni-text-*`（`index.css:1472+`）；`tests/docs-typography-rhythm.test.tsx`、`tests/typography-tokens.test.ts` |
| 视觉层级（z-order / 模态栈） | **部分覆盖** | 有 `--uni-z-*` 体系但**存在硬编码与缺失三态** → HIG-AUD-009、001 |
| 一致性（同族组件同一语言） | **部分覆盖** | overlay 5 种写法、DotsMenu/Menu 表面不一致、阴影字面量 → HIG-AUD-010、032、033 |
| 内容优先 / 装饰克制 | **部分覆盖** | 模糊使用点 2 处（`destructive-action-modal`、Quick Actions），但**用途边界未文档化** → HIG-AUD-035 |
| 直接操纵（跟随手指） | **部分覆盖** | Drawer 下滑、BottomSheet 拖拽档位已实现；但 BottomSheet 手势范围过宽 → HIG-AUD-003 |
| 减少动态效果 | **部分覆盖** | 有全局兜底 + 28/94 文件组件级处理 → HIG-AUD-019；`待验证`：无 Playwright 全局 reduced-motion project |
| 反馈的必要性（不过量/不缺失） | **部分覆盖** | 缺失侧：浮层退场动画缺失、loading 状态普遍缺；过量侧：Quick Actions 全屏模糊 + EditMenu 无退场闪烁 → HIG-AUD-011、025、034 |
| 原生外观不作唯一答案 | 已遵循 | 本报告未以 Apple 拟真外观为判定标准；`PLAN-HIG-COMPONENTS.md:26` 已确认「Geist 风格 + HIG 行为，不做 Apple 拟真」 |

### C.2 HIG 组件能力（八项 + 横向）

| HIG 页面 | 状态 | 落点 | 结论 |
|---|---|---|---|
| Layout and Organization | **已实现**（复核后） | `docs-routes.ts:6,42,75,91,119,125`；`src/components/ui/layout.tsx`（`SafeArea`/`Stack`）；注册 `components.ts:379-393` | **已补审**：`SafeArea` 的 `max(档位, env())` 是正确的 HIG 落地（加分项）；问题为 HIG-AUD-045、046 |
| Edit Menus | **已实现（含 1 个 P0 ✅ 已于 2026-09-21 修复 + 多个 P1）** | `src/components/ui/edit-menu.tsx` | 形态/「移除不适用的命令」/双语/i18n/材质到位；键盘与定位有缺口 → HIG-AUD-004、020、021、036；文档过度承诺 → HIG-DOC-05(b) |
| Home Screen Quick Actions | **已实现，形态不完整** | `context-menu.tsx:118-241` | 竖排大图标 + 副标题 + 破坏性项已具备；**默认遮罩压住内容（P0，✅ 已于 2026-09-21 修复）**；按 HIG 正文缺「系统尾项」；HIG 正文未提及模糊/图标动画 → HIG-AUD-001、037、HIG-GAP-07 |
| Pop-up Buttons | **已实现（= Select + 文档对齐）** | `select.tsx`；示例 `examples/select/pop-up-button-*.example.tsx` | 整合方向与 HIG 正文一致（Pop-up 承载互斥选项，动作类走 Pull-down）；移动端形态缺口 → HIG-AUD-027 |
| Pull-Down Buttons | **已实现**（复核后） | `split-button.tsx` 变体；`tests/pull-down-button-api.test.ts` | **已补审**：默认角正确、保持 `role="menu"` 语义（加分项）；缺破坏性二次确认、退场动画不对称、测试为字符串契约 → HIG-AUD-037、011/012、041、048 |
| The Menu Bar | **已实现**（复核后） | `src/components/ui/menu-bar.tsx`；`src/lib/index.ts:98-99`；注册 `components.ts:365-377` | **已补审**：复用 Radix Menubar（APG 键盘模型，加分项）；~~菜单无可用高度约束致长菜单尾部不可达（P1）~~（**HIG-AUD-038 已于 2026-09-22 修复并运行确认**，增补 §5D）、层级偏低、触控目标 28px → HIG-AUD-044、013、047 |
| Toolbars | **已实现**（复核后） | `src/components/ui/toolbar.tsx`；`src/lib/index.ts:100-101`；注册 `components.ts:395-398` | **已补审**：24px 滞回与组级折叠是好设计（加分项）；**折叠静默丢弃非 ToolbarItem 内容且 `disabled` 失效（P1）** → HIG-AUD-039、050、013 |
| Activity Views | **已实现**（复核后） | `src/components/ui/activity-view.tsx`；`src/lib/index.ts:97,104`；注册 `components.ts:352-363` | **已补审**：操作行 44px、一次性动作语义、不在面板内做进度提示均符合 HIG 正文（加分项）；**面板无可访问名称（P1）**、治理违规、滚动无提示、固定单档 → HIG-AUD-040、005、042、043、049 |
| 横向：Menus / 按钮 / 选择控件 / 文本框 / 搜索 | 已覆盖 | menu / dots-menu / split-button / select / checkbox / radio / switch / toggle / slider / input / textarea / search-input / combobox / multi-select | 形态与状态基本齐备；缺口集中在浮层状态覆盖（loading/empty）与触控目标 → HIG-AUD-013、025 |
| 横向：Sheets / Alerts / Popovers | 部分覆盖 | sheet / drawer / bottom-sheet / side-panel / modal / destructive-action-modal / context-card / tooltip | 焦点管理与破坏性保护是强项；一致性是弱项 → HIG-AUD-006、007、009、010 |
| 横向：Notifications | 部分覆盖 | `toast.tsx` | kind 齐备；计时不可暂停、隐藏项留在 Tab 序列 → HIG-AUD-014 |
| 横向：Progress / Loading | 已覆盖 | progress / spinner / loading-dots / skeleton / skeleton-mask | 组件齐备；但浮层内的 loading 用法缺失 → HIG-AUD-025 |
| 横向：Sharing | 部分覆盖（进行中） | `activity-view.tsx` 未来的 targets/actions | 未定稿 |

### C.3 布局

| 维度 | 状态 | 说明 |
|---|---|---|
| 信息层级 / 阅读节奏 | 已覆盖 | typography token + 节奏测试 |
| 对齐与留白（一致边距） | 已覆盖 | `control-layout.ts` 统一尺寸 API；`docs-block-spacing` 测试 |
| 响应式重排 | 已覆盖（文档站） | e2e 六档视口 320/390/768/1024/1100/1440 × 双主题 × 全量注册路由 |
| 响应式（组件级） | **部分覆盖** | 仅 8 个文件有 `max-sm`/`max-grid-sm`/`max-modal` → HIG-AUD-029 |
| 长内容 | 已覆盖 | `middle-truncate`、`scroller`、`overflow` 白名单（e2e 断言局部滚动 owner） |
| 缩放（200%） | **待验证** | 仓库无 harness → HIG-VER-01 |
| 安全区域（safe-area） | **部分覆盖** | `drawer`/`bottom-sheet`/`hamburger-menu` 有 `env(safe-area-inset-*)`；**`sheet` 缺**（HIG-AUD-010 相关） |
| 浮层避让（碰撞翻转） | **部分覆盖** | `combobox` 已迁移 Radix Popover 支持碰撞翻转（`248f819`）；`edit-menu` 手写翻转**缺垂直下边界 clamp** → HIG-AUD-021 |
| 滚动条补偿 | **部分覆盖** | 无 `scrollbar-gutter`（唯一在文档侧栏） → HIG-AUD-028 |
| 视口单位（`vh` vs `dvh`） | **部分覆盖** | 3 处用 `vh` → HIG-AUD-026 |
| 动态字体（Dynamic Type 等价） | **原生专属不适用 / 待验证** | Web 无系统 Dynamic Type；已有字号 token 但**未验证用户浏览器缩放字号（`rem` 放大）下的布局** → 归入 HIG-VER-01 |

### C.4 输入方式

| 输入方式 | 状态 | 说明 |
|---|---|---|
| 鼠标（hover / click / 右键） | 已覆盖 | 右键菜单、hover 态、focus-ring 齐备 |
| 键盘（Tab / 方向键 / Enter / Space） | **部分覆盖** | Radix 覆盖大部分；**2 处硬缺口**：MultiSelect Tab 循环、Grabber `slider` 无键盘 → HIG-AUD-016、022（ContextMenu 无打开路径、EditMenu 不可达已于 2026-09-21 修复：002、004） |
| 键盘（Escape 关闭） | 已覆盖 | L1 组件均由 Radix 或自实现覆盖（EditMenu 原只把 Escape 挂在胶囊自身，2026-09-21 改为文档级监听，见 HIG-AUD-004） |
| 焦点可见性 | 已覆盖 | `focus-ring` utility + `focus-visible` 统一 |
| 焦点恢复 | **部分覆盖** | 6 个组件自实现（drawer/modal/bottom-sheet/command-menu/hamburger/destructive），**SidePanel 漏做**（→ HIG-AUD-006，**已于 2026-09-22 修复**，自实现归还并入此列，共 7 个，增补 §5E） |
| 触屏（tap） | **部分覆盖** | 无 Playwright 触屏仿真证据 → HIG-VER-03 |
| 触屏（长按） | **部分覆盖** | Quick Actions 依赖 Radix 内建 700ms 长按；遮罩层压住内容（✅ 已于 2026-09-21 修复）→ HIG-AUD-001；仍无 Playwright 触屏仿真证据 |
| 触屏（手势：拖拽/下滑/滚动） | **部分覆盖** | Drawer 下滑 ✓、BottomSheet 拖档 ✓（**吞内部滚动已由 `1866616` 修复**，见 HIG-AUD-003）；EditMenu 触屏竞态仍开放 → HIG-AUD-020 |
| 触控目标尺寸 | **部分覆盖** | 多数组件 < 44pt（部分 < 32px） → HIG-AUD-013 |
| 滚动锁定 | 已覆盖 | Radix `RemoveScroll` + `index.css:2242-2244` 兜底；无 `scrollbar-gutter` → HIG-AUD-028 |
| 手势冲突（长按选择文本 vs 长按菜单） | **部分覆盖** | Radix 设了 `-webkit-touch-callout: none`；EditMenu **未设** → HIG-AUD-020 |

### C.5 反馈与任务流程

| 流程能力 | 状态 | 说明 |
|---|---|---|
| 任务完成反馈 | 已覆盖 | Toast（4 kind）、`show-more`、`load-more-button`（`aria-busy`） |
| 加载中 | **部分覆盖** | 有 `progress`/`spinner`/`skeleton`；**浮层内 loading 普遍缺失** → HIG-AUD-025 |
| 错误 | 已覆盖 | `error`/`error-card`/`error-boundary`/`field-error`/`Fieldset` 的 `ErrorText` |
| 空状态 | **部分覆盖** | `empty-state` 组件 + `combobox`/`command-menu` 有空态；**其他列表型浮层无空态** → HIG-AUD-025 |
| 破坏性操作保护 | **已覆盖（最强项）** | `destructive-action-modal`：输入验证门控 + `loading` + `role="alert"` 错误 + `label[for]`/`aria-labelledby` 双关联 + sticky footer |
| 撤销 | 已覆盖 | `useToasts` 的 `onUndoAction` + 7000ms 窗口 |
| 搜索任务流 | 已覆盖 | `command-menu`（⌘K 全局搜索，但**未绑定快捷键**）+ `search-input` + `hamburger-menu` 搜索模式（Ctrl K 提示**同样未绑定**） |
| 编辑任务流 | **部分覆盖** | `edit-menu` 键盘路径已补齐（✅ 2026-09-21，HIG-AUD-004）：焦点进入 `role="toolbar"` 取代原计划的 `aria-live` 方案；触屏竞态仍开放 → HIG-AUD-020 |
| 分享任务流 | 部分覆盖（进行中） | ActivityView 未定稿 |
| 导航任务流 | **部分覆盖** | 无「路由变化关闭浮层」 → HIG-AUD-017 |
| 多浮层组合 | **部分覆盖** | 层级不统一 → HIG-AUD-009；e2e 已有 tooltip/menu/toast + toast/modal 的命中检测可扩展 |

---

## D. 问题 × 组件分布（便于合并修复）

| 问题编号 | 严重度 | 受影响组件 |
|---|---|---|
| HIG-AUD-001 | P0（✅ 已于 2026-09-21 修复） | `context-menu`（Quick Actions 变体） |
| HIG-AUD-002 | P0（✅ 已于 2026-09-21 修复） | `context-menu` |
| HIG-AUD-003 | P0（✅ 已于 2026-09-21 修复） | `bottom-sheet` |
| HIG-AUD-004 | P0（✅ 已于 2026-09-21 修复） | `edit-menu` |
| HIG-AUD-005 | **P0 判定已撤回**（主报告改为 P2 等价；实质残留改记为 HIG-AUD-052） | `context-menu`、`activity-view`、（迁移源）`select` |
| HIG-AUD-051 | P0（✅ 已于 2026-09-21 修复） | `context-menu`（Quick Actions 变体） |
| HIG-AUD-006 | P1 | `side-panel`——**已修复（2026-09-22，运行确认，增补 §5E）** |
| HIG-AUD-007 | P1 | `side-panel`——**已修复（2026-09-22，运行确认，增补 §5E）** |
| HIG-AUD-008 | P1 | `hamburger-menu`、`grabber`、（根因）`framework-messages`/`i18n` |
| HIG-AUD-009 | P1 | `destructive-action-modal`、`command-menu`、`multi-select`、`context-menu`、`feedback`、`calendar` |
| HIG-AUD-010 | P1 | `sheet`、`side-panel`、`drawer`、`bottom-sheet`、`expand-panel`、`context-menu`、`destructive-action-modal`、`modal`、`command-menu` |
| HIG-AUD-011 | P1 | `menu`、`context-menu`、`dots-menu`、`split-button`、`select`、`toast`、`edit-menu` |
| HIG-AUD-012 | P1 | `menu`、`context-menu`、`dots-menu`、`split-button`、`drawer`、`bottom-sheet`、`command-menu`、`destructive-action-modal`、`sheet` |
| HIG-AUD-013 | P1 | `menu`、`dots-menu`、`select`、`multi-select`、`toast`、`theme-switcher`、`hamburger-menu`、`destructive-action-modal`、`edit-menu`（增补扩充：`menu-bar` Trigger、`toolbar` Item）——**已修复（2026-09-23，`pointer-coarse:` 触屏命中区 ≥44×44 + e2e 9 passed，增补 §5J）** |
| HIG-AUD-014 | P1 | `toast` |
| HIG-AUD-015 | P1 | `tooltip` |
| HIG-AUD-016 | P1 | `multi-select` |
| HIG-AUD-017 | P1 | `hamburger-menu`、`context-menu`（href 项）、全部浮层 |
| HIG-AUD-018 | P1 | `combobox`、`bottom-sheet`、`toast`、`split-button` |
| HIG-AUD-019 | P1 | `drawer`、`theme-switcher`、`combobox`、+ 66 个文件无组件级处理 |
| HIG-AUD-020 | P1 | `edit-menu` |
| HIG-AUD-021 | P1 | `edit-menu` |
| HIG-AUD-022 | P1 | `grabber` / `bottom-sheet` |
| HIG-AUD-023 | P1 | `sidebar-nav`、`navbar`、`footer`、`phone`、`hamburger-menu`、`rating-pill`、`skeleton-mask` |
| HIG-AUD-024 | P1 | `side-panel` |
| HIG-AUD-025 | P2 | `menu`、`context-menu`、`edit-menu`、`dots-menu`、`split-button`、`multi-select`、`sheet`、`bottom-sheet`、`drawer`、`modal`、`tooltip`、`hamburger-menu`、`side-panel`、`theme-switcher` |
| HIG-AUD-026 | P2 | `command-menu`、`modal`、`destructive-action-modal` |
| HIG-AUD-027 | P2 | `select`、`multi-select` |
| HIG-AUD-028 | P2 | 全局（浮层） |
| HIG-AUD-029 | P2 | `select`、`combobox`、`drawer`、`bottom-sheet`、`side-panel`、`toast`、`tooltip`、`edit-menu` |
| HIG-AUD-030 | P2 | `toast`、`command-menu`、`edit-menu` |
| HIG-AUD-031 | P3 | `destructive-action-modal`、`toast`、`context-menu`、`activity-view` |
| HIG-AUD-032 | P3 | `dots-menu` |
| HIG-AUD-033 | P3 | `combobox` |
| HIG-AUD-034 | P3 | `edit-menu` |
| HIG-AUD-035 | P3 | `destructive-action-modal`、`context-menu`、`sheet`、`side-panel`、`drawer`、`bottom-sheet`、`modal`、`command-menu` |
| HIG-AUD-036 | P1 | `edit-menu`（指针设备下的形态与 HIG iPadOS 指引不同） |
| HIG-AUD-037 | P1 | `context-menu`（Quick Actions）、`split-button`（pull-down 变体）、`activity-view`——**已修复（2026-09-23，运行确认 + 永久 e2e，增补 §5I）** |
| HIG-AUD-038 | P1 | `menu-bar`（菜单无可用高度约束 → 长菜单尾部不可达）——**已修复（2026-09-22，运行确认，增补 §5D）** |
| HIG-AUD-039 | P1 | `toolbar`（折叠静默丢弃非 ToolbarItem 内容；`disabled` 在溢出菜单中失效）——**已修复（2026-09-23，运行确认，增补 §5H）** |
| HIG-AUD-040 | P1 | `activity-view`（+ 根因在 `bottom-sheet`：面板无可访问名称）——**已修复（2026-09-23，运行确认，增补 §5G）** |
| HIG-AUD-041 | P2 | 二期 5 个测试文件（`menu-bar-api` / `toolbar-api` / `layout-api` / `activity-view-api` / `pull-down-button-api`） |
| HIG-AUD-042 | P2 | `activity-view`（目标横向滚动无边缘提示） |
| HIG-AUD-043 | P2 | `activity-view`（固定 0.6 单档、禁用扩展） |
| HIG-AUD-044 | P2 | `menu-bar`（`--uni-z-menu`=50 低于 drawer/modal；根容器无溢出提示） |
| HIG-AUD-045 | P3 | `safe-area`（`style` 可覆盖安全区内边距） |
| HIG-AUD-046 | P3 | `safe-area`、`stack`（两份平行档位表） |
| HIG-AUD-047 | P3 | `menu-bar`（快捷键为不可用承诺） |
| HIG-AUD-048 | P3 | `split-button`（pull-down 允许卡片出现在按钮上方） |
| HIG-AUD-049 | P3 | `activity-view`（图标瓦片 48px vs HIG 正文 ~70×70，Web 适配判断） |
| HIG-AUD-050 | P3 | `toolbar`（Fragment 包裹分组时收集失败）——**已修复（2026-09-23，随 039 同代码面闭环，增补 §5H）** |
| HIG-AUD-055 | P2 | 文档站移动导航面板（`hamburger-menu` + `expand-panel`，经 `docs-shell` 组装）：关闭按钮与 topbar 触发按钮重复 / belowTopbar 贴合三边的圆角 / 内容内边距贴边——**已修复（2026-09-23，运行确认，增补 §5F）** |

**共享根因映射**（主报告 §5）：R1 → 001/009/010/035；R2 → 005/010/031/032/033；R3 → 011/012/019/034；R4 → 002/004/015/016/022；R5 → 006/007；R6 → 003；R7 → 008；R8 → 013/029；R9 → 017/018/025；R10 → HIG-AUD-BASE-01/HIG-DOC-04/005。

---

## E. 未验证清单（明确原因，不计为已确认缺陷）

| 编号 | 未验证项 | 原因 | 恢复动作 |
|---|---|---|---|
| HIG-VER-01 | 200% 缩放 / 浏览器字号放大 | 仓库无 harness | 新增 Playwright 用例（`deviceScaleFactor` 或 CSS `zoom`；字号侧用 `page.addStyleTag` 提升根字号） |
| HIG-VER-02 | 强制颜色 `forced-colors: active` | 仓库无 harness | `emulateMedia({ forcedColors: "active" })`，覆盖按钮/焦点环/图标/分隔线 |
| HIG-VER-03 | 触屏模拟（tap / 长按 / 拖拽 / 下拉） | 无 `hasTouch`/`isMobile` context，无触摸事件派发 | 新增 context + `dispatchTouchEvent` |
| HIG-VER-04 | WebKit / Firefox | `playwright.config.ts:20` 仅 `browserName: "chromium"`，无 `projects` | 增 projects；**结果标注为模拟，不等同真机** |
| HIG-VER-05 | reduced-motion 全量 | 仅 `docs-feedback-typography.spec.ts:252` 一处用例 | 扩展为浮层矩阵 |
| HIG-VER-06 | 截图审计视口一致性 | `capture-visual-matrix.mjs` 视口 375/768/1440/1920 ≠ e2e 六档 | 对齐至 320/390/768/1024/1100/1440 |
| ~~HIG-VER-07~~ | ~~HIG 官方正文 / 访问日期~~ | ✅ **已解决**：改用 chromium 真实渲染，11 页正文 + Apple 变更日志日期全部取得（主报告 §3、§3.1） | — |
| HIG-VER-08 | ~~命令退出码（test / typecheck / build / docs:llm:check / test:docs-layout）~~ | ✅ **已解决（2026-09-18 第三轮 @ `834f19d8`）**：typecheck / docs:llm:check / build 全部 exit 0；`pnpm test` exit 1（9 稳定基线失败 + 2 flaky/环境）；`test:docs-layout` exit 1（113/116 passed，1 failed = 新发现 HIG-AUD-053，2 flaky = 冷启动波动）。首跑被 IDE safe-delete shim 拦截（outputDir 1999 文件超 500 阈值），预清后正常——环境干扰非产品缺陷。日志：`.scratch/hig-audit-2026-09-18/cmdlogs/`。**2026-09-21 复核**：`pnpm test` = 228 files / 1424 tests passed（exit 0）；`pnpm run lint`（oxlint）= 0 errors / 16 warnings（exit 0）；`test:docs-layout` 仍 exit 1（HIG-AUD-053） | — |
| HIG-VER-09 | HIG-AUD-001 / 002 / 003 / 004 / 020 的浏览器确认 | **大部分解决（2026-09-21）**：001、002、004 已随修复在浏览器复核（002 键盘路径与右键菜单位置逐像素一致、004 键盘选区后焦点入首个可用项且单 Tab 停靠；001 遮罩 z 200 < 菜单 z 2001、Escape 关闭后同页 4 示例仍可用）；003 已由 `1866616` 修复并复核（手势只挂 `<Grabber>`，内容区可滚动）；020 仍待 | 仅剩 EditMenu 触屏竞态（020）补命中测试 |
| HIG-VER-13 | 浮层**打开态**截图 / 动效中间帧 / 对比度像素测量 | 本轮 48 张为 fullPage 静止态 | Playwright 打开态 viewport 截图 + computed 值断言 |
| ~~HIG-VER-14~~ | ~~复核后新增的 6 项 HIG 能力组件的深度审核~~ | ✅ **已解决**：补审完成，新增 HIG-AUD-038~050 | 见 `hig-experience-audit-2026-09-18-addendum-phase2.md` |
| HIG-VER-15 | 二期组件的**运行验证**（MenuBar 键盘模型与长菜单溢出、Toolbar 折叠与 `disabled` 透传、ActivityView 可访问名称、pull-down 定位与展开动画） | **部分解决（2026-09-18 第二轮）**：长菜单溢出（HIG-AUD-038）、折叠与 disabled 透传（039）、可访问名称（040）、破坏性确认（037）已运行确认（补充报告 §5A）；MenuBar 键盘模型、pull-down 定位与动画仍待 | 复用 `scripts/runtime-interaction-audit.mjs` 的真实 CDP 输入范式各加一条 |
| HIG-VER-10 | 真实 iOS Safari / VoiceOver / 屏幕阅读器 | 环境不支持 | 真机验证；**不得**用模拟替代 |
| HIG-VER-11 | 暗色/亮色对比度实测（浮层文字、破坏性红带、focus ring） | 无对比度采集；仅 `grabber.tsx:44-46` 有历史实测记录 | 复用 `tests/e2e/docs-layout.spec.ts` 的 computed 值断言手法或 axe 类工具 |
| HIG-VER-12 | 视觉回归基线 | 无受版本控制的截图基线（`capture-visual-matrix.mjs` 输出到仓库外目录，不入 Git） | 建立可复现的截图基线流程；`README` 截图集只覆盖文档站页面，不覆盖组件状态 |

---

## F. 复验入口

```powershell
cd d:/Projects/GitHub/HUSTRadio/unitary-ui
git rev-parse HEAD                        # 冻结基线
pnpm exec vitest run tests/raw-color-governance.test.ts   # HIG-AUD-005 撤回依据（实测为绿）/ HIG-AUD-052 棘轮缺口入口
pnpm test                                 # 全量契约
pnpm run typecheck; pnpm run build
pnpm run docs:llm:generate; pnpm run docs:llm:check
pnpm run test:docs-layout                 # 六档视口 × 双主题 × 全量路由

# 本轮新增的浏览器采集（可复现）
node .scratch/hig-audit-2026-09-18/fetch-hig-sources.mjs        # HIG 正文（JS 渲染）
pnpm exec vp dev docs/geist --host 127.0.0.1 --port 5211 --strictPort   # 起本地文档站
node .scratch/hig-audit-2026-09-18/capture-docs-screenshots.mjs # 48 张截图
node .scratch/hig-audit-2026-09-18/verify-quick-actions.mjs     # 已被下方脚本取代（第一轮结果不确定的原因见主报告 HIG-AUD-051）

# 第二轮运行验证（2026-09-18，自包含：起全新 server → 验证 → taskkill 清理）
node .scratch/hig-audit-2026-09-18/verify-fresh-server.mjs      # HIG-AUD-037/038/039/040 运行确认 + 051 复现
node .scratch/hig-audit-2026-09-18/repro-slot-error.mjs         # HIG-AUD-051 定位（逐示例隔离 + 错误时序）

# 第三轮：一次性采集全部命令退出码（自包含：每步落盘 cmdlogs/，中断可恢复）
node .scratch/hig-audit-2026-09-18/collect-all-exit-codes.mjs   # gitlog+typecheck+docs:llm:check+build+清5211+test:docs-layout
node .scratch/hig-audit-2026-09-18/retry-failed-cmds.mjs        # （首跑两项失败时的修复重试：~分隔符 + 预清 outputDir）
node .scratch/hig-audit-2026-09-18/diagnose-command-search.mjs  # HIG-AUD-053 候选顺序诊断（可选补充；静态链已闭环）

# 治理测试（HIG-AUD-005 撤回依据 / HIG-AUD-052 棘轮缺口复现入口）
pnpm exec vitest run tests/raw-color-governance.test.ts         # 实测 4/4 passed, exit 0
```
