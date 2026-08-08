# Context Card

A floating card that appears on hover or focus. Capable of showing more complex UI than a tooltip.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Alignment**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Start" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
>   "Center" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
>   "End" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
> - **Render prop**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Default wrapper" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
>   "Rendered as a link" · .text-blue-700 · h:24px · 400 16px/24px · fg:#0072f5
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Alignment**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Start" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
>   "Center" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
>   "End" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Render prop**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Default wrapper" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
>   "Rendered as a link" · .text-blue-700 · h:24px · 400 16px/24px · fg:#0072f5

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { ContextCardTrigger } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-stretch justify-around flex-initial">
      <div className="flex flex-col items-center justify-center flex-initial">
        <ContextCardTrigger content="The Evil Rabbit Jumped over the Fence" side="top">
          <span>Top</span>
        </ContextCardTrigger>
      </div>
      <div className="flex flex-col items-center justify-center flex-initial">
        <ContextCardTrigger content="The Evil Rabbit Jumped over the Fence" side="bottom">
          <span>Bottom</span>
        </ContextCardTrigger>
      </div>
      <div className="flex flex-col items-center justify-center flex-initial">
        <ContextCardTrigger content="The Evil Rabbit Jumped over the Fence" side="left">
          <span>Left</span>
        </ContextCardTrigger>
      </div>
      <div className="flex flex-col items-center justify-center flex-initial">
        <ContextCardTrigger content="The Evil Rabbit Jumped over the Fence" side="right">
          <span>Right</span>
        </ContextCardTrigger>
      </div>
    </div>
  );
}
```

## Alignment

Use align to position the card at the start, center, or end of the trigger.

```tsx
import { ContextCardTrigger, Button } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex gap-4 items-center justify-center">
      <ContextCardTrigger
        align="start"
        content="Start alignment positions the card at the beginning edge."
        side="bottom"
      >
        <Button>Start</Button>
      </ContextCardTrigger>
      <ContextCardTrigger
        align="center"
        content="Center alignment positions the card in the middle."
        side="bottom"
      >
        <Button>Center</Button>
      </ContextCardTrigger>
      <ContextCardTrigger
        align="end"
        content="End alignment positions the card at the ending edge."
        side="bottom"
      >
        <Button>End</Button>
      </ContextCardTrigger>
    </div>
  );
}
```

## Render prop

Use render to set the trigger as a custom element, such as a link, button, or badge. By default, it renders a <div>.

```tsx
import { ContextCardTrigger, Button } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex items-center gap-8">
      <ContextCardTrigger
        content="Default: the trigger renders its own <div> around the children."
        side="top"
      >
        <Button>Default wrapper</Button>
      </ContextCardTrigger>
      <ContextCardTrigger
        content="render: trigger behavior is merged onto your element. In this case a semantic <a>."
        render={
          <a
            className="text-blue-700 underline underline-offset-2"
            href="https://vercel.com"
            rel="noreferrer"
            target="_blank"
          />
        }
        side="top"
      >
        Rendered as a link
      </ContextCardTrigger>
    </div>
  );
}
```

## Best Practices

### When to use

- Use Context Card to reveal entity metadata on hover or focus: a user, a deployment, a project, an API key. The trigger is usually a name link or avatar in dense data.

- For a one-line "why" without metadata rows, use Tooltip. For long-form content, edit forms, or persistent navigation, route to a Drawer or a detail page.

- Don’t use Context Card to surface destructive actions; the panel can dismiss on cursor exit before the user commits.

### Behavior

- Context Card opens on hover and keyboard focus and closes on cursor exit or blur. Preserve the ~150ms entry delay so it doesn’t flash on a fast mouse sweep.

- Cap interactive content at one primary action (View Project, Open Settings). More than one CTA reads as a menu and belongs in Menu.

- Don’t nest a Context Card inside a Tooltip or another Context Card; the second layer steals focus and traps keyboard users.

### Content

- Lead with the entity name as a Title Case heading and one identifying line in sentence case underneath (team slug, owner, deployment URL).

- Follow with 2–4 metadata rows of Label: value. Keys are Title Case noun phrases (Last Active, Created, Plan); values follow the same formatting rules as table cells. Use the em-dash character — for unknown values, never N/A or null.

- Don’t restate what the trigger already showed. If the row already renders the deployment URL, don’t repeat it as the first card line.

### Accessibility

- The trigger keeps its own accessible name; the card is supplementary and shouldn’t replace it.

- Card content is reachable by keyboard once the trigger has focus; Escape closes the card and returns focus to the trigger.

Was this helpful?
