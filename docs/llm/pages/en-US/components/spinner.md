# Spinner

> Route: `/components/spinner`

Indicates an in-progress operation.

[Back to Components](#/components)

# Spinner

Spinner

Indicates an in-progress operation.

## When to use

- Use Spinner for a single in-flight action or indeterminate wait where there is no known progress to show.
- Prefer a loading state on the action control itself (like Button loading) so the busy element stays focusable and announces the busy state to assistive tech.
- Pair a standalone Spinner with a text label or aria-label so the loading state is announced to assistive tech.

## When not to use

- For a known duration or percentage, use Progress instead of a Spinner.
- Do not pair Loading Dots with another animated indicator on the same line—this creates visual conflict and wastes resources.
- Deployment lifecycle intermediate states (BUILDING / QUEUED) should be handled by Status Dot, not supplemented with a Spinner.

## Examples

### Color variants

Showcases different color variants of the Spinner for varying backgrounds and content contexts.

## Accessibility

- A standalone Spinner must be accompanied by an aria-label or text description telling users what operation is waiting.
- The Spinner itself is decorative; its meaning should be carried by adjacent text or an aria-live region—an idly spinning wheel should not be mistaken for an interactive element.
- Respect prefers-reduced-motion to reduce rotation frequency or stop the animation entirely on low-intensity devices.

## Controlled behavior

Not applicable: Spinner is a passive display component with no interactive state or controlled properties; its visibility is driven by the parent component's state and it accepts no controlled attributes.

## Responsive behavior

- Spinner size is specified explicitly via props, keeping consistent visual density and legibility on any viewport.
- Spinner does not pick a size automatically: callers set it explicitly via the size prop (sm/md/lg/xl/2xl/3xl/4xl, 12–56px) to match the surrounding UI density.

## Theme behavior

- Spinner colors are managed through theme variables, automatically selecting appropriate hues for sufficient contrast in both dark and light modes.
- Custom color values can be passed via props to align with brand palettes or specific semantic meanings.

## Live Demo

Default:Loading...

Red:Loading...

Green:Loading...

Blue:Loading...

```tsx
import { Spinner } from "@/components/ui/spinner";

export function SpinnerColors88C45D9EExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-24 text-copy-14 text-muted-foreground">Default:</span>
        <Spinner />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-copy-14 text-muted-foreground">Red:</span>
        <Spinner className="text-red-700" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-copy-14 text-muted-foreground">Green:</span>
        <Spinner className="text-green-700" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-copy-14 text-muted-foreground">Blue:</span>
        <Spinner className="text-blue-700" />
      </div>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Spinner } from "@/components/ui/spinner";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Spinner size preset.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"md"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">iconProps</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ComponentProps&lt;typeof Loader2&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">SVG-specific icon overrides.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">aria-hidden</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean | "true" | "false"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Hides status semantics when another element already announces loading.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Spinner for a single in-flight action or indeterminate wait where there’s no known progress to show.
- For a known duration or percentage, use Progress instead of a spinner.
- Prefer a loading state on the action control itself (like Button loading) so the busy element stays focusable.
- Pair a standalone Spinner with a text label or aria-label so the loading state is announced to assistive tech.
