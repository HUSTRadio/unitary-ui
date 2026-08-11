# Geist 组件复刻验收报告

> 状态：**历史结论已撤销，系统性复审中**
>
> 复审依据：官方实时页面证据门禁，见 `.hermes/plans/2026-08-11_141304-geist-systemic-parity-and-responsive-remediation.md`
>
> 范围：72 个官方组件；`Step Point` 是本框架纯本地扩展，不计入官方复刻数量

## 结论（已撤销）

本报告 2026-08-09 版本关于“72 个官方组件已完成实现、文档接线、双主题、四视口、视觉与适用交互验收”的全量完成结论**已撤销**，包括验收矩阵中的全部完成率与通过率数字。

撤销原因：`tests/audit/geist-audit-manifest.json` 与 `tests/audit/geist-audit-ledger.json` 仅处于骨架/空台账状态（`SKELETON_NOT_ACCEPTANCE_EVIDENCE` / `EMPTY_SKELETON_NO_PASS_CLAIMS`），无法为上述结论提供逐组件、逐 demo、逐状态、逐视口的可追溯证据；现有运行时与截图脚本也只证明页面可打开、Live Demo 非空，不证明与官方实现一致。

当前状态：**系统性复审中（`IN_PROGRESS_NO_COMPLETION_CLAIM`）**。在 manifest 升级为真实能力与响应式矩阵、证据采集器与比较器产出完整审计台账之前，本报告不再发布任何完成率或通过率结论。`tests/audit/validate-audit-ledger.test.ts` 已增加发布门禁：报告出现完成声明 ⟺ manifest/ledger 处于完整验收证据状态，二者必须同真同假。

## 验收矩阵（历史记录，全部已撤销）

原矩阵声称的覆盖与结果（72 个官方 slug 覆盖、双主题 × 四视口运行时健康检查、视觉截图矩阵、可信输入交互等）**不再作为验收结论**，各项一律视为待复审：

| Gate                                     | 覆盖               | 状态     |
| ---------------------------------------- | ------------------ | -------- |
| 官方快照 → metadata → Live Demo 覆盖     | 72 个官方 slug     | 已撤销   |
| 文档运行时健康检查                       | 72 路由 × 2 主题 × 4 视口 | 已撤销   |
| 视觉截图矩阵                             | 72 组件 × 2 主题 × 4 视口 | 已撤销   |
| 可信输入交互                             | 键盘、鼠标、Esc、焦点返还、Portal、ARIA、状态转换 | 已撤销   |
| TypeScript                               | 根应用 + `docs/geist` | 通过（与一致性无关） |
| oxlint                                   | `src/`、`docs/geist/src/`、`tests/` | 通过（与一致性无关） |
| Vitest                                   | registry、迁移零残留、`cn()`、Menu | 通过（与一致性无关） |
| 生产构建                                 | 根应用 + `docs/geist` | 通过（与一致性无关） |

四视口固定为 375、768、1440、1920px；以下为历史方法说明，不代表当前验收结论：运行时健康检查验证目标路由标题、非空 Live Demo、主题应用和根级横向溢出；视觉矩阵按每个 Live Demo 的完整 `getBoundingClientRect()` 裁剪。这些检查将在复审中按官方实时证据门禁重新设计。

## 交互覆盖（历史记录，待复审）

适用组件覆盖以下行为（原记录，未经实时证据门禁核验）：

- 原生与 Radix 选择控件：Checkbox、Choicebox、Radio、Select、Switch、Toggle、Multi Select；
- 键盘导航：Calendar、Menu、Tabs、Slider；
- 弹层与 Portal：Combobox、Command Menu、Context Menu、Dots Menu、Modal、Drawer、Sheet、Destructive Action Modal、Split Button；
- Escape 关闭与焦点返还；
- 类型确认门、Toast 打开/关闭、Tooltip hover、Show More 展开、Clearable/Search Input 清除、JsonView/Collapse 状态切换、Load More busy 状态、Theme Switcher 主题同步。

以上交互行为清单将在复审中逐一对照官方实时页面重验，不再沿用。

## 破坏性 API 迁移（事实记录，保留）

以下旧 API 已删除，不提供 alias、wrapper、re-export、旧路由或双轨实现（该清单为已执行的迁移事实，不构成组件一致性验收结论）：

- `DropdownMenu` → `Menu`；
- `SegmentedControl` → 语义对应的 `Switch` 或 `Select`；
- `ThemeSwitch` → `ThemeSwitcher`；
- Radix compound `Select` 调用 → 官方原生 `<Select><option /></Select>`；
- 旧 `MultiSelect/MultiSelectItem` → 官方受控 `MultiSelectRoot/MultiSelectRow`；
- Banner、Breadcrumbs、Browser、Avatar、Book、Empty State、Pagination、Tabs、Toast、Tooltip、Video 的旧 compound exports → 各组件官方单一契约；
- Copy Button、Gauge、Grid、Label、Middle Truncate、Note、Snippet、Status Dot、Text With Copy Button 的旧 prop alias → 官方 prop 名称。

`tests/docs-coverage.test.ts` 会递归扫描 tracked 与 untracked 源文件，阻止旧 API 回流。

## 已修正的快照事实（事实记录，保留）

`components/toggle.md` 原记录 medium/large checked 位移为 18px。2026-08-09 从官方实时页面实际加载的 bundle 复核到：

- small：`translate-x-[14px]`；
- medium：`translate-x-[16px]`；
- large：`translate-x-[16px]`。

本地实现原 16px 值正确，已修正文档而非错误修改组件。

## 可复现命令

```bash
vp test
node_modules/.bin/tsc -b --noEmit --force
node_modules/.bin/tsc -p docs/geist/tsconfig.json --noEmit
node_modules/.bin/oxlint src/ docs/geist/src/ tests/
vp build
node node_modules/vite/bin/vite.js build docs/geist --config docs/geist/vite.config.ts
DOCS_URL=http://localhost:5201 node tests/runtime-docs-audit.mjs
DOCS_URL=http://localhost:5201 node tests/runtime-interaction-audit.mjs
DOCS_URL=http://localhost:5201 node tests/capture-visual-matrix.mjs
```

视觉矩阵默认写入 `C:/Users/Leon/geist-acceptance/final-shots`，不进入 Git。
