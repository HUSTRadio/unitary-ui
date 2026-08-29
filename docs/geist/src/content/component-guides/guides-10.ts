import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_10_ZH: Record<string, ComponentGuide> = {
  pill: {
    slug: "pill",
    locale: "zh-CN",
    summary: "可点击的筛选芯片，用于切换查询条件或选中项。",
    whenToUse: [
      "需要可点击的筛选芯片来切换过滤条件时，使用 Pill 而非静态 Badge。",
      '通过 variant="active" 高亮当前已选中的筛选器，让视觉用户无需依赖颜色即可感知激活状态。',
      "将 onClick 绑定到真正能触发过滤行为的场景，确保交互有意义。",
    ],
    whenNotToUse: [
      "不要将 Pill 用于纯展示的状态标签——如果不需要点击交互，改用 Badge。",
      "不要在没有实际过滤功能的元素上绑定 onClick；若只能展示不能操作，应提升为 Badge。",
      "不要在同一个容器中堆叠超过四个 Pill，超过后应考虑切换到下拉选择器或组合框。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认胶囊",
        description: "展示默认的 Pill 外观，包含基础文本标签和可选的变体。",
        demoKey: "Default",
      },
      {
        id: "active-state",
        kind: "stateful",
        title: "激活状态",
        description: '演示使用 variant="active" 高亮当前已选中的筛选器，区分当前与非当前筛选条件。',
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Pill 作为可交互按钮渲染时应有清晰的焦点指示，键盘用户可通过 Tab 键导航并回车激活。",
        "已激活的 Pill 应通过 aria-pressed 或等效属性标记其选中状态，便于屏幕阅读器播报。",
        "图标化的 Pill（仅有图标无文字）必须设置 aria-label，否则屏幕阅读器无法获知其用途。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Pill 本身是无受控属性的展示型组件，选中状态由外部 onClick 回调管理；组件内部不维护独立的状态机。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Pill 的内边距和字号在不同视口下保持一致的紧凑比例，窄屏上不溢出容器边界。",
        "横向排列的一排 Pill 在窄屏上支持水平滚动或自动换行，确保所有选项始终可见。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Pill 的 active 变体与默认变体各自拥有独立的深色/浅色模式配色，跟随主题变量同步更新。",
        "背景色和边框色均使用主题色板中的语义色值，确保品牌一致性。",
      ],
    },
  },
  progress: {
    slug: "progress",
    locale: "zh-CN",
    summary: "展示相对于某个上限或任务的进度百分比。",
    whenToUse: [
      "已知总量且可追踪确定性进度时使用 Progress，如文件上传、多步设置、构建步骤或批量删除操作。",
      "搭配明确的工作描述和单位文本（如「正在上传 12/30 个文件」），让进度条不仅仅是一个抽象数字。",
      "使用 max prop 传入真实的上限值（max={files.length}），而非硬编码 100，组件会基于 value / max 计算百分比。",
    ],
    whenNotToUse: [
      "对于短时间的不确定等待（约 1-3 秒），使用 Spinner 而非 Progress，因为此时不存在已知进度。",
      "对于内联文案中的等待提示（如 Saving…），使用 Loading Dots 而不是进度条。",
      "不要用 Progress 展示一个没有明确上限的模糊概念——如果没有真实的总数，考虑使用仪表 Gauge。",
    ],
    examples: [
      {
        id: "custom-max",
        kind: "minimal",
        title: "自定义上限",
        description: "展示使用不同的 max 值，组件按比例计算进度百分比。",
        demoKey: "Custom max",
      },
      {
        id: "dynamic-colors",
        kind: "variant",
        title: "动态颜色",
        description: "展示根据进度值自动切换颜色的进度条效果。",
        demoKey: "Dynamic colors",
      },
      {
        id: "with-stops",
        kind: "advanced",
        title: "带进度停止点",
        description: "展示在进度条上标注特定节点的用法，适用于多阶段任务。",
        demoKey: "With Stops",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        'Progress 组件设置 role="progressbar" 以及 aria-valuemin、aria-valuemax 和 aria-valuenow 属性，屏幕阅读器据此朗读当前进度值。',
        "必须配合描述性文本一起使用，单独一个进度条对辅助技术来说不够自描述。",
        "避免覆盖组件内置的 ARIA 角色和属性值，这些是 WCAG 合规的关键。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Progress 支持受控的 value 和 max props，开发者可在外部驱动进度变化并通过 onChange 回调响应。",
        "动画过渡平滑流畅，value 变化时进度条以 CSS transition 从旧值渐变到新值，避免跳跃式变化。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "进度条采用全宽布局，在任何视口下都填满父容器的可用宽度。",
        "数值标签在各尺寸下保持清晰可读，窄屏上可能缩小字号以适应空间。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "进度条的颜色和样式完全由主题变量控制，暗色模式和亮色模式下均有良好的对比度。",
        "ThroughStop 子元素的定位和样式同样跟随主题适配，确保在所有变体中一致。",
      ],
    },
  },
  "project-banner": {
    slug: "project-banner",
    locale: "zh-CN",
    summary: "用于显示需要解决的临时项目级通知横幅。",
    whenToUse: [
      "需要在项目级别展示紧急状态时使用 Project Banner，如逾期账单、活跃回滚、攻击缓解或即将到期阻止部署的试用。",
      "根据严重程度匹配语义变体：error 用于关键停机或支付阻塞状态，warning 用于非即时的异常状态，success 用于积极的安全状态，gray 用于常规项目通知。",
      "始终提供一个可解决该状态的行动按钮，一条没有解决路径的横幅等于死胡同。",
    ],
    whenNotToUse: [
      "不要把 Project Banner 用于可简单关闭的信息——如果消息能在不解决根本状态的情况下被忽略，它不应该成为横幅。",
      "不要在单个页面堆叠多个 Project Banner——同时显示一个即可，堆叠互相竞争的消息会让最紧急的状态被淹没。",
      "不要将其用于内联上下文相关的单个字段警告——使用 Note 代替。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认横幅",
        description: "展示默认的 Project Banner 外观和基本结构。",
        demoKey: "Default",
      },
      {
        id: "error",
        kind: "stateful",
        title: "错误状态",
        description: "展示 error 变体用于关键停机或支付阻塞等严重问题。",
        demoKey: "Error",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Project Banner 带有 alert 或 status 语义，屏幕阅读器会在页面加载时正确识别并朗读其内容。",
        "横幅的行动按钮应有明确的 action 标签，遵循 Title Case Verb + Noun 格式（如 Update Payment Method）。",
        '当 Banner 涉及关键业务状态时，应使用 aria-live="assertive" 确保中断流程的通知被及时播报。',
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Project Banner 设计上不可关闭（non-dismissible by design），除非底层状态得到解决；它不接受外部的 dismiss 受控属性。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Project Banner 横跨容器全宽，在小屏幕上自动调整内边距和字体缩放以保持可读性。",
        "移动设备上横幅高度降低，行动按钮可能从行内改为堆叠布局以确保触控目标足够大。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "不同严重程度的变体（error、warning、success、gray）在暗色/亮色模式下各有对应的配色方案。",
        "背景和边框颜色通过主题变量统一管理，全局修改主题时可一键更新所有横幅样式。",
      ],
    },
  },
  radio: {
    slug: "radio",
    locale: "zh-CN",
    summary: "提供从多个互斥选项中选择一个的单选输入控件。",
    whenToUse: [
      "需要从 2-6 个互斥选项中做单一选择时使用 Radio，且用户必须看到所有选项才能做出决定，如部署区域、计划层级或计费周期。",
      "为相关联的单选按钮设置 <fieldset> + <legend> 包裹，这样屏幕阅读器在每个选项前播报组名。",
      "预设一个最安全的默认值，让字段在读起来已经配置完成，而非必需的但为空状态。",
    ],
    whenNotToUse: [
      "当选项数量超过 6 个时，切换至 Select 或 Combobox 以避免列表占据过多表单空间。",
      "对于二进制开/关设置，使用 Toggle 而非 Radio——单一的 on/off 用开关机制更直观。",
      "当每个选项需要丰富的额外内容（如图标、详细描述、徽章）时，改用 Choicebox 获得更大的点击目标和更好的信息层次。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认单选",
        description: "展示基本的 Radio 用法，包含一组互斥选项和默认选中状态。",
        demoKey: "default",
      },
      {
        id: "disabled",
        kind: "variant",
        title: "禁用状态",
        description: "展示如何禁用特定的单选选项，让用户无法选择。",
        demoKey: "Radio disabled",
      },
      {
        id: "required",
        kind: "stateful",
        title: "必填验证",
        description: "展示 RadioGroup 的必填标记和验证反馈，帮助用户识别未完成的表单。",
        demoKey: "Radio required",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "相关单选按钮应在 <fieldset> 内并用 <legend> 标注组名称，确保屏幕阅读器先报组名再报选项。",
        "Required 状态应设置在 RadioGroup 级别而非单个选项上，避免重复宣告。",
        "键盘用户可以通过 Up/Down 箭头在选项间切换焦点，Enter 或 Space 激活选择。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Radio 接受 controlled checked 属性，开发者可通过 onChange 回调管理选中状态并在外部驱动。",
        "受控模式下 radio-group 的行为与原生 HTML <input type='radio'> 一致，但由 React 状态精确驱动。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Radio 选项列表在窄屏上自动增加间距并为每个选项留出足够的触控目标尺寸。",
        "垂直堆叠的 Radio 组在所有视口下保持一致的行高和内边距，不会出现挤压或溢出。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "选中态的圆点和边框颜色遵循主题变量的主色调，暗色/亮色模式自动适配。",
        "禁用态 Radio 的透明度和对比度调整通过主题色板的 alpha 通道实现，保持无障碍对比度要求。",
      ],
    },
  },
  "relative-time-card": {
    slug: "relative-time-card",
    locale: "zh-CN",
    summary: "展示相对时间戳及其上下文语境，如「5 分钟前」。",
    whenToUse: [
      "近期活动展示时使用相对时间格式（如「3 分钟前」「2 小时前」），让用户快速理解事件的新鲜度。",
      "在表格单元格中展示最近的操作记录时间，结合表格里其他行进行快速比较。",
      "在 hover 或 focus 时暴露精确的时间戳，让需要具体日期的用户仍能获取完整信息。",
    ],
    whenNotToUse: [
      "当事件距今较久，相对表述不再有助于用户比较时（超过一周），应切换为绝对日期格式。",
      "不要将 Relative Time Card 用作重要的日期凭证或法律时间线——它不适合对时间精度有严格要求的场景。",
      "不要在同一界面混合使用多种时间格式展示同一数据源——要么全部使用相对时间，要么全部转换为绝对时间。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认卡片",
        description: "展示默认的相对时间卡片外观，自动计算并格式化时间差。",
        demoKey: "Default",
      },
      {
        id: "hover-timestamp",
        kind: "variant",
        title: "悬停精确时间",
        description: "演示在 hover 时从相对表达式切换到精确时间戳的浮层气泡交互效果。",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Relative Time Card 应将精确时间戳通过 aria-label 属性暴露给屏幕阅读器，即使视觉上只显示相对表达。",
        '时间值的变化应包装在 aria-live="polite" 区域中，当时间刷新时辅助技术能够察觉变化。',
        "使用 tabular nums（等宽数字）对齐数值列中的时间，方便跨行比较。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Relative Time Card 是无交互的展示型组件，内部自动处理时间增量更新；接收外部时间值作为唯一输入，不支持受控行为。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "相对时间表达式在不同视口下保持一致的紧凑排版，窄屏上不会因空间限制而截断。",
        "鼠标悬停显示的精确时间戳采用浮层气泡形式，不受 viewport 大小的影响。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "时间文本颜色和背景色跟随主题变量，确保在暗色和亮色模式下都有足够的可读对比度。",
        "悬浮气泡的时间戳背景与主题一致，并应用适当的阴影以区别于底层内容。",
      ],
    },
  },
};

export const GUIDES_10_EN: Record<string, ComponentGuide> = {
  pill: {
    slug: "pill",
    locale: "en-US",
    summary: "Clickable filter chip for toggling a query or selection.",
    whenToUse: [
      "Use Pill for clickable filter chips that toggle a query, as opposed to a static Badge.",
      'Highlight the currently selected filter with variant="active" so sighted users see the active state without relying on color alone.',
      "Wire onClick only when the pill can actually filter; ensure the interaction is meaningful.",
    ],
    whenNotToUse: [
      "Do not use Pill for purely presentational status labels—if no click interaction is needed, use Badge instead.",
      "Do not bind onClick to elements that have no actual filtering capability; promote to a Badge if the element is display-only.",
      "Do not stack more than four Pills in the same container—beyond that, consider switching to a select dropdown or combobox.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default pill",
        description:
          "Displays the default Pill appearance with basic text labels and optional variants.",
        demoKey: "Default",
      },
      {
        id: "active-state",
        kind: "stateful",
        title: "Active state",
        description:
          'Demonstrates using variant="active" to highlight the currently selected filter, distinguishing active from inactive filters.',
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "When rendered as an interactive button, Pill should have a visible focus indicator so keyboard users can navigate via Tab and activate via Enter.",
        "The active Pill should carry an aria-pressed (or equivalent) attribute to mark its selected state for screen reader announcement.",
        "Icon-only Pills (no visible text) must have an aria-label set, otherwise screen readers cannot determine their purpose.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Pill itself has no controlled properties for internal state management; selection state is managed externally via onClick callbacks without an independent state machine.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Pill padding and font size maintain a consistent compact ratio across all viewports, never overflowing the parent container on narrow screens.",
        "A horizontal row of Pills supports horizontal scrolling or auto-wrapping on narrow screens to keep all options visible.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Each Pill variant (active vs default) has its own dark/light mode color pair that updates automatically with theme changes.",
        "Background and border colors use semantic values from the theme palette, ensuring brand consistency.",
      ],
    },
  },
  progress: {
    slug: "progress",
    locale: "en-US",
    summary: "Shows progress relative to a limit or a task.",
    whenToUse: [
      "Use Progress for deterministic work whose total is knowable, such as file uploads, multi-step setup, build steps, or batch deletions.",
      'Pair the bar with descriptive text naming the work and units (e.g., "Uploading 12 of 30 files") so the bar communicates more than an abstract number.',
      "Pass max as the real ceiling (max={files.length}) rather than hardcoding 100; the component computes the percentage from value / max.",
    ],
    whenNotToUse: [
      "For short indeterminate waits (~1–3 seconds), use Spinner instead of Progress since there is no known progress to display.",
      'For inline copy waiting indicators (like "Saving…"), use Loading Dots rather than a progress bar.',
      "Do not use Progress for a vague concept with no defined upper bound—if there is no real total, consider using a Gauge.",
    ],
    examples: [
      {
        id: "custom-max",
        kind: "minimal",
        title: "Custom max",
        description:
          "Demonstrates computing the percentage proportionally with different max values.",
        demoKey: "Custom max",
      },
      {
        id: "dynamic-colors",
        kind: "variant",
        title: "Dynamic colors",
        description:
          "Showcases a progress bar that automatically switches color based on the current progress value.",
        demoKey: "Dynamic colors",
      },
      {
        id: "with-stops",
        kind: "advanced",
        title: "With stops",
        description:
          "Demonstrates marking specific milestone nodes on the progress bar, suitable for multi-stage tasks.",
        demoKey: "With Stops",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        'The Progress component sets role="progressbar" along with aria-valuemin, aria-valuemax, and aria-valuenow so screen readers announce the current progress value.',
        "Always pair the bar with descriptive text—a bare progress bar is not self-describing for assistive technology.",
        "Do not override the built-in ARIA roles and values; these are critical for WCAG compliance.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Progress accepts controlled value and max props; developers can drive progress changes externally and respond via onChange callbacks.",
        "Animated transitions are smooth and fluid—the bar interpolates between old and new values via CSS transition, avoiding jump cuts.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "The progress bar uses a full-width layout that fills the available width of its parent container at every viewport size.",
        "Numeric labels remain legible at all sizes, possibly shrinking font on narrow viewports to fit within space.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Progress bar colors and styles are entirely governed by theme variables with good contrast ratios in both dark and light modes.",
        "ThroughStop child positioning and styling follow theme adaptation to remain consistent across all variants.",
      ],
    },
  },
  "project-banner": {
    slug: "project-banner",
    locale: "en-US",
    summary: "Used for temporary, project-wide notifications that require resolution.",
    whenToUse: [
      "Reach for Project Banner for project-wide states that need resolution: overdue billing, an active rollback, attack mitigation, or an expiring trial blocking deploys.",
      "Match variant to severity: error for critical downtime or payment-blocking states, warning for an exceptional state with non-immediate action, success for a positive temporary mitigation, gray for routine project-wide notices.",
      "Always provide an action that resolves the state; a banner with no route to resolution is a dead end.",
    ],
    whenNotToUse: [
      "Do not use Project Banner for messages that can be dismissed without resolving the underlying state—if it can be ignored, it is not banner-worthy.",
      "Do not stack multiple Project Banners on a single page—show only one at a time; competing banners drown the most urgent state.",
      "Do not use it for inline contextual warnings tied to a single field—use Note instead.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default banner",
        description: "Displays the default Project Banner appearance and basic structure.",
        demoKey: "Default",
      },
      {
        id: "error",
        kind: "stateful",
        title: "Error state",
        description:
          "Showcases the error variant for critical issues such as downtime or payment blocks.",
        demoKey: "Error",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Project Banner carries alert or status semantics, so screen readers correctly identify and announce its content on page load.",
        "Action buttons on the banner should have explicit action labels following the Title Case Verb + Noun pattern (e.g., Update Payment Method).",
        'When the Banner involves a critical business state, use aria-live="assertive" to ensure interruptive notifications are announced promptly.',
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Project Banner is non-dismissible by design—the message persists until the underlying state is resolved; it does not accept external dismiss-controlled properties.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Project Banner spans the full width of its container and adjusts padding and font scaling automatically on smaller screens for readability.",
        "On mobile devices, the banner height is reduced and action buttons may switch from inline to a stacked layout to ensure sufficient touch targets.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Different severity variants (error, warning, success, gray) have distinct color palettes in both dark and light modes.",
        "Background and border colors are managed centrally through theme variables, enabling a global theme update to cascade to all banners.",
      ],
    },
  },
  radio: {
    slug: "radio",
    locale: "en-US",
    summary: "Provides single user input from a selection of options.",
    whenToUse: [
      "Use Radio for a single choice from 2–6 mutually exclusive options where seeing every option matters, such as deploy regions, plan tiers, or billing cycle.",
      "Wrap related radios in <fieldset> + <legend> so screen readers announce the group name before each option.",
      "Pre-select the safest default so the field reads as configured, never as required-but-empty.",
    ],
    whenNotToUse: [
      "Past 6 options, switch to Select or Combobox so the list does not dominate the form.",
      "For binary on/off settings, use Toggle rather than Radio—a single on/off is more intuitive with a switch mechanism.",
      "When each option requires rich additional content (icon, detailed description, badge), use Choicebox for a larger tap target and better information hierarchy.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default radio",
        description:
          "Displays basic Radio usage with a group of mutually exclusive options and a default selected state.",
        demoKey: "default",
      },
      {
        id: "disabled",
        kind: "variant",
        title: "Disabled state",
        description:
          "Demonstrates how to disable a specific radio option so users cannot select it.",
        demoKey: "Radio disabled",
      },
      {
        id: "required",
        kind: "stateful",
        title: "Required validation",
        description:
          "Showcases the RadioGroup's required marker and validation feedback to help users identify incomplete forms.",
        demoKey: "Radio required",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Related radio buttons should be wrapped in <fieldset> with a <legend> labeling the group name, ensuring screen readers announce the group before each option.",
        "The Required state should be set at the RadioGroup level rather than on individual options to avoid redundant announcements.",
        "Keyboard users can cycle through options with Up/Down arrows, and activate a selection with Enter or Space.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Radio accepts a controlled checked prop; developers can manage selection state via onChange callbacks and drive it from external state.",
        "In controlled mode, the radio-group behaves identically to native HTML <input type='radio'> but is driven precisely by React state.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Radio option lists increase spacing on narrow screens and provide sufficiently large touch targets for each option.",
        "Vertically stacked Radio groups maintain consistent line height and padding across all viewports without squishing or overflow.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The checked-state dot and border color follow the theme variable's primary hue, adapting automatically between dark and light modes.",
        "Disabled radio adjustments to opacity and contrast are achieved through the theme palette's alpha channel while maintaining WCAG contrast requirements.",
      ],
    },
  },
  "relative-time-card": {
    slug: "relative-time-card",
    locale: "en-US",
    summary: "Shows a relative timestamp with temporal context.",
    whenToUse: [
      'Use relative time formats (like "5 min ago", "2 hours ago") for recent activity displays so users quickly grasp event freshness.',
      "Use in table cells to show recently performed action timestamps, enabling quick comparison alongside other rows.",
      "Expose the exact timestamp on hover or focus so users who need the precise date still have access to complete information.",
    ],
    whenNotToUse: [
      "Once events are too far past for relative wording to help users compare (past a week), switch to absolute date format.",
      "Do not use Relative Time Card for important date credentials or legal timelines—it is unsuitable for scenarios requiring strict time precision.",
      "Do not mix multiple time formats showing the same data source on one interface—either use all relative time or convert everything to absolute time.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default card",
        description:
          "Displays the default relative time card appearance, automatically computing and formatting the time difference.",
        demoKey: "Default",
      },
      {
        id: "hover-timestamp",
        kind: "variant",
        title: "Hover timestamp",
        description:
          "Demonstrates the floating tooltip interaction that switches from relative expression to an exact timestamp on hover.",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Relative Time Card should expose the precise timestamp via aria-label even when visually displaying only the relative expression.",
        'Time value changes should be wrapped in an aria-live="polite" region so assistive technology detects updates when time refreshes.',
        "Use tabular nums to align numeric time values in columns for easier cross-row comparison.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Relative Time Card is a passive display component that internally handles incremental time updates; it accepts an external time value as its sole input with no controlled behavior.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Relative time expressions maintain consistent compact typography across all viewports and do not truncate on narrow screens due to space constraints.",
        "The floating tooltip showing the exact timestamp on hover is unaffected by viewport size.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Time text color and background follow theme variables, ensuring sufficient readable contrast in both dark and light modes.",
        "Floating tooltip backgrounds match the theme and apply appropriate shadows to distinguish from underlying content.",
      ],
    },
  },
};
