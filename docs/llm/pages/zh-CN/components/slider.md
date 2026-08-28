# 滑块

> Route: `/components/slider`

用于从给定范围中选择数值的输入控件。

[返回组件](#/components)

# 滑块

Slider

用于从给定范围中选择数值的输入控件。

## 何时使用

-   用于需要对数值范围敏感的输入场景：带宽上限、透明度、音频音量、颜色通道等形状和距离比精度更重要的情况。
-   需要将滑块与数字输入框配对使用，供键盘用户在精确值（端口号、内存限制）间进行选择。
-   设定合理的步长（1、5、10%），避免拖拽产生不精确的值（如 47.83291），同时上下限钳制到真实的产品极限。

## 何时不应使用

-   需要精确选择具体值的地方不要使用滑块——改用 Select、Input 或 Combobox。
-   选项少于 4 个的单选场景直接用 Radio Group 更清晰，不要强行用滑块代替。
-   不适合在移动端单独作为唯一的输入方式——触屏拖拽精度有限，应提供数值回退。

## 示例

### 默认滑块

展示默认样式的 Range Slider，包含轨道、手柄和当前值。

### 步长与最大值

展示自定义步长和大小的 Range Slider。

### 带标签

展示实时显示当前值的 Range Slider，在轨道旁标注数值和单位。

## 无障碍

-   通过兄弟 <label htmlFor> 或 aria-label 给滑块提供无障碍名称，原生箭头键、Page Up/Down、Home/End 行为负责键盘操作。
-   实时数值旁边需标注该数值代表的含义（如“采样率 · 44 kHz”），帮助屏幕阅读器理解上下文。
-   禁用态的滑块仍需 tooltip 命名原因，以免用户困惑为什么无法调节。

## 受控行为

-   Slider 支持受控和非受控两种模式，开发者可通过 onChange 回调监听值的变化并更新外部状态。
-   禁用手柄会阻止任何键盘和鼠标输入，适合需要临时锁定设置的场景。

## 响应式行为

-   滑块轨道在全屏幕上保持等比缩放，手柄点击区域在各视口下均符合最小触控目标要求。
-   窄屏时标签文字自动缩小字号，确保数值和单位不会换行溢出。

## 主题行为

-   滑块轨道颜色、激活态背景和手柄样式跟随主题变量，暗色/亮色模式下各有对应配色。
-   可通过 props 自定义滑块颜色，与品牌主色调保持一致。

## 实时示例

```tsx
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const [value, setValue] = useState([50]);

<Slider value={value} onValueChange={setValue} aria-label="Value" />
```

```tsx
import { Slider } from "@/components/ui/slider";

<Slider defaultValue={[20]} step={10} max={50} marks aria-label="Value in steps of 10" />
```

```tsx
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const [value, setValue] = useState([40]);

<Slider label="Volume" value={value} onValueChange={setValue} />
```

```tsx
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const [value, setValue] = useState([50, 75]);

<Slider showStartInput showEndInput value={value} onValueChange={setValue} aria-label="Range" />
```

```tsx
import { Slider } from "@/components/ui/slider";

<Slider disabled showStartInput showEndInput value={[50, 75]} aria-label="Range" />
```

```tsx
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const [value, setValue] = useState([50]);
const [committed, setCommitted] = useState<number | null>(null);

<Slider
  label="Drag then release"
  value={value}
  onValueChange={setValue}
  onValueCommitted={(value) => setCommitted(value[0] ?? null)}
/>
<p className="mt-2 text-copy-13 text-gray-900">
  Last committed: {committed === null ? "—" : committed}
</p>
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Slider } from "@/components/ui/slider"
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">marks</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean | Array&lt;{ value: number; label?: string }&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">刻度：`true` 按 step 自动生成（上限 50），或传入显式数组。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">markLabelFormat</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">为未显式提供 label 的刻度格式化标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueCommit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number[]) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">确认变更后的标准回调。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueCommitted</code><span class="ml-2 text-label-12 text-muted-foreground">已弃用</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number[]) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">onValueCommit 的兼容别名。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

-   形状与邻近性比精度更重要的范围数字输入用 slider：带宽上限、透明度、音量、颜色通道。
-   端口号或内存限制这类精确值，slider 配数字 Input；键盘用户默认输入。
-   吸附到合理步长（1、5、10%），拖拽绝不产生 47.83291 这类值。min 与 max 夹到真实产品限制。
-   始终在轨道旁用 tabular nums 渲染实时值，并标注数字代表什么（Sample Rate · 44 kHz）。单独轨道无法自我描述。
-   通过兄弟 <label htmlFor> 或 aria-label 给 slider 可访问名称，让原生方向键、Page Up/Down、Home/End 行为承担键盘工作。不要拦截这些键。
