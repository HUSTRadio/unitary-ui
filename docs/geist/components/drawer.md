# Drawer

Display content in a separate view from the existing context.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Open" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
> - **Custom height**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Open" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Open" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Custom height**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Open" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default

Only use a Drawer on small viewports. Shown here at any viewport for demonstration.

```tsx
import { Button, Drawer } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={(): void => setOpen(true)}>Open</Button>
      <Drawer onDismiss={(): void => setOpen(false)} show={open}>
        <div className="flex flex-col items-stretch justify-start gap-2 flex-initial p-12">
          <p className="text-[18px] leading-[24px] font-semibold text-center">A drawer title</p>
          <p className="text-copy-14 text-center">Drawer body</p>
        </div>
      </Drawer>
    </>
  );
}
```

## Custom height

```tsx
import { Button, Drawer } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={(): void => setOpen(true)}>Open</Button>
      <Drawer height={200} onDismiss={(): void => setOpen(false)} show={open}>
        <div className="flex flex-col items-stretch justify-start gap-2 flex-initial p-12">
          <p className="text-[18px] leading-[24px] font-semibold text-center">A drawer title</p>
          <p className="text-copy-14 text-center">Drawer body</p>
        </div>
      </Drawer>
    </>
  );
}
```

## Best Practices

### When to use

- Drawer renders as a bottom sheet on small viewports only. On desktop render Modal (or Sheet for lateral context) directly instead of forcing Drawer.

- Don’t use Drawer to confirm destructive actions. The lack of a fully blocking dim weakens the severity signal that delete and revoke flows need; route to Modal.

- A Drawer is good for short focused mobile actions: a single form, a filter sheet, a primary CTA paired with Cancel.

### Behavior

- Tap-outside and swipe-down dismiss by default; preserve both unless the form has dirty input.

- Use verticalScroll so the drawer body scrolls inside its frame instead of the page behind it.

- Cap content height with customHeight only when the default height clips the primary action; the action and Cancel must stay above the fold.

### Content

- DrawerTitle is a Title Case statement that names the entity (Deployment Details, Filter Logs).

- Body is sentence case prose. One primary Verb + Noun button and a literal Cancel; don’t cram a destructive cascade copy into the smaller frame.

- Don’t restate the page heading as the drawer title; name what this view does.

### Accessibility

- Trap focus inside the drawer while open and return focus to the trigger on close.

- Escape closes the drawer; honor the system back gesture on mobile so users can dismiss without reaching for the close affordance.

- Lock body scroll on open and restore it on close so iOS rubber-band scroll doesn’t leak through.

Was this helpful?
