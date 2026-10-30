# 外部开发工作台

[Frontend VibeShell](https://github.com/LeonhardtHUST/frontend-vibeshell) 是独立的开发工具，
通过 npm 包 [`@leonhardthust/frontend-vibeshell`](https://www.npmjs.com/package/@leonhardthust/frontend-vibeshell) 接入。
Unitary UI 只保留开发依赖和启动命令；工作台源码、测试与 Agent 运行时在独立仓库维护。

需要 Node.js 22.13+，以及已安装、已登录的 CodeBuddy、Codex 或 OpenCode v2 CLI。
在两个终端中分别启动项目预览与工作台：

```sh
pnpm install
pnpm dev
# 另一个终端，仍在本仓库根目录
pnpm dev:dev-shell --backend codex
```

`dev:dev-shell` 和 `start:dev-shell` 都调用安装包的 `frontend-vibeshell` 命令，
以当前仓库为 workspace，预览 `http://127.0.0.1:5173`。
默认工作台地址为 `http://127.0.0.1:5274`；启动其他预览地址时可直接使用：

```sh
pnpm exec frontend-vibeshell --workspace . --target http://127.0.0.1:5174 --backend codex
```

旧工作台数据仍在 `.workbuddy/dev-shell/`，未随源码提取移动或删除。
先停止旧服务，在原项目目录复用数据库：

```sh
pnpm exec frontend-vibeshell --workspace . --data-dir .workbuddy/dev-shell --target http://127.0.0.1:5173
```

工作目录必须与数据库原设置匹配；不同项目使用不同数据目录。
默认的新数据目录按 workspace 隔离，浏览器凭据按 workbenchId 分别保存。
`dev-shell` 命令别名、`DEV_SHELL_*` 环境变量、MCP 标识和旧 token 保持兼容。
后端认证和真实 MCP 检查的已知限制、权限、备份与代理兼容性以独立仓库 README 为准。
