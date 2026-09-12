# 骨架遮罩

> Route: `/components/mask`

在骨架模板与真实界面之间切换一块区域。

[返回组件](#/components)

# 骨架遮罩

—

在骨架模板与真实界面之间切换一块区域。

## 何时使用

- 区块布局已知，只需要在「加载中」与「已就绪」之间整体切换时，用 Mask 包住真实内容并传入 skeleton 模板。
- 需要在一次加载里同时遮住多个元素（表格行 + 工具栏 + 统计块）且它们必须共用同一套切换时机。
- 当真实内容已能渲染但数据还没到、又不想让用户看到半填充状态时，先 mask 住再 unmask。

## 何时不应使用

- 不要用 Mask 代替条件渲染——如果数据未就绪时该区域根本不该占位（例如整页为空），用 EmptyState 或直接不渲染。
- 单个正在进行的操作应使用 Spinner，有明确进度时使用 Progress。
- 不要在没有骨架模板的情况下使用——Mask 的价值在于切换前后盒子一致，缺了模板就退化成闪烁。

## 示例

### 受控切换

用 masked 受控开关在骨架模板与真实界面之间切换。

### 可交互切换

由页面状态驱动 masked，演示真实界面在 unmask 后恢复交互。

## 无障碍

- masked 时容器带 aria-busy="true" 与 label 提供的可访问名称，屏幕阅读器能识别这块区域正在加载。
- 真实内容在遮罩期间保留占位但不进入无障碍树，也不会被 Tab 聚焦（inert + aria-hidden），因此不会出现「点到了看不见的按钮」。
- 只在确实是本次加载结果的那个区域打开 liveRegion，完成时经 aria-live="polite" 播报一次；同页多个遮罩区同时开启会重复播报。
- 所有骨架层都是装饰性的（aria-hidden），真正的语义由底层内容提供。

## 受控行为

- masked 是受控开关：组件永不自行翻转，加载完成与否由调用方（通常是解析数据的 promise）决定。
- defaultMasked 提供非受控初始值；此时没有内部触发源，因此 onMaskedChange 不会产生可观察变化，需要可观察切换请用受控 masked。

## 响应式行为

- Mask 自身不做布局，尺寸完全由 children 与 skeleton 决定；两者形状一致是切换不位移的前提。
- 骨架模板应使用与真实内容相同的响应式尺寸（百分比宽度、grid 列数），而不是写死的像素值。

## 主题行为

- 遮罩层的颜色与动画来自 Skeleton 的主题变量，暗色/亮色模式下自动适配。
- Mask 不引入独立配色，任何品牌化都通过传入的 skeleton 模板完成。

## 实时示例

LR

Lena Roy

Staff engineer · Berlin

```tsx
import { Mask } from "@/components/ui/mask";
import { Skeleton } from "@/components/ui/skeleton";

/** 骨架模板：与真实卡片同构（头像 40px + 两行文本），unmask 时不发生位移。 */
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
        <p className="truncate text-label-14 text-gray-1000">Lena Roy</p>
        <p className="truncate text-copy-13 text-muted-foreground">Staff engineer · Berlin</p>
      </div>
    </div>
  );
}

export function MaskDefault21B111CBExample() {
  return (
    <Mask label="Loading profile" skeleton={<ProfileSkeleton />}>
      <ProfileCard />
    </Mask>
  );
}
```

## 受控切换

Brake Pads Set$5,000.00

Oil Filters$2,000.00

Car Batteries$5,000.00

```tsx
import { Mask } from "@/components/ui/mask";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
          <span className="truncate text-gray-1000">{product}</span>
          <span className="shrink-0 tabular-nums text-muted-foreground">{charge}</span>
        </div>
      ))}
    </div>
  );
}

export function MaskToggle4D5A1E07Example() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col items-start gap-4">
      <Mask
        className="min-w-[320px]"
        label="Loading order lines"
        masked={loading}
        liveRegion
        skeleton={<TableSkeleton />}
      >
        <Table />
      </Mask>
      <Button size="small" onClick={() => setLoading((value) => !value)}>
        {loading ? "Unmask" : "Mask"}
      </Button>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Mask } from "@/components/ui/mask";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">skeleton</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">遮罩态的骨架模板。始终挂载，保证切换前后盒子一致。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">masked</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控遮罩态；组件不会自行翻转。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultMasked</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">非受控初始遮罩态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onMaskedChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(masked: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">非受控遮罩态回调；masked 未传时没有内部触发源。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">遮罩期间播报的可访问名称。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">liveRegion</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">经 aria-live="polite" 宣告完成。仅在该区域是本次加载结果时开启。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">overlay</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">需要自定义遮罩层时替代 skeleton。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 一块区域已有确定布局、且希望用一个开关在骨架与真实内容之间切换时，使用 Mask。
- 让 skeleton 复刻真实区域的形状而不是一个通用色块，unmask 时就不会发生位移。
- 把遮罩状态留在调用方，并由同一个解析数据的 promise 驱动；Mask 不会自行翻转。
- 只在确实是本次加载结果的那个区域打开 liveRegion——否则同页多个遮罩区会重复播报同一次完成。
