# npmjs 发布指南

[English](./npm-release.en.md)

目标包为 `@hustradio/unitary-ui`，首版为 `0.1.0`，正式版本发布到 `latest`。发布由 GitHub 正式 Release 的 `published` 事件触发；草稿、预发布和单独推送 tag 都不会发包。

## 首发前配置

1. 确认 npm 账号有 `@hustradio` scope 的创建及发布权限，并启用账号 2FA。GitHub 仓库必须公开，才能为公开包生成 provenance。
2. 在 GitHub 仓库创建 `npmjs` Environment，允许版本标签部署；如需要人工审阅，可配置 required reviewers。发布 job 在验证通过后进入该环境。
3. 为首次创建包准备一个短期 granular npm token，仅授权所需 scope 的包发布并启用 bypass 2FA；将它保存为 `npmjs` 环境 Secret `NPM_TOKEN`。不要写入仓库、命令示例或日志。
4. 合入发布准备修改之前，审阅全部变更。此指南和准备工具不会提交、推送、创建线上 Release 或调用发布。

npm 仅允许为已经存在的包配置 trusted publisher，因此首版使用临时 Token；工作流只有在包不存在且版本恰为 `0.1.0` 时才注入它。后续版本只使用 OIDC，不回退 Token。[npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) · [npm trust 前置条件](https://docs.npmjs.com/cli/v11/commands/npm-trust/)

## 本地准备与验收

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
python -m pip install --requirement tests/audit/requirements.txt
pnpm run test:package
pnpm run verify -- --dry-run --full
pnpm run verify -- --full
```

`test:package` 清理并构建 `dist`，通过 pnpm 打包，在独立临时项目中安装压缩包，检查类型、ESM/CJS、SSR、hydration 和双主题 CSS。内部打包使用 `--config.ignore-scripts=true`，避免重复执行 `prepack`；单独运行 `pnpm pack` 仍会自动构建。

验收产物在 `.scratch/npm-release/`：`hustradio-unitary-ui-0.1.0.tgz`、`files.json`、`summary.json`、`SHA256SUMS`。这些是被忽略的本地产物，不提交。浏览器或网络受限制时，必须在具备相应权限的环境重跑，不能跳过检查。

语料或截图检查发现漂移时，使用仓库生成命令生成、审阅修改，再重跑确定性检查和完整验证。保留 16 个字体子集及双语第三方许可和现有风险披露；包并非将字体重新许可为 MIT。

## 创建正式 Release

1. 保持 `package.json` 版本为 `0.1.0`；将版本 tag `v0.1.0` 指向经过审阅、验证且属于 `master` 历史的提交。
2. 用 [0.1.0 草稿说明](./npm-release-0.1.0.md) 整理 GitHub Release 草稿，确认选择正确 tag，并取消 prerelease 标记。准备阶段 Changelog 保持 `Unreleased`，不提前声明发布成功。
3. 发布正式 Release。工作流首先核对事件、tag、提交、版本和 npm 远端，再调用现有 CI 和 nightly 的全部检查，包括 Windows README 截图。
4. 所有检查通过后，生成并验证最终压缩包；发布 job 下载同一份产物，核对摘要并再次检查远端，然后执行带 provenance 的公开发布。发布 job 不安装项目依赖、不运行构建或压缩包生命周期。
5. 在 Actions 查看 `npm-package`、`npm-publication-evidence` 和最终校验结果。工作流核对远端版本、`latest`、公开访问、integrity 和 provenance bundle，最多等待短暂的 registry 同步。

## 首版成功后切换 OIDC

在 npm 包 Settings 配置 trusted publisher：Organization/user 为 `HUSTRadio`，Repository 为 `unitary-ui`，Workflow filename 为 `publish.yml`，Environment 为 `npmjs`，允许直接 `npm publish`。环境和文件名必须完全匹配；使用 GitHub 托管 runner、Node 24 和 npm ≥11.5.1。工作流已经设置 `id-token: write`。[官方配置说明](https://docs.npmjs.com/trusted-publishers/)

配置成功后删除 GitHub 环境的 `NPM_TOKEN` Secret，并在 npm 撤销临时 Token。后续发布升版本和 tag，再创建正式 Release；保留当前 `0.1.0` 不可重复发布。

## 失败恢复

- 发布前检查失败：检查对应 job 的输出和产物，修复后在正确提交上重新准备版本；不绕过失败检查。
- 首版认证失败且 registry 仍为 404：确认 scope 权限、Token 有效期及 bypass 2FA，再重新运行失败工作流。
- 后续 OIDC 失败：核对 npm trusted publisher 的仓库、文件名、环境及权限；不增加 Token 回退。
- 发布步骤或发布后校验失败：先查询 `npm view @hustradio/unitary-ui@0.1.0 --registry=https://registry.npmjs.org/ --json`。若版本存在，保留原产物摘要并核对 integrity、`latest` 和 provenance，不重新发同版本；全量重跑会因版本存在被阻止。
- 版本存在但发布后核验不完整：下载原运行的 `npm-package` 及证据，按摘要和 registry 元数据补做核验。若内容本身有问题，修复后发布新版本；若仅 `latest` 指向不符，维护者核实后单独修复 dist-tag。不要删除版本以尝试重发。

线上发布确认后，再将双语 Changelog 的相关变更归档到 `0.1.0`，填写实际发布日；后续变更继续留在 `Unreleased`。
