# Theme Switcher

> Route: `/components/theme-switcher`

Switches between light, dark, and system themes.

[Back to Components](#/components)

# Theme Switcher

Theme Switcher

Switches between light, dark, and system themes.

## When to use

-   As the sole canonical theme toggle in an app, placed in the footer or settings page for clean, centralized access.
-   When managing theme state via next-themes, Theme Switcher ships with built-in icons, semantic labels, and System mode detection.

## When not to use

-   Do not duplicate the theme switcher across pages—it should appear exactly once per app, not once per route.
-   Do not rebuild a theme picker with Switch components or three icon buttons—Theme Switcher already handles icons, aria-labels, and System detection.

## Examples

### Default theme switcher

Displays the default-sized three-option theme selector (Light / System / Dark).

### Compact size

Demonstrates the small-size variant, ideal for dense chrome areas like footers and dropdowns.

## Accessibility

-   Each option in Theme Switcher carries its own aria-label describing the three theme states so screen-reader users understand their choices clearly.
-   Labels are composed directly from the theme keys (light, system, dark) so they stay translatable through next-themes without modification.
-   The currently selected option must have a clear focus ring and visual selection marker so keyboard users see the active choice.

## Controlled behavior

-   Theme Switcher reads from and writes to next-themes; wrap the app in GeistProvider once at the root without mirroring into local React state.
-   The control auto-disables when forcedTheme is set on the provider; manual disabled prop is for read-only previews only.
-   An onChange callback can intercept theme changes but is rarely needed—let next-themes manage the lifecycle naturally.

## Responsive behavior

-   On desktop, Theme Switcher renders all three options in a row; on narrow screens no options are cropped to preserve full functionality.
-   The small (compact) variant stays tightly packed on any viewport, fitting well in footers and nav bars.

## Theme behavior

-   Theme Switcher itself is the core theme-control element; its icons and labels change in real time with the selected theme, visually reflecting the active choice.
-   On settings pages with ample room, use the default size so label text has enough breathing space.

## Live Demo

```tsx
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

<ThemeSwitcher />
```

```tsx
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

<ThemeSwitcher small />
```

```tsx
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

<ThemeSwitcher disabled />
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">theme</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"light" | "dark" | "system"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Current theme mode.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onThemeChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(theme: Theme) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives theme changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

-   Use Theme Switcher for the canonical Light / System / Dark control. Place it once per app, in the footer or settings, not duplicated across pages.
-   Pass small for dense chrome (footers, dropdowns); use the default size on a settings page where there’s room for the labels to breathe.
-   Theme Switcher reads from and writes to next-themes, so wrap the app in GeistProvider once at the root and don’t mirror its state into local React state.
-   The control auto-disables when forcedTheme is set on the provider; setting disabled manually is for read-only previews of the control itself.
-   Don’t rebuild a theme picker with Switch or three icon buttons. Theme Switcher already handles the icons, the aria-label per option, and System detection.
-   The component composes its own labels from the theme keys (light, system, dark); leave them alone so they stay translatable through next-themes.
