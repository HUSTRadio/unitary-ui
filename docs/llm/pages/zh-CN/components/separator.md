# 分隔线

> Route: `/components/separator`

将内容划分为视觉上不同的组。

[返回组件](#/components)

# 分隔线

Separator

将内容划分为视觉上不同的组。

## 何时使用

-   需要在菜单项之间、列表区块或页面布局的不同部分之间添加视觉分割线时。
-   当希望在不增加额外间距的情况下提供清晰的分区感时，分隔线是轻量级方案。

## 何时不应使用

-   如果空白间距或背景面的切换已能充分区分内容区块，则不需要额外添加分隔线。
-   当分隔对于辅助技术具有实际语义含义时，应避免默认装饰性设定。

## 示例

### 水平分隔线

一条横跨容器全宽的横线，适合在垂直堆叠的内容块之间做分割。

### 垂直分隔线

一条竖线填充 Flex 行的可用高度，常用于横向排列项之间的间隔。

## 无障碍

-   默认作为装饰性元素存在（decorative 属性），辅助技术会忽略它。
-   仅在分隔具有语义意义时，应将 decorative 设为 false 并提供可访问名称。

## 受控行为

不适用: 分隔线是一个纯粹的展示型组件，不涉及任何交互状态或内部可变性，无需受控行为。

## 响应式行为

-   水平分隔线自动适应容器全宽；垂直分隔线根据 Flex 子元素的可用高度动态伸缩。

## 主题行为

-   颜色通过 CSS 变量继承主题色，可以在暗色主题中自动获得合适的描边和颜色。

## 实时示例

### 第 1 节

这是第一部分内容。

### 第 2 节

这是第二部分内容。

```tsx
import { Separator } from "@/components/ui/separator";

<div className="space-y-4">
  <div>
    <h3 className="text-label-16">Section 1</h3>
    <p className="text-copy-14 text-gray-900">This is the first section of content.</p>
  </div>
  <Separator />
  <div>
    <h3 className="text-label-16">Section 2</h3>
    <p className="text-copy-14 text-gray-900">This is the second section of content.</p>
  </div>
</div>
```

首页

关于

服务

联系

```tsx
import { Separator } from "@/components/ui/separator";

<div className="flex h-8 items-center space-x-4">
  <p className="text-copy-14 text-gray-1000">Home</p>
  <Separator orientation="vertical" />
  <p className="text-copy-14 text-gray-1000">About</p>
  <Separator orientation="vertical" />
  <p className="text-copy-14 text-gray-1000">Services</p>
  <Separator orientation="vertical" />
  <p className="text-copy-14 text-gray-1000">Contact</p>
</div>
```

#### 水平分隔线

分隔线上方内容

分隔线下方内容

#### 垂直分隔线

左

居中

右

```tsx
import { Separator } from "@/components/ui/separator";

<div className="space-y-8">
  <div>
    <h4 className="mb-2 text-label-14">Horizontal Separators</h4>
    <div className="space-y-2">
      <p className="text-copy-14">Content above separator</p>
      <Separator orientation="horizontal" />
      <p className="text-copy-14">Content below separator</p>
    </div>
  </div>
  <div>
    <h4 className="mb-2 text-label-14">Vertical Separators</h4>
    <div className="flex h-6 items-center space-x-2">
      <span className="text-copy-14">Left</span>
      <Separator orientation="vertical" />
      <span className="text-copy-14">Center</span>
      <Separator orientation="vertical" />
      <span className="text-copy-14">Right</span>
    </div>
  </div>
</div>
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Separator } from "@/components/ui/separator"
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">orientation</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"horizontal" | "vertical"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">视觉分隔线方向。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"horizontal"</td></tr></tbody></table>

## 最佳实践

-   用 Separator 把内容分成视觉上不同的组，如列表区块之间或菜单项之间。
-   水平分隔线横跨容器全宽；垂直分隔线填满 flex 行的可用高度。
-   分隔线默认装饰性（decorative prop），辅助技术忽略它们。仅当分隔语义上有意义时设 decorative={false} 并提供可访问名称。
-   不要过度使用分隔线；用空白或背景表面分组常常足够且更干净。
