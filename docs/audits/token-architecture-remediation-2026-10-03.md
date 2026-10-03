# Token 架构整改记录 / Token architecture remediation

日期：2026-10-03。对应[架构审计](token-architecture-audit-2026-10-03.md)的 T1–T7；原报告保留基线快照，本记录描述落实结果。

修复目标是让公开配置兑现其职责，减少同一决策的独立维护来源，并明确兼容与预留能力。没有按 token 数量或相同数值机械删除条目。

The changes align writable configuration with real consumers, share build-time decisions, and distinguish compatibility names from reserved capabilities. Equal values alone do not justify merging public tokens.

## 分阶段落实 / Implementation stages

| 阶段 | 提交 | 结果 |
| --- | --- | --- |
| 1：运行时契约 / Runtime contracts | `87b5451` | 七个断点保留在目录中，但排除于可写类型、写入和恢复 API；局部动画预览直接消费所编辑的 fast 时长。 |
| 2：消费与生命周期 / Consumers and lifecycle | `9e6b799` | 普通 Menu / ContextMenu 接入菜单行高；保留 Menu 触控最小高度；从 CSS 注释生成 lifecycle 与替代名称，修正 Drawer 分组。 |
| 3：构建与验证 / Build and verification | 本记录所在提交 / This commit | Grid 视口查询从既有 token 构建展开；保留独立容器条件与历史工具类；替换无样式圆角断言，覆盖实际发布 CSS。 |

## 逐项结论 / Findings resolved

| 项目 | 落实与验收 / Resolution and evidence |
| --- | --- |
| T1：断点配置阶段 | `--breakpoint-*` 始终为 mapping，类型和 API 拒绝运行时写入/恢复。静态发射变量不代表媒体条件可变。浏览器在 959/960/961px 检查已生成条件及写入无效的边界。 / Breakpoints remain discoverable build mappings and are rejected by writable APIs. |
| T2：局部时长演示 | 预览按钮显式消费 `--uni-duration-fast`；局部 500ms 只改变预览，全局设置改变两处，恢复回到 150ms。 / Scoped and global duration changes are verified on actual buttons. |
| T3：菜单行高 | 普通菜单项消费 `--uni-popover-row-height`，默认仍为 36px；Menu 触控最小高度仍为 44px，QuickActions 保持自己的尺寸契约。键盘 Home/End/Escape 与焦点恢复有浏览器覆盖。 / Row height is effective without changing touch targets or keyboard behavior. |
| T4：同义与过时名称 | 四个 deprecated 条目记录替代入口，六个 reserved 条目说明未接入的能力；保留现有名称和数值。 / Deprecated names and reserved capabilities are explicit and remain compatible. |
| T5：Grid 断点语义 | 前四个 grid token 表示视口档位上界，CSS module 在构建时读取；Grid 的 lg 从 960px 以上开始，历史 `grid-lg:` 仍为 1280px。容器查询保留 400/401、600/601、768/769、960/961px 边界。 / Component tiers, utility thresholds and pixel container queries retain their separate contracts. |
| T6：无效测试证据 | 测试真实编译 canonical CSS，断言工具类具体输出；修改构建 token 后验证对应查询随之变化；发布 CSS 在 Chromium 两主题下验证计算圆角和 Grid 实际列数。 / Real compilation and browser computed styles replace assertions that passed without CSS. |
| T7：分组与归属 | Drawer 宽度归入 layout；生命周期与 runtime/mapping 分开。六个已有 docs 节奏变量保留公共契约，新增站点外壳几何与媒体条件由站点 CSS 管理。 / Grouping and ownership are clarified without duplicating token values into another source. |

## 目录与兼容性 / Catalog and compatibility

当前仍为 **505** 个条目：**408 runtime / 97 mapping**，其中 **495 active / 6 reserved / 4 deprecated**。`active` 表示受支持，不保证每个组件消费该值；`reserved` 与 `deprecated` 也不决定它是运行时变量还是构建映射。

| Deprecated | 推荐入口 / Preferred entry |
| --- | --- |
| `--radius-circle` | `--radius-circular` |
| `--radius-pill` | `--radius-capsule` |
| `--invert-background` | `--background-100` |
| `--invert-foreground` | `--foreground` |

Tooltip 的默认配色已经使用推荐语义色；旧反转色的替换不是自动颜色等价转换。两个形状别名保留相同几何。四个名称均不在本次删除，也未设定未经发布策略确认的移除日期。

Reserved 包括 `--radius-concentric-inset`、`--radius-continuous`、两项 mixed-script gap 以及 compact/reading leading。`ContinuousSurface` 的曲线和降级半径仍由 `radius` prop 控制；不能将 reserved 普通圆角工具类当作组件曲线控制入口。

The catalog has 505 entries: 408 runtime variables and 97 build mappings; 495 active, 6 reserved and 4 deprecated. Lifecycle is independent of configuration stage. Compatibility names retain their values, and no removal date is invented. Tooltip replacements identify current semantic consumers rather than equivalent color values.

基础色阶及其工具类映射、不同交互职责的时长、循环周期、有限动画胶囊半径、字体测量与校准继续保留。它们有独立变化职责或当前消费依据。后续新增 token 应明确职责、消费者或保留理由、作用范围、配置阶段与可观察验证；不为使预留项“被使用”而批量迁移组件。

The existing palette mappings, interaction roles, loop periods, finite animated capsule radius, and font calibration remain supported because their responsibilities differ. Future additions should identify a consumer or reservation reason, scope, configuration stage, and observable verification.

## 验收证据 / Verification

以下命令均新执行，退出码为 0。/ These commands were run afresh and exited with code 0.

- `pnpm exec vitest run tests/continuous-surface-tokens.test.tsx tests/grid-api.test.tsx tests/docs-i18n-parity.test.ts`：3 文件、28 测试通过，含修改构建断点后的真实编译验证。 / 28 focused tests include rebuilding changed tier bounds.
- `pnpm run test`：255 文件、1678 测试通过。 / Full suite: 255 files, 1678 tests passed.
- `pnpm run typecheck`、`pnpm run typecheck:tests`：目录、应用及测试类型检查通过。 / Catalog, application and test type checks passed.
- `pnpm run build`：canonical token 检查、TypeScript 和主应用构建通过。 / Token validation, TypeScript and application build passed.
- `pnpm run test:package`：6 项通过，覆盖原生 ESM/CJS、SSR、公开目录、真实发布 CSS 圆角及 Grid 两主题边界。 / Six native-import, SSR and published-CSS tests passed.
- `pnpm pack`：实际归档核对 9 个必要的许可证、声明及入口文件、16 个字体文件，共 170 个条目。 / The package archive contains the required licenses, notices, entry points and 16 fonts across 170 entries.
- `pnpm exec playwright test tests/e2e/docs-layout-tokens.spec.ts tests/e2e/global-tokens.spec.ts tests/e2e/menu-token-contract.spec.ts tests/e2e/continuous-surface-review.spec.ts`：25 项通过，覆盖两主题的 token 消费、布局和菜单，以及连续曲线的降级与绘制。 / All 25 browser checks passed.
- `pnpm exec vite build docs`：文档站生产构建通过。 / Documentation production build passed.
- `pnpm run docs:llm:generate`、`pnpm run docs:llm:check`：114 路由 × 2 语言，共 228 页重新生成后无漂移。 / All 228 bilingual pages regenerate deterministically.
- `pnpm run docs:readme:screenshots`、`pnpm run docs:readme:screenshots:check`：7 页 × 2 主题，共 14 张截图通过检查；默认视觉没有产生截图差异。 / All 14 screenshots passed without changes to default visuals.

构建日志、归档和检查截图保存在忽略目录；不作为提交产物。/ Scratch logs, archives and review screenshots are excluded from commits.
