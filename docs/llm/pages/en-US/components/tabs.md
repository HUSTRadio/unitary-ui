# Tabs

> Route: `/components/tabs`

Organizes content into switchable panels.

[Back to Components](#/components)

# Tabs

Tabs

Organizes content into switchable panels.

## When to use

- Switch between sibling views inside a single page (Overview, Logs, Settings) where all views share the same scope and data model.
- When deep-linking and refresh preservation via URL state (query param or path segment) keeps the current view in sync.
- Display multiple related sections side by side under a shared parent container without requiring full page navigation.

## When not to use

- Do not use Tabs for navigation between unrelated pages—use a sub-menu or regular links instead; Tabs imply shared context.
- Do not crowd more than 5–7 tabs on desktop or 3–4 on mobile into a single row; consolidate or move secondary views behind a Menu.
- Tabs are not suitable for global site navigation—they are scoped to intra-page section switching only.

## Examples

### Default tabs

Displays a multi-tab panel with default styling and smooth transition between views.

### With icons

Showcases adding icons to each tab label for enhanced visual identification and quick scanning.

### Secondary style

Demonstrates the Secondary mode for de-emphasized content grouping and less prominent view switching.

## Accessibility

- Label the tablist with aria-label when no visible heading sits above it (e.g. aria-label='Sections'), so screen readers identify the purpose.
- Left/Right arrows move focus across tabs, Enter or Space activates; do not hijack these keyboard shortcuts for global operations.
- Always maintain a visible focus ring on the active tab—do not suppress focus styles for visual polish.

## Controlled behavior

- Control the active tab with the required selected and setSelected props; selected uses a tab item's id rather than its array index.
- For URL persistence, synchronize route state from the caller's setSelected update path.
- Disabled tabs hide interactivity via the disabled prop and should be paired with a Tooltip explaining the constraint (permissions insufficient or empty data).

## Responsive behavior

- On mobile, limit tabs to 3–4; beyond that, move secondary views behind a Menu dropdown.
- The tab row keeps fixed typography and gaps and scrolls horizontally when it exceeds the available width; it does not compress those styles automatically.

## Theme behavior

- Tab colors, underline indicators, and activation highlights follow theme variables with corresponding palettes for dark and light modes.
- Secondary mode automatically adjusts to lower-contrast variant colors that adapt across themes.

## Live Demo

```tsx
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

export function TabsDefault21B111CBExample() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="w-full max-w-xl">
      <Tabs
        tabs={[
          { value: "overview", title: "Overview" },
          { value: "usage", title: "Usage" },
          { value: "api", title: "API" },
        ]}
        selected={tab}
        setSelected={setTab}
        ariaLabel="Component documentation"
      />
    </div>
  );
}
```

## Disabled

```tsx
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

export function TabsDisabled75081B59Example() {
  const [selected, setSelected] = useState("apple");

  return (
    <Tabs
      disabled
      selected={selected}
      setSelected={setSelected}
      tabs={[
        { title: "Apple", value: "apple" },
        { title: "Orange", value: "orange" },
        { title: "Mango", value: "mango" },
      ]}
      ariaLabel="Disabled tabs"
    />
  );
}
```

## Disable specific tabs

```tsx
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

export function TabsDisableSpecificTabsA4195A7DExample() {
  const [selected, setSelected] = useState("apple");

  return (
    <Tabs
      selected={selected}
      setSelected={setSelected}
      tabs={[
        { title: "Apple", value: "apple" },
        { title: "Orange", value: "orange" },
        { title: "Mango", value: "mango", disabled: true, tooltip: "Mangos are not allowed" },
      ]}
      ariaLabel="Tabs with disabled tab"
    />
  );
}
```

## With icons

```tsx
import { Tabs } from "@/components/ui/tabs";
import { LayoutGrid } from "lucide-react";
import { useState } from "react";

export function TabsWithIcons1F71F4BCExample() {
  const [selected, setSelected] = useState("github");

  return (
    <Tabs
      selected={selected}
      setSelected={setSelected}
      tabs={[
        { title: "GitHub", value: "github", icon: <LayoutGrid className="size-4" aria-hidden /> },
        { title: "GitLab", value: "gitlab" },
        { title: "Bitbucket", value: "bitbucket" },
      ]}
      ariaLabel="Tabs with icons"
    />
  );
}
```

## Secondary

```tsx
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

export function TabsSecondary62F2CCFFExample() {
  const [selected, setSelected] = useState("github");

  return (
    <Tabs
      variant="secondary"
      selected={selected}
      setSelected={setSelected}
      tabs={[
        { title: "GitHub", value: "github" },
        { title: "GitLab", value: "gitlab" },
        { title: "Bitbucket", value: "bitbucket", disabled: true },
      ]}
      ariaLabel="Secondary tabs"
    />
  );
}
```

## Compact

```tsx
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

export function TabsCompactB6B54201Example() {
  const [selected, setSelected] = useState("apple");

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        selected={selected}
        setSelected={setSelected}
        tabs={[
          { title: "Apple", value: "apple" },
          { title: "Orange", value: "orange" },
          { title: "Mango", value: "mango" },
        ]}
        compact
        ariaLabel="Compact tabs"
      />
      <Tabs
        selected={selected}
        setSelected={setSelected}
        tabs={[
          { title: "GitHub", value: "github" },
          { title: "GitLab", value: "gitlab" },
          { title: "Bitbucket", value: "bitbucket" },
        ]}
        variant="secondary"
        compact
        ariaLabel="Compact secondary tabs"
      />
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Tabs } from "@/components/ui/tabs";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">selected</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled selected tab.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">setSelected</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives tab selection.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Tabs to switch between sibling views inside a single page (Overview, Logs, Settings).
- For navigation between unrelated pages, use a sub-menu, not Tabs. Tabs imply the views share scope, URL parent, and data model.
- Cap a Tabs row at 5–7 entries on desktop and 3–4 on mobile. Past that, consolidate or move secondary views behind a Menu.
- Selecting a tab is instant; don’t trigger network confirmation or toast on tab change.
- Reflect the active tab in the URL (query param or path) so deep-links and refresh restore state.
- Disable individual tabs only for permission or empty-state reasons; pair the disabled tab with a tooltip that names the constraint.
- tabs\[\].title is Title Case, 1–2 words, and names the destination noun (Overview, Logs, Settings). Verbs belong on buttons; View Logs is wrong on a tab.
- tabs\[\].tooltip is sentence case and explains the constraint (Only visible to project owners.), not the tab’s purpose.
- Don’t append a count to the title (Logs (12)); use a badge slot instead and drop the badge at zero.
- Keep Left/Right arrows moving focus across tabs and Enter/Space activating; don’t hijack with global shortcuts.
- Label the tablist with aria-label when no visible heading sits above it (aria-label="Sections").
- Maintain a visible focus ring on the active tab; don’t suppress focus styles for visual polish.
