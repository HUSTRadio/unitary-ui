# Unitary UI

[English](./README.en.md)

To LLM Agents: see [AGENTS.md](./AGENTS.md) for llm-specified documentation.

基于 Vercel Geist 设计语言的 React 组件库，提供设计 token、基础组件、组合示例和双语文档站。

## Features

- Light / dark 双主题与完整语义 token
- 覆盖 Geist 常用组件及本地扩展
- TypeScript API、实时示例和可复制代码
- 表单、数据表格、审批流程和设置面板等组合示例
- 简体中文与英文文档

## Installation

```bash
pnpm add @hustradio/unitary-ui
```

## Quick start

```tsx
import { Button } from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles.css";

export function App() {
  return <Button>Deploy Project</Button>;
}
```

## Screenshots

<!-- STYLEGUIDE_SCREENSHOTS_START -->

| 页面     | Light                                                     | Dark                                                    |
| -------- | --------------------------------------------------------- | ------------------------------------------------------- |
| 组件总览 | ![组件总览 Light](images/styleguide/components-light.png) | ![组件总览 Dark](images/styleguide/components-dark.png) |
| 表单示例 | ![表单示例 Light](images/styleguide/form-light.png)       | ![表单示例 Dark](images/styleguide/form-dark.png)       |
| 数据表格 | ![数据表格 Light](images/styleguide/table-light.png)      | ![数据表格 Dark](images/styleguide/table-dark.png)      |
| 审批流程 | ![审批流程 Light](images/styleguide/workflow-light.png)   | ![审批流程 Dark](images/styleguide/workflow-dark.png)   |
| 设置面板 | ![设置面板 Light](images/styleguide/settings-light.png)   | ![设置面板 Dark](images/styleguide/settings-dark.png)   |

<!-- STYLEGUIDE_SCREENSHOTS_END -->

## Documentation

- 文档站：`vp dev docs/geist`
- 官方规范快照：[`docs/geist-markdown-refs`](./docs/geist-markdown-refs)
- 变更记录：[`CHANGELOG.md`](./CHANGELOG.md)

## Development

```bash
pnpm install
pnpm dev
pnpm test
pnpm typecheck
```

## Credits

设计参考与第三方资产见 [`CREDITS.md`](./CREDITS.md)。OPPO Sans 与 HarmonyOS Sans 的再分发存在许可风险，详见 [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md)。

## License

MIT © 2026 HUSTRadio。法律文本见 [`LICENSE`](./LICENSE)，中文阅读入口见 [`LICENSE.zh-CN.md`](./LICENSE.zh-CN.md)。
