# Hamburger Menu

> Route: `/components/hamburger-menu`

An expandable navigation menu with grouped links and built-in search.

[Back to Components](#/components)

# Hamburger Menu

hamburger-menu

An expandable navigation menu with grouped links and built-in search.

## When to use

- Use it for expandable navigation in a compact page header.

## When not to use

- Use SidebarNav for a persistent desktop rail and MenuBar for application commands.

## Examples

### Expandable navigation

Open the menu, switch between items, empty and loading data, or search for an unmatched item.

## Accessibility

- The trigger has an accessible name; Escape closes the menu and returns focus.
- Empty navigation and unmatched search expose role=status; the loading state marks navigation aria-busy and shows a status indicator.

## Controlled behavior

- Use open with onOpenChange for controlled state; omit open for internal state.
- Set loading while data loads; emptyMessage optionally overrides both empty-navigation and unmatched-search messages.

## Responsive behavior

- Both anchors default to downward expansion; sidebars may specify left or right, with configurable size limits. A positioned container keeps the panel and backdrop within a local frame.

## Theme behavior

- The panel and links use shared semantic color tokens.

## Live Demo

Open the menu to explore the links or search for a missing item.

```tsx
import { useState } from "react";
import { HamburgerMenu } from "@/components/ui/hamburger-menu";

const items = [
  { label: "Overview", to: "/overview" },
  { label: "Projects", to: "/projects" },
  { label: "Settings", to: "/settings" },
];

export default function HamburgerMenuExample() {
  const [activeTo, setActiveTo] = useState("/overview");
  const [state, setState] = useState<"ready" | "empty" | "loading">("ready");
  return (
    <div className="flex min-h-72 w-full flex-col gap-4 rounded-xl border border-border bg-background p-5">
      <div className="flex items-center gap-4">
        <HamburgerMenu
          anchor="topbar"
          items={state === "ready" ? items : []}
          loading={state === "loading"}
          activeTo={activeTo}
          onNavigate={setActiveTo}
        />
        <span className="text-sm text-muted-foreground">
          Open the menu to explore the links or search for a missing item.
        </span>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Navigation data state">
        {(["ready", "empty", "loading"] as const).map((next) => (
          <button
            key={next}
            type="button"
            aria-pressed={state === next}
            onClick={() => setState(next)}
            className="rounded-md border border-border px-3 py-2 text-sm text-foreground aria-pressed:bg-gray-100"
          >
            {next === "ready" ? "Items" : next === "empty" ? "Empty" : "Loading"}
          </button>
        ))}
      </div>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { HamburgerMenu } from "@/components/ui/hamburger-menu";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">anchor</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"topbar" | "sidebar"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Chooses the trigger context; both anchors open downward by default.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">anchorElement</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Element used to position the panel below a topbar.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">container</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional positioned container for the panel and backdrop; defaults to the viewport.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">direction</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"down" | "left" | "right"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Expansion direction; topbar defaults to down.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">items</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MenuItem[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Flat navigation and search source.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">groups</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MenuGroup[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Grouped navigation and search source.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows a loading status and marks navigation as busy while data loads.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">emptyMessage</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional message for an empty navigation or no search results.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">activeTo</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Current route for aria-current and highlighting.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onNavigate</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(to: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called when a navigation item is selected.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled open state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports open-state changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disableSearch</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Hides the built-in search field.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">searchMode</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"query" | "toolbar"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Search by query or input focus.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"query"</td></tr></tbody></table>
