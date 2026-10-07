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
