# Materials

> Route: `/materials`

# Materials

Presets for radii, fills, strokes, and shadows.

Surface is for containers within the page; Floating is for overlays. Material presets define corners, backgrounds, borders, and shadows. Layer tokens control stacking order separately.

## Texture · Global appearance

Materials express the relationship between functional layers and content. Following Apple HIG principles of hierarchy, context and readability, transmission and edge reflections stay neutral and gentle; body text, tables and form content remain clear.

- Solid is the default and preserves existing fills, strokes, shadows and the few existing blurred masks.
- Hybrid adds gentle background diffusion to navigation, floating layers and masks; inner controls stay flat.
- Glass adds thin-layer transmission, static highlights and faint edge reflection. This release does not use refraction, dispersion or pointer-driven glare.

Global texture

SolidHybridGlass

Selected: Solid · Applied: Solid

These controls change the whole documentation interface, portal layers and SubFrame content. Texture is independent of light/dark mode, UI palettes and code themes; scoped palettes still work, and components do not expose a local texture switch.

A clear workspace

The background adds depth while text and controls stay clear. Open a layer and change the global texture.

Photograph by [mirobo](https://commons.wikimedia.org/wiki/File:View_of_lake_in_forest.jpg) · Alpsee · [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)

global-texture.tsx

```tsx
import {
  RadioGroup,
  RadioGroupItem,
  ThemeProvider,
  useTheme,
  type TexturePreference,
} from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles.css";

function TextureControls() {
  const { texture, resolvedTexture, setTexture } = useTheme();
  return (
    <fieldset>
      <legend>Global texture</legend>
      <RadioGroup
        aria-label="Global texture"
        value={texture}
        onChange={(value) => setTexture(value as TexturePreference)}
      >
        <RadioGroupItem value="solid">Solid</RadioGroupItem>
        <RadioGroupItem value="hybrid">Hybrid</RadioGroupItem>
        <RadioGroupItem value="glass">Glass</RadioGroupItem>
      </RadioGroup>
      <p>
        {texture} / {resolvedTexture}
      </p>
    </fieldset>
  );
}

export function App() {
  return (
    <ThemeProvider defaultTexture="solid">
      <TextureControls />
    </ThemeProvider>
  );
}
```

The root ThemeProvider accepts texture (controlled), defaultTexture (uncontrolled, solid by default) and onTextureChange. useTheme returns texture, resolvedTexture and setTexture; a valid stored choice takes precedence over defaultTexture, uncontrolled choices persist independently, and nested providers inherit the root texture preference.

For CSS-only use, declare `<html data-texture="glass">` on the document root to apply the appearance globally; descendant data-texture attributes do not create a texture theme. Once mounted, the root ThemeProvider owns this attribute and handles capability and accessibility fallbacks.

Hybrid uses 8px diffusion and 80% fill. Glass uses 20px diffusion with 60% fill in light mode and 74% in dark mode. Secondary copy gains contrast on floating surfaces; reading content and inner controls remain clear. The --material-texture-\* tokens allow shared adjustments. When a continuous-corner shadow container creates a backdrop sampling boundary, its inner surface uses an opaque fill to preserve clipping and shadows.

Functional layers choose material thickness by purpose. Hybrid and Glass use soft projections and translucent hairlines; navigation bars and toolbars retain strokes only. Default tooltips with stems and ContextCard use stable opaque surfaces to avoid stem seams; default tooltips without stems can transmit the backdrop. Status-colored tooltips, toasts and inverted chart hints retain opaque fills to preserve contrast.

## Surface

For containers within the page. Use a light shadow to distinguish layers without drawing too much attention.

material-base

Base

Everyday use. Radius 6px.

Class

material-base

Radius

6px

material-small

Small

Slightly raised. Radius 6px.

Class

material-small

Radius

6px

material-medium

Medium

Further raised. Radius 12px.

Class

material-medium

Radius

12px

material-large

Large

Further raised. Radius 12px.

Class

material-large

Radius

12px

## Floating

For popup panels. Avoid applying a material twice, keep focus indicators and ARIA attributes, and check clarity in both themes.

material-tooltip

Tooltip

Lightest shadow. Corner 6px. For short contextual hints.

Class

material-tooltip

Radius

6px

material-menu

Menu

Lift from page. Radius 6px.

Class

material-menu

Radius

6px

material-modal

Modal

Further lift. Radius 12px.

Class

material-modal

Radius

12px

material-fullscreen

Fullscreen

Biggest lift. Radius 16px.

Class

material-fullscreen

Radius

16px

## Mask · Background emphasis

Masks draw attention to the foreground while retaining context. Backdrop washes out the background; Scrim dims it. These visual materials do not replace dismissal, focus management, ARIA or background interaction rules, and differ from SkeletonMask loading placeholders.

Background content

A clear foreground

Backdrop · Wash

material-mask

Background content

A clear foreground

Scrim · Dim

material-mask-scrim

Blur samples the backdrop, never the text. Masks use alpha color compositing rather than lowering the parent element's opacity. Avoid repeated blur on inner buttons, inputs or nested functional layers.

mask-materials.tsx

```tsx
// Visual treatment only: the owning dialog still handles focus,
// dismissal, stacking and background interaction.
export function Mask() {
  return <div aria-hidden="true" className="material-mask fixed inset-0" />;
}

export function Scrim() {
  return <div aria-hidden="true" className="material-mask-scrim fixed inset-0" />;
}
```

## Compatibility and rendering cost

- CSS backdrop blur, color mixing and gradients need no experimental flags. Missing capabilities fall back globally to Solid.
- Respect forced colors, reduced transparency and reduced motion. Transparency detection is a progressive enhancement; Solid is always available manually.
- Default blur stays within 20px for functional layers and 8px for masks. Static effects avoid per-frame computation, repeated sampling and blur animation, keeping content and interaction clear.

[Apple HIG · Materials](https://developer.apple.com/design/human-interface-guidelines/materials) · [MDN · backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) · [MDN · prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency)
