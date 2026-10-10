# Site Navigation

> Route: `/components/site-navigation`

Grouped website links with desktop panels and a modal mobile disclosure navigation.

[Back to Components](#/components)

# Site Navigation

site-navigation

Grouped website links with desktop panels and a modal mobile disclosure navigation.

## When to use

- Grouped website navigation sharing links between desktop panels and a modal mobile directory.

## When not to use

- Use MenuBar for application commands and SidebarNav for persistent side navigation.

## Examples

### Basic usage

Grouped website navigation sharing links between desktop panels and a modal mobile directory.

## Accessibility

- Uses nav, button, and anchor semantics. Escape dismisses desktop panels and restores trigger focus; mobile uses a modal Sheet with an explicit close control.

## Controlled behavior

- Open state is internal. onOpenChange coordinates Navbar.forceVisible; activeHref changes and breakpoint crossings dismiss navigation.

## Responsive behavior

- desktopBreakpoint supports 768/1024/1280px. Touch uses activation, long mobile directories scroll separately with reachable actions; desktop panels align to the nearest positioned ancestor.

## Theme behavior

- Uses shared semantic colors and motion tokens with the same interaction contract in both themes.

## Live Demo

```tsx
import { SiteNavigation } from "@/components/ui/site-navigation";

export default function SiteNavigationExample() {
  return (
    <div className="min-h-80 w-full rounded-md border border-gray-alpha-400">
      <div className="relative border-b border-gray-alpha-400 p-4">
        <SiteNavigation
          label="Site navigation"
          desktopBreakpoint={768}
          items={[
            {
              id: "research",
              label: "Research",
              groups: [
                {
                  title: "Explore",
                  links: [
                    { label: "Overview", href: "/research" },
                    {
                      label: "Projects",
                      href: "/projects",
                      description: "Discover our latest work",
                    },
                  ],
                },
              ],
            },
            { id: "news", label: "News", href: "/news" },
          ]}
          mobileActions={
            <a href="/contact" className="inline-flex min-h-11 items-center">
              Contact
            </a>
          }
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
import { SiteNavigation } from "@/components/ui/site-navigation";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">items</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SiteNavigationItem[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Stable id, label, optional href, groups, and featured content. Each group has title and links; links accept label/href/description/target/rel.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Accessible navigation and mobile dialog name.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">activeHref</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Marks a matching link with aria-current=page.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">desktopBreakpoint</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">768 | 1024 | 1280</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Minimum viewport width for desktop panels.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">1024</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">mobileActions</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Actions outside the mobile navigation scroll body.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">panelClassName</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Extra desktop panel layout classes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports either desktop or mobile navigation being open.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
