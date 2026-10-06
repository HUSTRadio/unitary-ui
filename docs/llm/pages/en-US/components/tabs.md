# Tabs

> Route: `/components/tabs`

Switch between related views, such as overview and logs, within a page.

[Back to Components](#/components)

# Tabs

tabs

Switch between related views, such as overview and logs, within a page.

## When to use

- Switch between related views, such as overview, logs, and settings, within a page.
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

### Active-tab scroll tracking

Compare disabled, on-reload and always; select a tab externally, reload the demo and switch text direction.

## Accessibility

- Label the tablist with aria-label when no visible heading sits above it (e.g. aria-label='Sections'), so screen readers identify the purpose.
- Left/Right arrows move focus across tabs, Enter or Space activates; do not hijack these keyboard shortcuts for global operations.
- Always maintain a visible focus ring on the active tab—do not suppress focus styles for visual polish.
- Scroll tracking does not move keyboard focus; reduced-motion preferences make alignment immediate.
- The underline does not take focus. Reduced motion positions it immediately; enabling that preference during a slide cancels the current motion.

## Controlled behavior

- Control the active tab with the required selected and setSelected props; selected uses a tab item's id rather than its array index.
- The primary underline slides smoothly within the same tab row and adapts to the target tab width. Initial display positions immediately; rapid changes continue from the current visible position. Selection updates immediately and sliding requires no additional props.
- For URL persistence, synchronize route state from the caller's setSelected update path.
- Disabled tabs hide interactivity via the disabled prop and should be paired with a Tooltip explaining the constraint (permissions insufficient or empty data).
- scrollTracking is an optional Unitary extension typed as ScrollTrackingMode and defaults to disabled. on-reload attempts alignment once after the initial mount and DOM layout readiness; later selected changes do not trigger tracking. always updates position when entering that mode and when the selected value changes.
- Restore selected from the URL in the caller before tracking the active tab; the component does not parse routes or anchors. Manual scrolling interrupts the current animation and still consumes the on-reload attempt. always does not continually lock the position for the same active value.

## Responsive behavior

- On mobile, limit tabs to 3–4; beyond that, move secondary views behind a Menu dropdown.
- The tab row keeps fixed typography and gaps and scrolls horizontally when it exceeds the available width; it does not compress those styles automatically.
- Tracking prefers 16px inside the horizontal start edge. If preceding tab text or icons would remain visible, the spacing scale reduces the inset to 8px, 4px and so on. RTL uses the right start edge. The target is clamped to the available scroll range, so end items may not fully align.

## Theme behavior

- Tab colors, underline indicators, and activation highlights follow theme variables with corresponding palettes for dark and light modes.
- Secondary mode automatically adjusts to lower-contrast variant colors that adapt across themes.
- The primary underline retains its foreground color; sliding reuses --uni-motion-state (250ms by default) and the nonlinear --ease-snap curve.
- Scroll tracking reuses --uni-motion-state (250ms by default) and the nonlinear --ease-in-out curve; both themes share these motion tokens.

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

## Scroll tracking

Tracking mode

Active tab

Direction

Choose an active tab above to compare modes. Change direction and reload to observe start-edge alignment. You can also scroll the tab row manually.

For the vertical equivalent, see [SidebarNav documentation](#/components/sidebar-nav).

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Select, SelectItem } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import type { ScrollTrackingMode } from "@/lib";

export default function TabsScrollTrackingExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  const [mode, setMode] = useState<ScrollTrackingMode>("on-reload");
  const [selected, setSelected] = useState("view-6");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [mount, setMount] = useState(0);
  const tabs = Array.from({ length: 12 }, (_, index) => ({
    title: `${zh ? "视图" : "View"} ${index + 1}`,
    value: `view-${index + 1}`,
  }));

  return (
    <div data-slot="tabs-scroll-tracking-demo" className="w-full max-w-xl space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div data-slot="scroll-tracking-mode">
          <Select
            label={zh ? "跟踪模式" : "Tracking mode"}
            value={mode}
            onValueChange={(value) => setMode(value as ScrollTrackingMode)}
          >
            <SelectItem value="disabled">{zh ? "禁用" : "Disabled"}</SelectItem>
            <SelectItem value="on-reload">{zh ? "载入时" : "On reload"}</SelectItem>
            <SelectItem value="always">{zh ? "始终跟踪" : "Always"}</SelectItem>
          </Select>
        </div>
        <div data-slot="scroll-tracking-target">
          <Select
            label={zh ? "活动标签" : "Active tab"}
            value={selected}
            onValueChange={setSelected}
          >
            {tabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.title}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div data-slot="scroll-tracking-direction">
          <Select
            label={zh ? "文字方向" : "Direction"}
            value={direction}
            onValueChange={(value) => setDirection(value as "ltr" | "rtl")}
          >
            <SelectItem value="ltr">{zh ? "从左到右" : "Left to right"}</SelectItem>
            <SelectItem value="rtl">{zh ? "从右到左" : "Right to left"}</SelectItem>
          </Select>
        </div>
        <Button
          data-slot="scroll-tracking-remount"
          type="secondary"
          typeName="button"
          onClick={() => setMount((value) => value + 1)}
        >
          {zh ? "重新载入演示" : "Reload demo"}
        </Button>
        <Button
          data-slot="scroll-tracking-reset"
          type="tertiary"
          typeName="button"
          onClick={() => {
            setMode("on-reload");
            setSelected("view-6");
            setDirection("ltr");
            setMount((value) => value + 1);
          }}
        >
          {zh ? "重置演示" : "Reset demo"}
        </Button>
      </div>
      <p className="text-copy-14 text-muted-foreground">
        {zh
          ? "从上方选择活动标签，比较跟踪模式；切换文字方向后重新载入，观察起始边对齐。你也可以手动滚动标签行。"
          : "Choose an active tab above to compare modes. Change direction and reload to observe start-edge alignment. You can also scroll the tab row manually."}
      </p>
      <p className="text-copy-14 text-muted-foreground">
        {zh ? "纵向活动项的相同能力参见 " : "For the vertical equivalent, see "}
        <Link href="#/components/sidebar-nav">
          {zh ? "侧栏导航文档" : "SidebarNav documentation"}
        </Link>
        {zh ? "。" : "."}
      </p>
      <div
        key={mount}
        data-slot="scroll-tracking-viewport"
        dir={direction}
        className="w-full max-w-xs min-w-0"
      >
        <Tabs
          tabs={tabs}
          selected={selected}
          setSelected={setSelected}
          scrollTracking={mode}
          ariaLabel={zh ? "视图跟踪演示" : "View tracking demo"}
        />
      </div>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Tabs } from "@/components/ui/tabs";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">selected</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled selected tab.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">setSelected</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives tab selection.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">scrollTracking</code><span data-slot="docs-api-extension-badge" class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"disabled" | "on-reload" | "always"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Aligns the selected tab at horizontal start with a preferred 16px inset, reduced by the spacing scale when preceding text or icons would remain visible. on-reload runs once after mounting; always runs on mode entry or selected-value changes. Uses ScrollTrackingMode; scroll limits apply and manual scrolling remains available.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"disabled"</td></tr></tbody></table>

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
