# Third-Party Notices

English alternative — the Simplified Chinese primary version is [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).

Code distributed from this repository contains or is derived from the following third-party projects. Their full copyright and license notices are preserved as required.

> The Vercel Geist design system and Apple Human Interface Guidelines are documentation/spec references only (no code derivation) and are not listed here; see [`CREDITS.en.md`](./CREDITS.en.md).

## react-mockframe

- Source: <https://github.com/mbdev3/react-mockframe>
- Dependency form: npm package `react-mockframe` (includes `styles/mockframe-iphones.css`)

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

## Marvel devices.css (indirect derivation via react-mockframe)

- Source: <https://github.com/marvelapp/devices.css>

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

## telephone (implementation reference, not distributed)

- Source: <https://github.com/sneas/telephone>
- Note: the status-bar structure references its MIT implementation ideas; no code is copied from it, and the notice is preserved as required.

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

## liquidframe (implementation reference, not distributed)

- Source: <https://github.com/CVERInc/liquidframe>
- Note: the Safari chrome layouts and safe-area insets reference its MIT implementation ideas; no full frames are copied, and the notice is preserved as required.

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

## Fonts (self-hosted tiered subsets)

All 15 tiered woff2 subsets under `public/fonts/` are copied to `dist/fonts/` and distributed with the npm package. None are covered by this repository's MIT license. The publisher has explicitly chosen to retain every processed font and disclose the differing risks below in the README.

### JetBrains Maple Mono

- Source: <https://github.com/JetBrains/JetBrainsMono> / <https://github.com/subframe7536/Maple-font>
- License: SIL Open Font License 1.1 (OFL-1.1); copyright notices and the full license text ship as [`OFL-1.1.txt`](./OFL-1.1.txt)
- Usage: three weights across nine tiered subsets (latin / GB2312 level-1 / level-2), for code and terminal contexts
- Status: the license text ships with the package; modification, subsetting, and redistribution are permitted under OFL-1.1

### OPPO Sans 4.0

- Source: official OPPO brand font; the previously public page is no longer available, and no reproducible official public download/license page is currently known
- License evidence: retained official “free for commercial use” statement
- Usage: three tiered variable-font subsets (l1/l2/l3) ship with the npm package
- Risk: available public evidence does not fully cover subsetting, modification, and onward redistribution; republishers must perform their own legal review

### HarmonyOS Sans

- Official resource page: <https://developer.huawei.com/consumer/en/design/resource>
- License statement: HarmonyOS Font License (free for commercial use; modification, subsetting, and redistribution permitted)
- Usage: three SC Simplified / TC Traditional tiered subsets ship with the npm package
- Risk: the current resource page does not provide a license text fixed in this repository or a complete reproducible authorization chain; republishers must perform their own legal review

> Downstreams requiring a strict, auditable license chain should not directly redistribute these six OPPO Sans and HarmonyOS Sans subsets.
