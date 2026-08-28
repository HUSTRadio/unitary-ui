# App Shell

> Route: `/patterns/app-shell`

# App Shell

This page is a self-contained shell assembly demo: topbar, sidebar navigation, content area and footer are all composed from framework components. Resize the window across the lg breakpoint (1024px) to see the coherent switch between the sidebar and the hamburger menu forms.

[App Shell](#demo-overview)

## Overview

### Navbar

scrollBehavior supports static / pinned / auto-hide positioning; variant supports solid / transparent, and transparent pairs with solidOnScroll to restore surface after scrolling.

### SidebarNav

Generic sidebar navigation: grouped data, activeTo highlights the current item, side picks the separator edge. Width is owned by the outer layout; visible from the lg breakpoint.

### HamburgerMenu

HamburgerIcon + ExpandPanel composite: with anchor=topbar the panel extends downward from the topbar's bottom edge (same width, shared border), with built-in search filtering.

### Footer

columns link groups + slotLeading/slotTrailing slots + optional sticky pinning. This page demonstrates the two-column form.

## Props cheat sheet

<table class="w-full border-collapse text-left"><thead><tr class="border-gray-alpha-400 border-b"><th scope="col" class="text-label-13 px-4 py-2.5 font-medium text-muted-foreground">Component</th><th scope="col" class="text-label-13 px-4 py-2.5 font-medium text-muted-foreground">Prop</th><th scope="col" class="text-label-13 px-4 py-2.5 font-medium text-muted-foreground">Default</th><th scope="col" class="text-label-13 px-4 py-2.5 font-medium text-muted-foreground">Description</th></tr></thead><tbody><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">Navbar</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">scrollBehavior</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">"pinned"</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">static in-flow / pinned sticky / auto-hide hides on scroll down, returns on scroll up</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">Navbar</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">variant · solidOnScroll</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">"solid" · false</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">transparent has no surface; solidOnScroll restores surface + bottom border past threshold</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">SidebarNav</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">groups · activeTo · side</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">— · — · "left"</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">Grouped data source, active item (aria-current="page"), separator edge</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">HamburgerMenu</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">anchor · direction</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">— · topbar→"down"</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">Trigger scenario; topbar extends down as a visual continuation, sidebar expands to the opposite side</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">HamburgerMenu</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">maxExpandedHeight · content</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">"100dvh" · "merged"</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">Max expanded height; merged search+nav / split visual separation (placeholder)</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">BottomSheet</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">detents · gestures</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">[0.5, 1] · all on</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">Height detents (≥2 renders Grabber automatically); resize/expandUp/collapseDown each toggleable</td></tr><tr class="border-gray-alpha-400 border-b last:border-b-0"><td class="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">Footer</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">columns · sticky</td><td class="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">— · false</td><td class="text-copy-13 px-4 py-2.5 text-muted-foreground">Link column array; sticky viewport pinning. slotLeading/slotTrailing free slots</td></tr></tbody></table>

## Mobile only

Mobile only

### BottomSheet multi-detent sheet

Pull below the lowest detent to dismiss, tap the grabber to cycle detents (Apple HIG spec). Open it below to try drag-to-resize and detent snapping.

Unitary · Patterns

Shell components

- [Navbar topbar](#demo-api)
- [SidebarNav](#demo-api)

Mobile

- [BottomSheet](#demo-mobile)
- [Grabber](#demo-mobile)
