# 材质

> Route: `/materials`

# 材质

圆角、填充、描边与阴影的预设。

Surface 用于页面内的容器，Floating 用于浮层。材质预设定义圆角、背景、边框和阴影；显示顺序由层级变量单独控制。

## Texture · 全局材质外观

材质用来表达功能层与内容之间的关系。借鉴 Apple HIG 对层级、上下文和可读性的重视，保持中性、温和的透光与边缘反射；正文、表格和表单内容保持清晰。

- Solid 是默认值，保留现有填充、描边、阴影及少量既有遮罩模糊。
- Hybrid 在导航、浮层和遮罩增加轻微背景散射，内部控件保持平面。
- Glass 增加薄层透光、静态高光与微弱边缘反射。首版不使用真实折射、色散或随指针移动的炫光。

全局材质外观

SolidHybridGlass

选择：Solid · 实际外观：Solid

这里的切换作用于整个文档界面、Portal 浮层和 SubFrame 内容。材质独立于明暗主题、UI 配色与代码主题；局部配色作用域继续有效，组件不提供局部材质主题开关。

清晰的工作空间

背景表达层次，文字和控件保持清晰。打开浮层，观察全局材质切换。

Photograph by [mirobo](https://commons.wikimedia.org/wiki/File:View_of_lake_in_forest.jpg) · Alpsee · [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)

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
        <RadioGroupItem value="hybrid">Hybrid</RadioGroupItem>
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

Hybrid 采用 8px 背景散射与 80% 填充；Glass 采用 20px 散射，浅色填充 60%，深色填充 74%。浮层次级文字适度增强对比度，正文和内部控件保持清晰。相关 --material-texture-\* token 可统一调整。连续曲率阴影容器形成背景采样边界时，内部表面使用不透明填充，保持裁切与阴影完整。

功能层按用途选择材质厚度。Hybrid 与 Glass 使用柔和投影和透光细边；导航栏与工具栏只保留描边。带箭头的默认 Tooltip 与 ContextCard 使用稳定的不透明表面，避免箭头接缝；默认 Tooltip 关闭箭头后可以透光。状态色 Tooltip、Toast 和反色图表提示保持不透明填充，保护原有对比度。

## 表面

用于页面内的容器。用较轻的阴影区分层次，避免过度突出。

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

Mask 将注意力移向前景，同时保留背景上下文。Backdrop 洗淡背景；Scrim 暗化背景。它们是视觉材质，不替代组件的关闭行为、焦点约束、ARIA 或背景不可交互语义，也不同于 SkeletonMask 加载占位。

背景内容

保持清晰的前景

Backdrop · 洗淡

material-mask

背景内容

保持清晰的前景

Scrim · 暗化

material-mask-scrim

模糊仅采样背景，文字不参与模糊。遮罩使用带 alpha 的颜色合成，避免降低父容器整体透明度。不要在内部按钮、输入控件或嵌套功能层上重复添加模糊。

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
- 功能层默认模糊不超过 20px，遮罩为 8px；采用静态效果，避免逐帧计算、重复采样和模糊动画，保持内容与交互清晰。

[Apple HIG · Materials](https://developer.apple.com/design/human-interface-guidelines/materials) · [MDN · backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) · [MDN · prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency)
