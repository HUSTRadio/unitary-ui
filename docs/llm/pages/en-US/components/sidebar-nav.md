# Sidebar Nav

> Route: `/components/sidebar-nav`

Grouped sidebar navigation with active state and optional collapsible sections.

[Back to Components](#/components)

# Sidebar Nav

sidebar-nav

Grouped sidebar navigation with active state and optional collapsible sections.

## When to use

- Use it for grouped navigation in desktop application layouts.

## When not to use

- Use HamburgerMenu for expandable navigation on a compact screen.

## Examples

### Grouped links

Select an item to update the current-page state.

### Active-item scroll tracking

Compare three tracking modes and item/category-heading alignment; choose an active item, reload or scroll manually.

## Accessibility

- Links retain native anchor semantics; the active item uses aria-current and collapsible headings support keyboard activation.
- Scroll tracking does not move focus; reduced-motion preferences make alignment immediate.

## Controlled behavior

- The caller supplies activeTo; onNavigate intercepts unmodified clicks, while modified clicks retain native navigation.
- scrollTracking is an optional Unitary extension typed as ScrollTrackingMode and defaults to disabled. on-reload attempts alignment once after the initial mount and DOM layout readiness; later activeTo changes do not trigger tracking. always updates position when entering that mode and when activeTo changes.
- scrollTrackingTarget defaults to item for the active link. category aligns its subgroup heading, falling back to the group heading when there are no subgroups. The docs sidebar uses on-reload + category. always also responds to alignment-target changes; after on-reload has run, changing the target requires remounting.
- Restore activeTo from the route or anchor in the caller; the component tracks the corresponding active link. Manual scrolling interrupts the current animation and still consumes the on-reload attempt. always does not continually lock the position for the same active value.

## Responsive behavior

- The surrounding layout sets the width; touch rows have larger hit targets.
- Tracking scrolls only the nearest vertical scroll container and prefers 16px below its top. If preceding item or group-heading text or icons would remain visible, the spacing scale reduces the inset to 8px, 4px and so on. The target is clamped to the available scroll range and does not scroll the outer page.

## Theme behavior

- Links, focus rings, and selection use semantic color tokens.
- Scroll tracking reuses --uni-motion-state (250ms by default) and the nonlinear --ease-in-out curve; both themes share these motion tokens.

## Live Demo

```tsx
import { useState } from "react";
import { SidebarNav } from "@/components/ui/sidebar-nav";

const groups = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", to: "/overview" },
      { label: "Projects", to: "/projects" },
    ],
  },
];

export default function SidebarNavExample() {
  const [activeTo, setActiveTo] = useState("/overview");
  return (
    <div className="w-full max-w-64 rounded-xl border border-border bg-background p-3">
      <SidebarNav groups={groups} activeTo={activeTo} onNavigate={setActiveTo} collapsible />
    </div>
  );
}
```

## Scroll tracking

Tracking mode

Alignment target

Active item

Choose an active item and alignment target to compare modes. The docs sidebar aligns its category heading on load; this demo starts with item alignment. Reload keeps your selection, and manual scrolling remains available.

For the horizontal equivalent, see [Tabs documentation](#/components/tabs).

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Select, SelectItem } from "@/components/ui/select";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { useI18n } from "@/lib/i18n";
import type { ScrollTrackingMode, SidebarNavScrollTrackingTarget } from "@/lib";

export default function SidebarNavScrollTrackingExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  const [mode, setMode] = useState<ScrollTrackingMode>("on-reload");
  const [target, setTarget] = useState<SidebarNavScrollTrackingTarget>("item");
  const [activeTo, setActiveTo] = useState("/page-6");
  const [mount, setMount] = useState(0);
  const items = Array.from({ length: 12 }, (_, index) => ({
    label: `${zh ? "页面" : "Page"} ${index + 1}`,
    to: `/page-${index + 1}`,
  }));

  return (
    <div data-slot="sidebar-nav-scroll-tracking-demo" className="w-full max-w-xl space-y-4">
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
        <div data-slot="scroll-tracking-alignment">
          <Select
            label={zh ? "对齐目标" : "Alignment target"}
            value={target}
            onValueChange={(value) => setTarget(value as SidebarNavScrollTrackingTarget)}
          >
            <SelectItem value="item">{zh ? "当前条目" : "Current item"}</SelectItem>
            <SelectItem value="category">{zh ? "所属分类小标题" : "Category heading"}</SelectItem>
          </Select>
        </div>
        <div data-slot="scroll-tracking-target">
          <Select
            label={zh ? "活动条目" : "Active item"}
            value={activeTo}
            onValueChange={setActiveTo}
          >
            {items.map((item) => (
              <SelectItem key={item.to} value={item.to}>
                {item.label}
              </SelectItem>
            ))}
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
            setTarget("item");
            setActiveTo("/page-6");
            setMount((value) => value + 1);
          }}
        >
          {zh ? "重置演示" : "Reset demo"}
        </Button>
      </div>
      <p className="text-copy-14 text-muted-foreground">
        {zh
          ? "选择活动条目和对齐目标，比较跟踪模式。文档侧栏在载入时对齐所属分类小标题；此演示默认对齐条目。重新载入保留当前选择，你也可以手动滚动。"
          : "Choose an active item and alignment target to compare modes. The docs sidebar aligns its category heading on load; this demo starts with item alignment. Reload keeps your selection, and manual scrolling remains available."}
      </p>
      <p className="text-copy-14 text-muted-foreground">
        {zh ? "横向活动项的相同能力参见 " : "For the horizontal equivalent, see "}
        <Link href="#/components/tabs">{zh ? "标签页文档" : "Tabs documentation"}</Link>
        {zh ? "。" : "."}
      </p>
      <div
        key={mount}
        data-slot="scroll-tracking-viewport"
        tabIndex={0}
        aria-label={zh ? "侧栏跟踪演示" : "Sidebar tracking demo"}
        className="nav-scroll h-48 w-full max-w-64 overflow-y-auto rounded-xl border border-border bg-background p-4 focus-ring"
      >
        <SidebarNav
          groups={[
            {
              label: zh ? "页面导航" : "Pages",
              items,
              subgroups: [0, 1, 2].map((index) => ({
                label: `${zh ? "分类" : "Category"} ${index + 1}`,
                items: items.slice(index * 4, index * 4 + 4),
              })),
            },
          ]}
          activeTo={activeTo}
          onNavigate={setActiveTo}
          scrollTracking={mode}
          scrollTrackingTarget={target}
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
import { SidebarNav } from "@/components/ui/sidebar-nav";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">groups</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SidebarNavGroup[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Navigation groups and their links.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">activeTo</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Path of the active item.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onNavigate</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(to: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Intercepts unmodified link activation; modified clicks retain native navigation.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">side</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"left" | "right"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Places the divider on the right-side variant.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"left"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">collapsible</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Allows group headings to toggle their contents.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">persistKey</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Persists collapsed groups in localStorage when provided.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">scrollTracking</code><span data-slot="docs-api-extension-badge" class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"disabled" | "on-reload" | "always"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Aligns the chosen target below its nearest vertical scroll container's top with a preferred 16px inset, reduced by the spacing scale when preceding text or icons would remain visible. on-reload runs once after mounting; always runs on mode entry, activeTo or scrollTrackingTarget changes. Uses ScrollTrackingMode; scroll limits apply and manual scrolling remains available.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"disabled"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">scrollTrackingTarget</code><span data-slot="docs-api-extension-badge" class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"item" | "category"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Chooses the active link or its subgroup heading; category uses the group heading when no subgroups exist. Uses SidebarNavScrollTrackingTarget. The docs sidebar opts into category with on-reload.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"item"</td></tr></tbody></table>
