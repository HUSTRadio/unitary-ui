# Status Dot

Display an indicator of deployment status.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Label**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Label**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { StatusDot } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
      <StatusDot state="QUEUED" />
      <StatusDot state="BUILDING" />
      <StatusDot state="ERROR" />
      <StatusDot state="READY" />
      <StatusDot state="CANCELED" />
    </div>
  );
}
```

## Label

```tsx
import { StatusDot } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
      <StatusDot label state="QUEUED" />
      <StatusDot label state="BUILDING" />
      <StatusDot label state="ERROR" />
      <StatusDot label state="READY" />
      <StatusDot label state="CANCELED" />
    </div>
  );
}
```

## Best Practices

### When to use

- Deployment lifecycle only. state accepts QUEUED | BUILDING | READY | ERROR | CANCELED | DELETED.

- For non-deployment statuses (Workflow runs, Queue messages, Sandbox, Cron jobs), use a Badge with the canonical state vocabulary instead of repurposing the dot.

- For health summaries that need a number (uptime, hit rate), use Gauge; for in-flight work with a knowable total, use Progress.

### Behavior

- The dot animates while BUILDING or QUEUED and goes static once the deployment reaches a terminal state. Don’t add a separate spinner alongside it.

- Don’t flash the color through every transitional state on a polling tick; only update when the readyState changes.

- Pair with RelativeTimeCard when timing matters (Building · 12s ago); the dot alone doesn’t convey duration.

### Content

- titlePrefix is a noun phrase, not a sentence. Default "This deployment" works for single-deployment surfaces; in lists, pass the entity (titlePrefix="vercel-site production"). Don’t end with a verb or punctuation.

- Use label only when the dot stands alone without surrounding text; Geist sentence-cases the state for you (Building, Ready, Error).

- Don’t wrap the dot in extra prose like Status: Ready. The label already names the state.

### Accessibility

- The component composes its own aria-label from titlePrefix plus the state message; don’t override it with a generic aria-label="status".

- When the dot sits inline with text that already names the state, mark the dot decorative with aria-hidden so screen readers don’t announce it twice.

- Color is not the only signal: every state ships with a distinct title and label so colorblind users get the same information.

Was this helpful?
