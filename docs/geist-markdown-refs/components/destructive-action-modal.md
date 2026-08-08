# Destructive Action Modal

Confirm destructive actions with a required type-to-confirm gate and an optional irreversibility band.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Delete Project" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#f5f5f5 · bg:#da2f35 · r:6px
> - **Reversible**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Disable Vercel Authentication" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#f5f5f5 · bg:#da2f35 · r:6px
> - **Loading**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Delete Project" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#f5f5f5 · bg:#da2f35 · r:6px
> - **With error**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Delete Project" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#f5f5f5 · bg:#da2f35 · r:6px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Delete Project" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ffffff · bg:#d93036 · r:6px
> - **Reversible**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Disable Vercel Authentication" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ffffff · bg:#d93036 · r:6px
> - **Loading**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Delete Project" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ffffff · bg:#d93036 · r:6px
> - **With error**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Delete Project" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ffffff · bg:#d93036 · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default

A type-to-confirm gate disables submit until the user types the verification phrase exactly. The red striped band at the bottom names what cannot be undone.

```tsx
import { Button, DestructiveActionModal } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = (): void => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="small" variant="error">
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

Omit irreversibleDescription for actions that can be re-enabled, undone, or rolled back. The type-to-confirm gate stays — the friction is still warranted — but the red band is skipped.

```tsx
import { Button, DestructiveActionModal } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="small" variant="error">
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

loading disables both buttons and shows a spinner on the primary action. Use while the destructive API call is in flight. Caller controls open; don't dismiss the modal from inside.

```tsx
import { Button, DestructiveActionModal } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="small" variant="error">
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

Pass error (a string or an Error) to surface an inline error under the input. The modal stays open so the user can retry.

```tsx
import { Button, DestructiveActionModal } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="small" variant="error">
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

## Best Practices

### When to use

- Reach for this over Modal when the action is destructive and warrants friction: delete, rotate, revoke, disconnect, downgrade, disable a security setting. The typed gate forces deliberate intent.

- Use it for reversible destructive actions too, when the consequence is serious enough to warrant a pause — disabling deployment protection, revoking a shared token. Keep the typed gate; drop irreversibleDescription.

- Don't use for routine confirmations (save draft, discard changes, close without saving). The typed gate reads as melodrama when the stakes are low — use a plain Modal instead.

### Behavior

- The verification input gets focus on open so the user can start typing immediately. Submit stays disabled until the value matches verificationPhrase exactly.

- Enter submits only when the gate is open; it's a no-op otherwise. Cancel, outside-click, and Escape all dismiss.

- loading disables both buttons. The caller owns open — do not self-dismiss from onConfirm. Close the modal after the API settles (success or error), or keep it open on error so the user can retry.

- Pair the post-confirm success toast verb 1:1 with the primary button: Delete Project button, Project deleted toast. Never Project removed.

### Content

- title is Title Case, Verb + Noun, a statement — never a question. Delete Project, not Delete this project?.

- description is sentence case, names the consequence, and interpolates the specific resource when relevant. <b>my-project</b> and all its deployments will be permanently deleted. reads stronger than This project and all its deployments will be deleted..

- confirmLabel matches the title 1:1. Never generic (Confirm, OK, Continue), never a bare verb (Delete).

- verificationPhrase: for entity deletes, type the resource name itself (my-project) and pair with verificationLabel="project name" so the prompt reads To confirm, type the project name "my-project". That's the canonical signal that the user knows which thing they're acting on. Fall back to a lowercase verb phrase (disable vercel authentication) only when there's no entity to name.

- irreversibleDescription names the specific action and resource and ends with cannot be undone. — Deleting my-project cannot be undone. rather than the generic This cannot be undone.. Omit the prop entirely for reversible actions; the prop's absence is the signal, not a falsy value.

- error surfaces the API failure verbatim in Vercel voice: Couldn't save settings. Try again.. Never dump a raw error object.

### Accessibility

- The verification input is associated with its prompt via aria-labelledby + htmlFor. Screen readers announce the full prompt (To confirm, type "delete my-project") on focus.

- The Warning icon in the irreversibility band is aria-hidden; the sentence carries the meaning so nothing is announced twice.

- Focus stays inside the modal across an error transition so the user can retry without losing context. After success, return focus to the trigger.

Was this helpful?
