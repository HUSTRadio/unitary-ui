# 材质

> Route: `/materials`

# 材质

圆角、填充、描边与阴影的预设。

Surface 用于页面内的容器，Floating 用于浮层。材质预设定义圆角、背景、边框和阴影；显示顺序由层级变量单独控制。

## Texture · 全局材质外观

材质用来表达功能层与内容之间的关系。借鉴 Apple HIG 对层级、上下文和可读性的重视，保持中性、温和的透光与边缘反射；正文、表格和表单内容保持清晰。

- Solid 是默认值，保留现有填充、描边、阴影及少量既有遮罩模糊。
- Acrylic 在导航、浮层和遮罩增加轻微背景散射，内部控件保持平面。
- Aero 保留原 Glass 的背景散射、方向性照明和厚度吸收近似，用于功能层、次要按钮与卡片式 Radio。
- Glass 使用均匀基材，沿轮廓的结构变化产生背景折射、反射及环境光响应；控件保留清晰的按下、选中和焦点反馈。

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

Clear · 24% / 36%

00:42

媒体上的短标签；独立的均匀 70% 衬底。

Regular · 52% / 68%

导航、工具栏和独立次要操作。

Dense · 82% / 90%

最近的文件

- 项目进展报告
- 下一次评审的备注

菜单、列表、抽屉和文字浮层。

Glass 按用途提供 material-glass-clear、material-glass-regular 和 material-glass-dense 三个 className 预设，应用到实际材质表面。导航、Toolbar 和独立次要操作默认 Regular；菜单、选择列表、抽屉及对话框类浮层默认 Dense。Clear 仅显式用于媒体上的少量图标或短标签，由场景提供独立衬底并实测对比度。三档共享 1px 模糊，填充为 Clear 24% / 36%、Regular 52% / 68%、Dense 82% / 90%；折射参数分别为 6px / 6px / 3px，边带上限 8px / 10px / 8px，粗糙度 0.18 / 0.24 / 0.32。正文和普通内容卡片保持 Solid 或 Acrylic。

根 token 是 Regular 基准，Clear / Dense 采用局部预设；同一表面上的作者 token 优先。setTokens(values, { target: surface }) 修改当前表面，resetTokens(names, { target: surface }) 恢复该档；显式 Regular 恢复根基准。Portal 必须在实际浮层上应用 className，不继承触发器预设。Select.className 只作用于触发器，选择列表本轮采用自动 Dense。

增强对比度 prefers-contrast: more 使用 92% / 96% 填充和 Dense 光学参数，中性轮廓使用前景色 65% 混合；系统设置变化会同步 SVG 与 CSS。它只改变私有有效参数，公共 token 保留作者请求值。减少透明度和强制颜色优先回退 Solid。普通文字至少 4.5:1，大文字及必要控件标识至少 3:1，以实际合成背景验证。

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

Acrylic 采用 8px 背景散射与 80% 填充；Aero 保留原 Glass 的 20px 散射、浅色 60% 和深色 74% 填充。新 Glass 默认 1px 模糊，Regular 基础填充浅色 52%、深色 68%，文字浮层自动采用 Dense 的 82% / 90%；基材填充、模糊、粗糙度与吸收系数全表面一致，视觉差异来自结构改变后的光学响应。浮层次级文字适度增强对比度，正文和内部控件保持清晰。相关 --material-texture-\* token 可统一调整。连续曲率阴影容器形成背景采样边界时，内部表面使用不透明填充，保持裁切与阴影完整。

功能层按用途选择材质厚度。Acrylic、Aero 与 Glass 使用柔和投影和透光细边；导航栏与工具栏只保留描边。带箭头的默认 Tooltip 与 ContextCard 使用稳定的不透明表面，避免箭头接缝；默认 Tooltip 关闭箭头后可以透光。状态色 Tooltip、Toast 和反色图表提示保持不透明填充，保护原有对比度。

Aero 保留原次要按钮和卡片 Radio 的 72% / 80% 填充、6px 模糊及静态光学效果。新 Glass 移除指针追光、人工亮边和凝胶压缩；次要操作、Tabs、Toolbar、Toggle 和 Switch 使用既有状态反馈。状态色、文字、点击区域和焦点环保持稳定，内部控件共享外层的背景采样。

Glass 使用均匀基材，根据实际轮廓和连续倒角法线，按 Snell 折射方向向内采样，限制位移变化率以避免纹理折叠，并在中心归零。非偏振 Fresnel 决定视角相关的环境反射，GGX / Smith 高光只依赖法线、光向与统一粗糙度；默认模糊 1px，基础填充全表面一致，内部控件共享外层采样。材质本体没有位置渐变，不使用空间可变模糊或额外边缘亮度蒙版。同一背景滤镜仅做一次模糊和位移，CSS 圆角完成唯一的轮廓裁切。透射与反射在线性光空间按能量权重混合，Beer–Lambert T = exp(−μd) 使用统一吸收系数和实际折射光程，不附加边缘权重。Regular 默认 IOR 1.5、粗糙度 0.24、厚度 1、吸收 0.08，主光 315° / 0.65，环境光 0.25 / currentColor。setTokens 和 resetTokens 可局部调整环境色与参数。环境光是屏幕空间近似，不自动读取场景环境贴图。

Regular 折射强度默认 6px，结构倒角区最大 10px，受短边 20% 和最小圆角共同约束；位移由变化率限制决定。尖角、退化轮廓和解码后采样折叠使用均匀的 CSS Glass 回退。refraction 设为 0px 可关闭增强。桌面 Chromium 151+ 在能力与贴图解码检查通过后增强；其他浏览器、仅 CSS 使用、受限 CSP、异常轮廓和背景采样边界保留 CSS Glass。减少透明度和强制颜色使用 Solid；状态过渡继续遵循各组件的减少动效策略，Glass 不附加追光或形变。

相同几何和光学参数的表面共享构建结果，增强准备过程中保留 CSS Glass。动态移除材质 class 或改变材质身份时，会取消旧结果并释放资源；Portal 卸载、StrictMode 重挂载和多个根 Provider 共享页面时，不需要手动维护 SVG 定义。

迁移：原 Hybrid 改名 Acrylic（hybrid → acrylic），原 Glass 改名 Aero（glass → aero）。旧存储自动迁移到 unitary-texture-preference-v2；有效新值优先。程序中 texture=glass 现在选择新 Glass，保持旧外观请改用 aero，并将旧 glass token 前缀改为 aero。旧 hybrid token 前缀改为 acrylic。

环境光、几何高光与可读性参考 [Apple · Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)；上述公式与参数由 Unitary UI 自行选择，并非 HIG 规定。

glass-lighting.tsx

```tsx
import { setTokens, resetTokens } from "@hustradio/unitary-ui";

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
// resetTokens(["--material-texture-glass-ambient-color"], { target: surface });
```

集中表达状态、数量或类别的小型控件保留稳定的实色前景和语义色，必要时使用局部填充突出信息。文字或图标补足颜色表达，不要求整块玻璃化。

Acrylic、Aero 与 Glass 的功能性分隔线及控件已有边框，使用所在配色主文字色派生的中性透光线，与装饰高光独立；`--material-texture-line-opacity` 统一调节强度，默认浅色 18%、深色 22%。Solid 保持现有边线，自定义边框色保留。

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
- 功能层默认模糊不超过 20px，遮罩为 8px，独立次要按钮和卡片选项为 6px；新 Glass 为 1px；贴图仅在几何或参数改变时重建，指针更新按帧合并且空闲时停止，避免重复采样。

[Apple HIG · Materials](https://developer.apple.com/design/human-interface-guidelines/materials) · [MDN · backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) · [MDN · prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency)
