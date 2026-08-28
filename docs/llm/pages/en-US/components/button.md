# Button

> Route: `/components/button`

Triggers an action with configurable variants, sizes, and icons.

[Back to Components](#/components)

# Button

Button

Triggers an action with configurable variants, sizes, and icons.

## When to use

-   Use Button for actions that mutate state (deploy, save, delete); use ButtonLink for navigation that changes the URL.
-   For form submits use typeName="submit" — the HTML type attribute lives on typeName, while type controls the visual variant.
-   When more than one related action shares a row, switch to a Menu or Split Button instead of stacking buttons.

## When not to use

-   Don't use nonexistent type values like success/ghost/violet; pass secondary for supporting actions and error for destructive confirmations.
-   Disable a button only when the action is impossible right now; pair disabling with a Tooltip that explains why.
-   Icon-only buttons require both svgOnly and aria-label (the validator throws); the aria-label names the action and target (Copy deployment URL), not the icon.

## Examples

### Sizes

Shows every size tier so you can pick the right one for the context density.

### All types and sizes in comparison

Places every type and size side by side as a reference table for choosing variants.

### Loading

Pass loading instead of swapping in a spinner so the button stays focusable and announces the busy state.

### Disabled

Shows the disabled appearance; reserve it for actions that are currently impossible and explain why.

### Prefix and suffix icons

Places icons before or after the label to strengthen action recognition.

## Accessibility

-   The loading state keeps the button focusable and announces the busy state to assistive tech, unlike a swapped-in spinner.
-   Don't set aria-label on a button that already has visible text; it overrides the label and creates a screen-reader mismatch.
-   Disabled buttons need a Tooltip naming the reason; a greyed button without explanation reads as a bug.

## Controlled behavior

-   loading and disabled are fully controlled by the parent; the button holds no internal state.
-   The caller decides when to clear loading after the click callback fires.

## Responsive behavior

-   On small viewports prefer shortening the label over wrapping; consider abbreviations or moving long actions into a menu.
-   Pick a larger size tier for touch contexts to keep hit areas comfortable.

## Theme behavior

-   Default Button is primary; secondary serves supporting actions and error serves destructive confirmations.
-   Destructive buttons follow Verb + Noun and pair 1:1 with their toast: Delete Project then Project deleted.

## Live Demo

```tsx
import { Button } from "@/components/ui/button";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <Button size="small" typeName="button">Upload</Button>
  <Button typeName="button">Upload</Button>
  <Button size="large" typeName="button">Upload</Button>
</div>
```

[Sign Up](#)

## Variants

```tsx
import { Button } from "@/components/ui/button";

<div className="flex flex-wrap items-center gap-3">
  <Button typeName="button">Default</Button>
  <Button type="secondary" typeName="button">Secondary</Button>
  <Button type="tertiary" typeName="button">Outline</Button>
  <Button type="tertiary" typeName="button">Ghost</Button>
  <Button type="error" typeName="button">Destructive</Button>
</div>
```

## Prefix and Suffix

```tsx
import { Button } from "@/components/ui/button";
import { Copy, Search } from "lucide-react";

<div className="flex flex-wrap items-center gap-3">
  <Button prefix={<Search />} typeName="button">Search</Button>
  <Button prefix={<Copy />} type="secondary" typeName="button">Copy</Button>
  <Button loading type="tertiary" typeName="button">Loading</Button>
  <Button disabled typeName="button">Disabled</Button>
</div>
```

## States and Composition

```tsx
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <Button aria-label="Upload" shape="square" size="tiny" svgOnly typeName="button">
    <ArrowUp />
  </Button>
  <Button aria-label="Upload" shape="square" size="small" svgOnly typeName="button">
    <ArrowUp />
  </Button>
  <Button aria-label="Upload" shape="square" svgOnly typeName="button">
    <ArrowUp />
  </Button>
  <Button aria-label="Upload" shape="square" size="large" svgOnly typeName="button">
    <ArrowUp />
  </Button>
  <Button aria-label="Upload" shape="circle" size="tiny" svgOnly typeName="button">
    <ArrowUp />
  </Button>
  <Button aria-label="Upload" shape="circle" size="small" svgOnly typeName="button">
    <ArrowUp />
  </Button>
  <Button aria-label="Upload" shape="circle" svgOnly typeName="button">
    <ArrowUp />
  </Button>
  <Button aria-label="Upload" shape="circle" size="large" svgOnly typeName="button">
    <ArrowUp />
  </Button>
</div>
```

```tsx
import { Button } from "@/components/ui/button";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <Button shadow shape="rounded" size="small" type="secondary" typeName="button">Upload</Button>
  <Button shadow shape="rounded" type="secondary" typeName="button">Upload</Button>
  <Button shadow shape="rounded" size="large" type="secondary" typeName="button">Upload</Button>
</div>
```

```tsx
import { Button } from "@/components/ui/button";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <Button loading size="small" typeName="button">Upload</Button>
  <Button loading typeName="button">Upload</Button>
  <Button loading size="large" typeName="button">Upload</Button>
</div>
```

```tsx
import { Button } from "@/components/ui/button";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <Button disabled size="small" typeName="button">Upload</Button>
  <Button disabled typeName="button">Upload</Button>
  <Button disabled size="large" typeName="button">Upload</Button>
</div>
```

```tsx
import { Button } from "@/components/ui/button";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <Button disabled typeName="button">Default</Button>
  <Button disabled type="secondary" typeName="button">Secondary</Button>
  <Button disabled type="tertiary" typeName="button">Tertiary</Button>
  <Button disabled type="error" typeName="button">Error</Button>
  <Button disabled type="warning" typeName="button">Warning</Button>
</div>
```

[Sign Up](#)

```tsx
import { ButtonLink } from "@/components/ui/button";

<ButtonLink className="w-fit" href="#">
  Sign Up
</ButtonLink>
```

```tsx
import { CustomButton } from "@/components/ui/button";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <CustomButton
    active={{
      foreground: "#fff",
      background: "var(--blue-700)",
      border: "var(--blue-700)",
    }}
    hover={{
      foreground: "#fff",
      background: "#0B7BFE",
      border: "var(--blue-700)",
    }}
    normal={{
      foreground: "#fff",
      background: "var(--blue-700)",
      border: "var(--blue-700)",
    }}
    width={160}
  >
    Upgrade to Pro
  </CustomButton>
</div>
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Button, ButtonLink, CustomButton, buttonVariants } from "@/components/ui/button"
```

Native props: `ButtonHTMLAttributes<HTMLButtonElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"secondary" | "error"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Visual intent. The default is the primary action.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"secondary"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">typeName</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"button" | "submit" | "reset"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Native button type.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"button"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Keeps the button focusable while announcing progress.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## Best Practices

-   Use Button for actions that mutate state (deploy, save, delete); use ButtonLink for navigation that changes the URL. Switch to a Menu or Split Button when more than one related action shares a row.
-   Default Button is primary. Pass type="secondary" for the supporting action and type="error" for destructive confirmations. primary, success, ghost, and violet are not valid type values.
-   For form submits, use typeName="submit". The HTML type attribute lives on typeName, not on type, which controls the visual variant.
-   Pass loading instead of swapping in a spinner so the button stays focusable and announces the busy state to assistive tech.
-   Disable a button only when the action is impossible right now (missing input, insufficient permission); pair with a Tooltip that explains why.
-   Title Case the label and name what happens: Deploy Project, Invite Member, Rotate Key. Avoid bare verbs (Submit) and generic confirms (OK, Confirm).
-   Destructive buttons follow Verb + Noun and pair 1:1 with their toast: Delete Project then Project deleted. Mode-switch buttons append Instead: Use a Recovery Code Instead.
-   Icon-only buttons require both svgOnly and aria-label; the validator throws without them. The aria-label names the action and the target (Copy deployment URL), not the icon (Copy).
-   Don’t set aria-label on a button that already has visible text; it overrides the label and creates a screen-reader mismatch.
