# 动画时长全量审核（2026-09-20）

## 1. 审核摘要

范围：`src/components`、`src/styles/index.css`、`docs/geist/src`、`tests/`。

- 档位族保持命名、仅重定数值：fast 150ms 不变；base 200ms→250ms；slow 300ms→350ms；slower 500ms 不变。
- 新增 `--uni-motion-*` 别名族与 `--uni-loop-standard` 循环周期族；绑定 `--default-transition-duration` 到 fast 档。
- 建立字面量棘轮账本与治理测试；本轮不迁移组件字面量。

## 2. 方法与基线

- 基线：`master` 当前工作区。
- 清点：临时脚本机械扫描 + 定向取证（file:line 实读源码）；中间产物在 `.scratch/`（已删除）。
- token 消费：`duration-(--uni-duration-*)` 约 60+ 处；裸 `transition-*` 约 35 个文件；字面量见 §4 账本。

## 3. 分类清单（要点）

- 过渡（已 token 化）：`slower`→`gauge.tsx:184`、`expand-panel.tsx:155`；`slow`→`modal.tsx:57,153`、`toast.tsx:189`、`progress.tsx:124` 等；`base`/`fast` 各约 25/30 处。
- 循环动画：`--animate-blink` 与 `--animate-skeleton-shimmer` 原均为 1.4s，已收敛到 `--uni-loop-standard`。
- 时序（不入 token）：delay/dwell/自动关闭，如 `context-card.tsx:15,42`、`hamburger-menu.tsx:100-101`、`toast.tsx:110-121`。
- 测试硬断言：`tests/bottom-sheet.test.tsx:114` 断言 `duration-300` 属被冻结字面量——**已于 2026-09-23 随 HIG-AUD-012 迁移更新为 `duration-(--uni-motion-overlay)`**（增补 §5K）。

## 4. 冻结账本

现存字面量已登记于 `tests/audit/motion-duration-allowlist.json`（**7 条**，双向棘轮：新增未登记即失败、删除后须移除账目；**2026-09-23 HIG-AUD-012 已迁移清账 0.3s / 0.4s / 300ms / 500ms 四条**，见下表状态列与增补 §5K）：

| literal | 位置 | 迁移方向 |
| --- | --- | --- |
| 0s | `drawer.tsx` | 保留（拖拽跟手，刻意为 0） |
| 0.01ms | `index.css` | 保留（reduced-motion 兜底） |
| 0.15s | `index.css` | → fast（focus-ring 过渡，同值替换） |
| 0.2s | `index.css` | → state/base（phone-frame 过渡） |
| 0.3s | `index.css` | ✅ **已迁移（2026-09-23）** → `var(--uni-motion-overlay)`（command-menu keyframes） |
| 0.4s | `index.css` | ✅ **已迁移（2026-09-23）** → `var(--uni-motion-expansive)`（command-menu 移动端） |
| 150ms | `search-input.tsx`、`index.css` | → fast（同值替换） |
| 200ms | `index.css` | → state（collapse 覆盖 Radix 0s） |
| 250ms | `book.module.css` | → base（同值替换） |
| 300ms | `bottom-sheet.tsx`、`responsive-drawer.tsx` | ✅ **已迁移（2026-09-23）** → `var(--uni-motion-overlay)`（吸附，工具类+内联） |
| 500ms | `drawer.tsx` | ✅ **已迁移（2026-09-23）** → `var(--uni-motion-expansive)`（同值替换，内联 transform） |
| 2s | `grid.module.css` | 保留（仅调试态 keyframes） |

## 5. 漂移矩阵与缺口

- 浮层同族漂移（扩写 HIG-AUD-012）：入场 150–500ms 漂移，`bottom-sheet` 300ms vs `drawer` 500ms vs `modal` slow 档；退场缺失见 HIG-AUD-011。
- 缺口：部分组件无 token（见账本）；reduced-motion 全局兜底已覆盖（`0.01ms`），组件级免动画清单见 HIG-AUD-019；共享根因 R3（时长未成体系）由本轮 token 落地闭环。**2026-09-23 更新：HIG-AUD-012 迁移完成——menu/context-menu/menu-bar/multi-select/destructive-action-modal/bottom-sheet/responsive-drawer/command-menu/sheet 的浮层出入场全部落到 token，账本 12→7 条（增补 §5K）。**

## 6. 取值来源标注

现行 Apple 文档（HIG Motion 与 Core Animation 参考，2026-09-20 核验）只给原则、不含毫秒值，故数值标注如下：

- fast 150ms：项目基线。HIG Motion「brevity and precision in feedback animations」支持高频微反馈短促。
- base 250ms：Apple 实现层公开惯例——Core Animation 隐式事务默认约 0.25s（业界长期观测值，现行文档未标数值）。
- slow 350ms：Apple 实现层公开惯例——UIKit 导航推/弹转场约 0.35s（社区实测惯例）。
- slower 500ms：项目基线。Geist Drawer 官方实现实测 500ms 滑入（`drawer.tsx` 注释）。
- 语义别名不引入新数值，全部 `var()` 指向档位；`--uni-loop-standard` 1400ms 为项目基线（原两处 1.4s 字面量同值）。

## 7. 过渡期影响（旧值→新档位）

- base 200ms→250ms：约 25 处消费者变慢 50ms（开关/选中/折叠类）。
- slow 300ms→350ms：约 6 处消费者变慢 50ms（浮层出入场类）。
- 字面量组件（如 `bottom-sheet` 300ms、`drawer` 500ms）观感不变，过渡期漂移先扩大、迁移后收敛；映射见 §4。

## 8. 验证记录

- `pnpm run typecheck`、`pnpm run lint`（0 错误）、`pnpm run test`（221 文件 / 1343 用例全过）全绿；计划期记录的 9 个基线失败当前已不存在。

- 聚焦测试：`pnpm exec vitest run`（duration-tokens、motion-duration-governance 及 17 个组件契约测试）全绿，含治理棘轮 4 项。
- 构建：`pnpm run build` 通过；产物发射验证（theme 变量唯一发射、`.transition-colors` 引用默认变量、`--animate-*` 携带 loop token）确认。
- `pnpm run docs:llm:generate` 后 `--check` 通过：无漂移（92 路由 × 2 语言）。
- 视觉核查：临时 Playwright（跑完即删）12/12 通过——真实 SwitchControl 0.25s（双主题）、四别名 var 链路、裸 transition-colors 0.15s、交互 700ms 内收敛、真实骨架流光 1.4s；双主题截图人工目检无布局破碎。
- **2026-09-23（HIG-AUD-012 迁移复跑，增补 §5K）**：`pnpm run typecheck` exit 0；定向 vitest **23 files / 184 tests passed**（含 `motion-duration-governance` 双向棘轮、`duration-tokens` 浮层矩阵、`ease-tokens` 5 曲线）；临时 Playwright 双主题 computed 核查 3/3 passed（浮层 z / animation-duration / 退场 `exit` 事件与 `--tw-exit-scale` 变量、command-menu keyframes，跑完即删）。

## 9. 局限性

- Tailwind 尚未为 `duration-(--uni-motion-*)` 生成工具类（当前零消费者），属预期；首个组件迁移后自动发射。
- `--default-transition-duration` 的 var() 间接引用已在构建产物与运行时双端验证；若未来 Tailwind 升级改变语义，`tests/duration-tokens.test.ts` 会先于发布报警。
- ~~测试硬断言 `bottom-sheet` `duration-300` 为被冻结账目，随组件迁移一并更新。~~ ✅ 已于 2026-09-23 随 HIG-AUD-012 迁移更新（增补 §5K）。
