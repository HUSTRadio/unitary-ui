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

The fonts under `public/fonts/` in this repository are tiered subsets (charset-tiered woff2 files). The build copies them into `dist/fonts/` and rewrites the CSS references to relative paths, so **these subsets are distributed with the npm package** (`files` contains `dist`). Each font's license status is listed below; **none of them are covered by this repository's MIT license**:

### JetBrains Maple Mono

- Source: <https://github.com/JetBrains/JetBrainsMono> / <https://github.com/subframe7536/Maple-font>
- License: SIL Open Font License 1.1 (OFL-1.1); full text at <https://openfontlicense.org/open-font-license-official-text/>
- Usage: three weights across nine tiered subsets (latin / GB2312 level-1 / level-2), for code and terminal contexts
- OFL-1.1 permits modification, subsetting, and redistribution, provided copyright and license notices are preserved and substantially modified versions are not released under reserved font names
- Status: license chain complete; may be distributed with the repository

### OPPO Sans 4.0

- Source: <https://www.oppoweb.com/sans/> (official OPPO brand font)
- License: OPPO official terms "free for commercial use" (no public download channel provided by OPPO)
- Usage: three tiered subsets (l1/l2/l3 variable fonts)
- Status: subsets hosted solely on OPPO's public "free for commercial use" statement; full fonts must be obtained by users from OPPO's official channels. Distribution compliance depends on those official terms and must be confirmed by users

### HarmonyOS Sans

- Source: <https://developer.huawei.com/consumer/cn/design/HarmonyOS-Sans/>
- License: HarmonyOS Font License (free for commercial use; modification, subsetting, and redistribution permitted)
- Usage: SC Simplified / TC Traditional variable fonts (woff2-variations) and tiered subsets as the fallback tier for `data-font-tier="hmos"`
- Status: redistributed under the official font license

> If a later audit finds that redistribution rights for any font cannot be confirmed from its official license, mark it BLOCKED and exclude it from the distribution list instead of assuming it is usable.
