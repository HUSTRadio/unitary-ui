# Third-Party Notices

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

本仓库 `public/fonts/` 下的字体均为分级子集（按字符集分级裁剪的 woff2）。构建产物会把它们复制到 `dist/fonts/` 并把 CSS 引用改为相对路径，因此**这些子集会随 npm 包分发**（`files` 含 `dist`）。各字体许可状态如下；**均不适用本仓库的 MIT 许可证**：

### JetBrains Maple Mono

- 来源：<https://github.com/JetBrains/JetBrainsMono> / <https://github.com/subframe7536/Maple-font>
- 许可：SIL Open Font License 1.1（OFL-1.1），完整文本见 <https://openfontlicense.org/open-font-license-official-text/>
- 使用范围：三字重 9 个分级子集（latin / GB2312 一级 / 二级），用于代码与终端场景
- OFL-1.1 允许：修改、子集化、再分发，条件为保留版权与许可声明、不以保留字体名发布实质性修改版本
- 状态：许可链条完整，可随仓库分发

### OPPO Sans 4.0

- 来源：<https://www.oppoweb.com/sans/>（OPPO 官方品牌字体）
- 许可：OPPO 官方条款「免费商用」（官方不提供公开下载渠道）
- 使用范围：3 个分级子集（l1/l2/l3 可变字体）
- 状态：仅依据官方公开的「免费商用」表述托管子集；完整字体须由使用者自行从 OPPO 官方渠道获取。分发合规性依赖该官方条款，使用者需自行确认

### HarmonyOS Sans

- 来源：<https://developer.huawei.com/consumer/cn/design/HarmonyOS-Sans/>
- 许可：HarmonyOS Font License（免费商用，允许修改、子集化、再分发）
- 使用范围：SC 简体 / TC 繁体可变字体（woff2-variations）与分级子集，`data-font-tier="hmos"` 档位兜底
- 状态：按官方字体许可再分发

> 若后续审计发现任一字体的再分发权无法从官方许可确认，应将其标记为 BLOCKED 并从分发清单排除，而不是默认其可用。
