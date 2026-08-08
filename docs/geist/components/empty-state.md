# Empty State

Fill spaces when no content has been added yet, or is temporarily empty due to the nature of the feature and should be designed to prevent confusion.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Empty state Design framework**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Blank slate**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Informational**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Primary Action" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:6px
>   "Learn more" · .cursor-pointer · h:20px · 400 14px/20px · fg:#4d4d4d
>
> **Dark 主题**
>
> - **Empty state Design framework**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Blank slate**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Informational**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Primary Action" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px
>   "Learn more" · .cursor-pointer · h:20px · 400 14px/20px · fg:#a1a1a1

<!-- GEIST-RENDER-METRICS-END -->

## Empty state Design framework

When designed thoughtfully, empty states become an essential part of a smooth user experience, providing enough context to keep users working in a productive way. There are several approaches to explore that will match the needs a developer in different situations:

- Blank Slate - Basic empty state for first run experience

- Informational - Alternative for first use empty state, including in-line CTAs and supplemental documentation links

- Educational - Launch a contextual onboarding flow to gain deeper understanding about that area of the app

- Guide - Starter content that allows users to interact with data and learn the system by tinkering or setting up their environment

```tsx
import { EmptyState, EmptyStateIcon } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { IconChartBarPeak } from "@vercel/geistcn-assets/icons";

export function Component(): JSX.Element {
  return (
    <EmptyState
      description="A message conveying the state of the product."
      icon={<EmptyStateIcon icon={<IconChartBarPeak size={32} />} />}
      title="Title"
    />
  );
}
```

## Blank slate

The most basic empty state should convey the state of the view.

```tsx
import { EmptyState, EmptyStateIcon } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { IconChartBarPeak } from "@vercel/geistcn-assets/icons";

export function Component(): JSX.Element {
  return (
    <EmptyState
      description="A message conveying the state of the product."
      icon={<EmptyStateIcon icon={<IconChartBarPeak size={32} />} />}
      title="Title"
    />
  );
}
```

## Informational

Help users by clearly explaining the benefit and utility of a product or feature, with a call to action and link to more information to help users progress.

Default to showing rather than telling the value of a feature. Certain entry points to a product may call for a unique empty state and a call to upgrade. Informational empty states will include a call to action.

```tsx
import { Button, EmptyState, EmptyStateIcon } from "@vercel/geistcn/components";

import { Link } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { IconChartBarPeak } from "@vercel/geistcn-assets/icons";

export function Component(): JSX.Element {
  return (
    <EmptyState
      description="This should detail the actions you can take on this screen, as well as why it’s valuable."
      icon={<EmptyStateIcon icon={<IconChartBarPeak size={32} />} />}
      title="Title"
    >
      <Button variant="secondary">Primary Action</Button>
      <Link data-zone="dashboard" external href="/" isDifferentZone type="secondary">
        Learn more
      </Link>
    </EmptyState>
  );
}
```

## Best Practices

### When to use

- Pick the variant by what the user needs: no-results for a filtered list that returned zero rows, blank slate or informational for a resource the user hasn’t created, cleared for completed work, permission for role or tier denials, error for a failed load.

- Render the permission and tier-denial variants full-page when the user lands on a route they can’t view. Use a Note only when one tile inside an otherwise-accessible page is gated.

- Don’t put critical persistent warnings here. Empty states vanish when the list populates; persistent warnings belong in Note or the page header.

### Behavior

- The CTA must be a real Button or Link, not an onClick div, so it joins the tab order and exposes a role.

- Cap at one primary CTA, plus one secondary when the first action could legitimately be one of two paths (Import Repository and Deploy Template). Three CTAs is a smell.

- After an async filter change, wrap the region in aria-live="polite" so screen readers announce the new state.

- Don’t auto-launch a tour from the educational variant; pair Start Tour with Skip.

### Content

- title is Title Case (No Logs Match Your Filter); description is sentence case and adds new information instead of restating the title.

- Quote a single typed query verbatim with curly quotes: No logs match “${query}”. Clear the filter to see all logs. For multi-facet filters use the plural template No {Items} Match Your Filters and suggest widening or clearing.

- Onboarding bodies name the next action that creates the first item: Push to your Git repository to create your first one. Tier-gated bodies follow {Feature value} with the {Plan} plan.

- Error variant pairs the body with a copyable request ID and a Try Again button.

- CTA labels are Title Case Verb + Noun. Never Get Started, Continue, or OK.

Was this helpful?
