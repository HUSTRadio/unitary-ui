# CREDITS

简体中文主版本；英文替代版本见 [`CREDITS.en.md`](./CREDITS.en.md)。

本仓库的实现参考并受益于以下项目与设计系统。按影响力排序。

## 1. Vercel Geist 设计系统

- 站点：<https://vercel.com/geist>
- 性质：**设计规范参考**（非代码派生）。本框架的 token 体系、排版、经典平面材质、组件行为、Best Practices 与 Web Interface Guidelines 以其官方文档为基准；全局模糊与玻璃材质为本项目扩展。
- 参考范围：整体视觉语言、颜色/排版/材质 token 角色、组件 API 形态与交互/无障碍约定。
- 唯一基础参考调色盘：**Vercel Geist Colors**。基础色阶的证据快照是 `docs/geist-markdown-refs/foundations/colors.md`，运行时 owner 是 `src/styles/index.css`。
- `--uni-*` 是语义映射层，不是第二套调色盘；Apple HIG 提供布局、行为和无障碍原则，也为材质层级提供参考，不提供额外调色盘。用户强制 override 必须具名来源、理由和作用域。

## 2. Apple Human Interface Guidelines

- 站点：<https://developer.apple.com/design/human-interface-guidelines/>
- 性质：**平台规范参考**。Phone 组件的 iOS 状态栏布局、Safari chrome 形态与安全区语义，以及材质的层级、上下文和可读性原则，以其公开文档描述为参照。
- 参考范围：仅公开文档描述；**未复制或打包任何 Apple 官方图标、Product Bezels 或营销素材**，状态栏/Safari 图标均为独立绘制的通用几何图形。

## 3. react-mockframe

- 仓库：<https://github.com/mbdev3/react-mockframe>
- 作者：Mohammed Banani
- 许可：MIT（完整声明见 `THIRD_PARTY_NOTICES.md`）
- 使用范围：npm 依赖，提供 iPhone 17 设备外框（CSS + React 组件）、七种机身颜色、横屏、`hideNotch` 与模块化 iPhone CSS。

## 4. Marvel devices.css

- 仓库：<https://github.com/marvelapp/devices.css>
- 版权：© 2014 Marvelapp（MIT）
- 关系：react-mockframe 的设备样式自其改编（indirect derivation），随 react-mockframe 的 MIT 声明一并保留署名。

## 5. telephone

- 仓库：<https://github.com/sneas/telephone>
- 作者：Dimah Snisarenko
- 许可：MIT（完整声明见 `THIRD_PARTY_NOTICES.md`）
- 参考范围：状态栏结构与比例的实现思路；未安装其依赖、未复制整块设备 SVG，也未采用其固定 `9:41` 时间实现。

## 6. liquidframe

- 仓库：<https://github.com/CVERInc/liquidframe>
- 版权：CVERInc / liquidframe contributors（MIT）
- 参考范围：Safari 三种 chrome 布局（compact/bottom/top）与安全区 inset 的组织方式；未安装依赖、未复制完整外框。其原脚本无网址修改 API，本项目改为声明式 React prop。

## 7. JetBrains Maple Mono

- 来源：JetBrains Maple Mono（JetBrains Mono + Maple Mono 融合，含 Nerd Font 图标）
- 许可：OFL-1.1（SIL Open Font License v1.1）
- 站点：<https://github.com/JetBrains/JetBrainsMono> / <https://github.com/subframe7536/Maple-font>
- 使用范围：本框架自托管**分级子集**（latin / GB2312 一级 / GB2312 二级，三字重 9 个 woff2），unicode-range 按需加载。完整字体文件未打包，仅裁剪约 71-99% 体积用于代码/终端场景。OFL 许可允许修改、子集化与再分发，完整许可原文随 npm 包提供为 [`OFL-1.1.txt`](./OFL-1.1.txt)。

## 8. OPPO Sans 4.0

- 来源：OPPO Sans 4.0（OPPO 官方品牌字体）
- 许可：免费商用（官方条款「免费商用，不提供下载渠道」）
- 公开来源状态：此前引用的 OPPO 品牌字体页面现已失效，当前没有可复现的官方公开下载/许可页。
- 使用范围：本框架自托管**分级子集**（~0.9MB/1.6MB，显著裁剪），**不含完整字体文件**。这 3 个子集仍随 npm 包提供；现有「免费商用」表述不足以单独构成对子集化和再次分发的完整授权链，二次发布者须自行完成法务核验。

## 9. HarmonyOS Sans

- 来源：HarmonyOS Sans（华为鸿蒙系统字体，含 SC 简体 / TC 繁体变量字体）
- 许可：HarmonyOS Font License（免费商用，可修改、子集化、再分发）
- 官方资源页：<https://developer.huawei.com/consumer/en/design/resource>
- 使用范围：本框架自托管 SC/TC 可变字体（woff2-variations）与分级子集，作为 `data-font-tier="hmos"` 档位的兜底字体。3 个子集随 npm 包提供；当前官方资源页提供字体下载，但未提供可固定到本仓库的许可原文和对子集再次分发的完整证据，二次发布者须自行完成法务核验。

## 10. Tremor Raw

- 仓库：<https://github.com/tremorlabs/tremor>
- 版权：© Tremor contributors（Apache-2.0，完整声明见 `THIRD_PARTY_NOTICES.md`）
- 参考范围：图表组件族（`src/components/ui/charts/`）以 Tremor Raw v1.0.0 源码为基线，按其官方推荐的源码复制方式内置；本地适配仅限类名 token 化、字体系统对齐与图标/工具替换，交互与数据契约保持上游一致。

## 11. recharts

- 仓库：<https://github.com/recharts/recharts>
- 版权：© 2016-2024 Recharts Group（MIT，完整声明见 `THIRD_PARTY_NOTICES.md`）
- 参考范围：npm 运行时依赖，作为内置图表组件的渲染底层；本仓库未修改其源码。

## 代码主题颜色参考 / Code theme color references

- 来源：[VS Code Light+/Dark+](https://github.com/microsoft/vscode/tree/main/extensions/theme-defaults/themes)、[Monokai](https://github.com/microsoft/vscode/blob/main/extensions/theme-monokai/themes/monokai-color-theme.json)、[Solarized](https://ethanschoonover.com/solarized/)。
- 理由：按用户要求提供独立于 UI 色盘的公认代码主题。仅将公开色值适配到 Prism 语法角色，不复制完整编辑器主题规则或实现代码。
- 作用域：显式应用的行内代码与代码块容器及其 CSS 导出。UI 基础色阶仍由项目既有色盘提供；品牌蓝来自 Unitary logo。

## 材质演示风景照片

- 作品：*View of lake in forest*（Alpsee，巴伐利亚），摄影：mirobo。
- 来源与许可记录：[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:View_of_lake_in_forest.jpg)。
- 许可：[CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)，独立于仓库的 MIT 许可。
- 使用范围：材质文档的演示背景，原图 4288×2704，仅随文档站打包；文件与校验记录见 [素材声明](docs/site/src/assets/materials-alpsee.LICENSE.md)。
