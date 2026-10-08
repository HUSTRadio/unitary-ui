import { useId } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";
import {
  Modal, ModalClose, ModalContent, ModalDescription, ModalFooter,
  ModalHeader, ModalTitle, ModalTrigger,
} from "@/components/ui/modal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import {
  ResponsiveDrawer, ResponsiveDrawerBody, ResponsiveDrawerClose,
  ResponsiveDrawerContent, ResponsiveDrawerFooter, ResponsiveDrawerHeader,
  ResponsiveDrawerTrigger, ResponsiveDrawerTitle, ResponsiveDrawerDescription,
} from "@/components/ui/responsive-drawer";
import { useTheme, type TexturePreference } from "@/lib/theme";

import { useLanguage, type DocsLanguage } from "../i18n/language";
import { DocsBlock, DocsCaption, DocsList, DocsParagraph, DocsSection, DocsSectionTitle } from "./docs-typography";

const TEXTURE_OPTIONS: readonly TexturePreference[] = ["solid", "hybrid", "glass"];
const TEXTURE_LABELS: Record<DocsLanguage, Record<TexturePreference, string>> = {
  "en-US": { solid: "Solid", hybrid: "Hybrid", glass: "Glass" },
  "zh-CN": { solid: "Solid", hybrid: "Hybrid", glass: "Glass" },
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
      <RadioGroupItem value="hybrid">Hybrid</RadioGroupItem>
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
  const { language } = useLanguage();
  const { texture, setTexture } = useTheme();
  const zh = language === "zh-CN";

  return (
    <div className="materials-texture-stage flex min-h-80 items-center rounded-lg border border-border p-5 sm:p-8" data-slot="texture-interaction-demo">
      <div className="material-menu mx-auto w-full max-w-lg p-5" data-material="floating" data-material-sample="floating">
        <p className="text-label-14 font-medium text-foreground">{zh ? "清晰的工作空间" : "A clear workspace"}</p>
        <p className="mt-2 text-copy-14 text-foreground">
          {zh ? "背景表达层次，文字和控件保持清晰。打开浮层，观察全局材质切换。" : "The background adds depth while text and controls stay clear. Open a layer and change the global texture."}
        </p>
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
      <DocsList className="list-disc pl-[var(--uni-doc-list-indent)]">
        <li>{zh ? "Solid 是默认值，保留现有填充、描边、阴影及少量既有遮罩模糊。" : "Solid is the default and preserves existing fills, strokes, shadows and the few existing blurred masks."}</li>
        <li>{zh ? "Hybrid 在导航、浮层和遮罩增加轻微背景散射，内部控件保持平面。" : "Hybrid adds gentle background diffusion to navigation, floating layers and masks; inner controls stay flat."}</li>
        <li>{zh ? "Glass 在功能层、次要操作按钮和具有卡片外观的 Radio 选项上增加透光、静态高光与亮暗边缘，提示材质厚度。不使用真实折射、色散或随指针移动的炫光。" : "Glass adds transmission, static highlights and light-and-dark edges to functional layers, secondary action buttons and surface-styled Radio options, suggesting material thickness. It does not use true refraction, dispersion or pointer-driven glare."}</li>
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
          ? "Hybrid 采用 8px 背景散射与 80% 填充；Glass 采用 20px 散射，浅色填充 60%，深色填充 74%。浮层次级文字适度增强对比度，正文和内部控件保持清晰。相关 --material-texture-* token 可统一调整。连续曲率阴影容器形成背景采样边界时，内部表面使用不透明填充，保持裁切与阴影完整。"
          : "Hybrid uses 8px diffusion and 80% fill. Glass uses 20px diffusion with 60% fill in light mode and 74% in dark mode. Secondary copy gains contrast on floating surfaces; reading content and inner controls remain clear. The --material-texture-* tokens allow shared adjustments. When a continuous-corner shadow container creates a backdrop sampling boundary, its inner surface uses an opaque fill to preserve clipping and shadows."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "功能层按用途选择材质厚度。Hybrid 与 Glass 使用柔和投影和透光细边；导航栏与工具栏只保留描边。带箭头的默认 Tooltip 与 ContextCard 使用稳定的不透明表面，避免箭头接缝；默认 Tooltip 关闭箭头后可以透光。状态色 Tooltip、Toast 和反色图表提示保持不透明填充，保护原有对比度。"
          : "Functional layers choose material thickness by purpose. Hybrid and Glass use soft projections and translucent hairlines; navigation bars and toolbars retain strokes only. Default tooltips with stems and ContextCard use stable opaque surfaces to avoid stem seams; default tooltips without stems can transmit the backdrop. Status-colored tooltips, toasts and inverted chart hints retain opaque fills to preserve contrast."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "Glass 中使用默认表面填充的启用态次要 Button、ButtonLink 和具有卡片外观的 Radio 选项采用透光填充，以静态亮暗边缘建立轮廓。独立控件的填充为浅色 72%、深色 80%，背景模糊为 6px。仅在最近的功能层使用默认中性填充时，控件填充减至三分之一，避免叠加成实色块；透明、自定义或语义色功能层和单独遮罩保留完整填充，确保文字对比度。功能层和遮罩内均不重复采样。材质按操作语义选择：主要操作、状态色按钮、输入区域和单选指示器保留清晰的原有样式；选中轮廓与键盘焦点提示保持可辨。Hybrid 的控件保持平面。"
          : "Enabled secondary Button, ButtonLink and surface-styled Radio options with default surface fills in Glass transmit the backdrop, with static light-and-dark edges defining their contour. Standalone controls use 72% fill in light mode, 80% in dark mode and 6px backdrop blur. Control fill falls to one-third only when the nearest functional layer has a default neutral fill, avoiding stacked solid-looking fills. Transparent, custom or semantic-colored layers and masks alone retain the full fill to protect text contrast. Neither context samples again. Material follows the action’s semantics: primary actions, status-colored buttons, input areas and radio indicators retain their clear existing styles; selected outlines and keyboard focus cues stay distinguishable. Hybrid controls stay flat."}
        {" "}<code>--material-texture-control-opacity</code>
        {zh ? " 与 " : " and "}<code>--material-texture-control-blur</code>
        {zh ? " 可统一调整填充与独立控件的模糊强度。" : " adjust the shared fill and standalone control blur."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "Glass 以窄高光、柔和羽化和底部暗边提示厚度，中性描边继续帮助识别边界。这些是静态预计算的照明提示：参考折射率约 1.5 的 Schlick 近似，法向反射率约 4%，70° 斜入射约 16%，再按明暗主题校准。这些值属于本项目，不是 Apple HIG 的规定，也不模拟真实场景的 Fresnel 反射或折射。"
          : "Glass suggests thickness with a narrow highlight, a softly feathered edge and a darker lower seam, while a neutral stroke keeps boundaries clear. These are static, precomputed lighting cues calibrated for this project: Schlick’s approximation at an index of refraction around 1.5 gives roughly 4% reflection head-on and 16% at 70°. These values are not prescribed by Apple HIG, and the interface does not simulate scene-dependent Fresnel reflection or refraction."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "集中表达状态、数量或类别的小型控件保留稳定的实色前景和语义色，必要时使用局部填充突出信息。文字或图标补足颜色表达，不要求整块玻璃化。"
          : "Compact controls that communicate a state, count or category keep stable solid foregrounds and semantic colors, using a local fill when emphasis is needed. Text or icons supplement color; the whole control does not need a glass treatment."}
      </DocsParagraph>
      <DocsParagraph>
        {zh
          ? "Hybrid 与 Glass 的功能性分隔线及控件已有边框，使用所在配色主文字色派生的中性透光线，与装饰高光独立；"
          : "In Hybrid and Glass, functional dividers and existing control borders use neutral translucent lines derived from the current palette’s primary text color, independently of decorative highlights; "}
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
          ? "Mask 将注意力移向前景，同时保留背景上下文。Solid 保留历史样式：Backdrop 随明暗主题选择遮罩色调，Scrim 暗化背景。Hybrid 与 Glass 则统一使用轻微的中性遮罩、背景模糊与适度降低饱和度，不再因弹窗或抽屉而大幅改变背景明暗。它们是视觉材质，不替代组件的关闭行为、焦点约束、ARIA 或背景不可交互语义，也不同于 SkeletonMask 加载占位。"
          : "Masks draw attention to the foreground while retaining context. Solid keeps its historical treatments: Backdrop tint follows the light/dark theme and Scrim dims the background. Hybrid and Glass share a faint neutral veil, backdrop blur and modest desaturation, avoiding a large brightness shift between modals and drawers. These visual materials do not replace dismissal, focus management, ARIA or background interaction rules, and differ from SkeletonMask loading placeholders."}
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
          ? "Hybrid 与 Glass 的遮罩颜色取所在配色的表面色与主文字色的中点，默认不透明度为 8%、背景模糊为 8px、饱和度为 85%。它轻微收敛极亮或极暗区域，不保证每个像素的亮度不变。"
          : "Hybrid and Glass mask color is the midpoint between the local palette’s surface and primary text colors, with 8% opacity, 8px backdrop blur and 85% saturation by default. It gently moderates very bright or dark regions rather than preserving every pixel’s brightness."}
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
        <li>{zh ? "功能层默认模糊不超过 20px，遮罩为 8px，独立次要按钮和卡片选项为 6px；采用静态效果，无需逐帧 JavaScript 计算，避免重复采样和模糊动画，保持内容与交互清晰。" : "Default blur stays within 20px for functional layers, 8px for masks and 6px for standalone secondary buttons and surface-styled options. Static effects need no per-frame JavaScript computation and avoid repeated sampling and blur animation, keeping content and interaction clear."}</li>
      </DocsList>
      <DocsParagraph>
        <a className="text-link underline underline-offset-4" href="https://developer.apple.com/design/human-interface-guidelines/materials">Apple HIG · Materials</a>
        {" · "}<a className="text-link underline underline-offset-4" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter">MDN · backdrop-filter</a>
        {" · "}<a className="text-link underline underline-offset-4" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency">MDN · prefers-reduced-transparency</a>
      </DocsParagraph>
    </DocsSection>
  );
}
