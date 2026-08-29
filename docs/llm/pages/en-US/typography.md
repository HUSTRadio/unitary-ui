# Typography

> Route: `/typography`

# Typography

Rules of typesetting throughout the system.

## Fonts

Three typefaces are bundled and subsetted into the framework: the default UI face, a Chinese-capable sans, and a mono for code.

- `OPPO Sans 4.0`敏捷开发，Unitary 设计系统。
- `HarmonyOS Sans SC`设计出极致的美，简而有道。
- `JetBrains Maple Mono`const unitary = await design()

## Headings

Used to introduce pages or sections.

- `text-heading-72`Heading 72
- `text-heading-64`Heading 64
- `text-heading-56`Heading 56
- `text-heading-48`Heading 48
- `text-heading-40`Heading 40
- `text-heading-32`Heading 32 with **Subtle**
- `text-heading-24`Heading 24 with **Subtle**
- `text-heading-20`Heading 20 with **Subtle**
- `text-heading-16`Heading 16 with **Subtle**
- `text-heading-14`Heading 14

## Buttons

Only to be used within components that render buttons.

- `text-button-16`
- `text-button-14`
- `text-button-12`

## Label

Designed for single-lines, and given ample line-height for highlighting & marrying up with icons.

- `text-label-20`Label 20
- `text-label-18`Label 18
- `text-label-16`Label 16 with **Strong**
- `text-label-14`Label 14 with **Strong**
- `text-label-14-mono`Label 14 Mono
- `text-label-13`Label 13 with **Strong**, and Tabular (123)
- `text-label-13-mono`Label 13 Mono
- `text-label-12`Label 12 with **Strong**, AND CAPS
- `text-label-12-mono`Label 12 Mono

## Copy

Designed for multiple lines of text, having a higher line height than Label.

- `text-copy-24`Copy 24 with **Strong**
- `text-copy-20`Copy 20 with **Strong**
- `text-copy-18`Copy 18 with **Strong**
- `text-copy-16`Copy 16 with **Strong**
- `text-copy-14`Copy 14 with **Strong**
- `text-copy-13`Copy 13
- `text-copy-13-mono`Copy 13 Mono

缺口：快照仅定义 copy 的 13 Mono 变体（text-copy-13-mono）；text-copy-14-mono 等其余 mono 变体在框架中不存在，需新增时在 index.css 补 @utility。
