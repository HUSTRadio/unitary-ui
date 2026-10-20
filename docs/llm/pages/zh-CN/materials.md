# 材质

> Route: `/materials`

# 材质

圆角、填充、描边与阴影的预设。

Surface 用于页面内的容器，Floating 用于浮层。材质预设定义圆角、背景、边框和阴影；显示顺序由层级变量单独控制。

## Texture · 全局材质外观

材质用来表达功能层与内容之间的关系。Glass 以半透明填充、背景模糊、柔和高光和细边表达层次，保留 Unitary 的配色、尺寸和圆角；正文、表格和表单内容保持清晰。

- Solid 是默认值，保留现有填充、描边、阴影及少量既有遮罩模糊。
- Acrylic 在导航、浮层和遮罩增加轻微背景散射，内部控件保持平面。
- Aero 保留原 Glass 的背景散射、方向性照明和厚度吸收近似，用于功能层、次要按钮与卡片式 Radio。
- Glass 使用均匀半透明基材与 CSS 模糊，叠加静态方向高光、细内描边及柔和投影；既有交互控件提供克制的指针追光和 hover 过渡。

全局材质外观

SolidAcrylicAeroGlass

选择：Solid · 实际外观：Solid

这里的切换作用于整个文档界面、Portal 浮层和 SubFrame 内容。材质独立于明暗主题、UI 配色与代码主题；局部配色作用域继续有效，组件不提供局部材质主题开关。

清晰的工作空间

背景表达层次，文字和控件保持清晰。打开浮层，观察全局材质切换。

列表

网格

已保存 3 项任务

Photograph by [mirobo](https://commons.wikimedia.org/wiki/File:View_of_lake_in_forest.jpg) · Alpsee · [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)

Clear · 28% / 36% · 8px

媒体上的短标签；独立的均匀 70% 衬底。

Regular · 56% / 76% · 10px

导航、工具栏和独立次要操作。

Dense · 80% / 86% · 20px

最近的文件

- 项目进展报告
- 下一次评审的备注

菜单、列表、抽屉和文字浮层。

Glass 按用途提供 material-glass-clear、material-glass-regular 和 material-glass-dense 三个 className 预设，应用到实际材质表面。Clear 填充浅/深 28% / 36%、模糊 8px；Regular 为 56% / 76%、10px；Dense 为 80% / 86%、20px。导航、Toolbar 和独立次要操作默认 Regular；菜单、选择列表、抽屉及对话框类浮层默认 Dense。Clear 仅显式用于媒体上的少量图标或短标签，由场景提供独立均匀衬底并实测对比度。三档背景饱和度均为浅色 160%、深色 150%。Regular 的填充针对中性色板及不受控背景的对比度需求调整；仍需检查文字、状态和高光叠加后的实际对比度。

固定或吸顶 Navbar 使用 Regular 填充与 24px 背景模糊，由独立背景层采样，文字与交互仍在前景。SiteNavigation 的 hover 面板超出顶栏采样范围，因此独立采用 Dense 与 20px 模糊；浮层模糊由 --material-texture-glass-overlay-blur 控制。内部按钮共享所在功能层的采样。作者提供的背景、滤镜、局部 blur token 或顶栏 before 伪元素保留优先级。

次要按钮、卡片 Radio、Toolbar、secondary Tabs、Switch、Toggle 和导航操作使用轻量 CSS 指针追光及可插值的 hover 状态，进入和离开均遵循现有动效 token。精细指针移动时高光按帧更新，按压固定接触点，键盘使用中心反馈，触摸仅表达按压。按钮、导航、文字和点击区域不位移；Toggle 原有滑块动画保留。内部控件不增加背景采样；减少动效关闭追光与新增过渡。

根 token 是 Regular 基准，Clear / Dense 采用局部预设；同一表面上的作者 token 优先。setTokens(values, { target: surface }) 修改当前表面，resetTokens(names, { target: surface }) 恢复该档；显式 Regular 恢复根基准。Portal 必须在实际浮层上应用 className，不继承触发器预设。Select.className 只作用于触发器，选择列表本轮采用自动 Dense。

增强对比度 prefers-contrast: more 使用 92% / 96% 填充、Dense 模糊及前景色 65% 混合的中性轮廓。它只改变私有有效参数，公共 token 保留作者请求值。减少透明度和强制颜色优先回退 Solid。普通文字至少 4.5:1，大文字及必要控件标识至少 3:1，以实际合成背景验证；复杂背景使用独立均匀衬底或 Dense。

global-texture.tsx

```tsx
import {
  RadioGroup,
  RadioGroupItem,
  ThemeProvider,
  useTheme,
  type TexturePreference,
} from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles.css";

function TextureControls() {
  const { texture, resolvedTexture, setTexture } = useTheme();
  return (
    <fieldset>
      <legend>Global texture</legend>
      <RadioGroup
        aria-label="Global texture"
        value={texture}
        onChange={(value) => setTexture(value as TexturePreference)}
      >
        <RadioGroupItem value="solid">Solid</RadioGroupItem>
        <RadioGroupItem value="acrylic">Acrylic</RadioGroupItem>
        <RadioGroupItem value="aero">Aero</RadioGroupItem>
        <RadioGroupItem value="glass">Glass</RadioGroupItem>
      </RadioGroup>
      <p>
        {texture} / {resolvedTexture}
      </p>
    </fieldset>
  );
}

export function App() {
  return (
    <ThemeProvider defaultTexture="solid">
      <TextureControls />
    </ThemeProvider>
  );
}
```

根 ThemeProvider 支持 texture（受控）、defaultTexture（非受控，默认 solid）与 onTextureChange。useTheme 返回 texture、resolvedTexture 与 setTexture；有效的已保存选择优先于 defaultTexture，非受控选择独立持久化，嵌套 Provider 继承根材质设置。

仅使用 CSS 时，可在文档根节点声明 `<html data-texture="glass">`，一次应用于整个界面；局部元素上的 data-texture 不创建材质主题。挂载根 ThemeProvider 后，它负责维护该属性并处理能力与辅助功能降级。

Acrylic 采用 8px 背景散射与 80% 填充；Aero 保留原 Glass 的 20px 散射、浅色 60% 和深色 74% 填充。Glass 的基材 alpha 与模糊全表面均匀，静态方向渐变仅负责表面高光，不声称物理折射或空间可变模糊。浮层次级文字适度增强对比度，正文和内部控件保持清晰。连续曲率阴影容器形成背景采样边界时，内部表面使用不透明填充，保持裁切与阴影完整。

功能层按用途选择材质厚度。Acrylic、Aero 与 Glass 使用柔和投影和透光细边；导航栏与工具栏只保留描边。带箭头的默认 Tooltip 与 ContextCard 使用稳定的不透明表面，避免箭头接缝；默认 Tooltip 关闭箭头后可以透光。状态色 Tooltip、Toast 和反色图表提示保持不透明填充，保护原有对比度。

Aero 保留原次要按钮和卡片 Radio 的 72% / 80% 填充、6px 模糊及静态光学效果。Glass 控件以高光、状态填充与细边表达悬停、按压和选中，不使用折射姿态或凝胶压缩。选中语义色是独立均匀状态层，必要时覆盖透射以保护状态辨识；作者事件取消、无滚动聚焦及键盘行为保持不变。

Glass 使用 CSS backdrop-filter 进行一次背景模糊与饱和度调整，前景文字不参与滤镜。静态斜向高光、薄内描边与阴影形成层次；控件追光作为独立装饰，不改变基材 alpha，也不重复模糊。没有 SVG 位移滤镜、贴图编码、几何缓存或浏览器版本白名单。

仅使用 CSS 的页面与支持背景滤镜的浏览器使用同一套静态 Glass。指针更新只在输入时请求一帧，离开、取消、禁用和卸载时清理，空闲时不维持动画循环。减少透明度、强制颜色或缺少基础能力时回退 Solid；减少动效关闭新增追光与过渡。

正文和普通内容卡片不自动玻璃化。需要时将 material-glass-clear、material-glass-regular 或 material-glass-dense 与 material-base、material-small、material-medium、material-large 之一组合。普通 DOM 卡片只有静态高光，不自动绑定指针事件，也不改变布局、圆角或作者 transform。

命名迁移保持不变：原 Hybrid 改名 Acrylic（hybrid → acrylic），最早的 Glass 改名 Aero（glass → aero）。旧存储自动迁移到 unitary-texture-preference-v2；有效 v2 值优先，已保存的 v2 glass 继续选择 Glass 并应用新外观。最早 Glass 的 token 前缀改为 aero，旧 hybrid 前缀改为 acrylic。

本次替换删除 --material-texture-glass- 下的 ior、roughness、thickness、absorption、light-azimuth、light-intensity、ambient-intensity、ambient-color、refraction 和 edge-width 十个光学 token。请从 setTokens、resetTokens 及 CSS 覆盖中移除这些名称；它们不再是有效 RuntimeTokenName，setTokens 会拒绝未知名称，不提供无效果兼容映射。继续使用 blur、overlay-blur、opacity 三个外观 token 调整模糊与基材填充。

材质组织参考 [Luotopia · whu.sb](https://www.whu.sb/) 的模糊、半透明填充、方向高光与细边机制，由 Unitary UI 独立实现；不移植站点源码、素材或布局。

glass-appearance.tsx

```tsx
import { setTokens, resetTokens } from "@hustradio/unitary-ui";

const surface = document.querySelector<HTMLElement>(".my-glass-surface");
if (surface) {
  setTokens(
    {
      "--material-texture-glass-blur": "10px",
      "--material-texture-glass-overlay-blur": "20px",
      "--material-texture-glass-opacity": "56%",
    },
    { target: surface },
  );

  // Restore this surface's Clear, Regular or Dense preset.
  resetTokens(
    [
      "--material-texture-glass-blur",
      "--material-texture-glass-overlay-blur",
      "--material-texture-glass-opacity",
    ],
    { target: surface },
  );
}

// Ordinary content cards opt in explicitly; their sheen is static.
export function PreviewCard() {
  return (
    <div className="my-glass-surface material-medium material-glass-regular p-5">
      <h3>Project preview</h3>
      <p>Keep text and controls clear.</p>
    </div>
  );
}
```

集中表达状态、数量或类别的小型控件保留稳定的实色前景和语义色，必要时使用局部填充突出信息。文字或图标补足颜色表达，不要求整块玻璃化。

Acrylic、Aero 与 Glass 的功能性分隔线及控件已有边框，使用所在配色主文字色派生的中性透光线，与装饰高光独立；`--material-texture-line-opacity` 统一调节强度，默认浅色 18%、深色 22%。Solid 保持现有边线，自定义边框色保留。

## 表面

用于页面内的容器。用较轻的阴影区分层次，避免过度突出。

普通表面保持原样。显式组合 material-medium 与 material-glass-regular 可选择 Glass，保留现有圆角、尺寸和层级，仅增加静态材质高光。

显式选择的内容卡片

material-medium material-glass-regular

material-base

基础

日常使用。圆角 6px。

Class

material-base

Radius

6px

material-small

小

轻微抬升。圆角 6px。

Class

material-small

Radius

6px

material-medium

中型

进一步抬升。圆角 12px。

Class

material-medium

Radius

12px

material-large

大

进一步抬升。圆角 12px。

Class

material-large

Radius

12px

## 浮层

用于弹出面板。避免重复叠加材质，保留焦点指示和 ARIA 属性，并检查明暗主题下是否清晰。

material-tooltip

工具提示

最轻的阴影。圆角 6px。用于简短的上下文提示。

Class

material-tooltip

Radius

6px

material-menu

菜单

浮起于页面。圆角为 6px。

Class

material-menu

Radius

6px

material-modal

弹窗

Further lift. Radius 12px.

Class

material-modal

Radius

12px

material-fullscreen

全屏

最大抬升。圆角 16px。

Class

material-fullscreen

Radius

16px

## Mask · 背景弱化

Mask 将注意力移向前景，同时保留背景上下文。Solid 保留历史样式：Backdrop 随明暗主题选择遮罩色调，Scrim 暗化背景。Acrylic、Aero 与 Glass 则统一使用轻微的中性遮罩、背景模糊与适度降低饱和度，不再因弹窗或抽屉而大幅改变背景明暗。它们是视觉材质，不替代组件的关闭行为、焦点约束、ARIA 或背景不可交互语义，也不同于 SkeletonMask 加载占位。

背景内容

保持清晰的前景

Backdrop

material-mask

背景内容

保持清晰的前景

Scrim

material-mask-scrim

模糊仅采样背景，文字不参与模糊。遮罩使用带 alpha 的颜色合成，避免降低父容器整体透明度。不要在内部按钮、输入控件或嵌套功能层上重复添加模糊。

Acrylic、Aero 与 Glass 的遮罩颜色取所在配色的表面色与主文字色的中点，默认不透明度为 8%、背景模糊为 8px、饱和度为 85%。它轻微收敛极亮或极暗区域，不保证每个像素的亮度不变。 `--material-texture-mask-opacity` 与 `--material-texture-mask-saturation` 用于全局调整；旧名称 `--material-texture-mask-backdrop-opacity` 作为弃用兼容别名保留。这些数值是本项目的设计取舍，并非 Apple HIG 规定的参数。

mask-materials.tsx

```tsx
// Visual treatment only: the owning dialog still handles focus,
// dismissal, stacking and background interaction.
export function Mask() {
  return <div aria-hidden="true" className="material-mask fixed inset-0" />;
}

export function Scrim() {
  return <div aria-hidden="true" className="material-mask-scrim fixed inset-0" />;
}
```

## 兼容性与渲染成本

- 使用 CSS 背景模糊、颜色混合和渐变，无需实验开关；缺少所需能力时，全局回退为 Solid。
- 尊重强制颜色、减少透明度与减少动态效果偏好；减少透明度检测作为渐进增强，Solid 始终可手动选择。
- Acrylic / Aero 的功能层默认模糊不超过 20px、独立控件为 6px；Glass 的 Clear / Regular / Dense 分别为 8px / 10px / 20px，固定顶栏为 24px，hover 面板为 20px，遮罩为 8px。内部控件共享外层采样，指针更新按帧合并且空闲时停止。

[Apple HIG · Materials](https://developer.apple.com/design/human-interface-guidelines/materials) · [MDN · backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) · [MDN · prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency)
