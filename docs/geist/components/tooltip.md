# Tooltip

A floating label that appears on hover or focus to provide additional context about an element.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **No delay**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Box align**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Custom content**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Custom type**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Components**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Bottom" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
> - **Other**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **No delay**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Box align**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Custom content**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Custom type**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Components**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Bottom" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Other**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Tooltip } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex relative min-w-px max-w-full flex-row flex-wrap flex-1">
      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip text="The Evil Rabbit Jumped over the Fence">
          <span>Top</span>
        </Tooltip>
      </div>

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
          <span>Bottom</span>
        </Tooltip>
      </div>

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
          <span>Left</span>
        </Tooltip>
      </div>

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
          <span>Right</span>
        </Tooltip>
      </div>
    </div>
  );
}
```

## No delay

```tsx
import { Tooltip } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex relative min-w-px max-w-full flex-row flex-wrap flex-1">
      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip delay={false} text="The Evil Rabbit Jumped over the Fence">
          <span>Top</span>
        </Tooltip>
      </div>

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip delay={false} position="bottom" text="The Evil Rabbit Jumped over the Fence">
          <span>Bottom</span>
        </Tooltip>
      </div>

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip delay={false} position="left" text="The Evil Rabbit Jumped over the Fence">
          <span>Left</span>
        </Tooltip>
      </div>

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip delay={false} position="right" text="The Evil Rabbit Jumped over the Fence">
          <span>Right</span>
        </Tooltip>
      </div>
    </div>
  );
}
```

## Box align

```tsx
import { Tooltip } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <>
      <div className="flex relative min-w-px max-w-full flex-row flex-wrap flex-1">
        <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
          <Tooltip boxAlign="left" position="bottom" text="The Evil Rabbit Jumped over the Fence">
            <span>Bottom/Left</span>
          </Tooltip>
        </div>

        <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
          <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
            <span>Bottom/Center</span>
          </Tooltip>
        </div>

        <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
          <Tooltip boxAlign="right" position="bottom" text="The Evil Rabbit Jumped over the Fence">
            <span>Bottom/Right</span>
          </Tooltip>
        </div>
      </div>

      <div className="flex relative min-w-px max-w-full flex-row flex-wrap flex-1">
        <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
          <Tooltip boxAlign="left" position="left" text="The Evil Rabbit Jumped over the Fence">
            <span>Left/Left</span>
          </Tooltip>
        </div>

        <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
          <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
            <span>Left/Center</span>
          </Tooltip>
        </div>

        <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
          <Tooltip boxAlign="right" position="left" text="The Evil Rabbit Jumped over the Fence">
            <span>Left/Right</span>
          </Tooltip>
        </div>
      </div>

      <div className="flex relative min-w-px max-w-full flex-row flex-wrap flex-1">
        <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
          <Tooltip boxAlign="left" position="right" text="The Evil Rabbit Jumped over the Fence">
            <span>Right/Left</span>
          </Tooltip>
        </div>

        <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
          <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
            <span>Right/Center</span>
          </Tooltip>
        </div>

        <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
          <Tooltip boxAlign="right" position="right" text="The Evil Rabbit Jumped over the Fence">
            <span>Right/Right</span>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
```

## Custom content

```tsx
import { Tooltip } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex relative min-w-px max-w-full flex-row flex-wrap flex-1">
      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
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

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
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

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
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

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
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
    </div>
  );
}
```

## Custom type

```tsx
import { Tooltip } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex relative min-w-px max-w-full flex-row flex-wrap flex-1">
      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip text="The Evil Rabbit Jumped over the Fence" type="success">
          <span>Top</span>
        </Tooltip>
      </div>

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence" type="error">
          <span>Bottom</span>
        </Tooltip>
      </div>

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence" type="warning">
          <span>Left</span>
        </Tooltip>
      </div>

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence" type="violet">
          <span>Right</span>
        </Tooltip>
      </div>
    </div>
  );
}
```

## Components

```tsx
import { Badge, Button, Spinner, Tooltip, Kbd } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex relative min-w-px max-w-full flex-row flex-wrap flex-1">
      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
          <Button size="small">Bottom</Button>
        </Tooltip>
      </div>

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
          <Badge size="sm">LEFT</Badge>
        </Tooltip>
      </div>

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
          <Spinner />
        </Tooltip>
      </div>

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
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
    </div>
  );
}
```

## Other

```tsx
import { Tooltip } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex relative min-w-px max-w-full flex-row flex-wrap flex-1">
      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip text="The Evil Rabbit Jumped over the Fence" tip={false}>
          No tip indicator
        </Tooltip>
      </div>

      <div className="flex relative min-w-px max-w-full flex-col justify-center items-center flex-1">
        <Tooltip center={false} text="The Evil Rabbit Jumped over the Fence multiple times.">
          No center text
        </Tooltip>
      </div>
    </div>
  );
}
```

## Best Practices

### When to use

- Use a Tooltip to explain why something exists, not what it is. The visible label names the thing; the tooltip adds the constraint, scope, or limit.

- For an entity preview with metadata rows (avatar, identifier, 2–4 facts, optional action), use Context Card. For long-form content or actions that need persistence, route to a Drawer or page navigation.

- Use lifecycle Tooltips (Alpha, Experimental, Beta, Early Access) to name the limits that apply: API stability, SLA, support, pricing, retention.

### Behavior

- Tooltips open on hover and on keyboard focus. Keep the default ~150ms entry delay so the tooltip doesn’t flicker on a sweeping mouse.

- Don’t wrap a labelled Input in a Tooltip. The trigger lands on the <label>, not the field, and the tooltip text becomes a second invisible label for screen readers. Put help on a sibling icon button.

- Keep primary actions outside the Tooltip; touch users can’t reach a hover-revealed control.

### Content

- One sentence or fragment in text. Sentence case, no period for a single fragment.

- Skip tooltips that repeat the visible label (text="Rate Limit" on a Rate Limit button) or describe the interaction (text="Click to override").

- Lifecycle Tooltips follow {Label}: {one-line meaning}. {Specific limit}. For a paid Beta feature, combine the lifecycle and pricing in one Tooltip rather than stacking two badges.

### Accessibility

- An icon-only trigger needs an aria-label that names the action; the Tooltip body adds context, it doesn’t replace the label.

- Escape closes the tooltip and returns focus to the trigger.

Was this helpful?
