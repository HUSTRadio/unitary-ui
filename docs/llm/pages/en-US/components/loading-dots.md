# Loading Dots

> Route: `/components/loading-dots`

Indicates an action running in the background with three bouncing dots.

[Back to Components](#/components)

# Loading Dots

Loading Dots

Indicates an action running in the background with three bouncing dots.

## When to use

- Embedding a loading hint inside short copy, e.g. Saving<LoadingDots /> or Building<LoadingDots />, so users know an operation is in progress.
- For short-duration indeterminate waits where the dot animation is lighter-weight and less formal than a progress bar.
- Inline loading indications that keep surrounding text readable, rather than full-page overlay loading effects.

## When not to use

- For buttons, set the loading prop on Button instead of dropping dots inside the label, to maintain button accessibility and focus management.
- For determinate task progress, use Progress with a known total and clear completion semantics; for layout placeholders use Skeleton.
- Don't append Loading Dots after a completed verb—for example Saved<LoadingDots /> is wrong because the dots imply ongoing work.

## Examples

### Default loading dots

The simplest three-dot bounce animation without additional explanatory text, communicating that the system is processing solely through the animation itself—ideal for contexts where the action is already clear.

### With text

Append specific descriptive text before the dots—for example Saving, Deploying, or Uploading—so users still know what's happening even after a wait exceeds one second.

## Accessibility

- The wrapping span carries aria-live="polite" so screen readers pick up the in-progress label without interrupting the user.
- The dots themselves are decorative—the surrounding text carries the core meaning, so adding aria-label to the component is unnecessary.

## Controlled behavior

Not applicable: Loading Dots has no isLoading prop and animates whenever it is mounted. The caller conditionally renders it, while reduced-motion preferences disable the animation.

## Responsive behavior

Not applicable: As an inline element, Loading Dots scales with the current line's font size. The component itself involves no responsive breakpoints or layout switching.

## Theme behavior

- Dot colors are drawn from theme tokens, ensuring good contrast and visual clarity in both light and dark modes.
- Honors prefers-reduced-motion to automatically reduce or disable the animation effect on systems where the user prefers reduced motion.

## Live Demo

```tsx
import { LoadingDots } from "@/components/ui/loading-dots";

<div className="flex flex-col items-start justify-between gap-6 flex-initial">
  <LoadingDots size="sm" />
  <LoadingDots size="md" />
  <LoadingDots size="lg" />
</div>;
```

Loading

```tsx
import { LoadingDots } from "@/components/ui/loading-dots";

<LoadingDots size="md">
  <p className="text-copy-14 text-gray-900">Loading</p>
</LoadingDots>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { LoadingDots } from "@/components/ui/loading-dots";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">LoadingDotsSize</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Dot size.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Loading Dots embedded in copy for short indeterminate waits, e.g. Saving<LoadingDots /> or Building<LoadingDots />.
- For buttons, set the loading prop on Button instead of dropping dots inside the label.
- For layout placeholders use Skeleton; for known progress use Progress; for icon-sized indeterminate waits use Spinner.
- Keep the trailing label specific to the work in flight (Saving, Deploying, Uploading) so a wait over ~1s still tells the user what’s happening.
- Don’t string Loading Dots after a completed verb (Saved<LoadingDots />); the dots imply ongoing work.
- Mark the wrapping span with aria-live="polite" so screen readers pick up the in-progress label without interrupting.
- The dots are decorative; the surrounding text carries meaning, so don’t add aria-label to the component itself.
- Honor prefers-reduced-motion and avoid pairing Loading Dots with another animated indicator on the same line.
