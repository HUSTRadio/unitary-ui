# 骨架屏

> Route: `/components/skeleton`

在内容加载期间显示占位结构。

[返回组件](#/components)

# 骨架屏

Skeleton

在内容加载期间显示占位结构。

## 何时使用

- 当异步数据填充已知布局（表格行、卡片网格、个人资料模块、侧边栏）时，展示 Skeleton 作为加载占位符。
- 需要维持最终内容的宽高尺寸以避免布局抖动（CLS），骨架屏能精确匹配实际元素的形状和大小。
- 批量加载多个资源时，用一组骨架屏模拟真实布局，帮助用户感知系统正在处理。

## 何时不应使用

- 单个正在进行的操作应使用 Spinner，有明确进度时使用 Progress，不要用 Skeleton 替代这些组件。
- 不需要在静态页面或无数据的页面上使用——Skeleton 仅在有后续内容要加载时有意义。
- 不要将骨架屏用于非结构化的随机内容——它的价值在于预知布局的形状，否则会产生误导。

## 示例

### 固定宽度

展示带有预设宽度的 Skeleton，模拟一行文本占位。

### 盒状高度

展示带有固定高度的骨架区块，模拟图像或卡片容器。

### 包裹子元素

展示 Skeleton 内部包裹实际内容的用法，实现嵌套骨架效果。

## 无障碍

- 将加载区域包裹在 aria-busy="true" 中，并在数据就绪后用 aria-live="polite" 通知完成状态。
- 骨架屏本身是装饰性的，不应被屏幕阅读器逐条朗读——由底层内容提供真正的语义信息。
- 对于低功率设备，应尊重 prefers-reduced-motion，减少或禁用脉冲动画。

## 受控行为

不适用: Skeleton 是无交互的纯展示组件，没有状态转换或受控属性；它仅在数据加载中由父组件决定是否渲染。

## 响应式行为

- 通过 width、height、className 或 style 让单个 Skeleton 匹配最终内容尺寸。
- Skeleton 不管理列表或网格布局；多列到单列的响应式切换由调用方容器负责。

## 主题行为

- 骨架屏的背景色和脉冲动画跟随主题变量，在暗色/亮色模式下均有合适的对比度。
- 可通过 CSS 变量覆盖骨架颜色，实现品牌定制或特殊场景下的差异化表现。

## 实时示例

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDefaultWithSetWidthD6DD99FEExample() {
  return <Skeleton width={160} />;
}
```

## 默认样式（指定容器高度）

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDefaultWithBoxHeight3D00A453Example() {
  return <Skeleton boxHeight={42} width={160} />;
}
```

## 包裹子内容

```tsx
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonWrappingChildrenC2461A19Example() {
  return (
    <div className="flex flex-col items-start justify-start gap-4 flex-initial">
      <Skeleton>
        <Button typeName="button">Hidden by skeleton</Button>
      </Skeleton>

      <Skeleton show={false}>
        <Button typeName="button">Not hidden by skeleton</Button>
      </Skeleton>
    </div>
  );
}
```

## 包裹固定尺寸的子内容

```tsx
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonWrappingChildrenWithFixedSize94B70C1BExample() {
  return (
    <div className="flex flex-col items-start justify-start gap-4 flex-initial">
      <Skeleton height={100} width="100%">
        {null}
      </Skeleton>

      <Skeleton height={100} width="100%">
        <Button typeName="button">Not hidden by Skeleton</Button>
      </Skeleton>
    </div>
  );
}
```

## 胶囊

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonPill9945C78BExample() {
  return <Skeleton pill width={48} />;
}
```

## 圆角

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonRounded0A62CD80Example() {
  return <Skeleton boxHeight={48} height={48} rounded width={48} />;
}
```

## 直角

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonSquared053B9038Example() {
  return <Skeleton boxHeight={48} height={48} squared width={48} />;
}
```

## 无动画

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonNoAnimation8DF7155EExample() {
  return (
    <Skeleton animated={false} height={100} width="100%">
      {null}
    </Skeleton>
  );
}
```

## 按钮

Without button prop (default):

With button prop (extends animation by 1px):

Multiple buttons loading:

```tsx
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonButton707EAB0CExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-label-14">Without button prop (default):</p>
        <Skeleton height={32} width={120}>
          <Button typeName="button">Loading...</Button>
        </Skeleton>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-label-14">With button prop (extends animation by 1px):</p>
        <Skeleton button height={32} width={120}>
          <Button typeName="button">Loading...</Button>
        </Skeleton>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-label-14">Multiple buttons loading:</p>
        <div className="flex gap-3">
          <Skeleton button>
            <Button typeName="button">Save</Button>
          </Skeleton>
          <Skeleton button>
            <Button type="secondary" typeName="button">
              Cancel
            </Button>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Skeleton } from "@/components/ui/skeleton";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选的匹配布局占位内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 异步数据填充已知布局时显示 Skeleton：表格行、卡片网格、资料块、侧栏。
- 单个进行中的动作用 Spinner；已知进度用 Progress。
- width 与 height 匹配最终内容，让数据解析时布局不位移。
- 在低功耗表面尊重 prefers-reduced-motion 处理脉冲动画。
- 用 aria-busy="true" 包裹加载区域，并用 aria-live 播报完成。
