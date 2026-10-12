# API Overview

> Route: `/api`

# API Overview

Find package-root hooks and utilities by purpose. Component pages own their props; layout topics own their corresponding interfaces.

## Scrolling & navigation layout

Cancellable scrolling in the nearest scroll container and shared sidebar/menu content spacing.

```tsx
import { scrollIntoViewWithMotion, NAV_CONTENT_INSET } from "@hustradio/unitary-ui";
```

[View reference](#/api#scrolling)

## Theme & localization

Light/dark preferences, document-wide Solid, Hybrid and Glass appearances, and framework messages; UI palettes and code themes stay independent.

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

Common state conventions; component-specific hooks are documented on Radio and Toast.

```tsx
import { useRadio, useToasts, createToastStore } from "@hustradio/unitary-ui";
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

ThemeProvider accepts children and texture, defaultTexture and onTextureChange. useTheme requires it: preference, resolvedTheme and setPreference manage light, dark or system; texture, resolvedTexture and setTexture manage solid, hybrid or glass (Solid, Hybrid, Glass). Texture defaults to solid; uncontrolled choices persist independently, and applied appearance can fall back to Solid according to browser capabilities and accessibility conditions. The root provider applies texture to the whole document and portals; nested providers inherit its texture preference. I18nProvider accepts children and locale (zh-CN by default); useI18n returns locale and t(key, values?), with English outside a provider.

[Materials and global texture controls](#/materials) · `TexturePreference = "solid" | "hybrid" | "glass"`

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
