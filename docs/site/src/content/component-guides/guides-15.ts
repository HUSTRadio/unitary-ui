import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_15_ZH: Record<string, ComponentGuide> = {
  toggle: {
    slug: "toggle",
    locale: "zh-CN",
    summary:
      "开启或关闭一个布尔设置，如密码保护。",
    whenToUse: [
      "需要一个单一的布尔值设定，且打开后立即生效的场景（如密码保护、自动取消构建）。",
      "与其他表单控件并列时，用 Toggle 表示单条设置的开/关，而不是使用 Checkbox（多选列表）或 Switch（2–3 个互斥视图）。",
    ],
    whenNotToUse: [
      "需要多选一个项目列表时，请使用 Checkbox；Toggle 只能表达单一的开/关状态。",
      "需要在两个或多个互斥视图之间切换时，请使用 Switch；Toggle 设计用于单一的布尔设定。",
    ],
    examples: [
      {
        id: "toggle-default",
        kind: "minimal",
        title: "默认样式",
        description: "展示 Toggle 的基础用法，包含 checked 和 onChange 回调。",
        demoKey: "default",
      },
      {
        id: "toggle-disabled",
        kind: "variant",
        title: "禁用状态",
        description: "当操作不可执行时将 Toggle 设为禁用，并通过辅助文本说明原因。",
        demoKey: "disabled",
      },
      {
        id: "toggle-sizes",
        kind: "variant",
        title: "尺寸变体",
        description: "展示不同尺寸的 Toggle，以适配不同的界面密度需求。",
        demoKey: "sizes",
      },
      {
        id: "toggle-with-label",
        kind: "advanced",
        title: "带标签的开关",
        description: "通过子节点传递标题式标签，并配合下方的描述性文字来解释开启时的含义。",
        demoKey: "with-label",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "通过子节点、aria-label 或 aria-labelledby 提供可访问的名称；本库实现不做运行时校验，三者全缺时不会发出警告，需调用方自行保证。",
        "当可见标签放置在别处时，才使用 aria-label；否则让子节点同时携带视觉和屏幕阅读器的标签。",
        "启用 prefers-reduced-motion 时，圆钮直接定位到新状态，不滑动或拉伸；动画期间启用该偏好也会取消当前动效。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "checked 在类型上可选；同时传入 checked 与 onChange 时由外部状态控制，也可使用继承的 defaultChecked 设置非受控初始状态。",
        '状态变更后应立即持久化并通过 toast 反馈结果（如"密码保护已启用"），避免用户不确定操作是否生效。',
        "受控与非受控用法中的开关状态变化均触发圆钮动效；快速反向切换会从当前可见位置与宽度继续，最后恢复目标位置的原有圆形。首次渲染直接显示初始状态。",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "Toggle 是一个小型布尔开关控件，其行为和布局在不同视口下保持一致，不涉及响应式断点或布局变化。",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Toggle 跟随主题色系统，开启状态的填充颜色随当前主题自动切换，确保在所有配色方案中保持足够的对比度。",
        "圆钮沿水平方向先拉宽再收回，保持高度；拉伸幅度不超过原宽的 25%，两端静止时保持原有尺寸。位移与宽度变化共同使用 --uni-motion-state（默认 250ms）和 --ease-snap 非线性曲线，轨道颜色仍按原有过渡变化。",
      ],
    },
  },
  tooltip: {
    slug: "tooltip",
    locale: "zh-CN",
    summary: "悬停或聚焦时显示简短的补充说明。",
    whenToUse: [
      "需要解释某事物的存在原因，而非事物本身是什么：可见标签命名该对象，工具提示补充限制条件、作用范围或数量上限。",
      "图标按钮等小触发器需要额外的语境说明时，通过 Tooltip 在不扩展 UI 的前提下提供解释。",
    ],
    whenNotToUse: [
      "不要将带有标签的 Input 包裹在 Tooltip 中——触发器落在 <label> 上，工具提示文本会成为屏幕阅读器的第二个不可见标签。应将帮助内容放在兄弟图标按钮上。",
      "不要在工具提示中包含主要操作；触屏用户无法触及悬停显示的控件。主要操作应在可见 UI 中。",
    ],
    examples: [
      {
        id: "tooltip-no-delay",
        kind: "minimal",
        title: "无延迟显示",
        description: "展示如何通过 delay={false} 去除默认 400ms 入场延迟，使 Tooltip 立即响应悬停。",
        demoKey: "No delay",
      },
      {
        id: "tooltip-box-align",
        kind: "variant",
        title: "对齐方式",
        description: "演示 Tooltip 相对于触发器的位置排列（Box align），确保提示在视口内完整可见。",
        demoKey: "Box align",
      },
      {
        id: "tooltip-custom-content",
        kind: "advanced",
        title: "自定义内容",
        description: "在 Tooltip 中渲染富文本或其他 React 组件，突破纯文本的限制。",
        demoKey: "Custom content",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Tooltip 在悬停和键盘焦点时打开；默认入场延迟为 400ms，可通过 delay={false} 取消或传入数字覆盖。",
        "Escape 键关闭 Tooltip 并将焦点返回到触发器；仅图标的触发器需配备命名操作的 aria-label。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Tooltip 由 hover 和 focus 触发，当前封装不暴露 open/onOpenChange；可通过 children 传入自定义触发元素。",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "Tooltip 的弹出位置和尺寸不依赖视口断点；它始终围绕触发器定位并在超出视口边界时自动翻转方向。",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Tooltip 的背景和文字颜色跟随全局主题，支持深色/浅色模式切换；高亮类型可通过 type prop 覆盖。",
      ],
    },
  },
  video: {
    slug: "video",
    locale: "zh-CN",
    summary: "嵌入视频，提供播放控件和延迟加载。",
    whenToUse: [
      "需要在页面中嵌入视频片段，并要求开箱即用的播放控制和懒加载性能优化。",
      "需要在营销页面、文档封面或产品演示页中展示视频内容，同时保持页面的视觉一致性。",
    ],
    whenNotToUse: [
      "如果需要对视频的播放逻辑进行完全定制化的控制，建议使用成熟的第三方播放器库（如 Video.js 或 Plyr）。",
      "对于仅需静态图片的场景，请使用 Image 组件而不是 Video——减少不必要的网络请求和资源消耗。",
    ],
    examples: [
      {
        id: "video-no-loop",
        kind: "minimal",
        title: "循环播放",
        description: "展示控制视频循环播放属性的用法，关闭 loop 后视频播完即停止。",
        demoKey: "No Loop",
      },
      {
        id: "video-no-controls",
        kind: "variant",
        title: "无边控播放",
        description: "隐藏内置播放控件，呈现沉浸式全屏观看体验，适合背景类视频。",
        demoKey: "No Controls",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Video 组件锁定内部视频的宽高比，防止容器在媒体加载时重新流动；这对屏幕阅读器用户和键盘导航用户同样重要。",
        "如需自动播放，请尊重 prefers-reduced-motion 偏好并提供暂停状态的视频海报作为回退。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Video 没有声明式 playing 或 currentTime props；内部控制层自行同步播放状态。",
        "通过 HTMLVideoElement ref 调用 play()、pause() 或设置 currentTime，可控制播放。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Video 会保持内部视频的固定宽高比，容器自适应父级宽度，确保在各种视口下不会发生布局偏移。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "controls={true} 时组件渲染自定义播放按钮、时间和进度条；控制层的背景、文字和阴影使用主题样式。",
      ],
    },
  },
};

export const GUIDES_15_EN: Record<string, ComponentGuide> = {
  toggle: {
    slug: "toggle",
    locale: "en-US",
    summary:
      "Turn a boolean setting, such as password protection, on or off.",
    whenToUse: [
      "For a single boolean setting where ON takes effect right away (e.g., password protection, auto-cancel builds). Use Toggle instead of Checkbox for multi-select lists, or Switch for 2–3 mutually exclusive views.",
      "When you need a clear on/off toggle for one independent setting presented alongside other form controls.",
    ],
    whenNotToUse: [
      "For selecting multiple items from a list; use Checkbox instead. Toggle only expresses a single on/off state.",
      "For switching between two or more mutually exclusive views; use Switch instead. Toggle is designed for a single boolean setting.",
    ],
    examples: [
      {
        id: "toggle-default",
        kind: "minimal",
        title: "Default style",
        description: "Showcases the basic Toggle usage with checked and onChange callback.",
        demoKey: "default",
      },
      {
        id: "toggle-disabled",
        kind: "variant",
        title: "Disabled state",
        description:
          "Disables the Toggle when the action is impossible and explains why via helper text.",
        demoKey: "disabled",
      },
      {
        id: "toggle-sizes",
        kind: "variant",
        title: "Size variants",
        description:
          "Demonstrates different sizes of Toggle to fit varying UI density requirements.",
        demoKey: "sizes",
      },
      {
        id: "toggle-with-label",
        kind: "advanced",
        title: "Toggle with label",
        description:
          "Passes a Title Case label through children and pairs it with descriptive copy explaining what being ON means.",
        demoKey: "with-label",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Provide an accessible name through children, aria-label, or aria-labelledby. This library's implementation performs no runtime validation—it does not warn when all three are missing, so callers must guarantee a name.",
        "Set aria-label only when the visible label sits elsewhere on the row; otherwise let children carry both visual and screen-reader labels.",
        "With prefers-reduced-motion enabled, the thumb moves directly to the new state without sliding or stretching. Enabling the preference during an animation also cancels that motion.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "checked is optional in the type. Pass checked with onChange for caller-controlled state, or use the inherited defaultChecked for an uncontrolled initial state.",
        "Persist on change and surface the result in a useToasts().success(…) toast (Password protection enabled); don't leave the user wondering whether the flip stuck.",
        "Both controlled and uncontrolled changes animate the thumb. Rapid reversals continue from its current visible position and width, ending in the original circle at the target position. Initial rendering shows the initial state immediately.",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "Toggle is a small boolean switch whose behavior and layout remain consistent across viewports; it does not depend on responsive breakpoints or layout changes.",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Toggle follows the theme color system; the filled-on state color switches automatically with the current theme, ensuring sufficient contrast in all palette schemes.",
        "The thumb widens horizontally before contracting while retaining its height, with stretch limited to 25% of its original width and the original size at rest. Position and width share --uni-motion-state (250ms by default) and the nonlinear --ease-snap curve; the track color retains its existing transition.",
      ],
    },
  },
  tooltip: {
    slug: "tooltip",
    locale: "en-US",
    summary:
      "Show a short explanation on hover or focus.",
    whenToUse: [
      "To explain why something exists, not what it is: the visible label names the thing; the tooltip adds the constraint, scope, or limit.",
      "When icon-only triggers or compact UI elements need extra context without expanding the visible interface.",
    ],
    whenNotToUse: [
      "Don't wrap a labelled Input in a Tooltip. The trigger lands on the <label>, making the tooltip text a second invisible label for screen readers. Put help on a sibling icon button instead.",
      "Don't put primary actions inside the Tooltip; touch users can't reach a hover-revealed control. Keep actions in the visible UI.",
    ],
    examples: [
      {
        id: "tooltip-no-delay",
        kind: "minimal",
        title: "No delay",
        description:
          "Demonstrates setting delay={false} to remove the default 400ms entry delay so the Tooltip responds instantly.",
        demoKey: "No delay",
      },
      {
        id: "tooltip-box-align",
        kind: "variant",
        title: "Alignment",
        description:
          "Shows how to arrange the Tooltip relative to its trigger (box align) and keeps it within viewport bounds.",
        demoKey: "Box align",
      },
      {
        id: "tooltip-custom-content",
        kind: "advanced",
        title: "Custom content",
        description:
          "Renders rich text or other React components inside the Tooltip, going beyond plain text.",
        demoKey: "Custom content",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Tooltips open on hover and keyboard focus. The default entry delay is 400ms; set delay={false} for none or pass a number to override it.",
        "Escape closes the tooltip and returns focus to the trigger; icon-only triggers need an aria-label that names the action.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Tooltip opens from hover and focus and does not expose open/onOpenChange in this wrapper; pass a custom trigger through children when needed.",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "The Tooltip's popout position and size do not depend on viewport breakpoints; it always anchors to its trigger and flips direction automatically when exceeding viewport bounds.",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Tooltip background and text color follow the global theme, supporting light/dark mode; highlight type can be overridden via the type prop.",
      ],
    },
  },
  video: {
    slug: "video",
    locale: "en-US",
    summary: "Embed video with playback controls and lazy loading.",
    whenToUse: [
      "When embedding video clips on pages with out-of-the-box playback controls and lazy-loading performance optimization.",
      "When displaying video content on marketing pages, documentation covers, or product demos while keeping visual consistency.",
    ],
    whenNotToUse: [
      "When you need full customization of video playback logic; consider dedicated third-party player libraries like Video.js or Plyr instead.",
      "For static image scenarios; use Image instead of Video to avoid unnecessary network requests and resource consumption.",
    ],
    examples: [
      {
        id: "video-no-loop",
        kind: "minimal",
        title: "No loop",
        description:
          "Demonstrates controlling the video loop attribute; the video stops when playback ends.",
        demoKey: "No Loop",
      },
      {
        id: "video-no-controls",
        kind: "variant",
        title: "No controls",
        description:
          "Hides built-in playback controls for an immersive viewing experience, suitable for background videos.",
        demoKey: "No Controls",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Video locks the inner aspect ratio so the container doesn't reflow while media loads; this matters equally for screen reader users and keyboard navigation.",
        "For autoplay, respect prefers-reduced-motion and provide a paused poster fallback.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Video has no declarative playing or currentTime props; its custom controls synchronize playback state internally.",
        "Use the HTMLVideoElement ref to call play(), pause(), or set currentTime.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Video maintains a fixed aspect ratio on the inner media; the container adapts to parent width, preventing layout shift across viewports.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "With controls={true}, Video renders custom play, time, and progress controls whose background, text, and shadow use theme styles.",
      ],
    },
  },
};
