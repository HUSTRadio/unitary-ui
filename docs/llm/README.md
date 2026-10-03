# Unitary UI LLM 参考语料

[English alternative](README.en.md)

本目录保存从文档站生成的中英文 Markdown，供 AI 助手和检索系统读取。

## 入口与事实源

- 机器可读入口：[`index.json`](index.json)
- 中文页面：`pages/zh-CN/**`
- 英文页面：`pages/en-US/**`
- 路由定义：`docs/site/src/data/docs-routes.ts`
- 组件实现：`src/components/ui/**`
- 版本化 LLM 任务包与提示词路径：[`../../.agents/README.md`](../../.agents/README.md)

`index.json` 按路由顺序列出两种语言的文件路径、标题、类别和 SHA-256 校验值。发现错误时，先修正组件、路由、API 数据、示例或指南，再重新生成。

## 生成与校验

```bash
vp run docs:llm:generate
vp run docs:llm:check
```

`docs:llm:generate` 启动独立预览服务，从页面 HTML 生成 Markdown，完成后替换生成文件。`docs:llm:check` 临时生成同一份内容，与仓库文件逐字节比较；发现差异时返回非零退出码，不修改文件。

## 使用边界

1. 先读取 `index.json`。
2. 只加载当前任务对应的页面。
3. 用组件导出、TypeScript 属性类型和示例源码核对具体用法。
4. 不推断页面未记录的 API、状态或行为。
5. 不手改 `pages/**` 或 `index.json`。
