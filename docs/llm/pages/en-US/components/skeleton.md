# Skeleton

> Route: `/components/skeleton`

Displays a placeholder while content is loading.

[Back to Components](#/components)

# Skeleton

skeleton

Displays a placeholder while content is loading.

## When to use

- Show a Skeleton when async data fills a known layout: table rows, card grids, profile blocks, sidebars—preserving the eventual content's shape.
- Set width and height to match the final content so the layout does not shift when data resolves, preventing Cumulative Layout Shift (CLS).
- When loading multiple resources in batch, use a set of skeletons to simulate the real layout so users sense the system is processing.
- When the layout is known and you only need to switch the whole block between loading and ready, wrap the real content in SkeletonMask (framework extension, same page) with a matching skeleton template.

## When not to use

- For a single in-flight action, use Spinner; for known progress, use Progress. Do not substitute Skeleton for these purpose-built indicators.
- Do not use Skeletons on static pages or empty states—Skeleton only makes sense when there is subsequent content to load.
- Do not use skeleton placeholders for unstructured or unpredictable content—its value lies in pre-knowing the layout's shape; otherwise it misleads.
- Do not use SkeletonMask as a substitute for conditional rendering—if the region should not occupy space while loading (an empty page, for instance), use EmptyState or render nothing.

## Examples

### Fixed width

Demonstrates a Skeleton with a preset width, simulating a text-line placeholder.

### Box height

Demonstrates a Skeleton block with a fixed height, simulating an image or card container.

### Wrapping children

Demonstrates nesting actual children inside a Skeleton for composite skeleton effects.

### Skeleton mask (SkeletonMask)

Framework extension: hand SkeletonMask both the skeleton template and the real content, and masked decides which side shows while the swap keeps one box.

### Controlled mask toggle

Page state drives masked, showing the real content regain interactivity after unmasking.

## Accessibility

- Wrap the loading region in aria-busy="true" and announce completion with aria-live="polite" on the destination container once data resolves.
- Skeleton elements themselves are decorative and should not be read aloud by screen readers—the underlying content carries the real semantic meaning.
- Respect prefers-reduced-motion on low-power devices to reduce or disable the shimmer animation.
- While masked, SkeletonMask puts aria-busy and label on the container; the real content keeps its box but is inert and aria-hidden, so it stays out of the accessibility tree and cannot be tabbed into. Its liveRegion is off by default and belongs only on the region the load result is for.

## Controlled behavior

- Skeleton itself is a passive display component with no interactive state or controlled properties; its rendering is driven solely by the parent component's loading state.
- SkeletonMask's masked is a controlled flag: the component never flips it on its own, so the caller—typically the promise that resolves the data—decides when loading ends.
- defaultMasked sets an uncontrolled initial value; there is no internal trigger in that mode, so onMaskedChange has nothing observable to fire from. Use controlled masked when the transition must be observable.

## Responsive behavior

- Use width, height, className, or style to make each Skeleton match the final content dimensions.
- Skeleton does not manage list or grid layout; the caller owns any responsive multi-column-to-single-column transition.
- SkeletonMask owns no layout: dimensions come entirely from children and skeleton, so author the skeleton template with the same responsive sizing as the real content (percentage widths, matching grid columns) rather than fixed pixels.

## Theme behavior

- Skeleton background color and its 1.4s shimmer animation follow theme variables, providing appropriate contrast in both dark and light modes.
- Skeleton colors can be overridden via CSS variables for brand customization or special-scenario differentiation.
- SkeletonMask's overlay takes its color and animation from the same Skeleton theme variables and introduces no palette of its own; branding happens inside the skeleton template you pass in.

## Live Demo

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDefaultWithSetWidthD6DD99FEExample() {
  return <Skeleton width={160} />;
}
```

## Default with box height

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDefaultWithBoxHeight3D00A453Example() {
  return <Skeleton boxHeight={42} width={160} />;
}
```

## Wrapping children

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

## Wrapping children with fixed size

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

## Pill

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonPill9945C78BExample() {
  return <Skeleton pill width={48} />;
}
```

## Rounded

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonRounded0A62CD80Example() {
  return <Skeleton boxHeight={48} height={48} rounded width={48} />;
}
```

## Squared

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonSquared053B9038Example() {
  return <Skeleton boxHeight={48} height={48} squared width={48} />;
}
```

## No animation

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

## Button

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

## Usage

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

## Controlled toggle

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

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Skeleton, SkeletonMask } from "@/components/ui/skeleton";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional layout-matching placeholder content (Skeleton); the real interface, kept as a box while masked (SkeletonMask).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">skeleton</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">SkeletonMask only: skeleton template for the masked state. Always mounted so the swap keeps one box.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">masked</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">SkeletonMask only: controlled masked state; the component never flips it on its own.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultMasked</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">SkeletonMask only: initial masked state for uncontrolled use.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onMaskedChange</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(masked: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">SkeletonMask only: uncontrolled masked-state callback; there is no internal trigger while masked is unset.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">SkeletonMask only: accessible name announced while the region is masked.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">liveRegion</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">SkeletonMask only: announces completion through aria-live="polite". Enable only for the region the load result belongs to.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">overlay</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">SkeletonMask only: replaces skeleton as the masked overlay when a bespoke layer is needed.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Show a Skeleton when async data fills a known layout: table rows, card grids, profile blocks, sidebars.
- For a single in-flight action, use Spinner; for known progress, use Progress.
- Set width and height to match the final content so the layout doesn’t shift when data resolves.
- Wrap the loading region in aria-busy="true" and announce completion with aria-live="polite" on the destination container.
- SkeletonMask (framework extension, same page) swaps a whole region between its skeleton template and the real content; give skeleton the shape of the real region so unmasking moves nothing, and keep the mask state in the caller.
- Respect prefers-reduced-motion for the shimmer animation on low-power surfaces.
