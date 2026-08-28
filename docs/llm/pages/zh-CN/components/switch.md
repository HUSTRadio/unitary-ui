# 分段选择

> Route: `/components/switch`

用于互斥视图选项的滑块分组。

[返回组件](#/components)

# 分段选择

Switch

用于互斥视图选项的滑块分组。

## 何时使用

- 需要在两个或三个互斥选项之间切换时（如 Source 和 Output 两种视图）。
- 选项数量少且用户经常需要在它们之间来回切换，需要即时反馈。

## 何时不应使用

- 布尔开关场景应使用 Toggle，而非 Switch 的无线电语义。
- 超过三个选项或标签很长时应使用 Tabs 或 Select 代替。

## 示例

### 基础用法

带有两个互斥选项的基础分段选择器。

### 大小变体

不同的尺寸规格，适配紧凑或宽松的面板布局。

### 禁用状态

展示不可交互时的禁用外观和原因提示。

## 无障碍

- 每个 Switch.Control 都应提供可访问名称（即使图标-only 也要加 Tooltip 和 sr-only 标签）。
- 左右箭头键移动焦点，回车或空格激活选项，Escape 退出。

## 受控行为

- 使用 checked 受控属性精确控制选中状态，配合 onChange 回调同步父级 state。
- 必须为 Switch 组分配一个 name 属性确保单选互斥；defaultChecked 确定初始选中项。

## 响应式行为

- 全宽模式（full-width）在窄屏上提供更好的触摸目标；各选项填充使最长标签不会导致选中小 pill 的尺寸变化。

## 主题行为

- 激活态 pill 的颜色跟随主题 token，可以在暗色和亮色模式下保持一致的对比度。

## 实时示例

Source

Output

```tsx
import { Switch, SwitchControl } from "@/components/ui/switch";

<Switch name="default">
  <SwitchControl defaultChecked label="Source" value="source" />
  <SwitchControl label="Output" value="output" />
</Switch>;
```

Source

Output

Source

Output

Source

Output

Source

Output

Source

Output

Source

Output

Source

Output

Source

Output

Source

Output

## 禁用

Source

Output

```tsx
import { Switch, SwitchControl } from "@/components/ui/switch";

<div className="flex w-full max-w-md flex-col items-start">
  <Switch name="reference-view-mode">
    <SwitchControl defaultChecked disabled label="Source" value="source" />
    <SwitchControl disabled label="Output" value="output" />
  </Switch>
</div>;
```

## 尺寸

Source

Output

Source

Output

Source

Output

```tsx
import { Switch, SwitchControl } from "@/components/ui/switch";

<div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="reference-sizes-small" size="small">
      <SwitchControl defaultChecked label="Source" value="source" />
      <SwitchControl label="Output" value="output" />
    </Switch>
  </div>
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="reference-sizes-default">
      <SwitchControl defaultChecked label="Source" value="source" />
      <SwitchControl label="Output" value="output" />
    </Switch>
  </div>
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="reference-sizes-large" size="large">
      <SwitchControl defaultChecked label="Source" value="source" />
      <SwitchControl label="Output" value="output" />
    </Switch>
  </div>
</div>;
```

## 全宽

Source

Output

```tsx
import { Switch, SwitchControl } from "@/components/ui/switch";

<Switch name="reference-full-width" style={{ width: "100%" }}>
  <SwitchControl defaultChecked label="Source" value="source" />
  <SwitchControl label="Output" value="output" />
</Switch>;
```

## 工具提示

Source

Output

```tsx
import { Switch, SwitchControl } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";

<div className="flex w-full max-w-md flex-col items-start">
  <Switch name="reference-tooltip">
    <Tooltip text="View Source">
      <SwitchControl defaultChecked label="Source" size="large" value="source" />
    </Tooltip>
    <Tooltip text="View Output">
      <SwitchControl label="Output" size="large" value="output" />
    </Tooltip>
  </Switch>
</div>;
```

## 图标

Source

Output

Source

Output

Source

Output

```tsx
import { LayoutGrid, List } from "lucide-react";
import { Switch, SwitchControl } from "@/components/ui/switch";

<div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="reference-icons-small" size="small">
      <SwitchControl defaultChecked icon={<LayoutGrid />} label="Source" value="source" />
      <SwitchControl icon={<List />} label="Output" value="output" />
    </Switch>
  </div>
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="reference-icons-default">
      <SwitchControl defaultChecked icon={<LayoutGrid />} label="Source" value="source" />
      <SwitchControl icon={<List />} label="Output" value="output" />
    </Switch>
  </div>
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="reference-icons-large" size="large">
      <SwitchControl defaultChecked icon={<LayoutGrid />} label="Source" value="source" />
      <SwitchControl icon={<List />} label="Output" value="output" />
    </Switch>
  </div>
</div>;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Switch, SwitchControl } from "@/components/ui/switch";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控选择项。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收新选择。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 同一表面的不同视图、2–3 个互斥选项的分段选择器用 Switch，如 Source vs Output。
- 布尔开/关设置用 Toggle。Switch 实现 radio 语义，两个选项保持互斥而非读作复选框。
- 超过 3 个选项或标签超过几个词时改用 Tabs 或 Select。
- 传 name 让底层 radios 分组；缺少时可能同时出现多个选项被选中。
- 在恰好一个 Switch.Control 上设 defaultChecked（或受控 checked），让组有明确的初始状态。
- 为每个 Switch.Control 留出内边距，让最宽标签在选中时不被 active pill 撑变形。用组内最长文案测试。
- 每个 Switch.Control 标签首字母大写。标签保持一两个词且平行：Source / Output，而非 Source / Show output。
- 每个 Switch.Control 始终提供 label，即使图标已承载含义，让屏幕阅读器播报选项。纯图标控件由组件渲染为 geist-sr-only。
- 纯图标 Switch 在每个控件上配 Tooltip，让视觉用户获得与辅助技术相同的标签。
