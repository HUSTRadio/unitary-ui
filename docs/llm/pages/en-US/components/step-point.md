# Step Point

> Route: `/components/step-point`

Marks progress through a multi-step flow.

[Back to Components](#/components)

# Step Point

StepPoint

Marks progress through a multi-step flow.

## When to use

- Guiding users through multi-step flows such as setup wizards, registration forms, or deployment configurations.
- Communicating the overall structure of a linear task, current position, and remaining steps.

## When not to use

- Single-action or step-less scenarios should not use a step-point indicator.
- Multiple independent sub-flows on the same page each deserve their own step-point component.

## Examples

### Default step indicators

Standard horizontal arrangement of step points showing the default appearance.

### Full multi-step flow

Combining step indicators with content areas to demonstrate a complete guided flow experience.

## Accessibility

- Completed and active step indicators should have clear focus styles; keyboard users can tab through all steps.
- The active step should carry an aria-current attribute so screen readers announce the user's position.

## Controlled behavior

- Controlled via activeIndex for the highlighted step and a completedIndexes array marking finished steps.

## Responsive behavior

- On narrow viewports, step indicators can switch to vertical layout or hide inactive steps to save space.

## Theme behavior

Not applicable: Step points use fixed semantic colors (grey unvisited, brand active, checkmark done) and do not support theme customization.

## Live Demo

- Submitted
- Under review
- Approved

```tsx
import { StepPoint } from "@/components/ui/step-point";

export function StepPointDefault21B111CBExample() {
  return (
    <ul className="w-full max-w-xs">
      <StepPoint status="done">Submitted</StepPoint>
      <StepPoint status="active">Under review</StepPoint>
      <StepPoint status="idle">Approved</StepPoint>
    </ul>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { StepPoint } from "@/components/ui/step-point";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">status</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">StepStatus</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Step state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Step label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
