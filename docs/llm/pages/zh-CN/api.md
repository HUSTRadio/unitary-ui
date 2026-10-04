# API 总览

> Route: `/api`

# API 总览

按用途查找包根公开的钩子和工具。组件属性由各组件页面维护，布局与层级接口由对应专题维护。

## 主题与国际化

管理主题偏好和框架消息语言。

```tsx
import { ThemeProvider, useTheme, I18nProvider, useI18n } from "@hustradio/unitary-ui";
```

[查看参考](#/api#providers)

## 配色方案与代码主题

为明确的 DOM 容器提供命名 UI 配色，以及独立的行内和代码块主题。

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

[查看参考](#/api/color-schemes)

## 设计变量

读取、覆盖、订阅和恢复运行时变量。

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

[查看参考](#/api/tokens)

## 布局与层级

管理语义层级和局部 Portal 配置。

```tsx
import { Layer, LayerScope, LayerPortal, useLayerStyle } from "@hustradio/unitary-ui";
```

[查看参考](#/layout/layer)

## 状态与事件

通用状态约定；组件专用钩子分别由 Radio 和 Toast 文档维护。

```tsx
import { useRadio, useToasts, createToastStore } from "@hustradio/unitary-ui";
```

[查看参考](#/api/state-and-events)

## 导航与预载

导航关闭与共享加载资源。

```tsx
import { useDismissOnNavigate, createPrefetch, usePrefetchState } from "@hustradio/unitary-ui";
```

[查看参考](#/network/prefetch)

## 字体度量

测量字体并应用框架的排版补偿。

```tsx
import {
  probeFontMetrics,
  useFontMetrics,
  measureFontMetrics,
  applyFontMetrics,
} from "@hustradio/unitary-ui";
```

[查看参考](#/layout/typography)

## 几何与工具

合并样式类并生成连续曲率几何。

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

[查看参考](#/components/continuous-surface)

## 图表颜色

生成分类配色映射和图表样式类。

```tsx
import {
  AvailableChartColors,
  constructCategoryColors,
  getColorClassName,
} from "@hustradio/unitary-ui";
```

[查看参考](#/charts)

## Provider 与钩子

ThemeProvider 接收 children；useTheme 必须在其内部调用，返回 preference、resolvedTheme 和 setPreference。偏好为 light、dark 或 system，保存在本地存储并应用到页面根元素。I18nProvider 接收 children 和 locale（默认 zh-CN）；useI18n 返回 locale 与 t(key, values?)，无 Provider 时使用英语。

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

## 导航关闭与工具边界

useDismissOnNavigate(onDismiss, enabled = true) 订阅 hashchange 和 popstate，并在卸载时清理；普通 pushState 本身不会触发这些事件。字体探针在浏览器自动注册，useFontMetrics(fontStack?) 用于显式控制和字体方案变化。cn 合并条件类名及冲突的工具类；连续曲率工具返回几何路径，完整参数见 Continuous Surface。

[Radio / useRadio](#/components/radio) · [Toast / useToasts / createToastStore](#/components/toast) · [状态与事件](#/api/state-and-events)
