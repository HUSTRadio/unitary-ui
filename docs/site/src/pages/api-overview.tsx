import { Link } from "react-router-dom";
import { CodeBlock } from "@hustradio/unitary-ui";
import { FRAMEWORK_API } from "../data/framework-api";
import type { DocsLanguage } from "../i18n/language";
import { DocsPageTitle, DocsPageLead, DocsSection, DocsSectionTitle, DocsParagraph, DocsList } from "../components/docs-typography";

const providers = `import { ThemeProvider, I18nProvider, useTheme, useI18n } from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles.css";

function Preferences() {
  const { preference, resolvedTheme, setPreference, texture, resolvedTexture, setTexture } = useTheme();
  const { locale, t } = useI18n();
  return <div><button onClick={() => setPreference("system")}>
    {t("System")} — {locale} / {preference} / {resolvedTheme}
  </button><button onClick={() => setTexture("glass")}>
    {texture} / {resolvedTexture}
  </button></div>;
}

export function App() {
  return <ThemeProvider defaultTexture="solid"><I18nProvider locale="zh-CN">
    <Preferences />
  </I18nProvider></ThemeProvider>;
}`;

const scrolling = `import { useEffect, useRef } from "react";
import { NAV_CONTENT_INSET, scrollIntoViewWithMotion, type ScrollAnimation } from "@hustradio/unitary-ui";

export function ScrollExample() {
  const target = useRef<HTMLHeadingElement>(null);
  const animation = useRef<ScrollAnimation | null>(null);
  useEffect(() => () => animation.current?.cancel(), []);
  return <div className={NAV_CONTENT_INSET} style={{ height: 240, overflowY: "auto" }}>
    <button onClick={() => {
      if (!target.current) return;
      animation.current?.cancel();
      animation.current = scrollIntoViewWithMotion(target.current, "start");
    }}>Scroll to heading</button>
    <div style={{ height: 320 }} />
    <h2 ref={target} style={{ scrollMarginBlockStart: 16 }}>Target</h2>
  </div>;
}`;

export function ApiOverviewPage({ language }: { language: DocsLanguage }) {
  const zh = language === "zh-CN";
  return <article className="min-w-0 max-w-3xl">
    <DocsPageTitle>{zh ? "API 总览" : "API Overview"}</DocsPageTitle>
    <DocsPageLead>{zh ? "按用途查找包根公开的钩子和工具。组件属性由各组件页面维护，布局与层级接口由对应专题维护。" : "Find package-root hooks and utilities by purpose. Component pages own their props; layout topics own their corresponding interfaces."}</DocsPageLead>
    <DocsSection id="conventions">
      <DocsSectionTitle>{zh ? "API 约定" : "API conventions"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "状态型组件同时提供受控值与非受控默认值：Switch 使用 checked / defaultChecked，传入 checked 时组件只通过 onCheckedChange 报告变化，不再保留内部状态；同一次渲染以受控值为准。"
          : "Stateful components pair a controlled value with an uncontrolled default: Switch takes checked / defaultChecked, and once checked is supplied the component only reports changes through onCheckedChange instead of keeping internal state. The controlled value wins in the same render."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "回调命名跟随职责：原生表单事件仍是 onChange / onInput，参数是事件对象；状态迁移用 onXxxChange（onOpenChange、onValueChange），参数是新值。约定只承诺参数语义，不承诺组件内部实现。"
          : "Callbacks follow their job: native form events stay onChange / onInput with an event object, while state transitions use onXxxChange (onOpenChange, onValueChange) carrying the new value. The convention promises argument semantics, not internal implementation."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "组件不发起网络请求：包内没有 fetch、XMLHttpRequest 或 HTTP 客户端。数据由调用方获取后以 props 传入，加载与错误也由调用方渲染（Skeleton、ErrorCard）；钩子只处理本地状态、订阅与 DOM 生命周期。"
          : "Components never perform network requests: the package contains no fetch, XMLHttpRequest or HTTP client. Callers fetch data and pass it as props, and callers render loading and error states (Skeleton, ErrorCard). Hooks handle local state, subscriptions and DOM lifecycle only."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "canonical 优先于 alias：Button 的 type 优先于 variant；已移除的尺寸名（Button 的 xs / sm / default / lg / icon*，Input 与 Select 的 medium）不会再作为别名恢复。跨组件档位在调用点显式映射，不新增全库统一的 Variant 抽象。"
          : "Canonical names win over aliases: Button's type takes precedence over variant, and retired size names (xs / sm / default / lg / icon* on Button, medium on Input and Select) are not coming back as aliases. Map tiers explicitly at the call site instead of adding a library-wide Variant abstraction."}
      </DocsParagraph>
      <DocsList>
        <li>{zh ? "32px 档：Button small ↔ Input small ↔ Select small（Textarea small 为 80px 高度）" : "32px tier: Button small ↔ Input small ↔ Select small (Textarea small is an 80px box)"}</li>
        <li>{zh ? "36px 档：Button medium ↔ Input default ↔ Select default ↔ Textarea medium（100px 高度）" : "36px tier: Button medium ↔ Input default ↔ Select default ↔ Textarea medium (100px box)"}</li>
        <li>{zh ? "40px 档：Button large ↔ Input large ↔ Select large（Textarea large 为 120px 高度）" : "40px tier: Button large ↔ Input large ↔ Select large (Textarea large is a 120px box)"}</li>
      </DocsList>
      <DocsParagraph>
        {zh
          ? "间距分三层：LayoutSpacing（xs、sm、md、lg、xl）是组件 prop 的档位，Tailwind --spacing 支撑 utility 刻度，导航语义变量（--uni-nav-space-*）承载导航节奏。三层继续共存，不要新增 --space-1…n 这类平行刻度；纯文档调整不制造 token catalog diff。"
          : "Spacing has three layers: LayoutSpacing (xs, sm, md, lg, xl) is the component-prop tier, Tailwind --spacing backs the utility scale, and navigation semantic variables (--uni-nav-space-*) carry navigation rhythm. All three coexist; do not add a parallel --space-1…n scale, and do not create token catalog churn for documentation-only tweaks."}
      </DocsParagraph>
    </DocsSection>
    {FRAMEWORK_API.map((entry) => <DocsSection key={entry.title} data-api-directory={entry.title}>
      <DocsSectionTitle>{zh ? entry.titleZh : entry.title}</DocsSectionTitle>
      <DocsParagraph>{zh ? entry.descriptionZh : entry.description}</DocsParagraph>
      <CodeBlock language="tsx" hideLineNumbers>{`import { ${entry.names.join(", ")} } from "@hustradio/unitary-ui";`}</CodeBlock>
      <Link className="text-link underline underline-offset-4" to={entry.to}>{zh ? "查看参考" : "View reference"}</Link>
    </DocsSection>)}
    <DocsSection id="scrolling">
      <DocsSectionTitle>{zh ? "滚动与导航布局" : "Scrolling and navigation layout"}</DocsSectionTitle>
      <DocsParagraph>{zh ? 'scrollIntoViewWithMotion(target, block = "start") 接受 HTMLElement，block 支持 "start" 或 "center"；只移动最近的纵向滚动容器，找不到时使用文档滚动容器，并考虑目标的 scroll-margin 与容器的 scroll-padding。返回 ScrollAnimation，其中 cancel() 停止当前动画，refresh() 唤醒尚未结束的动画。调用方应在组件卸载时取消；该函数不移动焦点。' : 'scrollIntoViewWithMotion(target, block = "start") accepts an HTMLElement and "start" or "center" alignment. It moves only the nearest vertical scroll container, falling back to the document, and respects target scroll-margin and container scroll-padding. It returns a ScrollAnimation: cancel() stops the animation; refresh() wakes an unfinished animation. Cancel on component unmount. The function does not move focus.'}</DocsParagraph>
      <DocsParagraph>{zh ? "动画从目标的级联样式读取 --uni-motion-state 与 --ease-in-out。减少动态效果时立即定位，动画期间偏好切换也立即完成。滚轮、触摸、指针与滚动按键会中断动画；同一容器的新滚动命令取消旧命令。" : "The animation reads --uni-motion-state and --ease-in-out from the target's cascaded styles. Reduced motion positions immediately, including preference changes during animation. Wheel, touch, pointer and scrolling keys interrupt movement; a new command for the same container cancels the previous command."}</DocsParagraph>
      <DocsParagraph>{zh ? "NAV_CONTENT_INSET 是共用的 px-6 py-4 类名字符串，在默认 spacing 尺度下提供水平 24px、垂直 16px 的留白。将其应用于调用方拥有的 SidebarNav 滚动容器，可与 HamburgerMenu 的内容留白保持一致。" : "NAV_CONTENT_INSET is the shared px-6 py-4 class string, providing 24px horizontal and 16px vertical padding at the default spacing scale. Apply it to the caller-owned SidebarNav scroll container to match HamburgerMenu content spacing."}</DocsParagraph>
      <CodeBlock language="tsx">{scrolling}</CodeBlock>
    </DocsSection>
    <DocsSection id="providers">
      <DocsSectionTitle>{zh ? "Provider 与钩子" : "Providers and hooks"}</DocsSectionTitle>
      <DocsParagraph>{zh ? "ThemeProvider 接收 children，以及材质设置 texture、defaultTexture 和 onTextureChange。useTheme 必须在其内部调用：preference、resolvedTheme 和 setPreference 管理 light、dark 或 system；texture、resolvedTexture 和 setTexture 管理 solid、acrylic、aero 或 glass（Solid、Acrylic、Aero、Glass）。材质默认 solid，非受控选择独立持久化；实际外观会随浏览器能力与辅助功能条件回退为 Solid。根 Provider 对整个文档及 Portal 生效，嵌套 Provider 继承根材质设置。I18nProvider 接收 children 和 locale（默认 zh-CN）；useI18n 返回 locale 与 t(key, values?)，无 Provider 时使用英语。" : "ThemeProvider accepts children and texture, defaultTexture and onTextureChange. useTheme requires it: preference, resolvedTheme and setPreference manage light, dark or system; texture, resolvedTexture and setTexture manage solid, acrylic, aero or glass (Solid, Acrylic, Aero, Glass). Texture defaults to solid; uncontrolled choices persist independently, and applied appearance can fall back to Solid according to browser capabilities and accessibility conditions. The root provider applies texture to the whole document and portals; nested providers inherit its texture preference. I18nProvider accepts children and locale (zh-CN by default); useI18n returns locale and t(key, values?), with English outside a provider."}</DocsParagraph>
      <DocsParagraph><Link className="text-link underline" to="/materials">{zh ? "材质规范与全局切换" : "Materials and global texture controls"}</Link>{" · "}<code>TexturePreference = "solid" | "acrylic" | "aero" | "glass"</code></DocsParagraph>
      <CodeBlock language="tsx">{providers}</CodeBlock>
    </DocsSection>
    <DocsSection>
      <DocsSectionTitle>{zh ? "导航关闭与工具边界" : "Navigation dismissal and utilities"}</DocsSectionTitle>
      <DocsParagraph>{zh ? "useDismissOnNavigate(onDismiss, enabled = true) 订阅 hashchange 和 popstate，并在卸载时清理；普通 pushState 本身不会触发这些事件。字体探针在浏览器自动注册，useFontMetrics(fontStack?) 用于显式控制和字体方案变化。cn 合并条件类名及冲突的工具类；连续曲率工具返回几何路径，完整参数见 Continuous Surface。" : "useDismissOnNavigate(onDismiss, enabled = true) subscribes to hashchange and popstate and cleans up on unmount; pushState alone emits neither event. The font probe registers automatically in the browser; useFontMetrics(fontStack?) supports explicit control and font-tier changes. cn merges conditional and conflicting utility classes; continuous corner utilities produce geometry paths. See Continuous Surface for parameters."}</DocsParagraph>
      <DocsParagraph><Link className="text-link underline" to="/components/radio">Radio / useRadio</Link>{" · "}<Link className="text-link underline" to="/components/toast">Toast / useToasts / createToastStore</Link>{" · "}<Link className="text-link underline" to="/api/state-and-events">{zh ? "状态与事件" : "State & Events"}</Link></DocsParagraph>
    </DocsSection>
  </article>;
}
