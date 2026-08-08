# Feedback

Gather text feedback with an associated emotion.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Feedback" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:6px
> - **Inline**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .bg-transparent · h:32px · 400 16px/24px · fg:#4d4d4d · r:50%
>   .py-2.5 · h:100px · pad:10px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
>   "Send" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
> - **Feedback with Select**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Feedback" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:6px
> - **Feedback with metadata**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Feedback" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:6px
> - **Feedback with prefix**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Feedback" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:6px
> - **Feedback with suffix**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Feedback" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:6px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Feedback" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px
> - **Inline**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .bg-transparent · h:32px · 400 16px/24px · fg:#a1a1a1 · r:50%
>   .py-2.5 · h:100px · pad:10px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a
>   "Send" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Feedback with Select**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Feedback" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px
> - **Feedback with metadata**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Feedback" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px
> - **Feedback with prefix**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Feedback" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px
> - **Feedback with suffix**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Feedback" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default

Should only be used on desktop.

```tsx
import { Feedback, Note, NoteContent } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback label="vercel" dryRun />
      </div>
      <div className="flex justify-center xl:hidden">
        <Note>
          <NoteContent>This example is hidden because it is intended for only desktop.</NoteContent>
        </Note>
      </div>
    </>
  );
}
```

## Inline

Was this helpful?

```tsx
import { Feedback } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Feedback dryRun label="vercel" type="inline" />;
}
```

## Feedback with Select

Feedback with pre-defined list of topics.

```tsx
import { Feedback, Note, NoteContent } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback label="vercel" showTopics dryRun />
      </div>
      <div className="flex justify-center xl:hidden">
        <Note>
          <NoteContent>This example is hidden because it is intended for only desktop.</NoteContent>
        </Note>
      </div>
    </>
  );
}
```

## Feedback with metadata

Feedback with arbitrary key-value metadata.

```tsx
import { Feedback, Note, NoteContent } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback
          label="vercel"
          dryRun
          metadata={{
            userId: "user_12345",
            location: "post-checkout",
            orderId: "order_123456",
          }}
        />
      </div>
      <div className="flex justify-center xl:hidden">
        <Note>
          <NoteContent>This example is hidden because it is intended for only desktop.</NoteContent>
        </Note>
      </div>
    </>
  );
}
```

## Feedback with prefix

```tsx
import { Feedback } from "@vercel/geistcn/components";
import { IconFlagPriority } from "@vercel/geistcn-assets/icons";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Feedback dryRun label="vercel" prefix={<IconFlagPriority />} />;
}
```

## Feedback with suffix

```tsx
import { Feedback } from "@vercel/geistcn/components";
import { IconFlagPriority } from "@vercel/geistcn-assets/icons";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Feedback dryRun label="vercel" suffix={<IconFlagPriority />} />;
}
```

## Best Practices

### When to use

- Place Feedback at the end of a page, doc, or completed flow where the user has formed an opinion. Don’t front-load it on a surface the user has only opened.

- Use the topic Select variant when feedback maps to actionable categories the team triages (Bug, Pricing, Documentation); skip it when the open textarea is enough.

- Don’t use Feedback as a substitute for a support form, a bug report intake, or NPS sampling. Those have dedicated surfaces.

### Behavior

- Keep the panel collapsed until the user clicks the trigger; auto-opening derails the work that prompted the feedback.

- Pair the metadata variant with non-PII context (route, build ID, plan, viewport) so the team can reproduce the report without a second round-trip.

- Submit closes the panel and returns focus to the trigger. Don’t replace the panel with a generic acknowledgment toast; the close itself is the acknowledgment.

### Content

- label is Title Case and short. Default Feedback is fine; override only when scoping to a flow: Feedback on Imports, Report a Bug. Don’t end the label with ?.

- copy overrides the prompt header next to the emoji row in sentence case (How did the import go?). Cut please and we’re sorry.

- The textarea placeholder (Your feedback...) is fixed by Geist; don’t try to override it with rich children.

Was this helpful?
