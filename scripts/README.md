# Script concurrency / 脚本并发

Package commands acquire a per-checkout cross-process lock before running. A second
invocation waits and prints a waiting message, then executes normally with its own
arguments and exit code. Separate checkouts do not block each other.

Package 脚本在运行前获取当前 checkout 的跨进程锁；并发调用会打印等待提示，
等前一个进程完成后再执行，保留各自的参数和退出码。不同 checkout 互不阻塞。

| Lock / 锁          | Protected operations / 保护范围                                                                                                                                                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `workspace-checks` | `verify`, `build`, `build:lib`, `build:docs`, `lint`, `test`, `typecheck`, `typecheck:tests`, `tokens:generate`, `tokens:check`, `test:package`, `prepublishOnly`, `test:docs-layout`, `docs:llm:generate`, `docs:llm:check`, `docs:readme:screenshots`, `docs:readme:screenshots:check` |
| `pre-push`         | Complete pre-push gate / 完整 pre-push 检查链                                                                                                                                                                                                                                            |
| `docs-agent`       | Manual and pre-push documentation Agent runs / 手动与 pre-push 文档 Agent 执行                                                                                                                                                                                                           |

The screenshot and corpus entrypoints also lock when invoked directly. Nested
commands reuse verified lock ownership, so `build` calling `tokens:check` does not
deadlock. The documentation Agent keeps its existing environment allowlist and
acquires the workspace lock only when it runs a protected artifact command.

截图与语料入口在直接执行时也加锁。嵌套命令会验证并复用锁，避免
`build` 调用 `tokens:check` 时自锁。文档 Agent 保持原有环境白名单，
执行受保护的产物脚本时才获取工作区锁。

Locks live under the OS temporary directory in `unitary-ui-package-locks`, keyed
by the canonical checkout path and resource. Completed ownership records are
published atomically. Live owners never expire; dead owners are reclaimed only
after their registered child processes also exit. Failure and normal exit release
ownership. Unknown or corrupt metadata fails closed; inspect the reported lock
directory and stop its related processes before removing damaged metadata.

## Motion browsers / 动画跨浏览器回归

`pnpm run test:motion` checks browser-test types, builds the docs with optional
fixtures, and runs the focused Chromium, Firefox and WebKit projects against the
same artifact. Install browsers once with
`pnpm exec playwright install chromium firefox webkit`. The command participates
in the existing `workspace-checks` lock. Evidence is written to a unique
`.scratch/motion-browsers/run-*` directory, including native discovery/execution
JSON, a completeness summary, an isolated artifact with its manifest hash, and failure traces/screenshots. A retry pass is
reported as flaky and fails acceptance. Missing browsers or reports also fail.

`pnpm run test:motion` 依次检查浏览器测试类型、构建带可选夹具的文档，
并针对同一产物运行 Chromium、Firefox、WebKit 定向场景。首次使用前执行
`pnpm exec playwright install chromium firefox webkit`。命令复用 `workspace-checks`
锁；原生发现和执行 JSON、完整性摘要、失败 trace 与截图保存在独立的
`.scratch/motion-browsers/run-*` 目录。重试通过标为 flaky，不能通过验收；
浏览器缺失或报告缺失同样失败。夜间及手动 workflow 执行完整三引擎矩阵。
每轮构建会复制为独立产物并记录 manifest 指纹，后续构建不会替换正在检查的页面。

See [the bilingual device checklist](../docs/audits/fade-motion-device-checklist.md)
for manual access and physical-device evidence. 浏览器仿真与真实触屏验收分别记录，
人工入口和待验项目见[双语设备清单](../docs/audits/fade-motion-device-checklist.md)。

## LLM 语料 / LLM corpus

语料从真实文档页面的语义 HTML 生成。提取时使用 MiddleTruncate 已有的完整 `data-value`，
避免输出随字体和容器宽度变化的可见省略片段；排除 Recharts 随悬停变化的 Tooltip。
标题、图例、API 与完整演示代码仍保留。生成和只读检查使用同一提取规则，漂移仍会阻止检查通过。

The corpus is generated from the real documentation pages' semantic HTML. Extraction uses
MiddleTruncate's existing complete `data-value` instead of its font- and width-dependent visual
fragments, and excludes Recharts tooltips that change with hover. Headings, legends, APIs and full
example code remain intact. Generation and read-only checks share these rules; drift still fails
the check.

```sh
pnpm run docs:llm:generate
pnpm run docs:llm:check
```

## README 截图 / README screenshots

每次 README 捕获都从当前真实 living styleguide 源码创建新的独立临时生产构建，
再启动 preview。生成、只读检查与 pre-push 截图门禁共用这条路径，不复用旧构建。
构建或预览启动失败会停止后续捕获，推送门禁不放行；成功和失败时均清理临时产物，
不覆盖组件库发布输出。

页面仍从真实导航的 `data-styleguide-page` 元数据动态发现，每页捕获浅色与深色主题，
视口为 1440×900。页面创建及捕获前均应用减少动画偏好，让 JS 动画停止并呈现静态插画。
既有像素规则保留：最多 16 个不同像素，每个 RGB 通道差值最多 10/255，尺寸与 alpha
必须完全一致；漂移、缺失或损坏文件仍会阻止检查通过。

Every README capture creates a fresh, isolated temporary production build from the current real
living styleguide source, then starts a preview. Generation, read-only checks and the pre-push
screenshot gate share this path without reusing old builds. Build or preview-startup failures stop
capture and block the push gate. Temporary artifacts are cleaned up on success and failure without
overwriting library release output.

Pages remain dynamically discovered from the real navigation's `data-styleguide-page` metadata.
Every page has light and dark captures at 1440×900. Reduced motion is applied at page creation and
before capture, stopping JavaScript animation and showing static illustrations. Existing pixel
rules remain: at most 16 differing pixels, at most 10/255 difference per RGB channel, and exactly
matching dimensions and alpha. Drift, missing files and corrupt files still fail the check.

```sh
pnpm run docs:readme:screenshots
pnpm run docs:readme:screenshots:check
```

## Task completion / 任务收尾

```sh
pnpm run verify -- --dry-run
pnpm run verify
pnpm run verify -- --base HEAD~1
pnpm run verify -- --full
```

`verify` considers staged, unstaged and untracked files relative to HEAD; `--base` adds committed
changes since the merge-base with that ref. All current changes are included. A clean checkout
reports no pending changes; use the task's starting ref or `--full` for already-committed work.
`--dry-run` shows selected checks, skipped contracts and fallback reasons without running checks or
writing reports. Discovery may populate ordinary ignored tool caches.

`verify` 汇总相对 HEAD 的已暂存、未暂存和未跟踪改动；`--base` 还包含与指定 ref 的
merge-base 以来的已提交改动。已有改动也会纳入范围。干净工作区会报告无待验证改动；
已提交任务应指定起始 ref 或使用 `--full`。`--dry-run` 展示选择及回退原因，不执行检查、
不写报告；测试发现可能写入工具正常使用的忽略缓存。

| Input / 改动                                              | Checks / 检查                                                                                                                           |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Local component / 单组件                                  | Native related unit tests + indirect contracts, typecheck/app build, corpus/screenshot checks, affected browser specs and layout routes |
| Canonical docs / 规范文档                                 | Related and bilingual/example contracts, docs build, complete corpus check, affected browser coverage                                   |
| Test/fixture / 测试及 fixture                             | Changed tests and their import/declared-input consumers; browser changes include relevant specs                                         |
| Tooling / 工具                                            | Related tooling/security contracts, lint, typecheck/app build; verification infrastructure requires the full unit suite                 |
| Shared/unknown/deleted/renamed / 公共、未知、删除或重命名 | Complete verification, including package checks and full browser coverage                                                               |

Native Vitest association cannot observe file reads or computed imports. `verification-policy.mjs`
declares indirect inputs using exact test identities; the inventory regression test rejects new
opaque consumers without a declaration. Browser ownership also lives there; new unmapped specs
cause full browser coverage. These declarations supplement native imports rather than replacing
them. Default Playwright `spec`/`test` suffixes in JS/TS variants are recognized, and file filters
escape regex metacharacters. Changed tests hidden by temporary-file rules must be renamed before verification.
Broad probes retain every assertion. A scoped layout audit derives routes from the canonical
registry, traces foundational pages and shared shell consumers, and retains all six viewports and both themes. Foundation routes retain supplemental probes. `UNITARY_VERIFY_ROUTES` is an internal JSON
array set only for that browser step; malformed, empty or unknown route selections fail.
The layout evidence report marks missing, duplicate or unexpected combinations as incomplete;
the aggregate gate requires every selected route/viewport/theme exactly once.

Vitest 的静态关联无法识别文件读取或计算得到的导入路径。`verification-policy.mjs` 按
测试文件身份显式声明间接依赖；完整性回归会拒绝缺少声明的新测试。浏览器覆盖声明也在
该文件中，新增未映射 spec 会触发全量浏览器检查。声明补充原生导入关联，不替代它。
支持 Playwright 默认的 JS/TS 各种 `spec`/`test` 文件后缀，并对文件筛选中的正则字符转义。
被临时文件命名规则排除的改动测试必须先重命名，再进行验证。
范围较广的探针保留全部断言；布局审计从真实注册表选择路由，追踪基础页面和外壳的间接消费者，保留六种视口和明暗主题。基础页面受影响时仍执行补充探针。
采集缺失、重复或非预期的组合时，布局证据标记为不完整；汇总门槛要求每个选中路由、视口和主题恰好出现一次。

Commands keep the existing workspace lock and execute sequentially. Identical prerequisites are
deduplicated within a run; distinct app/docs/library builds remain separate. Every new invocation
reruns checks. Results are written to `.scratch/verification/<run-id>/summary.json`, with selected
files, fallback reasons, durations, exit codes and checks not run after a failure. Input contents and
HEAD are fingerprinted before/after discovery and checks; changed inputs make evidence incomplete.
The unified browser call stops after its first final failure, retaining configured retries. Its fresh
`browser.json` records outcomes and remaining cases; missing evidence cannot produce a successful
verification. Independent browser commands and CI keep their existing behavior.
No tracked documentation or screenshots are automatically generated. For drift, use the existing
generation command, review its changes, and rerun its check. Existing full CI and nightly jobs remain.

命令沿用工作区锁并顺序执行，仅在单次运行内对相同前置步骤去重；应用、文档和库构建
分别执行。每次调用都取得新证据，不跨运行缓存成功结果。报告包含耗时、退出码与失败后
未执行的检查。运行期间输入内容或 HEAD 变化会使验证不完整。
统一浏览器调用保留原有重试，在首个最终失败后停止；每次生成的 `browser.json` 记录
结果及未完成用例，缺少证据时不能通过验证。独立浏览器命令与 CI 保持原有行为。
语料和截图漂移时使用原有生成命令、审查改动并复核，不自动修改受管文件。
现有 CI 全量单测和 nightly 检查保留。

锁保存在系统临时目录的 `unitary-ui-package-locks` 下，按 checkout 的真实路径和资源区分。
完整的持锁记录通过原子操作发布；活跃进程不会因时间过长而失去锁。
只有持锁进程及已登记的子进程均结束后，才回收异常退出留下的锁。
正常退出和失败都会释放锁。未知或损坏的元数据会使检查失败；
清理前应检查报错中的锁目录，并停止相关进程。

## Glass performance audit / Glass 性能定向测量

Build the optional production fixture and measure its CSS material without a development server:

```powershell
$env:UNITARY_DOCS_TEST_FIXTURES = "1"
pnpm run build:docs -- --outDir ../.scratch/glass-performance-artifact
Remove-Item Env:UNITARY_DOCS_TEST_FIXTURES
node scripts/audit-glass-performance.mjs --artifact .scratch/glass-performance-artifact --output .scratch/glass-performance
```

The default matrix compares Clear media controls, a Regular Toolbar, a Dense Select, secondary
Tabs, Switch and Toggle with Solid, Aero and Glass. It uses four desktop theme/DPR profiles and
two mobile profiles, with three independent browser runs per condition. Optional `--profiles`,
`--usages` and `--textures` accept comma-separated subsets; `--repetitions` is a positive integer.
Mobile profiles emulate an Android touch browser; they do not establish physical-device results.

Both desktop and mobile Glass use CSS backdrop sampling. The audit rejects raster-map builds,
PNG encodes and SVG filter resources. Tabs and Switch require two independent samplers; other
fixtures require one. Nested controls share their owner's sampling. Encoding hooks detect
accidental work; they do not recreate the removed raster renderer.

Scene loading remains separate: after fonts and photo decoding, the audit waits for the exact
background photo's [LCP paint record](https://www.w3.org/TR/largest-contentful-paint/) while still
Solid. Two RAF callbacks alone cannot prove background presentation. No screenshot, fixed wait
or Glass prewarming establishes this initial boundary. Activation, first input and Portal
reopening remain separate from explicitly warmed interaction and scrolling windows of at least
five seconds. Stable windows require P95 ≤20ms and no task >50ms; idle sampling requires no
continuing application RAF. Frame intervals describe page scheduling, not GPU presentation or INP.

Each unique run retains the artifact digest, browser configuration, raw RAF timestamps, trusted
input, state/React commits, Portal events, long tasks and accidental encoding/build observations.
A failed Solid control marks its condition unstable. Failures retain their stack and elapsed time,
are never replaced by later successes, and produce exit code 1. For Dense reopening acceptance,
add `--usages dense --reopening-budget 1`; this also rejects >50ms tasks in the reopening and
selection-lifecycle phases and requires attribution events. CPU profiles from
`scripts/diagnose-select-reopening.mjs` are diagnostic overhead, not budget evidence.

默认矩阵比较 Clear 媒体控件、Regular Toolbar、Dense Select、secondary Tabs、Switch 和 Toggle
在 Solid、Aero、Glass 下的表现，包含四种桌面主题／DPR 条件和两种移动条件，每条件独立
运行三次。可用上述参数缩小诊断范围；空条件、重复条件和无效次数会被拒绝。移动条件
模拟 Android 触摸浏览器，不能作为实体设备的验收结论。

桌面和移动 Glass 均使用 CSS 背景采样。工具要求没有位移贴图构建、PNG 编码或 SVG
滤镜资源；Tabs／Switch 使用两个独立采样器，其他 fixture 使用一个，内部控件共享外层
采样。编码拦截仅用于发现意外工作，不再重建已移除的光栅渲染流程。

场景加载单独记录：字体和照片解码后，保持 Solid，等待背景照片本身的 LCP 呈现记录，
不以两个 RAF、截图、固定等待或 Glass 预热代替。材质启用、首次输入和 Portal 重开分别
计量；稳定交互及滚动在明确预热后各采集至少五秒，要求 P95≤20ms、无超过 50ms 长任务，
空闲时无持续应用 RAF。帧间隔只表示页面调度节奏，不代表 GPU 呈现时间或标准 INP。

每次独立留存产物摘要、浏览器配置、原始帧时间、真实输入、状态／React 提交、Portal 事件、
长任务和意外编码／构建记录。Solid 对照失败时标记条件不稳定；失败保留堆栈和实际耗时，
不被后续成功覆盖，并返回退出码 1。Dense 重开验收增加
`--usages dense --reopening-budget 1`，同时拒绝重开及选值生命周期内超过 50ms 的任务并检查
归因事件。`scripts/diagnose-select-reopening.mjs` 的 CPU profile 带有诊断开销，不作为预算证据。
