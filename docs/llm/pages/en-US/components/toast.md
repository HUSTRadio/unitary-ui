# Toast

> Route: `/components/toast`

A succinct message that is displayed temporarily.

[Back to Components](#/components)

# Toast

Toast

A succinct message that is displayed temporarily.

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

- Trigger toasts programmatically by calling methods on the useToasts() hook (.show()), making it available in any component context.
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
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() => toasts.message({ text: "The Evil Rabbit jumped over the fence." })}
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## Multi-line

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

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
  <Toasts />
</>;
```

## With jsx

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

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
  <Toasts />
</>;
```

## With a link

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

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
  <Toasts />
</>;
```

## Preserve

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() =>
      toasts.message({ text: "The Evil Rabbit jumped over the fence.", preserve: true })
    }
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## Action

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() =>
      toasts.message({ text: "The Evil Rabbit jumped over the fence.", action: "Undo" })
    }
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## Undo

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() =>
      toasts.message({
        text: "The Evil Rabbit jumped over the fence.",
        onUndoAction: () => undefined,
      })
    }
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## Success

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() => toasts.success("The Evil Rabbit jumped over the fence.")}
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## Warning

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button
    typeName="button"
    onClick={() => toasts.warning("The Evil Rabbit jumped over the fence.")}
  >
    Show Toast
  </Button>
  <Toasts />
</>;
```

## Error

```tsx
import { Button } from "@/components/ui/button";
import { Toasts, useToasts } from "@/components/ui/toast";

const toasts = useToasts();

<>
  <Button typeName="button" onClick={() => toasts.error("The Evil Rabbit jumped over the fence.")}>
    Show Toast
  </Button>
  <Toasts />
</>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Toasts, useToasts } from "@/components/ui/toast";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">message</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(options: ToastOptions) =&gt; number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Creates a message toast and returns its numeric ID.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">success</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: ReactNode) =&gt; number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Creates a success toast.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">warning</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: ReactNode) =&gt; number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Creates a warning toast.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: ReactNode) =&gt; number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Creates an error toast.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">dismiss</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(id: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Dismisses a toast by ID.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

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
