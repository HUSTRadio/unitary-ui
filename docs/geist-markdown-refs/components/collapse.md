# Collapse

A set of headings, vertically stacked, that each reveal an related section of content. Commonly referred to as an accordion.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Question A" · .geist-reset · h:84px · 600 24px/36px · fg:#171717
>   "Question B" · .geist-reset · h:84px · 600 24px/36px · fg:#171717
> - **Expanded**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Question A" · .geist-reset · h:84px · 600 24px/36px · fg:#171717
>   "Question B" · .geist-reset · h:84px · 600 24px/36px · fg:#171717
> - **Multiple**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Question A" · .geist-reset · h:84px · 600 24px/36px · fg:#171717
>   "Question B" · .geist-reset · h:84px · 600 24px/36px · fg:#171717
> - **Small**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Question A" · .geist-reset · h:48px · 500 16px/24px · fg:#171717
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Question A" · .geist-reset · h:84px · 600 24px/36px · fg:#ededed
>   "Question B" · .geist-reset · h:84px · 600 24px/36px · fg:#ededed
> - **Expanded**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Question A" · .geist-reset · h:84px · 600 24px/36px · fg:#ededed
>   "Question B" · .geist-reset · h:84px · 600 24px/36px · fg:#ededed
> - **Multiple**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Question A" · .geist-reset · h:84px · 600 24px/36px · fg:#ededed
>   "Question B" · .geist-reset · h:84px · 600 24px/36px · fg:#ededed
> - **Small**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Question A" · .geist-reset · h:48px · 500 16px/24px · fg:#ededed

<!-- GEIST-RENDER-METRICS-END -->

## Default

### Question A

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Question B

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

```tsx
import { Collapse, CollapseGroup } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <CollapseGroup>
      <Collapse title="Question A">
        <p className="text-copy-16 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </Collapse>
      <Collapse title="Question B">
        <p className="text-copy-16 mb-4">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </p>
      </Collapse>
    </CollapseGroup>
  );
}
```

## Expanded

### Question A

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Question B

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

```tsx
import { Collapse, CollapseGroup } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <CollapseGroup>
      <Collapse title="Question A">
        <p className="text-copy-16 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </Collapse>
      <Collapse defaultExpanded title="Question B">
        <p className="text-copy-16 mb-4">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </p>
      </Collapse>
    </CollapseGroup>
  );
}
```

## Multiple

### Question A

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Question B

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

```tsx
import { Collapse, CollapseGroup } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <CollapseGroup multiple>
      <Collapse title="Question A">
        <p className="text-copy-16 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </Collapse>
      <Collapse title="Question B">
        <p className="text-copy-16 mb-4">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </p>
      </Collapse>
    </CollapseGroup>
  );
}
```

## Small

### Question A

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

```tsx
import { Collapse } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Collapse size="small" title="Question A">
      <p className="text-copy-16 mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    </Collapse>
  );
}
```

## Best Practices

### When to use

- Use Collapse for optional, advanced, or repetitive content that most users skip on most visits (FAQ, advanced settings, request payload preview).

- For top-level structure that every user reads, use page sections with regular headings; collapsing primary content hides what the page is about.

- Single Collapse for one optional block. CollapseGroup for a related set; switch to Tabs when the items are sibling views, not optional drill-downs.

### Behavior

- Default state is closed unless the first-time visitor must read the content to act.

- Inside a CollapseGroup, allow only one panel open at a time when items are mutually exclusive; allow multiple when items are independent.

- Animate the open/close transition; jump-cuts make the page feel like it teleported.

- Don’t nest Collapse more than one level deep. Two-level nesting hides too much and breaks the keyboard tab path.

### Content

- Heading is Title Case and names the topic, not the action (Advanced Settings, not Show Advanced Settings).

- Body is sentence case prose with normal section formatting; treat the panel as a small page, not a tooltip.

- Don’t put primary destructive actions inside a closed Collapse; the user has to click twice to reach the warning.

### Accessibility

- The trigger is a <button> with aria-expanded that flips on toggle and aria-controls pointing at the panel id.

- Enter and Space toggle. Don’t bind any other key globally; arrow keys move focus inside the panel content.

- Render the panel content in the DOM when closed (with hidden or visibility) so search and find-in-page still hit it; lazy-render only for expensive content.

Was this helpful?
