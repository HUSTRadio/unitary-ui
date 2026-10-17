# Materials

> Route: `/materials`

# Materials

Presets for radii, fills, strokes, and shadows.

Surface is for containers within the page; Floating is for overlays. Material presets define corners, backgrounds, borders, and shadows. Layer tokens control stacking order separately.

## Texture · Global appearance

Materials express the relationship between functional layers and content. Following Apple HIG principles of hierarchy, context and readability, transmission and edge reflections stay neutral and gentle; body text, tables and form content remain clear.

- Solid is the default and preserves existing fills, strokes, shadows and the few existing blurred masks.
- Acrylic adds gentle background diffusion to navigation, floating layers and masks; inner controls stay flat.
- Aero retains the former Glass diffusion, directional lighting and thickness-absorption approximation on functional layers, secondary buttons and card-style Radio.
- Glass uses a uniform body, with contour geometry producing backdrop refraction, reflection and ambient lighting. Controls retain clear pressed, selected and focus states.

Global texture

SolidAcrylicAeroGlass

Selected: Solid · Applied: Solid

These controls change the whole documentation interface, portal layers and SubFrame content. Texture is independent of light/dark mode, UI palettes and code themes; scoped palettes still work, and components do not expose a local texture switch.

A clear workspace

The background adds depth while text and controls stay clear. Open a layer and change the global texture.

List

Grid

Saved 3 tasks

Photograph by [mirobo](https://commons.wikimedia.org/wiki/File:View_of_lake_in_forest.jpg) · Alpsee · [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)

Clear · 24% / 36%

00:42

Short media labels with a separate uniform 70% backing.

Regular · 52% / 68%

Navigation, toolbars and standalone secondary actions.

Dense · 82% / 90%

Recent files

- Project progress report
- Notes for the next review

Menus, lists, drawers and text-rich floating surfaces.

Glass provides material-glass-clear, material-glass-regular and material-glass-dense className presets on actual material surfaces. Navigation, Toolbar and standalone secondary actions default to Regular; menus, selection lists, drawers and dialog surfaces default to Dense. Clear is explicit for a few media icons or short labels, with separate scene backing and measured contrast. All use 1px blur: Clear fill is 24% / 36%, Regular 52% / 68%, and Dense 82% / 90%. Refraction inputs are 6px / 6px / 3px, bevel caps 8px / 10px / 8px and roughness 0.18 / 0.24 / 0.32. Body text and ordinary content cards retain Solid or Acrylic.

Root tokens provide the Regular baseline; Clear / Dense use local presets, with author tokens on the same surface taking precedence. setTokens(values, { target: surface }) customizes that surface; resetTokens(names, { target: surface }) restores its preset. Explicit Regular restores the root baseline. Put className on actual portal content, rather than its trigger. Select.className styles only the trigger; its list uses automatic Dense.

prefers-contrast: more uses 92% / 96% fill with Dense optics and neutral outlines mixed from 65% foreground color. SVG and CSS update with system changes. Only private effective inputs change; public tokens retain requested values. Reduced transparency and forced colors take precedence and resolve to Solid. Test actual composited backgrounds for at least 4.5:1 normal text and 3:1 large text and necessary control indicators.

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
        <RadioGroupItem value="acrylic">Acrylic</RadioGroupItem>
        <RadioGroupItem value="aero">Aero</RadioGroupItem>
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

Acrylic uses 8px diffusion and 80% fill. Aero preserves the former Glass: 20px diffusion, 60% light fill and 74% dark fill. New Glass defaults to 1px blur: Regular uses 52% light and 68% dark base fill, while text-rich floating surfaces automatically use Dense at 82% / 90%. Base fill, blur, roughness and absorption coefficients are uniform across the surface; geometry produces the optical variation. Secondary copy gains contrast on floating surfaces; reading content and inner controls remain clear. The --material-texture-\* tokens allow shared adjustments. When a continuous-corner shadow container creates a backdrop sampling boundary, its inner surface uses an opaque fill to preserve clipping and shadows.

Functional layers choose material thickness by purpose. Acrylic, Aero and Glass use soft projections and translucent hairlines; navigation bars and toolbars retain strokes only. Default tooltips with stems and ContextCard use stable opaque surfaces to avoid stem seams; default tooltips without stems can transmit the backdrop. Status-colored tooltips, toasts and inverted chart hints retain opaque fills to preserve contrast.

Aero retains the former secondary-button and card-radio treatment: 72% / 80% fill, 6px blur and static optics. New Glass removes pointer-tracking glare, artificial rims and gel compression. Secondary actions, Tabs, Toolbar, Toggle and Switch use their existing state feedback. State colors, text, hit areas and focus rings stay stable; inner controls share the outer backdrop sampler.

Glass uses a uniform body and samples inward along Snell refraction using the actual contour and continuous bevel normals, limiting displacement derivatives to prevent texture folds and returning to zero in the center. Unpolarized Fresnel determines view-dependent environment reflection; GGX / Smith highlights depend only on normals, light direction and uniform roughness. Blur defaults to 1px, base fill is uniform across the surface, and inner controls share the outer sampler. The material has no positional gradient, spatially variable blur or extra rim-brightness mask. One backdrop pipeline applies blur and displacement, with CSS corners providing the only silhouette clip. Transmission and reflection mix with energy weights in linear light. Beer–Lambert T = exp(−μd) uses the uniform absorption coefficient and actual refracted optical path, without an edge weight. Regular defaults: IOR 1.5, roughness 0.24, thickness 1, absorption 0.08, key light 315° / 0.65 and ambient 0.25 / currentColor. Use setTokens and resetTokens for local environment color and optical inputs. Environment lighting is a screen-space approximation without automatic environment-map capture.

Regular refraction strength defaults to 6px. The structural bevel region is at most 10px, bounded by 20% of the shorter dimension and the smallest corner radius; derivative limits determine displacement. Sharp or degenerate contours and decoded maps with source folds retain a uniform CSS Glass fallback. Set refraction to 0px to disable enhancement. Desktop Chromium 151+ enhances after capability and image-decode checks. Other engines, CSS-only use, restrictive CSP, unsupported outlines and backdrop boundaries retain CSS Glass. Reduced transparency and forced colors resolve to Solid; state transitions retain each component’s reduced-motion policy; Glass adds no pointer-tracking light or deformation.

Surfaces with equal geometry and optical inputs share construction results, retaining CSS Glass while enhancement is prepared. Removing a material class or changing material identity cancels stale results and releases resources. Portal teardown, StrictMode remounts and multiple root providers do not require manual SVG management.

Migration: Hybrid becomes Acrylic (hybrid → acrylic), and the former Glass becomes Aero (glass → aero). Legacy storage migrates to unitary-texture-preference-v2; valid new values win. In code, texture=glass now selects new Glass. Use aero and rename former glass token prefixes to aero to retain the old appearance; rename hybrid token prefixes to acrylic.

Environment lighting, geometric highlights and readability draw on [Apple · Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/); these formulas and parameters are Unitary UI choices, not HIG requirements.

glass-lighting.tsx

```tsx
import { setTokens, resetTokens } from "@hustradio/unitary-ui";

setTokens({
  "--material-texture-glass-refraction": "6px",
  "--material-texture-glass-edge-width": "10px",
  "--material-texture-glass-ior": "1.5",
  "--material-texture-glass-roughness": "0.24",
  "--material-texture-glass-thickness": "1",
  "--material-texture-glass-absorption": "0.08",
  "--material-texture-glass-light-azimuth": "315deg",
  "--material-texture-glass-light-intensity": "0.65",
  "--material-texture-glass-ambient-intensity": "0.25",
  "--material-texture-glass-ambient-color": "currentColor",
});

// A local environment color; the default is neutral within the surface palette.
// setTokens({ "--material-texture-glass-ambient-color": "#8eb8c5" }, { target: surface });
// resetTokens(["--material-texture-glass-ambient-color"], { target: surface });
```

Compact controls that communicate a state, count or category keep stable solid foregrounds and semantic colors, using a local fill when emphasis is needed. Text or icons supplement color; the whole control does not need a glass treatment.

In Acrylic, Aero and Glass, functional dividers and existing control borders use neutral translucent lines derived from the current palette’s primary text color, independently of decorative highlights; `--material-texture-line-opacity` adjusts their shared strength, defaulting to 18% in light mode and 22% in dark mode. Solid retains its existing lines, and custom border colors are preserved.

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

Masks draw attention to the foreground while retaining context. Solid keeps its historical treatments: Backdrop tint follows the light/dark theme and Scrim dims the background. Acrylic, Aero and Glass share a faint neutral veil, backdrop blur and modest desaturation, avoiding a large brightness shift between modals and drawers. These visual materials do not replace dismissal, focus management, ARIA or background interaction rules, and differ from SkeletonMask loading placeholders.

Background content

A clear foreground

Backdrop

material-mask

Background content

A clear foreground

Scrim

material-mask-scrim

Blur samples the backdrop, never the text. Masks use alpha color compositing rather than lowering the parent element's opacity. Avoid repeated blur on inner buttons, inputs or nested functional layers.

Acrylic, Aero and Glass mask color is the midpoint between the local palette’s surface and primary text colors, with 8% opacity, 8px backdrop blur and 85% saturation by default. It gently moderates very bright or dark regions rather than preserving every pixel’s brightness. `--material-texture-mask-opacity` and `--material-texture-mask-saturation` allow global adjustment; the old name `--material-texture-mask-backdrop-opacity` remains as a deprecated compatibility alias. These values are project design choices, not parameters prescribed by Apple HIG.

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
- Default blur stays within 20px for functional layers, 8px for masks and 6px for standalone secondary buttons and surface-styled options. New Glass uses 1px. Maps rebuild only for geometry or parameter changes; pointer updates coalesce per frame and stop when idle, avoiding repeated sampling.

[Apple HIG · Materials](https://developer.apple.com/design/human-interface-guidelines/materials) · [MDN · backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) · [MDN · prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency)
