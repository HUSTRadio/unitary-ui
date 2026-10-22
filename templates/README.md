# Unitary UI 模板

[English](./README.en.md)

这些独立 React + Vite + TypeScript + Tailwind 项目是本库的**动态消费者**：始终使用当前公开 API 与推荐用法，组件用法变化时同步更新模板。`workspace:*` 指向仓库内当前库，不绑定发布版本；仓库 lockfile 仍保证工具与外部依赖可复现。

| 模板                     | 场景                                              | 源码开发端口 |
| ------------------------ | ------------------------------------------------- | ------------ |
| [homepage](./homepage)   | SaaS 官网：介绍、功能、步骤、套餐、FAQ、体验表单  | 5221         |
| [dashboard](./dashboard) | 项目资源管理：概览、搜索筛选、分页、详情、设置    | 5222         |
| [docs](./docs)           | Markdown 文档：导航、搜索、目录、代码复制、前后页 | 5223         |

三个模板均默认中文，提供英文、浅色、深色和系统主题。业务数据与操作是本地演示，不连接后端；刷新会重置业务状态。语言与主题偏好可保留。

## 在仓库内运行

在仓库根目录安装依赖，再选择一个模板：

```sh
pnpm install
pnpm --filter @hustradio/unitary-template-homepage dev:source
pnpm --filter @hustradio/unitary-template-dashboard dev:source
pnpm --filter @hustradio/unitary-template-docs dev:source
```

每条开发命令分别启动一个应用。源码模式通过构建配置将公共包导入映射到当前源码，组件修改即时更新；应用代码仍使用 `@hustradio/unitary-ui` 公共入口。

普通包模式消费实际构建产物，不使用源码别名：

```sh
pnpm run build:lib
pnpm --filter @hustradio/unitary-template-homepage dev
pnpm --filter @hustradio/unitary-template-homepage build
pnpm --filter @hustradio/unitary-template-homepage preview
pnpm --filter @hustradio/unitary-template-homepage typecheck
```

将命令中的 `homepage` 换成另外两个模板即可。普通开发和预览端口由 Vite 分配。

## 复制到其他项目

1. 复制所选模板目录，跳过 `node_modules`、`dist` 和缓存。
2. 在新目录的 `package.json` 中将 `@hustradio/unitary-ui` 的 `workspace:*` 改为 `beta`，跟随公开 beta 分发标签。
3. 在新目录运行 `pnpm install`，生成自己的 lockfile，然后运行 `pnpm dev` 或 `pnpm build`。
4. 可删除 `vite.source.config.ts`、`tsconfig.source.json`、`source-reference.css` 与带 `:source` 的脚本；独立模式不使用这些文件。

模板目录就是完整的复制单位，无需搬运仓库 `src`、文档站或其他模板。仓库中的新用法可能先于 npm 发布更新；复制后使用未发布 API 时，需等待相应发布，或在自己的 workspace 中消费当前库。分发标签在重新安装／更新依赖时解析，已生成的 lockfile不会自动升级。

## 修改内容

- homepage：`src/content.ts` 集中维护品牌、双语文案、套餐、功能和 FAQ。
- dashboard：`src/data.ts` 维护资源与项目样例；`src/content.ts` 维护文案与导航。接入后端时替换业务数据来源与操作。
- docs：在 `src/content/zh-CN` 和 `src/content/en` 中维护成对 Markdown；`src/documents.ts` 统一维护标题、路由、分组与顺序。导航、搜索与前后页都使用此注册表，正文标题生成章节目录。
- 每个模板的 `src/locale.tsx` 管理自己的语言状态；`src/index.css` 仅保留模板布局，复用库的视觉 tokens 与公共 Tailwind reference。

优先直接组合标准组件；页面区块可复制，不需要通用页面生成器或跨模板运行时模块。docs 的 Markdown 依赖只属于 docs 模板。

## 验证

在仓库根目录执行：

```sh
pnpm run typecheck:templates
pnpm run build:templates
pnpm run test:templates
pnpm run test:templates:package
pnpm run verify -- --dry-run
pnpm run verify
```

浏览器检查覆盖六个布局视口、两种主题和两种语言。独立包检查把每个模板复制到临时目录，使用当前库的 tarball 与冻结依赖安装，完成类型检查、生产构建和浏览器冒烟检查。证据保存在 `.scratch/template-package`，普通模板浏览器报告在 `.scratch/template-browser.json`。

新增模板时使用相同目录约定，并添加相应浏览器 spec；验证发现实际私有 workspace 项目，不维护额外的模板列表。库公共 API、组件、样式或共享依赖变化时，统一验证会检查全部模板。
