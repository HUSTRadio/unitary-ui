# Unitary UI

[English](./README.en.md)

To LLM Agents: see [AGENTS.md](./AGENTS.md) for llm-specified documentation.

基于 Vercel Geist 设计语言的 React 组件库，提供设计变量（token）、基础组件、组合示例和中英文文档。

## 功能

- 浅色、深色主题与按用途命名的设计变量
- 覆盖 Geist 常用组件及本地扩展
- TypeScript API、实时示例和可复制代码
- Motion.dev 交互动效与可控制的 Hitu SVG 插画
- 表单、数据表格、审批流程和设置面板等组合示例
- 简体中文与英文文档

## 安装

```bash
pnpm add @hustradio/unitary-ui
```

## 快速开始

```tsx
import { Button } from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles.css";

export function App() {
  return <Button>Deploy Project</Button>;
}
```

Node 可直接用 ESM `import` 或 CommonJS `require` 导入组件，无需 CSS 加载器。浏览器应用需另行导入 `@hustradio/unitary-ui/styles.css`，其中包含 Device 外框样式；Node 服务端不应导入 CSS。

## 示例截图

<!-- STYLEGUIDE_SCREENSHOTS_START -->

| 页面       | Light                                                        | Dark                                                       |
| ---------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| 分页与媒体 | ![分页与媒体 Light](images/styleguide/paged-media-light.png) | ![分页与媒体 Dark](images/styleguide/paged-media-dark.png) |
| 组件总览   | ![组件总览 Light](images/styleguide/components-light.png)    | ![组件总览 Dark](images/styleguide/components-dark.png)    |
| 表单示例   | ![表单示例 Light](images/styleguide/form-light.png)          | ![表单示例 Dark](images/styleguide/form-dark.png)          |
| 数据表格   | ![数据表格 Light](images/styleguide/table-light.png)         | ![数据表格 Dark](images/styleguide/table-dark.png)         |
| 审批流程   | ![审批流程 Light](images/styleguide/workflow-light.png)      | ![审批流程 Dark](images/styleguide/workflow-dark.png)      |
| 设置面板   | ![设置面板 Light](images/styleguide/settings-light.png)      | ![设置面板 Dark](images/styleguide/settings-dark.png)      |
| 全局 Token | ![全局 Token Light](images/styleguide/tokens-light.png)      | ![全局 Token Dark](images/styleguide/tokens-dark.png)      |
| 动效与插画 | ![动效与插画 Light](images/styleguide/motion-light.png)      | ![动效与插画 Dark](images/styleguide/motion-dark.png)      |

<!-- STYLEGUIDE_SCREENSHOTS_END -->

## 文档

- 文档站：`vp dev docs`
- 动效与插画接入：[`Hitu + Motion 指南`](./docs/guides/hitu-motion.md)
- 非线性动效与迁移：[`曲线规范`](./docs/design/apple-motion-curves.md)
- 动效接入验收：[`测试与包体积记录`](./docs/audits/hitu-motion-2026-10-08.md)
- 官方规范快照：[`docs/geist-markdown-refs`](./docs/geist-markdown-refs)
- 变更记录：[`CHANGELOG.md`](./CHANGELOG.md)

## 颜色规范

基础色阶采用 **Vercel Geist Colors**，参考快照见 `docs/geist-markdown-refs/foundations/colors.md`，实际定义在 `src/styles/index.css`。`--uni-*` 按具体用途映射这些颜色。Apple HIG 用于指导布局、交互和无障碍，不提供额外调色盘。覆盖颜色时需注明来源、理由和适用范围。

## 开发

```bash
pnpm install
pnpm dev
pnpm test
pnpm typecheck
```

发布前包级验证（`prepublishOnly` 自动执行）：

```bash
pnpm exec playwright install chromium
pnpm run test:package
```

该命令重新构建并打包库，在独立消费项目中安装压缩包，检查 TypeScript、ESM/CJS、服务端渲染和 hydration，再用 Chromium 检查双主题发布样式。验证后的压缩包、文件清单和摘要保存于 `.scratch/npm-release/`。

已准备由正式 GitHub Release 触发的发布流程：全部 CI 和浏览器检查通过后，发布同一份已验证压缩包。首版 `0.1.0` 使用临时环境 Token，后续版本使用 npm trusted publishing。外部配置与失败恢复见[发布指南](https://github.com/HUSTRadio/unitary-ui/blob/master/docs/guides/npm-release.md)及 [Release 草稿](https://github.com/HUSTRadio/unitary-ui/blob/master/docs/guides/npm-release-0.1.0.md)。

## 持续集成

[`CI`](./.github/workflows/ci.yml) 在 `master` 推送、所有 PR 和手动运行时触发，三个并行任务分别执行静态检查与完整单测、应用构建与包契约检查、文档构建与 LLM 语料一致性检查。任务使用 Ubuntu 24.04、Node.js 24 和 `package.json` 声明的 pnpm 版本，以 `pnpm install --frozen-lockfile` 安装依赖。

完整单测中的图像审计需要 Python 3.12 和 Pillow；CI 会安装锁定依赖。本地运行前执行 `python -m pip install --requirement tests/audit/requirements.txt`。

[`夜间浏览器检查`](./.github/workflows/e2e-nightly.yml) 每天北京时间 02:00（UTC 18:00）运行，也支持手动触发：Ubuntu 执行覆盖全部视口和明暗主题的文档布局检查，Windows 2025 执行 README 截图只读检查。失败时上传报告、trace 和截图，保留 7 天。CI 检测文档或截图漂移后直接失败；请在本地生成并审查更新。

## 致谢

设计参考与第三方资产见 [`CREDITS.md`](./CREDITS.md)。OPPO Sans 与 HarmonyOS Sans 的再分发存在许可风险，详见 [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md)。

## 许可证

MIT © 2026 HUSTRadio。法律文本见 [`LICENSE`](./LICENSE)，中文阅读入口见 [`LICENSE.zh-CN.md`](./LICENSE.zh-CN.md)。
