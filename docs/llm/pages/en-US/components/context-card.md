# Context Card

> Route: `/components/context-card`

A floating card that appears on hover or focus, showing richer detail than a tooltip.

[Back to Components](#/components)

# Context Card

Context Card

A floating card that appears on hover or focus, showing richer detail than a tooltip.

## When to use

- Reveal entity metadata on hover or focus: a user detail near their avatar, build info next to a deployment name, or project stats beside a link.
- The trigger is typically a name link or avatar in dense data tables; the card supplements with one identifying line and 2–4 Label: value metadata rows.

## When not to use

- For a one-line explanation without metadata rows, use Tooltip instead of Context Card.
- Do not use Context Card to surface destructive actions—the panel can dismiss on cursor exit before the user commits.

## Examples

### Default context card

Shows a basic context card on trigger hover, displaying entity name, an identifying line, and metadata rows.

### Alignment variants

Demonstrates different popup alignment positions of the context card relative to the trigger to fit varying spatial layouts.

### Custom render prop

Fully customizes the internal rendering logic of the card through a render prop, suitable for special layouts or non-standard data scenarios.

## Accessibility

- ContextCard is a non-modal hover card and does not trap focus; keep the trigger focusable, and Escape can dismiss the floating card.
- The trigger retains its own accessible name—the card is supplementary and should not replace the trigger's accessible name.
- Content in the card should not restate what the trigger already displays visibly, avoiding information redundancy.

## Controlled behavior

Not applicable: ContextCard controls its own open/close state based on mouse hover, focus, and other interaction events; it does not expose an external value-controlled API.

## Responsive behavior

Not applicable: ContextCard is a floating overlay card rendered in a small area, and does not involve complex responsive layout adjustments.

## Theme behavior

- Context Card supports dark and light themes, with styles automatically adapting to the user's preferred color scheme following the Geist design system color tokens.

## Live Demo

Top

Bottom

Left

Right

```tsx
import { Button } from "@/components/ui/button";
import {
  ContextCard,
  ContextCardBody,
  ContextCardDescription,
  ContextCardFooter,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardTrigger,
} from "@/components/ui/context-card";

export function ContextCardDefault37A8EEC1Example() {
  const card = (
    <ContextCard>
      <ContextCardHeader>
        <div className="size-8 shrink-0 rounded-full bg-gray-400" aria-hidden />
        <div>
          <ContextCardTitle>Acme Inc.</ContextCardTitle>
          <ContextCardDescription>@acme · San Francisco</ContextCardDescription>
        </div>
      </ContextCardHeader>
      <ContextCardBody>
        <p className="text-copy-13 text-muted-foreground">Last Active: 2h ago</p>
        <p className="text-copy-13 text-muted-foreground">Plan: Pro</p>
      </ContextCardBody>
      <ContextCardFooter>
        <Button type="secondary" typeName="button" size="small">
          View Project
        </Button>
      </ContextCardFooter>
    </ContextCard>
  );

  return (
    <>
      {(["Top", "Bottom", "Left", "Right"] as const).map((label) => (
        <ContextCardTrigger
          key={label}
          content={card}
          side={label.toLowerCase() as "top" | "bottom" | "left" | "right"}
        >
          <span>{label}</span>
        </ContextCardTrigger>
      ))}
    </>
  );
}
```

## alignment

```tsx
import { Button } from "@/components/ui/button";
import {
  ContextCard,
  ContextCardBody,
  ContextCardDescription,
  ContextCardFooter,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardTrigger,
} from "@/components/ui/context-card";

export function ContextCardAlignment47CCB97AExample() {
  const card = (
    <ContextCard>
      <ContextCardHeader>
        <div className="size-8 shrink-0 rounded-full bg-gray-400" aria-hidden />
        <div>
          <ContextCardTitle>Acme Inc.</ContextCardTitle>
          <ContextCardDescription>@acme · San Francisco</ContextCardDescription>
        </div>
      </ContextCardHeader>
      <ContextCardBody>
        <p className="text-copy-13 text-muted-foreground">Last Active: 2h ago</p>
        <p className="text-copy-13 text-muted-foreground">Plan: Pro</p>
      </ContextCardBody>
      <ContextCardFooter>
        <Button type="secondary" typeName="button" size="small">
          View Project
        </Button>
      </ContextCardFooter>
    </ContextCard>
  );

  return (
    <>
      {(["Start", "Center", "End"] as const).map((label) => (
        <ContextCardTrigger
          key={label}
          content={card}
          align={label.toLowerCase() as "start" | "center" | "end"}
          render={
            <Button type="default" typeName="button">
              {label}
            </Button>
          }
        />
      ))}
    </>
  );
}
```

## render-prop

[Rendered as a link](#render-prop)

```tsx
import { Button } from "@/components/ui/button";
import {
  ContextCard,
  ContextCardBody,
  ContextCardDescription,
  ContextCardFooter,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardTrigger,
} from "@/components/ui/context-card";

export function ContextCardRenderProp84FF0355Example() {
  const card = (
    <ContextCard>
      <ContextCardHeader>
        <div className="size-8 shrink-0 rounded-full bg-gray-400" aria-hidden />
        <div>
          <ContextCardTitle>Acme Inc.</ContextCardTitle>
          <ContextCardDescription>@acme · San Francisco</ContextCardDescription>
        </div>
      </ContextCardHeader>
      <ContextCardBody>
        <p className="text-copy-13 text-muted-foreground">Last Active: 2h ago</p>
        <p className="text-copy-13 text-muted-foreground">Plan: Pro</p>
      </ContextCardBody>
      <ContextCardFooter>
        <Button type="secondary" typeName="button" size="small">
          View Project
        </Button>
      </ContextCardFooter>
    </ContextCard>
  );

  return (
    <>
      <ContextCardTrigger
        content={card}
        render={
          <Button type="default" typeName="button">
            Default wrapper
          </Button>
        }
      />
      <ContextCardTrigger
        content={card}
        render={
          <a href="#render-prop" className="text-blue-700 underline underline-offset-2">
            Rendered as a link
          </a>
        }
      />
    </>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import {
  ContextCard,
  ContextCardTrigger,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardDescription,
  ContextCardAvatar,
  ContextCardBody,
  ContextCardFooter,
} from "@/components/ui/context-card";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">side</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"top" | "right" | "bottom" | "left"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Preferred placement relative to its trigger.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">openDelay</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Delay before opening on pointer intent.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Context Card to reveal entity metadata on hover or focus: a user, a deployment, a project, an API key. The trigger is usually a name link or avatar in dense data.
- For a one-line explanation without metadata rows, use Tooltip. For long-form content, edit forms, or persistent navigation, route to a Drawer or a detail page.
- Don't use Context Card to surface destructive actions; the panel can dismiss on cursor exit before the user commits.
- Cap interactive content at one primary action (View Project, Open Settings). More than one CTA reads as a menu and belongs in a Menu.
- Lead with the entity name as a Title Case heading and one identifying line in sentence case underneath, followed by 2–4 metadata rows of Label: value.
- Don't restate what the trigger already showed. If the row already renders the deployment URL, don't repeat it as the first card line.
- The trigger keeps its own accessible name; the card is supplementary and shouldn't replace it. Escape closes the card and returns focus to the trigger.
