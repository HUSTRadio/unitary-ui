# 应用壳层

> Route: `/patterns/app-shell`

# App Shell 应用壳层

用顶栏、侧栏、内容区和页脚搭建应用页面。调整窗口宽度，观察侧栏在 lg 断点（1024px）处切换为汉堡导航菜单。

[App Shell](#demo-overview)

## 总览

### Navbar

scrollBehavior 支持 static / pinned / auto-hide 三种定位行为；variant 支持 solid / transparent，transparent 可配合 solidOnScroll 在滚动后自动补底色。

### SidebarNav

groups 定义导航组，activeTo 高亮当前页，side 设置分隔线方向。collapsible 允许折叠分组。本例由外层布局设置宽度，并从 lg 断点起显示侧栏。

### HamburgerMenu

组合 HamburgerIcon 和 ExpandPanel。anchor=topbar 时，面板从顶栏底边向下展开；输入搜索词后显示匹配结果。

### Footer

columns 链接列 + slotLeading/slotTrailing 插槽 + sticky 吸底可选。本页演示两列形态。

## 可配项速查

<table class="w-full border-collapse text-left"><thead><tr class="border-gray-alpha-400 border-b"><th scope="col" class="text-label-13 px-4 py-2.5 font-medium text-muted-foreground">组件</th><th scope="col" class="text-label-13 px-4 py-2.5 font-medium text-muted-foreground">Prop</th><th scope="col" class="text-label-13 px-4 py-2.5 font-medium text-muted-foreground">默认值</th><th scope="col" class="text-label-13 px-4 py-2.5 font-medium text-muted-foreground">说明</th></tr></thead><tbody><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">Navbar</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">scrollBehavior</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">"pinned"</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">static 随文档流 / pinned 吸顶常驻 / auto-hide 下滚隐藏上滚复现</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">Navbar</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">variant · solidOnScroll</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">"solid" · false</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">transparent 无底色；solidOnScroll 滚动超阈值后补底色与下边框</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">SidebarNav</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">groups · activeTo · side</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">— · — · "left"</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">分组数据源、当前高亮项（aria-current="page"）、分隔边方向</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">SidebarNav</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">collapsible · persistKey</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">false · —</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">分组标题可点击开合；persistKey 记忆折叠状态（localStorage，当前页所在分组始终展开）</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">SidebarNav</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">items[].badge</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">—</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">条目右端状态胶囊：{ label, tone: "new" | "updated" }；桌面侧栏与移动端面板同一视觉</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">HamburgerMenu</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">anchor · direction</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">— · topbar→"down"</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">触发场景；topbar 向下延伸为顶栏视觉延续，sidebar 建议对侧展开</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">HamburgerMenu</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">maxExpandedHeight · content</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">"100dvh" · "merged"</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">展开态最大高；merged 搜索+导航合并 / split 视觉拆分（占位）</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">BottomSheet</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">detents · gestures</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">[0.5, 1] · 全开</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">高度档位（≥2 档自动渲染 Grabber）；resize/expandUp/collapseDown 各自可关</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">Footer</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">columns · sticky</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">— · false</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">链接列数组；sticky 吸底。slotLeading/slotTrailing 自由插槽</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">MenuBar</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">MenuBarItem.shortcut · inset</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">— · false</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">右对齐快捷键（仅展示，不绑定按键）；inset 使无图标项与勾选项对齐</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">MenuBar</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">MenuBarCheckboxItem · MenuBarSub</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">— · —</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">勾选项（ItemIndicator 打勾）+ 子菜单（SubTrigger 右向箭头，逐级展开）</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">Toolbar</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">ToolbarGroup.slot · collapsible</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">"leading" · true</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">leading / center / trailing 三段排布；空间不足时整组折叠进尾部溢出菜单</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">Toolbar</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">ToolbarItem.iconOnly · active</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">false · —</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">仅图标（无障碍名仍取 label）；active 呈选中态，用于分段切换</td></tr></tbody></table>

## 应用菜单栏与工具栏

MenuBar 提供 File / Edit / View 等应用命令；Toolbar 提供导航和视图切换等常用工具，空间不足时按组收进更多操作菜单。本例将菜单栏放在工具栏上方。

unitary-ui.app/editor

### 窗口内容区

- 设计规范.mdMarkdown · 12 KB
- 组件清单.xlsx表格 · 48 KB
- 首页草图.png图片 · 2.4 MB
- 发布配置.json配置 · 1 KB

最近命令：尚未触发

## 移动端特化

移动端特化

### BottomSheet 多档位弹层

低于最低档继续下拉关闭、点按 Grabber 循环切换档位（Apple HIG 规格）。点击下方按钮打开体验拖拽调高与档位吸附。

Unitary · Patterns

壳层组件

- [Navbar 可配顶栏](#demo-api)
- [SidebarNav 侧边导航](#demo-api)

移动端

- [BottomSheet 弹层](#demo-mobile)
- [Grabber 指示条](#demo-mobile)
