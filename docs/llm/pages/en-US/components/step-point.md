# Step Point

> Route: `/components/step-point`

Mark the status of each step in a multi-step process.

[Back to Components](#/components)

# Step Point

step-point

Mark the status of each step in a multi-step process.

## When to use

- Guiding users through multi-step flows such as setup wizards, registration forms, or deployment configurations.
- Communicating the overall structure of a linear task, current position, and remaining steps.

## When not to use

- Single-action or step-less scenarios should not use a step-point indicator.
- Multiple independent sub-flows on the same page each deserve their own step-point component.

## Examples

### Default step indicators

A vertical step list using status to mark completed, active, and pending steps.

## Accessibility

- StepPoint is purely presentational: the dot is aria-hidden, state semantics come from the text, and no focus or keyboard traversal is provided.
- For interactive step navigation (click-to-switch, aria-current), callers implement it on the surrounding list items themselves.

## Controlled behavior

Not applicable: StepPoint has no internal state: each step's current state is passed in per item via status (idle/active/done/failed); there is no group-level activeIndex/completedIndexes API.

## Responsive behavior

Not applicable: StepPoint makes no layout decisions: vertical vs horizontal arrangement is owned by the surrounding list container (the example uses a vertical ul); narrow-screen adjustments are the caller's responsibility.

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

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { StepPoint } from "@/components/ui/step-point";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">status</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">StepStatus</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Step state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Step label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
