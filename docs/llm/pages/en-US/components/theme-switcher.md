# Theme Switcher

> Route: `/components/theme-switcher`

Switches between light, dark, and system themes.

[Back to Components](#/components)

# Theme Switcher

Theme Switcher

Switches between light, dark, and system themes.

## When to use

- As the sole canonical theme toggle in an app, placed in the footer or settings page for clean, centralized access.
- For Light / System / Dark three-state preference switching; Theme Switcher ships with built-in icons, semantic labels, and System mode detection.

## When not to use

- Do not duplicate the theme switcher across pages—it should appear exactly once per app, not once per route.
- Do not rebuild a theme picker with Switch components or three icon buttons—Theme Switcher already handles icons, aria-labels, and System detection.

## Examples

### Default theme switcher

Displays the default-sized three-option theme selector (Light / System / Dark).

### Compact size

Demonstrates the small-size variant, ideal for dense chrome areas like footers and dropdowns.

## Accessibility

- Each option in Theme Switcher carries its own aria-label describing the three theme states so screen-reader users understand their choices clearly.
- The control exposes the current preference via role=radiogroup / role=radio + aria-checked; option labels are localized through the framework i18n (t()) to match the UI language.
- The currently selected option must have a clear focus ring and visual selection marker so keyboard users see the active choice.

## Controlled behavior

- Theme Switcher reads from and writes to the framework's own ThemeProvider (src/lib/theme.tsx); wrap the app in ThemeProvider once at the root without mirroring into local React state.
- The library does not depend on next-themes: the public API is just className / small / disabled—there is no onChange callback or forcedTheme concept.
- To intercept theme changes (e.g. syncing with system settings), consume preference/setPreference from useTheme() directly instead of wrapping a callback.

## Responsive behavior

- On desktop, Theme Switcher renders all three options in a row; on narrow screens no options are cropped to preserve full functionality.
- The small (compact) variant stays tightly packed on any viewport, fitting well in footers and nav bars.

## Theme behavior

- Theme Switcher itself is the core theme-control element; its icons and labels change in real time with the selected theme, visually reflecting the active choice.
- On settings pages with ample room, use the default size so label text has enough breathing space.

## Live Demo

```tsx
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export function ThemeSwitcherDefault21B111CBExample() {
  return <ThemeSwitcher />;
}
```

## Small

```tsx
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export function ThemeSwitcherSmall5263293FExample() {
  return <ThemeSwitcher small />;
}
```

## Disabled

```tsx
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export function ThemeSwitcherDisabled75081B59Example() {
  return <ThemeSwitcher disabled />;
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">className</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Additional classes for the radiogroup.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">small</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Uses compact theme option buttons.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Disables every theme option.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## Best Practices

- Use Theme Switcher for the canonical Light / System / Dark control. Place it once per app, in the footer or settings, not duplicated across pages.
- Pass small for dense chrome (footers, dropdowns); use the default size on a settings page where there’s room for the labels to breathe.
- Theme Switcher reads from and writes to the framework's own ThemeProvider (src/lib/theme.tsx), so wrap the app in ThemeProvider once at the root and don’t mirror its state into local React state.
- The library does not depend on next-themes; the public API is just className / small / disabled, with no onChange callback or forcedTheme concept. To intercept changes, consume useTheme() directly.
- Don’t rebuild a theme picker with Switch or three icon buttons. Theme Switcher already handles the icons, the aria-label per option, and System detection.
- Option labels are localized through the framework i18n (t()); keep them that way so the accessible names match the UI language.
