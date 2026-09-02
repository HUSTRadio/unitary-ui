# Error Boundary

> Route: `/components/error-boundary`

Contains React render failures and replaces the failed subtree with recovery UI.

[Back to Components](#/components)

# Error Boundary

Error Boundary

Contains React render failures and replaces the failed subtree with recovery UI.

## When to use

- Around routes, page sections, or complex widgets where one crash must not unmount the whole application.
- When render failures need onError reporting and automatic recovery after a route or data identity changes.

## When not to use

- React boundaries do not catch event-handler, asynchronous callback, or server-rendering errors; handle those in their execution paths.
- Use Error, Error Card, or inline validation for ordinary request and field failures instead of throwing during render.

## Examples

### Contain a render failure

Triggers a child render error and resets the example through a custom fallback.

## Accessibility

- The built-in fallback uses role=alert. A custom fallback should also name the failed region and next action, with equivalent alert semantics when immediate announcement is required.
- Use a retry label that names the action and target, such as Reload Deployment Preview, rather than a generic confirmation label.

## Controlled behavior

- resetKeys are shallow-compared; a length or item change clears the captured error and renders children again.
- fallback is a static ReactNode. To reset caller state from it, provide a node with the appropriate handler or remount the boundary through key.

## Responsive behavior

Not applicable: Error containment is viewport-independent; the caller owns responsive fallback layout.

## Theme behavior

- The built-in fallback uses minimal inline styling so it does not depend on application theme CSS. Custom fallbacks should use the application's semantic color and typography tokens.

## Live Demo

```tsx
import * as React from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";

function BrokenPreview(): never {
  throw new Error("Deployment preview failed to render");
}

export function ErrorBoundaryExample() {
  const [failed, setFailed] = React.useState(false);

  return (
    <ErrorBoundary
      key={failed ? "failed" : "ready"}
      name="Deployment Preview"
      fallback={
        <div role="alert" className="space-y-3 rounded-lg border p-4">
          <p className="font-medium">Deployment Preview Failed</p>
          <Button typeName="button" onClick={() => setFailed(false)}>
            Reload Deployment Preview
          </Button>
        </div>
      }
    >
      {failed ? (
        <BrokenPreview />
      ) : (
        <Button typeName="button" onClick={() => setFailed(true)}>
          Trigger Render Error
        </Button>
      )}
    </ErrorBoundary>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { ErrorBoundary } from "@/components/ui/error-boundary";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">The render subtree protected by the boundary.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">fallback</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Custom recovery UI rendered after a captured error.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">resetKeys</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">unknown[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shallow-compared keys whose changes clear the captured error.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onError</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(error: Error, info: React.ErrorInfo) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports the captured render error and component stack.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">name</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Boundary name used in logs and the built-in fallback.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">className</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Class name applied to the built-in fallback only.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Place Error Boundary around route, section, or widget boundaries where one render failure should not unmount the whole application.
- Provide recovery UI that names the failed region and offers a safe retry, reset, or navigation path.
- Use resetKeys for route or data identities whose change should clear the captured render error.
- Report failures through onError; render boundaries do not catch event-handler, asynchronous, or server-rendering errors.
