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

const GLASS_LIGHTING_EXAMPLE = `import { setTokens, resetTokens } from "@hustradio/unitary-ui";

setTokens({
  "--material-texture-glass-refraction": "6px",
  "--material-texture-glass-edge-width": "10px",
  "--material-texture-glass-ior": "1.5",
  "--material-texture-glass-roughness": "0.24",
  "--material-texture-glass-thickness": "1",
  "--material-texture-glass-absorption": "0.08",
  "--material-texture-glass-light-azimuth": "315deg",
  "--material-texture-glass-light-intensity": "0.65",
  "--material-texture-glass-ambient-intensity": "0.25",
  "--material-texture-glass-ambient-color": "currentColor",
});

// A local environment color; the default is neutral within the surface palette.
// setTokens({ "--material-texture-glass-ambient-color": "#8eb8c5" }, { target: surface });
// resetTokens(["--material-texture-glass-ambient-color"], { target: surface });`;

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
      <p className="mb-2 text-label-14 font-medium">{variant === "clear" ? "Clear · 24% / 36%" : variant === "regular" ? "Regular · 52% / 68%" : "Dense · 82% / 90%"}</p>
      <div className="materials-texture-stage relative flex min-h-48 items-center justify-center rounded-lg p-4">
        <div className="materials-refraction-grid" aria-hidden="true" />
        {variant === "clear" ? <div className="relative">
          <div aria-hidden="true" className="absolute inset-0 rounded-lg bg-background/70" data-slot="glass-media-backing" />
          <div className="material-menu material-glass-clear relative flex items-center gap-3 p-3" data-material="floating">
            <Button type="tertiary" onClick={() => setPlaying(!playing)}>{playing ? (zh ? "暂停" : "Pause") : (zh ? "播放" : "Play")}</Button><span className="text-label-13">00:42</span>
          </div>
        </div> : variant === "regular" ? <Toolbar className="material-glass-regular relative" aria-label={zh ? "导航操作预览" : "Navigation actions preview"}>
          <ToolbarGroup><ToolbarItem label={zh ? "置顶" : "Pin"} active={pinned} onSelect={() => setPinned(!pinned)} /></ToolbarGroup>
        </Toolbar> : <div className="material-menu material-glass-dense relative w-full p-4 text-copy-13" data-material="floating">
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
          ? "材质用来表达功能层与内容之间的关系。借鉴 Apple HIG 对层级、上下文和可读性的重视，保持中性、温和的透光与边缘反射；正文、表格和表单内容保持清晰。"
          : "Materials express the relationship between functional layers and content. Following Apple HIG principles of hierarchy, context and readability, transmission and edge reflections stay neutral and gentle; body text, tables and form content remain clear."}
      </DocsParagraph>
      <DocsList className="list-disc pl-[var(--uni-doc-list-indent)]" data-texture-summary="">
        <li>{zh ? "Solid 是默认值，保留现有填充、描边、阴影及少量既有遮罩模糊。" : "Solid is the default and preserves existing fills, strokes, shadows and the few existing blurred masks."}</li>
        <li>{zh ? "Acrylic 在导航、浮层和遮罩增加轻微背景散射，内部控件保持平面。" : "Acrylic adds gentle background diffusion to navigation, floating layers and masks; inner controls stay flat."}</li>
        <li>{zh ? "Aero 保留原 Glass 的背景散射、方向性照明和厚度吸收近似，用于功能层、次要按钮与卡片式 Radio。" : "Aero retains the former Glass diffusion, directional lighting and thickness-absorption approximation on functional layers, secondary buttons and card-style Radio."}</li>
        <li>{zh ? "Glass 使用均匀基材，沿轮廓的结构变化产生背景折射、反射及环境光响应；控件保留清晰的按下、选中和焦点反馈。" : "Glass uses a uniform body, with contour geometry producing backdrop refraction, reflection and ambient lighting. Controls retain clear pressed, selected and focus states."}</li>
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
        {zh ? "Glass 按用途提供 material-glass-clear、material-glass-regular 和 material-glass-dense 三个 className 预设，应用到实际材质表面。导航、Toolbar 和独立次要操作默认 Regular；菜单、选择列表、抽屉及对话框类浮层默认 Dense。Clear 仅显式用于媒体上的少量图标或短标签，由场景提供独立衬底并实测对比度。三档共享 1px 模糊，填充为 Clear 24% / 36%、Regular 52% / 68%、Dense 82% / 90%；折射参数分别为 6px / 6px / 3px，边带上限 8px / 10px / 8px，粗糙度 0.18 / 0.24 / 0.32。正文和普通内容卡片保持 Solid 或 Acrylic。" : "Glass provides material-glass-clear, material-glass-regular and material-glass-dense className presets on actual material surfaces. Navigation, Toolbar and standalone secondary actions default to Regular; menus, selection lists, drawers and dialog surfaces default to Dense. Clear is explicit for a few media icons or short labels, with separate scene backing and measured contrast. All use 1px blur: Clear fill is 24% / 36%, Regular 52% / 68%, and Dense 82% / 90%. Refraction inputs are 6px / 6px / 3px, bevel caps 8px / 10px / 8px and roughness 0.18 / 0.24 / 0.32. Body text and ordinary content cards retain Solid or Acrylic."}
      </DocsParagraph>
      <DocsParagraph>
        {zh ? "根 token 是 Regular 基准，Clear / Dense 采用局部预设；同一表面上的作者 token 优先。setTokens(values, { target: surface }) 修改当前表面，resetTokens(names, { target: surface }) 恢复该档；显式 Regular 恢复根基准。Portal 必须在实际浮层上应用 className，不继承触发器预设。Select.className 只作用于触发器，选择列表本轮采用自动 Dense。" : "Root tokens provide the Regular baseline; Clear / Dense use local presets, with author tokens on the same surface taking precedence. setTokens(values, { target: surface }) customizes that surface; resetTokens(names, { target: surface }) restores its preset. Explicit Regular restores the root baseline. Put className on actual portal content, rather than its trigger. Select.className styles only the trigger; its list uses automatic Dense."}
      </DocsParagraph>
      <DocsParagraph>
        {zh ? "增强对比度 prefers-contrast: more 使用 92% / 96% 填充和 Dense 光学参数，中性轮廓使用前景色 65% 混合；系统设置变化会同步 SVG 与 CSS。它只改变私有有效参数，公共 token 保留作者请求值。减少透明度和强制颜色优先回退 Solid。普通文字至少 4.5:1，大文字及必要控件标识至少 3:1，以实际合成背景验证。" : "prefers-contrast: more uses 92% / 96% fill with Dense optics and neutral outlines mixed from 65% foreground color. SVG and CSS update with system changes. Only private effective inputs change; public tokens retain requested values. Reduced transparency and forced colors take precedence and resolve to Solid. Test actual composited backgrounds for at least 4.5:1 normal text and 3:1 large text and necessary control indicators."}
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
        {zh
          ? "Acrylic 采用 8px 背景散射与 80% 填充；Aero 保留原 Glass 的 20px 散射、浅色 60% 和深色 74% 填充。新 Glass 默认 1px 模糊，Regular 基础填充浅色 52%、深色 68%，文字浮层自动采用 Dense 的 82% / 90%；基材填充、模糊、粗糙度与吸收系数全表面一致，视觉差异来自结构改变后的光学响应。浮层次级文字适度增强对比度，正文和内部控件保持清晰。相关 --material-texture-* token 可统一调整。连续曲率阴影容器形成背景采样边界时，内部表面使用不透明填充，保持裁切与阴影完整。"
          : "Acrylic uses 8px diffusion and 80% fill. Aero preserves the former Glass: 20px diffusion, 60% light fill and 74% dark fill. New Glass defaults to 1px blur: Regular uses 52% light and 68% dark base fill, while text-rich floating surfaces automatically use Dense at 82% / 90%. Base fill, blur, roughness and absorption coefficients are uniform across the surface; geometry produces the optical variation. Secondary copy gains contrast on floating surfaces; reading content and inner controls remain clear. The --material-texture-* tokens allow shared adjustments. When a continuous-corner shadow container creates a backdrop sampling boundary, its inner surface uses an opaque fill to preserve clipping and shadows."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "功能层按用途选择材质厚度。Acrylic、Aero 与 Glass 使用柔和投影和透光细边；导航栏与工具栏只保留描边。带箭头的默认 Tooltip 与 ContextCard 使用稳定的不透明表面，避免箭头接缝；默认 Tooltip 关闭箭头后可以透光。状态色 Tooltip、Toast 和反色图表提示保持不透明填充，保护原有对比度。"
          : "Functional layers choose material thickness by purpose. Acrylic, Aero and Glass use soft projections and translucent hairlines; navigation bars and toolbars retain strokes only. Default tooltips with stems and ContextCard use stable opaque surfaces to avoid stem seams; default tooltips without stems can transmit the backdrop. Status-colored tooltips, toasts and inverted chart hints retain opaque fills to preserve contrast."}
      </DocsParagraph>
      <DocsParagraph>
        {zh ? "Aero 保留原次要按钮和卡片 Radio 的 72% / 80% 填充、6px 模糊及静态光学效果。新 Glass 移除指针追光、人工亮边和凝胶压缩；次要操作、Tabs、Toolbar、Toggle 和 Switch 使用既有状态反馈。状态色、文字、点击区域和焦点环保持稳定，内部控件共享外层的背景采样。" : "Aero retains the former secondary-button and card-radio treatment: 72% / 80% fill, 6px blur and static optics. New Glass removes pointer-tracking glare, artificial rims and gel compression. Secondary actions, Tabs, Toolbar, Toggle and Switch use their existing state feedback. State colors, text, hit areas and focus rings stay stable; inner controls share the outer backdrop sampler."}
      </DocsParagraph>
      <DocsParagraph data-glass-lighting-contract="">
        {zh ? "Glass 使用均匀基材，根据实际轮廓和连续倒角法线，按 Snell 折射方向向内采样，限制位移变化率以避免纹理折叠，并在中心归零。非偏振 Fresnel 决定视角相关的环境反射，GGX / Smith 高光只依赖法线、光向与统一粗糙度；默认模糊 1px，基础填充全表面一致，内部控件共享外层采样。材质本体没有位置渐变，不使用空间可变模糊或额外边缘亮度蒙版。同一背景滤镜仅做一次模糊和位移，CSS 圆角完成唯一的轮廓裁切。透射与反射在线性光空间按能量权重混合，Beer–Lambert T = exp(−μd) 使用统一吸收系数和实际折射光程，不附加边缘权重。Regular 默认 IOR 1.5、粗糙度 0.24、厚度 1、吸收 0.08，主光 315° / 0.65，环境光 0.25 / currentColor。setTokens 和 resetTokens 可局部调整环境色与参数。环境光是屏幕空间近似，不自动读取场景环境贴图。" : "Glass uses a uniform body and samples inward along Snell refraction using the actual contour and continuous bevel normals, limiting displacement derivatives to prevent texture folds and returning to zero in the center. Unpolarized Fresnel determines view-dependent environment reflection; GGX / Smith highlights depend only on normals, light direction and uniform roughness. Blur defaults to 1px, base fill is uniform across the surface, and inner controls share the outer sampler. The material has no positional gradient, spatially variable blur or extra rim-brightness mask. One backdrop pipeline applies blur and displacement, with CSS corners providing the only silhouette clip. Transmission and reflection mix with energy weights in linear light. Beer–Lambert T = exp(−μd) uses the uniform absorption coefficient and actual refracted optical path, without an edge weight. Regular defaults: IOR 1.5, roughness 0.24, thickness 1, absorption 0.08, key light 315° / 0.65 and ambient 0.25 / currentColor. Use setTokens and resetTokens for local environment color and optical inputs. Environment lighting is a screen-space approximation without automatic environment-map capture."}
      </DocsParagraph>
      <DocsParagraph>
        {zh ? "Regular 折射强度默认 6px，结构倒角区最大 10px，受短边 20% 和最小圆角共同约束；位移由变化率限制决定。尖角、退化轮廓和解码后采样折叠使用均匀的 CSS Glass 回退。refraction 设为 0px 可关闭增强。桌面 Chromium 151+ 在能力与贴图解码检查通过后增强；其他浏览器、仅 CSS 使用、受限 CSP、异常轮廓和背景采样边界保留 CSS Glass。减少透明度和强制颜色使用 Solid；状态过渡继续遵循各组件的减少动效策略，Glass 不附加追光或形变。" : "Regular refraction strength defaults to 6px. The structural bevel region is at most 10px, bounded by 20% of the shorter dimension and the smallest corner radius; derivative limits determine displacement. Sharp or degenerate contours and decoded maps with source folds retain a uniform CSS Glass fallback. Set refraction to 0px to disable enhancement. Desktop Chromium 151+ enhances after capability and image-decode checks. Other engines, CSS-only use, restrictive CSP, unsupported outlines and backdrop boundaries retain CSS Glass. Reduced transparency and forced colors resolve to Solid; state transitions retain each component’s reduced-motion policy; Glass adds no pointer-tracking light or deformation."}
      </DocsParagraph>
      <DocsParagraph>
        {zh ? "相同几何和光学参数的表面共享构建结果，增强准备过程中保留 CSS Glass。动态移除材质 class 或改变材质身份时，会取消旧结果并释放资源；Portal 卸载、StrictMode 重挂载和多个根 Provider 共享页面时，不需要手动维护 SVG 定义。" : "Surfaces with equal geometry and optical inputs share construction results, retaining CSS Glass while enhancement is prepared. Removing a material class or changing material identity cancels stale results and releases resources. Portal teardown, StrictMode remounts and multiple root providers do not require manual SVG management."}
      </DocsParagraph>
      <DocsParagraph data-texture-migration="">
        {zh ? "迁移：原 Hybrid 改名 Acrylic（hybrid → acrylic），原 Glass 改名 Aero（glass → aero）。旧存储自动迁移到 unitary-texture-preference-v2；有效新值优先。程序中 texture=glass 现在选择新 Glass，保持旧外观请改用 aero，并将旧 glass token 前缀改为 aero。旧 hybrid token 前缀改为 acrylic。" : "Migration: Hybrid becomes Acrylic (hybrid → acrylic), and the former Glass becomes Aero (glass → aero). Legacy storage migrates to unitary-texture-preference-v2; valid new values win. In code, texture=glass now selects new Glass. Use aero and rename former glass token prefixes to aero to retain the old appearance; rename hybrid token prefixes to acrylic."}
      </DocsParagraph>
      <DocsParagraph>
        {zh ? "环境光、几何高光与可读性参考 " : "Environment lighting, geometric highlights and readability draw on "}
        <a className="text-link underline" href="https://developer.apple.com/videos/play/wwdc2025/219/">Apple · Meet Liquid Glass</a>
        {zh ? "；上述公式与参数由 Unitary UI 自行选择，并非 HIG 规定。" : "; these formulas and parameters are Unitary UI choices, not HIG requirements."}
      </DocsParagraph>
      <DocsBlock><CodeBlock language="tsx" filename="glass-lighting.tsx">{GLASS_LIGHTING_EXAMPLE}</CodeBlock></DocsBlock>
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
        <li>{zh ? "功能层默认模糊不超过 20px，遮罩为 8px，独立次要按钮和卡片选项为 6px；新 Glass 为 1px；贴图仅在几何或参数改变时重建，指针更新按帧合并且空闲时停止，避免重复采样。" : "Default blur stays within 20px for functional layers, 8px for masks and 6px for standalone secondary buttons and surface-styled options. New Glass uses 1px. Maps rebuild only for geometry or parameter changes; pointer updates coalesce per frame and stop when idle, avoiding repeated sampling."}</li>
      </DocsList>
      <DocsParagraph>
        <a className="text-link underline underline-offset-4" href="https://developer.apple.com/design/human-interface-guidelines/materials">Apple HIG · Materials</a>
        {" · "}<a className="text-link underline underline-offset-4" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter">MDN · backdrop-filter</a>
        {" · "}<a className="text-link underline underline-offset-4" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency">MDN · prefers-reduced-transparency</a>
      </DocsParagraph>
    </DocsSection>
  );
}
