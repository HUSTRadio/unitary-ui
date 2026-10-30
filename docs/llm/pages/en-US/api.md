# API Overview

> Route: `/api`

# API Overview

Find package-root hooks and utilities by purpose. Component pages own their props; layout topics own their corresponding interfaces.

## API conventions

Stateful components pair a controlled value with an uncontrolled default: Switch takes checked / defaultChecked, and once checked is supplied the component only reports changes through onCheckedChange instead of keeping internal state. The controlled value wins in the same render.

Callbacks follow their job: native form events stay onChange / onInput with an event object, while state transitions use onXxxChange (onOpenChange, onValueChange) carrying the new value. The convention promises argument semantics, not internal implementation.

Components never perform network requests: the package contains no fetch, XMLHttpRequest or HTTP client. Callers fetch data and pass it as props, and callers render loading and error states (Skeleton, ErrorCard). Hooks handle local state, subscriptions and DOM lifecycle only.

Canonical names win over aliases: Button's type takes precedence over variant, and retired size names (xs / sm / default / lg / icon\* on Button, medium on Input and Select) are not coming back as aliases. Map tiers explicitly at the call site instead of adding a library-wide Variant abstraction.

- 32px tier: Button small ↔ Input small ↔ Select small (Textarea small is an 80px box)
- 36px tier: Button medium ↔ Input default ↔ Select default ↔ Textarea medium (100px box)
- 40px tier: Button large ↔ Input large ↔ Select large (Textarea large is a 120px box)

Spacing has three layers: LayoutSpacing (xs, sm, md, lg, xl) is the component-prop tier, Tailwind --spacing backs the utility scale, and navigation semantic variables (--uni-nav-space-\*) carry navigation rhythm. All three coexist; do not add a parallel --space-1…n scale, and do not create token catalog churn for documentation-only tweaks.

## Scrolling & navigation layout

Cancellable scrolling in the nearest scroll container and shared sidebar/menu content spacing.

```tsx
import { scrollIntoViewWithMotion, NAV_CONTENT_INSET } from "@hustradio/unitary-ui";
```

[View reference](#/api#scrolling)

## Theme & localization

Light/dark preferences, document-wide Solid, Acrylic, Aero and Glass appearances, and framework messages; UI palettes and code themes stay independent.

```tsx
import { ThemeProvider, useTheme, I18nProvider, useI18n } from "@hustradio/unitary-ui";
```

[View reference](#/api#providers)

## Color schemes & code themes

Named UI palettes and independent inline and block code themes for explicit DOM scopes.

```tsx
import {
  COLOR_SCHEMES,
  CODE_THEMES,
  getColorScheme,
  getCodeTheme,
  resolveCodeTheme,
  getInlineCodeColors,
  createColorSchemeCSS,
  applyColorScheme,
  applyCodeTheme,
} from "@hustradio/unitary-ui";
```

[View reference](#/api/color-schemes)

## Design tokens

Read, override, subscribe to and restore runtime variables.

```tsx
import {
  GLOBAL_TOKENS,
  TOKEN_NAMES,
  RUNTIME_TOKEN_NAMES,
  getToken,
  getTokens,
  setToken,
  setTokens,
  resetToken,
  resetTokens,
  subscribeTokens,
  useTokens,
} from "@hustradio/unitary-ui";
```

[View reference](#/api/tokens)

## Layout & layers

Semantic levels and scoped portal configuration.

```tsx
import { Layer, LayerScope, LayerPortal, useLayerStyle } from "@hustradio/unitary-ui";
```

[View reference](#/layout/layer)

## State & events

Common state conventions, plus opt-in draft persistence under a namespaced, versioned storage key; component-specific hooks are documented on Radio and Toast.

```tsx
import { useRadio, useToasts, createToastStore, useDraft } from "@hustradio/unitary-ui";
```

[View reference](#/api/state-and-events)

## Navigation & prefetch

Navigation dismissal and shared loading resources.

```tsx
import { useDismissOnNavigate, createPrefetch, usePrefetchState } from "@hustradio/unitary-ui";
```

[View reference](#/network/prefetch)

## Font metrics

Measure fonts and apply the framework's typography compensation.

```tsx
import {
  probeFontMetrics,
  installFontMetrics,
  useFontMetrics,
  measureFontMetrics,
  applyFontMetrics,
} from "@hustradio/unitary-ui";
```

[View reference](#/layout/typography)

## Geometry & utilities

Merge classes and generate continuous corner geometry.

```tsx
import {
  cn,
  CIRCULAR_CORNER_EXPONENT,
  CONTINUOUS_CORNER_EXPONENT,
  continuousCornerPath,
  cornerCurvePoints,
  superellipsePath,
  useContinuousCorners,
} from "@hustradio/unitary-ui";
```

[View reference](#/components/continuous-surface)

## Chart colors

Build category color maps and chart utility classes.

```tsx
import {
  AvailableChartColors,
  constructCategoryColors,
  getColorClassName,
} from "@hustradio/unitary-ui";
```

[View reference](#/charts)

## Scrolling and navigation layout

scrollIntoViewWithMotion(target, block = "start") accepts an HTMLElement and "start" or "center" alignment. It moves only the nearest vertical scroll container, falling back to the document, and respects target scroll-margin and container scroll-padding. It returns a ScrollAnimation: cancel() stops the animation; refresh() wakes an unfinished animation. Cancel on component unmount. The function does not move focus.

The animation reads --uni-motion-state and --ease-in-out from the target's cascaded styles. Reduced motion positions immediately, including preference changes during animation. Wheel, touch, pointer and scrolling keys interrupt movement; a new command for the same container cancels the previous command.

NAV\_CONTENT\_INSET is the shared px-6 py-4 class string, providing 24px horizontal and 16px vertical padding at the default spacing scale. Apply it to the caller-owned SidebarNav scroll container to match HamburgerMenu content spacing.

```tsx
import { useEffect, useRef } from "react";
import {
  NAV_CONTENT_INSET,
  scrollIntoViewWithMotion,
  type ScrollAnimation,
} from "@hustradio/unitary-ui";

export function ScrollExample() {
  const target = useRef<HTMLHeadingElement>(null);
  const animation = useRef<ScrollAnimation | null>(null);
  useEffect(() => () => animation.current?.cancel(), []);
  return (
    <div className={NAV_CONTENT_INSET} style={{ height: 240, overflowY: "auto" }}>
      <button
        onClick={() => {
          if (!target.current) return;
          animation.current?.cancel();
          animation.current = scrollIntoViewWithMotion(target.current, "start");
        }}
      >
        Scroll to heading
      </button>
      <div style={{ height: 320 }} />
      <h2 ref={target} style={{ scrollMarginBlockStart: 16 }}>
        Target
      </h2>
    </div>
  );
}
```

## Providers and hooks

ThemeProvider accepts children and texture, defaultTexture and onTextureChange. useTheme requires it: preference, resolvedTheme and setPreference manage light, dark or system; texture, resolvedTexture and setTexture manage solid, acrylic, aero or glass (Solid, Acrylic, Aero, Glass). Texture defaults to solid; uncontrolled choices persist independently, and applied appearance can fall back to Solid according to browser capabilities and accessibility conditions. The root provider applies texture to the whole document and portals; nested providers inherit its texture preference. I18nProvider accepts children and locale (zh-CN by default); useI18n returns locale and t(key, values?), with English outside a provider.

[Materials and global texture controls](#/materials) · `TexturePreference = "solid" | "acrylic" | "aero" | "glass"`

```tsx
import { ThemeProvider, I18nProvider, useTheme, useI18n } from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles.css";

function Preferences() {
  const { preference, resolvedTheme, setPreference, texture, resolvedTexture, setTexture } =
    useTheme();
  const { locale, t } = useI18n();
  return (
    <div>
      <button onClick={() => setPreference("system")}>
        {t("System")} — {locale} / {preference} / {resolvedTheme}
      </button>
      <button onClick={() => setTexture("glass")}>
        {texture} / {resolvedTexture}
      </button>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider defaultTexture="solid">
      <I18nProvider locale="zh-CN">
        <Preferences />
      </I18nProvider>
    </ThemeProvider>
  );
}
```

## Navigation dismissal and utilities

useDismissOnNavigate(onDismiss, enabled = true) subscribes to hashchange and popstate and cleans up on unmount; pushState alone emits neither event. The font probe registers automatically in the browser; useFontMetrics(fontStack?) supports explicit control and font-tier changes. cn merges conditional and conflicting utility classes; continuous corner utilities produce geometry paths. See Continuous Surface for parameters.

[Radio / useRadio](#/components/radio) · [Toast / useToasts / createToastStore](#/components/toast) · [State & Events](#/api/state-and-events)
