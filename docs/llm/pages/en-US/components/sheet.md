# Sheet

> Route: `/components/sheet`

Displays content in a side panel that slides in from the edge of the screen.

[Back to Components](#/components)

# Sheet

Sheet

Displays content in a side panel that slides in from the edge of the screen.

## When to use

- When presenting persistent associated context (deployment details, member profiles) while keeping the underlying page interactive.
- When a side panel with explicit open and close affordances feels more natural than a center-modal dialog.

## When not to use

- When a fully blocking decision overlay is required; use Modal for blocking interactions.
- When confirming destructive actions; the default interactive page underneath weakens the severity signal.

## Examples

### Default sheet panel

A panel sliding in from the right with a title area, body content region, and a close button.

### Sheet positioned on different edges

Variants showing the sheet sliding from the left or the right, matching the trigger's location on the page.

## Accessibility

- Focus is trapped inside the panel while open; pressing Escape closes the panel and returns focus to the trigger.
- The title is linked via aria-labelledby so screen readers announce it upon opening.

## Controlled behavior

- Open and close are managed through external state (e.g., an isOpen variable) or callback functions, supporting complex interaction patterns.

## Responsive behavior

- On wide viewports the sheet sticks to the page edge; on small viewports it can fall back to a full-screen overlay for mobile layouts.

## Theme behavior

- The panel's background, borders, and shadows are fully customizable and integrate seamlessly with dark-theme systems.

## Live Demo

```tsx
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

<Sheet modal>
  <SheetTrigger asChild>
    <Button type="default" typeName="button">
      Open Sheet
    </Button>
  </SheetTrigger>
  <SheetContent className="m-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] rounded-2xl bg-background-100 p-0 lg:w-[512px] sm:max-w-[auto] flex flex-col">
    <SheetHeader className="p-6 text-left">
      <SheetTitle>Sheet Title</SheetTitle>
      <p className="text-copy-14 text-foreground">Sheet description</p>
    </SheetHeader>
    <SheetDescription className="px-6 py-4 text-copy-14">Sheet body</SheetDescription>
    <SheetFooter className="p-6 gap-2 flex-row justify-end mt-auto">
      <SheetClose asChild>
        <Button type="secondary" typeName="button">
          Close
        </Button>
      </SheetClose>
      <Button typeName="button">Next</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>;
```

```tsx
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const sides = ["top", "right", "bottom", "left"] as const;

<div className="flex items-center justify-center gap-4">
  {sides.map((side) => (
    <Sheet key={side} modal>
      <SheetTrigger asChild>
        <Button type="default" typeName="button">
          Open {side}
        </Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Sheet from {side}</SheetTitle>
          <p className="text-copy-14 text-foreground">This sheet slides in from the {side}.</p>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ))}
</div>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled sheet state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">modal</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Whether the sheet blocks outside interaction.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">side</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SheetSide</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Edge from which SheetContent enters.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"right"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">noOverlay</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Omits the SheetContent backdrop.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## Best Practices

- Use Sheet for persistent associated context like deployment details, log row inspection, or a member profile, where the underlying page stays useful.
- For a blocking decision, use Modal. For a mobile-only bottom sheet, use Drawer.
- Don’t use Sheet to confirm destructive actions. The default keeps the page interactive, which weakens severity for a delete or revoke.
- Pick side from the trigger location: a row inspector slides from right, a global filter from left. Don’t change sides mid-session.
- Outside-click does not auto-close, so always render an explicit close affordance and honor Escape.
- Title is Title Case and names the entity (Deployment Details, Member Profile), not the page action. Body is read-mostly prose.
- Trap focus inside the sheet while it’s open and return focus to the trigger row on close so keyboard users keep their place in the list.
- Provide a visible close button labeled Close (or an icon button with aria-label="Close") since clicking outside doesn’t dismiss.
- Announce the sheet with aria-labelledby pointing at the title; pair it with aria-describedby only when the body is short and load-bearing.
