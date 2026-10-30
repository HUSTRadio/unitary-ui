# API 总览

> Route: `/api`

# API 总览

按用途查找包根公开的钩子和工具。组件属性由各组件页面维护，布局与层级接口由对应专题维护。

## API 约定

状态型组件同时提供受控值与非受控默认值：Switch 使用 checked / defaultChecked，传入 checked 时组件只通过 onCheckedChange 报告变化，不再保留内部状态；同一次渲染以受控值为准。

回调命名跟随职责：原生表单事件仍是 onChange / onInput，参数是事件对象；状态迁移用 onXxxChange（onOpenChange、onValueChange），参数是新值。约定只承诺参数语义，不承诺组件内部实现。

组件不发起网络请求：包内没有 fetch、XMLHttpRequest 或 HTTP 客户端。数据由调用方获取后以 props 传入，加载与错误也由调用方渲染（Skeleton、ErrorCard）；钩子只处理本地状态、订阅与 DOM 生命周期。

canonical 优先于 alias：Button 的 type 优先于 variant；已移除的尺寸名（Button 的 xs / sm / default / lg / icon\*，Input 与 Select 的 medium）不会再作为别名恢复。跨组件档位在调用点显式映射，不新增全库统一的 Variant 抽象。

- 32px 档：Button small ↔ Input small ↔ Select small（Textarea small 为 80px 高度）
- 36px 档：Button medium ↔ Input default ↔ Select default ↔ Textarea medium（100px 高度）
- 40px 档：Button large ↔ Input large ↔ Select large（Textarea large 为 120px 高度）

间距分三层：LayoutSpacing（xs、sm、md、lg、xl）是组件 prop 的档位，Tailwind --spacing 支撑 utility 刻度，导航语义变量（--uni-nav-space-\*）承载导航节奏。三层继续共存，不要新增 --space-1…n 这类平行刻度；纯文档调整不制造 token catalog diff。

## 滚动与导航布局

最近滚动容器中的可取消滚动，以及侧栏与菜单共用的内容留白。

```tsx
import { scrollIntoViewWithMotion, NAV_CONTENT_INSET } from "@hustradio/unitary-ui";
```

[查看参考](#/api#scrolling)

## 主题与国际化

管理明暗偏好、文档全局 Solid、Acrylic、Aero、Glass 外观和框架消息语言；UI 配色与代码主题独立设置。

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

通用状态约定、可选的草稿持久化，以及共用退避的 Task 数据适配器；组件专用钩子分别由 Radio 和 Toast 文档维护。

```tsx
import {
  useRadio,
  useToasts,
  createToastStore,
  useDraft,
  usePolling,
  useEventStream,
  nextBackoffDelay,
} from "@hustradio/unitary-ui";
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
  installFontMetrics,
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

## 滚动与导航布局

scrollIntoViewWithMotion(target, block = "start") 接受 HTMLElement，block 支持 "start" 或 "center"；只移动最近的纵向滚动容器，找不到时使用文档滚动容器，并考虑目标的 scroll-margin 与容器的 scroll-padding。返回 ScrollAnimation，其中 cancel() 停止当前动画，refresh() 唤醒尚未结束的动画。调用方应在组件卸载时取消；该函数不移动焦点。

动画从目标的级联样式读取 --uni-motion-state 与 --ease-in-out。减少动态效果时立即定位，动画期间偏好切换也立即完成。滚轮、触摸、指针与滚动按键会中断动画；同一容器的新滚动命令取消旧命令。

NAV\_CONTENT\_INSET 是共用的 px-6 py-4 类名字符串，在默认 spacing 尺度下提供水平 24px、垂直 16px 的留白。将其应用于调用方拥有的 SidebarNav 滚动容器，可与 HamburgerMenu 的内容留白保持一致。

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

## Provider 与钩子

ThemeProvider 接收 children，以及材质设置 texture、defaultTexture 和 onTextureChange。useTheme 必须在其内部调用：preference、resolvedTheme 和 setPreference 管理 light、dark 或 system；texture、resolvedTexture 和 setTexture 管理 solid、acrylic、aero 或 glass（Solid、Acrylic、Aero、Glass）。材质默认 solid，非受控选择独立持久化；实际外观会随浏览器能力与辅助功能条件回退为 Solid。根 Provider 对整个文档及 Portal 生效，嵌套 Provider 继承根材质设置。I18nProvider 接收 children 和 locale（默认 zh-CN）；useI18n 返回 locale 与 t(key, values?)，无 Provider 时使用英语。

[材质规范与全局切换](#/materials) · `TexturePreference = "solid" | "acrylic" | "aero" | "glass"`

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

## 导航关闭与工具边界

useDismissOnNavigate(onDismiss, enabled = true) 订阅 hashchange 和 popstate，并在卸载时清理；普通 pushState 本身不会触发这些事件。字体探针在浏览器自动注册，useFontMetrics(fontStack?) 用于显式控制和字体方案变化。cn 合并条件类名及冲突的工具类；连续曲率工具返回几何路径，完整参数见 Continuous Surface。

[Radio / useRadio](#/components/radio) · [Toast / useToasts / createToastStore](#/components/toast) · [状态与事件](#/api/state-and-events)
