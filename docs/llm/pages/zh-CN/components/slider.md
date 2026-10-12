# 滑块

> Route: `/components/slider`

在给定数值范围内拖动滑块选择值。

[返回组件](#/components)

# 滑块

slider

在给定数值范围内拖动滑块选择值。

## 何时使用

- 用于需要对数值范围敏感的输入场景：带宽上限、透明度、音频音量、颜色通道等形状和距离比精度更重要的情况。
- 需要将滑块与数字输入框配对使用，供键盘用户在精确值（端口号、内存限制）间进行选择。
- 设定合理的步长（1、5、10%），避免拖拽产生不精确的值（如 47.83291），同时上下限钳制到真实的产品极限。

## 何时不应使用

- 需要精确选择具体值的地方不要使用滑块——改用 Select、Input 或 Combobox。
- 选项少于 4 个的单选场景直接用 Radio Group 更清晰，不要强行用滑块代替。
- 不适合在移动端单独作为唯一的输入方式——触屏拖拽精度有限，应提供数值回退。

## 示例

### 默认滑块

展示默认样式的 Range Slider，包含轨道和手柄。

### 步长与最大值

展示自定义步长和大小的 Range Slider。

### 带标签

展示通过 label prop 在轨道上方提供可见且无障碍名称的 Range Slider。

## 无障碍

- 通过兄弟 <label htmlFor> 或 aria-label 给滑块提供无障碍名称，原生箭头键、Page Up/Down、Home/End 行为负责键盘操作。
- 需要精确值时显式启用 showStartInput / showEndInput，或由调用方在相邻区域渲染带单位的数值。
- 禁用态的滑块仍需 tooltip 命名原因，以免用户困惑为什么无法调节。

## 受控行为

- Slider 接受 value/defaultValue：value 受控；onValueChange 在拖拽、键盘与可选数值输入路径都会触发，把新值交还父组件。
- 轨道交互结束后触发 onValueCommit（onValueCommitted 为兼容别名）；同一轮内的重复调用会被合并，便于在 StrictMode 下安全使用。
- 禁用手柄会阻止任何键盘和鼠标输入，适合需要临时锁定设置的场景。

## 响应式行为

不适用: 轨道使用容器宽度，但组件不按断点缩放标签或保证 44px 触控目标；移动布局和额外命中区域由调用方验证。

## 主题行为

- 滑块轨道颜色、激活态背景和手柄样式跟随主题变量，暗色/亮色模式下各有对应配色。
- 组件没有专用颜色 prop；品牌化需要在外层样式系统中覆盖相应类或令牌。

## 实时示例

```tsx
import { Slider } from "@hustradio/unitary-ui";

export function SliderDefault37A8EEC1Example() {
  return <Slider defaultValue={[50]} aria-label="Value" />;
}
```

## 步进与最大值

```tsx
import { Slider } from "@hustradio/unitary-ui";

export function SliderStepMax1112E58CExample() {
  return <Slider defaultValue={[20]} step={10} max={50} marks aria-label="Value in steps of 10" />;
}
```

## 带标签

Volume

```tsx
import { Slider } from "@hustradio/unitary-ui";

export function SliderWithLabelBB9F6883Example() {
  return <Slider label="Volume" defaultValue={[40]} />;
}
```

## 带输入框的范围滑块

```tsx
import { Slider } from "@hustradio/unitary-ui";
import { useState } from "react";

export function SliderRangeWithInputs16EAD947Example() {
  const [value, setValue] = useState([50, 75]);

  return (
    <Slider showStartInput showEndInput value={value} onValueChange={setValue} aria-label="Range" />
  );
}
```

## 禁用区间滑块与输入框

```tsx
import { Slider } from "@hustradio/unitary-ui";

export function SliderDisabledRangeWithInputsFCA5E8B4Example() {
  return <Slider disabled showStartInput showEndInput value={[50, 75]} aria-label="Range" />;
}
```

## 松开时才提交数值

Drag then release

Last committed: —

```tsx
import { Slider } from "@hustradio/unitary-ui";
import { useState } from "react";

export function SliderCommitOnRelease97B1700EExample() {
  const [committed, setCommitted] = useState<number | null>(null);

  return (
    <>
      <Slider
        label="Drag then release"
        defaultValue={[50]}
        onValueCommit={(value) => setCommitted(value[0] ?? null)}
      />
      <p className="mt-2 text-copy-13 text-muted-foreground">
        Last committed: {committed === null ? "—" : committed}
      </p>
    </>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Slider } from "@hustradio/unitary-ui";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number[]) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">拖拽、键盘或数值输入导致的值变化都会调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">marks</code><span data-slot="docs-api-extension-badge" class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean | Array&lt;{ value: number; label?: string }&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">刻度：`true` 按 step 自动生成（上限 50），或传入显式数组。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">markLabelFormat</code><span data-slot="docs-api-extension-badge" class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">为未显式提供 label 的刻度格式化标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueCommit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number[]) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">确认变更后的标准回调。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 形状与邻近性比精度更重要的范围数字输入用 slider：带宽上限、透明度、音量、颜色通道。
- 端口号或内存限制这类精确值，slider 配数字 Input；键盘用户默认输入。
- 吸附到合理步长（1、5、10%），拖拽绝不产生 47.83291 这类值。min 与 max 夹到真实产品限制。
- 需要精确值时启用 showStartInput/showEndInput，或由调用方在相邻区域渲染带单位的数值；label 只负责命名滑块。
- 通过兄弟 <label htmlFor> 或 aria-label 给 slider 无障碍名称，让原生方向键、Page Up/Down、Home/End 行为承担键盘工作。不要拦截这些键。
