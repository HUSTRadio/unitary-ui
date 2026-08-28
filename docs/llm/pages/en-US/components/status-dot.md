# Status Dot

> Route: `/components/status-dot`

Displays an indicator of deployment status.

[Back to Components](#/components)

# Status Dot

Status Dot

Displays an indicator of deployment status.

## When to use

- Showing deployment lifecycle states: QUEUED, BUILDING, READY, ERROR, CANCELED, DELETED.
- Placed inline beside text labels in table rows, list cards, or command palette items.

## When not to use

- Non-deployment statuses should use a Badge (e.g., workflow runs, queue messages).
- Do not add a status dot when the adjacent text already clearly names the state, avoiding redundant signaling.

## Examples

### Default status dot

The default rendered appearance of a status dot without extra text.

### Status dot with label

A readable text label alongside the dot for a dual information channel.

## Accessibility

- Mark the dot as aria-hidden when the adjacent text already names the state, so screen readers do not announce it twice.
- Animated dots for BUILDING / QUEUED should respect the user's prefers-reduced-motion preference.

## Controlled behavior

- The current deployment state string passed via the value prop drives the dot's color and animation changes reactively.

## Responsive behavior

Not applicable: The Status Dot is a purely decorative micro-interaction component with no responsive layout adjustments.

## Theme behavior

- The dot's color mapping is theme-aware: green for ready, red for error, amber for warning, blue for building.

## Live Demo

```tsx
import { StatusDot } from "@/components/ui/status-dot";

<div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
  <StatusDot state="QUEUED" />
  <StatusDot state="BUILDING" />
  <StatusDot state="ERROR" />
  <StatusDot state="READY" />
  <StatusDot state="CANCELED" />
</div>;
```

QueuedBuildingErrorReadyCanceled

```tsx
import { StatusDot } from "@/components/ui/status-dot";

<div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
  <StatusDot label state="QUEUED" />
  <StatusDot label state="BUILDING" />
  <StatusDot label state="ERROR" />
  <StatusDot label state="READY" />
  <StatusDot label state="CANCELED" />
</div>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { StatusDot } from "@/components/ui/status-dot";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">state</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">StatusDotState</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Status represented by the dot.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Status Dot only for deployment lifecycle states: QUEUED | BUILDING | READY | ERROR | CANCELED | DELETED.
- For non-deployment statuses (Workflow runs, Queue messages, Sandbox, Cron jobs), use a Badge with the canonical state vocabulary instead of repurposing the dot.
- The dot animates while BUILDING or QUEUED and goes static once the deployment reaches a terminal state. Don’t add a separate spinner alongside it.
- Don’t flash the color through every transitional state on a polling tick; only update when the readyState changes.
- Mark the dot decorative with aria-hidden when it sits inline with text that already names the state, so screen readers don’t announce it twice.
