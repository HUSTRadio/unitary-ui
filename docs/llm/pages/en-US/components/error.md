# Error

> Route: `/components/error`

Show an error, such as a loading failure, and explain the next step.

[Back to Components](#/components)

# Error

error

Show an error, such as a loading failure, and explain the next step.

## When to use

- When a section or page-level resource (like a panel, dashboard card, or route boundary) fails to load — use Error as the block-level failure indicator.
- When a platform or system-level async request fails and needs a stable identifier (request ID, deployment ID) for the user or support team to trace the issue.
- When you need to clearly tell the user what happened and what to do next — state what went wrong first, then how to resolve it.

## When not to use

- Don't use for transient action failures — prefer toast.error() for brief operational feedback, as it is lighter-weight and auto-dismisses.
- Don't use for field-level form validation — the error prop on Input is the correct choice for field errors, not this block-level component.
- Don't fall back to Something Went Wrong as a generic title — name the specific resource that failed, such as Couldn't Load Deployments.

## Examples

### Sizes

Showcases the different size variants of the Error component, suited for dense layouts and full-width announcement areas.

### Custom label

Demonstrates replacing the default error icon with a custom label, keeping the error styling consistent with brand guidelines.

### With an error property

Shows passing an error object directly via prop to render the error state after an async request fails, with automatic recovery options.

## Accessibility

- Wrap the error region in aria-live="polite" when the error appears asynchronously so screen readers announce the new state.
- Use assertive for blocking errors that require immediate user attention, reserving polite for informational failures.
- The error icon is decorative — set aria-hidden on it; meaning lives entirely in the accompanying text.

## Controlled behavior

Not applicable: Error is a presentation-only component driven by whether an error object is passed as a prop. It does not manage its own toggle state — content and identifiers are supplied entirely by the caller.

## Responsive behavior

- Error renders horizontally within its full-width container, adjusting padding and font size automatically on smaller screens.
- Stable identifiers (request IDs, etc.) may truncate visually on narrow viewports while preserving the full value in the title attribute for hover access.

## Theme behavior

- Color mapping for semantic states (red for severe errors, amber for warnings) maintains sufficient contrast in both dark and light modes.
- Background and border colors follow the Unitary theme variables, supporting global theme customization via CSS tokens.

## Live Demo

**Email Error:**This email address is already in use.

```tsx
import { Error } from "@/components/ui/error";

export function ErrorCustomLabel4BA9290BExample() {
  return <Error label="Email Error">This email address is already in use.</Error>;
}
```

## No label

This email address is already in use.

```tsx
import { Error } from "@/components/ui/error";

export function ErrorNoLabelD6728773Example() {
  return <Error label={false}>This email address is already in use.</Error>;
}
```

## Sizes

This email is in use.

This email is in use.

This email is in use.

```tsx
import { Error } from "@/components/ui/error";

export function ErrorSizes74A3978DExample() {
  return (
    <div className="flex w-full flex-col items-stretch gap-6">
      <Error size="small">This email is in use.</Error>
      <Error>This email is in use.</Error>
      <Error size="large">This email is in use.</Error>
    </div>
  );
}
```

## With an error property

The request failed. [Contact Us](https://example.com/contact)

```tsx
import { Error } from "@/components/ui/error";

export function ErrorWithAnErrorProperty93A4DDA8Example() {
  return (
    <Error
      error={{
        message: "The request failed.",
        action: "Contact Us",
        link: "https://example.com/contact",
      }}
    />
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Error } from "@/components/ui/error";
```

Also accepts props defined by: `ComponentProps<"div">`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Inline error content.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string | false</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional emphasized label; false hides it.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"small" | "default" | "large"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Error text size.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">{ message: string; action?: string; link?: string }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Structured error with an optional external action.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use the Error component as a block surface when a section or page-level resource failed to load: a panel, a dashboard card, a route boundary.
- Pick toasts.error() for transient action failures and the error prop on Input for field-level validation. Don't replace either with this block.
- Always pair platform or system errors with a stable identifier (request ID, deployment ID, run ID, trace ID). Validation and permission denials are user-state and don't need an ID.
- State what happened and what to do next, in that order. Cut apologetic preambles (Unfortunately, Oops, We're sorry).
- Use Couldn't or Can't for user-state errors; use Failed to for system or infra errors. Unable to is banned.
- Don't fall back to Something Went Wrong as a title; name the resource that failed (Couldn't Load Deployments).
- When the error appears asynchronously after a failed fetch, wrap the region in aria-live="polite" so it's announced; reserve assertive for true blocking errors.
