# Unitary UI LLM 参考语料

[English alternative](README.en.md)

本目录为 AI agent 与检索系统提供从真实文档页面生成的稳定 Markdown 语料。简体中文是主语言，英语是替代语言。

## 入口与事实源

- 机器可读入口：[`index.json`](index.json)
- 中文页面：`pages/zh-CN/**`
- 英文页面：`pages/en-US/**`
- canonical 路由：`docs/site/src/data/docs-routes.ts`
- canonical 组件实现：`src/components/ui/**`
- 版本化 LLM 任务包与提示词路径：[`../../.agents/README.md`](../../.agents/README.md)

`index.json` 按 canonical 路由顺序列出两种语言的文件路径、标题、类别与 SHA-256。生成页不是独立事实源；若内容错误，应先修改真实组件、路由、API registry、demo 或 guide，再重新生成。

## 生成与校验

```bash
vp run docs:llm:generate
vp run docs:llm:check
```

`docs:llm:generate` 启动本次命令独占的文档 preview，从语义 HTML 生成全部页面，并原子替换产物。`docs:llm:check` 生成临时结果并逐字节比较，不写 tracked 文件；存在漂移时以非零退出。

## 使用边界

1. 先读取 `index.json`。
2. 只加载当前任务对应的页面。
3. 再核查真实 export、TypeScript props 与 demo source。
4. 不推断页面未记录的 API、状态或行为。
5. 不手改 `pages/**` 或 `index.json`。
