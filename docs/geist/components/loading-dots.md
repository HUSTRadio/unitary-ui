# Loading Dots

Indicate an action running in the background.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **With text**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **With text**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { LoadingDots } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-start justify-between gap-6 flex-initial">
      <LoadingDots size="sm" />
      <LoadingDots size="md" />
      <LoadingDots size="lg" />
    </div>
  );
}
```

## With text

Loading

```tsx
import { LoadingDots } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <LoadingDots size="md">
      <p className="text-copy-14 text-gray-900">Loading</p>
    </LoadingDots>
  );
}
```

## Best Practices

### When to use

- Use Loading Dots embedded in copy for short indeterminate waits, e.g. Saving<LoadingDots /> or Building<LoadingDots />.

- For buttons, set the loading prop on Button instead of dropping dots inside the label.

- For layout placeholders use Skeleton; for known progress use Progress; for icon-sized indeterminate waits use Spinner.

### Behavior

- Pass size (number, dot diameter in px) only when the default doesn’t match adjacent type size.

- Keep the trailing label specific to the work in flight (Saving, Deploying, Uploading) so a wait over ~1s still tells the user what’s happening.

- Don’t string Loading Dots after a completed verb (Saved<LoadingDots />); the dots imply ongoing work.

### Accessibility

- Mark the wrapping span with aria-live="polite" so screen readers pick up the in-progress label without interrupting.

- The dots are decorative; the surrounding text carries meaning, so don’t add aria-label to the component itself.

- Honor prefers-reduced-motion and avoid pairing Loading Dots with another animated indicator on the same line.

Was this helpful?
