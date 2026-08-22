# Project Banner

Used for temporary, project-wide notifications that require resolution

<!-- GEIST-RENDER-METRICS-START -->

> ⚠️ **2026-08-22 勘察修正（shard-F）**：下方 metrics 的「容器」几何/配色为**过期误采**（采到了外层 demo 卡片）。线上 vercel.com/geist/project-banner 实测：根元素为 `<aside>` **全宽条带**——radius 0、仅上下边框 `border-t/border-b`、`py-2`（8px 0px）、`min-h-[40px]`、高 40px，且 variant 决定整体着色三件套 `bg-{c}-100 border-{c}-400 text-{c}-900`（default=gray / success=blue / warning=amber / error=red）。dark 实测全量值存 shard-F 引用的 pb_all.json。CTA 部分的实测值（pad 4px 0px · r:2px · h:24px · 500 14px/20px · focus-visible banner 变量焦点环）与线上吻合，仍可信。

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Disable" · .focus-visible:!shadow-[var(--banner-focus-color)] · h:24px · pad:4px 0px · 500 14px/20px · fg:#171717 · r:2px
> - **Success**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Disable" · .focus-visible:!shadow-[var(--banner-focus-color)] · h:24px · pad:4px 0px · 500 14px/20px · fg:#00254d · r:2px
> - **Warning**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Undo Rollback" · .focus-visible:!shadow-[var(--banner-focus-color)] · h:24px · pad:4px 0px · 500 14px/20px · fg:#4e2009 · r:2px
> - **Error**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Add Credit Card" · .focus-visible:!shadow-[var(--banner-focus-color)] · h:24px · pad:4px 0px · 500 14px/20px · fg:#391417 · r:2px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Disable" · .focus-visible:!shadow-[var(--banner-focus-color)] · h:24px · pad:4px 0px · 500 14px/20px · fg:#ededed · r:2px
> - **Success**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Disable" · .focus-visible:!shadow-[var(--banner-focus-color)] · h:24px · pad:4px 0px · 500 14px/20px · fg:#ebf6ff · r:2px
> - **Warning**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Undo Rollback" · .focus-visible:!shadow-[var(--banner-focus-color)] · h:24px · pad:4px 0px · 500 14px/20px · fg:#fef3dc · r:2px
> - **Error**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Add Credit Card" · .focus-visible:!shadow-[var(--banner-focus-color)] · h:24px · pad:4px 0px · 500 14px/20px · fg:#feecee · r:2px

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { ProjectBanner } from "@vercel/geistcn/components";
import { IconShieldCheck } from "@vercel/geistcn-assets/icons";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <ProjectBanner
      callToAction={{
        label: "Disable",
        href: `/`,
      }}
      icon={<IconShieldCheck className="shrink-0" />}
      label={<>Attack Challenge Mode is enabled for this project</>}
    />
  );
}
```

## Success

For positive, temporary mitigations put in place to protect a project, e.g., Attack Challenge Mode

```tsx
import type { ProjectBannerProps } from "@vercel/geistcn/components";
import { ProjectBanner } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { IconShieldCheck } from "@vercel/geistcn-assets/icons";

const ProjectBannerVariants: ProjectBannerProps["variant"][] = ["success"];

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
      {ProjectBannerVariants.map((variant) => {
        return (
          <div
            key={variant}
            className="flex flex-col items-stretch justify-start gap-2 flex-initial"
          >
            <div className="flex flex-col items-stretch justify-start gap-2 flex-initial">
              <ProjectBanner
                callToAction={{
                  label: "Disable",
                  href: `/`,
                }}
                icon={<IconShieldCheck className="shrink-0" />}
                label={<>Attack Challenge Mode is enabled for this project</>}
                variant={variant}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

## Warning

When a project is in an exceptional state which requires non-immediate action to exit, e.g., during a rollback

```tsx
import type { ProjectBannerProps } from "@vercel/geistcn/components";
import { ProjectBanner, Tooltip } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { IconRotateCounterClockwise } from "@vercel/geistcn-assets/icons";

const ProjectBannerVariants: ProjectBannerProps["variant"][] = ["warning"];

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
      {ProjectBannerVariants.map((variant) => {
        return (
          <div
            key={variant}
            className="flex flex-col items-stretch justify-start gap-2 flex-initial"
          >
            <div className="flex flex-col items-stretch justify-start gap-2 flex-initial">
              <ProjectBanner
                callToAction={{
                  label: "Undo Rollback",
                  onClick: () => {
                    alert("Button clicked");
                  },
                }}
                icon={<IconRotateCounterClockwise />}
                label={
                  <>
                    This project was rolled back by{" "}
                    <Tooltip
                      className="underline decoration-dashed underline-offset-[5px]"
                      text="Yesterday for project marketing-website"
                    >
                      @johnphamous
                    </Tooltip>
                  </>
                }
                variant={variant}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

## Error

When a project is approaching or experiencing critical downtime which requires immediate attention, e.g., when payment is overdue

```tsx
import type { ProjectBannerProps } from "@vercel/geistcn/components";
import { ProjectBanner } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { IconWarning } from "@vercel/geistcn-assets/icons";

const ProjectBannerVariants: ProjectBannerProps["variant"][] = ["error"];

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
      {ProjectBannerVariants.map((variant) => {
        return (
          <div
            key={variant}
            className="flex flex-col items-stretch justify-start gap-2 flex-initial"
          >
            <div className="flex flex-col items-stretch justify-start gap-2 flex-initial">
              <ProjectBanner
                callToAction={{
                  label: "Add Credit Card",
                  href: `/$`,
                }}
                icon={<IconWarning />}
                label={
                  <>
                    Payment failed, update credit card information before your account is shut down
                  </>
                }
                variant="error"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

## Best Practices

### When to use

- Use Project Banner for project-wide states that need resolution: overdue billing, an active rollback, attack mitigation, an expiring trial blocking deploys.

- Pick Note for inline contextual messages tied to a single field or card, Toast for transient acknowledgments, Modal for confirmations.

- Match variant to severity: error for critical downtime or payment-blocking states, warning for an exceptional state with non-immediate action, success for a positive temporary mitigation, gray for routine project-wide notices.

### Behavior

- Project Banner is non-dismissible by design. If the message can be dismissed without resolving the underlying state, it isn’t banner-worthy; move it to a Note.

- Show one Project Banner at a time. Stacking competing banners drowns the most urgent state.

- Always pass a callToAction that resolves the state. A banner with no route is a dead end.

### Content

- label is one sentence in sentence case that names the impact: Your Pro trial expires in 3 days. Don’t open with Heads up or apologetic preambles.

- callToAction.label is Title Case Verb + Noun and points at the resolver: Update Payment Method, Reactivate Project, Review Tokens.

- Name the affected entity when the project context isn’t obvious from the surrounding chrome (Production deployments are paused on my-project).

- Don’t encode severity in the copy with emoji or interjections; the variant carries that signal.

Was this helpful?
