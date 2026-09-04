# 滚动容器

> Route: `/components/scroller`

显示内容溢出的项目列表。

[返回组件](#/components)

# 滚动容器

Scroller

显示内容溢出的项目列表。

## 何时使用

- 当需要在单一方向上展示一组同类项目的溢出列表时，例如标签行、日志流或图片平铺。
- 当容器尺寸小于总内容大小时，希望用户通过方向滚动发现被截断的项目。

## 何时不应使用

- 当项目需要在两个维度自由布局时，网格布局更适合这种二维展示。
- 当目的仅为区分内容区块而非提供滚动交互时，应该使用分隔线或间距。

## 示例

### 垂直滚动容器

展示一个基础的纵向滚动示例，容器高度固定时内部长内容自动产生垂直滚动条。

### 水平排列的标签轨道

横向排列一系列标签卡片，适合筛选标签行或平铺内容展示。

## 无障碍

- 滚动区域内的每个子项目拥有独立的语义和可访问名称。
- Tab 键顺序遵循 DOM 顺序，因此应按阅读顺序排列项目，无论滚动方向如何。

## 受控行为

不适用: 滚动容器以被动展示为主，其滚动位置由浏览器原生处理，通常不由父组件显式控制。

## 响应式行为

- 可根据视口宽度调整滚动轴向：宽屏下使用水平滚动展示更多内容，窄屏回退为垂直或无滚动。

## 主题行为

- 支持自定义滚动区域的边框、圆角及暗色主题适配，边缘渐隐遮罩也可通过样式微调。

## 实时示例

```tsx
import { Scroller } from "@/components/ui/scroller";

export function ScrollerVertical727CD3A6Example() {
  return (
    <div className="w-full max-w-2xl">
      <Scroller height={220} overflow="y" width="100%">
        <div className="flex flex-col items-stretch justify-start gap-4" style={{ width: 400 }}>
          <div className="h-64 w-64 bg-gray-1000" />
          <div className="h-64 w-64 bg-gray-1000" />
        </div>
      </Scroller>
    </div>
  );
}
```

## 水平

```tsx
import { Scroller } from "@/components/ui/scroller";

export function ScrollerHorizontal0ABBA441Example() {
  return (
    <div className="w-full max-w-2xl">
      <Scroller height="100%" overflow="x" width="100%">
        <div
          className="flex flex-row items-stretch justify-start gap-4"
          style={{ minWidth: "120%" }}
        >
          <div className="h-64 w-64 bg-gray-1000" />
          <div className="h-64 w-64 bg-gray-1000" />
          <div className="h-64 w-64 bg-gray-1000" />
          <div className="h-64 w-64 bg-gray-1000" />
        </div>
      </Scroller>
    </div>
  );
}
```

## 自由

```tsx
import { Scroller } from "@/components/ui/scroller";

export function ScrollerFreeF411A1FBExample() {
  return (
    <div className="w-full max-w-2xl">
      <Scroller height={220} overflow="both" width="100%">
        <div className="grid grid-flow-col grid-rows-2 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-96 w-96 bg-gray-1000" />
          ))}
        </div>
      </Scroller>
    </div>
  );
}
```

## 垂直布局（带按钮）

```tsx
import { Scroller } from "@/components/ui/scroller";

export function ScrollerVerticalWithButtonsEB1E78D8Example() {
  return (
    <div className="flex max-w-full flex-col gap-4">
      <Scroller childrenContainerClassName="gap-4" height={220} overflow="y" withButtons>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-60 w-96 shrink-0 bg-gray-1000" />
        ))}
      </Scroller>
    </div>
  );
}
```

## 水平布局（带按钮）

```tsx
import { Scroller } from "@/components/ui/scroller";

export function ScrollerHorizontalWithButtons29D25875Example() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Scroller
        childrenContainerClassName="gap-4"
        height="100%"
        overflow="x"
        width="100%"
        withButtons
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-64 w-96 shrink-0 bg-gray-1000" />
        ))}
      </Scroller>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Scroller } from "@/components/ui/scroller";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">overflow</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"x" | "y" | "both"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">滚动轴。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"x"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">height</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number | string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">滚动容器高度。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"100%"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">width</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number | string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">滚动容器宽度。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"100%"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">withButtons</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">显示按直接子元素导航的按钮。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">childrenContainerClassName</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">滚动子元素容器的类名。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 沿单轴溢出的同级项目列表用 Scroller：chip 行、日志流、代码片段、命令面板。
- 堆叠信息流选 vertical，chip 和磁贴轨选 horizontal，内容确实双向滚动时才用 free。
- 在被裁剪轴上显示边缘淡出或阴影提示，让用户看到视口之外还有内容。
- 水平滚动器保持项宽与间距一致；参差不齐的边会破坏吸附节奏，让轨道看起来坏了。
- Tab 顺序跟随 DOM 顺序，所以无论视觉滚动方向如何，都按阅读顺序放置项目。
