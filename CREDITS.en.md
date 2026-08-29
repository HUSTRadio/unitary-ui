# CREDITS

English alternative — the Simplified Chinese primary version is [`CREDITS.md`](./CREDITS.md).

This repository's implementation references and benefits from the following projects and design systems, ordered by influence.

## 1. Vercel Geist design system

- Site: <https://vercel.com/geist>
- Nature: **design-spec reference** (no code derivation). The visual authority of this framework — token system, typography, materials, component behavior, best practices, and Web Interface Guidelines all follow its official documentation.

## 2. Apple Human Interface Guidelines

- Site: <https://developer.apple.com/design/human-interface-guidelines/>
- Nature: **platform-spec reference**. The Phone component's iOS status-bar layout, Safari chrome shapes, and safe-area semantics follow its public documentation. No official Apple icons, product bezels, or marketing assets are copied or bundled; status-bar/Safari icons are independently drawn generic geometry.

## 3. react-mockframe

- Repository: <https://github.com/mbdev3/react-mockframe>
- Author: Mohammed Banani
- License: MIT (full notice in [`THIRD_PARTY_NOTICES.en.md`](./THIRD_PARTY_NOTICES.en.md))
- Usage: npm dependency providing iPhone 17 device frames (CSS + React components), seven body colors, landscape mode, `hideNotch`, and modular iPhone CSS.

## 4. Marvel devices.css

- Repository: <https://github.com/marvelapp/devices.css>
- Copyright: © 2014 Marvelapp (MIT)
- Relation: react-mockframe's device styles are adapted from it (indirect derivation); attribution is preserved alongside react-mockframe's MIT notice.

## 5. telephone

- Repository: <https://github.com/sneas/telephone>
- Author: Dimah Snisarenko
- License: MIT (full notice in [`THIRD_PARTY_NOTICES.en.md`](./THIRD_PARTY_NOTICES.en.md))
- Usage: implementation ideas for status-bar structure and proportions; its dependencies are not installed, no device SVG blocks are copied, and its fixed `9:41` time implementation is not used.

## 6. liquidframe

- Repository: <https://github.com/CVERInc/liquidframe>
- Copyright: CVERInc / liquidframe contributors (MIT)
- Usage: reference for the three Safari chrome layouts (compact/bottom/top) and safe-area inset organization; no dependencies installed, no full frames copied. This project replaced its imperative URL-change API with declarative React props.

## 7. JetBrains Maple Mono

- Source: JetBrains Maple Mono (JetBrains Mono + Maple Mono fusion, including Nerd Font icons)
- License: OFL-1.1 (SIL Open Font License v1.1)
- Sites: <https://github.com/JetBrains/JetBrainsMono> / <https://github.com/subframe7536/Maple-font>
- Usage: self-hosted **tiered subsets** (latin / GB2312 level-1 / level-2, three weights, nine woff2 files) loaded on demand via unicode-range. Full font files are not bundled. OFL permits modification, subsetting, and redistribution; the full text ships in [`OFL-1.1.txt`](./OFL-1.1.txt).

## 8. OPPO Sans 4.0

- Source: OPPO Sans 4.0 (official OPPO brand font)
- License: free for commercial use (official terms: "free for commercial use, no download channel provided")
- Public-source status: the previously referenced OPPO brand-font page is no longer available, and no reproducible official public download/license page is currently known.
- Usage: three self-hosted **tiered subsets**, with no full font files included, still ship in the npm package. The existing “free for commercial use” statement alone is not a complete authorization chain for subsetting and onward redistribution; republishers must perform their own legal review.

## 9. HarmonyOS Sans

- Source: HarmonyOS Sans (Huawei system font, SC Simplified / TC Traditional variable fonts)
- License: HarmonyOS Font License (free for commercial use; modification, subsetting, and redistribution permitted)
- Official resource page: <https://developer.huawei.com/consumer/en/design/resource>
- Usage: three self-hosted SC/TC variable-font subsets ship in the npm package as the fallback tier for `data-font-tier="hmos"`. The current official resource page provides the font download but not a license text fixed in this repository or a complete reproducible record for onward subset redistribution; republishers must perform their own legal review.
