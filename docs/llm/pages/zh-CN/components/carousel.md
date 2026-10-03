# 图片轮播

> Route: `/components/carousel`

通过滑动手势、方向按钮和指示器浏览图片。

[返回组件](#/components)

# 图片轮播

carousel

通过滑动手势、方向按钮和指示器浏览图片。

## 何时使用

- 商品图片、文章插图或风景图集需要逐张浏览时。

## 何时不应使用

- 用户必须同时比较多张图片时使用网格。

## 示例

### 图片图集

浏览本地图片，使用指示器、按钮或横向手势切换。

### 图片切换效果

选择滑动、线性淡入淡出、缓入缓出或轻微缩放，再使用按钮、键盘或手势翻页比较效果。

## 无障碍

- 每张图片必须提供 alt；当前图片指示器带有 aria-current；进度通过礼貌播报更新。
- 在图片区域聚焦后使用左右方向键、Home 和 End；非当前图片不可聚焦。
- 所有效果尊重 prefers-reduced-motion，启用减少动画时直接切换。

## 受控行为

- index 是零起始索引；省略时使用 defaultIndex 和内部状态；onIndexChange 报告按钮、键盘和手势选择。
- loop 仅使方向按钮在首尾循环；手势会停在边界。没有自动播放。
- variant 默认为 slide；fade-linear 使用匀速透明度过渡，fade 使用 ease-in-out，fade-scale 在缓入缓出中加入 1.04 到 1 的缩放。
- 切换效果不会重置当前图片；快速反向翻页从当前透明度和缩放进度继续，过渡时长使用共享 slower token（500ms）。

## 响应式行为

- 图片区域保持 16:9 并使用 object-cover；控制按钮为 44px，空间不足时换行。

## 主题行为

- 边框、图片说明、按钮和指示器使用主题变量。

## 实时示例

![海岸与远山插画](/gallery-coast.svg)

海岸

![沙漠与沙丘插画](/gallery-desert.svg)

沙漠

![森林与雪山插画](/gallery-forest.svg)

森林

第 1 张图片，共 3 张

```tsx
import { Carousel } from "@/components/ui/carousel";
import { useI18n } from "@/lib/i18n";

export default function CarouselExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  return (
    <Carousel
      className="w-full max-w-2xl"
      images={[
        {
          src: "/gallery-coast.svg",
          alt: zh ? "海岸与远山插画" : "Illustration of a coast and distant hills",
          caption: zh ? "海岸" : "Coast",
        },
        {
          src: "/gallery-desert.svg",
          alt: zh ? "沙漠与沙丘插画" : "Illustration of desert dunes",
          caption: zh ? "沙漠" : "Desert",
        },
        {
          src: "/gallery-forest.svg",
          alt: zh ? "森林与雪山插画" : "Illustration of a forest and snowy mountains",
          caption: zh ? "森林" : "Forest",
        },
      ]}
    />
  );
}
```

## 变体

切换效果

![海岸与远山](/gallery-coast.svg)

![沙漠与沙丘](/gallery-desert.svg)

![森林与雪山](/gallery-forest.svg)

第 1 张图片，共 3 张

```tsx
import { useState } from "react";
import { Carousel, type CarouselVariant } from "@/components/ui/carousel";
import { Select, SelectItem } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";

export default function CarouselVariantsExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  const [variant, setVariant] = useState<CarouselVariant>("fade");
  return (
    <div className="w-full max-w-2xl space-y-4">
      <Select
        label={zh ? "切换效果" : "Transition effect"}
        value={variant}
        onValueChange={(value) => setVariant(value as CarouselVariant)}
      >
        <SelectItem value="slide">{zh ? "滑动" : "Slide"}</SelectItem>
        <SelectItem value="fade-linear">{zh ? "线性淡入淡出" : "Linear fade"}</SelectItem>
        <SelectItem value="fade">{zh ? "缓入缓出" : "Eased fade"}</SelectItem>
        <SelectItem value="fade-scale">{zh ? "淡入淡出与缩放" : "Fade and scale"}</SelectItem>
      </Select>
      <Carousel
        variant={variant}
        images={[
          { src: "/gallery-coast.svg", alt: zh ? "海岸与远山" : "Coast and distant hills" },
          { src: "/gallery-desert.svg", alt: zh ? "沙漠与沙丘" : "Desert dunes" },
          { src: "/gallery-forest.svg", alt: zh ? "森林与雪山" : "Forest and snowy mountains" },
        ]}
      />
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Carousel } from "@/components/ui/carousel";
```

还支持以下类型中定义的属性：`Omit<ComponentProps<"div">, "children" | "onChange">`

### 属性与回调

本表 API 均为 Unitary 扩展。

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">variant</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"slide" | "fade-linear" | "fade" | "fade-scale"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">滑动、线性淡入淡出、缓入缓出或缓入缓出加轻微缩放；均支持减少动画。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"slide"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">images</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">CarouselImage[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">图片列表：src、必填 alt，以及可选 caption、srcSet 和 sizes。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">index</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控的零起始图片索引。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultIndex</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">非受控模式的初始图片索引。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">0</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onIndexChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(index: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">报告按钮、键盘或手势选择的新索引。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loop</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">方向按钮在首尾循环；手势到达边界后停止。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## 最佳实践

- 为每张图片提供有意义的 alt，并保持一致的宽高比。
- 使用主动翻页；轮播不会自动切换。
