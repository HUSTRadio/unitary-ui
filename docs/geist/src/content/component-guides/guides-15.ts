import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_15_ZH: Record<string, ComponentGuide> = {
  toggle: {
    slug: "toggle",
    locale: "zh-CN",
    summary:
      "用于单一布尔值的即时开启/关闭设置。点击即生效，适用于像密码保护或自动取消构建这类开关。",
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
        "通过子节点、aria-label 或 aria-labelledby 提供可访问的名称；Geist 在开发环境中会在三者全部缺失时发出警告。",
        "当可见标签放置在别处时，才使用 aria-label；否则让子节点同时携带视觉和屏幕阅读器的标签。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "checked 是必填属性，组件受控。需在外部管理状态并通过 onChange 回调进行更新。",
        '状态变更后应立即持久化并通过 toast 反馈结果（如"密码保护已启用"），避免用户不确定操作是否生效。',
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
      ],
    },
  },
  tooltip: {
    slug: "tooltip",
    locale: "zh-CN",
    summary: "悬浮或聚焦时出现的浮动提示标签，为元素添加额外上下文信息而不占用空间。",
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
        description: "展示如何通过 prop 去除 ~150ms 的入场延迟，使 Tooltip 立即响应悬停。",
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
        "Tooltip 在悬停和键盘焦点时打开，保留默认的 ~150ms 入场延迟以防止鼠标扫过时的闪烁。",
        "Escape 键关闭 Tooltip 并将焦点返回到触发器；仅图标的触发器需配备命名操作的 aria-label。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Tooltip 支持受控模式：通过 open state 和 onChange 精确控制显示与隐藏时机。",
        "可以通过传入自定义触发元素来自定义 Tooltip 的挂载内容和交互行为。",
      ],
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
    summary: "嵌入带内置播放控制和懒加载支持的媒体视频播放器。",
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
      status: "not-applicable",
      reason:
        "Video 是一个展示型组件，主要负责嵌入和渲染视频内容，不提供 play/pause/seek 等受控 API 接口。完整的媒体控制应由第三方播放器库实现。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Video 会保持内部视频的固定宽高比，容器自适应父级宽度，确保在各种视口下不会发生布局偏移。",
      ],
    },
    themeBehavior: {
      status: "not-applicable",
      reason:
        "Video 组件渲染的是 HTML 原生 video 元素及其操作系统/浏览器的默认控件，不直接参与应用的主题配色系统。",
    },
  },
};

export const GUIDES_15_EN: Record<string, ComponentGuide> = {
  toggle: {
    slug: "toggle",
    locale: "en-US",
    summary:
      "A switch for a single boolean setting where ON takes effect immediately, like Password Protection or Auto-Cancel Builds.",
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
        "Provide an accessible name through children, aria-label, or aria-labelledby. Geist warns in development if all three are missing.",
        "Set aria-label only when the visible label sits elsewhere on the row; otherwise let children carry both visual and screen-reader labels.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "checked is required and the component is controlled. Own the state and update it from onChange.",
        "Persist on change and surface the result in a useToasts().success(…) toast (Password protection enabled); don't leave the user wondering whether the flip stuck.",
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
      ],
    },
  },
  tooltip: {
    slug: "tooltip",
    locale: "en-US",
    summary:
      "A floating label that appears on hover or focus, adding contextual detail without taking up permanent space.",
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
          "Demonstrates removing the ~150ms entry delay so the Tooltip responds to hover instantly.",
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
        "Tooltips open on hover and on keyboard focus. Keep the default ~150ms entry delay so the tooltip doesn't flicker on a sweeping mouse.",
        "Escape closes the tooltip and returns focus to the trigger; icon-only triggers need an aria-label that names the action.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Tooltip supports controlled mode: manage show/hide timing precisely through open state and onChange.",
        "You can pass a custom trigger element to customize the mount point and interaction behavior of the Tooltip.",
      ],
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
    summary: "Embeds a video with built-in playback controls and lazy loading support.",
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
      status: "not-applicable",
      reason:
        "Video is a presentational component focused on embedding and rendering video content; it does not expose play/pause/seek controlled APIs. Full media control should be implemented by a dedicated player library.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Video maintains a fixed aspect ratio on the inner media; the container adapts to parent width, preventing layout shift across viewports.",
      ],
    },
    themeBehavior: {
      status: "not-applicable",
      reason:
        "Video renders the native HTML video element with OS/browser default controls; it does not directly participate in the application's theme color system.",
    },
  },
};
