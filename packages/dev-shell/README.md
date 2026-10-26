# Unitary Dev Shell

本机交互式开发工作台。真实网页在独立 origin 的 iframe 中运行，Shell 通过本地 MCP 与 CodeBuddy、Codex、OpenCode v2 协作。三个 workspace 均为私有包，不随组件库发布。

## 启动

需要 Node 22.13+（建议 Node 24）、仓库指定的 pnpm，以及至少一个已安装并登录的后端 CLI。

```sh
pnpm install --frozen-lockfile
pnpm run dev:dev-shell
```

打开 `http://127.0.0.1:5273`，首次填写显示名称创建本机工作台。浏览器保存访问令牌；换浏览器时使用已有令牌登录，也可以由已登录的 human 访问者创建新凭据。不要分享浏览器存储或运行数据目录。

构建后可由单个本机服务托管：

```sh
pnpm run build:dev-shell
pnpm run start:dev-shell
```

此时地址为 `http://127.0.0.1:5274`。所有监听限 loopback，端口占用时启动失败。开发模式前端使用 5273，后端使用 5274。

## 后端与设置

在设置 Modal 中选择 CodeBuddy、Codex 或 OpenCode v2，分别填写 executable；默认命令为 `codebuddy`、`codex`、`opencode`。OpenCode 必须是 v2。模型留空使用该后端默认值；切换后端会清空未保存的模型选择。

后端在创建会话时固定，随后修改设置不会改变该会话。输出保留脱敏后的原始事件，并展示实际后端和原生会话 ID；每次发送开启新会话，首版没有隐式 resume。

| 设置中的权限模式 | CodeBuddy | Codex | OpenCode v2 |
| --- | --- | --- | --- |
| default | CLI default | read-only，拒绝提权请求 | 允许读取，编辑拒绝，交互权限请求在 headless 中拒绝 |
| plan | CLI plan | read-only，拒绝提权请求 | plan agent，只读 |
| acceptEdits | CLI acceptEdits | workspace-write，拒绝提权请求 | 允许工作区编辑，外部目录拒绝；shell 权限请求仍拒绝 |

工作台不提供危险的 sandbox/permission bypass。CLI 的认证、模型配额和网络需要在本机独立可用；失败会保存为会话错误，不丢弃队列。三种后端各自使用会话级配置或进程环境，不改写用户全局配置，也不把 prompt/token 放入命令行。

目标 URL 的精确 origin 必须登记在设置中。例如预览 `http://127.0.0.1:5173/example`，登记 `http://127.0.0.1:5173`。该登记仅授权预览代理，不授予目标网页访问 Shell API 的权限。地址切换和刷新会回收旧代理。

## 交互

- 宽度至少 1024px：左侧控制栏，右侧网页；按住 Ctrl 点击网页元素选择上下文。
- 窄屏：网页沉浸显示，拖动浮球调整位置，点按打开控制面板；支持显式 picker 和长按选择。设置始终为 Modal。
- Enter 新建会话，Ctrl+Enter 入共享队列，Shift+Enter 换行；中文输入法确认候选不会发送。
- 批量新建会话将选中的队列项合成一个 prompt，只启动一个会话；“复制自行 steer”复制完全相同的 bundle。读取、复制和标为已读均不会消费队列。
- 会话可查看输出或取消；失败/取消的队列项需由 owner 显式重新入队。
- 访问者可创建多个待办列表、广播或私信，并通过 advisory 资源租约查看持有者、等待者与更新。租约用于协调，不强制锁定文件。

## 外部 Agent 接入 MCP

在“会话”页创建访问者，保存一次性展示的 token。MCP endpoint 为 `http://127.0.0.1:5274/mcp`，使用 `Authorization: Bearer <token>`，令牌不放 URL。不同 agent 使用不同 visitor/token。读取队列不出队；agent 无权启动其它 CLI 或签发凭据。

访问者吊销、会话终结与服务关闭会回收相关凭据和连接。Direct message 正文只对 sender/recipients 可见；公共活动日志不含私信正文。

## 数据与兼容范围

默认数据在仓库根 `.workbuddy/dev-shell/`，包括 SQLite 和短期 MCP 配置；测试与只读 smoke 使用 `.scratch/`。两者均忽略，不应提交。数据目录可以用 `DEV_SHELL_DATA_DIR` 指定；工作目录、目标 URL 和监听端口可分别用 `DEV_SHELL_WORKSPACE`、`DEV_SHELL_TARGET`、`DEV_SHELL_PORT` 设置。

代理为每个 frame 使用独立的服务端 CookieJar，浏览器 Cookie/Authorization 不转发给目标。不导入原站登录状态；依赖 `document.cookie` 的登录、Service Worker、COOP/COEP、frame-busting 和跨源嵌套 iframe 可能降级。picker 保证 DOM 元素信息，React 源码位置仅在实际 metadata 可用时返回。不可代理时可打开原页。

## 验证

```sh
pnpm run typecheck:dev-shell
pnpm run test:dev-shell
pnpm run build:dev-shell
pnpm run test:dev-shell:e2e
```

自动化使用临时 DB、真实 HTTP/WS/MCP/iframe 和 fake CLI，不需要真实模型凭据。受控的真实只读检查另行执行：

```sh
pnpm --filter @hustradio/dev-shell-server smoke:agents
```

该命令为三个后端分别创建独立临时目录，只调用 `visitor_me` 并要求回复标记，输出脱敏结果，失败返回非零。它会使用本机已登录的模型服务及少量额度。真实连接失败不能用 fake 测试结果替代。
