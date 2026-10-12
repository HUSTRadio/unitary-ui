# 文档代码结构

[English](./docs-architecture.en.md)

docs 保留在主仓库，通过私有工作区 `@hustradio/unitary-ui-docs` 消费库的公开 API。组件实现和 token 仍以 `src/` 为准；用户文档以 `docs/site/` 为准，`docs/llm/` 只保存真实页面生成的输出。

| 路径 | 职责 |
| --- | --- |
| `docs/package.json` | 文档应用直接依赖；不发布到 npm |
| `docs/vite.config.ts`、`docs/index.html` | 构建配置和站点入口 |
| `docs/site/src/components`、`pages` | 文档展示和页面外壳 |
| `docs/site/src/content`、`data` | 双语指南、API 注册表、路由元数据 |
| `docs/site/src/examples` | 真实示例及配对源码；demo ID 保持稳定 |
| `docs/site/build` | 源码预览与示例加载插件 |
| `src/styles` | 库样式和 token 的唯一维护来源 |
| `public` | 共享媒体资源的唯一维护来源 |

文档运行时代码、类型和可复制示例只从 `@hustradio/unitary-ui` 导入库符号，不使用 `@/`、包内私有路径或相对路径访问根目录 `src/`。站点内模块使用相对路径。公共 API 缺口先核对已存在的公开类型；仅在独立用途成立时新增公开导出，不把内部实现全部开放给 docs。

文档 CSS 引入 `@hustradio/unitary-ui/styles.css`，再用 `@hustradio/unitary-ui/tailwind-reference.css` 引用库的主题和工具类定义，只扫描自己的源码。参考文件及其配色依赖在构建时直接复制自 canonical CSS；不维护第二份 token。根 styleguide 单独扫描共享 docs 示例。站点几何常量留在 docs CSS 中。

本地默认使用源码映射，保留同一次组件修改与文档修改的即时反馈。`docs/site/tsconfig.source.json` 负责源码类型检查；`docs/site/tsconfig.json` 独立检查已安装包，不继承仓库路径映射。包模式关闭所有源码 alias。

源码模式的普通样式入口已提供完整主题定义，reference 映射为空文件，避免重复引用同一 canonical CSS 而丢失运行时变量。包模式使用已发布的真实 reference 文件。

```sh
pnpm run build:docs
pnpm run test:docs:package
pnpm run docs:llm:generate
pnpm run docs:llm:check
```

`test:docs:package` 复用 `test:package` 的一次打包：同一 tarball 同时接受库入口检查和完整 docs 消费检查。独立消费者只复制站点源码、配置、插件和六个明确声明的共享媒体文件；不复制库源码、根配置或根 public 的字体。依赖从独立锁文件冻结安装，静态产物接受全量浏览器和双语语料比较；证据保存在 `.scratch/npm-release/`，不提交。

发布成功后，`build:docs:registry` 读取发布回执，核对提交、精确版本和 tarball integrity，再使用候选消费者相同的依赖树构建可部署文件。`publish.yml` 保存静态产物及验证元数据；托管部署另行配置。静态构建失败时重跑产物阶段，不能重新发布已存在的 npm 版本。详见[发布指南](./npm-release.md)。

新增页面或组件文档时，同步 API 注册表、双语指南、示例 ID 和生成语料。AST 导入检查、包消费者和统一 `verify` 是结构约束的验收门禁；测试可直接读取源码验证内部合同，但不能替代真实包消费检查。
