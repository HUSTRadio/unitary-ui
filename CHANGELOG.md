# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] — 2026-08-20

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
