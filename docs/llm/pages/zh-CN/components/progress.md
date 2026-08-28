# 进度条

> Route: `/components/progress`

显示相对于限制或任务的进度。

[返回组件](#/components)

# 进度条

Progress

显示相对于限制或任务的进度。

## 何时使用

- 已知总量且可追踪确定性进度时使用 Progress，如文件上传、多步设置、构建步骤或批量删除操作。
- 搭配明确的工作描述和单位文本（如「正在上传 12/30 个文件」），让进度条不仅仅是一个抽象数字。
- 使用 max prop 传入真实的上限值（max={files.length}），而非硬编码 100，组件会基于 value / max 计算百分比。

## 何时不应使用

- 对于短时间的不确定等待（约 1-3 秒），使用 Spinner 而非 Progress，因为此时不存在已知进度。
- 对于内联文案中的等待提示（如 Saving…），使用 Loading Dots 而不是进度条。
- 不要用 Progress 展示一个没有明确上限的模糊概念——如果没有真实的总数，考虑使用仪表 Gauge。

## 示例

### 自定义上限

展示使用不同的 max 值，组件按比例计算进度百分比。

### 动态颜色

展示根据进度值自动切换颜色的进度条效果。

### 带进度停止点

展示在进度条上标注特定节点的用法，适用于多阶段任务。

## 无障碍

- Progress 组件设置 role="progressbar" 以及 aria-valuemin、aria-valuemax 和 aria-valuenow 属性，屏幕阅读器据此朗读当前进度值。
- 必须配合描述性文本一起使用，单独一个进度条对辅助技术来说不够自描述。
- 避免覆盖组件内置的 ARIA 角色和属性值，这些是 WCAG 合规的关键。

## 受控行为

- Progress 支持受控的 value 和 max props，开发者可在外部驱动进度变化并通过 onChange 回调响应。
- 动画过渡平滑流畅，value 变化时进度条以 CSS transition 从旧值渐变到新值，避免跳跃式变化。

## 响应式行为

- 进度条采用全宽布局，在任何视口下都填满父容器的可用宽度。
- 数值标签在各尺寸下保持清晰可读，窄屏上可能缩小字号以适应空间。

## 主题行为

- 进度条的颜色和样式完全由主题变量控制，暗色模式和亮色模式下均有良好的对比度。
- ThroughStop 子元素的定位和样式同样跟随主题适配，确保在所有变体中一致。

## 实时示例

30%

60%

90%

## 自定义上限

```tsx
import { Progress } from "@/components/ui/progress";

<Progress value={30} max={40} aria-label="Progress 30 of 40" />;
```

## 动态更新

40%

过渡动画

```tsx
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

const [value, setValue] = useState(40);
const [animated, setAnimated] = useState(true);

<div className="flex w-full max-w-md flex-col items-start gap-6">
  <Progress
    value={value}
    label={`${value}%`}
    labelPosition="right"
    animated={animated}
    aria-label="Dynamic progress"
  />
  <div className="flex gap-2">
    <Button type="default" size="small" onClick={() => setValue((v) => Math.min(100, v + 10))}>
      Increase
    </Button>
    <Button type="secondary" size="small" onClick={() => setValue((v) => Math.max(0, v - 10))}>
      Decrease
    </Button>
  </div>
  <label className="flex items-center gap-2">
    <Toggle
      checked={animated}
      onChange={() => setAnimated((v) => !v)}
      size="small"
      aria-label="Animated transition"
    />
    <span className="text-label-13 text-muted-foreground">Animated transition</span>
  </label>
</div>;
```

## 动态颜色

0%

```tsx
import { useState } from "react";
import { Button, Progress } from "@/components/ui/progress";

const [value, setValue] = useState(0);

<div className="flex w-full max-w-md flex-col items-start gap-6">
  <Progress
    value={value}
    label={`${value}%`}
    labelPosition="right"
    aria-label="Dynamic colors progress"
    colors={{
      0: "var(--color-gray-1000)",
      25: "var(--color-destructive)",
      50: "var(--color-warning)",
      75: "var(--color-pink-800)",
      100: "var(--color-progress)",
    }}
  />
  <div className="flex gap-2">
    <Button type="default" size="small" onClick={() => setValue((v) => Math.min(100, v + 10))}>
      Increase
    </Button>
    <Button type="secondary" size="small" onClick={() => setValue((v) => Math.max(0, v - 10))}>
      Decrease
    </Button>
  </div>
</div>;
```

## 主题化

```tsx
import { Progress } from "@/components/ui/progress";

<div className="flex w-full max-w-md flex-col gap-6">
  <Progress type="success" value={100} aria-label="Success progress" />
  <Progress type="error" value={10} aria-label="Error progress" />
  <Progress type="warning" value={40} aria-label="Warning progress" />
  <Progress type="secondary" value={70} aria-label="Secondary progress" />
</div>;
```

## 带刻度

```tsx
import { Progress } from "@/components/ui/progress";

<Progress
  value={30}
  type="success"
  aria-label="Progress with stops"
  stops={[
    { value: 10, tooltip: "10%", ariaLabel: "Build complete" },
    { value: 20, tooltip: "20%", ariaLabel: "Lint complete" },
    { value: 30, tooltip: "30%", ariaLabel: "Unit tests complete" },
    { value: 40, tooltip: "40%", ariaLabel: "Integration tests complete" },
    { value: 50, tooltip: "50%", ariaLabel: "Deploy ready" },
  ]}
/>;
```

## 宽度

```tsx
import { Progress } from "@/components/ui/progress";

<div className="flex w-full max-w-md flex-col gap-6">
  <Progress value={60} width={100} aria-label="Progress width 100" />
  <Progress value={60} width={200} aria-label="Progress width 200" />
  <Progress value={60} width={300} aria-label="Progress width 300" />
  <Progress value={60} width="50%" aria-label="Progress width 50%" />
  <Progress value={60} width="100%" aria-label="Progress full width" />
</div>;
```

## 高度

```tsx
import { Progress } from "@/components/ui/progress";

<div className="flex w-full max-w-md flex-col gap-6">
  <Progress value={60} height={4} aria-label="Progress height 4" />
  <Progress value={60} height={10} aria-label="Progress height 10" />
  <Progress value={60} height={50} aria-label="Progress height 50" />
  <Progress value={60} height={200} aria-label="Progress height 200" />
</div>;
```

## 标签位置

left

right

top-left

top-center

top-right

bottom-left

bottom-center

bottom-right

```tsx
import { Progress } from "@/components/ui/progress";

<div className="flex w-full max-w-md flex-col gap-8">
  <Progress value={45} label="left" labelPosition="left" aria-label="Label left" />
  <Progress value={45} label="right" labelPosition="right" aria-label="Label right" />
  <Progress value={45} label="top-left" labelPosition="top-left" aria-label="Label top left" />
  <Progress
    value={45}
    label="top-center"
    labelPosition="top-center"
    aria-label="Label top center"
  />
  <Progress value={45} label="top-right" labelPosition="top-right" aria-label="Label top right" />
  <Progress
    value={45}
    label="bottom-left"
    labelPosition="bottom-left"
    aria-label="Label bottom left"
  />
  <Progress
    value={45}
    label="bottom-center"
    labelPosition="bottom-center"
    aria-label="Label bottom center"
  />
  <Progress
    value={45}
    label="bottom-right"
    labelPosition="bottom-right"
    aria-label="Label bottom right"
  />
</div>;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Progress } from "@/components/ui/progress";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">已知进度数值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">indeterminate</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">进度未知时使用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## 最佳实践

- 总量可知的确定性工作：文件上传、多步设置、构建步骤或批量删除。
- 短时不确定等待（~1–3s）用 Spinner；Saving 这类内联文案用 Loading Dots。
- max 用真实上限（max={files.length}），而非硬编码 100。组件按 value / max 计算百分比。
- 进度条配点名工作与单位的文字：Uploading 12 of 30 files。单独的条不说明在推进什么。
