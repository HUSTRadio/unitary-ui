# Unitary UI · HIG 工作交付书（给下一个 Agent）

- **生成时间**：2026-09-21
- **工作区**：`d:/Projects/GitHub/HUSTRadio/unitary-ui`
- **仓库状态**：分支 `master`，领先 `origin/master` **53** commits；**0 staged**、**>36 处未提交改动**（本轮新增主报告 / 矩阵 / 本交付书 / `edit-menu.tsx` / 回归测试等；开工时以 `git status` 为准），另有未跟踪文件（见 §5）
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
| `docs/audits/hig-experience-audit-2026-09-18.md` | **703** | 主台账，53 条问题的主要来源 |
| `docs/audits/hig-coverage-matrix-2026-09-18.md` | 350 | 覆盖矩阵 + `HIG-VER-*` 验证清单 §E |
| `docs/audits/hig-experience-audit-2026-09-18-addendum-phase2.md` | 201 | 二期新增 13 条 |
| `docs/audits/geist-component-and-responsive-remediation-design.md` | 277 | 既有整改门禁台账（与 HIG 交叉点仅 3 处） |
| `PLAN-HIG-COMPONENTS.md` | 262 | 计划与验收标准 |
| `docs/audits/motion-duration-audit-2026-09-20.md` | 55 | 动效债务 |
| `docs/audits/tests-typecheck-debt.md` | 23 | 类型债务 |
| **审核+计划小计** | **≈ 1 870** | 一次全读 ≈ 数万 token 量级 |
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
| 三份审核文档已同步标注 | 主报告、增补、矩阵均已改；原「修复前证据」段落**保留作对照**，仅加注「行号取自修复前版本」 |
| 临时复现脚本已删除 | `tests/e2e/tmp-quickactions-audit.spec.ts` 已不存在（`tests/e2e/` 剩 5 个文件）；本轮视觉核查脚本（`.scratch/visual-audit.mjs`、`probe-*.mjs`）已删除，`.scratch/` 整体由 `.gitignore:22` 忽略 |
| 已验证明令 | `pnpm run typecheck` → `tsc -b`，**exit 0**；`pnpm test` 全量 **228 files / 1424 tests passed，exit 0**；`pnpm run lint`（oxlint）→ **0 errors / 16 warnings，exit 0**；定向 `vitest run docs-i18n-parity + component-doc-completeness + docs-showcode + quick-actions-api` → **4 files / 16 tests passed，exit 0** |

---

## 2. 剩余工作量总账

| 口径 | 总数 | 已完成 | **剩余** |
|---|---|---|---|
| **HIG-AUD 问题（主报告 ∪ 增补 并集）** | **53** | 5（001、002、003、004、051） | **48** |
| ├ P0 | 6（含 1 条判定撤回） | 5 | **0** |
| ├ P1 | 24 | 0 | **24** |
| ├ P2 | 12 | 0 | **12** |
| └ P3 | 11 | 0 | **11** |
| **PLAN-HIG-COMPONENTS 交付项** | **90** | 67 完成 / 18 部分 / 5 缺失 | **23** |
| **债务台账（类型 9 + 动效 8 + 测试 1）** | **18**（可执行 13） | 0 | **18** |
| **`HIG-VER-*` 验证项** | 见 §9（未逐条计数，不臆造） | 1 | 余量未闭环 |

计划完成度三口径（子代理统计，附证据链）：**产物存在性 ≈ 93%**、**加权 ≈ 84%**、**逐项严格判定 ≈ 74%**。三者必须与「验证缺口」一起读，否则会高估。

---

## 3. 剩余清单（按批次）

### 批次 A：开放 P0（3 条）— ✅ 已于 2026-09-21 全部关闭

| ID | 问题 | 结论（修复 + 证据） |
|---|---|---|
| HIG-AUD-002 | ContextMenu 无键盘打开路径 | ✅ 已修复 + 运行确认：`context-menu.tsx:27-61`；主报告 `hig-experience-audit-2026-09-18.md:212` |
| HIG-AUD-003 | BottomSheet 吞掉内部滚动 | ✅ 已修复 + 运行确认：`bottom-sheet.tsx:111-116`、`:201-208`；由 `1866616` 修复，主报告 `:230` |
| HIG-AUD-004 | EditMenu 键盘不可达 | ✅ 已修复 + 运行确认：`edit-menu.tsx:141-143/:377-409`；主报告 `:249` |

> HIG-AUD-005（原始色治理）P0 判定**已撤回**，实质残留改记为 HIG-AUD-052（P2）。矩阵 `:312` 已同步订正为「P0 判定已撤回」，**跨文档口径冲突已消除**。

### 批次 B：计划交付缺口（5 项实质缺失）

| 编号 | 缺口 | 依据 | 收口状态（2026-09-22 核对） |
|---|---|---|---|
| PLAN §六.6 / E11 / M4 | `patterns/app-shell` **组合演示未落**（`app-shell-demo.tsx` 未导入 MenuBar/Toolbar） | `PLAN-HIG-COMPONENTS.md:86`、`:283`、`:312` | ✅ 已闭环：`522e53f` 落地 MenuBar + Toolbar 组合演示并重生成语料 |
| PLAN §六 readme:截图 | `readme:screenshots`(+`:check`) **无执行证据**，与 HIG 新页无绑定 | `PLAN-HIG-COMPONENTS.md:92` | ✅ 已闭环：`99f2a3b` 重生成 PNG；`docs:readme:screenshots:check` 5 页 × 2 主题通过 |
| PLAN §十一.3 / G3 | Quick Actions **触屏长按仿真验证未做** | `PLAN-HIG-COMPONENTS.md:321` | ✅ 已闭环：新增永久回归 `tests/e2e/context-menu-quick-actions-touch.spec.ts`（CDP `Input.dispatchTouchEvent` 真实 touch），`2 passed (12.6s)`；断言长按 900ms 后遮罩可见且 `backdrop-filter: blur(8px)`、菜单计算宽 `224px`，短按 150ms（阈值 700ms 以下）不打开。**注意**：Radix `ContextMenuTrigger` 的触屏长按是自实现 `setTimeout(handleOpen, 700)`，**不派发原生 `contextmenu`** |
| PLAN §十一.4 / G4 | **backdrop-blur 材质 token 未新增**，仍是字面量 `bg-black/40 backdrop-blur-sm` | `PLAN-HIG-COMPONENTS.md:322`；`context-menu.tsx:154-156` | ✅ 已闭环：新增 `--uni-overlay-backdrop-blur: 8px`（`src/styles/index.css` 遮罩 token 组），`context-menu.tsx` 与 `destructive-action-modal.tsx` 改走 `backdrop-blur-(--uni-overlay-backdrop-blur)`；真实浏览器双主题实测计算值 `blur(8px)`、遮罩色仍 40% / 50% |
| PLAN M1–M4 门禁 | `pnpm test` exit 1（9 基线失败）、`test:docs-layout` exit 1、lint 无证据 | `…-addendum-phase2.md:225-227` | 🟡 部分闭环：`typecheck`、`build`、`lint`（0 error）、`pnpm test` 均 exit 0；`test:docs-layout` **仍未能取到汇总行**（进程在前台窗口内被中断） |

### 批次 C：P1（24 条）

`006` SidePanel 关闭焦点丢失 ｜ `007` SidePanel noOverlay 语义 ｜ `008` i18n key 缺失 3 处 ｜ `009` z-index 体系不统一 ｜ `010` Overlay 背板 5 种写法 ｜ `011` 退场动画缺失 ｜ `012` 动效时长 token 不全 ｜ `013` 触控目标 < 44pt ｜ `014` Toast Tab 序列/计时 ｜ `015` Tooltip 强注 tabIndex ｜ `016` MultiSelect 热区/Tab 锁 ｜ `017` 无路由关闭浮层机制 ｜ `018` 受控能力缺口 ｜ `019` reduced-motion 覆盖不全 ｜ `020` EditMenu 触屏缺陷 ｜ `021` EditMenu 定位/语义边界 ｜ `022` Grabber slider 无键盘 ｜ `023` 7 个导出组件未注册 ｜ `024` SidePanel 未导出/被门禁 ｜ `036` EditMenu 指针设备形态 ｜ `037` 破坏性项无二次确认 ｜ `038` MenuBar 长菜单无高度约束 ｜ `039` Toolbar 折叠丢 disabled ｜ `040` ActivityView 无可访问名称

> `009`/`011`/`012`/`013`/`018`/`025` 的受影响清单已扩充到 MenuBar / Toolbar / pull-down，改动时注意连带面。

### 批次 D：P2（12 条）

`025` 浮层 loading/empty 缺失 ｜ `026` 用 vh 而非 dvh ｜ `027` Select 缺移动贴底形态 ｜ `028` 滚动条宽度补偿缺失 ｜ `029` 移动断点零散/无 vv ｜ `030` 屏幕阅读器播报 3 处 ｜ `041` 5 个测试为**源码字符串契约**（非行为验收） ｜ `042` 目标横滚无边缘提示 ｜ `043` ActivityView 固定单档 ｜ `044` MenuBar 层级与溢出提示 ｜ `052` legacy 账本只增不减 ｜ `053` 命令面板搜索相关性回归（由 `test:docs-layout` 失败发现）

### 批次 E：P3（11 条）

`031` 破坏色非语义 token ｜ `032` DotsMenu/Menu 表面不一致 ｜ `033` Combobox 字面量阴影 ｜ `034` EditMenu 无退场闪现 ｜ `035` 模糊用途边界未文档化 ｜ `045` SafeArea style 可覆盖 ｜ `046` SafeArea/Stack 双档表 ｜ `047` MenuBar 快捷键无效承诺 ｜ `048` pull-down 允许上方展开 ｜ `049` 图标瓦片 48px vs 70px（**已判为非缺陷**，建议关闭） ｜ `050` Fragment 包裹收集失败

### 批次 F：债务台账（18 条，可执行 13 条）

- **类型债务**（`docs/audits/tests-typecheck-debt.md`）：`tests/` 存量约 150 条类型错误；收紧批次 1（清零 TS7017）/ 批次 2（按文件清零 audit 系列）/ 批次 3（开 strict 并接入 `ci.yml`）**均未执行**（`:23-25`）。
- **动效债务**（`docs/audits/motion-duration-audit-2026-09-20.md`）：8 条账本字面量待迁移；浮层同族漂移（bottom-sheet 300ms / drawer 500ms / modal slow）待收敛；退场动画不对称（并案 HIG-AUD-011）；组件级免动画清单与 reduced-motion 全覆盖（并案 HIG-AUD-019）；`tests/bottom-sheet.test.tsx:114` 硬断言 `duration-300` 需随迁移更新。

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
| Playwright / 子进程超时 | `tests/llm-task-runner.test.ts`（超时）、`tests/showcode-typecheck.test.ts`（safe-delete ETIMEDOUT）为已知 flaky | 单独重跑确认，不要当成回归 |
| **仓库被并发会话写入** | 矩阵 `:6` 记录审核期间仓库被并发写入（`b68d3f0 → … → 5d173ca`） | 每次开工先 `git status` 重新确认基线，不要沿用本交付书的状态 |

---

## 5. 工作区状态：**不得误提交**的东西

- 36 处未提交改动、0 staged → **禁止** `git add -A` / `git add .`；只 stage 显式文件。
- **未跟踪的 scratch（禁止提交）**：`.tmp-logo/`（临时 logo 生成脚本 `*.mjs`、字体 `*.ttf`、`*.png`、`textpath.json` 等）。
- **未跟踪但属他人未完成工作（不要动、不要提交）**：`brand/unitary-logo-horizontal.svg`、`docs/geist/src/components/unitary-logo.tsx`、`docs/geist/src/examples/badge/compact-rounded-7c41e2a8.example.tsx`。
- 除用户明确要求外，**不得 commit、不得 push**（AGENTS.md 硬约束）。
- 所有临时脚本（Playwright 复现、测量脚本、日志）**跑完即删**；`.scratch/` 产物不得进版本库。

---

## 6. 建议执行顺序

1. **只读取证**（不写任何文件）：跑真实 `pnpm test` 与 `pnpm run test:docs-layout`，核对 §7 的基线失败是否仍为 9 项 / 3 文件，确认无新增回归。
2. ~~**批次 A（3 个开放 P0）**~~ → ✅ **已于 2026-09-21 完成闭环**（每条均走：复现 → 修复 → 加/改回归测试 → 双主题视觉核查 → 三份台账同步；含行号与「修复后证据」）。
3. **批次 B（计划缺口）**：~~优先 E11 `app-shell` 组合演示与 G4 材质 token（两者影响文档链与语料）~~ → ✅ E11（`522e53f`）、G4（`--uni-overlay-backdrop-blur`）、G3（`tests/e2e/context-menu-quick-actions-touch.spec.ts`）均已闭环；**剩余 M1–M4 的 `test:docs-layout` 汇总口径**。
4. **批次 C → D → E**：按严重度推进；`049` 可直接判定关闭。
5. **批次 F（债务）**：建议在 P0/P1 收敛后再做，且批次 1→2→3 顺序不可颠倒。
6. **批次 G**：等用户解除暂缓并完成 safe-delete 人工确认。

每批收尾都必须重跑：`pnpm run typecheck` + 定向 `vitest` + 受影响路由的双主题浏览器核查。

---

## 7. 验收门禁（命令 + 期望）

| 命令 | 期望 | 备注 |
|---|---|---|
| `pnpm run typecheck` | exit 0 | 本轮已验证为 0 |
| `pnpm exec vitest run <定向文件>` | exit 0 | 需重定向到日志文件读取（§4） |
| `pnpm run test` | **exit 0（2026-09-21 实测）** | **228 files / 1424 tests passed**。此前的「9 个基线失败 / 3 文件」（`docs-foundations`、`foundation-contract`、`keyboard-input-api`）在本轮全量重跑中**未复现**，已随会话推进消除；见 §9 订正 |
| `pnpm run test:docs-layout` | **当前 exit 1**（1 failed，含 HIG-AUD-053） | 布局改动必须跑 |
| `pnpm run docs:llm:check` | **当前 exit 1**（3 处漂移） | **已暂缓**；解除后需先人工清 `docs/llm/pages` 再 `docs:llm:generate` |
| `pnpm run build` | exit 0 | 计划文档记录为绿 |
| `pnpm run lint` | **exit 0（2026-09-21 实测）** | oxlint：**0 errors / 16 warnings**（872 files / 96 rules）；16 条 warning 为既有存量，非本轮引入 |
| `pnpm exec playwright test tests/e2e/context-menu-quick-actions-touch.spec.ts` | **exit 0（2026-09-22 实测）** | **2 passed (12.6s)**；触屏长按回归（G3）。spec 自带 `test.use({ hasTouch: true, isMobile: true })`，用 CDP `Input.dispatchTouchEvent` 派发真实 touch；如需复用已起的 dev server 可设 `PW_REUSE_SERVER=1` |

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
4. **`motion-duration-audit-2026-09-20.md` 有两处描述已过期**：账本实为 11 条（文档写 12 条）；`duration-(--uni-motion-*)` 已非「零消费者」（`drawer.tsx:141`、`collapse.tsx:218`、`context-menu.tsx:156`、`responsive-drawer.tsx:266`、`select.tsx:219`）。
5. ~~**lint 门禁状态**无任何执行证据。~~ **已取证（2026-09-21）**：`pnpm run lint`（oxlint）→ **0 errors / 16 warnings，exit 0**。
6. **各文档间的口径冲突**（改文档时必须先裁决）：
   - ~~HIG-AUD-005 严重度：矩阵 `:312` 仍为 P0，主报告 `:278`/`:631` 已撤回为 P2 等价；~~ **已订正（2026-09-21）**：矩阵 `:312` 已同步改为「P0 判定已撤回」；
   - 主报告 §4.5 `:663-670` 的「结论」列仍写「审核未覆盖」，同段 `:663-664` 声明以补充报告为准 → 表内文字已过时；
   - `PLAN-HIG-COMPONENTS.md:3` 状态仍为「待确认」，`:296` 的「safe-area.tsx / stack.tsx 执行时定」实际已合并为 `layout.tsx`，均未回填。
7. **`docs/llm/` 语料当前与文档源不一致**（3 处漂移），属已知且**用户已暂缓**。

---

## 10. 交接时的一句话总结

> 本轮交付了 **5/53** 个审核问题的修复与运行确认（HIG-AUD-001、002、003、004、051，**P0 清零**），并把三份审核台账同步到「已修复」口径；**余下 48 条审核问题（当前无开放 P0）、23 项计划缺口、18 条债务**构成下一阶段主体工作量；LLM 语料重生成与真机验证因环境/用户指令暂缓。**做任何枚举前先派 subagent，否则本任务会在中途因上下文耗尽而失败。**

