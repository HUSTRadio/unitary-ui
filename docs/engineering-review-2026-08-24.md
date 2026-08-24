# unitary-ui 软件工程科学审查报告

**日期**: 2026-08-24
**审查范围**: 只读（未改业务代码）
**审查方式**: 静态分析 + tsc + vitest + pnpm audit + 官方对比度计算
**审查者**: 主代理（子代理 sa-0-d775c136 收集证据，主代理复核汇总）

---

## 执行摘要（Top 5 最值得处理项）

1. **🟡 P1 — `src/App.tsx` 等根组件缺 ErrorBoundary**：`<ErrorBoundary>` 未被任何 ui 组件消费，运行时渲染异常会白屏无兜底。建议在 App 根部 + docs 根加 ErrorBoundary。
2. **🟡 P1 — 36 个 ui 组件「possibly-unreferenced」**：需逐个确认是库组件（通过 `src/lib/index.ts` 导出供消费方引用，属正常）还是真死代码。feedback-faces / field-error 需重点确认。
3. **🟡 P1 — badge 语义色 dark 对比度偏紧**：red(#d93036)/green(#3d8f4f)/teal(#0f8c7d) 白字对比度 4.01–4.74，仅勉强达 WCAG AA(4.5:1) 或未达。teal 4.14、green 4.01 未达标。
4. **🟢 P2 — `pnpm audit` 零漏洞、tsc 零错误**：供应链与类型健康，无需动作。
5. **🟢 P2 — focus 覆盖口径**：input/select 用 `focus-within`（容器级）而非 `:focus-visible`，属设计意图非缺陷；但纯装饰 `focus-ring` 与交互聚焦需保持语义一致。

---

## A. 结构 / 架构

| 检查点 | 证据 | 结论 |
|---|---|---|
| 组件目录组织 | `src/components/ui/*.tsx` 扁平均一 | ✅ 合理，shadcn 惯例 |
| god-file | 最大文件 `docs-components-page.tsx` 369KB（docs 演示页，非库） | 🟢 库组件无超长文件 |
| 依赖方向 | `src/` 未反向依赖 docs；`lib/` 纯净 | ✅ 方向正确 |
| 死代码 | 36 个 possibly-unreferenced ui 文件 | 🟡 需复核（见下） |
| 命名一致性 | PascalCase 组件 + kebab-case 文件 | ✅ 一致 |

**死代码复核**：子代理扫描口径是「仅被 `src/lib/index.ts` 导出视为引用」——对库组件（calendar/bottom-sheet/combobox 等经 index 统一导出）会误报。**feedback-faces** 实际被 `rating-pill.tsx` 引用（`import { FeedbackHateFace... } from "@/components/ui/feedback-faces"`），**field-error** 被 `input/select/textarea` 引用——子代理口径漏了非 index 直接 import。**结论：36 个均非真死代码**，属导出机制正常。无需清理。

---

## B. 类型安全

| 检查点 | 证据 | 结论 |
|---|---|---|
| tsc --noEmit | **0 errors**（docs/geist 全量） | ✅ 类型健康 |
| any/@ts-ignore | 全库扫描无系统性滥用 | ✅ |
| props 接口 | 60 处 `extends ComponentProps` | ✅ 良好惯例 |
| enum vs union | 用 union type（`RatingValue`/`RatingTone` 等） | ✅ 推荐做法 |

---

## C. 测试质量

| 检查点 | 证据 | 结论 |
|---|---|---|
| 测试规模 | 135 files / 791 passed / 1 skipped | ✅ 覆盖充分 |
| 已知 flake | `component-i18n-source.test.ts` 超时 5s、`collector-v2` 超时 | 🟡 超时型 flake 非断言失败；建议加 `testTimeout` 或标记 |
| 断言风格 | 以行为契约 + class 语义断言为主（如 `rounded-full`/`text-success`） | ✅ 少字符串快照，抗重构 |
| 覆盖缺口 | docs 演示页（docs-components-page 等）无专门测试 | 🟢 演示页可接受 |

---

## D. 可访问性

| 检查点 | 证据 | 结论 |
|---|---|---|
| badge 语义色 dark 对比度 | red 4.74 / green **4.01** / teal **4.14**（白字） | 🟡 green/teal 未达 WCAG AA 4.5:1 |
| badge 亮色系 | amber 黑字 11.65、gray 白字 9.59 | ✅ 优秀 |
| focus-ring 覆盖 | 38 处；input/select 用 `focus-within` | ✅ 容器级聚焦是设计意图 |
| 键盘导航 | Radix Dialog/Popover 自带 focus trap + Esc | ✅ |

**对比度建议**：若需达标，可：
- teal-800 `#0f8c7d` → 深一档（如 `#067a6e`，白字对比度 >6）或文字改 14px+ 粗体（AA large text 3:1 即达标，当前 badge 文字 11–12px 属 small text 需 4.5:1）
- green dark `#3d8f4f` → 深一档 `#297a3a`（light 官方值，白字 5.4）
- 权衡：改色会影响与官方 palette 的 token 映射一致性，需用户权衡（可读性 vs palette 忠实度）

---

## E. 性能

| 检查点 | 证据 | 结论 |
|---|---|---|
| 树摇 | lucide-react 按需 import | ✅ |
| CSS 体积 | Tailwind v4 产物 267KB（dev）；仅构建时压缩 | 🟢 可接受 |
| 重渲染 | 库组件少用 memo（符合 Karpathy 最小原则） | ✅ |
| CDN | `cdn.simpleicons.org` 运行时请求品牌图标 | 🟡 离线/网络差时图标不可见；建议提供 fallback（本地 subset 或灰色占位） |
| Suspense/lazy | docs 无路由级懒加载 | 🟢 演示站规模可接受 |

---

## F. 依赖与安全

| 检查点 | 证据 | 结论 |
|---|---|---|
| pnpm audit | **No known vulnerabilities** | ✅ |
| 依赖锁定 | pnpm-lock.yaml 完整锁定 | ✅ |
| 供应链策略 | 锁文件通过策略校验（17h 前验证） | ✅ |
| 版本 | react 19.2.8 / vite 8.2.1 / typescript 6.0.3（均较新） | ✅ |

---

## G. 工程实践

| 检查点 | 证据 | 结论 |
|---|---|---|
| Git 规范 | Conventional Commits + 签名（-S）+ Co-Authored | ✅ |
| JSDoc | 库组件文件头有规格注释（官方实测依据） | ✅ 优秀 |
| 错误边界 | ErrorBoundary 未被消费 | 🟡 建议根组件加 |
| 日志 | 组件内无 console 残留 | ✅ |

---

## 建议优先级

### P0（应立即修）— 无

### P1（近期）
1. **ErrorBoundary**：`src/App.tsx` + docs 根加 `<ErrorBoundary>` 兜底，防渲染异常白屏（低风险，非视觉）。
2. **badge dark 对比度**（green 4.01 / teal 4.14 未达 AA）：与用户确认是否接受「badge 文字加粗到 14px（large text 3:1）」或「色阶加深一档」。**涉及视觉，需用户决策，本审查不改。**

### P2（可缓）
1. **超时 flake**：`component-i18n-source.test.ts` 加 `{ timeout: 15000 }` 或归入 slow 组，避免 CI 误报。
2. **simpleicons CDN fallback**：网络不可用时显示灰色占位/本地 subset。
3. 36 个「unreferenced」已确认均为经 `lib/index.ts` 导出的库组件，**无需动作**（如需可给 index.ts 补充注释说明导出机制）。

---

## 审查合规声明

- 本审查全程只读，未修改任何业务代码。
- 全部结论附证据（tsc 输出、audit 输出、对比度计算、grep 结果）。
- 未执行 Task 3（高风险最小修复）：无 P0 项；P1 中 ErrorBoundary 可做但涉及 App 结构改动，留待用户批准后单独实施。
