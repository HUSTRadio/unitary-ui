# 颜色

> Route: `/colors`

# 颜色

兼顾对比度与可读性的颜色系统。

## 色阶

系统共 10 个色阶。每个色卡展示当前主题取值，点击即可复制。

背景

页面与组件表面。

灰

中性 UI、文本与图标。

灰（透明）

半透明边框、分隔线与遮罩。

蓝

信息提示与主要强调。

红

破坏性操作与错误状态。

琥珀

警告状态。

绿

成功状态。

青

辅助语义强调。

紫

辅助语义强调。

粉

辅助语义强调。

## 背景

页面和组件通常使用 Background 1；需要区分相邻区域时，少量使用 Background 2。

- Background 1 — 默认元素背景
- Background 2 — 次要背景

## 色彩 1–10

1–10 档色阶按背景、边框、文字等用途分组。

### 色彩 1–3：组件背景

用于组件背景、悬停态和按下态。

100f2f2f2

200ebebeb

300e6e6e6

### 色彩 4–6：边框

用于结构性边框与分隔线。

400ebebeb

500c9c9c9

600a8a8a8

### 色彩 7–8：高对比背景

用于需要突出显示的组件背景。

7008f8f8f

8007d7d7d

### 色彩 9–10：文本与图标

用于无障碍的文本与图标对比。

9004d4d4d

1000171717

## 语义 Token

语义变量（token）按用途命名，例如背景、文字和边框；颜色随当前主题变化。

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Token</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">角色</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">用法</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">当前取值</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm"><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--background"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--background</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">画布</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">页面与组件的主要背景。</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--background);"></span><span class="font-mono text-copy-13 text-foreground">#ffffff</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--foreground"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--foreground</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">内容</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">主要文本与图标颜色。</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--foreground);"></span><span class="font-mono text-copy-13 text-foreground">#171717</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--muted-foreground"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--muted-foreground</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">次要内容</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">辅助文本与图标。</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--muted-foreground);"></span><span class="font-mono text-copy-13 text-foreground">#4d4d4d</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--border"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--border</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">边框</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">结构性边框与分隔线。</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--border);"></span><span class="font-mono text-copy-13 text-foreground">#ebebeb</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--ring"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--ring</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">焦点环</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">清晰可见的键盘焦点指示。</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--ring);"></span><span class="font-mono text-copy-13 text-foreground">#171717</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--primary"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--primary</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">主要操作</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">主要交互强调。</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--primary);"></span><span class="font-mono text-copy-13 text-foreground">#171717</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--destructive"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--destructive</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">危险</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">破坏性操作与错误状态。</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--destructive);"></span><span class="font-mono text-copy-13 text-foreground">#e5484d</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--success"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--success</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">成功</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">成功结果与确认。</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--success);"></span><span class="font-mono text-copy-13 text-foreground">#46a758</span></span></td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-semantic-token="--warning"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-mono text-foreground">--warning</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-foreground">警告</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">需要关注的警告。</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle"><span class="inline-flex items-center gap-2"><span class="size-4 shrink-0 rounded-sm border border-gray-alpha-400" aria-hidden="true" style="background-color: var(--warning);"></span><span class="font-mono text-copy-13 text-foreground">#ffb224</span></span></td></tr></tbody></table>
