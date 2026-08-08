# Sheet

Display content in a side panel that slides in from the edge of the screen.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Open Sheet" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
> - **With Side**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Open top" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
>   "Open right" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
>   "Open bottom" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
>   "Open left" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Open Sheet" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
> - **With Side**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Open top" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
>   "Open right" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
>   "Open bottom" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
>   "Open left" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default

In combination with styles overrides most commonly used in front apps.

```tsx
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Sheet modal>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent
        noOverlay={false}
        className="m-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] rounded-2xl bg-background-100 p-0 lg:w-[512px] sm:max-w-[auto] flex flex-col"
      >
        <SheetHeader className="p-6 text-left">
          <SheetTitle>Sheet Title</SheetTitle>
          <p className="text-copy-14 text-gray-900">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </SheetHeader>
        <SheetDescription className="px-6 py-4 text-copy-14">
          Eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </SheetDescription>
        <SheetFooter className="p-6 gap-2 flex-row justify-end mt-auto">
          <SheetClose asChild>
            <Button variant="secondary">Close</Button>
          </SheetClose>
          <Button>Next</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
```

## With Side

Use the side prop to control which edge the sheet slides in from.

```tsx
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

const sides = ["top", "right", "bottom", "left"] as const;

export function Component(): JSX.Element {
  return (
    <div className="flex items-center justify-center gap-4">
      {sides.map((side) => (
        <Sheet key={side} modal>
          <SheetTrigger asChild>
            <Button>Open {side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Sheet from {side}</SheetTitle>
              <p className="text-copy-14 text-gray-900">This sheet slides in from the {side}.</p>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
```

## Best Practices

### When to use

- Use Sheet for persistent associated context like deployment details, log row inspection, or a member profile, where the underlying page stays useful.

- For a blocking decision, use Modal. For a mobile-only bottom sheet, use Drawer.

- Don’t use Sheet to confirm destructive actions. The default modal=false keeps the page interactive, which weakens severity for a delete or revoke.

### Behavior

- Sheet defaults to modal=false so toasts and other high-z elements stay reachable. Keep that default unless the sheet owns the screen.

- Pick side from the trigger location: a row inspector slides from right, a global filter from left. Don’t change sides mid-session.

- Outside-click does not auto-close, so always render an explicit close affordance and honor Escape.

### Content

- Title is Title Case and names the entity (Deployment Details, Member Profile), not the page action.

- Body is read-mostly: sentence case prose with Title Case sub-headings. Action buttons are optional; when present, follow Verb + Noun.

- Don’t duplicate the page header inside the sheet; the sheet is the detail layer.

### Accessibility

- Trap focus inside the sheet while it’s open and return focus to the trigger row on close so keyboard users keep their place in the list.

- Provide a visible close button labeled Close (or an icon button with aria-label="Close") since clicking outside doesn’t dismiss.

- Announce the sheet with aria-labelledby pointing at the title; pair it with aria-describedby only when the body is short and load-bearing.

Was this helpful?
