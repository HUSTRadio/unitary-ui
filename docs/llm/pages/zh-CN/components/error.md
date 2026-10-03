# 错误

> Route: `/components/error`

显示加载失败等错误，并说明下一步操作。

[返回组件](#/components)

# 错误

error

显示加载失败等错误，并说明下一步操作。

## 何时使用

- 当一个区块或页面级资源（如面板、仪表盘卡片、路由边界）加载失败时，使用 Error 组件作为块级错误展示。
- 当平台或系统级别的异步请求失败时，需附带稳定的标识符（如请求 ID、部署 ID），让用户或支持人员追踪问题。
- 需要明确告知用户发生了什么问题以及下一步该做什么时使用，先陈述发生了什么，再说明如何解决。

## 何时不应使用

- 不要用于瞬时的操作失败——优先使用 toast.error() 通知，它更适合短暂的操作反馈。
- 不要用于字段级别的表单验证——Input 的 error 属性是字段的正确选择，而非用此块级组件替代。
- 不要在标题中使用泛泛的 Something Went Wrong——应该命名具体失败的资源，例如 Couldn't Load Deployments。

## 示例

### 尺寸

展示 Error 组件的不同尺寸变体，匹配密集布局和全局公告区域的排版需求。

### 自定义标签

演示通过自定义替换默认错误图标的用法，让错误提示与品牌风格保持一致。

### 通过属性传入错误

展示将错误对象直接通过 prop 传递给父组件的方式，在异步请求失败后渲染错误状态。

## 无障碍

- 异步出现的错误区域应包裹在 aria-live="polite" 中，以便屏幕阅读器朗读新的错误状态。
- 阻塞性错误可使用 assertive 模式立即打断用户并告知严重问题。
- 错误图标为装饰性元素，应设置 aria-hidden，真正的语义信息依靠文本传达。

## 受控行为

不适用: Error 是一个展示型组件，不管理自身的交互状态；内容通过 props 传递，由调用方决定何时显示错误以及错误的具体消息和标识符。

## 响应式行为

- Error 组件在全宽容器中渲染，在小屏幕上自动调整内边距和字体大小以适应窄屏。
- 错误标识符（如请求 ID）在窄屏上可能自动截断，同时保留完整值的 title 属性供悬停查看。

## 主题行为

- 不同语义状态的颜色映射（红色表示严重错误，琥珀色表示警告）在暗色/亮色模式下均保持足够的对比度。
- 背景色和边框颜色跟随 Unitary 主题变量，支持全局主题定制。

## 实时示例

**Email Error:**This email address is already in use.

```tsx
import { Error } from "@/components/ui/error";

export function ErrorCustomLabel4BA9290BExample() {
  return <Error label="Email Error">This email address is already in use.</Error>;
}
```

## 无标签

This email address is already in use.

```tsx
import { Error } from "@/components/ui/error";

export function ErrorNoLabelD6728773Example() {
  return <Error label={false}>This email address is already in use.</Error>;
}
```

## 尺寸

This email is in use.

This email is in use.

This email is in use.

```tsx
import { Error } from "@/components/ui/error";

export function ErrorSizes74A3978DExample() {
  return (
    <div className="flex w-full flex-col items-stretch gap-6">
      <Error size="small">This email is in use.</Error>
      <Error>This email is in use.</Error>
      <Error size="large">This email is in use.</Error>
    </div>
  );
}
```

## 带 error 属性

The request failed. [Contact Us](https://example.com/contact)

```tsx
import { Error } from "@/components/ui/error";

export function ErrorWithAnErrorProperty93A4DDA8Example() {
  return (
    <Error
      error={{
        message: "The request failed.",
        action: "Contact Us",
        link: "https://example.com/contact",
      }}
    />
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Error } from "@/components/ui/error";
```

还支持以下类型中定义的属性：`ComponentProps<"div">`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">行内错误内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string | false</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选的强调标签；false 时隐藏。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"small" | "default" | "large"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">错误文字尺寸。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">{ message: string; action?: string; link?: string }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">带可选外部操作的结构化错误。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 区块或页面级资源加载失败时（面板、仪表盘卡片、路由边界）用 Error 组件作为块级表面。
- 瞬态动作失败用 toasts.error()，字段级校验用 Input 的 error prop；不要用本块替代两者。
- 平台或系统错误始终配稳定标识符（request ID、deployment ID、run ID、trace ID）。校验与权限拒绝是用户状态，不需要 ID。
- 先说发生了什么、再说接下来怎么做，顺序如此。去掉道歉式开场（Unfortunately、Oops、We're sorry）。
- 用户状态错误用 Couldn't 或 Can't；系统或基础设施错误用 Failed to。禁用 Unable to。
- 标题不要回退成 Something Went Wrong；点名失败的资源（Couldn't Load Deployments）。
- 取数失败后错误异步出现时，用 aria-live="polite" 包裹区域让其被播报；把 assertive 保留给真正阻塞的错误。
