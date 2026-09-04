# Project Banner

> Route: `/components/project-banner`

Used for temporary, project-wide notifications that require resolution.

[Back to Components](#/components)

# Project Banner

Project Banner

Used for temporary, project-wide notifications that require resolution.

## When to use

- Reach for Project Banner for project-wide states that need resolution: overdue billing, an active rollback, attack mitigation, or an expiring trial blocking deploys.
- Match variant to severity: error for critical downtime or payment-blocking states, warning for an exceptional state with non-immediate action, success for a positive temporary mitigation, gray for routine project-wide notices.
- Always provide an action that resolves the state; a banner with no route to resolution is a dead end.

## When not to use

- Do not use Project Banner for messages that can be dismissed without resolving the underlying state—if it can be ignored, it is not banner-worthy.
- Do not stack multiple Project Banners on a single page—show only one at a time; competing banners drown the most urgent state.
- Do not use it for inline contextual warnings tied to a single field—use Note instead.

## Examples

### Default banner

Displays the default Project Banner appearance and basic structure.

### Error state

Showcases the error variant for critical issues such as downtime or payment blocks.

## Accessibility

- Project Banner renders a plain aside by default. Pass role and aria-live explicitly when the message needs alert or status announcement.
- Action buttons on the banner should have explicit action labels following the Title Case Verb + Noun pattern (e.g., Update Payment Method).
- For critical business states, the caller can pass role="alert" or aria-live="assertive"; variant does not infer these attributes.

## Controlled behavior

Not applicable: ProjectBanner does not manage dismiss state. Compose ProjectBannerClose with an explicit onClick when the caller owns close behavior.

## Responsive behavior

- Project Banner spans the full width of its container and adjusts padding and font scaling automatically on smaller screens for readability.
- On mobile devices, the banner height is reduced and action buttons may switch from inline to a stacked layout to ensure sufficient touch targets.

## Theme behavior

- Different severity variants (error, warning, success, gray) have distinct color palettes in both dark and light modes.
- Background and border colors are managed centrally through theme variables, enabling a global theme update to cascade to all banners.

## Live Demo

```tsx
import { ProjectBanner } from "@/components/ui/project-banner";
import { ShieldCheck } from "lucide-react";

export function ProjectBannerDefault21B111CBExample() {
  return (
    <ProjectBanner
      callToAction={{
        label: "Disable",
        href: "/",
      }}
      icon={<ShieldCheck className="shrink-0" />}
      label={<>Attack Challenge Mode is enabled for this project</>}
    />
  );
}
```

## Success

```tsx
import { ProjectBanner } from "@/components/ui/project-banner";
import { ShieldCheck } from "lucide-react";

export function ProjectBannerSuccessC88A0B90Example() {
  return (
    <ProjectBanner
      callToAction={{
        label: "Disable",
        href: "/",
      }}
      icon={<ShieldCheck className="shrink-0" />}
      label={<>Attack Challenge Mode is enabled for this project</>}
      variant="success"
    />
  );
}
```

## Warning

```tsx
import { ProjectBanner } from "@/components/ui/project-banner";
import { Tooltip } from "@/components/ui/tooltip";
import { RotateCcw } from "lucide-react";

export function ProjectBannerWarningE981DDAEExample() {
  return (
    <ProjectBanner
      callToAction={{
        label: "Undo Rollback",
        onClick: () => {
          alert("Button clicked");
        },
      }}
      icon={<RotateCcw />}
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
      variant="warning"
    />
  );
}
```

## Error

```tsx
import { ProjectBanner } from "@/components/ui/project-banner";
import { TriangleAlert } from "lucide-react";

export function ProjectBannerError54A0E8C1Example() {
  return (
    <ProjectBanner
      callToAction={{
        label: "Add Credit Card",
        href: "/$",
      }}
      icon={<TriangleAlert />}
      label={<>Payment failed, update credit card information before your account is shut down</>}
      variant="error"
    />
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import {
  ProjectBanner,
  ProjectBannerContent,
  ProjectBannerClose,
} from "@/components/ui/project-banner";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">variant</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ProjectBannerVariant</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Banner emphasis.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Project Banner for project-wide states that need resolution: overdue billing, an active rollback, attack mitigation, an expiring trial blocking deploys.
- Pick Note for inline contextual messages tied to a single field or card, Toast for transient acknowledgments, Modal for confirmations.
- Match variant to severity: error for critical downtime or payment-blocking states, warning for an exceptional state with non-immediate action, success for a positive temporary mitigation, gray for routine project-wide notices.
- ProjectBanner does not own dismiss state. When dismissal is appropriate, compose ProjectBannerClose with a caller-managed onClick; otherwise move ignorable messages to a Note.
- Show one Project Banner at a time. Stacking competing banners drowns the most urgent state.
- Always provide an action that resolves the state; a banner with no route is a dead end.
- label is one sentence in sentence case that names the impact; the action label is Title Case Verb + Noun (Update Payment Method, Review Tokens).
