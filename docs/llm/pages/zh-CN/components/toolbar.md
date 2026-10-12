# 工具栏

> Route: `/components/toolbar`

分组排列工具按钮，空间不足时将可折叠组移入更多操作菜单。

[返回组件](#/components)

# 工具栏

toolbar

分组排列工具按钮，空间不足时将可折叠组移入更多操作菜单。

## 何时使用

- 需要窗口级命令组（导航、视图切换、收尾动作）并希望空间不足自动折叠时。
- 需要把工具项按语义分成前、中、后三段时。

## 何时不应使用

- 页面级导航链接与滚动行为——用 Navbar。
- 应用级命令菜单（带快捷键与子菜单）——用 MenuBar。

## 示例

### 默认工具栏

前中后三组工具项，缩小容器后组折叠进尾部溢出菜单。

## 无障碍

- 工具项是带无障碍名称的原生 button；仅图标显示时 label 仍作为 aria-label。
- 选中态通过 aria-pressed 暴露，不依赖颜色单通道传达。
- 溢出菜单复用 DotsMenu，键盘可达；禁用与选中状态一并透传到菜单项（disabled 不可点、aria-current 标记当前档）。

## 受控行为

- 折叠状态由容器内部测量自管（可通过 collapse=false 关闭），不暴露受控开关。
- 工具项激活由 onSelect 回调驱动，选中态由调用方传入 active。

## 响应式行为

- 空间不足时可折叠组整组收起，组内 ToolbarItem 进入溢出菜单；含搜索框 / MenuButton 等非 ToolbarItem 内容的组保持常驻（这类内容没有溢出入口）。
- 重新展开需多出 24px 空间，避免宽度临界时反复折叠。

## 主题行为

- 工具栏使用 background 与描边 token，暗色模式下自动切换。
- 项的高亮、选中与禁用态均使用灰阶 alpha token。

## 实时示例

No command yet.

```tsx
import * as React from "react";
import { Copy } from "lucide-react";

import { Toolbar, ToolbarGroup, ToolbarItem } from "@hustradio/unitary-ui";

/**
 * Toolbar —— 窗口级工具操作组：leading / center / trailing 三段分组。
 * 空间不足时可折叠组收起，组内 ToolbarItem 进入尾部溢出菜单（缩小容器即可看到）。
 */
export function ToolbarDefault4A8E7C22Example() {
  const [mode, setMode] = React.useState("preview");
  const [log, setLog] = React.useState("No command yet.");

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <Toolbar className="max-w-[420px]">
        <ToolbarGroup slot="leading">
          <ToolbarItem
            icon={<Copy className="size-4" />}
            label="Duplicate"
            onSelect={() => setLog("Duplicate")}
          />
          <ToolbarItem label="Rename" onSelect={() => setLog("Rename")} />
        </ToolbarGroup>
        <ToolbarGroup slot="center">
          <ToolbarItem
            label="Preview"
            active={mode === "preview"}
            onSelect={() => setMode("preview")}
          />
          <ToolbarItem label="Code" active={mode === "code"} onSelect={() => setMode("code")} />
        </ToolbarGroup>
        <ToolbarGroup slot="trailing">
          <ToolbarItem label="Share" onSelect={() => setLog("Share")} />
          <ToolbarItem label="Publish" onSelect={() => setLog("Publish")} />
        </ToolbarGroup>
      </Toolbar>
      <p className="text-copy-13 text-gray-900">{log}</p>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Toolbar, ToolbarGroup, ToolbarItem } from "@hustradio/unitary-ui";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">collapse</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">空间不足时把可折叠组收进溢出菜单。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">slot</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ToolbarSlot</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">组的位置：leading、center 或 trailing。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"leading"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">collapsible</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">空间不足时该组是否折叠。未指定时按组内容决定：组内全部是 ToolbarItem 才折叠，含搜索框 / MenuButton / 自定义控件时保持常驻。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">项名称；折叠后作为溢出菜单文案与无障碍名称。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">icon</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">工具项的行首图标（16px 档）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">iconOnly</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">隐藏可见文案，但仍作为无障碍名称。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">active</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">标记该项为当前选中。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSelect</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">项被激活时触发。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 窗口级命令组用 Toolbar；页面级导航链接用 Navbar。
- 导航放 leading 组、当前视图切换放 center 组、收尾命令放 trailing 组。
- 只有 ToolbarItem 会进入溢出菜单——任意控件留在组内，因此可折叠组应由 ToolbarItem 组成。
- 优先使用 disabled 而不是隐藏，避免命令无解释地消失。
