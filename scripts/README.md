# Script concurrency / 脚本并发

Package commands acquire a per-checkout cross-process lock before running. A second
invocation waits and prints a waiting message, then executes normally with its own
arguments and exit code. Separate checkouts do not block each other.

Package 脚本在运行前获取当前 checkout 的跨进程锁；并发调用会打印等待提示，
等前一个进程完成后再执行，保留各自的参数和退出码。不同 checkout 互不阻塞。

| Lock / 锁 | Protected operations / 保护范围 |
| --- | --- |
| `workspace-checks` | `build`, `build:lib`, `lint`, `test`, `typecheck`, `typecheck:tests`, `tokens:generate`, `tokens:check`, `test:package`, `prepublishOnly`, `test:docs-layout`, `docs:llm:generate`, `docs:llm:check`, `docs:readme:screenshots`, `docs:readme:screenshots:check` |
| `pre-push` | Complete pre-push gate / 完整 pre-push 检查链 |
| `docs-agent` | Manual and pre-push documentation Agent runs / 手动与 pre-push 文档 Agent 执行 |

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

锁保存在系统临时目录的 `unitary-ui-package-locks` 下，按 checkout 的真实路径和资源区分。
完整的持锁记录通过原子操作发布；活跃进程不会因时间过长而失去锁。
只有持锁进程及已登记的子进程均结束后，才回收异常退出留下的锁。
正常退出和失败都会释放锁。未知或损坏的元数据会使检查失败；
清理前应检查报错中的锁目录，并停止相关进程。
