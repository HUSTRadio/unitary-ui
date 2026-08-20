# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] — 2026-08-20

### Fixed — Geist parity 修复（14 项，现场 Playwright 验证）

深度 parity 审计（74 组件全量采集 + 文本层对比 + 三轮子代理独立审核）确认的官方 Vercel Geist 差异修复：

**颜色语义（8 项）**
- `Error` / `ErrorCard`：错误色 `#e5484d` → 官方 light `#cb2a2f` / dark `#ff6166`（组件级覆盖，不动 `--danger` token，destructive 按钮 `#da2f35` 保持不变）
- `Entity` 描述：`text-gray-1000` → `text-muted-foreground`
- `JsonView` 标点（`: { } …`）：`text-muted-foreground` → `text-foreground`
- `Textarea` / `Input` 输入文字：`text-foreground` → `text-black dark:text-white`（官方纯黑/纯白）
- `Badge` pill 变体文字：`text-foreground` → `text-black dark:text-white`
- `MenuItem type="error"` / `Snippet type="error"`：`text-destructive` → 官方 light `#cb2a2f` / dark `#ff6166`（待确认项现场测量后确认差异并修复）

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

### Not changed（YAGNI）
- `--danger` token：保持 `#e5484d`（destructive-action-modal 按钮官方 `#da2f35` 已正确，改全局会破坏）
- `Progress` / `Tooltip` error variant：官方 demo 未展示，值未知，不做预防性修改

**验证：** `pnpm exec tsc --noEmit` ✓ / `pnpm exec oxlint` ✓ / `vitest run` 12 断言 PASS / Playwright 现场验证 17/17 PASS（light 14 + dark 3）+ menu/snippet 修复复测通过。
