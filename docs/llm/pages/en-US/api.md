# API Overview

> Route: `/api`

# API Overview

Find package-root hooks and utilities by purpose. Component pages own their props; layout topics own their corresponding interfaces.

## Theme & localization

Theme preferences and framework messages.

```tsx
import { ThemeProvider, useTheme, I18nProvider, useI18n } from "@hustradio/unitary-ui";
```

[View reference](#/api#providers)

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

## Providers and hooks

ThemeProvider accepts children; useTheme requires it and returns preference, resolvedTheme and setPreference. Preferences are light, dark or system, persisted locally and applied to the document root. I18nProvider accepts children and locale (zh-CN by default); useI18n returns locale and t(key, values?), with English outside a provider.

```tsx
import { ThemeProvider, I18nProvider, useTheme, useI18n } from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles.css";

function Preferences() {
  const { preference, resolvedTheme, setPreference } = useTheme();
  const { locale, t } = useI18n();
  return (
    <button onClick={() => setPreference("system")}>
      {t("System")} — {locale} / {preference} / {resolvedTheme}
    </button>
  );
}

export function App() {
  return (
    <ThemeProvider>
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
