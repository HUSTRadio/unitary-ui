# Carousel

> Route: `/components/carousel`

Browses images with swipe gestures, arrow controls, and slide indicators.

[Back to Components](#/components)

# Carousel

carousel

Browses images with swipe gestures, arrow controls, and slide indicators.

## When to use

- Browse product images, article illustrations or a landscape gallery one image at a time.

## When not to use

- Use a grid when users need to compare multiple images simultaneously.

## Examples

### Image gallery

Browse local images using indicators, arrows or horizontal gestures.

### Image transition effects

Choose slide, linear fade, eased fade or a subtle scale, then compare them with controls, keyboard or gestures.

## Accessibility

- Every image requires alt text; the current indicator has aria-current and progress is announced politely.
- Focus the image region to use Left/Right, Home and End; inactive images cannot receive focus.
- Every effect respects prefers-reduced-motion and switches immediately when reduced motion is enabled.

## Controlled behavior

- index is zero-based; omit it to use defaultIndex and internal state. onIndexChange reports control, keyboard and gesture selection.
- loop wraps arrow controls only; gestures stop at the boundary. There is no autoplay.
- variant defaults to slide. fade-linear changes opacity at a constant rate; fade uses ease-in-out; fade-scale adds scaling from 1.04 to 1 to the eased fade.
- Changing the effect retains the current image. Rapid reversals continue from the current opacity and scale; transitions use the shared slower duration token (500ms).

## Responsive behavior

- The image region uses a 16:9 aspect ratio and object-cover. Controls are 44px and wrap when space is limited.

## Theme behavior

- Borders, captions, controls and indicators use theme tokens.

## Live Demo

![Illustration of a coast and distant hills](/gallery-coast.svg)

Coast

![Illustration of desert dunes](/gallery-desert.svg)

Desert

![Illustration of a forest and snowy mountains](/gallery-forest.svg)

Forest

Image 1 of 3

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

## Variants

Transition effect

![Coast and distant hills](/gallery-coast.svg)

![Desert dunes](/gallery-desert.svg)

![Forest and snowy mountains](/gallery-forest.svg)

Image 1 of 3

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

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Carousel } from "@/components/ui/carousel";
```

Also accepts props defined by: `Omit<ComponentProps<"div">, "children" | "onChange">`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">variant</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"slide" | "fade-linear" | "fade" | "fade-scale"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Slide, linear fade, eased fade or eased fade with subtle scaling. All respect reduced motion.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"slide"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">images</code><span class="ml-1 text-destructive">*</span><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">CarouselImage[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Images with src, required alt, optional caption, srcSet and sizes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">index</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled zero-based slide index.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultIndex</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial uncontrolled slide index.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">0</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onIndexChange</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(index: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports selection by controls, keyboard or gestures.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loop</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Wraps previous/next arrow controls at the ends; gestures stop at the boundary.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## Best Practices

- Provide useful alt text for every image and keep a consistent aspect ratio.
- Use deliberate navigation; the gallery never advances automatically.
