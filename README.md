# Unitary UI

[English version → README.en.md](./README.en.md)

基于 shadcn/ui 的可复用 **Vercel Geist 样式框架**——样式 token 体系 + 基础组件 + 官方规范快照，供消费方项目直接复用。npm 包名 `@hustradio/unitary-ui`，MIT 许可。

## Features

- **Geist token 体系**：双主题（light/dark）语义 token + 全色阶 + 排版工具类 + 材质，全部对齐官方实测值（`src/styles/index.css`）
- **基础组件**：`src/components/ui/` 覆盖官方 Geist 组件集与本地扩展，路由、侧栏、文档 registry 统一生成，零业务依赖
- **规范快照**：`docs/geist-markdown-refs/` 冻结的 Vercel Geist 官方文档快照（foundations + 组件 + 渲染参数实测）
- **Living styleguide**：`src/App.tsx` + 组合示例（表单 / 数据表格 / 审批流 / 设置面板）
- **文档站**：`docs/geist/` 复刻官方文档站结构，中英双语、双主题，含每组件 API 表、实时 demo 与 Show Code
- **LLM 参考语料**：`docs/llm/` 为每条文档路由生成简体中文（主）与英语（替代）的 Markdown 语料 + 机器可读索引

## Installation

```bash
pnpm add @hustradio/unitary-ui
```

或作为样式基础层消费：复制 `src/styles/`、`src/components/ui/`、`src/lib/` 到你的项目。

依赖：react / react-dom / radix-ui / lucide-react / class-variance-authority / clsx / tailwind-merge / tw-animate-css / date-fns / @date-fns/tz / @fontsource/maple-mono / tailwindcss（`@tailwindcss/vite`）。

## Quick start

```tsx
import { Button } from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles";

export function App() {
  return <Button onClick={() => console.log("deploy")}>Deploy Project</Button>;
}
```

样式入口（直接消费源码时）：

```ts
import "@/styles/index.css";
```

## Documentation

- 人类文档站：`vp dev docs/geist`（Introduction / Colors / Typography / Materials / Components，支持中英文与 light/dark 切换）
- 组件文档合同测试：`tests/component-doc-completeness.test.ts`、`tests/docs-i18n-parity.test.ts`
- 官方规范快照：`docs/geist-markdown-refs/`
- 已知问题清单：`docs/geist-docs-findings.md`

### Screenshots

| | Light | Dark |
| --- | --- | --- |
| 组件总览 | ![组件总览](images/components-light.png) | — |
| JSON 查看器 | ![JSON 查看器 Light](images/json-view-light.png) | ![JSON 查看器 Dark](images/json-view-dark.png) |
| 表单示例 | ![表单示例](images/form-example.png) | ![表单示例 Dark](images/form-dark.png) |
| 数据表格 | ![数据表格](images/data-table.png) | ![数据表格 Dark](images/data-table-dark.png) |
| 审批流程 | ![审批流程](images/workflow.png) | — |
| 设置面板 | ![设置面板](images/settings.png) | — |

## LLM / AI agent usage

以下指令文本在两个语言版本中保持英文不变，以免执行语义分叉：

1. Read `AGENTS.md` first.
2. Query `docs/llm/index.json` for the relevant route.
3. Load only the matching Markdown pages.
4. Verify component exports and TypeScript props in source.
5. Never invent undocumented APIs.
6. Run the documented checks before proposing a change.

## Development

```bash
pnpm install
pnpm dev                 # living styleguide
vp dev docs/geist        # docs site
pnpm test                # contract + unit tests
pnpm typecheck
vp run docs:llm:generate # regenerate LLM corpus after docs changes
vp run docs:llm:check    # drift check (exit 0 = no drift)
```

贡献须知：提交前跑 `pnpm test` 与 `pnpm typecheck`；文档改动后必须重新生成 LLM 语料并保持双语对齐。禁止 `git add -A`，精确暂存。

## Contributing

1. 先读 `AGENTS.md` 的 task-to-source map，定位正确的源文件
2. 组件改动必须同步更新：组件源码、registry 条目、API 行、demo、中文描述、双语 guide
3. 文档改动后运行 `vp run docs:llm:generate` 与合同测试
4. 提交信息用清晰的动词短语；不使用 --no-verify 绕过 hook

## Security

发现安全漏洞请通过仓库私有渠道报告，不要在公开 issue 中披露。本仓库不收集遥测数据；文档站的剪贴板权限仅用于复制代码片段。

## Credits

设计参考与第三方资产清单见 [`CREDITS.md`](./CREDITS.md)（简体中文）/ [`CREDITS.en.md`](./CREDITS.en.md)（English）。第三方代码与字体的完整许可声明见 [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md) / [`THIRD_PARTY_NOTICES.en.md`](./THIRD_PARTY_NOTICES.en.md)。

## License

MIT © 2026 HUSTRadio。简体中文阅读入口：[`LICENSE.zh-CN.md`](./LICENSE.zh-CN.md)（非官方、非约束性译文）；法律权威文本为英文 [`LICENSE`](./LICENSE)。

第三方字体与代码不适用本许可证，其许可状态见上述 notices 文件。
