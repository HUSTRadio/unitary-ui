# npmjs 发布指南

[English](./npm-release.en.md)

目标包为 `@hustradio/unitary-ui`，首版 `0.1.0-beta.0` 已发布；当前准备版本为 `0.1.0-beta.1`，发布到 `beta`。从 `master` 手动触发 `publish.yml`，不发布 GitHub Release。未来正式版本仍由正式 Release 的 `published` 事件发布到 `latest`；草稿、预发布 Release 和 tag 推送不会自动发布。

## 首发前配置

1. 确认 npm 账号有 `@hustradio` scope 的创建及发布权限，并启用账号 2FA。GitHub 仓库必须公开，才能为公开包生成 provenance。
2. 在 GitHub 仓库创建 `npmjs` Environment，允许 `master` 分支和版本标签部署；如需要人工审阅，可配置 required reviewers。发布 job 在验证通过后进入该环境。
3. 为首次创建包准备一个短期 granular npm token，仅授权所需 scope 的包发布并启用 bypass 2FA；将它保存为 `npmjs` 环境 Secret `NPM_TOKEN`。不要写入仓库、命令示例或日志。
4. 合入发布准备修改之前完成全量验证；提交、推送及实际发布按维护者授权执行。

npm 仅允许为已经存在的包配置 trusted publisher，因此首版使用临时 Token；工作流只有在包不存在且版本恰为首个 beta `0.1.0-beta.0`（或未来正式首版 `0.1.0`） 时才注入它。后续版本只使用 OIDC，不回退 Token。[npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) · [npm trust 前置条件](https://docs.npmjs.com/cli/v11/commands/npm-trust/)

## 本地准备与验收

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
python -m pip install --requirement tests/audit/requirements.txt
pnpm run test:package
pnpm run verify -- --dry-run --full
pnpm run verify -- --full
```

`test:package` 清理并构建 `dist`，通过 pnpm 打包一次，在独立临时项目中安装压缩包，检查类型、ESM/CJS、SSR、hydration 和双主题 CSS。随后将同一 tarball 安装进完整 docs 应用，通过独立锁冻结依赖，验证类型、静态构建、双语语料和全量浏览器矩阵。`pnpm run test:docs:package` 复用同一验证，不生成第二份压缩包。内部打包使用 `--config.ignore-scripts=true`，避免重复执行 `prepack`；单独运行 `pnpm pack` 仍会自动构建。

验收产物在 `.scratch/npm-release/`：`hustradio-unitary-ui-0.1.0-beta.1.tgz`、`files.json`、`summary.json`、`SHA256SUMS`。这些是被忽略的本地产物，不提交。浏览器或网络受限制时，必须在具备相应权限的环境重跑，不能跳过检查。

语料或截图检查发现漂移时，使用仓库生成命令生成、审阅修改，再重跑确定性检查和完整验证。保留 16 个字体子集及双语第三方许可和现有风险披露；包并非将字体重新许可为 MIT。

## 无需 Release 发布 beta

将 `package.json` 保持为 `0.1.0-beta.1`，把通过验证的修改提交到 `master` 后手动运行：

```sh
gh workflow run publish.yml --repo HUSTRadio/unitary-ui --ref master -f version=0.1.0-beta.1
```

输入版本必须与包版本一致，且为 `-beta.N`。仍须通过全部 CI、全量浏览器矩阵和 Windows README 截图检查。最终压缩包以 `--tag beta --provenance` 发布，核验 `beta` 标签及 `refs/heads/master` 的 provenance。无需 Release 或版本 tag，正式 Release 保持草稿。远端核验成功之前，Changelog 继续保留在 `Unreleased`。

## 创建正式 Release

1. 保持 `package.json` 版本为 `0.1.0`；将版本 tag `v0.1.0` 指向经过审阅、验证且属于 `master` 历史的提交。
2. 用 [0.1.0 草稿说明](./npm-release-0.1.0.md) 整理 GitHub Release 草稿，确认选择正确 tag，并取消 prerelease 标记。准备阶段 Changelog 保持 `Unreleased`，不提前声明发布成功。
3. 发布正式 Release。工作流首先核对事件、tag、提交、版本和 npm 远端，再调用现有 CI 和 nightly 的全部检查，包括 Windows README 截图。
4. 所有检查通过后，生成并验证最终压缩包；发布 job 下载同一份产物，核对摘要并再次检查远端，然后执行带 provenance 的公开发布。发布 job 不安装项目依赖、不运行构建或压缩包生命周期。npm 从 runner 临时目录执行，避免仓库限定 pnpm 的 `devEngines` 阻止压缩包发布。
5. 在 Actions 查看 `npm-package`、`npm-publication-evidence` 和最终校验结果。工作流核对远端版本、`latest`、公开访问、integrity 和 provenance bundle，在 npm 扫描已接受的上传期间只读轮询最多 20 分钟，发布 job 限时 30 分钟。超时不会重复发布。[npm 扫描说明](https://github.blog/changelog/2026-07-28-npm-publish-time-malware-scanning-and-dual-use-metadata/)

## 首版成功后切换 OIDC

在 npm 包 Settings 配置 trusted publisher：Organization/user 为 `HUSTRadio`，Repository 为 `unitary-ui`，Workflow filename 为 `publish.yml`，Environment 为 `npmjs`，允许直接 `npm publish`。环境和文件名必须完全匹配；使用 GitHub 托管 runner、Node 24 和 npm ≥11.5.1。工作流已经设置 `id-token: write`。[官方配置说明](https://docs.npmjs.com/trusted-publishers/)

配置成功后删除 GitHub 环境中的 `NPM_TOKEN` Secret，并在 npm 撤销临时 Token。后续 beta 递增版本并手动触发同一工作流；正式版本更新版本与 tag 后再发布正式 Release。已发布的版本不能重复发布。

新建 trusted publisher 必须在 48 小时内完成首次成功的 OIDC 发布，否则配置过期，下次发布前需删除并重新创建。首发 Token 上传不会验证之后才创建的 publisher；不要仅为验证配置额外发布版本。[npm 当前要求](https://docs.npmjs.com/trusted-publishers/)

## 失败恢复

- 发布前检查失败：检查对应 job 的输出和产物，修复后在正确提交上重新准备版本；不绕过失败检查。
- 首版认证失败且 registry 仍为 404：确认 scope 权限、Token 有效期及 bypass 2FA，再重新运行失败工作流。
- 后续 OIDC 失败：核对 npm trusted publisher 的仓库、文件名、环境及权限；不增加 Token 回退。
- 发布步骤或发布后校验失败：从原运行的 `summary.json` 读取确切版本，再查询该版本；本次为 `npm view @hustradio/unitary-ui@0.1.0-beta.1 --registry=https://registry.npmjs.org/ --json`。若版本存在，保留原产物摘要并核对 integrity、`beta`（正式版为 `latest`） 和 provenance，不重新发同版本；全量重跑会因版本存在被阻止。
- 版本存在但发布后核验不完整：下载原运行的 `npm-package` 及证据，按摘要和 registry 元数据补做核验。若内容本身有问题，修复后发布新版本；若仅目标 dist-tag 指向不符，维护者核实后单独修复 dist-tag。不要删除版本以尝试重发。

- npm 已接受上传但版本尚不可查询：先等待扫描，不能仅凭此时的 404 判定发布失败。版本可用后将原 `npm-package` 文件还原到 `.scratch/npm-release/`，使用原运行的 `GITHUB_SHA`、`GITHUB_REF`、`GITHUB_EVENT_NAME` 执行 `node scripts/npm-release.mjs verify`，保留 `published.json`；不要重跑发布 job。
- 首个 beta 包即使使用 `--tag beta`，npm 仍会添加 `latest`，且完成 2FA 后删除可能返回 HTTP 400。保留 beta 版本并披露实际标签，明确使用 `@beta` 或版本号安装；不要为改变该行为虚构正式版本或重发。[npm CLI 问题记录](https://github.com/npm/cli/issues/8490)

线上发布确认后，再将双语 Changelog 的相关变更归档到实际发布版本（首版为 `0.1.0-beta.0`），填写实际发布日；后续变更继续留在 `Unreleased`。

## 构建已发布包的文档静态产物

`pnpm run test:package` 只打包一次：原有独立库 consumer 校验后，将同一 tarball 安装进完整文档应用，使用独立冻结锁检查类型、静态构建、双语 corpus 和完整浏览器矩阵。`pnpm run test:docs:package` 复用此流程，不产生第二份 tarball。

发布核验完成后，`docs-static` job 检出同一发布提交，下载原候选 tarball 和 `published.json`，消费 registry 上的精确版本，并将下载包的 integrity 与候选包核对。外部依赖继续使用候选文档 consumer 的同一锁定依赖树。完整浏览器矩阵和双语 corpus 比较基于构建后的应用；验证后关闭测试 fixture，重新构建正式静态产物并再次比较 corpus。

Actions 产物 `unitary-docs-<version>-<sha>` 包含可部署的静态文件和 `build-metadata.json`，记录库版本、integrity、发布提交和依赖锁摘要。产物名使用该次发布的精确版本和完整提交 SHA。托管另行配置，本流程只交付文件。`docs-publication-evidence` 保留独立 consumer 的 manifest、冻结锁文件和验证输出。

如仅文档产物失败，恢复原运行的 `npm-package` 和 `npm-publication-evidence` 文件至 `.scratch/npm-release/`，使用原发布提交的干净 checkout，再执行：

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm run build:docs:registry -- --receipt .scratch/npm-release/published.json
```

结果位于 `.scratch/npm-release/docs-static/`。该命令不发布新包，也不解析浮动 dist-tag；dirty 候选、dirty 发布 checkout、源码或依赖锁不一致、registry 包与原候选 integrity 不符均会失败。本地包测试允许未提交修改，但其 receipt 标记为 dirty，不能充当正式发布产物；发布前应在干净的发布提交上重新验证。
