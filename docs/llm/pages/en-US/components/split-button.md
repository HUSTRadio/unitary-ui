# Split Button

> Route: `/components/split-button`

Combines a primary action with a short menu of related actions.

[Back to Components](#/components)

# Split Button

Split Button

Combines a primary action with a short menu of related actions.

## When to use

- When two or more related actions share the same row (e.g., 'Deploy' and 'Deploy to staging').
- When you need to balance visibility and space — the main action is prominent while secondary variants live in a menu.

## When not to use

- When there are more than three related actions; use a regular Menu instead, because the split-button menu must not become a junk drawer.
- When two actions are equally important; place two side-by-side Buttons rather than a primary-secondary hierarchy.

## Examples

### Basic usage

A split button with a primary action and a basic dropdown menu.

### With icon

Using an icon inside the split button to enhance visual recognition of the action.

### Title with icon

Displaying both text and icon alongside the button label simultaneously.

## Accessibility

- The menu button should carry a descriptive aria-label (e.g. 'Deploy to staging') instead of relying solely on the chevron icon.
- The main button is a normal focus element; when the menu opens, focus is trapped inside and Escape closes it while returning focus to the trigger.

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
                  <SplitButtonMenuItem
                    description="Save changes"
                    title={
                      <span className="flex items-center gap-2">
                        <Save className="size-4" aria-hidden /> Save
                      </span>
                    }
                  />
                  <SplitButtonMenuItem
                    description="Save changes and create a new production deployment"
                    title={
                      <span className="flex items-center gap-2">
                        <CircleArrowUp className="size-4" aria-hidden /> Save + Redeploy
                      </span>
                    }
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

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import {
  SplitButton,
  SplitButtonMain,
  SplitButtonMenu,
  SplitButtonMenuItem,
} from "@/components/ui/split-button";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">buttonProps</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ButtonProps</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Props for the primary action button.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuButtonLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Accessible label for the menu trigger.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"More options"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuAlignment</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SplitButtonMenuAlignment</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Places the menu below the primary or menu button edge.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"bottom-start"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuItems</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Secondary menu items.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuProps</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ComponentProps&lt;typeof Menu&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Props forwarded to the menu surface.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Menu item title.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">description</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Menu item description.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">icon</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Menu item icon.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuItemProps</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Omit&lt;ComponentProps&lt;typeof MenuItem&gt;, "children" | "prefix" | "suffix"&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Props forwarded to a menu item.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Keep the most common action on the main button and limit the menu to closely related variants.
- Label the menu button with the target and purpose, not the chevron icon.
