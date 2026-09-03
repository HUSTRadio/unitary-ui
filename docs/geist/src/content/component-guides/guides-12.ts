import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_12_ZH: Record<string, ComponentGuide> = {
  "show-more": {
    slug: "show-more",
    locale: "zh-CN",
    summary: "通过渐进式披露触发器展示展开或收起的内容。",
    whenToUse: [
      "对单个长列表或内容块进行渐进式披露，如最近活动、仓库分支、附件资源等。",
      "需要在截断前展示足够多的行数以传达列表形状（通常 5–10 行），让用户了解完整列表的全貌。",
      "组件文案固定为“显示更多”/“显示更少”；如需提示隐藏项数量，应在相邻内容中由调用方展示。",
    ],
    whenNotToUse: [
      "同一数据集的平行分页应使用 Pagination 而非 ShowMore；可选区块应使用 Collapse。",
      "不要在截断仅 2 行的数据时使用——这会让人感到敷衍。至少展示 5 行再截断。",
      "不要在同一数据集中先展开又立即折叠——折叠已展开的行会让阅读位置丢失。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认状态",
        description: "展示 ShowMore 默认的收起外观和触发按钮。",
        demoKey: "Default",
      },
      {
        id: "expanded",
        kind: "variant",
        title: "展开状态",
        description: "展示点击后的完全展开效果，触发按钮切换为“显示更少”。",
        demoKey: "Expanded",
      },
      {
        id: "no-border",
        kind: "variant",
        title: "无边框变体",
        description: "展示去掉边框装饰的简洁样式，适用于需要融入页面的场景。",
        demoKey: "No border",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "触发按钮必须使用 <button> 元素并设置 aria-expanded，配合 aria-controls 指向目标列表区域。",
        "组件提供原生 button 和 aria-expanded；调用方应通过 aria-controls 将它关联到被展开的内容区域。",
        "组件不会移动焦点或创建 live region；如果新增内容必须被主动播报，应由调用方在内容区域实现。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "expanded 决定按钮文案、箭头方向和 aria-expanded；onClick 等原生按钮事件由调用方更新外部状态。",
        "组件只渲染触发器，不管理目标内容、展开动画或焦点位置。",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "ShowMore 只渲染固定 32px 高的触发按钮，不管理目标行的布局或断点行为；目标内容的响应式布局由调用方负责。",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "按钮颜色、悬停态和高亮跟随 Geist 主题变量，暗色/亮色模式下自动适配。",
        "noBorder 只移除默认边框；没有专用的边框色或背景色 prop，额外视觉调整通过 className 完成。",
      ],
    },
  },
  skeleton: {
    slug: "skeleton",
    locale: "zh-CN",
    summary: "在内容加载期间显示占位符骨架屏。",
    whenToUse: [
      "当异步数据填充已知布局（表格行、卡片网格、个人资料模块、侧边栏）时，展示 Skeleton 作为加载占位符。",
      "需要维持最终内容的宽高尺寸以避免布局抖动（CLS），骨架屏能精确匹配实际元素的形状和大小。",
      "批量加载多个资源时，用一组骨架屏模拟真实布局，帮助用户感知系统正在处理。",
    ],
    whenNotToUse: [
      "单个正在进行的操作应使用 Spinner，有明确进度时使用 Progress，不要用 Skeleton 替代这些组件。",
      "不需要在静态页面或无数据的页面上使用——Skeleton 仅在有后续内容要加载时有意义。",
      "不要将骨架屏用于非结构化的随机内容——它的价值在于预知布局的形状，否则会产生误导。",
    ],
    examples: [
      {
        id: "set-width",
        kind: "minimal",
        title: "固定宽度",
        description: "展示带有预设宽度的 Skeleton，模拟一行文本占位。",
        demoKey: "Default with set width",
      },
      {
        id: "box-height",
        kind: "variant",
        title: "盒状高度",
        description: "展示带有固定高度的骨架区块，模拟图像或卡片容器。",
        demoKey: "Default with box height",
      },
      {
        id: "wrapping-children",
        kind: "advanced",
        title: "包裹子元素",
        description: "展示 Skeleton 内部包裹实际内容的用法，实现嵌套骨架效果。",
        demoKey: "Wrapping children",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        '将加载区域包裹在 aria-busy="true" 中，并在数据就绪后用 aria-live="polite" 通知完成状态。',
        "骨架屏本身是装饰性的，不应被屏幕阅读器逐条朗读——由底层内容提供真正的语义信息。",
        "对于低功率设备，应尊重 prefers-reduced-motion，减少或禁用脉冲动画。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Skeleton 是无交互的纯展示组件，没有状态转换或受控属性；它仅在数据加载中由父组件决定是否渲染。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "通过 width、height、className 或 style 让单个 Skeleton 匹配最终内容尺寸。",
        "Skeleton 不管理列表或网格布局；多列到单列的响应式切换由调用方容器负责。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "骨架屏的背景色和脉冲动画跟随主题变量，在暗色/亮色模式下均有合适的对比度。",
        "可通过 CSS 变量覆盖骨架颜色，实现品牌定制或特殊场景下的差异化表现。",
      ],
    },
  },
  slider: {
    slug: "slider",
    locale: "zh-CN",
    summary: "一个从给定范围中选择值的输入控件。",
    whenToUse: [
      "用于需要对数值范围敏感的输入场景：带宽上限、透明度、音频音量、颜色通道等形状和距离比精度更重要的情况。",
      "需要将滑块与数字输入框配对使用，供键盘用户在精确值（端口号、内存限制）间进行选择。",
      "设定合理的步长（1、5、10%），避免拖拽产生不精确的值（如 47.83291），同时上下限钳制到真实的产品极限。",
    ],
    whenNotToUse: [
      "需要精确选择具体值的地方不要使用滑块——改用 Select、Input 或 Combobox。",
      "选项少于 4 个的单选场景直接用 Radio Group 更清晰，不要强行用滑块代替。",
      "不适合在移动端单独作为唯一的输入方式——触屏拖拽精度有限，应提供数值回退。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认滑块",
        description: "展示默认样式的 Range Slider，包含轨道和手柄。",
        demoKey: "default",
      },
      {
        id: "step-max",
        kind: "variant",
        title: "步长与最大值",
        description: "展示自定义步长和大小的 Range Slider。",
        demoKey: "step-max",
      },
      {
        id: "with-label",
        kind: "stateful",
        title: "带标签",
        description: "展示通过 label prop 在轨道上方提供可见且可访问名称的 Range Slider。",
        demoKey: "with-label",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "通过兄弟 <label htmlFor> 或 aria-label 给滑块提供无障碍名称，原生箭头键、Page Up/Down、Home/End 行为负责键盘操作。",
        "需要精确值时显式启用 showStartInput / showEndInput，或由调用方在相邻区域渲染带单位的数值。",
        "禁用态的滑块仍需 tooltip 命名原因，以免用户困惑为什么无法调节。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Slider 接受 value/defaultValue；轨道拖动结束时使用 onValueCommit，onValueChange 当前只由可选数值输入路径调用。",
        "禁用手柄会阻止任何键盘和鼠标输入，适合需要临时锁定设置的场景。",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "轨道使用容器宽度，但组件不按断点缩放标签或保证 44px 触控目标；移动布局和额外命中区域由调用方验证。",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "滑块轨道颜色、激活态背景和手柄样式跟随主题变量，暗色/亮色模式下各有对应配色。",
        "组件没有专用颜色 prop；品牌化需要在外层样式系统中覆盖相应类或令牌。",
      ],
    },
  },
  snippet: {
    slug: "snippet",
    locale: "zh-CN",
    summary: "展示可供复制运行的 shell 命令或简短代码。",
    whenToUse: [
      "为用户希望一键复制的运行型 shell 命令使用 Snippet，它自带提示符字符和复制辅助功能。",
      "内联令牌（环境变量名、路径）应使用 InlineCode，多行源代码应使用 CodeBlock；单行短命令则使用 Snippet。",
      "搭配 CopyButton 使用户无需手动选中即可获取命令，提升用户体验。",
    ],
    whenNotToUse: [
      "每个 Snippet 只放一条命令——更长的脚本应切换到 CodeBlock，让用户先阅读再复制。",
      "不要把 Snippet 用作文档中的伪代码或伪语法示例——它应该呈现真实的、可粘贴执行的命令。",
      "不要在一个 Snippet 中组合多条命令——每条命令独立为一个 Snippet，避免复制混乱。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认片段",
        description: "展示默认的 Snippet 外观，包含提示符字符和复制按钮。",
        demoKey: "Default",
      },
      {
        id: "inverted",
        kind: "variant",
        title: "反色变体",
        description: "展示深色背景的反色变体，适用于暗色主题的代码展示场景。",
        demoKey: "Inverted",
      },
      {
        id: "variants",
        kind: "advanced",
        title: "全部变体",
        description: "展示 Snippet 的所有变体和样式配置选项。",
        demoKey: "Variants",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "复制按钮必须是 icon-only 按钮且带有明确的 aria-label，以便屏幕阅读器朗读操作意图（如“复制部署 URL”）。",
        "Snippets 的文本内容应在复制成功后通过视觉反馈（勾选图标）确认，持续约 1.5 秒后重置。",
        "优先使用 navigator.clipboard.writeText 并提供隐藏的 textarea execCommand 降级方案。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "支持受控的已复制状态（copied），开发者可以编程式控制复制反馈的显示和隐藏。",
        "回调函数允许在复制动作发生时执行额外的业务逻辑。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Snippet 在窄屏上自动调整内边距和字号，确保命令文本不会被过度压缩。",
        "复制按钮在全屏幕上保持一致的可见性和点击区域大小。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Snippet 的背景色、边框和文字颜色跟随主题变量，在暗色/亮色模式下各有对应的配色方案。",
        "反色（inverted）变体专门针对暗色背景优化，确保对比度符合 WCAG 标准。",
      ],
    },
  },
  spinner: {
    slug: "spinner",
    locale: "zh-CN",
    summary: "表示正在进行的操作。",
    whenToUse: [
      "对没有明确进度信息的单次进行中操作使用 Spinner，此时无法提供确定的百分比或时长。",
      "在按钮上使用 loading 状态而非替换为 Spinner，这样忙碌的元素仍然可聚焦且可以向辅助技术广播忙闲状态。",
      "为独立的 Spinner 配上文字标签或 aria-label，让加载状态被辅助技术正确播报。",
    ],
    whenNotToUse: [
      "已知持续时间或百分比的场景请使用 Progress 组件，而非 Spinner。",
      "不要在同一行中将 Loading Dots 与其他动画指示器混用——这会造成视觉冲突并浪费资源。",
      "部署生命周期的中间状态（BUILDING / QUEUED）应由 Status Dot 处理，不要额外添加 Spinner。",
    ],
    examples: [
      {
        id: "colors",
        kind: "variant",
        title: "颜色变体",
        description: "展示 Spinner 的不同颜色变体，适配不同的背景和内容语境。",
        demoKey: "Colors",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "独立的 Spinner 必须搭配 aria-label 或文字说明，告知用户当前在等待什么操作完成。",
        "Spinner 本身是装饰性的，其含义应由相邻的文字或 aria-live 区域承担，避免空转的轮子被误认为可交互元素。",
        "尊重 prefers-reduced-motion 设置，在低强度模式下降低旋转频率或停止动画。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Spinner 是无交互的展示型组件，没有受控行为或状态转换；它的显隐由父组件的状态驱动，自身不接受受控属性。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Spinner 的尺寸通过 props 显式指定，在任何视口下都保持一致的视觉密度和可读性。",
        "在不同密度的 UI 层级中（密集表格行 vs 全屏弹窗），Spinner 自动适配相应的大小比例。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Spinner 的颜色通过主题变量管理，暗色/亮色模式下自动选用合适的色彩保证对比度。",
        "可通过 props 传入自定义颜色值，与品牌色系或特定语义保持一致。",
      ],
    },
  },
};

export const GUIDES_12_EN: Record<string, ComponentGuide> = {
  "show-more": {
    slug: "show-more",
    locale: "en-US",
    summary: "Shows expanded or collapsed content with a progressive-disclosure trigger.",
    whenToUse: [
      "Use ShowMore for progressive disclosure of a single long list or block (recent activity, repo branches, attached resources). For sibling pages of the same data set, use Pagination; for optional sections, use Collapse.",
      "Show enough rows to convey the shape of the list before truncating (5–10 typical); this helps users understand the full scope of hidden content.",
      'The component label is fixed to "Show More" / "Show Less". If hidden-item count matters, render that count in adjacent caller-owned content.',
    ],
    whenNotToUse: [
      "For sibling pages of the same data set, use Pagination rather than ShowMore; for optional sections, use Collapse instead.",
      "Do not use ShowMore when truncating only 2 rows—it feels performative. Always show at least 5 rows before truncating.",
      "Do not cycle Show More then Show Less mid-flow on the same data set; collapsing rows after expansion scrolls them away from where the user was reading.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default state",
        description: "Displays the default collapsed appearance with the trigger button.",
        demoKey: "Default",
      },
      {
        id: "expanded",
        kind: "variant",
        title: "Expanded state",
        description:
          'Shows the fully expanded effect after clicking; the trigger swaps to "Show Less".',
        demoKey: "Expanded",
      },
      {
        id: "no-border",
        kind: "variant",
        title: "No border variant",
        description:
          "Demonstrates the clean borderless style, suitable for seamlessly blending into page layouts.",
        demoKey: "No border",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The trigger must be a <button> with aria-expanded, paired with aria-controls pointing to the target list region.",
        "The component provides a native button and aria-expanded; callers should connect it to the revealed region with aria-controls.",
        "The component does not move focus or create a live region. Add announcement behavior to the content region only when the product flow requires it.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "expanded controls the label, arrow direction, and aria-expanded; the caller updates external state through the native onClick handler.",
        "ShowMore renders only the trigger and does not manage the target content, expansion animation, or focus position.",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "ShowMore renders only a fixed 32px-high trigger. It does not manage target-row layout or breakpoint behavior; callers own the responsive content layout.",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Button colors, hover states, and highlights follow Geist theme variables, adapting automatically between dark and light modes.",
        "noBorder only removes the default border. There are no dedicated border-color or background props; use className for additional styling.",
      ],
    },
  },
  skeleton: {
    slug: "skeleton",
    locale: "en-US",
    summary: "Displays a placeholder while content is loading.",
    whenToUse: [
      "Show a Skeleton when async data fills a known layout: table rows, card grids, profile blocks, sidebars—preserving the eventual content's shape.",
      "Set width and height to match the final content so the layout does not shift when data resolves, preventing Cumulative Layout Shift (CLS).",
      "When loading multiple resources in batch, use a set of skeletons to simulate the real layout so users sense the system is processing.",
    ],
    whenNotToUse: [
      "For a single in-flight action, use Spinner; for known progress, use Progress. Do not substitute Skeleton for these purpose-built indicators.",
      "Do not use Skeletons on static pages or empty states—Skeleton only makes sense when there is subsequent content to load.",
      "Do not use skeleton placeholders for unstructured or unpredictable content—its value lies in pre-knowing the layout's shape; otherwise it misleads.",
    ],
    examples: [
      {
        id: "set-width",
        kind: "minimal",
        title: "Fixed width",
        description:
          "Demonstrates a Skeleton with a preset width, simulating a text-line placeholder.",
        demoKey: "Default with set width",
      },
      {
        id: "box-height",
        kind: "variant",
        title: "Box height",
        description:
          "Demonstrates a Skeleton block with a fixed height, simulating an image or card container.",
        demoKey: "Default with box height",
      },
      {
        id: "wrapping-children",
        kind: "advanced",
        title: "Wrapping children",
        description:
          "Demonstrates nesting actual children inside a Skeleton for composite skeleton effects.",
        demoKey: "Wrapping children",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        'Wrap the loading region in aria-busy="true" and announce completion with aria-live="polite" on the destination container once data resolves.',
        "Skeleton elements themselves are decorative and should not be read aloud by screen readers—the underlying content carries the real semantic meaning.",
        "Respect prefers-reduced-motion on low-power devices to reduce or disable the pulse animation.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Skeleton is a passive display component with no interactive state or controlled properties; its rendering is driven solely by the parent component's loading state.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Use width, height, className, or style to make each Skeleton match the final content dimensions.",
        "Skeleton does not manage list or grid layout; the caller owns any responsive multi-column-to-single-column transition.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Skeleton background color and pulse animation follow theme variables, providing appropriate contrast in both dark and light modes.",
        "Skeleton colors can be overridden via CSS variables for brand customization or special-scenario differentiation.",
      ],
    },
  },
  slider: {
    slug: "slider",
    locale: "en-US",
    summary: "An input to select a value from a given range.",
    whenToUse: [
      "Use a slider for ranged numeric input where shape and proximity matter more than precision: bandwidth caps, opacity, audio volume, color channels.",
      "Pair the slider with a numeric Input for exact values like port numbers or memory limits, where keyboard users prefer typing.",
      "Snap to a sensible step (1, 5, 10%) so dragging never produces odd values like 47.83291; clamp min and max to real product limits.",
    ],
    whenNotToUse: [
      "Where a specific discrete value needs exact selection, use Select, Input, or Combobox instead of a slider.",
      "For fewer than 4 mutually exclusive options, use a Radio Group for clarity rather than forcing a slider.",
      "Avoid using the slider as the sole input method on mobile—touch drag accuracy is limited; always provide a numeric fallback.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default slider",
        description:
          "Displays a default-styled Range Slider with its track and thumb.",
        demoKey: "default",
      },
      {
        id: "step-max",
        kind: "variant",
        title: "Step and maximum",
        description: "Demonstrates a Range Slider with custom step sizes and bounds.",
        demoKey: "step-max",
      },
      {
        id: "with-label",
        kind: "stateful",
        title: "With label",
        description:
          "Demonstrates the label prop providing a visible and accessible name above the track.",
        demoKey: "with-label",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Give the slider an accessible name through a sibling <label htmlFor> or aria-label; native arrow-key, Page Up/Down, Home/End behavior handles keyboard input.",
        "For exact values, explicitly enable showStartInput/showEndInput or render a caller-owned adjacent value with units.",
        "Disabled sliders still need a Tooltip naming the reason—a greyed slider with no explanation reads as a bug.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Slider accepts value/defaultValue. Use onValueCommit after track interaction; onValueChange is currently emitted only by the optional numeric-input path.",
        "A disabled thumb prevents all keyboard and mouse input, useful for temporarily locking settings.",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "The track fills its container, but the component does not resize labels at breakpoints or guarantee a 44px touch target. Validate mobile layout and hit area in caller code.",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Track color, active-fill background, and thumb styles follow theme variables, with corresponding palettes in both dark and light modes.",
        "There is no dedicated color prop. Brand overrides belong in the surrounding style or token layer.",
      ],
    },
  },
  snippet: {
    slug: "snippet",
    locale: "en-US",
    summary: "Displays a runnable shell command or short code the user is meant to copy.",
    whenToUse: [
      "Use Snippet for a runnable shell command the user is meant to copy; it ships with the prompt glyph and copy affordance built in.",
      "For inline tokens (env var names, paths) use InlineCode, and for multi-line source use CodeBlock; one-liner commands belong in Snippet.",
      "Pair Snippet with a CopyButton so users can grab the command without manually selecting text.",
    ],
    whenNotToUse: [
      "Keep one command per Snippet; for longer scripts, switch to CodeBlock so users can read before they copy.",
      "Do not use Snippet for pseudocode or pseudo-syntax examples in documentation—it should present real, pasteable commands.",
      "Do not combine multiple commands in a single Snippet; each command should be its own independent Snippet to avoid copy confusion.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default snippet",
        description:
          "Displays the default Snippet appearance with the prompt glyph and copy button.",
        demoKey: "Default",
      },
      {
        id: "inverted",
        kind: "variant",
        title: "Inverted variant",
        description:
          "Demonstrates the dark-background inverted variant for use in dark-themed code contexts.",
        demoKey: "Inverted",
      },
      {
        id: "variants",
        kind: "advanced",
        title: "All variants",
        description: "Showcases all Snippet variant styles and configuration options available.",
        demoKey: "Variants",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        'The Copy button must be an icon-only button with an explicit aria-label so screen readers announce the action intent (e.g., "Copy deployment URL").',
        "Provide visual feedback (checkmark) for about 1.5 seconds after a successful copy, then reset before the next click.",
        "Prefer navigator.clipboard.writeText with a hidden-textarea execCommand fallback so copying works where clipboard permissions are missing.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Supports controlled copied-state (copied), letting developers programmatically manage the visibility and duration of copy feedback.",
        "The callback prop allows executing additional business logic when the copy action fires.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Snippet adjusts padding and font size automatically on narrow screens so command text is not overly compressed.",
        "The copy button maintains consistent visibility and tap-target size across all screen widths.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Snippet background, border, and text color follow theme variables, each mode having its own color palette.",
        "The inverted variant is specifically optimized for dark backgrounds, ensuring contrast meets WCAG standards.",
      ],
    },
  },
  spinner: {
    slug: "spinner",
    locale: "en-US",
    summary: "Indicates an in-progress operation.",
    whenToUse: [
      "Use Spinner for a single in-flight action or indeterminate wait where there is no known progress to show.",
      "Prefer a loading state on the action control itself (like Button loading) so the busy element stays focusable and announces the busy state to assistive tech.",
      "Pair a standalone Spinner with a text label or aria-label so the loading state is announced to assistive tech.",
    ],
    whenNotToUse: [
      "For a known duration or percentage, use Progress instead of a Spinner.",
      "Do not pair Loading Dots with another animated indicator on the same line—this creates visual conflict and wastes resources.",
      "Deployment lifecycle intermediate states (BUILDING / QUEUED) should be handled by Status Dot, not supplemented with a Spinner.",
    ],
    examples: [
      {
        id: "colors",
        kind: "variant",
        title: "Color variants",
        description:
          "Showcases different color variants of the Spinner for varying backgrounds and content contexts.",
        demoKey: "Colors",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "A standalone Spinner must be accompanied by an aria-label or text description telling users what operation is waiting.",
        "The Spinner itself is decorative; its meaning should be carried by adjacent text or an aria-live region—an idly spinning wheel should not be mistaken for an interactive element.",
        "Respect prefers-reduced-motion to reduce rotation frequency or stop the animation entirely on low-intensity devices.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Spinner is a passive display component with no interactive state or controlled properties; its visibility is driven by the parent component's state and it accepts no controlled attributes.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Spinner size is specified explicitly via props, keeping consistent visual density and legibility on any viewport.",
        "In different UI density contexts (dense table rows vs. full-screen modals), the Spinner adapts to the appropriate proportional size.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Spinner colors are managed through theme variables, automatically selecting appropriate hues for sufficient contrast in both dark and light modes.",
        "Custom color values can be passed via props to align with brand palettes or specific semantic meanings.",
      ],
    },
  },
};
