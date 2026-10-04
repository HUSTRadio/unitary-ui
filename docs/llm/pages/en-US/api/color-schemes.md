# Color Scheme API

> Route: `/api/color-schemes`

# Color Scheme API

Named UI palettes and independent code themes, applied to explicit DOM scopes through the existing token system.

[Open the interactive palette showcase →](#/color-schemes)

## Registry and resolution

COLOR\_SCHEMES contains default, unitary-blue, green and amber. CODE\_THEMES contains default, light, dark, monokai, solarized-light and solarized-dark. Entries are frozen. getColorScheme(id) and getCodeTheme(id) return an entry or throw TypeError for an unknown ID.

resolveCodeTheme(theme, scheme, mode) returns fresh mode, tokens, colors and syntax values. getInlineCodeColors(theme, scheme, mode) returns foreground, background and border. Fixed editor themes keep their own mode; Default follows the supplied UI scheme and mode. These pure functions work without a document.

```tsx
const ui = getColorScheme("green");
const theme = getCodeTheme("monokai");
const { mode, colors } = resolveCodeTheme(theme, ui, "light");
// mode === "dark", colors.number === "#ae81ff"
```

## Apply and restore

applyColorScheme(target, {scheme = 'default', mode}) applies UI colors. applyCodeTheme(target, {theme = 'default', scheme = 'default', mode, kind = 'block'}) applies a block theme or, with kind: 'inline', only the three inline roles. mode is required and must be light or dark; kind must be inline or block. Both return an idempotent restore callback. A null target is a safe no-op for refs and server rendering.

Targets are explicit HTMLElement or SVGElement values. No global root is selected implicitly. Restore before reapplying: it restores previous inline values, priorities and attributes still owned by that application, preserving subsequent external edits and unrelated styles. It does not restore ancestor themes or persist preferences.

color-scheme.ts

```tsx
import { applyColorScheme, applyCodeTheme } from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles.css";

const restoreUI = applyColorScheme(frame, {
  scheme: "unitary-blue",
  mode: "light",
});
const restoreInline = applyCodeTheme(inlineContainer, {
  theme: "light",
  mode: "light",
  kind: "inline",
});
const restoreBlock = applyCodeTheme(blockContainer, {
  theme: "monokai",
  mode: "light",
});

// Restore before changing a selection or disposing the demo.
restoreBlock();
restoreInline();
restoreUI();
```

In React, apply to refs in an effect and return the cleanup. The showcase uses this same public API.

```tsx
useLayoutEffect(() => {
  const restoreUI = applyColorScheme(frameRef.current, { scheme, mode });
  const restoreCode = applyCodeTheme(codeRef.current, {
    scheme,
    theme: blockTheme,
    mode,
  });
  return () => {
    restoreCode();
    restoreUI();
  };
}, [scheme, mode, blockTheme]);
```

## CSS export and boundaries

createColorSchemeCSS({scheme, inlineTheme, blockTheme}) returns both UI modes, independent code values, local alias bindings and role rules. All selection fields default to default. Use the attributes shown in the showcase and load the result after library styles. Invalid registry selections throw before any scope is changed.

```tsx
const css = createColorSchemeCSS({
  scheme: "unitary-blue",
  inlineTheme: "light",
  blockTheme: "monokai",
});
```

This API composes with SubFrame and stacking components through normal DOM inheritance; it does not create an iframe, Shadow DOM or a separate React ThemeProvider. Body-mounted portals need a suitable local container to inherit a scoped palette. Code themes adapt published editor colors to Prism roles; they do not replicate full TextMate rules. Source links and the saved Default configuration are documented in the showcase.
