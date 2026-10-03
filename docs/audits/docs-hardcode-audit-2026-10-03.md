# docs 硬编码审计报告

> 扫描范围：`docs/site/src`（485 个 ts/tsx）　库侧 token 源：`src/styles/index.css`（2543 行）
> 结论摘要：**276 处裸 px / 56 处 hex 中，真正值得标准化的仅约 18 处（P0），另有 12 个已定义却无人引用的死 token（P1）。**

---

## 总体数据

| 指标 | 数值 |
|---|---|
| docs 站点 ts/tsx 文件数 | 485（其中 tsx 446） |
| 裸 `px` 出现次数 | 276 |
| 硬编码 hex 色值 | 56 |
| 硬编码 `cubic-bezier` | 0 |
| 硬编码 `boxShadow` | 0 |
| 硬编码 `zIndex` | 0 |
| 硬编码 `fontSize` | 3 |
| `var()` 总引用 | 39 |
| 其中 `var(--uni-*)` | **9** |
| `rem` / 时长单位 | 20 / 21 |

**关键判断**：shadow、z-index、动效曲线这四类"最容易失控"的硬编码，docs 站点**零 occurrences**——说明基础纪律良好。真正的缺口只在**布局尺寸层**。

---

## 分区域分布

| 区域 | 文件数 | px | hex | 定性 |
|---|---|---|---|---|
| `docs/site/src/examples/` | 428 | 89 | 29 | P2 合理保留 |
| `docs/site/src/components/` | 13 | 92 | 10 | **P0 真缺口** |
| `docs/site/src/content/` | 25 | 60 | 8 | P3 文档散文 |
| `docs/site/src/data/` | 5 | 14 | 0 | P3 文档散文 |
| `docs/site/src/i18n/` | 5 | 13 | 0 | P3 文档散文 |
| `docs/site/src/pages/` | 3 | 3 | 3 | 演示代码，保留 |
| `docs/site/src/__tests__/` | 2 | 0 | 4 | 断言值，保留 |

注意 `examples/` 占了 96% 的文件数但只占 32% 的 px——因为示例刻意硬编码以演示 API 表面。**绝对不要批量 token 化 examples/，那会抹掉教学意图。**

---

## P0 — 值得标准化（约 18 处）

集中在 `docs/site/src/components/`，性质是**站点自身布局常量**，无任何 token 对应。

### 1. 侧栏 / 容器宽度（`docs-shell.tsx`）

| 值 | 位置 | 说明 |
|---|---|---|
| `260px` | L319 `w-[260px]` | 侧栏宽度，注释在 L32 |
| `238px` | L107 `lg:w-[238px]` | 侧栏内导航列 |
| `1220px` | L101 `max-w-[1220px]` | Navbar 居中容器，注释在 L102 |
| `292px` | L132 `maxExpandedWidth` | SidebarNav 展开上限 |
| `22px` | L105 `pl-[22px]` | 栅格 gutter |
| `64px` / `32px` / `24px` | L127 / L196 / L235 | sticky 偏移、视觉高度、cap 高度 |

`260` 与 `238` 语义耦合（`260 - 22 = 238`），改版必须同步；`1220` 与 `238` 也是 Navbar 内部算术关系。这是**最值得抽 token 的一组**。

### 2. 480px 断点（`docs-feedback.tsx`，7 处）

```
L40  max-[480px]:grid-cols-2
L46  max-[480px]:col-span-2 / col-start-1 / row-start-1
L49  max-[480px]:row-start-2
L68  max-[480px]:row-start-2 / col-start-2
```

同一个断点字面量重复 7 次，是全站最集中的一处重复。库侧已有 `--breakpoint-grid-xs: 25rem`（400px）等 5 个断点，但**480px 不在其中**。

### 3. 其它单点

- `docs-grid-page.tsx`：`52px` / `40px` / `105px`
- `docs-components-page.tsx`：`min(844px,100dvh)` 子框架高度
- `docs-icons.tsx`：`8px` / `6px` / `4px` 图标盒
- `component-guide-sections.tsx`：`15px`

### 建议新增 token 族

```css
/* 站点布局层 —— 建议前缀 --uni-doc-layout-* */
--uni-doc-shell-nav-max: 76.25rem;     /* 1220px Navbar 容器 */
--uni-doc-shell-sidebar: 16.25rem;    /* 260px  侧栏 */
--uni-doc-shell-sidebar-nav: 14.875rem; /* 238px 侧栏内列 */
--uni-doc-shell-gutter: 1.375rem;     /* 22px   栅格 gutter */
--uni-doc-shell-top-offset: 4rem;     /* 64px   sticky 偏移 */
--uni-doc-breakpoint-feedback: 30rem;  /* 480px 反馈区断点 */
```

接入后需重跑 `pnpm run tokens:generate`（`tokens:check` 会校验 catalog 同步）。

---

## P1 — 已定义但零引用的死 token（12 个）

这些在 `src/styles/index.css` 有定义、也进了 `src/lib/token-catalog.ts`，但 **docs 站点引用数全部为 0**：

| Token | 定义值 | 行号 |
|---|---|---|
| `--uni-doc-space-title-lead` | `0.75rem` | 737 |
| `--uni-doc-space-section` | `2.5rem` | 738 |
| `--uni-doc-space-heading-body` | `1rem` | 739 |
| `--uni-doc-space-paragraph` | `1rem` | 740 |
| `--uni-doc-space-list-item` | `0.75rem` | 741 |
| `--uni-doc-list-indent` | `1.25rem` | 742 |
| `--uni-mixed-script-gap-ui` | `0.125em` | 730 |
| `--uni-mixed-script-gap-prose` | `0.25em` | 731 |
| `--breakpoint-grid-xs/sm/smd/md/lg` | 25/37.5/48/60/80 rem | 636-640 |
| `--uni-drawer-width` | `min(420px, 90vw)` | 1061 |
| `--uni-popover-padding` | `6px` | 964 |

这些**不是死代码**——`index.css` 内部 L1605-1644 的排版规则（`margin-block` 等）在消费它们，服务于库的 typography 层。但对 docs 站点而言是"备而不用"。

**两种处理方式，建议先决定再动手**：
1. **接入**：把 `docs-shell.tsx` / `docs-pages.tsx` 的间距改为引用，兑现 token 承诺；
2. **移除**：从 catalog 删除未用项，减少 token 表面面积。

> 判断依据：若 token 存在的目的就是"给 docs 用"，选 1；若它们只服务库内 typography，选 2（现状）。**倾向选 1** —— 命名已带 `doc-` 前缀，意图明显是文档专用。

---

## P2 — 合理，不要动

- **`examples/` 428 文件 / 89px**：示例刻意硬编码，是"用户会怎么写"的示范。token 化会让用户困惑该抄哪种写法。
- **`docs-cards.tsx` 的 8 个 hex**（L162-169）：`#8f8f8f #006efe #8e4ec6 #e93d82 #e5484d #ffb224 #46a758 #17a693` —— 这是**复刻官方色板**（gray/blue/purple/pink/red/amber/green/teal 各 700 档），刻意硬编码以展示真实取值。旁边 L159 注释明确写了"主题自适应，等效官方 dark 白14%/light 黑8%"，说明作者是有意为之。
- **`26.7px` / `8.4px` / `0.571429px`**（`docs-cards.tsx` L104/174/179）：8 列 × 3 行官方实测值的精确复刻，注释已说明。改动会破坏 replica 一致性。
- **`pages/tokens.tsx` L91-104** 的 `8px` / `#0070f3`：这是 **API 用法示例**（`setToken("--radius","8px")`），本身就是演示 token 机制。

## P3 — 易误判，实为文档文案

`content/` 与 `data/` 里的 px 绝大多数出现在**中英文双语的规格描述字符串**中：

- `data/component-api.ts` L232：`"Full pill or rounded rectangle (4px radius)."`
- `component-api.ts` L927：`"Bottom geometry below 640px and a right panel above it..."`
- `components.ts` L506：`"...below 640px it uses the bottom geometry..."`
- `guides-06.ts` L547：`"Default uses 340px and expanded Inline 336px..."`

这些是**文档在描述组件的规格**，不是样式。替换成 token 会破坏文档语义（读者需要看到具体数字）。**保持原样。**

唯一例外：若同一数字在中英文之间不一致，那是**真 bug**，值得单独排查。建议后续做一次 en/zh 数值一致性比对。

---

## 建议执行顺序

1. **抽 `--uni-doc-layout-*` 布局族**（6 个 token，覆盖 P0 约 15 处）→ `tokens:generate` → `typecheck` → `test`
2. **接上 `480px` 反馈断点** → 收敛 7 处重复
3. **决定 P1 死 token 归属**：接入 or 移除（建议接入）
4. **做一次 en/zh 文案数值一致性校验**（防 bug，非重构）
5. **明确写入 AGENTS.md 或注释**：`examples/` `content/` `data/` 的硬编码是契约性豁免，避免未来 agent 误做批量 token 化

> 全程不动 `examples/`、`content/`、`data/`、`pages/`。改动面约 5 个文件。
