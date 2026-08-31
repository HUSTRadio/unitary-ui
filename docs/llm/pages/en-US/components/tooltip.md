# Tooltip

> Route: `/components/tooltip`

A floating label that appears on hover or focus.

[Back to Components](#/components)

# Tooltip

Tooltip

A floating label that appears on hover or focus.

## When to use

- To explain why something exists, not what it is: the visible label names the thing; the tooltip adds the constraint, scope, or limit.
- When icon-only triggers or compact UI elements need extra context without expanding the visible interface.

## When not to use

- Don't wrap a labelled Input in a Tooltip. The trigger lands on the <label>, making the tooltip text a second invisible label for screen readers. Put help on a sibling icon button instead.
- Don't put primary actions inside the Tooltip; touch users can't reach a hover-revealed control. Keep actions in the visible UI.

## Examples

### No delay

Demonstrates removing the ~150ms entry delay so the Tooltip responds to hover instantly.

### Alignment

Shows how to arrange the Tooltip relative to its trigger (box align) and keeps it within viewport bounds.

### Custom content

Renders rich text or other React components inside the Tooltip, going beyond plain text.

## Accessibility

- Tooltips open on hover and on keyboard focus. Keep the default ~150ms entry delay so the tooltip doesn't flicker on a sweeping mouse.
- Escape closes the tooltip and returns focus to the trigger; icon-only triggers need an aria-label that names the action.

## Controlled behavior

- Tooltip supports controlled mode: manage show/hide timing precisely through open state and onChange.
- You can pass a custom trigger element to customize the mount point and interaction behavior of the Tooltip.

## Responsive behavior

Not applicable: The Tooltip's popout position and size do not depend on viewport breakpoints; it always anchors to its trigger and flips direction automatically when exceeding viewport bounds.

## Theme behavior

- Tooltip background and text color follow the global theme, supporting light/dark mode; highlight type can be overridden via the type prop.

## Live Demo

## No delay

Top

Bottom

Left

Right

```tsx
import { Tooltip } from "@/components/ui/tooltip";

<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip delay={false} text="The Evil Rabbit Jumped over the Fence">
      <span>Top</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip delay={false} position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <span>Bottom</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip delay={false} position="left" text="The Evil Rabbit Jumped over the Fence">
      <span>Left</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip delay={false} position="right" text="The Evil Rabbit Jumped over the Fence">
      <span>Right</span>
    </Tooltip>
  </div>
</div>;
```

## Box align

Bottom/Left

Bottom/Center

Bottom/Right

Left/Left

Left/Center

Left/Right

Right/Left

Right/Center

Right/Right

```tsx
import { Tooltip } from "@/components/ui/tooltip";

<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip boxAlign="left" position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <span>Bottom/Left</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <span>Bottom/Center</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip boxAlign="right" position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <span>Bottom/Right</span>
    </Tooltip>
  </div>
</div>
<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip boxAlign="left" position="left" text="The Evil Rabbit Jumped over the Fence">
      <span>Left/Left</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
      <span>Left/Center</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip boxAlign="right" position="left" text="The Evil Rabbit Jumped over the Fence">
      <span>Left/Right</span>
    </Tooltip>
  </div>
</div>
<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip boxAlign="left" position="right" text="The Evil Rabbit Jumped over the Fence">
      <span>Right/Left</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
      <span>Right/Center</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip boxAlign="right" position="right" text="The Evil Rabbit Jumped over the Fence">
      <span>Right/Right</span>
    </Tooltip>
  </div>
</div>
```

## Custom content

Top

Bottom

Left

Right

```tsx
import { Tooltip } from "@/components/ui/tooltip";

<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip
      text={
        <>
          The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
        </>
      }
    >
      <span>Top</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip
      position="bottom"
      text={
        <>
          The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
        </>
      }
    >
      <span>Bottom</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip
      position="left"
      text={
        <>
          The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
        </>
      }
    >
      <span>Left</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip
      position="right"
      text={
        <>
          The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
        </>
      }
    >
      <span>Right</span>
    </Tooltip>
  </div>
</div>;
```

## Custom type

Top

Bottom

Left

Right

```tsx
import { Tooltip } from "@/components/ui/tooltip";

<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip text="The Evil Rabbit Jumped over the Fence" type="success">
      <span>Top</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence" type="error">
      <span>Bottom</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence" type="warning">
      <span>Left</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence" type="violet">
      <span>Right</span>
    </Tooltip>
  </div>
</div>;
```

## Components

LEFT

Loading...

Shortcut

```tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/keyboard-input";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";

<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <Button size="small" typeName="button">
        Bottom
      </Button>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
      <Badge size="sm">LEFT</Badge>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
      <Spinner />
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip
      text={
        <>
          Search
          <Kbd>/</Kbd>
        </>
      }
    >
      <span>Shortcut</span>
    </Tooltip>
  </div>
</div>;
```

## Other

No tip indicator

No center text

```tsx
import { Tooltip } from "@/components/ui/tooltip";

<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip text="The Evil Rabbit Jumped over the Fence" tip={false}>
      No tip indicator
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip center={false} text="The Evil Rabbit Jumped over the Fence multiple times.">
      No center text
    </Tooltip>
  </div>
</div>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Tooltip } from "@/components/ui/tooltip";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Tooltip trigger.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">text</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Supplemental explanation.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">position</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"top" | "bottom" | "left" | "right"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Preferred placement.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"top"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">boxAlign</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"left" | "center" | "right"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Tooltip alignment.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"center"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">delay</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean | number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Whether to delay opening or a custom delay in milliseconds.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">tip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows the arrow tip.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">center</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Centers tooltip text.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">TooltipType</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Semantic tooltip color.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr></tbody></table>

## Best Practices

- Use a Tooltip to explain why something exists, not what it is. The visible label names the thing; the tooltip adds the constraint, scope, or limit.
- Tooltips open on hover and on keyboard focus. Keep the default ~150ms entry delay so the tooltip doesn’t flicker on a sweeping mouse.
- Don’t wrap a labelled Input in a Tooltip. The trigger lands on the <label>, not the field, and the tooltip text becomes a second invisible label for screen readers. Put help on a sibling icon button.
- Keep primary actions outside the Tooltip; touch users can’t reach a hover-revealed control.
- One sentence or fragment in text. Sentence case, no period for a single fragment.
- Skip tooltips that repeat the visible label (text="Rate Limit" on a Rate Limit button) or describe the interaction (text="Click to override").
- An icon-only trigger needs an aria-label that names the action; the Tooltip body adds context, it doesn’t replace the label.
- Escape closes the tooltip and returns focus to the trigger.
