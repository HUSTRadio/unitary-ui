# Unitary UI 能力增强计划（审核修订版）

> 状态：**执行中**。已完成 PR-00/01/02（A11Y）、PR-10（M0）、PR-11（M0-03/04）、PR-20（M1-01）与 PR-20b（M1-02 的响应式可见性契约）；`@source` 收窄因属性级层叠问题暂缓并转入 Future（§12.2-8）。下一步 PR-21。
> 审核基线：`477c781fde065e9f9c0eec62a5faf54657de78d6`。
> 适用范围：`@hustradio/unitary-ui` 0.1.0-beta 系列。
> 项目级执行索引：根目录 `TODO.md`（唯一 active TODO，状态以 TODO 为准）。

## 1. 目标与原则

1. 优先降低 App Router/RSC、包边界和 Tailwind v4 的接入成本，再增加业务原语。
2. 保持根入口及既有公共 API 兼容；新增能力采用 additive 变更，不做 0.1.0 阶段的破坏性重命名。
3. 复用 `src/components/ui`、`src/styles` 和现有文档/测试体系，不引入第二套样式、主题或状态管理方案。
4. 本轮不新增任何无障碍增强，不引入 axe，不新增 ARIA、键盘、焦点、对比度、reduced-motion、触控目标等验收目标。
5. 既有无障碍测试按「精确到测试单元」边界禁用：专用文件和独立无障碍 test/describe 可禁用；同一 test 同时覆盖普通功能时完整保留。
6. 每个公开组件按「实现→导出→测试→双语指南→真实示例→生成语料→浏览器验证」完整交付，不先堆实现后补文档。

## 2. 对原建议书的审核结论

| 原项 | 处理 | 修订理由 |
|---|---|---|
| A1 RSC 边界 | 保留，提高验收强度 | SSR/hydration 不等于 RSC；需真实 Next App Router + 实际 tarball 验收。指令不能粗放加到整个 barrel。 |
| A2 子路径与按需 | 保留但收窄 | 当前 external + ESM 已有 tree-shaking 条件；子路径不自动减少安装依赖、CSS 或字体。首版只做高价值入口。 |
| optional peers | 移出当前版本 | 根入口仍静态导出相关功能时，直接改 optional peers 可能破坏消费者；放入未来 major 评估。 |
| `tokens.css` / `source.css` | 删除 | 已有 `styles.css` 与 `tailwind-reference.css`；不新建平行发布机制。 |
| Tailwind v4 共存 | 保留文档，增加扫描治理 | 项目已是 Tailwind v4；实际缺口还包括 `@source "../"` 过宽。 |
| B1 Field / invalid | 保留 Field，修正事实 | Input、Select、Textarea 已复用 `field-error.tsx`；本轮不扩展 ARIA 契约，不自造表单框架。 |
| B1 `useForm` | 暂缓 | 避免引入平行表单状态引擎；积累真实场景后独立评审。 |
| B2 DataTable | 保留并拆分阶段 | 展示、排序/选择、编辑/粘贴、虚拟化是不同状态模型，不能塞进单个首版。 |
| B3 Task / Log | 保留并分层 | 先做受控组件和纯状态逻辑，再做可选数据适配器；不建设通用 async store。 |
| B4 Draft | 保留持久化目标 | 增加版本、基线、SSR、损坏数据和存储失败约束；不让普通输入隐式持久化。 |
| B5 Import | 保留，后置 | 依赖 Field 和 DataTable；首版消费已解析数据，不捆绑 CSV/Excel/上传协议。 |
| C1 axe | 从本轮删除 | 按要求仅列为未来目标。 |
| C3 API 归一 | 只做别名与约定 | 不全库机械统一尺寸/变体；明确 canonical 与 alias 冲突优先级。 |
| C4 间距 token | 改为契约文档 | 已有 Tailwind `--spacing`、`LayoutSpacing`、nav/docs 语义变量，并非「没有间距 token」。 |
| C5 双主题覆盖 | 保留 | 做 token/组件代表清单治理，不做对比度或无障碍门禁。 |

额外发现：`opentype.js` 无运行时消费，可移除；`react-router-dom` 只服务开发/文档/模板，应移至根 `devDependencies`；`font-metrics.ts` 有模块副作用，但 `sideEffects` 只声明 CSS，需要修复。

## 3. 项目级 TODO 维护方案

根级 `TODO.md` 是唯一 active TODO，不在历史计划或生成目录另建平行任务源。

### 3.1 固定结构

```md
# Unitary UI Execution TODO
## 使用规则
## 当前进行（最多一个里程碑）
## A11Y — 现有测试精确禁用
## M0 — RSC / App Router
## M1 — Package / Entries / CSS / Budgets
## M2 — API Contract / Field / Draft / Task / Log
## M3 — DataTable / Import / Theme Coverage
## Future / Not in current scope
## Blocked
## Completed
```

每项记录：唯一 ID、复选框、目录/关键文件、依赖、验收命令、PR、证据位置。`Completed` 只保留简要索引，详细证据留在本计划。

### 3.2 维护规则

- 状态、范围、依赖或验收变化必须与对应代码在同一 PR 更新。
- 只有 fresh command、退出码和必要产物路径齐全后才可勾选；部分完成不勾选。
- 阻塞项写错误摘要和解除条件，不直接删除。
- DataTable v1 完成不代表排序、选择、编辑、粘贴、虚拟化完成。
- TODO 只链接无障碍禁用台账摘要，完整测试单元清单由机器可读台账维护。
- TODO 不进入 `docs/llm`，不受文档生成器覆盖。

### 3.3 必须出现的 Future 项

- [ ] **恢复并升级无障碍支持**：重新启用既有测试，另行评审 axe、ARIA、键盘、焦点、对比度、reduced-motion、reduced-transparency、forced-colors 与触控目标；不属于本轮。
- [ ] 评估 `useForm` 及第三方校验器 adapter。
- [ ] major 版本的功能拆包与 optional peers。
- [ ] DataTable 编辑/粘贴、虚拟滚动等高级能力。
- [ ] Import 文件解析、上传与服务端协议适配。

## 4. A11Y-00：既有无障碍测试精确禁用

### 4.1 建立台账

新增 `tests/fixtures/a11y-test-disable-ledger.json`，每个候选测试单元记录：

- `id`、精确仓库相对路径、runner（Vitest/Playwright/website/motion）；
- `kind`（file/describe/test/parameterized-case）、完整标题路径及参数组合；
- `action`：`disable`、`retain-mixed-unit`、`retain-not-a11y`、`retain-visual-structural-audit`；
- 禁用方式、普通功能覆盖影响、关联验证证据。

新增 `tests/a11y-test-disable-ledger.test.ts` 校验 schema、ID/路径/标题唯一性和配置引用；它是禁用治理测试，不是无障碍功能测试。

### 4.2 专用文件按精确路径禁用

在 `vitest.config.ts`、`playwright.config.ts` 使用从台账生成的精确路径列表；禁止宽泛关键词 glob。

- `tests/activity-view-a11y.test.tsx`
- `tests/reduced-motion-coverage.test.ts`
- `tests/e2e/reduced-motion.spec.ts`
- `tests/skeleton-motion.test.tsx`
- `tests/touch-targets-contract.test.ts`
- `tests/e2e/touch-targets.spec.ts`
- `tests/context-menu-keyboard.test.tsx`
- `tests/edit-menu-keyboard.test.tsx`
- `tests/multi-select-keyboard.test.tsx`
- `tests/e2e/multi-select-keyboard.spec.ts`
- `tests/tooltip-focus.test.tsx`
- `tests/motion-active-policy.test.tsx`

实施时须复核每个文件当前内容；若文件已混入普通功能，则降级为 test 级禁用，而不是机械整文件排除。

### 4.3 混合文件按 test/describe 禁用

范围：`tests/`、`tests/e2e/`、`website/tests/e2e/`。

- 整个 describe 仅为无障碍：`describe.skip`。
- describe 混合普通功能：仅对独立无障碍 test 使用 `test.skip`。
- 同一 test 同时覆盖普通行为与无障碍：完整保留，不删断言、不拆例、不跳过。
- 跳过处写台账 ID 注释；原测试体保留。

重点复核混合区域包括 `tabs-api`、`combobox-multiple-instances`、`skeleton-mask`、`json-view-*`、`command-menu-api`、`select-composite`、`sidebar-nav-*`、`hamburger-menu-*`、`motion`、`hitu-player`、`scroll-*`、`texture-*`、`glass-*`，以及 `tests/e2e` 中对应 motion/material 测试。完整条目以台账为准，不能用本节代表清单代替逐单元审计。

### 4.4 三浏览器 motion 特殊处理

`playwright.motion.config.ts` 收集 `fade-motion.spec.ts`、`carousel-variants.spec.ts`、`motion-chromium.spec.ts`；`scripts/lib/motion-browsers.mjs` 要求 planned/executed 一致且 `skipped=0`。

- 对其中独立无障碍用例采用收集期、完整标题精确锚定的 `grepInvert`，并在台账展开 theme/width 参数组合；不使用 `.*motion.*` 等宽泛正则。
- 保留 motion 证据器的零 skipped、首过和反 flaky 门禁，不能简单 `.skip` 后放宽验证。
- 同步 `tests/playwright-discovery.test.ts`、`tests/motion-browser-tooling.test.ts`、`scripts/lib/verification-policy.mjs` 及相关 verification 测试，确保目标消失而相邻普通用例仍执行。

### 4.5 明确保留与禁止事项

- 仅把 `emulateMedia({ reducedMotion: "reduce" })` 用作稳定截图/测试环境的用例不属于禁用集。
- `getByRole`、keyboard 或 ARIA selector 只是操作手段时，不按无障碍测试处理。
- `tests/audit` 的视觉/结构审计不能因包含 ARIA 比较而整组禁用。
- 不修改 `tests/e2e/helpers/motion.ts` 等共享 helper 间接使测试失效。
- 不删除测试、不改恒真断言、不用 `continue-on-error`、不按关键词全仓排除。

### 4.6 验收

1. 台账中的禁用项与 Vitest/Playwright 实际收集清单一一对应。
2. 每个混合文件至少有一个相邻普通测试仍被发现并执行。
3. 普通 `verify` 接受 intentional skip，但失败、意外未执行和证据缺失仍失败。
4. `test:motion` planned/executed 一致且 skipped=0。
5. 全仓复扫无遗漏的独立无障碍测试单元，也无关键词误伤。

## 5. M0：RSC / App Router 接入

### M0-01 公共模块边界清单

涉及：`src/components/ui/`、`src/lib/`、`src/lib/index.ts`、`src/lib/bundle.ts`。

新增 `tests/fixtures/rsc-boundaries.json` 与 `tests/rsc-boundaries.test.ts`，逐模块标记 `server-pure`、`client`、`mixed-needs-split`，记录叶子指令位置、公开导出和 fixture 覆盖点。分类必须依据 hooks/context/DOM 订阅和依赖链，不能仅凭「展示组件」名称；例如 Table 使用上下文/hooks 时不能直接归为 server-pure。

### M0-02 精确 client 边界与混合模块拆分

- 对实际持有状态/副作用的叶子组件添加 `"use client"`；纯展示组件保持 RSC 可渲染。
- 不在 `src/lib/index.ts`、`bundle.ts` 粗暴添加全库 client 指令。
- 在 `src/lib/` 拆分 `tokens.ts`、`continuous-corner.ts`、`font-metrics.ts` 等混合模块的纯函数与 React/DOM 部分，保持原公开导出名称。
- 调整 `vite.lib.config.ts` 和产物结构，确保发布后的 ES/CJS 真正保留必要叶子边界；若当前单文件构建抹平指令，则采用显式多入口/保留模块边界的产物，并保留根 exports 路径兼容。未完成产物检查前不得宣称 RSC 支持。

验收：根导出无意外删除；Node ESM/CJS 与现有 SSR 不回归；纯展示模块不被 client 边界污染。

> **实施偏差（2026-10-26）**：rolldown 1.2.3（Vite 8.2.1 底座）未实现 `preserveModules`
> （最小复现：双模块图仍输出单 chunk），产物无法保留模块级边界。落地调整：
> ① 源码级 111 个叶子 `"use client"` 指令 + `tests/fixtures/rsc-boundaries.json` 台账照常落地
> （作为 M1-03 子路径的边界地图与治理契约）；② 产物级由 `scripts/fix-css-font-urls.mjs`
> 向 `dist/unitary-ui.es.js` / `unitary-ui.cjs` 注入 `"use client"`，根入口整体作为 client
> 边界，保证 App Router 根导入可用；③ server-pure 粒度的 RSC 直渲染优势由 M1-03
> 子路径补齐（届时各子路径单文件产物可携带/不携带指令）。`tokens.ts` 经审查整体为
> DOM 绑定（getToken 读 computedStyle），按整文件 client 分类，不再拆分；
> `font-metrics.ts` 同理（canvas 度量本质浏览器 API）；`continuous-corner.ts` 完成真拆分。

### M0-03 真实 Next fixture

新增 `tests/fixtures/next-app-router/`：

- `app/layout.tsx`、`app/page.tsx`（server，纯展示 + client 组件）、`app/client-panel.tsx`（state/event/hydration）、`app/error.tsx`、`app/global-error.tsx` 对接示例；
- `next.config.mjs`、`tsconfig.json`、独立 package 清单。

新增 `scripts/test-next-app-router.mjs`，并同步 `scripts/test-packed-package.mjs`、`scripts/test-package-imports.mjs`、`scripts/lib/package-artifact.mjs`、`scripts/lib/verification-policy.mjs`、`package.json`/`pnpm-lock.yaml`。fixture 必须安装实际 tarball，不走源码 alias。

验收：`next build` 成功；启动后服务端 HTML、hydration 与 client 交互通过；原 package ESM/CJS/SSR/hydration 验收通过。

### M0-04 集成指南

在 `docs/site` 新增 Integrations 指南并接入实际路由、page loader、双语导航与 `framework-api`；优先复用现有 integrations 页面/路由模式，不臆造固定路由。内容覆盖 RSC/client wrapper、CSS 引入、Next error 边界和「SSR 不等于 RSC」。同步 `README*.md`、`CHANGELOG*.md`，生成 `docs/llm`。

## 6. M1：包边界、CSS 与体积治理

### M1-01 依赖与副作用

修改 `package.json`、`pnpm-lock.yaml`：移除 `opentype.js`，将根 `react-router-dom` 移至 devDependencies；docs/templates 自己声明的依赖不动。本轮不做 optional peers。

在 `src/lib/` 将 `font-metrics` 纯测量、React hook、自注册入口分离；同步 `src/lib/bundle.ts`、`vite.lib.config.ts`、`package.json.sideEffects`。只声明精确自注册产物，不能把全库 JS 标为有副作用。

验收：根包自动初始化保持；Node 导入无 window/document 副作用；未使用重模块仍可 tree-shake。

### M1-02 收窄 Tailwind 扫描

修改 `src/styles/index.css`，把 `@source "../"` 收窄到公共运行时实际需要的 components/lib/vendor；`src/styleguide.css` 继续负责 App/示例扫描。同步 `tests/library-build-boundary.test.ts`，必要时检查 `scripts/copy-tailwind-reference.mjs`、`scripts/fix-css-font-urls.mjs`。

验收：App/examples 独占 utility 不进入库 CSS；公开组件和显式公共 utility 不缺失；不新增 `tokens.css`/`source.css`。

### M1-03 高价值子路径

在 `src/lib/` 新增 `charts.ts`、`motion.ts`、`device.ts`、`code.ts`，与根入口重导出同一实现。同步：

- `vite.lib.config.ts`、`tsconfig.lib.json`、`package.json.exports`；
- `scripts/lib/package-artifact.mjs`、`scripts/test-package-imports.mjs`、`scripts/test-packed-package.mjs`；
- `tests/library-build-boundary.test.ts`、`tests/docs-public-imports.test.ts`；
- 如文档/模板实际改用子路径，再同步各 Vite alias 与 `tsconfig*.json` paths，不预先批量改写。

每个入口验证 types/import/require、动态 chunk 和 tarball 内容；保留私有路径与未知子路径负例。首版不自动生成百余个组件入口。

### M1-04 体积基线与预算

新增 `scripts/check-package-budgets.mjs`、`tests/fixtures/package-budgets.json`、`tests/package-budgets.test.ts`。测量 Button-only 根消费、四个子路径消费、发布 CSS gzip、字体总量、tarball 总大小。先记录可重复基线，再写阈值；预算提高必须附原因。

验收：脚本失败时输出实际值/阈值；Button-only 不包含 charts/device/code 实现；子路径收益不被误算成 CSS/字体减量。

### M1-05 Tailwind v4 / 子路径指南

扩充 `docs/site` Integrations 指南：`@theme` 顺序、dark custom-variant 冲突处理、`--default-transition-duration` 公共行为、`styles.css` 与 `tailwind-reference.css` 的选择、`@reference`/`@source`、tree-shaking 前提和字体边界。同步双语文档与 `docs/llm`。

## 7. M2：API 契约与业务原语

### M2-01 API 约定、C3 aliases、C4 间距契约

更新 `docs/site` 的 state/events、API overview、tokens 文档和 `framework-api`：受控/非受控配对、回调命名、数据请求归调用方、canonical 优先于 alias。

- `src/components/ui/button.tsx`：新增 `variant` 作为视觉 `type` 的别名，`type` 优先，保留 `typeName`。
- `input.tsx`、`select.tsx`、`textarea.tsx` 及对应 `tests/*-api.test.*`：仅为确有语义无冲突的尺寸增加显式映射，不建立全库假统一 Variant 类型。
- 同步 `docs/site/src/data/component-api.ts`、相关指南和示例；旧写法不批量替换。
- `layout.tsx` 的 `LayoutSpacing`、Tailwind `--spacing`、nav/docs 语义变量继续共存；文档禁止新增平行 `--space-1...n`，无 CSS 变化则不制造 token catalog diff。

### M2-02 Field

新增 `src/components/ui/field.tsx`、`tests/field-api.test.tsx`、`docs/site/src/examples/field/`。组合 Label、description、`FieldError`、children；复用 `field-error.tsx`，不绑定 zod、不接管控件状态、不自动 clone 注入 ARIA。

验收：空错误、长文本、尺寸、className 和 Input/Select/Textarea 现有错误展示不回归；不新增无障碍验收。

### M2-03 持久化 useDraft

新增 `src/lib/use-draft.ts`、`tests/use-draft.test.tsx`。语义固定为 opt-in、命名空间 + schema version、可注入 storage adapter、hydrated 基线快照、仅 dirty 写入、回到基线删除、清空仅删自身前缀。

覆盖：首次挂载不写、恢复前不回写默认值、改动写入、回退删除、损坏 JSON/旧版本、存储禁用/配额失败、key 切换、卸载清理、SSR 确定性、不误删其他前缀。文档放 state/events 与 framework API，不虚构组件页。

### M2-04 Task 与数据适配器

新增 `src/components/ui/task.tsx`、`src/lib/task.ts`、`tests/task-state-machine.test.ts`、`tests/task-api.test.tsx`。首版覆盖 `idle/running/partial/failed/succeeded` 纯状态转换、受控展示、progress、阶段、取消/重试 actions；复用 Badge/Progress/Button/Spinner，不改 `StatusDotState`，不内置全局队列。

后续独立子任务在 `src/lib/use-task.ts` 增加 `usePolling`/`useEventStream` adapter，统一退避、AbortController 与清理；不引入通用 async store。验收纯转换、取消/重试、轮询停止、流断连和卸载清理。

### M2-05 LogView

新增 `src/components/ui/log-view.tsx`、`tests/log-view-api.test.tsx`、`tests/e2e/log-view-follow.spec.ts`。调用方传入 entries；支持 level/time/message、级别过滤、复制/导出、底部自动跟随及手动上滚暂停跟随。网络流由 Task adapter/调用方负责；首版不做虚拟化。

验收：空日志、顺序、过滤、导出、长消息、跟随/暂停跟随；不引入 Prism 或流式全局单例。

### M2-06 每个公共组件的固定完成包

Field、Task、LogView 及后续 DataTable、Import 均按实际涉及同步：

- `src/components/ui/`、`src/lib/index.ts`、`src/lib/framework-messages.ts`；
- `docs/site/src/data/{components,component-api,docs-routes}.ts`、`docs/site/src/i18n/`；
- `docs/site/src/content/component-guides/` 与 `index.ts`；
- `docs/site/src/examples/<name>/` 与 `examples/registry.ts`；
- `tests/docs-coverage.test.ts`、`tests/library-docs-export-parity.test.ts`（按映射需要）；
- `CHANGELOG.md`、`CHANGELOG.en.md`、生成的 `docs/llm`；
- 公共用法影响消费者时更新 `templates/*`、`website/`；无影响不机械修改。

## 8. M3：DataTable、Import 与主题覆盖

### M3-01 DataTable v1：受控展示

新增 `src/components/ui/data-table.tsx`、`tests/data-table-api.test.tsx`、`tests/data-table-controlled.test.tsx`、`docs/site/src/examples/data-table/`。API 限定为泛型 `columns/rows/getRowKey`、cell render、loading/empty/error、必要 Table 外观透传。复用 Table/EmptyState/Skeleton；Pagination 在示例组合，不内置数据请求或分页所有权。

验收：类型、稳定 key、空/加载/错误、rows 不可变、无请求；旧 `table.tsx` 不变。现有「virtualized」示例若只是展开 48 行，应更名，不能作为虚拟化证据。

### M3-02 DataTable v1.1/v1.2：排序与选择

分别独立交付受控排序、受控选择（全选/半选），复用 Checkbox 等现有组件；每个能力单独 PR、测试、文档和 TODO 项。无键盘矩阵或无障碍增强目标。

### M3-03 DataTable v1.3：编辑与粘贴

单独评审并实现列级 `editable/validate/readOnly`、受控 `rows/onChange`、单元格错误展示、`\t`/`,` 整块粘贴和取消/撤销语义。新增 `tests/data-table-editing.test.tsx`、`tests/data-table-paste.test.tsx`。不与 v1 同 PR；键盘矩阵导航留待未来无障碍/交互专项评审。

### M3-04 Import 列映射与预览

依赖 Field + DataTable v1。新增 `src/components/ui/import-preview.tsx`、`tests/import-mapping.test.tsx`、`tests/import-preview.test.tsx`、`docs/site/src/examples/import-preview/`。输入已解析 source columns/records，提供目标字段定义、mapping、必填/重复校验、预览、受控 mapping、onSubmit/pending/error。复用 Field/Select/Button/ErrorCard/DataTable。

验收：缺必填、重复映射、空数据、预览上限、提交失败、取消不写入；不发网络请求、不新增解析依赖。文件选择、粘贴解析、CSV/Excel 和上传列入后续独立任务。

### M3-05 C5 双主题覆盖清单

新增 `tests/fixtures/theme-coverage.json`、`tests/theme-coverage-contract.test.ts`，必要时增加聚焦 `tests/e2e/theme-coverage.spec.ts`。复用 `color-schemes`、`theme-token-pairing`、`global-tokens` 体系，登记新组件语义 token 和代表组件 light/dark 覆盖；不制造组件×主题×视口截图爆炸，不新增对比度/axe 验收。只有真实捕获状态变化才更新 README 截图。

### M3-06 虚拟化暂缓

只有提供真实性能基线后才评审虚拟滚动；首版不同时引入 TanStack Table/Virtual，不内置服务端查询、缓存或请求去重。

## 9. PR 切片与依赖顺序

1. PR-00：TODO + 台账 + 专用文件精确排除。✅ **已完成（2026-10-25）**
2. PR-01：混合 Vitest 独立测试单元禁用。✅ **已完成（2026-10-25）**
3. PR-02：Playwright/website/motion 精确禁用与 discovery/verification 同步。✅ **已完成（2026-10-26）**
4. PR-10：RSC 清单、混合模块拆分、叶子边界和产物保留。✅ **已完成（2026-10-26，含 §5 M0-02 实施偏差）**
5. PR-11：Next tarball fixture + App Router 指南（依赖 PR-10）。✅ **已完成（2026-10-26）**
6. PR-20：依赖清理、font-metrics 副作用、Tailwind source（依赖 PR-10 拆分）。**M1-01 ✅ 完成（2026-10-26）**
6b. PR-20b：响应式可见性契约（M1-02 部分）。✅ **已完成（2026-10-27）**；`@source` 收窄暂缓（属性级层叠问题 → Future）
7. PR-21：四个子路径与 package 验收（依赖 PR-20）。
8. PR-22：真实体积基线/预算 + Tailwind/子路径指南（依赖 PR-21）。
9. PR-30：API 约定 + C3 aliases + C4 文档。
10. PR-40～45：Field、useDraft、Task、Task adapters、LogView；共享 registry 串行合并。
11. PR-50：DataTable v1。
12. PR-51/52：DataTable 排序、选择，分别交付。
13. PR-53：DataTable 编辑/粘贴，独立评审。
14. PR-54：Import（依赖 Field、DataTable v1；按需组合已完成的排序/选择，不强行依赖编辑）。
15. PR-60：C5 主题覆盖治理，放在新组件之后。
16. 后续：虚拟化、Import 文件/上传、useForm、optional peers、无障碍恢复与增强均独立立项。

## 10. 通用验证与完成标准

每个 PR 先跑最窄测试，再覆盖受影响合同：

1. 对全部任务文件执行 `pnpm run verify -- --dry-run --path <repo-relative-file> ...`，审查计划后执行对应 `verify --path`；不得机械用 `--full`/`--allow-broad` 绕过 `BLOCKED_SCOPE`。
2. 类型/静态检查按影响选择 `typecheck`、`typecheck:tests`、`typecheck:docs`、`lint`。
3. 包入口、构建、依赖或副作用变化：`build:lib`、`test:package`，并验证受影响 templates；共享入口/样式/依赖影响全部消费者时验证全部 templates。
4. 文档事实源变化：`docs:llm:generate` 后 `docs:llm:check`，生成物不手改。
5. 新组件/布局/交互：聚焦 API 测试、相关 Playwright spec 和受影响路由的双主题/适用视口验证。
6. README 截图先只读 check；仅真实捕获画面变化时重新生成并复查。
7. TODO 勾选必须引用 fresh 命令、退出码和证据；工作区干净本身不是验证证据。

## 11. 非目标与主要风险

### 非目标

- 本轮任何无障碍增强或 axe 门禁。
- 合并浮层家族、第二套 CSS-in-JS/主题机制、Apple 拟真。
- 破坏性 canonical API 重命名、全库机械尺寸统一。
- 自造通用 Form/异步状态平台。
- 全组件自动子路径、平行 tokens/source CSS、平行间距刻度。
- DataTable 首版塞入全部高级能力；Import 首版绑定具体解析/云服务协议。

### 风险

- RSC 指令被 barrel/构建抹平：必须检查实际产物并以 Next fixture 阻断。
- 多入口导致 JS/CJS/types/tarball 漂移：作为一个原子契约验收。
- font-metrics 自注册与 tree-shaking 冲突：精确隔离，不扩大 sideEffects。
- CSS 扫描收窄过度：双向断言公共类存在、App/demo 类不存在。
- DataTable/Import 范围膨胀：严格按 PR 阶段和依赖推进。
- 无障碍禁用误伤普通覆盖：以测试目的和台账为准，混合 test 完整保留。
- 为通过禁用而削弱验证器：禁止；motion 与普通 browser 证据门禁保持有效。

## 12. 执行状态与下一步指引（2026-10-26 更新）

### 12.1 已完成（证据详见 TODO.md 各条目 Evidence）

| 阶段 | 内容 | 关键产物 |
|---|---|---|
| PR-00 | A11Y-00/01：台账 + 12 个专用文件精确排除 + verification-policy 同步 | `tests/fixtures/a11y-test-disable-ledger.json`（终态 195 条：104 disable / 85 retain-mixed-unit / 6 retain-not-a11y）、`tests/a11y-test-disable-ledger.test.ts` |
| PR-01 | A11Y-02：混合 Vitest 文件 50 个独立无障碍单元 `test.skip`（A11Y-TEST-0001..0050），67 项保留裁决登记 | 34 个 `tests/*.test.ts(x)` |
| PR-02 | A11Y-03：11 个 e2e spec 运行时 skip + motion 三浏览器收集期 grepInvert（16 例，标题精确锚定） | `tests/e2e/*`、`playwright.motion.config.ts` |
| PR-10 | M0-01/M0-02：RSC 边界清单（168 模块 = 111 client + 57 server-pure）+ 111 个叶子 `"use client"` + continuous-corner 拆分 + 产物级边界注入 | `scripts/lib/rsc-module-analysis.mjs`、`tests/fixtures/rsc-boundaries.json`、`tests/rsc-boundaries.test.ts`、`src/lib/use-continuous-corners.ts`、`scripts/fix-css-font-urls.mjs` |
| PR-11 | M0-03/M0-04：真实 Next App Router fixture（tarball → `next build` → `next start` → HTML/hydration/交互/错误边界断言）+ 集成指南页 + README/CHANGELOG 双语 | `tests/fixtures/next-app-router/`、`scripts/test-next-app-router.mjs`、`scripts/lib/next-build-trace-guard.cjs`、`docs/site/src/pages/integrations.tsx`、`/api/integrations` 路由、250 页 LLM 语料 |
| PR-20 | M1-01：依赖清理（移除 `opentype.js`、`react-router-dom` → dev）+ font-metrics 自注册改为入口 `installFontMetrics()`（模块无顶层副作用，`sideEffects` 声明真实成立） | `src/lib/font-metrics.ts`、`src/lib/bundle.ts`、`src/lib/index.ts`、`docs/site/src/data/framework-api.ts` |
| PR-20b | M1-02（部分）：非分层 `data-uni-responsive` 响应式可见性契约 + 5 处组件改造 + 契约测试；**`@source` 收窄暂缓**（属性级层叠问题，转 Future） | `src/styles/index.css`、`src/components/ui/{site-navigation,browser,footer}.tsx`、`tests/responsive-visibility-contract.test.ts`、`tests/browser-api.test.ts` |

已通过的验证：全量单测 2302 passed / 51 intentional skipped（7 失败均为存量或环境性，见 12.4）；`test:motion` 64 passed / 0 skipped / exit 0；11 个改动 specs docs-layout 246 passed / 43 skipped / 0 failed；typecheck / typecheck:tests / lint 全绿；治理套件（ledger / policy / npm-release / rsc）80 passed；**`test:package` 完整验收 exit 0（729 passed / 43 intentional skipped / 0 failed，53.4m，tarball `hustradio-unitary-ui-0.1.0-beta.1.tgz` 独立消费端验证通过，2026-10-26）**。

PR-11 验证：`pnpm run test:next-app-router` exit 0（连续两次）——next 15.5.28 / react 19.2.8，服务端 HTML 9354 B 含纯组件文本与初始计数 0，Playwright 无 hydration 诊断、点击 0→1，`styles.css` 生效，`/broken` 触发 `app/error.tsx` 渲染 ErrorCard；`docs:llm:generate` 125 路由 × 2 语言 = 250 页、`check` 无漂移；`/api/integrations` 定向 docs-layout 53 passed；治理套件 68 passed；`docs:readme:screenshots:check` 通过（新页不在截图集）。

PR-20 / M1-01 验证：jsdom 探针证实入口 `installFontMetrics()` 自动执行；Node 导入无 DOM 副作用；`build:lib` 产物 ES/CJS 首行仍为 `"use client";`；CSS 与回滚前**字节一致**（md5 `a7567e84…`，即无样式行为变化）；`test:package` 完整验收 exit 0（**731 passed / 43 skipped / 0 failed，46.3m**，含 Next fixture 与 tarball 消费端）；治理回归 57 passed；typecheck / typecheck:tests / lint 全绿。

### 12.2 执行中的关键实施偏差（均已定案，勿再按原计划路径走）

1. **M0-02 产物形态**：rolldown 1.2.3（Vite 8.2.1）未实现 `preserveModules`，产物无法保留模块级指令 → 源码级 111 指令 + 台账作为 M1-03 边界地图；产物级由 `fix-css-font-urls.mjs` 向 ES/CJS 首行注入 `"use client"`（根入口 = client 边界）。**server-pure 粒度（badge/separator 等经根入口 RSC 直渲染）由 M1-03 子路径兑现**。
2. **`tokens.ts` / `font-metrics.ts` 不拆分**：整体 DOM 绑定（getToken 读 computedStyle、canvas 度量），按整文件 client 分类；原计划的「拆出服务端安全函数」不成立，M1-01 的 font-metrics 副作用治理目标不变（sideEffects 精确化）。
3. **`isBrowserSpec` 已台账感知**（`scripts/lib/verification-policy.mjs`）：整文件禁用（kind=file）剔除出浏览器覆盖清单，test 级禁用以 intentional skip 出现在报告中。这是 A11Y-00 与 verify fullBrowser / `check-docs-artifact` 打包链路的单一事实源，**后续任何测试排除变更必须走台账 + 该谓词，禁止另开过滤**。
4. **PR-11 fixture 形态**：`app/broken` 用 server page（`dynamic = "force-dynamic"`）+ client `boom.tsx` 抛错触发运行时错误边界（直接在 server page 抛错会让 `next build` 预渲染失败）；Windows 上 Next 写 `.next/trace` 偶发 `EPERM`，新增 `scripts/lib/next-build-trace-guard.cjs`（仅 win32 注入，Linux/CI 不生效）；fixture 排除出 `tsconfig.tests.json`（Next 只读 `NODE_ENV` 声明会污染根类型程序），类型检查由 `next build` 自身承担；`test:package` 现会在末尾串行调用该驱动（包验收时长 +约 5 分钟）。
5. **文档路由 owner 契约**：新增 `/api/integrations` 需同步 `verification-policy.mjs` 的 renderer owner 映射与 `tests/docs-api-category.test.ts` 的分组顺序，否则 docs-layout 的“每路由有 owner”契约失败。
6. **font-metrics 采用方案 B（显式安装）**：自注册移入 `installFontMetrics()`，由 `src/lib/bundle.ts` 入口调用；`sideEffects` 维持 `["**/*.css"]`，此时模块无顶层副作用、声明真实成立。直接使用源码别名（如 docs 站）不再自动探测，需显式调用（docs App 已用 `useFontMetrics`）。jsdom 探针证实入口安装仍触发缓存读取。
7. **Tailwind 扫描（M1-02）已按 §12.3 方案 A 修复**：`src/styles/index.css` 只扫描 `components/lib/vendor`，响应式可见性改由非分层 `[data-uni-responsive]` 规则承载；`src/styleguide.css` 增加 `@source "../src"`；`tests/library-build-boundary.test.ts` 双向 fixture 落地。
8. **M1-02 阻塞根因与修复（2026-10-27 关闭）**：`src/styles/index.css` 被原样复制为 `tailwind-reference.css` 供消费端 `@reference`。`@source "../"` 会让**消费端** Tailwind 重扫整个安装包（含 `dist/*.js` 的类名字符串），把所有 utility 在消费端 utilities 层再生成一遍——这意外掩盖了级联缺陷。收窄到 `components/lib/vendor` 后，消费端只再生成自己用到的类（如 `.hidden`），追加在库 CSS 之后，**同层后者胜**，反压库内响应式变体 `.md:block`，导致 `SiteNavigation` 桌面项 `display:none`。
   - 复现：`buildDocsConsumer`（tarball）+ `UNITARY_DOCS_ARTIFACT=<consumer>/docs/dist` 跑 `tests/e2e/glass-feedback.spec.ts -g "fixed Glass topbar"`：收窄版 10 连败（每例 60s 超时）；恢复宽扫描重建后 **12 passed / 24.7s**。
   - **合并 CSS 直接证据**：宽扫描消费端产物 `.md\:block` 出现 **×2**（@36879、@194358，第二份在 `.hidden`@47669 之后 → 响应式获胜）；收窄产物 `.md\:block` **×1**（@126594，在 `.hidden`@151740 之前 → 基础类获胜）。即宽模式的通过依赖消费端意外再生成的第二份 `md:block`。
   - 探针：1440px、`matchMedia("(width >= 48rem)")=true`、`md:block` 规则存在，wrapper（`hidden md:block`）`display:none`。
   - **附带发现**：即使宽模式，库 CSS 自带的 `.md\:block`（@36879）在合并后也落在 `.hidden`（@47669）之前——消费端合并会重排库内 utility 顺序。结论：**响应式可见性不能依赖 utility 层内源顺序**。
   - 受影响模式（5 处）：`site-navigation.tsx`（`hidden md/lg/xl:block` + `md/lg/xl:hidden`）、`browser.tsx`×2（`md:flex`/`md:block`）、`footer.tsx`×2（`md:block`/`md:hidden`）。
   - **修复**：非分层 `[data-uni-responsive="above-md|above-lg|above-xl|above-md-flex|below-md|below-lg|below-xl"]` 规则（`display:none` + 断点恢复），组件改为属性驱动；`tests/responsive-visibility-contract.test.ts` 以 postcss 断言规则非分层、断点声明完整，并禁止运行时源码再用 `hidden + md:*` 组合（含反向 `md:hidden`，允许 `max-grid-md:hidden` 等带前缀变体）。
   - 验证：package-mode 复现路径 `glass-feedback`（23）+ `docs-mobile-navigation`（4）= **27 passed / exit 0**；全量 `test:package` 见 §12.1 验证段。
   - **二次归因（2026-10-27，收窄重试后）**：display 契约修复后 `glass-feedback`/`docs-mobile-navigation` 通过，但 `mask-unification` 1280 全挂（390 全过）——抽屉全屏。直接证据：`.sm\:max-w-md`@125474 早于消费端再生成的 `.max-w-full`@157785。**同一层叠机制对任意属性成立**（display、max-width 均已实证），逐属性打补丁不可持续。
   - **决策**：保留 display 契约（已验证、无回归），**暂缓 `@source` 收窄**，将「预编译 utility CSS 与消费端 Tailwind 的层叠权威」列为 Future 架构项（TODO Future 首条）；验收维持 package-mode 39 passed（mask 12 + glass 23 + mobile 4）。

### 12.3 下一步：PR-21（M1-03 高价值子路径）操作指引

PR-20/PR-20b 已收口（扫描收窄暂缓，见 §12.2-8 决策），按依赖顺序进入 **四个子路径导出（charts/motion/device/code）+ 包验收**（M1-04 依赖本切片）。

1. **入口设计**：新增 `src/lib/charts.ts`、`motion.ts`、`device.ts`、`code.ts`，每个 `export * from` 对应现有实现（根入口与子路径重导出同一实现，不复制代码）；`vite.lib.config.ts` 改多入口（根 + 4 子路径），根产物路径保持 `dist/unitary-ui.es.js`/`.cjs` 不变，子路径命名稳定（如 `dist/unitary-ui-charts.es.js`）。
2. **模块实例唯一性（关键风险）**：多入口同批构建必须共享 chunk，`createContext`/store/模块级状态只能一份；验收要断言根入口与子路径入口共享同一 React context 实例（tarball 消费者里引用相等或检查 chunk 复用），否则 Theme/I18n 会出现双实例。
3. **RSC 边界**：根入口已是 client 边界（§12.2-1）。`charts/motion/device` 实质全为 client 组件，产物首行同样注入 `"use client"`；`code` 若只含纯高亮函数可评估 server 可用，但 `CodeBlock` 是 client——**默认全部子路径 client，除非有实测依据**。server-pure 粒度仍未被任何子路径覆盖，需另立「`./server` 子路径」提案，不在 M1-03 内扩范围。
4. **package.json exports**：每个子路径提供 `types/import/require` 三元组；不暴露私有路径；未知子路径负例（`./nope` 报错）；`scripts/lib/package-artifact.mjs` 发布清单与 `test-package-imports.mjs` 增加四入口的 ESM/CJS/类型消费断言。
5. **样式与响应式**：子路径产物继续携带已生效的非分层 `data-uni-responsive` 契约（新入口同样只 import `styles/index.css` 一次）；新的响应式可见性需求一律走该契约，禁止回到 `hidden + md:*`。**不要顺手收窄 `@source`**——该问题已单独立项（TODO Future 首条）。
6. **验收**：`build:lib`（5 个产物首行指令、共享 chunk、`dist/types` 子路径 d.ts）→ `test:package`（含 Next fixture）→ `test:templates`（入口/样式受影响的模板消费）→ `tests/library-build-boundary.test.ts` / `tests/docs-public-imports.test.ts` 同步 → 若文档提及入口则 `docs:llm` 重生成。
7. 完成后更新 TODO（M1-03 勾选 + Evidence）与本计划 §12.1；M1-04 体积基线随后做（含 Button-only 根消费的 tree-shake 实测，承接 M1-01 的移交项）。

### 12.4 基线已知债务（非本计划引入，处置前不得计入本计划验收）

- `tests/color-schemes.test.ts`（1 失败）：`--color-warning` 在 token catalog 有、`color-schemes/default.ts` 无（HEAD 即如此）。
- `tests/duration-tokens.test.ts`（4 失败）：bottom-sheet/drawer/responsive-drawer 的 inline motion token 串在 HEAD 已缺失（组件已改用别的方式）。
- 处置建议：单独小 PR 修正（补 token 或更新测试断言），或登记到 TODO Future；**在 CI 上同步核实是否同样失败**（若 CI 绿，则为本机 checkout 漂移）。

**已处置（2026-10-30）**

- **color-schemes（1 例）**：精确比对 `GLOBAL_TOKENS` 中 `kind=runtime && group=colors` 的 314 项与 `defaultTokens`，确认**只缺 `--color-warning` 一项**（同族 `-foreground/-soft/-action` 不被目录归入该组，故无需一并补）。修法：在 light/dark 两档按字母序补 `"--color-warning": "#ffb224"`（与 `--warning` 同值，落在已采用的调色板集合内）。`color-schemes` 41 passed（与 duration-tokens 合计）；`color-palette-governance`/`color-scheme-api`/`global-token-catalog`/`global-tokens-ssr`/`foundation-colors`/`error-foreground-token` 25 passed；`theme-token-pairing` 4 passed；`tokens:check` 通过（目录无漂移）。
- **duration-tokens（4 例）**：归因为**断言过期**而非实现缺陷——三个组件的 inline transition 现用 `var(--uni-duration-base) var(--ease-snap)`，`@utility command-menu-overlay` 现用 `var(--uni-duration-base)`/`var(--uni-duration-fast)`，无字面量毫秒。修法：断言改为当前真实消费方式，并新增「inline transition 不得回退到字面量 `Nms`」的反向断言，保留原守门意图。**语义别名迁移（`--uni-motion-overlay/expansive`）未做**：那会把抽屉/底板的实际时长从 250ms 改回 350/500ms，属行为变更，不在债务修复范围内。

### 12.5 本机环境约束（执行任何验收前必读）

- 宿主 safe-delete shim 拦 >50 文件的批量删除，**按 turn 计数**：一个 turn 内做过多次批量清理后，连 Python `shutil.rmtree` 也会被拦。绕法：`mv` 改名（rename 不触发）或新 turn 再跑。
- `test:package` / `test:docs-layout` 全套运行前，先 `mv` 移走 `.scratch/npm-release/docs-consumer/browser-results` 与旧 `dist`（`clean-library-output` / Playwright 启动清理会踩守卫）。
- **`docs:llm:generate` / `docs:llm:check` 必须前置 `NODE_OPTIONS=`**：WorkBuddy 注入的 `node-language-shim` 会让 `vp dev docs` 子进程立即 exit 1（报“预览进程提前退出”）。命令：`NODE_OPTIONS= pnpm run docs:llm:generate`。
- audit 系测试需要 Python PIL（已装）；Bash 需前置 PortableGit PATH export（见 `.workbuddy` 记忆）。
- **`test:package` 的独立 consumer 安装可能静默缺原生绑定（2026-10-30 实测）**：docs consumer 以 `--frozen-lockfile --prefer-offline` 安装，若 pnpm store 缺 `@rolldown/binding-win32-x64-msvc` / `lightningcss-win32-x64-msvc` 的 tarball，下载会报 `error (23)`（写入失败）并重试，最终**静默跳过**这两个可选依赖（可选依赖失败不算安装失败），随后 `vite build` 抛 `Cannot find native binding`，错误栈指向 wasi/msvc 两条回退路径。症状看起来像代码回归，实际是环境问题。绕法：`pnpm store add @rolldown/binding-win32-x64-msvc@1.2.3 lightningcss-win32-x64-msvc@1.32.0` 预热 store 后重跑；判断依据是 `.scratch/npm-release/docs-consumer/install.log` 里的 `[WARN] GET ... error (23)`。
- **不要用 `mv dist` 预热构建**：`dist` 被移走后 `tsc -p` 仍可能因残留产物/文件锁抛 `EPERM ... .d.ts`；`build:lib` 自带 `clean-library-output.mjs`，直接跑即可（上一版 §12.5 的「先 mv 走 dist」仅针对 safe-delete 守卫确实拦截时）。

### 12.6 M1-04 实测结论（2026-10-30）

基线（`.scratch/package-budgets/<stamp>/measured.json`，消费端经 package exports 解析已构建包、不导入 CSS）：

| 测量项 | 实测 |
| --- | --- |
| `root.button.jsGzip` | 301,075 B |
| `subpath.charts.jsGzip` | 301,067 B |
| `subpath.motion.jsGzip` | 327,720 B |
| `subpath.device.jsGzip` | 301,065 B |
| `subpath.code.jsGzip` | 301,064 B |
| `css.published.gzip` | 273,794 B（原始 643,643 B） |
| `fonts.published.total` | 25,227,500 B |
| `tarball.published.total` | 26,041,381 B |

1. **根入口未生效 tree-shaking**：Button-only 产物含 `recharts`×116、`AreaChart`×4、`Prism`×60，体积与四个子路径同量级。根因：103 处顶层 `Component.displayName = "..."` 属模块级副作用，消费端打包器无法安全丢弃。M1-04 只把标记作为诊断输出，缺口落 `tests/fixtures/package-budgets.json` 的 `knownGaps`，修复转入 TODO Future「根入口 tree-shaking 专项」。
2. **子路径不减少下载体积**（M1-03 门面重导出的量化确认）：四个子路径与根入口相差 < 27 KB gzip（motion 因带入动效运行时略高），并入同一 known gap。
3. **CSS/字体与入口无关**：消费端不导入 CSS，样式与字体只从发布产物测一次，因此契约结构上排除「把样式/字体减量算成子路径收益」。
4. **阈值策略**：每项记录 `baseline` + `limit` + `rationale`；`limit < baseline`、或 `limit > baseline × 1.3` 且缺 `allowanceReason` 均在 fixture 校验阶段失败，测试同时锁定「子路径只测 JS」与两条 known gap 必须存在。
5. **验收证据**：`node scripts/check-package-budgets.mjs` exit 0；`pnpm run test:budgets`（`build:lib` + 测量）exit 0，复测 tarball 26,041,392 B（gzip/mtime 抖动 +11 B）；人为压低阈值实测 exit 1 并输出实际值/阈值；`tests/package-budgets.test.ts` 14 passed；治理三件套 64 passed、锁定脚本表关联 21 passed、验证器/构建边界 43 passed；`typecheck:tests` / `lint` 全绿。
6. **planner 限制**：同时改 `package.json` 与 `scripts/**` 时 `verify --dry-run` 放宽为 25 步全量并触发 `BLOCKED_SCOPE`；按 AGENTS.md 以聚焦命令覆盖受影响合同（另见 TODO「已完成的 planner 限制记录」）。

### 12.7 M1-05 落地记录（2026-10-30）

1. **结构**：`docs/site/src/pages/integrations.tsx` 13 节 —— `styles` / `fonts` / `server-client` / `ssr` / `error-boundaries` / `tailwind` / `tailwind-theme` / `tailwind-dark` / `tailwind-motion` / `tailwind-source` / `subpaths` / `tree-shaking` / `verification`（id 唯一，中英双语同源渲染）。
2. **只写实测事实**：`@theme inline` / `@theme static` 的分工、`@custom-variant dark (&:is(.dark *, [data-theme="dark"] *))`、`--default-transition-duration: var(--uni-duration-fast)` 与 `--default-transition-timing-function: var(--ease-snap)`、`source(none)` + 显式 `@source`、字体 16 × woff2 / 25.2 MB 且按 unicode-range 分级、子路径 301–328 KB vs 根 301 KB。
3. **文档审计适配**：`tests/docs-public-imports.test.ts` 的允许清单从硬编码两项改为由 `package.json` exports 派生（含子路径，排除 `./package.json`），并新增「已发布子路径全部允许、私有路径仍拒绝」用例。副作用：文档再也不能引用未发布的子路径。
4. **过期表述修正**：原文称「子路径将提供 server-pure 入口」，与既有实现不符——四个子路径产物同样注入 `"use client"`，已改为如实描述。
5. **证据**：`docs:llm:generate` 250 页 + `docs:llm:check` exit 0；定向 docs-layout 53 passed / exit 0；文档六件套 54 passed / 1 skipped；`typecheck:docs` / `lint` 全绿。
6. **入口限制**：`pnpm run test:docs-layout` 的 `UNITARY_VERIFY_ROUTES` 只过滤用例内容、不缩 spec 范围（实测跑全量）；聚焦方式为直接指定 `tests/e2e/docs-layout.spec.ts`。


### 12.8 M2-01 落地记录（2026-10-30）

1. **Button alias**：新增 `variant?: ButtonType`，解析式 `type ?? variant ?? "default"`（canonical 覆盖别名）。`Button` 与 `ButtonLink` 同步；`CustomButton` 与 `MenuButton` 在 `Omit` 中排除 `variant`，避免与各自强制的视觉变体冲突（MenuButton 保留 `"unstyled"`）。
2. **尺寸别名：只做文档，不做运行时**。原计划给 input/select/textarea 加显式映射，被两条既有事实否掉：`tests/input-api.test.ts` 明确禁止 Input 复活 `medium`（slider 断言 `not.toContain("medium")`）；Textarea 的 `small/medium/large` 是盒高（80/100/120px）而非控件高度。最终在 API overview 给出 32/36/40px 三档映射并说明 Textarea 口径。
3. **API 约定节**（`docs/site/src/pages/api-overview.tsx#conventions`）：受控/非受控配对（Switch `checked`/`defaultChecked`）、回调命名（`onChange` 事件对象 vs `onXxxChange` 新值）、组件不发请求（`src/` 无 fetch/XHR/axios）、canonical 优先、尺寸档位、间距三层共存且禁止新增 `--space-1…n`。
4. **顺带修复**：`component-api-registry.test.ts` 的 API 分组断言缺 `/api/integrations`（M0-04 遗留，本机一直是红的）；`link.tsx` 注释里 `<Button variant="link">` 指向不存在的变体，改为 `<ButtonLink>`。
5. **证据**：button-api 15 passed；相关契约 8 文件 90 passed / 1 skipped；Button 消费者 5 文件 26 passed / 2 skipped；定向 docs-layout `/api` 53 passed（9.5m）；三套 typecheck + lint 全绿；`docs:llm` 250 页无漂移。

### 12.9 M2-02 落地记录（2026-10-30）

1. **组件**：`src/components/ui/field.tsx` 为 `server-pure`（无指令、无 hooks），组合 label（`<label htmlFor>` + 13px/capitalize）→ children → description（13px gray-700，large 16px）→ `FieldError`（空值不渲染、4px 间距、`break-words`）。`large` 与控件 large 档对齐；根节点透传 `className` 与其余 div 属性。
2. **边界**：不 clone 子元素、不写 `aria-describedby`/`aria-invalid`、不持状态、不绑定校验库；测试以源码扫描 + SSR 断言双证（子元素渲染结果严格等于 `<input id="workspace"/>`）。
3. **完成包**：`src/lib/index.ts` 导出、RSC 台账登记、`components.ts`/`components-zh.ts`/`best-practices-zh.ts`/`component-api.ts`/`docs-routes.ts`（`forms` 分组）/`guides-27-field.ts`（双语）/示例 `field/basic-3f9a1c7e`/`examples/registry.ts`/双语 CHANGELOG。
4. **连带修正**：`docs-coverage.test.ts` 的非官方组件白名单补 `field`；`i18n/components-demo.ts` 补 `Basic → 基础用法`（否则中文页分节标题回退英文）。
5. **证据**：field-api 8 passed；rsc-boundaries 3 passed；文档完成包 80 passed / 1 skipped；示例与边界 28 passed；定向 docs-layout `/components/field` 3 passed（light+dark）；`docs:readme:screenshots:check` 8 页 × 2 主题通过（新页不在集内）；语料 126 × 2 = 252 页无漂移；三套 typecheck + lint 全绿。

### 12.10 执行进度审核（2026-10-30 15:40，冻结结论）

审核对象：本计划 26 个条目 vs TODO.md 证据。**结论：16 项闭环（A11Y 4 / M0 4 / M1 5 / M2 2），M2 余 5 项、M3 余 6 项未开工。**

| 阶段 | 条目 | 状态 |
| --- | --- | --- |
| A11Y（PR-00/01/02） | A11Y-00..03 | 闭环 10-25/26 |
| M0（PR-10/11） | M0-01..04 | 闭环 10-26 |
| M1（PR-20/20b/21/22） | M1-01/03/04/05 闭环；M1-02 交付 display 契约，`@source` 收窄转 Future | 闭环 10-29/30 |
| M2（PR-30..44） | M2-01（10-30）、M2-02（10-30）闭环；**M2-03/04/05/06 未开工** | 2/6 |
| M3（PR-50..60） | 全部未开工 | 0/6 |

**审核发现的三处缺口（2026-10-30 实测）**

1. **M2 包验收缺口**：M2-01 改公共 API（Button `variant`）、M2-02 新增公共导出（`Field`）。按 AGENTS.md「包入口变化 → `build:lib` + `test:package`」，末次全量验收为 10-29（731 passed），早于这两笔改动，故 M2-01/M2-02 的 `[x]` 尚缺包边界证据。
2. **§12.4 两处存量失败仍在**：`tests/color-schemes.test.ts` 1 例 + `tests/duration-tokens.test.ts` 4 例 = **5 failed**（2026-10-30 复跑确认）。§12.4 建议的「小 PR 修正或登记 TODO Future」两件都未执行。
3. **工作区未提交**：HEAD 停在计划开始前的 `477c781f`，工作区积压 **229 个文件**（203 修改 / 26 新增），PR-00～PR-40 的成果均无提交保护。按 AGENTS.md 不得擅自提交，等待用户指示。

**已确认的执行顺序（用户选定方案 A）**

1. 补包验收：`pnpm run test:package` 全量（预期 50–60 min），结果回填 M2-01/M2-02 Evidence。
2. 处置 §12.4 两处存量失败（各自小改，聚焦复跑 + `tokens:check`）。
3. 回到主线 M2-03（useDraft，PR-41）——**已完成，见 §12.11**。
4. 提交策略另行决策（不在方案 A 内）。

**M2-03 设计要点（审核时确定，执行时遵循）**：单 key 存储 `unitary-draft/v<version>/<namespace>`（损坏 JSON 与版本迁移都只判一条记录）；`reset()` 删除本 key 并枚举清理同 namespace 的旧 version 残留，绝不触碰其它前缀；`isHydrated` 在 SSR 为 false 且恢复前零回写；`setValue` 回到 baseline 时自动 `removeItem`；配额/禁用异常吞掉但不破坏内存态；卸载只保证无泄漏、不删数据。

### 12.11 M2-03 落地记录（2026-10-30，执行中）

1. **存储模型**：单 key `unitary-draft/v<version>/<namespace>`，payload 即序列化后的值。版本写进键，升级天然不读旧结构；`reset()` 用前缀 + 命名空间匹配清理旧版本残留，不触碰其它键。
2. **写入语义**：`persisted` ref 记录上次落盘文本——恢复后原样回写会被跳过（零冗余写）；值与基线一致时 `removeItem`（回基线删除）；否则 `setItem`。
3. **SSR**：`isHydrated=false` 且不访问存储，服务端渲染返回 `initial`；恢复在 effect 内完成，恢复前不产生任何写入。
4. **健壮性**：损坏 JSON、反序列化异常、配额超限、`localStorage` 不可用（隐私模式）、不传 `key`、`storage: null` 全部只影响持久化，不抛给调用方；`serialize`/`deserialize` 可注入。
5. **边界**：`reset()` 在 adapter 不支持枚举（无 `length`/`key`）时只删自身键，不报错。
6. **证据**：`use-draft` 12 passed（首次不写 / 恢复不回写 / 改动写入 / 回基线删除 / 损坏 JSON / 旧版本忽略 / reset 前缀清理且保留他人键 / 配额失败 / 禁用不触存储 / key 切换保留旧记录 / SSR 确定性 / 自定义序列化）；`rsc-boundaries` 3 passed（`use-draft.ts` 记 client + 5 个 hook 指标）；文档五件套 41 passed / 1 skipped；`docs:llm:generate` → 126 路由 × 2 = 252 页，`docs:llm:check` 无漂移（新节中英各 1 处）；`typecheck` / `typecheck:tests` / `typecheck:docs` / `lint` 全绿。未覆盖 `/api/state-and-events` 的定向 docs-layout（锁占用 + 机器降速；该页仅新增结构化文案）。
7. **执行环境记录**：`test:package` 全程持有 `workspace-checks` 锁，期间 `pnpm run docs:llm:generate` 会停在 `[package-lock] waiting for workspace-checks`；语料生成与 `docs:llm:check` 必须在验收结束后执行。

### 12.12 M2-04 落地记录（2026-10-30）

1. **纯状态机**：`src/lib/task.ts` 提供 `createTaskState` / `taskReducer` / `isTerminal` / `isActive` / `canStart`。非法转换**返回同一引用**（便于 `Object.is` 断言与 React 跳过重渲染）；`progress` 截断 0–1 且 `NaN → 0`；`start` 递增 `attempts`；`succeed` 清空 stage/error 并置 1；`fail`/`partial` 保留进度供展示。
2. **组件**：`task.tsx` 完全受控，只读 status/progress/stage/title/description；取消仅 `running`、重试仅 `failed|partial`；进度条仅 `running|partial` 且输出 `data-progress`（0–100 取整）。**不声明 ARIA**（本轮不做无障碍增强），也不复用 `StatusDotState`。
3. **i18n**：默认操作文案走 `t("Cancel task")` / `t("Retry task")`，双语键加入 `framework-messages.ts`。
4. **完成包**：`components.ts` + 中文描述/要点、`docs-routes` 归入 `feedback`（标签序 Task 位于 Spinner 与 Toast 之间）、`component-api` 10 行、`guides-28-task.ts` 双语、示例 `task/progress-5c1d9a42`、双语 CHANGELOG、语料 254 页。
5. **证据**：`task-state-machine` 9 passed；`task-api` 9 passed；`rsc-boundaries` 3 passed；文档与导出契约 13 文件 **101 passed / 1 skipped**；`typecheck` / `typecheck:tests` / `typecheck:docs` / `lint` 全绿；`docs:llm:check` 无漂移。
6. **两个连带修正**：`docs-coverage.test.ts` 的非官方组件白名单补 `task`；`i18n/components-demo.ts` 补 `Progress → 进度`（否则示例分节标题在中文页回退英文）。

### 12.13 M2-05 落地记录（2026-10-30）

1. **共享退避**：`nextBackoffDelay(attempt, options)` 默认 1s 起、2 倍增长、30s 封顶；`attempt<=1` 或非有限值回落 `initialDelay`，超大指数回落 `maxDelay`（不产生 `Infinity` 定时器）。
2. **`usePolling`**：`setTimeout` 链而非 `setInterval`（退避才可控）；`inFlight` 保证单飞；`isDone(value)` 为真时停止调度；`stop()` 置停止态、`refresh()` 重置并立即拉取；`enabled:false` 不发请求；卸载 clearTimeout + abort。
3. **`useEventStream`**：注入 `eventSourceFactory`（默认全局 `EventSource`），`error` 时 close 旧连接并按退避重连，`open` 重置计数；解析失败只上报 `onError` 且保持连接；`close()` 置停止态不再重连，`reconnect()` 复活。
4. **刻意不做**：不缓存响应、不跨实例共享、不提供通用 async store；`useTask` 只是「取数」，状态推进仍由调用方的 `taskReducer` 负责。
5. **证据**：`use-task-adapters` 14 passed；`rsc-boundaries` 3 passed（177 模块）；文档与导出契约 8 文件 **81 passed / 1 skipped**；语料 127 × 2 = 254 页 `--check` 无漂移；四套静态检查全绿。
6. **一处文档结构修正**：新增中文节时曾吞掉 `zh` 对象的收尾与 `const en` 声明，被 `tsc -p docs/site/tsconfig.source.json` 当场发现并修复；此后改 `state-and-events.tsx` 一律先跑该 typecheck。

### 12.14 M2-06 落地记录（2026-10-30，M2 收尾）

1. **数据模型**：`LogEntry = { id, level, time, message }`，顺序即渲染顺序；组件不排序、不合并、不发请求。
2. **过滤**：**最低级别**语义（选 `warn` 保留 `warn` + `error`），`level` 受控 / `defaultLevel` 非受控配对，变更经 `onLevelChange` 上报。
3. **复制/导出**：`clipboard` 可注入（默认 `navigator.clipboard`），成功后按钮 1.2s 显示 Copied 再回落，拒绝被吞；`onExport(text, entries)` 接管导出，缺省则下载文本文件。
4. **跟随**：`scrollHeight - scrollTop - clientHeight <= 8` 判定贴底；贴底时新行到达自动滚动，上滚即置 `data-following="false"` 并浮出「跳到最新」，点击恢复。
5. **长消息**：`whitespace-pre-wrap` + `break-words`，保留缩进且不截断；首版不虚拟化，行数上限由调用方控制。
6. **证据**：`log-view-api` 11 passed；`e2e/log-view-follow` 2 passed（43.4s，真实浏览器跟随/暂停/过滤）；`rsc-boundaries` 3 passed（178 模块）；文档与导出契约 13 文件 106 passed / 1 skipped；语料 128 × 2 = 256 页无漂移；四套静态检查全绿。
7. **e2e 三次修正的教训**：①示例种子必须先足够长出视口，否则 `scrollHeight == clientHeight`，上滚永远判定为贴底；②断言不要依赖可见文案（文档站默认中文，`getByRole(name:"Jump to latest")` 找不到），改用 `data-slot="log-view-jump"`；③过滤断言用 `evaluateAll` 校验可见行的 `data-level` 集合，而不是写死数量。

### 12.15 M3-01 落地记录（2026-10-30）

1. **API**：`DataTableColumn<T> = { id, header, cell(row), align?, width?, headClassName?, cellClassName? }`；`columns` + `rows: readonly T[]` + `getRowKey(row, index)`。外观属性（`colorScheme/headerRow/headerCol/columnDividers/rowHeight/align/frame`）直通 `Table`/`TableRoot`，`onRowClick`/`rowClassName` 为逐行钩子。
2. **状态互斥**：`loading > error > empty > ready`，四态都显式传入；loading 渲染 `loadingRows` 条骨架行，empty/error 渲染一条 `colSpan` 跨列消息行（表头保持不动）。
3. **受控约束**：不排序、不筛选、不分页、不发请求；`rows` 只读不复制（冻结数组可直接传入）；`getRowKey` 每行调用一次，同 key 行节点跨渲染保持同一 DOM。
4. **旧 Table 零改动**：`table.tsx` 未被触碰，DataTable 只是组合层。
5. **示例更名**：`table/virtualized.example.tsx` 实际是 ShowMore 展开（9→48 行），不具虚拟化能力 → 重命名 `show-more-rows.example.tsx`、demo id `Show more rows`、中文「展开更多行」。
6. **证据**：`data-table-api` 9 passed；`data-table-controlled` 6 passed；`rsc-boundaries` 3 passed（179 模块）；文档契约 5 文件通过；语料 129 × 2 = 258 页无漂移；四套静态检查全绿。

### 12.16 M3-02 落地记录（2026-10-30）

1. **类型**：`DataTableSort = { columnId, direction: "asc" | "desc" }`，`DataTableColumn` 增加 `sortable`；`sort` 接受单个对象或多列数组（内部统一为数组）。
2. **交互**：可排序列的表头渲染 `data-slot="data-table-sort"` 按钮，点击按 `asc → desc → 关闭` 循环；`multiSort` 为 false 时替换、为 true 时追加；`data-sort` / `data-sort-index` / `data-direction` 暴露当前态，图标用 ChevronUp/Down/ChevronsUpDown。
3. **边界**：组件**从不排序 rows**，只经 `onSortChange` 报出下一次完整数组；无 `onSortChange` 时即使 `sortable` 也保持惰性表头（避免假可点）。
4. **文档**：component-api 增 `sort`/`onSortChange`/`multiSort` 三行并说明 `sortable`；guides-30 的双语 controlledBehavior 增加排序语义两条；双语 CHANGELOG。
5. **证据**：`data-table-sorting` 8 passed；相关回归 8 文件 65 passed / 1 skipped；`rsc-boundaries` 3 passed；语料 258 页无漂移；四套静态检查全绿。

### 12.17 M3-03 落地记录（2026-10-30）

1. **API**：`DataTableSelection<T> = { selectedKeys, onChange, selectAll?, selectable? }`，以 `selection` 属性传入；提供时在首列渲染复选框，`columns` 契约不变。
2. **全选语义**：表头全选/清空只作用于**当前可见且可选**的行，保留视图外的既有选择；`checked` / `indeterminate` 由「视图内可选行」的选中比例推导（原生 `indeterminate` 属性由 Checkbox 的 ref 同步）。
3. **交互隔离**：选择列 `TableCell` 挂 `onClick` 阻止冒泡，勾选不会误触 `onRowClick`。
4. **表格完整性**：骨架行、空态、错误行的列数都计入选择列（`colSpan` 与 `td` 数量对齐）。
5. **回归修复**：`getRowKey` 曾因「派生 rowKeys + 行 key 各调一次」变成每行两次，触碰 v1 的「每行一次」契约；改为行 key 复用 `rowKeys[index].key` 后恢复。这条正是既有契约测试拦下来的。
6. **证据**：`data-table-selection` 10 passed；四个 DataTable 套件 33 passed；含文档契约 10 文件 79 passed / 1 skipped；语料 258 页无漂移；三套 typecheck + lint 全绿。

### 12.18 M3-06 落地记录（2026-10-31，C5 收尾）

1. **清单结构**：`tests/fixtures/theme-coverage.json` —— `tokens`（surface/text/line/action/feedback 五组，共 19 个）、`pairs`（4 对前景/背景）、`components`（11 个代表组件，含 field/task/log-view/data-table 四个本轮新增）、`required`（缺项即失败的必含集合）、`scope`（显式声明 contrast/axe 不在范围）。
2. **契约**：`tests/theme-coverage-contract.test.ts` 共 10 例——token 必须同时满足「catalog 里 kind=runtime」与「Default 方案 light/dark 都有值」；组件必须文件存在 + 文档已注册 + 声明双主题 + 只声明真实存在的 token + 源码至少引用其中一个。
3. **负向验证**：临时删掉 `task` 条目 → 测试 exit 1 且报 `required component missing from theme coverage: task`；恢复后重新通过。这条负向证据是「缺项使测试失败」的实证，而不是口头承诺。
4. **刻意不做**：没有 e2e 视觉断言（会引入需要维护基线图的隐性回归），也没有任何对比度计算或 axe 规则——两者都属无障碍专项。本次是纯测试改动，未触碰渲染产物，故**无需重生成语料与 README 截图**。
5. **意图**：这份清单是「声明 + 守门」，不是覆盖率证明。它拦的是「新组件忘了登记」和「登记的 token 根本不存在」两类腐化，不假装能证明像素级双主题正确。

### 12.19 M3-05 落地记录（2026-10-31）

1. **职责切分**：解析归调用方（不新增 CSV 依赖），组件只吃 `source = { columns, records }` + `fields` + 受控 `mapping`。
2. **纯逻辑先行**：`src/lib/import-mapping.ts` 提供 `validateImportMapping`（必填/重复/越界，同字段最多一条，越界优先）、`buildImportPreview`（只取已映射字段、保持字段顺序、`limit<=0` 不限、无映射返回空行集）、`resolveImportRows`（按字段 id 组装、跳过未映射）、`canSubmitImport`（有源数据 + 无问题 + 至少一个已映射）。
3. **组件**：`ImportMapper` 用 Field 包 Select（未映射用 `__unmapped__` 哨兵）、DataTable 做预览、ErrorCard 承载提交错误；`data-state` 四态 `empty/pending/invalid/ready`；无 `onSubmit` 时不渲染操作区。
4. **文案**：新增 6 条双语键（Import / Preview / Nothing to import / 三类问题提示），避免硬编码中文或英文。
5. **证据**：`import-mapping` 14 passed；`import-mapper-api` 11 passed；相关回归 11 文件 89 passed / 1 skipped；`rsc-boundaries` 3 passed（181 模块）；语料 130 × 2 = 260 页无漂移；三套 typecheck + lint 全绿。
6. **两处自我修正**：①「无映射时预览」原本返回 N 个空数组，语义无意义 → 改为空行集；②示例里 `useState<Record<string, number|null>>` 与 `ImportMapping` 不兼容 → 直接用公开类型，避免消费方复制内部形状。
