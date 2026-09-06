import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_06_ZH: Record<string, ComponentGuide> = {
  error: {
    slug: "error",
    locale: "zh-CN",
    summary: "在操作失败时提供友好、可操作的错误消息，适用于区块级或页面级的资源加载失败场景。",
    whenToUse: [
      "当一个区块或页面级资源（如面板、仪表盘卡片、路由边界）加载失败时，使用 Error 组件作为块级错误展示。",
      "当平台或系统级别的异步请求失败时，需附带稳定的标识符（如请求 ID、部署 ID），让用户或支持人员追踪问题。",
      "需要明确告知用户发生了什么问题以及下一步该做什么时使用，先陈述发生了什么，再说明如何解决。",
    ],
    whenNotToUse: [
      "不要用于瞬时的操作失败——优先使用 toast.error() 通知，它更适合短暂的操作反馈。",
      "不要用于字段级别的表单验证——Input 的 error 属性是字段的正确选择，而非用此块级组件替代。",
      "不要在标题中使用泛泛的 Something Went Wrong——应该命名具体失败的资源，例如 Couldn't Load Deployments。",
    ],
    examples: [
      {
        id: "error-sizes",
        kind: "minimal",
        title: "尺寸",
        description: "展示 Error 组件的不同尺寸变体，匹配密集布局和全局公告区域的排版需求。",
        demoKey: "Sizes",
      },
      {
        id: "error-custom-label",
        kind: "variant",
        title: "自定义标签",
        description: "演示通过自定义替换默认错误图标的用法，让错误提示与品牌风格保持一致。",
        demoKey: "Custom label",
      },
      {
        id: "error-with-property",
        kind: "stateful",
        title: "通过属性传入错误",
        description:
          "展示将错误对象直接通过 prop 传递给父组件的方式，在异步请求失败后渲染错误状态。",
        demoKey: "With an error property",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        '异步出现的错误区域应包裹在 aria-live="polite" 中，以便屏幕阅读器朗读新的错误状态。',
        "阻塞性错误可使用 assertive 模式立即打断用户并告知严重问题。",
        "错误图标为装饰性元素，应设置 aria-hidden，真正的语义信息依靠文本传达。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Error 是一个展示型组件，不管理自身的交互状态；内容通过 props 传递，由调用方决定何时显示错误以及错误的具体消息和标识符。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Error 组件在全宽容器中渲染，在小屏幕上自动调整内边距和字体大小以适应窄屏。",
        "错误标识符（如请求 ID）在窄屏上可能自动截断，同时保留完整值的 title 属性供悬停查看。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "不同语义状态的颜色映射（红色表示严重错误，琥珀色表示警告）在暗色/亮色模式下均保持足够的对比度。",
        "背景色和边框颜色跟随 Geist 主题变量，支持全局主题定制。",
      ],
    },
  },
  "error-card": {
    slug: "error-card",
    locale: "zh-CN",
    summary: "一个带恢复指引的独立错误状态卡片，适用于受限面板无法渲染的场景。",
    whenToUse: [
      "当某个有界面板或卡片区域因错误无法正常渲染时，使用 Error Card 展示具体的错误信息和恢复建议。",
      "需要一个包含清晰标题、描述和恢复操作的容器化错误提示，且错误范围限定在单个 UI 区块内。",
      "当错误发生时需要提供具体的恢复动作（如重试、联系支持）而非仅显示通用错误消息。",
    ],
    whenNotToUse: [
      "不要用于字段级别的表单验证错误——使用 ErrorText 或 Input 的 error 属性更合适。",
      "不要用于全页面级的系统错误——全屏错误更适合使用独立的 Error 组件或 Empty State 的错误变体。",
      "不要用笼统的 Try again 消息代替具体的恢复操作指导，应该明确说明哪里出了问题及如何解决。",
    ],
    examples: [
      {
        id: "error-card-default",
        kind: "minimal",
        title: "默认错误卡片",
        description: "展示 ErrorCard、标题、描述和 ErrorCardAction 布局槽；具体恢复按钮由调用方传入。",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        '错误卡片应在打开时通过 aria-live="polite" 向屏幕阅读器播报错误信息。',
        "恢复操作按钮应有清晰的 aria-label 描述具体执行的动作（如 Retry deployment）。",
        "错误图标为装饰性元素，使用 aria-hidden 隐藏以避免重复朗读。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Error Card 是展示型组件，由调用方通过 props 控制内容显示；组件自身不管理打开/关闭或受控状态。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Error Card 在有界容器内自适应宽度，在小屏幕上内部元素自动换行排列。",
        "ErrorCardAction 只提供布局槽；按钮宽度和移动端触摸目标由调用方提供的控件样式决定。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "错误状态的红色语义配色在暗色/亮色模式下均有对应的色调对，确保可读性和视觉一致性。",
        "卡片背景和边框颜色跟随主题变量，支持通过 CSS 变量覆盖自定义外观。",
      ],
    },
  },
  feedback: {
    slug: "feedback",
    locale: "zh-CN",
    summary: "收集用户的表情评分和开放式文本反馈，适用于文档或流程结束后获取用户评价的场景。",
    whenToUse: [
      "在页面末尾、文档结尾或已完成的工作流之后放置反馈面板，用户在形成观点后再收集意见。",
      "需要轻量级的情感反馈（表情评分）加上可选的详细文字评论时，避免引入完整的表单系统。",
      "用于对特定流程进行定向反馈收集（如 Imports 反馈、Bug 报告）以获取针对性改进信息。",
    ],
    whenNotToUse: [
      "不要在用户刚打开的表面就前置反馈面板——这会干扰用户正在执行的主要任务。",
      "不要用 Feedback 替代支持表单、Bug 报告入口或 NPS 采样调查——这些场景有专门的界面和工具。",
      "不要自动展开表单——默认变体保持按钮状态，Inline 只常显评分胶囊，直到用户主动操作。",
    ],
    examples: [
      {
        id: "feedback-default",
        kind: "minimal",
        title: "默认反馈面板",
        description: "展示 32px 次级按钮打开 340px 锚定 Popover 的默认反馈结构。",
        demoKey: "Default",
      },
      {
        id: "feedback-inline",
        kind: "variant",
        title: "行内反馈",
        description: "展示 274×48 评分胶囊在选中表情后于同一容器内扩展为反馈表单。",
        demoKey: "Inline",
      },
      {
        id: "feedback-with-metadata",
        kind: "advanced",
        title: "带元数据的反馈",
        description: "展示在反馈面板中附加上下文元数据的使用方式，帮助团队更好地了解反馈来源。",
        demoKey: "Feedback with metadata",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "表情评分按钮组应为每个选项提供明确的 aria-label 以便屏幕阅读器识别不同的情感选项。",
        "默认 Popover 提交后关闭并将焦点返回触发器；Inline 收起时不会制造虚假的弹窗焦点陷阱。",
        "可选的文本输入区域应有正确的 label 关联和 aria-describedby 辅助文本。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "默认 Popover 在 Escape 或外部点击关闭时保留当前草稿，重新打开后可继续编辑。",
        "Inline 在 Escape、外部点击或焦点离开后收起并清空评分，同时保留文字草稿。",
        "dryRun 下 Send 不调用 onSubmit，也不关闭界面；正常提交会复位评分、文字和主题。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "默认 Popover 以触发器为锚点，Inline 始终在原位置展开；两者都不会切换成 Modal 或 Drawer。",
        "四个表情按钮保持 32px 圆形点击区域和 1px 间距，与官方桌面及窄屏形态一致。",
        "默认 340px、Inline 展开 336px，并受视口减 32px 的最大宽度约束，避免窄屏水平溢出。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "所有评分统一使用 blue-300 背景和 blue-900 图形强调，不引入官方不存在的四色情绪语义。",
        "Local RatingPill extension 单独保留四色语义胶囊；它不是官方 Feedback 变体，也不改变 Feedback 的蓝色状态。",
        "面板阴影、背景色和边框颜色遵循 Geist 主题系统，支持全局主题变量的覆盖。",
      ],
    },
  },
  fieldset: {
    slug: "fieldset",
    locale: "zh-CN",
    summary:
      "将相关的表单控件组合为一个具有标题、描述和支持内容的语义单元，适用于设置页面的配置分组。",
    whenToUse: [
      "当需要将一组相关的表单控件归并为一个带有标题、支持文案和可选页脚的语义单元时使用。",
      "在设置页面中组织功能分组，如通知设置、安全设置等，每组使用独立的 Fieldset。",
      "当整个配置区块需要有统一的状态语义（如 type=error 或 type=warning）来传达整体级别的问题。",
    ],
    whenNotToUse: [
      "不要用 Fieldset 来构建非表单类的内容区块——它的语义是为表单控件分组设计的。",
      "不要在一个 Fieldset 中混入过多不相干的选项——每组应保持话题的一致性，超过 6-8 项应考虑分组。",
      "不要用手动构建的额外卡片外壳替代 FieldsetContent 和 FieldsetFooterActions 的标准子组件。",
    ],
    examples: [
      {
        id: "fieldset-default",
        kind: "minimal",
        title: "默认字段集",
        description: "展示默认样式的 Fieldset 基本结构：标题、正文内容和可选的页脚区域。",
        demoKey: "default",
      },
      {
        id: "fieldset-with-error-text",
        kind: "variant",
        title: "带错误文本",
        description: "演示在 Fieldset 中添加 ErrorText 行内错误消息的用法，标注配置中的具体问题。",
        demoKey: "with-error-text",
      },
      {
        id: "fieldset-disabled",
        kind: "stateful",
        title: "禁用状态",
        description: "展示将整个字段集及其内部控件设置为不可编辑的状态，配合解释性页脚保持可读性。",
        demoKey: "disabled",
      },
      {
        id: "fieldset-with-disabled-wall",
        kind: "advanced",
        title: "禁用墙效果",
        description: "演示使用 DisabledWall 覆盖整个内容区域但仍保留页脚说明可读写的高级禁用方案。",
        demoKey: "with-disabled-wall",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Fieldset 的 legend（标题）会被屏幕阅读器在每个所属表单控件上自动朗读，帮助建立控件归属关系。",
        "禁用的 Fieldset 内部控件虽然不可操作，但应保持在 DOM 中并使用 aria-disabled 标记以保持顺序。",
        "错误和警告类型的 Fieldset 应在标题附近添加醒目的无障碍提示，如 aria-live 区域。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Fieldset 可以通过 disabled 属性整体控制所有内部子控件的启用/禁用状态，简化批量管理。",
        "type 属性（error/warning）由调用方控制，用于传达整个配置区块的语义状态。",
        "内部的 FieldsetContent 和 FieldsetFooterActions 子组件接受各自的受控 props 来自定义行为。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Fieldset 内部表单控件在窄屏上垂直堆叠排列，在大屏上使用横向布局提升空间利用率。",
        "标题文本在窄屏上可能缩减字号或允许换行，确保小视口下标题的可读性不被破坏。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Fieldset 的边框、分割线和标题强调色跟随应用的主题变量，在暗色/亮色模式下自动适配。",
        "禁用状态的灰色调和半透明效果通过 CSS 变量从主题令牌获取，确保跨主题的视觉一致性。",
      ],
    },
  },
  "file-tree": {
    slug: "file-tree",
    locale: "zh-CN",
    summary: "以可扩展的文件夹和文件层级结构展示目录树视图，适用于代码预览和文件浏览场景。",
    whenToUse: [
      "需要在文档、示例或预览面板中展示项目的文件或目录层级结构时使用。",
      "当用户需要展开/折叠文件夹来浏览多层级文件系统，且结构是只读的展示用途时。",
      "在技术文档中演示项目结构、配置文件位置或生成结果的层次关系。",
    ],
    whenNotToUse: [
      "不要用于需要交互式文件操作（重命名、删除、上传）的场景——应使用专门的 File Manager 组件。",
      "当文件数量极大（数百以上）时，考虑使用分页或懒加载的文件浏览器而非一次性渲染整棵树。",
      "扁平化的单一文件展示不需要 File Tree——直接使用 CodeBlock 或 Snippet 即可。",
    ],
    examples: [
      {
        id: "file-tree-default",
        kind: "minimal",
        title: "默认文件树",
        description: "展示默认样式的文件树组件，包含可展开的文件夹节点和文件图标。",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "每个可展开的文件夹节点应使用 button 元素并维护 aria-expanded 状态，以便屏幕阅读器识别当前展开/折叠状态。",
        "文件夹触发器是原生 button，可通过 Tab 聚焦并用 Enter 或 Space 展开/折叠；当前组件未实现树形方向键导航。",
        "文件名称文本应作为焦点元素的唯一可读标签，避免依赖颜色或图标传递有意义的信息。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "展开/折叠状态可通过 expandable 属性外部控制，支持编程式地展开特定节点。",
        "选中节点（如有选框功能）可通过 controlled 属性同步外部状态变化，实现多选或联动。",
        "调用方可通过回调事件监听节点的展开和折叠操作，用于持久化树的展开状态。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "在窄屏上文件树可能启用水平滚动以容纳过长的文件名，同时保持缩进层级不变。",
        "文件夹展开/折叠按钮在小屏幕上增大触摸目标尺寸以确保手指操作的可靠性。",
        "文件树容器支持 overflow-auto 行为，大尺寸的长路径不会撑破布局边界。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "文件图标和文件夹图标的颜色随主题变量变化，在暗色/亮色模式下保证可见性。",
        "选中态的高亮颜色和悬停状态的背景色遵循应用的主题色彩规范，包括焦点指示器的对比度。",
      ],
    },
  },
};

export const GUIDES_06_EN: Record<string, ComponentGuide> = {
  error: {
    slug: "error",
    locale: "en-US",
    summary:
      "Provides a friendly, actionable message when an operation fails — use as a block surface when a section or page-level resource failed to load.",
    whenToUse: [
      "When a section or page-level resource (like a panel, dashboard card, or route boundary) fails to load — use Error as the block-level failure indicator.",
      "When a platform or system-level async request fails and needs a stable identifier (request ID, deployment ID) for the user or support team to trace the issue.",
      "When you need to clearly tell the user what happened and what to do next — state what went wrong first, then how to resolve it.",
    ],
    whenNotToUse: [
      "Don't use for transient action failures — prefer toast.error() for brief operational feedback, as it is lighter-weight and auto-dismisses.",
      "Don't use for field-level form validation — the error prop on Input is the correct choice for field errors, not this block-level component.",
      "Don't fall back to Something Went Wrong as a generic title — name the specific resource that failed, such as Couldn't Load Deployments.",
    ],
    examples: [
      {
        id: "error-sizes",
        kind: "minimal",
        title: "Sizes",
        description:
          "Showcases the different size variants of the Error component, suited for dense layouts and full-width announcement areas.",
        demoKey: "Sizes",
      },
      {
        id: "error-custom-label",
        kind: "variant",
        title: "Custom label",
        description:
          "Demonstrates replacing the default error icon with a custom label, keeping the error styling consistent with brand guidelines.",
        demoKey: "Custom label",
      },
      {
        id: "error-with-property",
        kind: "stateful",
        title: "With an error property",
        description:
          "Shows passing an error object directly via prop to render the error state after an async request fails, with automatic recovery options.",
        demoKey: "With an error property",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        'Wrap the error region in aria-live="polite" when the error appears asynchronously so screen readers announce the new state.',
        "Use assertive for blocking errors that require immediate user attention, reserving polite for informational failures.",
        "The error icon is decorative — set aria-hidden on it; meaning lives entirely in the accompanying text.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Error is a presentation-only component driven by whether an error object is passed as a prop. It does not manage its own toggle state — content and identifiers are supplied entirely by the caller.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Error renders horizontally within its full-width container, adjusting padding and font size automatically on smaller screens.",
        "Stable identifiers (request IDs, etc.) may truncate visually on narrow viewports while preserving the full value in the title attribute for hover access.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Color mapping for semantic states (red for severe errors, amber for warnings) maintains sufficient contrast in both dark and light modes.",
        "Background and border colors follow the Geist theme variables, supporting global theme customization via CSS tokens.",
      ],
    },
  },
  "error-card": {
    slug: "error-card",
    locale: "en-US",
    summary:
      "A contained error state with concrete recovery guidance — ideal when a bounded panel cannot render and the user needs actionable next steps.",
    whenToUse: [
      "When a bounded panel or card area fails to render due to an error, use Error Card to show the specific problem and suggested recovery actions.",
      "When you need a self-contained error container with a clear title, description, and a recovery action rather than a bare error message.",
      "When the error requires a specific recovery action (retry, contact support) instead of a generic Try again prompt.",
    ],
    whenNotToUse: [
      "Don't use for field-level form validation errors — use ErrorText or the Input error prop for inline messages.",
      "Don't use for full-page system errors — a dedicated Error component or Empty State with error variant is better for page-level failures.",
      "Avoid generic Try again messages — provide concrete recovery guidance that explains what failed and how to fix it.",
    ],
    examples: [
      {
        id: "error-card-default",
        kind: "minimal",
        title: "Default error card",
        description:
          "Shows ErrorCard, title, description, and the ErrorCardAction layout slot; the caller supplies any recovery button.",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        'Announce the error through aria-live="polite" when the error card appears so screen readers report the failure.',
        "The recovery action button should have a descriptive aria-label naming the specific action (e.g., Retry deployment).",
        "Error icons are decorative — use aria-hidden to prevent redundant narration by assistive technology.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Error Card is a presentation component whose content and visibility are controlled entirely by props from the caller; it does not manage internal open/close or interaction state.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Error Card adapts to its bounding container width, with inner elements wrapping vertically on narrow screens.",
        "ErrorCardAction is only a layout slot; the caller's control styles determine button width and mobile touch-target size.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Semantic red color palette for error states has paired dark/light mode tones ensuring legibility and visual consistency.",
        "Card background and border colors follow theme variables, with CSS variable overrides for custom appearance.",
      ],
    },
  },
  feedback: {
    slug: "feedback",
    locale: "en-US",
    summary:
      "Gathers emoji rating and optional text feedback — place at the end of a page, doc, or completed flow where the user has formed an opinion.",
    whenToUse: [
      "At the end of a page, documentation article, or completed workflow — collect feedback after the user has had time to form an opinion.",
      "When lightweight emotional feedback (emoji rating) combined with optional detailed text comments is sufficient, without needing a full-form experience.",
      "For targeted feedback collection on specific flows (e.g., Feedback on Imports, Report a Bug) to gather actionable improvement insights.",
    ],
    whenNotToUse: [
      "Don't front-load the feedback panel on a surface the user just opened — it derails the work that brought them there.",
      "Don't use Feedback as a substitute for a support form, bug report intake, or NPS sampling — those have dedicated surfaces and tools.",
      "Don't auto-open the form — keep the default as a button and Inline as a rating capsule until the user acts.",
    ],
    examples: [
      {
        id: "feedback-default",
        kind: "minimal",
        title: "Default feedback panel",
        description:
          "Shows the default 32px secondary trigger opening a 340px anchored Popover.",
        demoKey: "Default",
      },
      {
        id: "feedback-inline",
        kind: "variant",
        title: "Inline feedback",
        description:
          "Shows the 274×48 rating capsule expanding into the feedback form in the same container.",
        demoKey: "Inline",
      },
      {
        id: "feedback-with-metadata",
        kind: "advanced",
        title: "Feedback with metadata",
        description:
          "Shows attaching contextual metadata alongside the feedback panel, helping the team understand the source and context of collected responses.",
        demoKey: "Feedback with metadata",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Each emoji rating button should have an explicit aria-label so screen readers identify distinct emotional options.",
        "After default submission, the Popover closes and focus returns to its trigger; Inline does not introduce a fake modal focus trap.",
        "The optional text input should have a proper label association and aria-describedby for helper text.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Dismissing the default Popover with Escape or an outside press preserves the current draft for reopening.",
        "Inline collapses and clears its rating on Escape, outside press, or focus departure while preserving the text draft.",
        "In dryRun mode Send neither invokes onSubmit nor closes; a real submit resets rating, text, and topic.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "The default stays anchored to its trigger and Inline expands in place; neither switches to a Modal or Drawer.",
        "The four emoji buttons retain 32px circular targets with a 1px gap across desktop and narrow viewports.",
        "Default uses 340px and expanded Inline 336px, both capped to viewport width minus 32px to avoid horizontal overflow.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Every rating uses the same blue-300 background and blue-900 glyph emphasis; no non-official four-color emotion mapping is added.",
        "The separately labeled Local RatingPill extension retains semantic four-tone capsules; it is not an official Feedback variant.",
        "Panel shadow, background, and border colors follow the Geist theme system, supporting global theme variable overrides.",
      ],
    },
  },
  fieldset: {
    slug: "fieldset",
    locale: "en-US",
    summary:
      "Groups related form controls into a single semantic unit with title, supporting copy, and optional footer — ideal for organizing settings pages.",
    whenToUse: [
      "When you need to group a set of related form controls into a single semantic unit with a title, supporting description, and optional footer area.",
      "To organize functional groups on settings pages, such as notification settings, security settings, each in its own Fieldset.",
      "When the entire configuration surface carries a unified semantic state (type=error or type=warning) to communicate system-level issues.",
    ],
    whenNotToUse: [
      "Don't use Fieldset for non-form content blocks — its semantic purpose is specifically for grouping related form controls.",
      "Don't mix too many unrelated options in a single Fieldset — each group should maintain topical coherence; consider splitting beyond 6–8 items.",
      "Don't hand-build extra card shells around Fieldset — use the standard FieldsetContent and FieldsetFooterActions sub-components.",
    ],
    examples: [
      {
        id: "fieldset-default",
        kind: "minimal",
        title: "Default fieldset",
        description:
          "Displays the basic Fieldset structure with a title, body content area, and optional footer section.",
        demoKey: "default",
      },
      {
        id: "fieldset-with-error-text",
        kind: "variant",
        title: "With error text",
        description:
          "Demonstrates adding an ErrorText inline message to highlight specific configuration problems within the Fieldset.",
        demoKey: "with-error-text",
      },
      {
        id: "fieldset-disabled",
        kind: "stateful",
        title: "Disabled state",
        description:
          "Shows setting the entire fieldset and its internal controls to a non-editable disabled state, with an explanatory footer remaining readable.",
        demoKey: "disabled",
      },
      {
        id: "fieldset-with-disabled-wall",
        kind: "advanced",
        title: "Disabled wall effect",
        description:
          "Demonstrates using DisabledWall to cover the entire content area while keeping the footer explanation interactable — an advanced disabled pattern.",
        demoKey: "with-disabled-wall",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The Fieldset legend (title) is automatically announced by screen readers before each associated form control, establishing ownership context.",
        "Disabled Fieldset internals remain in the DOM marked with aria-disabled to preserve tab order and reading sequence.",
        "Fieldsets with error or warning types should include an accessible live region near the title to announce the semantic state.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "The entire group of child controls can be enabled/disabled together via a disabled prop, simplifying batch management.",
        "The type prop (error/warning) is controlled externally to convey the semantic state of the entire configuration surface.",
        "Sub-components FieldsetContent and FieldsetFooterActions accept their own controlled props for customized behavior.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Internal form controls stack vertically on narrow screens and switch to horizontal layouts on wider viewports for better space utilization.",
        "Title text may reduce font size or allow wrapping on narrow screens, preserving title legibility at smaller breakpoints.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Fieldset borders, dividers, and title accent colors follow application theme variables, adapting automatically between dark and light modes.",
        "Disabled-state grays and transparency effects are sourced from CSS variable tokens, ensuring visual consistency across themes.",
      ],
    },
  },
  "file-tree": {
    slug: "file-tree",
    locale: "en-US",
    summary:
      "Displays a hierarchical directory structure with expandable folders and files — ideal for code previews and file browsing contexts.",
    whenToUse: [
      "When you need to show a project's file or directory hierarchy in documentation, examples, or preview panels.",
      "When users need to expand and collapse folders to navigate a multi-level file system structure used for read-only display purposes.",
      "In technical docs to illustrate project structures, config file locations, or hierarchical relationships of generated results.",
    ],
    whenNotToUse: [
      "Don't use for interactive file operations (rename, delete, upload) — a dedicated File Manager component is more appropriate.",
      "When dealing with hundreds of files, consider a paginated or lazily-loaded file browser instead of rendering the entire tree at once.",
      "Flat single-file display doesn't need File Tree — use CodeBlock or Snippet directly for individual file content.",
    ],
    examples: [
      {
        id: "file-tree-default",
        kind: "minimal",
        title: "Default file tree",
        description:
          "Displays the default file tree component with expandable folder nodes and file icons in a standard hierarchical layout.",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Each expandable folder node should use a button element with aria-expanded to indicate current expand/collapse state for screen readers.",
        "Folder triggers are native buttons: use Tab to focus them and Enter or Space to expand or collapse. The component does not implement tree-style arrow-key navigation.",
        "File names should serve as the sole readable label of focusable elements — avoid relying on color or icons for conveying meaningful information.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Expand/collapse state can be externally controlled via expandable props, supporting programmatic expansion of specific nodes.",
        "Selected node state (where selection is supported) can sync via controlled props for multi-select or cross-component linkage.",
        "Callers can listen to expand/collapse callback events to persist the tree's expanded state across sessions.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "On narrow screens the file tree may enable horizontal scrolling to accommodate long file names while maintaining indentation levels.",
        "Folder expand/collapse buttons increase touch target size on small screens to ensure reliable finger-based interactions.",
        "The file tree container supports overflow-auto behavior — excessively long paths won't break the layout boundaries.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "File and folder icons change color with theme variables, maintaining visibility across dark and light modes.",
        "Selection highlights and hover background colors follow the application's theme color spec, including focus indicator contrast ratios.",
      ],
    },
  },
};
