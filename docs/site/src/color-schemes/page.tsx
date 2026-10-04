import { useId, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code, InlineCode } from "@/components/ui/code";
import { CodeBlock } from "@/components/ui/code-block";
import { SubFrame } from "@/components/ui/sub-frame";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Navbar } from "@/components/ui/navbar";
import { Select, SelectItem } from "@/components/ui/select";
import { Switch, SwitchControl } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/status-dot";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Fieldset, FieldsetTitle, FieldsetSubtitle, FieldsetContent, FieldsetFooter } from "@/components/ui/fieldset";
import { Collapse, CollapseTrigger, CollapseContent } from "@/components/ui/collapse";
import { resetTokens, setTokens } from "@/lib/tokens";
import { DocsPageTitle, DocsPageLead, DocsParagraph, DocsSection, DocsSectionTitle } from "../components/docs-typography";
import type { DocsLanguage } from "../i18n/language";
import { UnitaryLogoHorizontal } from "../components/unitary-logo";
import { DOCS_ROUTE_SEQUENCE } from "../data/docs-routes";
import { schemes, type Mode } from "./presets";
import { codeThemes, inlineColors, resolveCodeTheme } from "./code-themes";
import { getCodeTheme, inlineVariables, selectionCss, scopeStyles, scopedTokens } from "./styles";
import { PaletteSwatches, uiSwatches, codeSwatches, inlineSwatches } from "./palette";

const messages = {
  title: ["配色方案", "Color Schemes"],
  lead: ["从项目标准色盘选择界面配色，分别搭配行内代码和代码块主题。色块展示每个语义角色的当前值，真实组件展示实际效果。", "Choose UI colors from the project's standard palette, then select independent inline code and code block themes. Swatches show each role's value; real components show the result."],
  tokens: ["查看全局变量 →", "Explore global tokens →"],
  controls: ["配色控制", "Palette controls"],
  ui: ["UI 配色", "UI palette"],
  inline: ["行内代码主题", "Inline code theme"],
  block: ["代码块主题", "Code block theme"],
  mode: ["界面明暗", "UI theme"],
  light: ["浅色", "Light"], dark: ["深色", "Dark"],
  export: ["导出 CSS", "Export CSS"],
  palette: ["语义调色盘", "Semantic palette"],
  paletteHelp: ["选择器切换后会自动显示对应调色盘。每个色块列出角色、实际色值和使用的变量；Default 保留当前 docs 配色。", "Selections reveal the corresponding palette. Each swatch lists the role, actual color and variable. Default preserves the current docs configuration."],
  frame: ["交互配色示例", "Interactive palette preview"],
  workspace: ["工作空间", "Workspace"], overview: ["项目概览", "Overview"], assets: ["设计资源", "Design assets"], changes: ["变更记录", "Changelog"],
  system: ["设计系统", "Design system"], healthy: ["所有服务正常", "All services operational"],
  hierarchy: ["使用标准导航、表单和浮层，检查不同配色下的可读性与状态。", "Use standard navigation, forms and overlays to inspect readability and component states."],
  settings: ["项目设置", "Project settings"], active: ["进行中", "In progress"], name: ["项目名称", "Project name"],
  help: ["编辑项目名称，试试焦点、悬停和禁用状态。", "Edit the project name and try focus, hover and disabled states."],
  save: ["保存更改", "Save changes"], cancel: ["取消", "Cancel"], archived: ["已归档", "Archived"], saved: ["更改已保存", "Changes saved"],
  notes: ["开发者笔记", "Developer notes"], use: ["使用", "Use"], fetch: ["获取项目，设置", "to fetch a project; set"], retry: ["控制重试。", "to control retries."],
  basic: ["查看基础 Code 组件", "Show the basic Code component"],
  overlay: ["预览局部浮层", "Preview local overlay"], overlayTitle: ["框架内的浮层", "Overlay inside the frame"],
  overlayHelp: ["这个 BottomSheet 继承最近的 SubFrame，并使用当前 UI 配色。按 Escape 或关闭按钮返回。", "This BottomSheet inherits the nearest SubFrame and the selected UI palette. Press Escape or close to return."], close: ["关闭", "Close"],
  isolation: ["示例的配色和局部浮层由 SubFrame 承载；界面明暗与 docs 外壳独立，固定代码主题也独立于界面明暗。", "SubFrame contains the preview's palette and local overlays. UI theme is independent of the docs shell; fixed code themes are independent of UI theme."],
  limits: ["来源与接入", "Sources and adoption"],
  uiSource: ["Default 保存了当前 docs 两种主题各 313 个运行时颜色变量。品牌蓝、绿色、琥珀方案从项目现有色阶取值；品牌蓝主动作使用 logo 的 #0D47A1。", "Default saves 313 runtime color variables per docs theme. Unitary Blue, Green and Amber use existing project scales; Unitary Blue actions use the logo's #0D47A1."],
  codeSource: ["代码主题采用 VS Code Light+、Dark+、Monokai 与 Solarized 的公认色值，并适配到 Prism 类别；不是完整复制编辑器的 TextMate 规则。Default 跟随 UI 表面与明暗，固定主题保持自己的背景和语法色。", "Code themes use published VS Code Light+, Dark+, Monokai and Solarized colors adapted to Prism categories, rather than the editor's full TextMate rules. Default follows UI surfaces and theme; fixed themes retain their own background and syntax colors."],
  inlineNote: ["行内代码与代码块可以独立选择。Default 行内代码保持 docs 的纯文字样式；固定主题使用各自的文字、背景与边框。", "Inline code and code blocks can be selected independently. Default inline code preserves the docs' plain text style; fixed themes use their own text, background and border."],
  adoption: ["导出包含界面双主题、独立代码颜色和局部变量绑定，放在库样式之后加载。代码容器的 data-ui-theme 与界面明暗同步；data-theme 使用代码主题自身的明暗。", "Exports include both UI modes, independent code colors and local variable bindings. Load after library styles. Keep code containers' data-ui-theme aligned with the UI; data-theme uses the code theme's own mode."],
  boundary: ["SubFrame 限定浮层挂载位置，不创建 iframe 或 Shadow DOM；全局 CSS 和主题上下文仍可能影响其它组件。本页验证展示的组件。", "SubFrame scopes overlay placement without an iframe or Shadow DOM. Global CSS and theme context can still affect other components; this page verifies the components shown."],
  source: ["主题来源", "Theme source"],
} as const;

const sample = `// A small, readable example
export async function loadProject(id: string) {
  const retries = 3;
  const enabled = true;
  const result = await fetch("/api/projects/" + id);
  return { name: "Unitary", retries, enabled };
}`;

export function ColorSchemesPage({ language }: { language: DocsLanguage }) {
  const en = language === "en-US";
  const t = (key: keyof typeof messages) => messages[key][en ? 1 : 0];
  const [uiId, setUiId] = useState("default");
  const [inlineId, setInlineId] = useState("default");
  const [blockId, setBlockId] = useState("default");
  const [mode, setMode] = useState<Mode>("light");
  const [paletteTab, setPaletteTab] = useState("ui");
  const [selectedNav, setSelectedNav] = useState("/preview/overview");
  const [saved, setSaved] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const switchName = useId();
  const uiRef = useRef<HTMLDivElement>(null);
  const inlineRef = useRef<HTMLParagraphElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const ui = schemes.find(s => s.id === uiId)!;
  const inline = getCodeTheme(inlineId);
  const block = getCodeTheme(blockId);
  const blockColors = resolveCodeTheme(block, ui, mode);
  const inlinePalette = inlineColors(inline, ui, mode);
  const tokensRoute = DOCS_ROUTE_SEQUENCE.find(route => route.renderer.kind === "localized" && route.renderer.page === "tokens")!.to;
  const navItems = [
    { label: t("overview"), to: "/preview/overview" },
    { label: t("assets"), to: "/preview/assets" },
    { label: t("changes"), to: "/preview/changelog" },
  ];

  useLayoutEffect(() => {
    // Switching away from Default must not leave any of its saved overrides behind.
    resetTokens(undefined, { target: uiRef.current });
    setTokens(scopedTokens(ui.ui[mode]), { target: uiRef.current });
    resetTokens(undefined, { target: codeRef.current });
    const resolved = resolveCodeTheme(block, ui, mode);
    setTokens(scopedTokens(resolved.tokens), { target: codeRef.current });
    for (const [name, value] of Object.entries(resolved.syntax)) codeRef.current?.style.setProperty(name, value);
    for (const [name, value] of Object.entries(inlineVariables(inline, ui, mode))) inlineRef.current?.style.setProperty(name, value);
  }, [ui, inline, block, mode]);

  const exportCss = () => {
    const url = URL.createObjectURL(new Blob([selectionCss(ui, inline, block)], { type: "text/css" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `unitary-${uiId}-${inlineId}-${blockId}.css`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const currentSwatches = paletteTab === "ui" ? uiSwatches(ui.ui[mode], language)
    : paletteTab === "inline" ? inlineSwatches(inlinePalette, language) : codeSwatches(blockColors.colors, language);
  const paletteTitle = paletteTab === "ui" ? t("ui") : paletteTab === "inline" ? t("inline") : t("block");

  return <div className="scheme-lab" data-slot="color-schemes-page">
    <style>{scopeStyles}</style>
    <DocsPageTitle>{t("title")}</DocsPageTitle>
    <DocsPageLead>{t("lead")}</DocsPageLead>
    <DocsParagraph><Link to={tokensRoute} className="focus-ring underline underline-offset-4">{t("tokens")}</Link></DocsParagraph>
    <DocsSection>
      <section className="lab-controls" aria-label={t("controls")}>
        <Select label={t("ui")} value={uiId} onValueChange={value => { setUiId(value); setPaletteTab("ui"); }} layout={{ width: "180px" }}>
          {schemes.map(s => <SelectItem key={s.id} value={s.id}>{en ? s.english : `${s.name} / ${s.english}`}</SelectItem>)}
        </Select>
        <Select label={t("inline")} value={inlineId} onValueChange={value => { setInlineId(value); setPaletteTab("inline"); }} layout={{ width: "190px" }}>
          {codeThemes.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
        </Select>
        <Select label={t("block")} value={blockId} onValueChange={value => { setBlockId(value); setPaletteTab("block"); }} layout={{ width: "190px" }}>
          {codeThemes.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
        </Select>
        <Switch name={switchName} value={mode} onValueChange={value => setMode(value as Mode)} role="radiogroup" aria-label={t("mode")}>
          <SwitchControl value="light" label={t("light")} />
          <SwitchControl value="dark" label={t("dark")} />
        </Switch>
        <Button type="secondary" typeName="button" onClick={exportCss}>{t("export")}</Button>
      </section>
      <section className="scheme-palette" aria-label={t("palette")}>
        <h2 className="text-heading-20">{t("palette")}</h2>
        <p className="text-copy-14 text-muted-foreground">{t("paletteHelp")}</p>
        <Tabs compact selected={paletteTab} setSelected={setPaletteTab} ariaLabel={t("palette")} tabs={[
          { title: t("ui"), value: "ui" }, { title: t("inline"), value: "inline" }, { title: t("block"), value: "block" },
        ]} />
        <PaletteSwatches items={currentSwatches} label={paletteTitle} />
      </section>
      <SubFrame ref={uiRef} className="scheme-scope scheme-preview-frame" data-theme={mode} data-ui-preview data-color-scheme={uiId} role="region" aria-label={t("frame")}>
        <Navbar scrollBehavior="static" className="workspace-topbar">
          <div className="workspace-brand" role="img" aria-label="Unitary"><UnitaryLogoHorizontal /></div>
          <span className="workspace-health text-label-13"><StatusDot state="READY" />{t("healthy")}</span>
        </Navbar>
        <div className="workspace">
          <aside className="workspace-nav">
            <SidebarNav groups={[{ id: "preview", label: t("workspace"), items: navItems }]} activeTo={selectedNav} onNavigate={setSelectedNav} />
            <p className="text-copy-13 text-muted-foreground">{en ? ui.descriptionEn : ui.description}</p>
          </aside>
          <div className="workspace-main">
            <Breadcrumb><BreadcrumbItem>{t("system")}</BreadcrumbItem><BreadcrumbItem active>{navItems.find(i => i.to === selectedNav)?.label}</BreadcrumbItem></Breadcrumb>
            <div className="workspace-title"><h2 className="text-heading-24">{navItems.find(i => i.to === selectedNav)?.label}</h2><p className="text-copy-14 text-muted-foreground">{t("hierarchy")}</p></div>
            <Fieldset aria-label={t("settings")}>
              <FieldsetContent>
                <div className="card-heading"><FieldsetTitle>{t("settings")}</FieldsetTitle><Badge variant="outline" size="compact">{t("active")}</Badge></div>
                <Input label={t("name")} defaultValue="Unitary Design System" className="text-foreground dark:text-foreground" />
                <FieldsetSubtitle>{t("help")}</FieldsetSubtitle>
              </FieldsetContent>
              <FieldsetFooter className="project-actions">
                <Button typeName="button" onClick={() => setSaved(true)}>{t("save")}</Button>
                <Button type="secondary" typeName="button" onClick={() => setSaved(false)}>{t("cancel")}</Button>
                <Button disabled typeName="button">{t("archived")}</Button><span role="status" className="text-copy-13">{saved ? t("saved") : ""}</span>
              </FieldsetFooter>
            </Fieldset>
            <section className="workspace-notes" aria-label={t("notes")}>
              <h3 className="text-heading-20">{t("notes")}</h3>
              <p ref={inlineRef} className="inline-example text-copy-14" data-inline-code-theme={inlineId} data-ui-theme={mode}>
                {t("use")} <InlineCode>loadProject(id)</InlineCode> {t("fetch")} <InlineCode>retries = 3</InlineCode> {t("retry")}
              </p>
              <div ref={codeRef} className="scheme-scope scheme-code" data-theme={blockColors.mode} data-ui-theme={mode} data-code-scheme={blockId} data-code-preview>
                <CodeBlock filename="project.ts" language="typescript" highlightedLinesNumbers={[2]} addedLinesNumbers={[4]} removedLinesNumbers={[5]} referencedLinesNumbers={[6]}>{sample}</CodeBlock>
                <Collapse size="small"><CollapseTrigger>{t("basic")}</CollapseTrigger><CollapseContent><Code syntax="javascript">{'const count = 3;\nconsole.log("Unitary", count);'}</Code></CollapseContent></Collapse>
              </div>
              {block.source ? <a className="focus-ring text-copy-13 underline underline-offset-4" href={block.source} target="_blank" rel="noreferrer">{block.name} · {t("source")}</a> : null}
            </section>
            <Button type="secondary" typeName="button" onClick={() => setOverlayOpen(true)}>{t("overlay")}</Button>
          </div>
        </div>
        <BottomSheet open={overlayOpen} onOpenChange={setOverlayOpen} detents={[0.4]} aria-label={t("overlayTitle")}>
          <div className="scheme-overlay-content"><h3 className="text-heading-20">{t("overlayTitle")}</h3><p className="text-copy-14 text-muted-foreground">{t("overlayHelp")}</p><Button typeName="button" onClick={() => setOverlayOpen(false)}>{t("close")}</Button></div>
        </BottomSheet>
      </SubFrame>
      <DocsParagraph>{t("isolation")}</DocsParagraph>
    </DocsSection>
    <DocsSection><DocsSectionTitle>{t("limits")}</DocsSectionTitle>
      <DocsParagraph>{t("uiSource")}</DocsParagraph>
      <DocsParagraph>{t("codeSource")}</DocsParagraph>
      <DocsParagraph>{t("inlineNote")}</DocsParagraph>
      <DocsParagraph>{t("adoption")}</DocsParagraph>
      <CodeBlock language="html">{`<section data-color-scheme="${uiId}" data-theme="${mode}">\n  <p data-inline-code-theme="${inlineId}" data-ui-theme="${mode}">...</p>\n  <div data-code-scheme="${blockId}" data-theme="${blockColors.mode}" data-ui-theme="${mode}">...</div>\n</section>`}</CodeBlock>
      <DocsParagraph>{t("boundary")}</DocsParagraph>
    </DocsSection>
  </div>;
}
