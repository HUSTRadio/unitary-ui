# 骨架屏

> Route: `/components/skeleton`

加载时显示与内容尺寸匹配的占位形状；SkeletonMask 可遮罩已有内容。

[返回组件](#/components)

# 骨架屏

skeleton

加载时显示与内容尺寸匹配的占位形状；SkeletonMask 可遮罩已有内容。

## 何时使用

- 当异步数据填充已知布局（表格行、卡片网格、个人资料模块、侧边栏）时，展示 Skeleton 作为加载占位符。
- 需要维持最终内容的宽高尺寸以避免布局抖动（CLS），骨架屏能精确匹配实际元素的形状和大小。
- 批量加载多个资源时，用一组骨架屏模拟真实布局，帮助用户感知系统正在处理。
- 布局已知且只需要在「加载中」与「已就绪」之间整体切换时，用同一文档页的 SkeletonMask（框架扩展）包住真实内容并传入骨架模板。

## 何时不应使用

- 单个正在进行的操作应使用 Spinner，有明确进度时使用 Progress，不要用 Skeleton 替代这些组件。
- 不需要在静态页面或无数据的页面上使用——Skeleton 仅在有后续内容要加载时有意义。
- 不要将骨架屏用于非结构化的随机内容——它的价值在于预知布局的形状，否则会产生误导。
- 不要用 SkeletonMask 代替条件渲染——数据未就绪时该区域根本不该占位（例如整页为空）时，用 EmptyState 或直接不渲染。

## 示例

### 固定宽度

展示带有预设宽度的 Skeleton，模拟一行文本占位。

### 盒状高度

展示带有固定高度的骨架区块，模拟图像或卡片容器。

### 包裹子元素

展示 Skeleton 内部包裹实际内容的用法，实现嵌套骨架效果。

### 骨架遮罩（SkeletonMask）

框架扩展：把骨架模板与真实内容一起交给 SkeletonMask，由 masked 决定显示哪一侧，切换前后共用同一个盒子。

### 遮罩的受控切换

由页面状态驱动 masked，演示真实内容在 unmask 后恢复交互。

## 无障碍

- 将加载区域包裹在 aria-busy="true" 中，并在数据就绪后用 aria-live="polite" 通知完成状态。
- 骨架屏本身是装饰性的，不应被屏幕阅读器逐条朗读——由底层内容提供真正的语义信息。
- 对于低功率设备，应尊重 prefers-reduced-motion，减少或禁用流光动画。
- SkeletonMask 在遮罩期间由容器承担 aria-busy 与 label；真实内容以 inert + aria-hidden 保留占位但不进无障碍树、不可 Tab，因此不会点到隐藏控件。它的 liveRegion 默认关闭，只在确实是本次加载结果的那个区域打开，避免同页多个遮罩区重复播报。

## 受控行为

- Skeleton 自身是无交互的纯展示组件，没有状态转换或受控属性；它仅在数据加载中由父组件决定是否渲染。
- SkeletonMask 的 masked 是受控开关，组件永不自行翻转，加载完成与否由调用方（通常是解析数据的 promise）决定。
- SkeletonMask 的 defaultMasked 提供非受控初始值；此时没有内部触发源，onMaskedChange 不会产生可观察变化，需要可观察切换请用受控 masked。

## 响应式行为

- 通过 width、height、className 或 style 让单个 Skeleton 匹配最终内容尺寸。
- Skeleton 不管理列表或网格布局；多列到单列的响应式切换由调用方容器负责。
- SkeletonMask 自身不做布局，尺寸完全由 children 与 skeleton 决定；骨架模板应使用与真实内容相同的响应式尺寸（百分比宽度、grid 列数），而不是写死的像素值。

## 主题行为

- 骨架屏的背景色和 1.4s 流光动画跟随主题变量，在暗色/亮色模式下均有合适的对比度。
- 可通过 CSS 变量覆盖骨架颜色，实现品牌定制或特殊场景下的差异化表现。
- SkeletonMask 的遮罩层颜色与动画同样来自 Skeleton 的主题变量，自身不引入独立配色；任何品牌化都通过传入的 skeleton 模板完成。

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

## 用法

LR

Lena Roy

Staff engineer · Berlin

```tsx
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonMask } from "@/components/ui/skeleton-mask";

/**
 * SkeletonMask 用法：把「骨架模板」和「真实内容」一起交给它，由 masked 决定显示哪一侧。
 * 骨架模板与真实卡片同构（头像 40px + 两行文本），因此 unmask 时不发生任何位移。
 */
function ProfileSkeleton() {
  return (
    <div className="flex w-[280px] items-center gap-3 rounded-[8px] border border-gray-alpha-400 p-3">
      <Skeleton height={40} pill width={40} />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton height={14} width="60%" />
        <Skeleton height={12} width="85%" />
      </div>
    </div>
  );
}

function ProfileCard() {
  return (
    <div className="flex w-[280px] items-center gap-3 rounded-[8px] border border-gray-alpha-400 p-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-alpha-200 text-label-14">
        LR
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-label-14 text-foreground">Lena Roy</p>
        <p className="truncate text-copy-13 text-muted-foreground">Staff engineer · Berlin</p>
      </div>
    </div>
  );
}

export function SkeletonMaskUsage21B111CBExample() {
  // masked 由调用方持有（这里固定为遮罩态，静态展示两侧的对应关系）；
  // 需要可交互的切换见 Controlled toggle 示例。
  return (
    <SkeletonMask label="Loading profile" masked skeleton={<ProfileSkeleton />}>
      <ProfileCard />
    </SkeletonMask>
  );
}
```

## 受控切换

Brake Pads Set$5,000.00

Oil Filters$2,000.00

Car Batteries$5,000.00

```tsx
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonMask } from "@/components/ui/skeleton-mask";
import { useState } from "react";

const ROWS = [
  ["Brake Pads Set", "$5,000.00"],
  ["Oil Filters", "$2,000.00"],
  ["Car Batteries", "$5,000.00"],
] as const;

/** 表格骨架复刻真实列宽，切换时不会横向跳动。 */
function TableSkeleton() {
  return (
    <div className="flex w-[320px] flex-col gap-2">
      {ROWS.map(([product]) => (
        <div key={product} className="flex items-center justify-between gap-4">
          <Skeleton height={14} width="55%" />
          <Skeleton height={14} width={72} />
        </div>
      ))}
    </div>
  );
}

function Table() {
  return (
    <div className="flex w-[320px] flex-col">
      {ROWS.map(([product, charge]) => (
        <div
          key={product}
          className="flex items-center justify-between gap-4 border-b border-gray-alpha-400 py-2 text-copy-14 last:border-0"
        >
          <span className="truncate text-foreground">{product}</span>
          <span className="shrink-0 tabular-nums text-muted-foreground">{charge}</span>
        </div>
      ))}
    </div>
  );
}

export function SkeletonMaskControlledToggle4D5A1E07Example() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col items-start gap-4">
      <SkeletonMask
        className="min-w-[320px]"
        label="Loading order lines"
        masked={loading}
        liveRegion
        skeleton={<TableSkeleton />}
      >
        <Table />
      </SkeletonMask>
      <Button size="small" onClick={() => setLoading((value) => !value)}>
        {loading ? "Unmask" : "Mask"}
      </Button>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Skeleton, SkeletonMask } from "@/components/ui/skeleton";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选的匹配布局占位内容（Skeleton）；遮罩期间保留盒子的真实界面（SkeletonMask）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">skeleton</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">仅 SkeletonMask：遮罩态的骨架模板。始终挂载，保证切换前后盒子一致。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">masked</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">仅 SkeletonMask：受控遮罩态；组件不会自行翻转。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultMasked</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">仅 SkeletonMask：非受控初始遮罩态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onMaskedChange</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(masked: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">仅 SkeletonMask：非受控遮罩态回调；masked 未传时没有内部触发源。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">仅 SkeletonMask：遮罩期间播报的无障碍名称。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">liveRegion</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">仅 SkeletonMask：经 aria-live="polite" 宣告完成。仅在该区域是本次加载结果时开启。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">overlay</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">仅 SkeletonMask：需要自定义遮罩层时替代 skeleton。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 异步数据填充已知布局时显示 Skeleton：表格行、卡片网格、资料块、侧栏。
- 单个进行中的动作用 Spinner；已知进度用 Progress。
- width 与 height 匹配最终内容，让数据解析时布局不位移。
- 用 aria-busy="true" 包裹加载区域，并用 aria-live 播报完成。
- 在低功耗表面尊重 prefers-reduced-motion 处理流光动画。
- SkeletonMask（框架扩展，同一文档页）把一整块区域在骨架模板与真实内容之间切换；让 skeleton 复刻真实区域的形状以便 unmask 时不位移，并把遮罩状态留在调用方。
