import { Link } from "react-router-dom";
import { CodeBlock } from "@hustradio/unitary-ui";
import { DocsPageTitle, DocsPageLead, DocsSection, DocsSectionTitle, DocsParagraph } from "../components/docs-typography";
import type { DocsLanguage } from "../i18n/language";

const example = `import { applyColorScheme, applyCodeTheme } from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles.css";

const restoreUI = applyColorScheme(frame, {
  scheme: "unitary-blue", mode: "light",
});
const restoreInline = applyCodeTheme(inlineContainer, {
  theme: "light", mode: "light", kind: "inline",
});
const restoreBlock = applyCodeTheme(blockContainer, {
  theme: "monokai", mode: "light",
});

// Restore before changing a selection or disposing the demo.
restoreBlock();
restoreInline();
restoreUI();`;
const reactExample = `useLayoutEffect(() => {
  const restoreUI = applyColorScheme(frameRef.current, { scheme, mode });
  const restoreCode = applyCodeTheme(codeRef.current, {
    scheme, theme: blockTheme, mode,
  });
  return () => { restoreCode(); restoreUI(); };
}, [scheme, mode, blockTheme]);`;

export function ColorSchemeApiPage({ language }: { language: DocsLanguage }) {
  const en = language === "en-US";
  return <>
    <DocsPageTitle>Color Scheme API</DocsPageTitle>
    <DocsPageLead>{en ? "Named UI palettes and independent code themes, applied to explicit DOM scopes through the existing token system." : "通过现有 token 体系，将命名 UI 配色和独立代码主题应用到明确的 DOM 容器。"}</DocsPageLead>
    <DocsParagraph><Link to="/color-schemes" className="focus-ring underline underline-offset-4">{en ? "Open the interactive palette showcase →" : "打开交互配色展示 →"}</Link></DocsParagraph>
    <DocsSection><DocsSectionTitle>{en ? "Registry and resolution" : "注册表与解析"}</DocsSectionTitle>
      <DocsParagraph>{en ? "COLOR_SCHEMES contains default, unitary-blue, green and amber. CODE_THEMES contains default, light, dark, monokai, solarized-light and solarized-dark. Entries are frozen. getColorScheme(id) and getCodeTheme(id) return an entry or throw TypeError for an unknown ID." : "COLOR_SCHEMES 包含 default、unitary-blue、green、amber；CODE_THEMES 包含 default、light、dark、monokai、solarized-light、solarized-dark。注册表被冻结。getColorScheme(id) 与 getCodeTheme(id) 返回条目，未知 ID 抛出 TypeError。"}</DocsParagraph>
      <DocsParagraph>{en ? "resolveCodeTheme(theme, scheme, mode) returns fresh mode, tokens, colors and syntax values. getInlineCodeColors(theme, scheme, mode) returns foreground, background and border. Fixed editor themes keep their own mode; Default follows the supplied UI scheme and mode. These pure functions work without a document." : "resolveCodeTheme(theme, scheme, mode) 返回新的 mode、tokens、colors、syntax；getInlineCodeColors(theme, scheme, mode) 返回 foreground、background、border。固定代码主题保持自己的明暗，Default 跟随指定 UI 配色与明暗。这些纯函数可在无 document 环境调用。"}</DocsParagraph>
      <CodeBlock language="typescript">{`const ui = getColorScheme("green");
const theme = getCodeTheme("monokai");
const { mode, colors } = resolveCodeTheme(theme, ui, "light");
// mode === "dark", colors.number === "#ae81ff"`}</CodeBlock>
    </DocsSection>
    <DocsSection><DocsSectionTitle>{en ? "Apply and restore" : "应用与恢复"}</DocsSectionTitle>
      <DocsParagraph>{en ? "applyColorScheme(target, {scheme = 'default', mode}) applies UI colors. applyCodeTheme(target, {theme = 'default', scheme = 'default', mode, kind = 'block'}) applies a block theme or, with kind: 'inline', only the three inline roles. mode is required and must be light or dark; kind must be inline or block. Both return an idempotent restore callback. A null target is a safe no-op for refs and server rendering." : "applyColorScheme(target, {scheme = 'default', mode}) 应用 UI 配色。applyCodeTheme(target, {theme = 'default', scheme = 'default', mode, kind = 'block'}) 应用代码块主题，kind: 'inline' 时只设置三个行内角色。mode 必填且只能为 light 或 dark；kind 只能为 inline 或 block。二者返回可重复调用的恢复回调，null 目标用于尚未就绪的 ref 或服务端时安全地不写入。"}</DocsParagraph>
      <DocsParagraph>{en ? "Targets are explicit HTMLElement or SVGElement values. No global root is selected implicitly. Restore before reapplying: it restores previous inline values, priorities and attributes still owned by that application, preserving subsequent external edits and unrelated styles. It does not restore ancestor themes or persist preferences." : "目标须明确传入 HTMLElement 或 SVGElement，不会隐式选择全局根节点。重新应用前先恢复：回调恢复仍由本次应用持有的行内值、优先级与属性，保留后续外部修改及无关样式；不改变祖先主题，也不持久化偏好。"}</DocsParagraph>
      <CodeBlock filename="color-scheme.ts" language="typescript">{example}</CodeBlock>
      <DocsParagraph>{en ? "In React, apply to refs in an effect and return the cleanup. The showcase uses this same public API." : "React 中在 effect 内应用到 refs，并返回清理回调。配色展示使用同一套公共 API。"}</DocsParagraph>
      <CodeBlock language="tsx">{reactExample}</CodeBlock>
    </DocsSection>
    <DocsSection><DocsSectionTitle>{en ? "CSS export and boundaries" : "CSS 导出与边界"}</DocsSectionTitle>
      <DocsParagraph>{en ? "createColorSchemeCSS({scheme, inlineTheme, blockTheme}) returns both UI modes, independent code values, local alias bindings and role rules. All selection fields default to default. Use the attributes shown in the showcase and load the result after library styles. Invalid registry selections throw before any scope is changed." : "createColorSchemeCSS({scheme, inlineTheme, blockTheme}) 返回 UI 双主题、独立代码值、局部 alias 绑定与角色样式，三个选择项默认均为 default。按展示页的属性结构使用，并在库样式之后加载。未知注册表选项在修改容器前抛出异常。"}</DocsParagraph>
      <CodeBlock language="typescript">{`const css = createColorSchemeCSS({
  scheme: "unitary-blue", inlineTheme: "light", blockTheme: "monokai",
});`}</CodeBlock>
      <DocsParagraph>{en ? "This API composes with SubFrame and stacking components through normal DOM inheritance; it does not create an iframe, Shadow DOM or a separate React ThemeProvider. Body-mounted portals need a suitable local container to inherit a scoped palette. Code themes adapt published editor colors to Prism roles; they do not replicate full TextMate rules. Source links and the saved Default configuration are documented in the showcase." : "API 通过正常 DOM 继承与 SubFrame、层叠组件组合，不创建 iframe、Shadow DOM 或独立 React ThemeProvider。挂载在 body 的 portal 需要合适的局部容器才能继承配色。代码主题将公认编辑器颜色适配到 Prism 角色，不复制完整 TextMate 规则；主题来源和保存的 Default 配置见展示页。"}</DocsParagraph>
    </DocsSection>
  </>;
}
