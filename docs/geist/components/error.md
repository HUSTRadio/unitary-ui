# Error

Good error design is clear, useful, and friendly. Designing concise and accurate error messages unblocks users and builds trust by meeting people where they are.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Custom label**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **No label**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Sizes**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **With an error property**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Contact Us" · .cursor-pointer · h:20px · 500 14px/20px · fg:#cb2a2f
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Custom label**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **No label**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Sizes**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **With an error property**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Contact Us" · .cursor-pointer · h:20px · 500 14px/20px · fg:#ff6166

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Error } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Error>This email address is already in use.</Error>;
}
```

## Custom label

```tsx
import { Error } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Error label="Email Error">This email address is already in use.</Error>;
}
```

## No label

```tsx
import { Error } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Error label={false}>This email address is already in use. </Error>;
}
```

## Sizes

```tsx
import { Error as GeistError } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col md:flex-row items-stretch justify-start gap-6 flex-initial">
      <GeistError size="small">This email is in use.</GeistError>
      <GeistError>This email is in use.</GeistError>
      <GeistError size="large">This email is in use.</GeistError>
    </div>
  );
}
```

## With an error property

```tsx
import { Error } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Error
      error={{
        message: "The request failed.",
        action: "Contact Us",
        link: "https://vercel.com/contact",
      }}
    />
  );
}
```

## Best Practices

### When to use

- Use the Error component as a block surface when a section or page-level resource failed to load: a panel, a dashboard card, a route boundary.

- Pick toasts.error() for transient action failures (Couldn’t save settings. Try again.) and the error prop on Input for field-level validation. Don’t replace either with this block.

- Always pair platform or system errors with a stable identifier (request ID x-vercel-id, deployment ID dpl_…, run ID, trace ID). Validation and permission denials are user-state, not system, and don’t need an ID.

### Behavior

- The recovery action must do something concrete: a Try Again button when the operation is retry-safe, a named verb (Reconnect GitHub, Update Payment Method) when it isn’t.

- Don’t auto-retry in the background; the user came to this surface to decide.

- For full-page route errors (error.tsx), return focus to the Try Again button on appearance so a keyboard user can retry without hunting for it.

### Content

- State what happened and what to do next, in that order. Cut apologetic preambles (Unfortunately, Oops, We’re sorry).

- Use Couldn’t or Can’t for user-state errors (Couldn’t verify your passkey. Try again.); use Failed to for system or infra errors that mirror CLI output (Build failed. Bundle exceeds 50 MB.). Unable to is banned.

- Don’t fall back to Something Went Wrong as a title; name the resource that failed (Couldn’t Load Page, Couldn’t Load Deployments).

- Render the stable ID on a monospace sub-line under a collapsed <details> so the user can copy-paste it into a support thread.

- Never humor an error. Users hitting an error are frustrated; insincere copy makes it worse.

### Accessibility

- When the error appears asynchronously (after a failed fetch), wrap the region in aria-live="polite" so it’s announced. Reserve aria-live="assertive" for true blocking errors that interrupt input.

Was this helpful?
