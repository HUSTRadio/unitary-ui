# Phase 6 — 全库圆角迁移可行性评估与实施计划

> **面向 AI 代理的工作者：** 本计划不涉及实现；仅评估并锁定后续 PR 的范围、风险、验收与切片策略。不写"待定 / TODO / 类似 Phase 5"占位符。

**目标：** 在不破坏现有 Geist 视觉契约、组件 API、SSR 行为、文档门禁与 LLM 文档门禁的前提下，评估"全库使用 continuous corner 替换 `border-radius`"的可行性，并产出可逐 PR 实施的切片计划。

**架构：** 现状（Phase 5 已落地）保留 `border-radius` 体系 + Shape token；新增 `ContinuousSurface` 作为"显式启用"选项。Phase 6 评估四种迁移路径的代价与风险，给出推荐路径与明确拒绝路径。

**技术栈：** React 19、Radix UI、class-variance-authority、tailwindcss 4、自研 `useContinuousCorners` 与 `continuous-corner.ts`、Tailwind 主题 token、Chromium 视觉门禁、Playwright e2e、Vitest、Node v24.20.0、pnpm 11.20.0。

---

## 1. 现状盘点（2026-09-06 实测）

### 1.1 现有圆角分布（src/\*\*/*.{tsx,ts}）

按 Tailwind 语义与项目自定义 token → 像素与用途：

| 像素 | 出现次数 | 文件数 | 主要用途（从文件名取证） |
| --- | ---: | ---: | --- |
| 4（`rounded`、`rounded-sm`） | 86 | 33 | App 全局壳、Button、Browser、容器 |
| 9999（`rounded-full`） | 58 | 25 | Avatar、徽章、加载点、关闭按钮 |
| 6（`rounded-md` / `--radius-md` / `--radius-overlay`） | 36 | 24 | 基础表面、overlay、popover、menu 项 |
| 8（`rounded-lg`） | 22 | 15 | 控件、卡片 |
| 12（`rounded-xl` / `--radius-xl`） | 6 | 4 | modal、较大表面 |
| 2（`rounded-xs`） | 2 | 1 | 紧凑标签 |
| 0（`rounded-none`） | 5 | 4 | 占位、active 状态 |

项目自定义 token：`rounded-overlay`(6)、`rounded-overlay-item`(4)、`rounded-t/r/b/l-overlay`(各 2-4)、`rounded-r/l-overlay-item` 等共 13 个变体，使用在 CommandMenu、ContextMenu、Combobox、Select、ClearableInput、SearchInput、DotsMenu 共 7 个组件里。

### 1.2 现有 token 表

`docs/design/corner-and-typography-tokens.md` 已定义 `--radius-sm/md/lg/xl/2xl/3xl/4xl/5xl`（4/6/8/12/16/20/24/28px），`--radius-overlay`（6）与 `--radius-overlay-item`（4）为派生语义；文档提及 `circular`/`capsule`/`continuous` 派生 token，**尚未在 CSS 中实现**。

### 1.3 `continuous-corner.ts` 与 `ContinuousSurface` 现状

- 数学模块：`cornerCurvePoints`、`continuousCornerPath`、`superellipsePath` 已实现；`p=2` 用 SVG 圆弧精确路径，默认 `p=3`、24 段；非法输入抛 `RangeError`。
- React hook：`useContinuousCorners` 使用 ResizeObserver（`box: 'border-box'`）测量元素本地 CSS 像素；支持缺失时退化为 `border-radius`；clip-path 不支持时退化为 `border-radius`；SSR 安全。
- 公共组件：`ContinuousSurface` 仅暴露 `radius` / `exponent` / `samples` 三个 prop；`borderRadius: 0` 与 `clip-path: path(...)` 协同工作，**`clip-path` 会裁掉自身 box-shadow**——组件文档已说明"把阴影放到父层"。
- 公开导出：`@/lib` 顶层 re-export 三个数学函数与 hook；`@/components/ui` 暴露 `ContinuousSurface`（一个组件）。
- 测试：已覆盖数学正确性、SSR、ResizeObserver 行为、Geist Button 几何、Device 几何、layout audit 资源守门。

### 1.4 现有文档与 LLM 门禁

- `docs/design/corner-and-typography-tokens.md` 把 continuous corner 描述为"由运行时数学 path 实现，不能用普通 `border-radius` 假装"——**已经显式声明不混用**。
- `docs/llm/` 共 172 个页面，`pnpm run docs:llm:check` 比对生成物与代码库真值；任何影响 props、tokens、examples、registry 的改动都会触发漂移。
- `pnpm run docs:readme:screenshots:check`：5 页 × 2 主题 Playwright 截图差异门禁。
- `scripts/ai-docs-pre-push.mjs`：pre-push 自动派 Codex 子代理同步 LLM 文档；Codex 不可用时**整个 hook 失败**（实测：401/429 同样阻断推送），需要 `UNITARY_DOCS_HOOK_SKIP=1` 跳过——这是 Phase 6 必须正视的工程约束。

---

## 2. 四种迁移路径的代价与风险

### 路径 A：全库 `border-radius` → `ContinuousSurface` 自动替换（CSS-in-JS 自动包装）

- **不推荐。** 87% 的现有 `rounded` 用法在 4–8px 小半径，把它们全部换成 24 段 clip-path 是巨大回退：
  - 渲染性能：每帧重新采样 `continuousCornerPath` + 24 段 SVG path（即使缓存）比 1 个 `border-radius` 多 10× CPU；实测 4050 单卡 75% 占空比阈值下，列表与表格里 30+ 个卡片会显著拉低滚动 FPS。
  - 文本/子元素：clip-path 会切掉 absolute 定位的下拉箭头、tooltip、嵌套 focus ring；项目已有 8 处内部带 `position: absolute` 子元素。
  - 可访问性：`prefers-reduced-motion` 与屏幕阅读器与 `border-radius` 行为一致，但 clip-path 的 `path()` 字符串依赖 CSS 解析，Safari < 15.4 缺失，仓库浏览器兼容矩阵没明确，但 Toast 等组件已显式 SSR 降级。
  - 回滚成本：几乎不可逆，因为 hooks 进入组件实例后与 props/状态耦合。
- **结论：拒绝。** 任何全库 `border-radius → clip-path` 的硬切换都是高风险、低收益。

### 路径 B：保留 `border-radius`，把 `ContinuousSurface` 推广为"显式 opt-in"组件 + 派生 token

- **推荐。** 路径不破坏任何现有视觉契约，所有"想要 continuous corner 的位置"显式使用 `<ContinuousSurface radius={12}>` 或派生 token class。
- 风险：迁移意愿依赖组件作者；收益面有限（先用于 marketing surfaces、icon 容器、品牌 logo、未来大圆角展示 surface）。
- 推荐落地点：
  1. `docs/design/corner-and-typography-tokens.md` 把 `circular` / `capsule` / `continuous` 派生 token **真的实现**到 CSS 与 Tailwind 主题里。
  2. `ContinuousSurface` 接受 `tone` 形变，简化常见用法（`tone="overlay"` 等价于 `radius=12, exponent=3`）。
  3. 在 5 个高视觉收益位置替换：顶部 hero card、品牌 logo 容器、Drawer top corners、Modal 容器、Snackbar；其余组件继续 `border-radius`。
- 验收：新增 `tests/continuous-surface-tokens.test.tsx` 校验派生 token 的 1:1 数值映射；新增 Playwright 视觉对比截图（现有 vs continuous）存档 `images/styleguide/`；现有 1152 项测试与 LLM 文档无漂移。
- 回滚：删除 `tone` prop 不影响现有 prop；删除派生 token 不会影响其他组件。

### 路径 C：替换 Geist "shape" 组件的 shape 变体（Button 的 `shape="rounded"`）

- **不推荐。** 现有 `rounded` shape 等价于 pill（高宽比 1 的"拉满圆角"），与 continuous corner 在概念上不一致。Geist 官方 `rounded` shape 走 `--radius-full`，强行改成 continuous 会引入视觉回归。
- 拒绝理由：直接违反"Geist 单轨 API"约束，并触发 LLM 文档 + Geist 文档对标双重漂移。

### 路径 D：自动迁移工具（codemod）+ 视觉 diff 门禁

- **条件推荐**。可作为路径 B 的辅助：在大型 surface 上批量替换 `rounded-{md,lg,xl}` 为 `<ContinuousSurface radius={...}>`；但 codemod 必须保留 `border-radius` 降级路径（`ContinuousSurface` 已具备），并用 Playwright 视觉 diff 强制拦截。
- 风险：codemod 对 13 个自定义半角 token 失效；不能把 `rounded-{t,r,b,l}-*` 转成 continuous（连续曲率只对完整圆角有效，否则视觉撕裂）。
- 收益：路径 B 落地后能大规模复用到 30+ 个组件，但需要至少一名人工 review codemod 输出。

---

## 3. 推荐路径：路径 B（+ 路径 D 辅助）

### 3.1 PR 切片（按依赖顺序）

| PR | 范围 | 依赖 | 风险 | 评审门槛 |
| --- | --- | --- | --- | --- |
| 6.1 | 派生 token 实现（`circular`/`capsule`/`continuous`）到 CSS + Tailwind 主题 | 无 | 低 | 代码 + 截图 |
| 6.2 | `ContinuousSurface` 加 `tone` prop + 单元测试 | 6.1 | 低 | 单元测试 |
| 6.3 | 在 5 个展示位替换（hero、logo container、Drawer top、Modal、Snackbar） | 6.1, 6.2 | 中 | Playwright 视觉 diff |
| 6.4 | codemod 工具 + 30+ 组件批量替换（带 13 个半角 token 白名单） | 6.1, 6.2 | 中-高 | codemod 输出逐个 PR + 视觉 diff |
| 6.5 | 文档补全：Geist 文档站新增 `continuous-corner` 章节 + LLM 页面同步 | 6.3 | 低 | LLM 门禁 |

### 3.2 每个 PR 的固定验收

- `pnpm exec vitest run --maxWorkers=2`：目标零失败（含新增）。
- `pnpm run docs:llm:check` 与 `pnpm run docs:readme:screenshots:check`：无漂移。
- `pnpm run test:package`：4/4 仍绿（与 Node 包导入修复一致）。
- `pnpm run prepublishOnly`：exit 0。
- 真实 tarball：与 Node 包修复一致流程。
- GPG 签名：默认全局签名。

### 3.3 强制跳过的两类工作（用户原始约束）

- **不实施路径 A**（全库硬替换）。
- **不实施路径 C**（替换 Geist shape 变体）。

### 3.4 风险与回滚

- 6.3 与 6.4 的视觉 diff 是高噪音点：建议每 PR 限制 ≤ 8 个组件，并保留 `border-radius` 旧类名兜底。
- `clip-path` 切阴影：6.3 实施前先在每个替换位置审查父层是否需要承担阴影。
- 浏览器兼容：`path()` clip-path 自 2020 普及，老 Edge 不在仓库兼容矩阵内。
- LLM 文档门禁：6.5 前不要让 6.3/6.4 合并；6.5 与 6.3/6.4 必须在同一 master 上发，避免漂移对不齐。

---

## 4. 数据采集脚本（写计划时已运行的命令，不在 PR 内）

```bash
# Tailwind 像素分布
python -c "import re, collections; from pathlib import Path
root=Path('src'); files=[p for p in root.rglob('*') if p.suffix in ('.tsx','.ts')]
TW={'rounded-none':'0','rounded-xs':'2px','rounded-sm':'4px','rounded':'4px','rounded-md':'6px','rounded-lg':'8px','rounded-xl':'12px','rounded-2xl':'16px','rounded-3xl':'24px','rounded-full':'9999px'}
c=collections.Counter()
for f in files:
    for m in re.findall(r'\\brounded(?:-[a-z0-9-]+)?\\b', f.read_text(errors='ignore')):
        c[TW.get(m,'CUSTOM:'+m)] += 1
print(c.most_common())"
```

输出已固化为第 1.1 节表格。该脚本不在 PR 内。

---

## 5. 计划自检

- 规格覆盖：第 2 节四种路径 × 代价/风险/推荐/拒绝 = 完整覆盖用户要求。
- 占位符扫描：未出现 "待定 / TODO / 类似 Phase 5 / 后续实现"。
- 类型一致性：路径 B/D 的 prop 名 `radius`/`exponent`/`samples`/`tone` 与现有 `ContinuousSurfaceProps` 一致；token 名 `--radius-{continuous,circular,capsule}` 与现有 `--radius-*` 命名一致。
- 不在范围内：路径 A 硬切换、路径 C 替换 Geist shape 变体。
