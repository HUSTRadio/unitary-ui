# Destructive Action Modal

> Route: `/components/destructive-action-modal`

Confirms destructive actions with a red AlertTriangle header and a destructive confirm button.

[Back to Components](#/components)

# Destructive Action Modal

Destructive Action Modal

Confirms destructive actions with a red AlertTriangle header and a destructive confirm button.

## When to use

- When the action is destructive and warrants friction — delete, rotate, revoke, disconnect, downgrade. The typed gate forces deliberate intent.
- For reversible destructive actions too, when the consequence is serious enough to warrant a pause but still benefit from the typed gate.
- When you need the user to type a confirmation phrase to prove their understanding of the consequences before proceeding.

## When not to use

- Routine confirmations such as save draft, discard changes, or close without saving should use a plain Modal — the typed gate reads as melodrama when the stakes are low.
- Actions that only involve a light UI refresh or immediate undo don't merit an input barrier — use a non-blocking toast instead.
- Non-blocking acknowledgments belong to Toast, not Modal — a destructive confirmation needs the blocking overlay.

## Examples

### Default destructive confirmation

The minimal structure with title, body text, and input verification — the user must type the phrase exactly to enable confirm.

### Reversible destructive action

The action itself is reversible but still requires caution — show this mode and drop the irreversibility band from the body.

### Loading state

Both buttons are disabled during loading — the caller owns the open state and closes after the API settles.

### Error handling

Keep the modal open on API failure so the user can retry, rather than silently dismissing.

## Accessibility

- The verification input gets focus on open so the user can start typing immediately; submit stays disabled until the value matches exactly.
- Title should be a Title Case statement — never a question — e.g. Delete Project, not Delete this project?.
- The loading state disables both buttons to prevent duplicate submissions.

## Controlled behavior

- The caller owns open — do not self-dismiss from onConfirm; close after the API settles or keep open on error so the user can retry.
- The loading property disables both buttons simultaneously, managed by the parent component.
- The input field auto-focuses on open and continuously validates against the confirmation phrase.

## Responsive behavior

- On small screens the modal displays as a full-screen cover; on larger viewports it centers with appropriate margins.
- Font sizes for the title and input field scale responsively across breakpoints.

## Theme behavior

- Uses semantic variant coloring for destructive actions (red tones).
- Dark/light theme switching preserves the red warning signal across all themes.

## Live Demo

```tsx
import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

export function DestructiveActionModalDefault21B111CBExample() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        confirmLabel="Delete Project"
        description={
          <>
            <span className="font-medium">next-year-boilerplate</span> and all its deployments,
            domains, and environment variables will be permanently deleted.
          </>
        }
        irreversibleDescription="Deleting next-year-boilerplate cannot be undone."
        loading={loading}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
        open={open}
        title="Delete Project"
        verificationLabel="project name"
        verificationPhrase="next-year-boilerplate"
      />
    </>
  );
}
```

## Reversible

```tsx
import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

export function DestructiveActionModalReversible6E7D6697Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Disable Vercel Authentication
      </Button>
      <DestructiveActionModal
        confirmLabel="Disable Vercel Authentication"
        description="Anyone will be able to view your deployments without being a member of your team."
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        open={open}
        title="Disable Vercel Authentication"
        verificationPhrase="disable vercel authentication"
      />
    </>
  );
}
```

## Loading

```tsx
import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

export function DestructiveActionModalLoadingDC380888Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        confirmLabel="Delete Project"
        description="my-project and all its deployments will be permanently deleted."
        irreversibleDescription="Deleting my-project cannot be undone."
        loading
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          /* no-op while loading */
        }}
        open={open}
        title="Delete Project"
        verificationLabel="project name"
        verificationPhrase="my-project"
      />
    </>
  );
}
```

## With error

```tsx
import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

export function DestructiveActionModalWithError3E9E4249Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        confirmLabel="Delete Project"
        description="my-project and all its deployments will be permanently deleted."
        error="Couldn’t delete project. Try again."
        irreversibleDescription="Deleting my-project cannot be undone."
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        open={open}
        title="Delete Project"
        verificationLabel="project name"
        verificationPhrase="my-project"
      />
    </>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled dialog state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCancel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Handles cancellation and dismissal.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onConfirm</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Owns the destructive action.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Dialog title.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">description</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Consequence description.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">confirmLabel</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Confirmation button label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">verificationPhrase</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Exact phrase required to unlock confirmation.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">verificationLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Noun used in the verification prompt.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">irreversibleDescription</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional irreversible-action warning band.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Disables both actions and shows progress.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string | Error</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Inline confirmation error.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Reach for this over Modal when the action is destructive and warrants friction: delete, rotate, revoke, disconnect, downgrade. The typed gate forces deliberate intent.
- Use it for reversible destructive actions too, when the consequence is serious enough to warrant a pause. Keep the typed gate; drop the irreversibility band.
- Don't use for routine confirmations (save draft, discard changes, close without saving). The typed gate reads as melodrama when the stakes are low — use a plain Modal.
- Title is Title Case, Verb + Noun, a statement — never a question. Delete Project, not Delete this project?.
- confirmLabel matches the title 1:1. Never generic (Confirm, OK, Continue), never a bare verb (Delete).
- loading disables both buttons. The caller owns open — do not self-dismiss from onConfirm. Close after the API settles, or keep open on error so the user can retry.
- The verification input gets focus on open so the user can start typing immediately. Submit stays disabled until the value matches the verification phrase exactly.
- Treat this as one of only two blurred overlays in the library. Backdrop blur expresses a foreground layer — the primary screen, an AI suggestion, or a temporary front surface — and must be applied through the shared overlay blur token (--uni-overlay-backdrop-blur), never a raw blur step. Any new blurred overlay requires design confirmation.
