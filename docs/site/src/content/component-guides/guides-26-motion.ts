import type { ComponentGuide } from "../component-guide-schema";

function motionGuide(zh: boolean): ComponentGuide {
  return {
    slug: "motion", locale: zh ? "zh-CN" : "en-US",
    summary: zh ? "用 MotionProvider、motion 与 AnimatePresence 为局部内容添加动画，时序来自现有 token。" : "Animate local content with MotionProvider, motion and AnimatePresence, using existing timing tokens.",
    whenToUse: [zh ? "需要可组合的 React 状态动画，并希望沿用组件库时序和减弱动效策略。" : "Compose React state animations with library timing and reduced-motion policy."],
    whenNotToUse: [zh ? "简单颜色反馈继续使用 CSS；不要为添加动效替换现有浮层的焦点和卸载逻辑。" : "Keep simple color feedback in CSS; preserve existing overlay focus and unmount behavior."],
    examples: [{ id: "default", kind: "stateful", title: zh ? "状态切换" : "State changes", description: zh ? "切换局部内容，使用 state 档位与 AnimatePresence 处理退场。" : "Toggle local content with the state tier and AnimatePresence exit animation.", demoKey: "default" }],
    accessibility: { status: "covered", content: [zh ? "reducedMotion=\"user\" 跟随系统偏好；\"always\" 始终关闭动效。useMotionTransition 在减弱动效、无效 token 或线性曲线下返回即时过渡。" : "reducedMotion=\"user\" follows system preferences; \"always\" disables motion. useMotionTransition returns instant transitions for reduced motion, invalid tokens or linear curves.", zh ? "动画不替代内容语义、键盘操作和焦点管理。" : "Animations do not replace content semantics, keyboard operation or focus management."] },
    controlledBehavior: { status: "covered", content: [zh ? "调用方管理业务状态；useMotionTransition 接受 feedback、state、overlay、expansive 四档及可选 TokenOptions.target。四档默认 150 / 250 / 350 / 500ms，均读取 --ease-snap。" : "The caller owns application state; useMotionTransition accepts feedback, state, overlay and expansive tiers plus an optional TokenOptions.target. The four defaults are 150 / 250 / 350 / 500ms, all reading --ease-snap."] },
    responsiveBehavior: { status: "not-applicable", reason: zh ? "不自动改变断点或布局；移动端布局仍由内容组件控制。" : "Breakpoints and layout remain controlled by the content components." },
    themeBehavior: { status: "covered", content: [zh ? "读取目标元素当前级联 token，响应局部覆盖与主题变化；服务器不读取 DOM。--ease-snap 默认 cubic-bezier(0.22, 1, 0.36, 1)，可局部覆盖为有效的非线性曲线；该参数是本项目选择，不是 Apple 官方值或弹簧配置。" : "Reads the target element's cascaded tokens and responds to local overrides and theme changes; the server does not read the DOM. --ease-snap defaults to cubic-bezier(0.22, 1, 0.36, 1) and accepts valid scoped nonlinear curves; these are project-selected values, not official Apple parameters or spring settings."] },
  };
}

function hituGuide(zh: boolean): ComponentGuide {
  return {
    slug: "hitu-player", locale: zh ? "zh-CN" : "en-US",
    summary: zh ? "通过 HituPlayer 播放 SVG 形状的关键帧动画，并组合到 EmptyState 等现有内容中。" : "Play keyframed SVG shapes with HituPlayer and compose them into content such as EmptyState.",
    whenToUse: [zh ? "空状态、引导或介绍页需要有明确尺寸和播放控制的插画。" : "Use illustrations with explicit dimensions and playback controls in empty states, onboarding or introduction pages."],
    whenNotToUse: [zh ? "常规图标和表单反馈使用现有组件；播放器不提供编辑器、文本或 chips 图层。" : "Use existing components for ordinary icons and form feedback; the player does not provide an editor, text or chip layers."],
    examples: [{ id: "default", kind: "stateful", title: zh ? "插画与播放控制" : "Illustration and playback controls", description: zh ? "HituBox 与 HituFile 共用帧时间线，提供播放、暂停、重播和循环开关。" : "HituBox and HituFile share a frame timeline with play, pause, replay and loop controls.", demoKey: "default" }],
    accessibility: { status: "covered", content: [zh ? "默认作为装饰 SVG；有意义的插画通过 aria-label 命名，说明和按钮保留在 SVG 外。" : "The SVG is decorative by default; name meaningful illustrations with aria-label and keep explanations and buttons outside the SVG.", zh ? "减弱动效偏好会阻止播放并恢复初始帧；离屏和页面隐藏时暂停。" : "Reduced-motion preferences prevent playback and restore the initial frame; playback pauses offscreen and while the page is hidden."] },
    controlledBehavior: { status: "covered", content: [zh ? "defaultPlay 与 defaultFrame 设置初值；ref.triggerMotion、setFrame 和 getFramerInfo 控制及读取实际状态，onPlay / onFrame 回报变化。" : "defaultPlay and defaultFrame set initial state; ref.triggerMotion, setFrame and getFramerInfo control and inspect actual state, with onPlay / onFrame reporting changes.", zh ? "HituFrame.cubic 作用于从该帧出发的片段；缺省、非法或恒等线性四元组使用 [0.42, 0, 0.58, 1] 平滑起止。有效的显式非线性曲线保留，稀疏变换继承前值，首末帧准确到达目标。" : "HituFrame.cubic applies to the segment starting at that frame; missing, invalid or identity-linear tuples use [0.42, 0, 0.58, 1] for a smooth start and finish. Valid explicit nonlinear curves remain supported, sparse transforms inherit prior values, and endpoints reach their targets exactly.", zh ? "示例中 Motion 控制外围容器，Hitu 控制 SVG 内部图层；两者分别负责自己的节点。" : "In the example, Motion animates the outer container and Hitu animates the internal SVG layers, with each engine owning its own nodes."] },
    responsiveBehavior: { status: "covered", content: [zh ? "width / height 定义 SVG 坐标系；使用 CSS 在容器内等比缩放，避免改变图层坐标。" : "width / height define SVG coordinates; scale proportionally with CSS inside the container without changing layer coordinates."] },
    themeBehavior: { status: "covered", content: [zh ? "内置 HituBox / HituFile 使用组件库色彩 token；自定义形状的配色由调用方定义。" : "Built-in HituBox / HituFile use library color tokens; the caller defines colors for custom shapes."] },
  };
}

export const MOTION_GUIDES_ZH = { motion: motionGuide(true), "hitu-player": hituGuide(true) };
export const MOTION_GUIDES_EN = { motion: motionGuide(false), "hitu-player": hituGuide(false) };
