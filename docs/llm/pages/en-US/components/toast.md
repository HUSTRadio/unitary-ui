# Toast

> Route: `/components/toast`

Briefly display an action result or notification.

[Back to Components](#/components)

# Toast

toast

Briefly display an action result or notification.

## When to use

- Provide non-blocking acknowledgments of user-initiated actions, e.g. 'Domain added', 'Project archived', 'Deployment canceled'.
- Emit a final status notification (success or error) at the terminal step of an async flow, avoiding stacked intermediate messages.

## When not to use

- Do not rely on Toast alone for billing failures, permission denials, or build failures that require user triage—pair with a persistent alert row carrying the recovery step.
- Do not stack multiple toasts to narrate one async flow; emit one success or error toast at the terminal step.
- Never include successfully in completion toasts—follow the {Noun} {past-participle} pattern (e.g. Blob deleted), not Blob successfully deleted.

## Examples

### Default toast

Displays a default toast that appears briefly and then auto-dismisses.

### With action button

Demonstrates a toast with an action button allowing users to perform follow-up operations like Undo.

### Success state

Showcases the success-type toast (green indicator) indicating an operation completed successfully.

## Accessibility

- The toast region announces new messages with aria-live='polite', ensuring assistive technology users are aware of incoming notifications.
- Reserve assertive for truly blocking errors only; use polite for all standard action confirmations to avoid interrupting the user's reading flow.
- For preserved toasts (preserve={true}), ensure users have adequate time to read or act before auto-closing.

## Controlled behavior

- Trigger toasts programmatically via the useToasts() hook—message / success / warning / error each map to a toast kind—available in any component context.
- Toasts auto-dismiss by default; pass preserve={true} to prevent auto-close, requiring the user to dismiss manually.
- Different toast types (.success(), .warning(), .error()) provide corresponding semantic styling and color differentiation.

## Responsive behavior

- Toast notifications automatically adapt their container width on both narrow and wide screens to prevent excessive text truncation.
- On mobile, toasts position in the bottom safe area to avoid overlapping bottom navigation bars or gesture regions.

## Theme behavior

- Different semantic toast types (success, warning, error) each have corresponding color schemes for dark and light modes.
- Toast backgrounds, text colors, and border styles are managed through theme variables, supporting global customization.

## Live Demo

```tsx
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

export function ToastDefault21B111CBExample() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() => toasts.message({ text: "The Evil Rabbit jumped over the fence." })}
      >
        Show Toast
      </Button>
    </>
  );
}
```

## Multi-line

```tsx
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

export function ToastMultiLine15F3E22CExample() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() =>
          toasts.message({
            text: "The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence.",
          })
        }
      >
        Show Toast
      </Button>
    </>
  );
}
```

## With jsx

```tsx
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

export function ToastWithJsx76A6D122Example() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() =>
          toasts.message({
            text: (
              <>
                <span className="text-heading-14">The Evil Rabbit</span> jumped over the fence.
              </>
            ),
            preserve: true,
          })
        }
      >
        Show Toast
      </Button>
    </>
  );
}
```

## With a link

```tsx
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

export function ToastWithALink1C527727Example() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() =>
          toasts.message({
            text: (
              <>
                The Evil Rabbit jumped over the{" "}
                <a
                  href="#/components"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  fence again
                </a>
                .
              </>
            ),
            preserve: true,
          })
        }
      >
        Show Toast
      </Button>
    </>
  );
}
```

## Preserve

```tsx
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

export function ToastPreserve25DFADC0Example() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() =>
          toasts.message({ text: "The Evil Rabbit jumped over the fence.", preserve: true })
        }
      >
        Show Toast
      </Button>
    </>
  );
}
```

## Action

Rabbit position: behind the fence.

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n";

const COPY = {
  en: {
    behind: "Rabbit position: behind the fence.",
    over: "Rabbit position: over the fence.",
  },
  "zh-CN": {
    behind: "兔子位置：栅栏后面。",
    over: "兔子位置：已跳过栅栏。",
  },
} as const;

export function ToastAction64CFF131Example() {
  const toasts = useToasts();
  const { locale } = useI18n();
  const [jumped, setJumped] = useState(false);
  const copy = COPY[locale];

  return (
    <div className="flex w-full flex-col gap-3">
      <Button
        typeName="button"
        onClick={() => {
          setJumped(true);
          toasts.message({
            text: "The Evil Rabbit jumped over the fence.",
            action: "Undo",
            onAction: () => setJumped(false),
          });
        }}
      >
        Show Toast
      </Button>
      <p
        className="text-copy-14 text-muted-foreground"
        data-demo="fence-state"
        data-position={jumped ? "over" : "behind"}
      >
        {jumped ? copy.over : copy.behind}
      </p>
    </div>
  );
}
```

## Undo

Rabbit position: behind the fence.

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n";

const COPY = {
  en: {
    behind: "Rabbit position: behind the fence.",
    over: "Rabbit position: over the fence.",
  },
  "zh-CN": {
    behind: "兔子位置：栅栏后面。",
    over: "兔子位置：已跳过栅栏。",
  },
} as const;

export function ToastUndoA8283ADEExample() {
  const toasts = useToasts();
  const { locale } = useI18n();
  const [jumped, setJumped] = useState(false);
  const copy = COPY[locale];

  return (
    <div className="flex w-full flex-col gap-3">
      <Button
        typeName="button"
        onClick={() => {
          setJumped(true);
          // onUndoAction renders the localized built-in "Undo" label and keeps
          // the toast on screen longer (7s) so the user can actually undo.
          toasts.message({
            text: "The Evil Rabbit jumped over the fence.",
            onUndoAction: () => setJumped(false),
          });
        }}
      >
        Show Toast
      </Button>
      <p
        className="text-copy-14 text-muted-foreground"
        data-demo="fence-state"
        data-position={jumped ? "over" : "behind"}
      >
        {jumped ? copy.over : copy.behind}
      </p>
    </div>
  );
}
```

## Success

```tsx
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

export function ToastSuccessC88A0B90Example() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() => toasts.success("The Evil Rabbit jumped over the fence.")}
      >
        Show Toast
      </Button>
    </>
  );
}
```

## Warning

```tsx
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

export function ToastWarningE981DDAEExample() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() => toasts.warning("The Evil Rabbit jumped over the fence.")}
      >
        Show Toast
      </Button>
    </>
  );
}
```

## Error

```tsx
import { Button } from "@/components/ui/button";
import { useToasts } from "@/components/ui/toast";

export function ToastError54A0E8C1Example() {
  const toasts = useToasts();

  return (
    <>
      <Button
        typeName="button"
        onClick={() => toasts.error("The Evil Rabbit jumped over the fence.")}
      >
        Show Toast
      </Button>
    </>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Toasts, useToasts, createToastStore } from "@/components/ui/toast";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">message</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(options: ToastOptions) =&gt; number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Creates a message toast and returns its numeric ID.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">success</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: ReactNode) =&gt; number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Creates a success toast.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">warning</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: ReactNode) =&gt; number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Creates a warning toast.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: ReactNode) =&gt; number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Creates an error toast.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">dismiss</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(id: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Dismisses a toast by ID.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">store</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ToastStore</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Binds the viewport to an injected store (defaults to the global store).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">createToastStore</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; ToastStore</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Creates an isolated toast store so toast state can be driven externally.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use a toast for non-blocking acknowledgments of user-initiated actions: Domain added, Project archived, Deployment canceled.
- Don’t use a toast alone for billing failures, permission denials, or build failures the user has to triage. Pair a ≤6-word toast (Build failed) with a persistent row carrying the recovery step.
- Default toasts auto-dismiss; pass preserve only when the user must read or act on the message before it disappears.
- Don’t stack toasts to narrate one async flow; emit the success or error toast at the terminal step.
- One sentence, sentence case, no trailing period when the toast is a single sentence.
- Completion toasts follow {Noun} {past-participle}: Blob deleted, Domain added. Never include successfully.
- Error toasts are two sentences with periods and end with a recovery step: Couldn’t verify domain. Try again.
- Pair the toast verb 1:1 with the destructive button verb (Delete Project then Project deleted).
- The toast region announces with aria-live=\\"polite\\"; reserve assertive for blocking errors that interrupt a flow.
