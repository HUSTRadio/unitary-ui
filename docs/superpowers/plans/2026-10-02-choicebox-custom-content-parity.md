# Choicebox 自定义内容与并行交接收尾

> 更新：2026-10-02；状态：执行中。当前用户授权：核对现状、更新计划、执行并自动提交；同时处理可自动验证的 HIG 实现问题。未授权推送。

## 1. 当前基线与结论

核对起点为 `master` / `74ce033`，工作区有 9 个已修改文件及本计划。原计划不是最新状态：缺少必需构建与持久浏览器回归，HIG 已提交但仍被列为待提交，Input 注释与实现不一致。

- Choicebox 组件行为正确：自定义 children 仅在选中项中渲染。保留实现与 `.choicebox-content` DOM 钩子；不因无 CSS 定义删除现有契约。
- 既有 Choicebox 5 文件改动：双语 guide 明确选中前提；Trial 徽章恢复 `trial`；语料与索引已生成，但需本轮重新验证。
- 既有 Input 4 文件改动：装饰段只圆外侧角，契约测试及双语 CHANGELOG；本轮独立验证、独立提交。
- HIG 第四轮三份台账与 destructive token 断言已提交于 `74ce033`，不重复提交。历史全量测试失败不可当作本轮通过证据。

## 2. 执行清单

- [x] 核对 branch、diff、实现、文档、测试及交接书；更新本计划。
- [ ] Choicebox：保留组件契约；为实时 demo 增加可选说明位，复用同一份双语 guide 文案；持久化双语言、双主题切换与 Trial 渐变回归。
- [ ] Input：订正文档注释；验证 styled/plain 双主题几何；独立提交原有修复。
- [ ] HIG harness：排除 `_tmp-*`、`*.tmp.*` 和隐藏探针，补自动发现回归；保留他人忽略文件，不删除也不提交。
- [ ] HIG ActivityView：实测卡片与 sheet；选择可用的局部预览高度，保留长列表、分档与操作可达性要求；不得把 97px 不可用体验固化为契约。
- [ ] HIG App Shell：实测滚动 owner 与 main 边界，修复真实原因；aggregate 结果不得被 retry 的空进程状态掩盖。
- [ ] 验证：聚焦测试、类型检查、构建、双语语料生成与确定性检查、README 截图生成与检查、受影响浏览器用例（禁用重试）。
- [ ] 分批显式 stage、复核 staged diff、签名提交；更新此计划中的提交与验证证据。

## 3. 本轮证据

| 检查 | 结果 |
| --- | --- |
| 初始聚焦回归：choicebox-api、docs-showcode、input-surface、input-api、search-input-api、changelog-contract | exit 0，6 files / 47 tests |
| 聚焦回归（增加双语结构、guide sections、临时文件发现） | exit 0，9 files / 52 tests |
| 浏览器 Choicebox / Input / ActivityView | exit 0，10 passed，双主题且 retries=0 |
| App Shell 与合成裁剪边界回归 | exit 0，3 passed；双主题 × 6 宽度 × 顶部/底部；真实越界反例仍失败 |
| 原始 docs-layout 全部静态路由矩阵 | exit 0，6 chunks / 240 组合 / 0 failures，2.7m；retries=0 |
| pnpm run build / typecheck | 均 exit 0 |
| pnpm run lint | exit 0；现有 warning，无新增错误 |
| docs:llm:generate | generate/check 均 exit 0，110 路由 × 2 语言，确定性无漂移 |
| docs:readme:screenshots / docs:readme:screenshots:check | 均 exit 0，5 页 × 2 主题；仅 components 双主题图变化，随 Input 提交 |
| pnpm run test --maxWorkers=4 | exit 1，8 failed / 241 passed files，32 failed / 1601 passed tests；31 项为 7 个 tests/audit 文件的 python/Pillow 环境基线；另 1 项 section-without-code 是旧正则把 JSX 箭头误判为标签结束，已改为 TSX AST 检查并增加反例，4 files / 11 tests 复验 exit 0，日志 .scratch/handoff-vitest-full.log |
| pnpm run typecheck:tests | exit 2；未改动的 run-showcode-audit.mts:5 仍导入已移除的 demo-code；llm-task-runner.test.ts:227 隐式 any。git diff HEAD 对两文件为零差异 |

## 4. 提交边界

1. Input：`src/components/ui/input.tsx`、`tests/input-surface.test.tsx`、Input 浏览器回归、CHANGELOG 的 Input 条目，以及相关 README 截图差异。
2. Choicebox：guide/schema、docs 页面说明渲染、示例、双语契约与浏览器回归、生成语料及本计划。
3. HIG：Playwright 配置与发现回归、ActivityView 预览与回归、布局审计修正、三份台账增量；与上述共享的文档页面文件按最终可审阅边界提交，禁止夹带未完成工作。
4. 收尾：本计划的最终验证和提交记录。保持仓库签名约定；不推送。

## 5. 外部验收与独立后续

以下不属于可自动结案项，保留在 HIG 台账中：030 的 NVDA/VoiceOver 真机播报；028 经典滚动条平台验收；036 EditMenu 横/竖向产品决策；025 未覆盖浮层状态。Choicebox custom-content 官方像素矩阵与 Input affix role 的扩展仍为可选审计增强，不以本地浏览器回归冒充官方像素对照。

## 6. 环境与历史证据

- 既有历史日志位于 `.scratch/hig-audit-2026-09-18/cmdlogs/`；此前全量 Vitest 的 Pillow 缺失及 Playwright ActivityView / App Shell 失败须与本轮区分。
- `NODE_OPTIONS` 注入的 safe-delete shim 曾妨碍生成器；本轮生成命令仅对子进程清空该变量。pnpm 在受限执行环境不可找到 vitest，已通过工具审批运行项目测试。
- 文档根目录为 `docs/`，应用源码为 `docs/site/`，文档路由是 hash 路由。运行命令以 package.json 为准。
- 用例保存在正式 spec，临时探针仅保存在忽略目录；Playwright 发现不遵循 .gitignore，配置须独立排除。
- 上一版本的完整历史说明可从本次交接前的会话记录查阅；权威审计历史仍在 `docs/audits/hig-*.md`。

## 7. 本轮根因与提交记录

- `416abb7`：Input 单独提交（实现、注释、契约、双主题浏览器回归、双语 CHANGELOG、README 截图）。
- ActivityView 实测卡片 clientHeight=162、sheet clientHeight=96、内容可见高度=78、scrollHeight=572。采用足够高的局部预览（min(844px,100dvh)），保留卡片 Portal；回归仍要求预览高度至少 800px（844px 视口）、展开增加超过 200px、完整长列表及操作可达。
- App Shell 不是首帧竞态：390px 视口下表格完整 bottom=2090.375，祖先滚动容器 bottom=968.5625，main bottom=1253.5625。表格已被祖先裁剪；原审计忽略裁剪。现测量祖先逐轴裁剪后的可见边界，并以未裁剪越界反例防止放宽门禁。
- 审计采集用例自身使用 soft assertion，并关闭 evidence lifecycle 的重试；不能再通过新进程空的 ALL_FAILURES 把失败变成 flaky pass。
- `791054c`：Choicebox 文案、live demo 说明、Trial 徽章、双语语料及浏览器回归已提交。三份 HIG 台账同步与其余提交待完成。真机验收仍按 §5 保留。
### 最终复验补记

- `pnpm run test --maxWorkers=4` 第二次：exit 1，7 failed / 242 passed files，31 failed / 1603 passed tests；全部失败均为 Python/Pillow 审计环境基线，新增 TSX 检查通过。日志 `.scratch/handoff-vitest-final.log`。
- ActivityView 收尾发现固定高度卡片会裁剪 Show Code；现将固定高度的 SubFrame 仅包住预览，代码区放在它之后。新增双主题断言：展开代码不改变 frame 高度，代码末端在卡片边界内。最终构建、专项与语料检查正在复验。