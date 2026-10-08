# Materials

> Route: `/materials`

# Materials

Presets for radii, fills, strokes, and shadows.

Surface is for containers within the page; Floating is for overlays. Material presets define corners, backgrounds, borders, and shadows. Layer tokens control stacking order separately.

## Texture · Global appearance

Materials express the relationship between functional layers and content. Following Apple HIG principles of hierarchy, context and readability, transmission and edge reflections stay neutral and gentle; body text, tables and form content remain clear.

- Solid is the default and preserves existing fills, strokes, shadows and the few existing blurred masks.
- Hybrid adds gentle background diffusion to navigation, floating layers and masks; inner controls stay flat.
- Glass adds transmission, static highlights and light-and-dark edges to functional layers, secondary action buttons and surface-styled Radio options, suggesting material thickness. It does not use true refraction, dispersion or pointer-driven glare.

Global texture

SolidHybridGlass

Selected: Solid · Applied: Solid

These controls change the whole documentation interface, portal layers and SubFrame content. Texture is independent of light/dark mode, UI palettes and code themes; scoped palettes still work, and components do not expose a local texture switch.

A clear workspace

The background adds depth while text and controls stay clear. Open a layer and change the global texture.

Saved 3 tasks

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

Enabled secondary Button, ButtonLink and surface-styled Radio options with default surface fills in Glass transmit the backdrop, with static light-and-dark edges defining their contour. Standalone controls use 72% fill in light mode, 80% in dark mode and 6px backdrop blur. Control fill falls to one-third only when the nearest functional layer has a default neutral fill, avoiding stacked solid-looking fills. Transparent, custom or semantic-colored layers and masks alone retain the full fill to protect text contrast. Neither context samples again. Material follows the action’s semantics: primary actions, status-colored buttons, input areas and radio indicators retain their clear existing styles; selected outlines and keyboard focus cues stay distinguishable. Hybrid controls stay flat. `--material-texture-control-opacity` and `--material-texture-control-blur` adjust the shared fill and standalone control blur.

Glass suggests thickness with a narrow highlight, a softly feathered edge and a darker lower seam, while a neutral stroke keeps boundaries clear. These are static, precomputed lighting cues calibrated for this project: Schlick’s approximation at an index of refraction around 1.5 gives roughly 4% reflection head-on and 16% at 70°. These values are not prescribed by Apple HIG, and the interface does not simulate scene-dependent Fresnel reflection or refraction.

Compact controls that communicate a state, count or category keep stable solid foregrounds and semantic colors, using a local fill when emphasis is needed. Text or icons supplement color; the whole control does not need a glass treatment.

In Hybrid and Glass, functional dividers and existing control borders use neutral translucent lines derived from the current palette’s primary text color, independently of decorative highlights; `--material-texture-line-opacity` adjusts their shared strength, defaulting to 18% in light mode and 22% in dark mode. Solid retains its existing lines, and custom border colors are preserved.

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

Masks draw attention to the foreground while retaining context. Solid keeps its historical treatments: Backdrop tint follows the light/dark theme and Scrim dims the background. Hybrid and Glass share a faint neutral veil, backdrop blur and modest desaturation, avoiding a large brightness shift between modals and drawers. These visual materials do not replace dismissal, focus management, ARIA or background interaction rules, and differ from SkeletonMask loading placeholders.

Background content

A clear foreground

Backdrop

material-mask

Background content

A clear foreground

Scrim

material-mask-scrim

Blur samples the backdrop, never the text. Masks use alpha color compositing rather than lowering the parent element's opacity. Avoid repeated blur on inner buttons, inputs or nested functional layers.

Hybrid and Glass mask color is the midpoint between the local palette’s surface and primary text colors, with 8% opacity, 8px backdrop blur and 85% saturation by default. It gently moderates very bright or dark regions rather than preserving every pixel’s brightness. `--material-texture-mask-opacity` and `--material-texture-mask-saturation` allow global adjustment; the old name `--material-texture-mask-backdrop-opacity` remains as a deprecated compatibility alias. These values are project design choices, not parameters prescribed by Apple HIG.

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
- Default blur stays within 20px for functional layers, 8px for masks and 6px for standalone secondary buttons and surface-styled options. Static effects need no per-frame JavaScript computation and avoid repeated sampling and blur animation, keeping content and interaction clear.

[Apple HIG · Materials](https://developer.apple.com/design/human-interface-guidelines/materials) · [MDN · backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) · [MDN · prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency)
