# Materials

> Route: `/materials`

# Materials

Presets for radii, fills, strokes, and shadows.

Surface is for containers within the page; Floating is for overlays. Material presets define corners, backgrounds, borders, and shadows. Layer tokens control stacking order separately.

## Texture · Global appearance

Materials express the relationship between functional layers and content. Glass combines translucent fill, backdrop blur, soft sheen and fine edges, retaining Unitary palettes, dimensions and corner radii. Body text, tables and forms remain clear.

- Solid is the default and preserves existing fills, strokes, shadows and the few existing blurred masks.
- Acrylic adds gentle background diffusion to navigation, floating layers and masks; inner controls stay flat.
- Aero retains the former Glass diffusion, directional lighting and thickness-absorption approximation on functional layers, secondary buttons and card-style Radio.
- Glass uses a uniform translucent body and CSS blur, layered with directional sheen, fine inset edges and soft shadows. Existing interactive controls add restrained pointer glints and hover transitions.

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

Clear · 28% / 36% · 8px

Short media labels with a separate uniform 70% backing.

Regular · 56% / 76% · 10px

Navigation, toolbars and standalone secondary actions.

Dense · 80% / 86% · 20px

Recent files

- Project progress report
- Notes for the next review

Menus, lists, drawers and text-rich floating surfaces.

Glass provides material-glass-clear, material-glass-regular and material-glass-dense className presets on actual material surfaces. Clear uses 28% / 36% light/dark fill with 8px blur; Regular uses 56% / 76% with 10px; Dense uses 80% / 86% with 20px. Navigation, Toolbar and standalone secondary actions default to Regular; menus, selection lists, drawers and dialog surfaces default to Dense. Clear is explicit for a few media icons or short labels, with separate uniform scene backing and measured contrast. All three use 160% light and 150% dark backdrop saturation. Regular fill is tuned for neutral palettes and uncontrolled backgrounds; still check actual contrast after text, states and sheen are composited.

A fixed or sticky Navbar uses Regular fill and 24px backdrop blur on a separate background layer, keeping text and interaction in the foreground. SiteNavigation hover panels extend beyond that sampler and independently use Dense with 20px blur, controlled by --material-texture-glass-overlay-blur. Inner buttons share their functional surface sampler. Authored backgrounds, filters, local blur tokens and header before pseudo-elements retain priority.

Secondary buttons, card radios, Toolbar, secondary Tabs, Switch, Toggle and navigation actions use lightweight CSS pointer glints and interpolated hover states, with existing motion tokens on entry and exit. Fine-pointer glints update once per frame; pressing fixes the contact point, keyboard feedback uses the center, and touch expresses only pressed state. Buttons, navigation, text and hit areas stay in place; Toggle retains its thumb animation. Inner controls add no backdrop sampler. Reduced motion disables tracking and added transitions.

Root tokens provide the Regular baseline; Clear / Dense use local presets, with author tokens on the same surface taking precedence. setTokens(values, { target: surface }) customizes that surface; resetTokens(names, { target: surface }) restores its preset. Explicit Regular restores the root baseline. Put className on actual portal content, rather than its trigger. Select.className styles only the trigger; its list uses automatic Dense.

prefers-contrast: more uses 92% / 96% fill, Dense blur and neutral outlines mixed from 65% foreground color. Only private effective inputs change; public tokens retain requested values. Reduced transparency and forced colors take precedence and resolve to Solid. Test actual composited backgrounds for at least 4.5:1 normal text and 3:1 large text and necessary control indicators; use separate uniform backing or Dense for difficult backgrounds.

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

Acrylic uses 8px diffusion and 80% fill. Aero preserves the former Glass: 20px diffusion, 60% light fill and 74% dark fill. Glass keeps body alpha and blur uniform across the surface; a static directional gradient adds sheen without claiming physical refraction or spatially variable blur. Secondary copy gains contrast on floating surfaces; reading content and inner controls remain clear. When a continuous-corner shadow container creates a backdrop sampling boundary, its inner surface uses an opaque fill to preserve clipping and shadows.

Functional layers choose material thickness by purpose. Acrylic, Aero and Glass use soft projections and translucent hairlines; navigation bars and toolbars retain strokes only. Default tooltips with stems and ContextCard use stable opaque surfaces to avoid stem seams; default tooltips without stems can transmit the backdrop. Status-colored tooltips, toasts and inverted chart hints retain opaque fills to preserve contrast.

Aero retains the former secondary-button and card-radio treatment: 72% / 80% fill, 6px blur and static optics. Glass controls express hover, press and selection through sheen, state fills and fine edges, without refraction poses or gel compression. Selected semantic colors form a separate uniform state layer that can occlude transmission to protect state recognition; author event cancellation, no-scroll focus and keyboard behavior are preserved.

Glass applies one CSS backdrop-filter for blur and saturation, leaving foreground text unfiltered. Static diagonal sheen, thin inset edges and shadows establish depth; control glints are separate decoration without changing body alpha or adding blur. There are no SVG displacement filters, map encoding, geometry caches or browser-version allowlists.

CSS-only pages and browsers supporting backdrop filters use the same static Glass. Pointer updates request a frame only after input and clean up on exit, cancellation, disable and unmount, with no idle animation loop. Reduced transparency, forced colors or missing basic capabilities resolve to Solid; reduced motion disables added tracking and transitions.

Body content and ordinary cards do not become glass automatically. Opt in by combining material-glass-clear, material-glass-regular or material-glass-dense with material-base, material-small, material-medium or material-large. Plain DOM cards use static sheen without automatic pointer listeners, layout changes, new corner radii or changes to author transforms.

The naming migration is unchanged: Hybrid becomes Acrylic (hybrid → acrylic), and the original Glass becomes Aero (glass → aero). Legacy storage migrates to unitary-texture-preference-v2; valid v2 values win, and saved v2 glass continues to select Glass with its new appearance. Rename the original Glass token prefix to aero and the hybrid prefix to acrylic.

This replacement removes ten optical tokens under --material-texture-glass-: ior, roughness, thickness, absorption, light-azimuth, light-intensity, ambient-intensity, ambient-color, refraction and edge-width. Remove these names from setTokens, resetTokens and CSS overrides. They are no longer valid RuntimeTokenName values; setTokens rejects unknown names, with no no-op compatibility mapping. Continue using blur, overlay-blur and opacity to adjust blur and body fill.

Material organization draws on [Luotopia · whu.sb](https://www.whu.sb/) for its blur, translucent fill, directional sheen and fine-edge mechanisms, independently implemented for Unitary UI without porting site code, assets or layout.

glass-appearance.tsx

```tsx
import { setTokens, resetTokens } from "@hustradio/unitary-ui";

const surface = document.querySelector<HTMLElement>(".my-glass-surface");
if (surface) {
  setTokens(
    {
      "--material-texture-glass-blur": "10px",
      "--material-texture-glass-overlay-blur": "20px",
      "--material-texture-glass-opacity": "56%",
    },
    { target: surface },
  );

  // Restore this surface's Clear, Regular or Dense preset.
  resetTokens(
    [
      "--material-texture-glass-blur",
      "--material-texture-glass-overlay-blur",
      "--material-texture-glass-opacity",
    ],
    { target: surface },
  );
}

// Ordinary content cards opt in explicitly; their sheen is static.
export function PreviewCard() {
  return (
    <div className="my-glass-surface material-medium material-glass-regular p-5">
      <h3>Project preview</h3>
      <p>Keep text and controls clear.</p>
    </div>
  );
}
```

Compact controls that communicate a state, count or category keep stable solid foregrounds and semantic colors, using a local fill when emphasis is needed. Text or icons supplement color; the whole control does not need a glass treatment.

In Acrylic, Aero and Glass, functional dividers and existing control borders use neutral translucent lines derived from the current palette’s primary text color, independently of decorative highlights; `--material-texture-line-opacity` adjusts their shared strength, defaulting to 18% in light mode and 22% in dark mode. Solid retains its existing lines, and custom border colors are preserved.

## Surface

For containers within the page. Use a light shadow to distinguish layers without drawing too much attention.

Ordinary surfaces retain their appearance. Explicitly combine material-medium and material-glass-regular to opt into Glass, preserving existing radii, dimensions and elevation with static material sheen.

An explicitly selected content card

material-medium material-glass-regular

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
- Acrylic / Aero functional layers default to at most 20px blur and standalone controls to 6px. Glass Clear / Regular / Dense use 8px / 10px / 20px, fixed headers use 24px, hover panels use 20px and masks use 8px. Inner controls share their outer sampler; pointer updates coalesce per frame and stop when idle.

[Apple HIG · Materials](https://developer.apple.com/design/human-interface-guidelines/materials) · [MDN · backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) · [MDN · prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency)
