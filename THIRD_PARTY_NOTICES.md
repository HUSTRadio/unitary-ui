# Third-Party Notices

简体中文主版本；英文替代版本见 [`THIRD_PARTY_NOTICES.en.md`](./THIRD_PARTY_NOTICES.en.md)。

本仓库分发的代码包含或派生自以下第三方项目。按许可要求保留其完整版权与许可声明。

> Vercel Geist 设计系统与 Apple Human Interface Guidelines 仅为文档/规范参考（无代码衍生），不在此列；见 `CREDITS.md`。

## react-mockframe

- 来源：<https://github.com/mbdev3/react-mockframe>
- 依赖形式：npm 包 `react-mockframe`（含 `styles/mockframe-iphones.css`）

```
MIT License

Copyright (c) 2026 Mohammed Banani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Marvel devices.css（经 react-mockframe 间接派生）

- 来源：<https://github.com/marvelapp/devices.css>

```
MIT License

Copyright (c) 2014 Marvelapp

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## telephone（参考实现，未分发）

- 来源：<https://github.com/sneas/telephone>
- 说明：状态栏结构参考其 MIT 源码实现思路；本仓库未复制其代码，仅按要求保留声明。

```
MIT License

Copyright (c) 2024 Dimah Snisarenko

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## liquidframe（参考实现，未分发）

- 来源：<https://github.com/CVERInc/liquidframe>
- 说明：Safari chrome 布局与安全区 inset 参考其 MIT 源码实现思路；本仓库未复制其完整外框，仅按要求保留声明。

```
MIT License

Copyright (c) 2026 liquidframe contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 字体（自托管分级子集）

本仓库 `public/fonts/` 下的 15 个 woff2 分级子集会全部复制到 `dist/fonts/` 并随 npm 包分发。它们均不适用本仓库的 MIT 许可证；发布者明确选择保留全部处理后字体，并在 README 披露下述差异化风险。

### JetBrains Maple Mono

- 来源：<https://github.com/JetBrains/JetBrainsMono> / <https://github.com/subframe7536/Maple-font>
- 许可：SIL Open Font License 1.1（OFL-1.1）；版权声明与完整许可原文随包提供为 [`OFL-1.1.txt`](./OFL-1.1.txt)
- 使用范围：三字重 9 个分级子集（latin / GB2312 一级 / 二级），用于代码与终端场景
- 状态：许可文本随包，允许在 OFL-1.1 条件下修改、子集化和再分发

### OPPO Sans 4.0

- 来源：OPPO 官方品牌字体；此前公开页面已失效，当前无可复现的官方公开下载/许可页
- 许可证据：保留的官方「免费商用」表述
- 使用范围：3 个分级子集（l1/l2/l3 可变字体），随 npm 包提供
- 风险：现有公开证据未完整覆盖子集化、修改与再次分发；二次发布者须自行完成法务核验

### HarmonyOS Sans

- 官方资源页：<https://developer.huawei.com/consumer/en/design/resource>
- 许可表述：HarmonyOS Font License（免费商用，允许修改、子集化、再分发）
- 使用范围：SC 简体 / TC 繁体 3 个分级子集，随 npm 包提供
- 风险：当前资源页未提供可固定到本仓库的许可原文与完整可复现授权链；二次发布者须自行完成法务核验

> 需要严格、可审计许可链的下游不应直接再分发 OPPO Sans 与 HarmonyOS Sans 的这 6 个子集。
