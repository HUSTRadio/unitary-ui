# Split Button

> Route: `/components/split-button`

Combines a primary action with a short menu of related actions.

[Back to Components](#/components)

# Split Button

split-button

Combines a primary action with a short menu of related actions.

## When to use

- When two or more related actions share the same row (e.g., 'Deploy' and 'Deploy to staging').
- When you need to balance visibility and space — the main action is prominent while secondary variants live in a menu.
- The pull-down card variant (variant="pulldown") takes its anchored corner from expandCorner; when the trigger sits near the bottom of the screen or a toolbar with no room below, use bottom-left / bottom-right to expand the card upward.

## When not to use

- When there are more than three related actions; use a regular Menu instead, because the split-button menu must not become a junk drawer.
- When two actions are equally important; place two side-by-side Buttons rather than a primary-secondary hierarchy.

## Examples

### Basic usage

A split button with a primary action and a basic dropdown menu.

### With icon

Using an icon inside the split button to enhance visual recognition of the action.

### Title with icon

Menu items take a leading icon through the icon prop, aligned with the first line of the title.

### Pull-down card

variant="pulldown" renders the menu as a floating card; expandCorner picks the corner the card stays anchored to — top-left / top-right expand downward (card below the button), while bottom-left / bottom-right expand upward (card above the button). The transform origin is pinned to the anchored corner, so the card scales in from the opposite corner. Use an upward corner when the trigger sits near the bottom of the screen or a toolbar where there is no room below.

## Accessibility

- The menu button should carry a descriptive aria-label (e.g. 'Deploy to staging') instead of relying solely on the chevron icon.
- The main button is a normal focus element; when the menu opens, focus is trapped inside and Escape closes it while returning focus to the trigger.
- Destructive menu items turn red via menuItemProps.type="error" and ask for confirmation before running: the caller wires the confirmation panel in onClick, and it appears outside the menu with a cancel path.

## Controlled behavior

Not applicable: Split Button manages its own open/close internal state and does not expose a controlled API.

## Responsive behavior

- On narrow viewports the split button retains full functionality, but the menu width flips automatically based on window bounds to avoid clipping.

## Theme behavior

- The split button inherits the Button variant system (primary, secondary, error, etc.) so both parts stay visually consistent.

## Live Demo

```tsx
import { SplitButton, SplitButtonMenuItem } from "@/components/ui/split-button";

export function SplitButtonMenuAlignmentAE78EA5CExample() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <SplitButton
        buttonProps={{ type: "default" }}
        menuButtonLabel="Select save method"
        menuItems={
          <>
            <SplitButtonMenuItem description="Save changes" title="Save" />
            <SplitButtonMenuItem
              description="Save changes and create a new production deployment"
              title="Save + Redeploy"
            />
          </>
        }
        menuProps={{ width: 264 }}
      >
        Save (bottom-start)
      </SplitButton>
      <SplitButton
        buttonProps={{ type: "secondary" }}
        menuAlignment="bottom-end"
        menuButtonLabel="Select save method"
        menuItems={
          <>
            <SplitButtonMenuItem description="Save changes" title="Save" />
            <SplitButtonMenuItem
              description="Save changes and create a new production deployment"
              title="Save + Redeploy"
            />
          </>
        }
        menuProps={{ width: 264 }}
      >
        Save (bottom-end)
      </SplitButton>
    </div>
  );
}
```

## Icon

```tsx
import { SplitButton, SplitButtonMenuItem } from "@/components/ui/split-button";
import { ExternalLink, Rocket } from "lucide-react";

export function SplitButtonIconA35ABCD6Example() {
  return (
    <SplitButton
      buttonProps={{ size: "small", type: "secondary" }}
      menuButtonLabel="Copy page"
      menuItems={[
        <SplitButtonMenuItem
          key="v0"
          description="Open this page in v0"
          menuItemProps={{ className: "w-[200px]" }}
          title="Open in v0"
          icon={<Rocket className="size-4" aria-hidden />}
        />,
        <SplitButtonMenuItem
          key="chatgpt"
          description="Open this page in ChatGPT"
          menuItemProps={{ className: "w-[200px]" }}
          title="Open in ChatGPT"
          icon={<ExternalLink className="size-4" aria-hidden />}
        />,
      ]}
      menuProps={{ width: 240 }}
    >
      Copy page
    </SplitButton>
  );
}
```

## Title with Icon

```tsx
import { SplitButton, SplitButtonMenuItem } from "@/components/ui/split-button";
import { CircleArrowUp, Save } from "lucide-react";

export function SplitButtonTitleWithIcon9D4D6961Example() {
  return (
    <div className="flex w-full flex-col gap-8">
      {(["default", "secondary"] as const).map((variant) => (
        <div key={variant} className="flex flex-row gap-1">
          {(["small", "medium", "large"] as const).map((size) => (
            <SplitButton
              key={`${variant}-${size}`}
              buttonProps={{ size, type: variant }}
              menuButtonLabel="Select save method"
              menuItems={
                <>
                  {/* 图标必须走官方 icon prop（MenuItem prefix 槽）：嵌进 title 会让
                      description 顶到图标正下方、不随图标缩进，两行排版错位。 */}
                  <SplitButtonMenuItem
                    description="Save changes"
                    icon={<Save className="size-4" aria-hidden />}
                    title="Save"
                  />
                  <SplitButtonMenuItem
                    description="Save changes and create a new production deployment"
                    icon={<CircleArrowUp className="size-4" aria-hidden />}
                    title="Save + Redeploy"
                  />
                </>
              }
              menuProps={{ width: 264 }}
            >
              Save
            </SplitButton>
          ))}
        </div>
      ))}
    </div>
  );
}
```

## pull-down-card

No command yet.

```tsx
import * as React from "react";

import {
  SplitButton,
  SplitButtonMenuItem,
  type SplitButtonExpandCorner,
} from "@/components/ui/split-button";

const CORNERS: readonly SplitButtonExpandCorner[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

/**
 * Pull-down Button —— split-button 的悬浮卡片变体：
 * 卡片锚定按钮的 expandCorner 角，向对向展开（动画原点即该角）。
 */
export function SplitButtonPullDownCard6B3F1D80Example() {
  const [corner, setCorner] = React.useState<SplitButtonExpandCorner>("top-left");
  const [log, setLog] = React.useState("No command yet.");

  const items = (
    <>
      <SplitButtonMenuItem
        title="New file"
        description="Create a blank file"
        menuItemProps={{ onClick: () => setLog("New file") }}
      />
      <SplitButtonMenuItem
        title="New folder"
        description="Create an empty folder"
        menuItemProps={{ onClick: () => setLog("New folder") }}
      />
      <SplitButtonMenuItem
        title="Import…"
        description="Bring in an existing project"
        menuItemProps={{ onClick: () => setLog("Import…") }}
      />
    </>
  );

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <SplitButton
        variant="pulldown"
        expandCorner={corner}
        buttonProps={{ type: "secondary", onClick: () => setLog("New file (default)") }}
        menuItems={items}
      >
        New
      </SplitButton>
      <div className="flex flex-wrap gap-1">
        {CORNERS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setCorner(value)}
            className={
              value === corner
                ? "rounded-md bg-gray-alpha-200 px-2 py-1 text-label-13 text-gray-1000"
                : "rounded-md px-2 py-1 text-label-13 text-gray-900 hover:bg-gray-alpha-100"
            }
          >
            {value}
          </button>
        ))}
      </div>
      <p className="text-copy-13 text-gray-900">{log}</p>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { SplitButton, SplitButtonMenuItem } from "@/components/ui/split-button";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">buttonProps</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ButtonProps</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Props for the primary action button.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuButtonLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Accessible label for the menu trigger.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"More options"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuButtonDisabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Disables the menu trigger only (the primary action stays enabled).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuAlignment</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SplitButtonMenuAlignment</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Places the menu below the primary or menu button edge.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"bottom-start"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">variant</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SplitButtonVariant</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">"split" renders a button plus menu list; "pulldown" renders a floating card that expands from a corner.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"split"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">expandCorner</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SplitButtonExpandCorner</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Corner the pulldown card stays anchored to; the card expands toward the opposite corner. top-* expands downward with the card below the button; bottom-* expands upward with the card above it.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"top-left"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuItems</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Secondary menu items.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuProps</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ComponentProps&lt;typeof Menu&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Props forwarded to the menu surface.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Menu item title.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">description</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Menu item description.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">icon</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Menu item icon.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuItemProps</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Omit&lt;ComponentProps&lt;typeof MenuItem&gt;, "children" | "prefix" | "suffix"&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Props forwarded to a menu item.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Keep the most common action on the main button and limit the menu to closely related variants.
- Label the menu button with the target and purpose, not the chevron icon.
