import { Link } from "react-router-dom";
import { CodeBlock } from "@/components/ui/code-block";
import { FRAMEWORK_API } from "../data/framework-api";
import type { DocsLanguage } from "../i18n/language";
import { DocsPageTitle, DocsPageLead, DocsSection, DocsSectionTitle, DocsParagraph } from "../components/docs-typography";

const providers = `import { ThemeProvider, I18nProvider, useTheme, useI18n } from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles.css";

function Preferences() {
  const { preference, resolvedTheme, setPreference } = useTheme();
  const { locale, t } = useI18n();
  return <button onClick={() => setPreference("system")}>
    {t("System")} — {locale} / {preference} / {resolvedTheme}
  </button>;
}

export function App() {
  return <ThemeProvider><I18nProvider locale="zh-CN">
    <Preferences />
  </I18nProvider></ThemeProvider>;
}`;

export function ApiOverviewPage({ language }: { language: DocsLanguage }) {
  const zh = language === "zh-CN";
  return <article className="min-w-0 max-w-3xl">
    <DocsPageTitle>{zh ? "API 总览" : "API Overview"}</DocsPageTitle>
    <DocsPageLead>{zh ? "按用途查找包根公开的钩子和工具。组件属性由各组件页面维护，布局与层级接口由对应专题维护。" : "Find package-root hooks and utilities by purpose. Component pages own their props; layout topics own their corresponding interfaces."}</DocsPageLead>
    {FRAMEWORK_API.map((entry) => <DocsSection key={entry.title} data-api-directory={entry.title}>
      <DocsSectionTitle>{zh ? entry.titleZh : entry.title}</DocsSectionTitle>
      <DocsParagraph>{zh ? entry.descriptionZh : entry.description}</DocsParagraph>
      <CodeBlock language="tsx" hideLineNumbers>{`import { ${entry.names.join(", ")} } from "@hustradio/unitary-ui";`}</CodeBlock>
      <Link className="text-link underline underline-offset-4" to={entry.to}>{zh ? "查看参考" : "View reference"}</Link>
    </DocsSection>)}
    <DocsSection id="providers">
      <DocsSectionTitle>{zh ? "Provider 与钩子" : "Providers and hooks"}</DocsSectionTitle>
      <DocsParagraph>{zh ? "ThemeProvider 接收 children；useTheme 必须在其内部调用，返回 preference、resolvedTheme 和 setPreference。偏好为 light、dark 或 system，保存在本地存储并应用到页面根元素。I18nProvider 接收 children 和 locale（默认 zh-CN）；useI18n 返回 locale 与 t(key, values?)，无 Provider 时使用英语。" : "ThemeProvider accepts children; useTheme requires it and returns preference, resolvedTheme and setPreference. Preferences are light, dark or system, persisted locally and applied to the document root. I18nProvider accepts children and locale (zh-CN by default); useI18n returns locale and t(key, values?), with English outside a provider."}</DocsParagraph>
      <CodeBlock language="tsx">{providers}</CodeBlock>
    </DocsSection>
    <DocsSection>
      <DocsSectionTitle>{zh ? "导航关闭与工具边界" : "Navigation dismissal and utilities"}</DocsSectionTitle>
      <DocsParagraph>{zh ? "useDismissOnNavigate(onDismiss, enabled = true) 订阅 hashchange 和 popstate，并在卸载时清理；普通 pushState 本身不会触发这些事件。字体探针在浏览器自动注册，useFontMetrics(fontStack?) 用于显式控制和字体方案变化。cn 合并条件类名及冲突的工具类；连续曲率工具返回几何路径，完整参数见 Continuous Surface。" : "useDismissOnNavigate(onDismiss, enabled = true) subscribes to hashchange and popstate and cleans up on unmount; pushState alone emits neither event. The font probe registers automatically in the browser; useFontMetrics(fontStack?) supports explicit control and font-tier changes. cn merges conditional and conflicting utility classes; continuous corner utilities produce geometry paths. See Continuous Surface for parameters."}</DocsParagraph>
      <DocsParagraph><Link className="text-link underline" to="/components/radio">Radio / useRadio</Link>{" · "}<Link className="text-link underline" to="/components/toast">Toast / useToasts / createToastStore</Link>{" · "}<Link className="text-link underline" to="/api/state-and-events">{zh ? "状态与事件" : "State & Events"}</Link></DocsParagraph>
    </DocsSection>
  </article>;
}
