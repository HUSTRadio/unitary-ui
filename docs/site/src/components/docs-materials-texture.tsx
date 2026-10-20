import { useId, useState } from "react";

import { Tabs, Toggle, Switch, SwitchControl, Toolbar, ToolbarGroup, ToolbarItem } from "@hustradio/unitary-ui";
import { Badge } from "@hustradio/unitary-ui";
import { Button } from "@hustradio/unitary-ui";
import { CodeBlock } from "@hustradio/unitary-ui";
import { Menu, MenuButton, MenuContainer, MenuItem } from "@hustradio/unitary-ui";
import {
  Modal, ModalClose, ModalContent, ModalDescription, ModalFooter,
  ModalHeader, ModalTitle, ModalTrigger,
} from "@hustradio/unitary-ui";
import { RadioGroup, RadioGroupItem } from "@hustradio/unitary-ui";
import {
  ResponsiveDrawer, ResponsiveDrawerBody, ResponsiveDrawerClose,
  ResponsiveDrawerContent, ResponsiveDrawerFooter, ResponsiveDrawerHeader,
  ResponsiveDrawerTrigger, ResponsiveDrawerTitle, ResponsiveDrawerDescription,
} from "@hustradio/unitary-ui";
import { useTheme, type TexturePreference } from "@hustradio/unitary-ui";

import { useLanguage, type DocsLanguage } from "../i18n/language";
import { DocsBlock, DocsCaption, DocsList, DocsParagraph, DocsSection, DocsSectionTitle } from "./docs-typography";

const TEXTURE_OPTIONS: readonly TexturePreference[] = ["solid", "acrylic", "aero", "glass"];
const TEXTURE_LABELS: Record<DocsLanguage, Record<TexturePreference, string>> = {
  "en-US": { solid: "Solid", acrylic: "Acrylic", aero: "Aero", glass: "Glass" },
  "zh-CN": { solid: "Solid", acrylic: "Acrylic", aero: "Aero", glass: "Glass" },
};

const TEXTURE_EXAMPLE = `import {
  RadioGroup, RadioGroupItem, ThemeProvider, useTheme, type TexturePreference,
} from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles.css";

function TextureControls() {
  const { texture, resolvedTexture, setTexture } = useTheme();
  return <fieldset>
    <legend>Global texture</legend>
    <RadioGroup aria-label="Global texture" value={texture}
      onChange={(value) => setTexture(value as TexturePreference)}>
      <RadioGroupItem value="solid">Solid</RadioGroupItem>
      <RadioGroupItem value="acrylic">Acrylic</RadioGroupItem>
      <RadioGroupItem value="aero">Aero</RadioGroupItem>
      <RadioGroupItem value="glass">Glass</RadioGroupItem>
    </RadioGroup>
    <p>{texture} / {resolvedTexture}</p>
  </fieldset>;
}

export function App() {
  return <ThemeProvider defaultTexture="solid">
    <TextureControls />
  </ThemeProvider>;
}`;

const MASK_EXAMPLE = `// Visual treatment only: the owning dialog still handles focus,
// dismissal, stacking and background interaction.
export function Mask() {
  return <div aria-hidden="true" className="material-mask fixed inset-0" />;
}

export function Scrim() {
  return <div aria-hidden="true" className="material-mask-scrim fixed inset-0" />;
}`;

const GLASS_APPEARANCE_EXAMPLE = `import { setTokens, resetTokens } from "@hustradio/unitary-ui";

const surface = document.querySelector<HTMLElement>(".my-glass-surface");
if (surface) {
  setTokens({
    "--material-texture-glass-blur": "10px",
    "--material-texture-glass-overlay-blur": "20px",
    "--material-texture-glass-opacity": "56%",
  }, { target: surface });

  // Restore this surface's Clear, Regular or Dense preset.
  resetTokens([
    "--material-texture-glass-blur",
    "--material-texture-glass-overlay-blur",
    "--material-texture-glass-opacity",
  ], { target: surface });
}

// Ordinary content cards opt in explicitly; their sheen is static.
export function PreviewCard() {
  return <div className="my-glass-surface material-medium material-glass-regular p-5">
    <h3>Project preview</h3>
    <p>Keep text and controls clear.</p>
  </div>;
}`;

/** Every copy operates on the root preference, including copies inside portals. */
function TextureControls() {
  const groupId = useId();
  const { language } = useLanguage();
  const { texture, resolvedTexture, setTexture } = useTheme();
  const zh = language === "zh-CN";

  return (
    <fieldset className="min-w-0" data-slot="texture-controls">
      <legend className="mb-3 text-label-14 font-medium text-foreground">
        {zh ? "全局材质外观" : "Global texture"}
      </legend>
      <RadioGroup
        aria-label={zh ? "全局材质外观" : "Global texture"}
        name={`texture-${groupId}`}
        value={texture}
        onChange={(value) => setTexture(value as TexturePreference)}
        className="flex flex-wrap gap-2"
      >
        {TEXTURE_OPTIONS.map((option) => (
          <RadioGroupItem
            key={option}
            value={option}
            data-texture-option={option}
            className={`relative min-h-11 cursor-pointer rounded-md border px-3 text-foreground ${texture === option ? "border-foreground bg-muted" : "border-border bg-background"}`}
          >
            {TEXTURE_LABELS[language][option]}
          </RadioGroupItem>
        ))}
      </RadioGroup>
      <p className="mt-3 text-copy-13 text-muted-foreground" role="status" data-slot="texture-status">
        {zh ? "选择：" : "Selected: "}{TEXTURE_LABELS[language][texture]}
        {" · "}{zh ? "实际外观：" : "Applied: "}{TEXTURE_LABELS[language][resolvedTexture]}
      </p>
      {texture !== resolvedTexture && (
        <p className="mt-2 text-copy-13 text-muted-foreground" data-slot="texture-fallback">
          {zh
            ? "当前浏览器能力或辅助功能偏好要求使用 Solid。已保留你的选择，条件恢复后会重新应用。"
            : "Browser capabilities or accessibility preferences currently require Solid. Your selection is retained and resumes when those conditions change."}
        </p>
      )}
    </fieldset>
  );
}

function TextureInteractionDemo() {
  const [tab, setTab] = useState("overview");
  const { language } = useLanguage();
  const { texture, setTexture } = useTheme();
  const zh = language === "zh-CN";

  return (
    <div className="materials-texture-stage relative flex min-h-80 items-center rounded-lg border border-border p-5 sm:p-8" data-slot="texture-interaction-demo">
      <div aria-hidden="true" className="materials-refraction-grid" />
      <div className="material-menu relative mx-auto w-full max-w-lg p-5" data-material="floating" data-material-sample="floating">
        <p className="text-label-14 font-medium text-foreground">{zh ? "清晰的工作空间" : "A clear workspace"}</p>
        <p className="mt-2 text-copy-14 text-foreground">
          {zh ? "背景表达层次，文字和控件保持清晰。打开浮层，观察全局材质切换。" : "The background adds depth while text and controls stay clear. Open a layer and change the global texture."}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3" data-slot="texture-gel-controls">
          <Tabs variant="secondary" tabs={[{ value: "overview", title: zh ? "概览" : "Overview" }, { value: "details", title: zh ? "详情" : "Details" }]} selected={tab} setSelected={setTab} ariaLabel={zh ? "预览内容" : "Preview content"} />
          <Toggle aria-label={zh ? "实时更新" : "Live updates"} defaultChecked size="medium" />
          <Switch name="texture-preview-layout" defaultValue="list"><SwitchControl label={zh ? "列表" : "List"} value="list" /><SwitchControl label={zh ? "网格" : "Grid"} value="grid" /></Switch>
          <Toolbar aria-label={zh ? "预览操作" : "Preview actions"}><ToolbarGroup><ToolbarItem label={zh ? "置顶" : "Pin"} active /></ToolbarGroup></Toolbar>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2" data-slot="texture-demo-information">
          <Badge variant="green" size="compact" data-slot="texture-demo-saved">
            {zh ? "已保存" : "Saved"}
          </Badge>
          {" "}
          <Badge variant="outline" size="compact" data-slot="texture-demo-task-count">
            {zh ? "3 项任务" : "3 tasks"}
          </Badge>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <MenuContainer>
            <MenuButton variant="secondary" data-slot="texture-demo-menu-trigger">{zh ? "打开菜单" : "Open menu"}</MenuButton>
            <Menu stateful aria-label={zh ? "材质菜单" : "Texture menu"} data-slot="texture-demo-menu">
              {TEXTURE_OPTIONS.map((option) => (
                <MenuItem
                  key={option}
                  active={texture === option}
                  onSelect={(event) => { event.preventDefault(); setTexture(option); }}
                  data-texture-menu-option={option}
                >{TEXTURE_LABELS[language][option]}</MenuItem>
              ))}
            </Menu>
          </MenuContainer>
          <Modal>
            <ModalTrigger asChild><Button type="secondary" data-slot="texture-demo-modal-trigger">{zh ? "打开弹窗" : "Open modal"}</Button></ModalTrigger>
            <ModalContent data-slot="texture-demo-modal">
              <ModalHeader>
                <ModalTitle>{zh ? "材质与上下文" : "Texture and context"}</ModalTitle>
                <ModalDescription>{zh ? "选择在整个界面生效，包括已打开的浮层。" : "Your selection applies to the whole interface, including open layers."}</ModalDescription>
              </ModalHeader>
              <div className="mt-5"><TextureControls /></div>
              <ModalFooter><ModalClose asChild><Button type="secondary">{zh ? "关闭弹窗" : "Close modal"}</Button></ModalClose></ModalFooter>
            </ModalContent>
          </Modal>
          <ResponsiveDrawer responsive>
            <ResponsiveDrawerTrigger asChild><Button type="secondary" data-slot="texture-demo-drawer-trigger">{zh ? "打开抽屉" : "Open drawer"}</Button></ResponsiveDrawerTrigger>
            <ResponsiveDrawerContent data-slot="texture-demo-drawer">
              <ResponsiveDrawerHeader>
                <ResponsiveDrawerTitle>{zh ? "统一的材质外观" : "One texture across the interface"}</ResponsiveDrawerTitle>
                <ResponsiveDrawerDescription>{zh ? "选择对整个界面生效。" : "Your selection applies to the whole interface."}</ResponsiveDrawerDescription>
              </ResponsiveDrawerHeader>
              <ResponsiveDrawerBody>
                <p className="mb-5 text-copy-14 text-foreground">{zh ? "移动端与桌面端采用同一套全局材质设置。" : "Mobile and desktop share the same global texture preference."}</p>
                <TextureControls />
              </ResponsiveDrawerBody>
              <ResponsiveDrawerFooter><ResponsiveDrawerClose className="h-10 w-auto border border-border px-4">{zh ? "关闭抽屉" : "Close drawer"}</ResponsiveDrawerClose></ResponsiveDrawerFooter>
            </ResponsiveDrawerContent>
          </ResponsiveDrawer>
        </div>
      </div>
    </div>
  );
}

function GlassVariantExamples() {
  const { language } = useLanguage(); const zh = language === "zh-CN";
  const [playing, setPlaying] = useState(false); const [pinned, setPinned] = useState(true);
  return <div className="grid gap-4 lg:grid-cols-3" data-slot="glass-variant-examples">
    {(["clear", "regular", "dense"] as const).map(variant => <div key={variant} className="min-w-0" data-glass-variant-example={variant}>
      <p className="mb-2 text-label-14 font-medium">{variant === "clear" ? "Clear · 28% / 36% · 8px" : variant === "regular" ? "Regular · 56% / 76% · 10px" : "Dense · 80% / 86% · 20px"}</p>
      <div className="materials-texture-stage relative flex min-h-48 items-center justify-center rounded-lg p-4">
        <div className="materials-refraction-grid" aria-hidden="true" />
        {variant === "clear" ? <div className="relative">
          <div aria-hidden="true" className="absolute inset-0 rounded-lg bg-background/70" data-slot="glass-media-backing" />
          <Button type="secondary" data-material="navigation" aria-label={playing ? (zh ? "暂停" : "Pause") : (zh ? "播放" : "Play")} className="material-glass-clear relative" onClick={() => setPlaying(!playing)}>{playing ? (zh ? "暂停" : "Pause") : (zh ? "播放" : "Play")} · 00:42</Button>
        </div> : variant === "regular" ? <div className="relative w-full">
          <div aria-hidden="true" className="absolute inset-0 rounded-lg bg-background/70" />
          <Toolbar className="material-glass-regular relative" aria-label={zh ? "导航操作预览" : "Navigation actions preview"}>
          <ToolbarGroup><ToolbarItem label={zh ? "置顶" : "Pin"} active={pinned} onSelect={() => setPinned(!pinned)} /></ToolbarGroup>
        </Toolbar></div> : <div className="material-menu material-glass-dense relative w-full p-4 text-copy-13" data-material="floating">
          <p className="font-medium">{zh ? "最近的文件" : "Recent files"}</p><ul className="mt-2 space-y-2"><li>{zh ? "项目进展报告" : "Project progress report"}</li><li>{zh ? "下一次评审的备注" : "Notes for the next review"}</li></ul>
        </div>}
      </div>
      <p className="mt-2 text-copy-13 text-muted-foreground">{variant === "clear" ? (zh ? "媒体上的短标签；独立的均匀 70% 衬底。" : "Short media labels with a separate uniform 70% backing.") : variant === "regular" ? (zh ? "导航、工具栏和独立次要操作。" : "Navigation, toolbars and standalone secondary actions.") : (zh ? "菜单、列表、抽屉和文字浮层。" : "Menus, lists, drawers and text-rich floating surfaces.")}</p>
    </div>)}
  </div>;
}

export function MaterialsTextureSection() {
  const { language } = useLanguage();
  const zh = language === "zh-CN";
  return (
    <DocsSection id="texture">
      <DocsSectionTitle>{zh ? "Texture · 全局材质外观" : "Texture · Global appearance"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "材质用来表达功能层与内容之间的关系。Glass 以半透明填充、背景模糊、柔和高光和细边表达层次，保留 Unitary 的配色、尺寸和圆角；正文、表格和表单内容保持清晰。"
          : "Materials express the relationship between functional layers and content. Glass combines translucent fill, backdrop blur, soft sheen and fine edges, retaining Unitary palettes, dimensions and corner radii. Body text, tables and forms remain clear."}
      </DocsParagraph>
      <DocsList className="list-disc pl-[var(--uni-doc-list-indent)]" data-texture-summary="">
        <li>{zh ? "Solid 是默认值，保留现有填充、描边、阴影及少量既有遮罩模糊。" : "Solid is the default and preserves existing fills, strokes, shadows and the few existing blurred masks."}</li>
        <li>{zh ? "Acrylic 在导航、浮层和遮罩增加轻微背景散射，内部控件保持平面。" : "Acrylic adds gentle background diffusion to navigation, floating layers and masks; inner controls stay flat."}</li>
        <li>{zh ? "Aero 保留原 Glass 的背景散射、方向性照明和厚度吸收近似，用于功能层、次要按钮与卡片式 Radio。" : "Aero retains the former Glass diffusion, directional lighting and thickness-absorption approximation on functional layers, secondary buttons and card-style Radio."}</li>
        <li>{zh ? "Glass 使用均匀半透明基材与 CSS 模糊，叠加静态方向高光、细内描边及柔和投影；既有交互控件提供克制的指针追光和 hover 过渡。" : "Glass uses a uniform translucent body and CSS blur, layered with directional sheen, fine inset edges and soft shadows. Existing interactive controls add restrained pointer glints and hover transitions."}</li>
      </DocsList>
      <DocsBlock><TextureControls /></DocsBlock>
      <DocsParagraph>
        {zh
          ? "这里的切换作用于整个文档界面、Portal 浮层和 SubFrame 内容。材质独立于明暗主题、UI 配色与代码主题；局部配色作用域继续有效，组件不提供局部材质主题开关。"
          : "These controls change the whole documentation interface, portal layers and SubFrame content. Texture is independent of light/dark mode, UI palettes and code themes; scoped palettes still work, and components do not expose a local texture switch."}
      </DocsParagraph>
      <DocsBlock>
        <figure className="m-0">
          <TextureInteractionDemo />
          <DocsCaption data-texture-photo-credit="">
            {"Photograph by "}
            <a className="text-link underline underline-offset-4" href="https://commons.wikimedia.org/wiki/File:View_of_lake_in_forest.jpg">mirobo</a>
            {" · Alpsee · "}<a className="text-link underline underline-offset-4" href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a>
          </DocsCaption>
        </figure>
      </DocsBlock>
      <DocsBlock><GlassVariantExamples /></DocsBlock>
      <DocsParagraph data-glass-variants-contract="">
        {zh ? "Glass 按用途提供 material-glass-clear、material-glass-regular 和 material-glass-dense 三个 className 预设，应用到实际材质表面。Clear 填充浅/深 28% / 36%、模糊 8px；Regular 为 56% / 76%、10px；Dense 为 80% / 86%、20px。导航、Toolbar 和独立次要操作默认 Regular；菜单、选择列表、抽屉及对话框类浮层默认 Dense。Clear 仅显式用于媒体上的少量图标或短标签，由场景提供独立均匀衬底并实测对比度。三档背景饱和度均为浅色 160%、深色 150%。Regular 的填充针对中性色板及不受控背景的对比度需求调整；仍需检查文字、状态和高光叠加后的实际对比度。" : "Glass provides material-glass-clear, material-glass-regular and material-glass-dense className presets on actual material surfaces. Clear uses 28% / 36% light/dark fill with 8px blur; Regular uses 56% / 76% with 10px; Dense uses 80% / 86% with 20px. Navigation, Toolbar and standalone secondary actions default to Regular; menus, selection lists, drawers and dialog surfaces default to Dense. Clear is explicit for a few media icons or short labels, with separate uniform scene backing and measured contrast. All three use 160% light and 150% dark backdrop saturation. Regular fill is tuned for neutral palettes and uncontrolled backgrounds; still check actual contrast after text, states and sheen are composited."}
      </DocsParagraph>
      <DocsParagraph data-glass-chrome-contract="">
        {zh ? "固定或吸顶 Navbar 使用 Regular 填充与 24px 背景模糊，由独立背景层采样，文字与交互仍在前景。SiteNavigation 的 hover 面板超出顶栏采样范围，因此独立采用 Dense 与 20px 模糊；浮层模糊由 --material-texture-glass-overlay-blur 控制。内部按钮共享所在功能层的采样。作者提供的背景、滤镜、局部 blur token 或顶栏 before 伪元素保留优先级。" : "A fixed or sticky Navbar uses Regular fill and 24px backdrop blur on a separate background layer, keeping text and interaction in the foreground. SiteNavigation hover panels extend beyond that sampler and independently use Dense with 20px blur, controlled by --material-texture-glass-overlay-blur. Inner buttons share their functional surface sampler. Authored backgrounds, filters, local blur tokens and header before pseudo-elements retain priority."}
      </DocsParagraph>
      <DocsParagraph data-glass-feedback-contract="">
        {zh ? "次要按钮、卡片 Radio、Toolbar、secondary Tabs、Switch、Toggle 和导航操作使用轻量 CSS 指针追光及可插值的 hover 状态，进入和离开均遵循现有动效 token。精细指针移动时高光按帧更新，按压固定接触点，键盘使用中心反馈，触摸仅表达按压。按钮、导航、文字和点击区域不位移；Toggle 原有滑块动画保留。内部控件不增加背景采样；减少动效关闭追光与新增过渡。" : "Secondary buttons, card radios, Toolbar, secondary Tabs, Switch, Toggle and navigation actions use lightweight CSS pointer glints and interpolated hover states, with existing motion tokens on entry and exit. Fine-pointer glints update once per frame; pressing fixes the contact point, keyboard feedback uses the center, and touch expresses only pressed state. Buttons, navigation, text and hit areas stay in place; Toggle retains its thumb animation. Inner controls add no backdrop sampler. Reduced motion disables tracking and added transitions."}
      </DocsParagraph>
      <DocsParagraph>
        {zh ? "根 token 是 Regular 基准，Clear / Dense 采用局部预设；同一表面上的作者 token 优先。setTokens(values, { target: surface }) 修改当前表面，resetTokens(names, { target: surface }) 恢复该档；显式 Regular 恢复根基准。Portal 必须在实际浮层上应用 className，不继承触发器预设。Select.className 只作用于触发器，选择列表本轮采用自动 Dense。" : "Root tokens provide the Regular baseline; Clear / Dense use local presets, with author tokens on the same surface taking precedence. setTokens(values, { target: surface }) customizes that surface; resetTokens(names, { target: surface }) restores its preset. Explicit Regular restores the root baseline. Put className on actual portal content, rather than its trigger. Select.className styles only the trigger; its list uses automatic Dense."}
      </DocsParagraph>
      <DocsParagraph>
        {zh ? "增强对比度 prefers-contrast: more 使用 92% / 96% 填充、Dense 模糊及前景色 65% 混合的中性轮廓。它只改变私有有效参数，公共 token 保留作者请求值。减少透明度和强制颜色优先回退 Solid。普通文字至少 4.5:1，大文字及必要控件标识至少 3:1，以实际合成背景验证；复杂背景使用独立均匀衬底或 Dense。" : "prefers-contrast: more uses 92% / 96% fill, Dense blur and neutral outlines mixed from 65% foreground color. Only private effective inputs change; public tokens retain requested values. Reduced transparency and forced colors take precedence and resolve to Solid. Test actual composited backgrounds for at least 4.5:1 normal text and 3:1 large text and necessary control indicators; use separate uniform backing or Dense for difficult backgrounds."}
      </DocsParagraph>
      <DocsBlock><CodeBlock language="tsx" filename="global-texture.tsx">{TEXTURE_EXAMPLE}</CodeBlock></DocsBlock>
      <DocsParagraph>
        {zh
          ? "根 ThemeProvider 支持 texture（受控）、defaultTexture（非受控，默认 solid）与 onTextureChange。useTheme 返回 texture、resolvedTexture 与 setTexture；有效的已保存选择优先于 defaultTexture，非受控选择独立持久化，嵌套 Provider 继承根材质设置。"
          : "The root ThemeProvider accepts texture (controlled), defaultTexture (uncontrolled, solid by default) and onTextureChange. useTheme returns texture, resolvedTexture and setTexture; a valid stored choice takes precedence over defaultTexture, uncontrolled choices persist independently, and nested providers inherit the root texture preference."}
      </DocsParagraph>
      <DocsParagraph>
        {zh ? "仅使用 CSS 时，可在文档根节点声明 " : "For CSS-only use, declare "}
        <code>{'<html data-texture="glass">'}</code>
        {zh ? "，一次应用于整个界面；局部元素上的 data-texture 不创建材质主题。挂载根 ThemeProvider 后，它负责维护该属性并处理能力与辅助功能降级。" : " on the document root to apply the appearance globally; descendant data-texture attributes do not create a texture theme. Once mounted, the root ThemeProvider owns this attribute and handles capability and accessibility fallbacks."}
      </DocsParagraph>
      <DocsParagraph>
        {zh ? "Acrylic 采用 8px 背景散射与 80% 填充；Aero 保留原 Glass 的 20px 散射、浅色 60% 和深色 74% 填充。Glass 的基材 alpha 与模糊全表面均匀，静态方向渐变仅负责表面高光，不声称物理折射或空间可变模糊。浮层次级文字适度增强对比度，正文和内部控件保持清晰。连续曲率阴影容器形成背景采样边界时，内部表面使用不透明填充，保持裁切与阴影完整。" : "Acrylic uses 8px diffusion and 80% fill. Aero preserves the former Glass: 20px diffusion, 60% light fill and 74% dark fill. Glass keeps body alpha and blur uniform across the surface; a static directional gradient adds sheen without claiming physical refraction or spatially variable blur. Secondary copy gains contrast on floating surfaces; reading content and inner controls remain clear. When a continuous-corner shadow container creates a backdrop sampling boundary, its inner surface uses an opaque fill to preserve clipping and shadows."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "功能层按用途选择材质厚度。Acrylic、Aero 与 Glass 使用柔和投影和透光细边；导航栏与工具栏只保留描边。带箭头的默认 Tooltip 与 ContextCard 使用稳定的不透明表面，避免箭头接缝；默认 Tooltip 关闭箭头后可以透光。状态色 Tooltip、Toast 和反色图表提示保持不透明填充，保护原有对比度。"
          : "Functional layers choose material thickness by purpose. Acrylic, Aero and Glass use soft projections and translucent hairlines; navigation bars and toolbars retain strokes only. Default tooltips with stems and ContextCard use stable opaque surfaces to avoid stem seams; default tooltips without stems can transmit the backdrop. Status-colored tooltips, toasts and inverted chart hints retain opaque fills to preserve contrast."}
      </DocsParagraph>
      <DocsParagraph>
        {zh ? "Aero 保留原次要按钮和卡片 Radio 的 72% / 80% 填充、6px 模糊及静态光学效果。Glass 控件以高光、状态填充与细边表达悬停、按压和选中，不使用折射姿态或凝胶压缩。选中语义色是独立均匀状态层，必要时覆盖透射以保护状态辨识；作者事件取消、无滚动聚焦及键盘行为保持不变。" : "Aero retains the former secondary-button and card-radio treatment: 72% / 80% fill, 6px blur and static optics. Glass controls express hover, press and selection through sheen, state fills and fine edges, without refraction poses or gel compression. Selected semantic colors form a separate uniform state layer that can occlude transmission to protect state recognition; author event cancellation, no-scroll focus and keyboard behavior are preserved."}
      </DocsParagraph>
      <DocsParagraph data-glass-lighting-contract="">
        {zh ? "Glass 使用 CSS backdrop-filter 进行一次背景模糊与饱和度调整，前景文字不参与滤镜。静态斜向高光、薄内描边与阴影形成层次；控件追光作为独立装饰，不改变基材 alpha，也不重复模糊。没有 SVG 位移滤镜、贴图编码、几何缓存或浏览器版本白名单。" : "Glass applies one CSS backdrop-filter for blur and saturation, leaving foreground text unfiltered. Static diagonal sheen, thin inset edges and shadows establish depth; control glints are separate decoration without changing body alpha or adding blur. There are no SVG displacement filters, map encoding, geometry caches or browser-version allowlists."}
      </DocsParagraph>
      <DocsParagraph>
        {zh ? "仅使用 CSS 的页面与支持背景滤镜的浏览器使用同一套静态 Glass。指针更新只在输入时请求一帧，离开、取消、禁用和卸载时清理，空闲时不维持动画循环。减少透明度、强制颜色或缺少基础能力时回退 Solid；减少动效关闭新增追光与过渡。" : "CSS-only pages and browsers supporting backdrop filters use the same static Glass. Pointer updates request a frame only after input and clean up on exit, cancellation, disable and unmount, with no idle animation loop. Reduced transparency, forced colors or missing basic capabilities resolve to Solid; reduced motion disables added tracking and transitions."}
      </DocsParagraph>
      <DocsParagraph>
        {zh ? "正文和普通内容卡片不自动玻璃化。需要时将 material-glass-clear、material-glass-regular 或 material-glass-dense 与 material-base、material-small、material-medium、material-large 之一组合。普通 DOM 卡片只有静态高光，不自动绑定指针事件，也不改变布局、圆角或作者 transform。" : "Body content and ordinary cards do not become glass automatically. Opt in by combining material-glass-clear, material-glass-regular or material-glass-dense with material-base, material-small, material-medium or material-large. Plain DOM cards use static sheen without automatic pointer listeners, layout changes, new corner radii or changes to author transforms."}
      </DocsParagraph>
      <DocsParagraph data-texture-migration="">
        {zh ? "命名迁移保持不变：原 Hybrid 改名 Acrylic（hybrid → acrylic），最早的 Glass 改名 Aero（glass → aero）。旧存储自动迁移到 unitary-texture-preference-v2；有效 v2 值优先，已保存的 v2 glass 继续选择 Glass 并应用新外观。最早 Glass 的 token 前缀改为 aero，旧 hybrid 前缀改为 acrylic。" : "The naming migration is unchanged: Hybrid becomes Acrylic (hybrid → acrylic), and the original Glass becomes Aero (glass → aero). Legacy storage migrates to unitary-texture-preference-v2; valid v2 values win, and saved v2 glass continues to select Glass with its new appearance. Rename the original Glass token prefix to aero and the hybrid prefix to acrylic."}
      </DocsParagraph>
      <DocsParagraph data-glass-token-migration="">
        {zh ? "本次替换删除 --material-texture-glass- 下的 ior、roughness、thickness、absorption、light-azimuth、light-intensity、ambient-intensity、ambient-color、refraction 和 edge-width 十个光学 token。请从 setTokens、resetTokens 及 CSS 覆盖中移除这些名称；它们不再是有效 RuntimeTokenName，setTokens 会拒绝未知名称，不提供无效果兼容映射。继续使用 blur、overlay-blur、opacity 三个外观 token 调整模糊与基材填充。" : "This replacement removes ten optical tokens under --material-texture-glass-: ior, roughness, thickness, absorption, light-azimuth, light-intensity, ambient-intensity, ambient-color, refraction and edge-width. Remove these names from setTokens, resetTokens and CSS overrides. They are no longer valid RuntimeTokenName values; setTokens rejects unknown names, with no no-op compatibility mapping. Continue using blur, overlay-blur and opacity to adjust blur and body fill."}
      </DocsParagraph>
      <DocsParagraph>
        {zh ? "材质组织参考 " : "Material organization draws on "}
        <a className="text-link underline" href="https://www.whu.sb/">Luotopia · whu.sb</a>
        {zh ? " 的模糊、半透明填充、方向高光与细边机制，由 Unitary UI 独立实现；不移植站点源码、素材或布局。" : " for its blur, translucent fill, directional sheen and fine-edge mechanisms, independently implemented for Unitary UI without porting site code, assets or layout."}
      </DocsParagraph>
      <DocsBlock><CodeBlock language="tsx" filename="glass-appearance.tsx">{GLASS_APPEARANCE_EXAMPLE}</CodeBlock></DocsBlock>
      <DocsParagraph>
        {zh
          ? "集中表达状态、数量或类别的小型控件保留稳定的实色前景和语义色，必要时使用局部填充突出信息。文字或图标补足颜色表达，不要求整块玻璃化。"
          : "Compact controls that communicate a state, count or category keep stable solid foregrounds and semantic colors, using a local fill when emphasis is needed. Text or icons supplement color; the whole control does not need a glass treatment."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "Acrylic、Aero 与 Glass 的功能性分隔线及控件已有边框，使用所在配色主文字色派生的中性透光线，与装饰高光独立；"
          : "In Acrylic, Aero and Glass, functional dividers and existing control borders use neutral translucent lines derived from the current palette’s primary text color, independently of decorative highlights; "}
        <code>--material-texture-line-opacity</code>
        {zh
          ? " 统一调节强度，默认浅色 18%、深色 22%。Solid 保持现有边线，自定义边框色保留。"
          : " adjusts their shared strength, defaulting to 18% in light mode and 22% in dark mode. Solid retains its existing lines, and custom border colors are preserved."}
      </DocsParagraph>
    </DocsSection>
  );
}

export function MaterialsMaskSection() {
  const { language } = useLanguage();
  const zh = language === "zh-CN";
  return (
    <DocsSection id="mask">
      <DocsSectionTitle>{zh ? "Mask · 背景弱化" : "Mask · Background emphasis"}</DocsSectionTitle>
      <DocsParagraph>
        {zh
          ? "Mask 将注意力移向前景，同时保留背景上下文。Solid 保留历史样式：Backdrop 随明暗主题选择遮罩色调，Scrim 暗化背景。Acrylic、Aero 与 Glass 则统一使用轻微的中性遮罩、背景模糊与适度降低饱和度，不再因弹窗或抽屉而大幅改变背景明暗。它们是视觉材质，不替代组件的关闭行为、焦点约束、ARIA 或背景不可交互语义，也不同于 SkeletonMask 加载占位。"
          : "Masks draw attention to the foreground while retaining context. Solid keeps its historical treatments: Backdrop tint follows the light/dark theme and Scrim dims the background. Acrylic, Aero and Glass share a faint neutral veil, backdrop blur and modest desaturation, avoiding a large brightness shift between modals and drawers. These visual materials do not replace dismissal, focus management, ARIA or background interaction rules, and differ from SkeletonMask loading placeholders."}
      </DocsParagraph>
      <DocsBlock className="grid gap-6 sm:grid-cols-2" data-material-group="mask">
        {(["mask-backdrop", "mask-scrim"] as const).map((role) => (
          <div key={role}>
            <div className="materials-texture-stage relative isolate flex h-44 items-center justify-center overflow-hidden rounded-lg" data-slot="texture-mask-scene">
              <span className="text-heading-24 text-foreground" aria-hidden>{zh ? "背景内容" : "Background content"}</span>
              <div className={role === "mask-backdrop" ? "material-mask absolute inset-0 rounded-[inherit]" : "material-mask-scrim absolute inset-0 rounded-[inherit]"} data-material-sample={role} aria-hidden />
              <span className="material-menu absolute bottom-4 left-4 right-4 px-4 py-3 text-label-14 text-foreground" data-material="floating">{zh ? "保持清晰的前景" : "A clear foreground"}</span>
            </div>
            <p className="mt-3 text-label-14 font-medium text-foreground">{role === "mask-backdrop" ? "Backdrop" : "Scrim"}</p>
            <p className="mt-1 font-mono text-copy-13 text-muted-foreground">{role === "mask-backdrop" ? "material-mask" : "material-mask-scrim"}</p>
          </div>
        ))}
      </DocsBlock>
      <DocsParagraph>
        {zh
          ? "模糊仅采样背景，文字不参与模糊。遮罩使用带 alpha 的颜色合成，避免降低父容器整体透明度。不要在内部按钮、输入控件或嵌套功能层上重复添加模糊。"
          : "Blur samples the backdrop, never the text. Masks use alpha color compositing rather than lowering the parent element's opacity. Avoid repeated blur on inner buttons, inputs or nested functional layers."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "Acrylic、Aero 与 Glass 的遮罩颜色取所在配色的表面色与主文字色的中点，默认不透明度为 8%、背景模糊为 8px、饱和度为 85%。它轻微收敛极亮或极暗区域，不保证每个像素的亮度不变。"
          : "Acrylic, Aero and Glass mask color is the midpoint between the local palette’s surface and primary text colors, with 8% opacity, 8px backdrop blur and 85% saturation by default. It gently moderates very bright or dark regions rather than preserving every pixel’s brightness."}
        {" "}<code>--material-texture-mask-opacity</code>
        {zh ? " 与 " : " and "}<code>--material-texture-mask-saturation</code>
        {zh ? " 用于全局调整；旧名称 " : " allow global adjustment; the old name "}<code>--material-texture-mask-backdrop-opacity</code>
        {zh ? " 作为弃用兼容别名保留。这些数值是本项目的设计取舍，并非 Apple HIG 规定的参数。" : " remains as a deprecated compatibility alias. These values are project design choices, not parameters prescribed by Apple HIG."}
      </DocsParagraph>
      <DocsBlock><CodeBlock language="tsx" filename="mask-materials.tsx">{MASK_EXAMPLE}</CodeBlock></DocsBlock>
    </DocsSection>
  );
}

export function MaterialsCompatibilitySection() {
  const { language } = useLanguage();
  const zh = language === "zh-CN";
  return (
    <DocsSection id="compatibility">
      <DocsSectionTitle>{zh ? "兼容性与渲染成本" : "Compatibility and rendering cost"}</DocsSectionTitle>
      <DocsList className="list-disc pl-[var(--uni-doc-list-indent)]">
        <li>{zh ? "使用 CSS 背景模糊、颜色混合和渐变，无需实验开关；缺少所需能力时，全局回退为 Solid。" : "CSS backdrop blur, color mixing and gradients need no experimental flags. Missing capabilities fall back globally to Solid."}</li>
        <li>{zh ? "尊重强制颜色、减少透明度与减少动态效果偏好；减少透明度检测作为渐进增强，Solid 始终可手动选择。" : "Respect forced colors, reduced transparency and reduced motion. Transparency detection is a progressive enhancement; Solid is always available manually."}</li>
        <li>{zh ? "Acrylic / Aero 的功能层默认模糊不超过 20px、独立控件为 6px；Glass 的 Clear / Regular / Dense 分别为 8px / 10px / 20px，固定顶栏为 24px，hover 面板为 20px，遮罩为 8px。内部控件共享外层采样，指针更新按帧合并且空闲时停止。" : "Acrylic / Aero functional layers default to at most 20px blur and standalone controls to 6px. Glass Clear / Regular / Dense use 8px / 10px / 20px, fixed headers use 24px, hover panels use 20px and masks use 8px. Inner controls share their outer sampler; pointer updates coalesce per frame and stop when idle."}</li>
      </DocsList>
      <DocsParagraph>
        <a className="text-link underline underline-offset-4" href="https://developer.apple.com/design/human-interface-guidelines/materials">Apple HIG · Materials</a>
        {" · "}<a className="text-link underline underline-offset-4" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter">MDN · backdrop-filter</a>
        {" · "}<a className="text-link underline underline-offset-4" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency">MDN · prefers-reduced-transparency</a>
      </DocsParagraph>
    </DocsSection>
  );
}
