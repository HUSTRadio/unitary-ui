# CREDITS

本仓库的实现参考并受益于以下项目与设计系统。按影响力排序。

## 1. Vercel Geist 设计系统

- 站点：<https://vercel.com/geist>
- 性质：**设计规范参考**（非代码派生）。本框架的视觉权威——token 体系、排版、材质、组件行为、Best Practices 与 Web Interface Guidelines 均以其官方文档为基准。
- 参考范围：整体视觉语言、颜色/排版/材质 token 角色、组件 API 形态与交互/无障碍约定。

## 2. Apple Human Interface Guidelines

- 站点：<https://developer.apple.com/design/human-interface-guidelines/>
- 性质：**平台规范参考**。Phone 组件的 iOS 状态栏布局、Safari chrome 形态与安全区语义以其公开文档描述为参照。
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
