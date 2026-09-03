# Skeleton

> Route: `/components/skeleton`

Displays a placeholder while content is loading.

[Back to Components](#/components)

# Skeleton

Skeleton

Displays a placeholder while content is loading.

## When to use

- Show a Skeleton when async data fills a known layout: table rows, card grids, profile blocks, sidebars—preserving the eventual content's shape.
- Set width and height to match the final content so the layout does not shift when data resolves, preventing Cumulative Layout Shift (CLS).
- When loading multiple resources in batch, use a set of skeletons to simulate the real layout so users sense the system is processing.

## When not to use

- For a single in-flight action, use Spinner; for known progress, use Progress. Do not substitute Skeleton for these purpose-built indicators.
- Do not use Skeletons on static pages or empty states—Skeleton only makes sense when there is subsequent content to load.
- Do not use skeleton placeholders for unstructured or unpredictable content—its value lies in pre-knowing the layout's shape; otherwise it misleads.

## Examples

### Fixed width

Demonstrates a Skeleton with a preset width, simulating a text-line placeholder.

### Box height

Demonstrates a Skeleton block with a fixed height, simulating an image or card container.

### Wrapping children

Demonstrates nesting actual children inside a Skeleton for composite skeleton effects.

## Accessibility

- Wrap the loading region in aria-busy="true" and announce completion with aria-live="polite" on the destination container once data resolves.
- Skeleton elements themselves are decorative and should not be read aloud by screen readers—the underlying content carries the real semantic meaning.
- Respect prefers-reduced-motion on low-power devices to reduce or disable the pulse animation.

## Controlled behavior

Not applicable: Skeleton is a passive display component with no interactive state or controlled properties; its rendering is driven solely by the parent component's loading state.

## Responsive behavior

- Use width, height, className, or style to make each Skeleton match the final content dimensions.
- Skeleton does not manage list or grid layout; the caller owns any responsive multi-column-to-single-column transition.

## Theme behavior

- Skeleton background color and pulse animation follow theme variables, providing appropriate contrast in both dark and light modes.
- Skeleton colors can be overridden via CSS variables for brand customization or special-scenario differentiation.

## Live Demo

```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton width={160} />;
```

```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton boxHeight={42} width={160} />;
```

```tsx
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

<div className="flex flex-col items-start justify-start gap-4 flex-initial">
  <Skeleton>
    <Button typeName="button">Hidden by skeleton</Button>
  </Skeleton>

  <Skeleton show={false}>
    <Button typeName="button">Not hidden by skeleton</Button>
  </Skeleton>
</div>;
```

```tsx
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

<div className="flex flex-col items-start justify-start gap-4 flex-initial">
  <Skeleton height={100} width="100%">
    {null}
  </Skeleton>

  <Skeleton height={100} width="100%">
    <Button typeName="button">Not hidden by Skeleton</Button>
  </Skeleton>
</div>;
```

```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton pill width={48} />;
```

```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton boxHeight={48} height={48} rounded width={48} />;
```

```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton boxHeight={48} height={48} squared width={48} />;
```

```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton animated={false} height={100} width="100%">
  {null}
</Skeleton>;
```

Without button prop (default):

With button prop (extends animation by 1px):

Multiple buttons loading:

```tsx
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
</div>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Skeleton } from "@/components/ui/skeleton";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional layout-matching placeholder content.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Show a Skeleton when async data fills a known layout: table rows, card grids, profile blocks, sidebars.
- For a single in-flight action, use Spinner; for known progress, use Progress.
- Set width and height to match the final content so the layout doesn’t shift when data resolves.
- Wrap the loading region in aria-busy="true" and announce completion with aria-live="polite" on the destination container.
- Respect prefers-reduced-motion for the pulse animation on low-power surfaces.
