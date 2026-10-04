import { LAYER_TOKENS } from "@/components/ui/layer";
import { GLOBAL_TOKENS } from "@/lib/token-catalog";
import { LayerDefaultExample } from "../examples/layer/default.example";
import DefaultSource from "../examples/layer/default.example.tsx?example-source";
import { LayerScopedExample } from "../examples/layer/scoped.example";
import ScopedSource from "../examples/layer/scoped.example.tsx?example-source";
import { LayerPortalExample } from "../examples/layer/portal.example";
import PortalSource from "../examples/layer/portal.example.tsx?example-source";
import { DemoShowCode } from "../components/demo-show-code";
import { ComponentApiReference } from "../components/docs-api-reference";
import { DocsPageTitle, DocsPageLead, DocsSection, DocsSectionTitle, DocsParagraph } from "../components/docs-typography";
import type { DocsLanguage } from "../i18n/language";

export function LayerPage({ language }: { language: DocsLanguage }) {
  const zh = language === "zh-CN";
  const examples = [
    { id: "default", title: zh ? "语义层级与局部隔离" : "Semantic levels and isolation", Component: LayerDefaultExample, source: DefaultSource },
    { id: "scoped", title: zh ? "独立作用域与实时修改" : "Independent scopes and live updates", Component: LayerScopedExample, source: ScopedSource },
    { id: "portal", title: zh ? "Portal 与自定义元素" : "Portals and custom elements", Component: LayerPortalExample, source: PortalSource },
  ];
  return <article className="min-w-0 max-w-3xl" data-demo-component="layer">
    <DocsPageTitle>{zh ? "层级" : "Layer"}</DocsPageTitle>
    <DocsPageLead>{zh ? "规范框架的 z 向空间：语义层级决定覆盖顺序，作用域控制局部配置，Portal 决定内容的物理挂载位置。" : "Define the framework’s z space: semantic levels determine stacking, scopes control local configuration, and portals determine physical placement."}</DocsPageLead>
    <DocsSection>
      <DocsSectionTitle>{zh ? "空间与交互规范" : "Spatial and interaction guidelines"}</DocsSectionTitle>
      <DocsParagraph>{zh ? "内容、导航与临时浮层应有清晰层次，覆盖时保留任务上下文。模态任务应聚焦、简短并提供清楚的关闭方式；避免无必要的嵌套弹出层。材质、边框和阴影表达视觉深度，z-index 管理实际覆盖顺序；两者分别配置。" : "Keep content, navigation and transient surfaces clearly layered, preserving task context when covering content. Keep modal tasks focused and brief with an obvious dismissal path; avoid unnecessary nested popovers. Materials, borders and shadows express visual depth; z-index controls actual stacking. Configure them separately."}</DocsParagraph>
      <DocsParagraph>{zh ? "规范参考 Apple HIG；下表数值是 Unitary 的实现约定。" : "These principles draw on Apple HIG; the numerical scale below is Unitary’s implementation contract."}{" "}<a className="text-link underline" href="https://developer.apple.com/design/human-interface-guidelines/materials">Materials</a>{" · "}<a className="text-link underline" href="https://developer.apple.com/design/human-interface-guidelines/modality">Modality</a>{" · "}<a className="text-link underline" href="https://developer.apple.com/design/human-interface-guidelines/popovers">Popovers</a></DocsParagraph>
    </DocsSection>
    <DocsSection>
      <DocsSectionTitle>{zh ? "语义层级" : "Semantic levels"}</DocsSectionTitle>
      <div data-slot="docs-local-scroll" className="overflow-x-auto"><table className="w-full text-copy-13" aria-label={zh ? "层级表" : "Layer levels"}><thead><tr><th className="p-3 text-left">Level</th><th className="p-3 text-left">Token</th><th className="p-3 text-left">z-index</th></tr></thead><tbody>{Object.entries(LAYER_TOKENS).map(([level, token]) => <tr key={level}><td className="border-t p-3 font-mono">{level}</td><td className="border-t p-3 font-mono">{token}</td><td className="border-t p-3">{GLOBAL_TOKENS[token].value}</td></tr>)}</tbody></table></div>
      <DocsParagraph>{zh ? "base=0 显式创建局部堆叠上下文，与 auto 不同。Calendar 主弹层保留 30；其预设组合菜单使用 popover。遮罩与内容保持同档，局部顺序由原有 DOM 关系决定。Avatar、Grid 等内部的小数值用于局部装饰顺序。" : "base=0 explicitly creates a local stacking context and differs from auto. Calendar’s main popup retains 30; its preset menu uses popover. Backdrops and content retain the same band, with local order determined by their existing DOM relationships. Small internal values in Avatar and Grid describe local decorative order."}</DocsParagraph>
    </DocsSection>
    <ComponentApiReference componentName="layer" />
    <DocsSection>
      <DocsSectionTitle>{zh ? "作用域与 Portal 边界" : "Scope and portal boundaries"}</DocsSectionTitle>
      <DocsParagraph>{zh ? "LayerScope.levels 接受安全整数，并与最近父作用域的稀疏配置合并；移除覆盖后恢复父配置或全局变量。局部跨 Portal 控制使用 levels，作用域 DOM 上直接设置的 CSS 变量仅沿物理 DOM 继承。全局动态修改与恢复使用 setToken、setTokens、resetToken 和 resetTokens；订阅使用 subscribeTokens 或 useTokens。" : "LayerScope.levels accepts safe integers and merges sparse overrides with the nearest parent scope; removing an override restores the parent or global token. Use levels for local control across portals; variables written directly on the scope DOM inherit only through physical descendants. Use setToken, setTokens, resetToken and resetTokens for global changes, and subscribeTokens or useTokens for subscriptions."}</DocsParagraph>
      <DocsParagraph>{zh ? "isolate 默认 false；开启后限制物理 DOM 子树，body 中的 Portal 仍在其外部。要把内容留在隔离范围，显式设置 container。LayerPortal 的 container 省略或为 null 时使用 body，服务端与首次 hydration 不创建 Portal，客户端挂载后创建。现有组件的容器选择保持不变。" : "isolate defaults to false; enabling it isolates the physical DOM subtree while body portals remain outside. Set container explicitly to keep content inside that boundary. LayerPortal uses body when container is omitted or null; it renders no portal on the server or initial hydration and creates it after mounting. Existing component container selection is preserved."}</DocsParagraph>
      <DocsParagraph>{zh ? "Layer 原语管理布局与层级；焦点、Escape、点击外部关闭和 ARIA 由对应浮层组件负责。不要通过抬高背景层使其抢过当前模态任务。已有浮层支持打开期间修改层级；定位包装层与内容的实际层级同步。" : "Layer primitives manage layout and stacking; the corresponding overlay components own focus, Escape, outside dismissal and ARIA. Avoid raising background content over the active modal task. Open overlays support live changes, with positioning wrappers synchronized to the actual content level."}</DocsParagraph>
    </DocsSection>
    {examples.map(({ id, title, Component, source }) => <DocsSection key={id} data-demo-card={id}><DocsSectionTitle>{title}</DocsSectionTitle><div className="rounded-lg border"><div className="p-4"><Component /></div><DemoShowCode code={source} /></div></DocsSection>)}
  </article>;
}
