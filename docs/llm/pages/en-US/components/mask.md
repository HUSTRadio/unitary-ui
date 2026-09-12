# Mask

> Route: `/components/mask`

Switches a region between its skeleton template and the real interface.

[Back to Components](#/components)

# Mask

—

Switches a region between its skeleton template and the real interface.

## When to use

- Use Mask when the region's layout is known and you only need to switch the whole block between loading and ready.
- When one load must cover several elements at once (table rows plus a toolbar plus a stat block) and they have to share a single switch.
- When the real content can already render but the data has not arrived, and half-filled UI would be worse than a skeleton.

## When not to use

- Do not use Mask as a substitute for conditional rendering—if the region should not occupy space while loading (an empty page, for instance), use EmptyState or render nothing.
- For a single in-flight action, use Spinner; for known progress, use Progress.
- Do not use Mask without a skeleton template—its value is keeping one box across the swap, and without the template it degrades into a flash.

## Examples

### Controlled switch

Drives the swap between skeleton template and real interface with the controlled masked flag.

### Interactive switch

Page state drives masked, showing the real interface regain interactivity after unmasking.

## Accessibility

- While masked, the container carries aria-busy="true" and the accessible name from label, so assistive technology can identify the region as loading.
- The real content keeps its box but leaves the accessibility tree and cannot be focused while masked (inert plus aria-hidden), so a click can never land on an invisible control.
- Enable liveRegion only on the region the load result belongs to; several masked regions announcing at once would repeat the same completion.
- Every skeleton layer is decorative (aria-hidden); the real semantics come from the underlying content.

## Controlled behavior

- masked is a controlled flag: the component never flips it on its own, so the caller—typically the promise that resolves the data—decides when loading ends.
- defaultMasked sets the initial value for uncontrolled use; there is no internal trigger in that mode, so onMaskedChange has nothing observable to fire from. Use controlled masked when the transition must be observable.

## Responsive behavior

- Mask owns no layout: dimensions come entirely from children and skeleton, and matching their shapes is what keeps the swap from shifting.
- Author the skeleton template with the same responsive sizing as the real content (percentage widths, matching grid columns) rather than fixed pixels.

## Theme behavior

- The overlay's color and animation come from Skeleton's theme variables and adapt to dark and light modes automatically.
- Mask introduces no palette of its own; any branding happens inside the skeleton template you pass in.

## Live Demo

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

## Controlled toggle

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

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Mask } from "@/components/ui/mask";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">skeleton</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Skeleton template for the masked state. Always mounted so the swap keeps one box.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">masked</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled masked state; the component never flips it on its own.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultMasked</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial masked state for uncontrolled use.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onMaskedChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(masked: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Uncontrolled masked-state callback; there is no internal trigger while masked is unset.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Accessible name announced while the region is masked.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">liveRegion</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Announces completion through aria-live="polite". Enable only for the region the load result belongs to.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">overlay</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Replaces skeleton as the masked overlay when a bespoke layer is needed.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Mask when a region already has a known layout and you want one switch to swap it between skeleton and real content.
- Give skeleton the shape of the real region instead of a generic block, so unmasking does not move anything.
- Keep the mask state in the caller and drive it from the same promise that resolves the data; Mask never flips itself.
- Turn liveRegion on only for the region the load result belongs to—a page with several masked regions would otherwise announce the same completion repeatedly.
