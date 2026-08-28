# 颜色

> Route: `/colors`

# 颜色

一套高对比度且具备无障碍能力的颜色系统。

## 色阶

There are 10 color scales in the system. Each swatch shows the current theme value and can be copied.

Backgrounds

Page and component surfaces.

Gray

Neutral UI, text, and icons.

Gray alpha

Translucent borders, dividers, and overlays.

Blue

Informational and primary emphasis.

Red

Destructive and error states.

Amber

Warning states.

Green

Success states.

Teal

Supporting semantic emphasis.

Purple

Supporting semantic emphasis.

Pink

Supporting semantic emphasis.

## 背景

There are two background colors for pages and UI components. In most instances, use Background 1—especially when color is placed on top of the background. Use Background 2 sparingly when subtle differentiation is needed.

-   Background 1 — 默认元素背景
-   Background 2 — 次要背景

## 色彩 1–10

Numbered color steps group by their intended interface role.

### Colors 1–3: Component backgrounds

Use for component fills and layered interaction states.

100#f2f2f2

200#ebebeb

300#e6e6e6

### Colors 4–6: Borders

Use for structural borders and separators.

400#ebebeb

500#c9c9c9

600#a8a8a8

### Colors 7–8: High contrast backgrounds

Use for high-emphasis component backgrounds.

700#8f8f8f

800#7d7d7d

### Colors 9–10: Text and icons

Use for accessible text and icon contrast.

900#4d4d4d

1000#171717

## 语义 Token

Semantic tokens communicate interface roles while resolving to the current theme value.

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Token</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Role</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">用法</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Current value</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm"><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--background"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--background</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">Canvas</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Primary page and component surface.</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--background);"></span><span class="font-mono text-copy-13 text-foreground">#ffffff</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--foreground"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--foreground</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">Content</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Primary text and icon color.</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--foreground);"></span><span class="font-mono text-copy-13 text-foreground">#171717</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--muted-foreground"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--muted-foreground</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">Muted content</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Supporting text and icons.</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--muted-foreground);"></span><span class="font-mono text-copy-13 text-foreground">#4d4d4d</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--border"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--border</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">Border</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Structural borders and separators.</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--border);"></span><span class="font-mono text-copy-13 text-foreground">#ebebeb</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--ring"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--ring</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">Focus ring</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Visible keyboard focus indication.</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--ring);"></span><span class="font-mono text-copy-13 text-foreground">#171717</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--primary"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--primary</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">Primary action</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Primary interactive emphasis.</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--primary);"></span><span class="font-mono text-copy-13 text-foreground">#171717</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--destructive"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--destructive</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">危险</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Destructive actions and error states.</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--destructive);"></span><span class="font-mono text-copy-13 text-foreground">#e5484d</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--success"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--success</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">成功</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Successful outcomes and confirmations.</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--success);"></span><span class="font-mono text-copy-13 text-foreground">#46a758</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--warning"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--warning</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">警告</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Warnings that need attention.</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--warning);"></span><span class="font-mono text-copy-13 text-foreground">#ffb224</span></span></td></tr></tbody></table>
