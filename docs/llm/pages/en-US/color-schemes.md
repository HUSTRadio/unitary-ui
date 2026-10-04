# Color Schemes

> Route: `/color-schemes`

# Color Schemes

Choose UI colors from the project's standard palette, then select independent inline code and code block themes. Swatches show each role's value; real components show the result.

[Explore global tokens →](#/tokens)

UI palette

Inline code theme

Code block theme

Light

Dark

## Semantic palette

Selections reveal the corresponding palette. Each swatch lists the role, actual color and variable. Default preserves the current docs configuration.

Canvas`#ffffff`\--background

Surface`#ffffff`\--card

Subtle surface`#f2f2f2`\--secondary

Primary text`#171717`\--foreground

Secondary text`#4d4d4d`\--muted-foreground

Subtle border`#ebebeb`\--border

Strong border`#c9c9c9`\--border-strong

Primary action`#171717`\--primary

Action hover`#383838`\--action-hover

Action text`#ffffff`\--primary-foreground

Link`#0072f5`\--link

Focus ring`#0072f5`\--focus-ring-color

Success`#46a758`\--success

Warning`#ffb224`\--warning

Error`#e5484d`\--destructive

All services operational

## Overview

Use standard navigation, forms and overlays to inspect readability and component states.

#### Project settings

In progress

Project name

Edit the project name and try focus, hover and disabled states.

### Developer notes

Use `loadProject(id)` to fetch a project; set `retries = 3` to control retries.

project.ts

```tsx
// A small, readable example
export async function loadProject(id: string) {
  const retries = 3;
+  const enabled = true;
-  const result = await fetch("/api/projects/" + id);
  return { name: "Unitary", retries, enabled };
}
```

```tsx
const count = 3;
console.log("Unitary", count);
```

SubFrame contains the preview's palette and local overlays. UI theme is independent of the docs shell; fixed code themes are independent of UI theme.

## Sources and adoption

Default saves 313 runtime color variables per docs theme. Unitary Blue, Green and Amber use existing project scales; Unitary Blue actions use the logo's #0D47A1.

Code themes use published VS Code Light+, Dark+, Monokai and Solarized colors adapted to Prism categories, rather than the editor's full TextMate rules. Default follows UI surfaces and theme; fixed themes retain their own background and syntax colors.

Inline code and code blocks can be selected independently. Default inline code preserves the docs' plain text style; fixed themes use their own text, background and border.

Exports include both UI modes, independent code colors and local variable bindings. Load after library styles. Keep code containers' data-ui-theme aligned with the UI; data-theme uses the code theme's own mode.

```tsx
<section data-color-scheme="default" data-theme="light">
  <p data-inline-code-theme="default" data-ui-theme="light">
    ...
  </p>
  <div data-code-scheme="default" data-theme="light" data-ui-theme="light">
    ...
  </div>
</section>
```

SubFrame scopes overlay placement without an iframe or Shadow DOM. Global CSS and theme context can still affect other components; this page verifies the components shown.
