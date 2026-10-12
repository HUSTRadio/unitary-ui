# 加载圆点

> Route: `/components/loading-dots`

用三个跳动圆点表示正在保存、加载等操作。

[返回组件](#/components)

# 加载圆点

loading-dots

用三个跳动圆点表示正在保存、加载等操作。

## 何时使用

- 在短文本中嵌入加载提示，例如 Saving + Loading Dots 或 Building + Loading Dots，让用户知道操作正在进行中。
- 不确定等待时长但时间较短的场景，圆点动画比进度条更轻量且不显得过于正式。
- 需要保持周围文本可读性的内联加载指示，而非页面级的全屏遮罩加载效果。

## 何时不应使用

- 对于按钮请使用 loading prop 而非在按钮文字中放入圆点，以保持按钮的可访问性和焦点管理能力。
- 确定性的任务进度应使用 Progress 组件，因为它有已知总量和明确的完成语义；布局占位请使用 Skeleton。
- 不要在动作完成后再添加 Loading Dots——例如 Saved + Loading Dots 是错误的，圆点暗示工作仍在进行中。

## 示例

### 默认加载圆点

基本三种弹跳圆点动画：没有额外文本说明，仅用动画本身传达系统正在处理中，适用于上下文已经明确的场景。

### 带文本的加载圆点

在圆点前面附加具体描述性文本，例如 Saving、Deploying、Uploading 等，让用户即使在等待超过一秒后仍清楚系统正在执行什么操作。

## 无障碍

- 包装 span 设置 aria-live="polite"，让屏幕阅读器在不打断用户的情况下拾取当前正在进行的操作标签。
- 圆点本身是装饰性的——周围的文本承载了核心含义，因此不应给组件本身添加 aria-label。

## 受控行为

不适用: Loading Dots 没有 isLoading prop，挂载后始终渲染动画；调用方通过条件渲染决定何时显示，reduced-motion 偏好会禁用动画。

## 响应式行为

不适用: Loading Dots 作为内联元素，其尺寸跟随当前行的字体大小自然缩放。组件本身不涉及响应式断点或布局切换。

## 主题行为

- 圆点的颜色从主题变量获取，适配明暗主题。
- 启用 prefers-reduced-motion 时，圆点停止动画。

## 实时示例

```tsx
import { LoadingDots } from "@hustradio/unitary-ui";

export function LoadingDotsDefault21B111CBExample() {
  return (
    <div className="flex flex-col items-start justify-between gap-6 flex-initial">
      <LoadingDots size="sm" />
      <LoadingDots size="md" />
      <LoadingDots size="lg" />
    </div>
  );
}
```

## 带加载文字

Loading

```tsx
import { LoadingDots } from "@hustradio/unitary-ui";

export function LoadingDotsWithTextF00F2530Example() {
  return (
    <LoadingDots size="md">
      <p className="text-copy-14 text-muted-foreground">Loading</p>
    </LoadingDots>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { LoadingDots } from "@hustradio/unitary-ui";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">LoadingDotsSize</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">圆点尺寸。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 在文案中嵌入 Loading Dots 表示短时不确定等待，如 Saving<LoadingDots /> 或 Building<LoadingDots />。
- 按钮上用 Button 的 loading prop，而不是往标签里塞圆点。
- 布局占位用 Skeleton；已知进度用 Progress；图标大小、不确定等待用 Spinner。
- 尾部标签针对进行中的工作具体化（Saving、Deploying、Uploading），让超过 ~1s 的等待仍告诉用户发生了什么。
- 不要在已完成动词后接 Loading Dots（Saved<LoadingDots />）；圆点暗示进行中的工作。
- 圆点是装饰性的；含义由周围文本承载，所以不要给组件本身加 aria-label。
- 用 aria-live="polite" 标记包裹 span，让屏幕阅读器捕捉进行中的文案变化。
- 尊重 prefers-reduced-motion，并避免在同一行把 Loading Dots 与另一动画指示器配对。
