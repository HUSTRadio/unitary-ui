import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_09_ZH: Record<string, ComponentGuide> = {
  modal: {
    slug: "modal",
    locale: "zh-CN",
    summary: "弹出一个中断用户当前操作的对话框，适用于需要阻塞页面并完成决策的场景。",
    whenToUse: [
      "当一个决策必须阻止用户继续操作整个页面时（如确认删除、转移项目等）。",
      "需要确认破坏性操作时——Drawer 和 Sheet 不会完全遮住页面，因此对删除或撤销等操作显得力度不够。",
      "需要弹窗内包含表单输入、Combobox 或其他复杂交互元素时。",
    ],
    whenNotToUse: [
      "对于有独立页面的常规创建流程，应路由到该页面而非使用 Modal。",
      "当只需要展示持久性关联上下文且底层页面仍可读时，桌面端请使用 Sheet，移动端请使用 Drawer。",
      "不要把 Modal 用于低风险的日常确认（保存草稿、丢弃更改），这会带来不必要的摩擦感。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认模态框",
        description:
          "最基础的 Modal 用法：展示一个带有标题、主体文案和操作按钮的标准对话框，覆盖在遮罩层之上以中断用户的当前操作。",
        demoKey: "default",
      },
      {
        id: "sticky",
        kind: "variant",
        title: "粘性模式",
        description:
          "使用 sticky 变体让 Modal 的底部操作栏始终固定在可视区域底部，即使内容区域很长也能确保操作按钮随时可点击。",
        demoKey: "sticky",
      },
      {
        id: "inset",
        kind: "stateful",
        title: "内联间距",
        description:
          "通过 className、bodyClassName 和内容容器组合内嵌表面；Modal 不提供名为 inset 的组件参数。",
        demoKey: "inset",
      },
      {
        id: "disabled-actions",
        kind: "advanced",
        title: "禁用操作按钮",
        description:
          "展示如何将 Modal 的主操作按钮设为禁用状态，通常在等待验证结果或未满足前置条件时使用，配合视觉反馈传达当前不可操作的原因。",
        demoKey: "disabled-actions",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Modal 将焦点困在对话框内部直至关闭，并将焦点返回给触发元素，确保键盘用户不会迷失在页面上。",
        "通过 aria-labelledby 指向 Modal.Title 的 id，屏幕阅读器在打开时会正确播报标题。",
        "Enter 键永远不应该在未输入确认文本的情况下触发破坏性操作；应先聚焦 Cancel 按钮以防止误触。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "父组件通过 open 属性完全控制 Modal 的显示与隐藏；关闭应在 API 响应后或在错误时保持打开以便重试。",
        "支持设置初始焦点目标（如 focus-input-on-open），可以将焦点直接定位到模态框内的某个输入控件上。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "小视口下 Modal 仍保持居中，仅将宽度限制为视口减 20 px。",
        "内容区域最高为 80vh 并可滚动；需要移动端底部面板时应改用 BottomSheet。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Modal 的背景遮罩色、内容区域的背景以及按钮颜色均遵循主题令牌，自动适配浅色和深色模式。",
        "自定义配色可以与设计系统的 Token 变量无缝配合，保持一致的品牌视觉。",
      ],
    },
  },
  "multi-select": {
    slug: "multi-select",
    locale: "zh-CN",
    summary: "一个由触发器、弹出层和复选行组合而成的多选菜单。",
    whenToUse: [
      "当可能需要激活多个选项时，例如多值过滤器、标签选择或多字段配置。",
      "需要为每行提供“仅选择此项”或“选择全部”等快捷操作，并由页面拥有选择状态时。",
    ],
    whenNotToUse: [
      "当只需单选时可搜索列表时，请使用 Combobox——Multi Select 的语义是为多选设计的，不应混用。",
      "当选项数量极少（如 2–3 个）且都是互斥选项时，使用 Toggle 或 Switch 更为直观，不必引入复杂的下拉多选组件。",
    ],
    examples: [
      {
        id: "select-actions",
        kind: "minimal",
        title: "选择操作",
        description:
          "展示 MultiSelectRow 的切换、仅选择此项和选择全部回调；触发器摘要由页面根据外部状态生成。",
        demoKey: "select-actions",
      },
      {
        id: "keyboard-navigation",
        kind: "stateful",
        title: "键盘导航",
        description:
          "演示如何通过键盘方向键、Tab 键在选项列表中上下移动焦点并快速完成多选操作，确保不依赖鼠标的用户也能高效交互。",
        demoKey: "keyboard-navigation",
      },
      {
        id: "controlled-state",
        kind: "advanced",
        title: "受控状态",
        description:
          "页面维护选中数组，并把 checked、onChange、onSelectOnly 和 onSelectAll 传给各行，适合与表单提交或查询联动。",
        demoKey: "controlled-state",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "每行的复选框和快捷操作都有包含选项名称的 aria-label，屏幕阅读器可区分切换、仅选择此项和选择全部操作。",
        "打开后焦点落在 dialog；上下键跨行，左右键在复选框与快捷操作间切换，Tab 在控件间循环，Escape 由 Popover 关闭浮层。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Multi Select 不拥有选中数组；页面把 checked 和各操作回调传给每个 MultiSelectRow。",
        "MultiSelectRoot 仅通过 Radix Root 的 open/defaultOpen/onOpenChange 控制弹出层开闭。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "根容器在小屏下占满可用宽度；浮层至少与触发器等宽，并以可用视口高度限制滚动区域。",
        "触发器摘要使用单行截断，超长内容不会挤压右侧展开图标。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "选中项的高亮颜色、边框和背景均从主题令牌获取，浅色/深色模式下对比度均符合无障碍要求。",
        "下拉列表的背景、滚动条和悬停效果跟随当前主题保持一致的视觉风格。",
      ],
    },
  },
  note: {
    slug: "note",
    locale: "zh-CN",
    summary: "显示需要引起注意的行内提示文本或额外信息，支持多种语义变体。",
    whenToUse: [
      "在字段、卡片或它描述的区块旁边提供上下文反馈，例如区域变更警告、速率限制提醒或使用量提示。",
      "需要在行内持续展示一条提示信息直到底层状态发生变化，且不涉及破坏性操作或全局横幅级别的内容。",
      "需要通过不同语义变体（destructive、warning、success）来表达不同类型的反馈信息时。",
    ],
    whenNotToUse: [
      "当消息是页面级或系统级的且需要 CTA 时，应使用 Banner；如果是临时性通知则使用 Toast；如果是破坏性确认则使用 Modal。",
      "不要在同一个概念上堆叠三条以上的 Note——这说明页面架构本身需要改进，而不是靠叠加 Note 来解决。",
    ],
    examples: [
      {
        id: "sizes",
        kind: "variant",
        title: "尺寸变体",
        description:
          "Note 提供多种尺寸供选择，以适应不同的布局密度需求——紧凑的尺寸适合密集表格行，标准尺寸适合卡片和段落之间。",
        demoKey: "Sizes",
      },
      {
        id: "action",
        kind: "minimal",
        title: "带操作的注释",
        description:
          "在 Note 中加入操作按钮或链接，让用户可以直接执行后续动作，如查看文档、了解更多详情。",
        demoKey: "Action",
      },
      {
        id: "label",
        kind: "stateful",
        title: "带标签的注释",
        description:
          "为 Note 添加自定义标签以提升语义清晰度，在标签前显示图标和文字说明，帮助用户快速理解注意内容的含义。",
        demoKey: "Label",
      },
      {
        id: "custom-icon",
        kind: "advanced",
        title: "自定义图标",
        description:
          "替换 Note 默认的图标槽位以使用自定义 SVG 图标，满足品牌特定的视觉需求和更丰富的上下文表达。",
        demoKey: "Custom icon",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "不同变体（destructive、warning、success）通过颜色和图标传递语义，但颜色本身不足以区分——必须搭配明确的文本说明。",
        "Note 不是临时通知——它是持久性的，屏幕阅读器会在页面加载时立即播报其内容。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Note 是一个纯展示型通知组件，没有内部交互状态。它的行为完全由 props（variant、icon、children）驱动，不存在受控/非受控的概念。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Note 的宽度会自适应容器，在窄屏上仍然保持可读且不会溢出。",
        "尺寸变体（small/large）可以根据所在区域的密度需求进行选择。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Note 的各语义变体颜色（destructive、warning、success、secondary、violet、cyan）均从主题令牌获取，自动适配深浅色模式。",
        "禁用状态的 Note 会降低透明度但仍保留足够的对比度以维持可读性。",
      ],
    },
  },
  pagination: {
    slug: "pagination",
    locale: "zh-CN",
    summary: "通过分页控件在数据集的编号页面之间进行顺序导航，适用于文章、帖子和步骤序列。",
    whenToUse: [
      "在兄弟页面之间进行顺序导航（如文档文章、博客帖子、引导步骤），用户一次只阅读一页内容。",
      "作为上一个/下一个文档导航轨道，当用户需要在系列页面间前进或后退时。",
    ],
    whenNotToUse: [
      "如果要揭示同一数据集的更多行数据，应使用 Show More 或编号翻页器而非 Pagination 组件。",
      "当用户必须跳转到特定编号页面时，应使用数据表专用的数字翻页器。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认分页",
        description:
          "最基础的分页用法：渲染一组页码链接和一个上一个/下一个轨道，高亮当前活动页，其他页码为普通锚点链接。",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        '当前页通过 isActive 属性渲染，带有 aria-current="page" 属性，屏幕阅读器会标注当前页码。',
        "所有页码均为锚点按钮元素，支持键盘导航和回车跳转，确保无障碍用户能够流畅浏览。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "通过 activePage 属性控制当前活动页码，父组件可在页码变更时监听回调以更新路由或发起数据请求。",
        "总页数可以通过 total 属性传入，组件会根据该值自动渲染对应的页码按钮组。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "在小视口下自动隐藏中间的页码按钮，仅保留第一个、最后一个和当前页附近的按钮以保持布局紧凑。",
        "Previous / Next 按钮在序列首尾自动隐藏而不过度禁用，空轨道比暗淡的按钮看起来更干净。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "当前页高亮的背景色和文字颜色跟随主题令牌，在深色模式下也保持清晰可辨。",
        "分隔符和对齐样式均从主题令牌获取，与整体设计系统保持一致。",
      ],
    },
  },
  phone: {
    slug: "phone",
    locale: "zh-CN",
    summary: "用手机外壳框架包裹移动截图，适用于营销页面和技术文档中的移动端内容展示。",
    whenToUse: [
      "在着陆页、文档和介绍页面中，围绕移动截图、录屏和演示图像使用 Phone 作为营销 chrome 框架。",
      "需要向读者展示移动应用的实际外观和设计效果时，Phone 外框提供了逼真的模拟效果。",
    ],
    whenNotToUse: [
      "不要在外框内渲染真实的移动产品界面——chrome 暗示这是一个截图而非可交互的界面，误导用户以为可以点击操作。",
      "如果只需要展示网页响应式效果，请使用 Browser 组件而非 Phone——Browser 更适合网页截图的展示。",
    ],
    examples: [
      {
        id: "composition",
        kind: "minimal",
        title: "组合结构",
        description:
          "展示 Phone 组件的基本组合：一个 realistic 的手机外壳框架内嵌一张图片，包括状态栏、圆角和边框装饰。",
        demoKey: "Composition",
      },
      {
        id: "colors",
        kind: "variant",
        title: "颜色变体",
        description:
          "Phone 外框提供多种配色方案，可根据页面主题选择合适的色调来增强整体设计的一致性。",
        demoKey: "Colors",
      },
      {
        id: "dynamic-island",
        kind: "variant",
        title: "灵动岛",
        description:
          "启用 Dynamic Island 变体以展示最新款 iPhone 的灵动岛特征，适合面向现代 iOS 设备的营销材料。",
        demoKey: "Dynamic Island",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Phone 的外壳部分被标记为装饰性元素（aria-hidden），真正的可访问命名归属于内部的截图——屏幕阅读器会读取截图的替代文本。",
        "为内部的移动截图设置有意义的 alt 文本，确保屏幕阅读器用户了解截图的内容和意义。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Phone 是一个纯展示型 chrome 组件，没有内部交互状态或用户交互能力。它负责提供手机外框的视觉效果，所有内容完全由传入的子元素和 props 决定。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Phone 外框的比例在不同视口下保持不变，确保手机形状的视觉效果始终如一。",
        "内部的截图区域会根据容器大小自动缩放，但在宽屏上通常建议限制最大宽度以避免过度拉伸。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Phone 外框的颜色、阴影和圆角均从主题令牌获取，自动适配浅色和深色模式的对比度要求。",
        "Safari Chrome 变体中的浏览器 UI 颜色也跟随主题，保持一致的视觉风格。",
      ],
    },
  },
};

export const GUIDES_09_EN: Record<string, ComponentGuide> = {
  modal: {
    slug: "modal",
    locale: "en-US",
    summary:
      "A dialog that interrupts the user, used when a decision must block the rest of the page.",
    whenToUse: [
      "When a decision must block the rest of the page, such as confirming a deletion or transferring a project.",
      "When you need to confirm destructive actions; Drawer and Sheet don't fully dim the page so they read as too soft for delete or revoke flows.",
      "When the dialog needs to contain form inputs, a Combobox, or other complex interactive elements.",
    ],
    whenNotToUse: [
      "Skip Modal for routine create flows that have a dedicated page; route the user to the page instead.",
      "For persistent associated context where the underlying page stays readable, use Sheet on desktop or Drawer on mobile.",
      "Don't use Modal for low-stakes daily confirmations like saving drafts or discarding changes—the typed gate creates unnecessary friction.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default modal",
        description:
          "The most basic Modal usage: displays a standard dialog with a title, body copy, and action buttons overlaid on a dimmed mask to interrupt the user's current task.",
        demoKey: "default",
      },
      {
        id: "sticky",
        kind: "variant",
        title: "Sticky mode",
        description:
          "Uses the sticky variant to keep the bottom action bar pinned to the visible area at all times, ensuring action buttons remain clickable even when content overflows.",
        demoKey: "sticky",
      },
      {
        id: "inset",
        kind: "stateful",
        title: "Inset spacing",
        description:
          "Compose an inset surface with className, bodyClassName, and a content wrapper; Modal does not expose a component property named inset.",
        demoKey: "inset",
      },
      {
        id: "disabled-actions",
        kind: "advanced",
        title: "Disabled actions",
        description:
          "Demonstrates disabling the primary action button within a Modal, typically used while awaiting validation results or when prerequisites are not met, paired with visual feedback to communicate the reason for the disabled state.",
        demoKey: "disabled-actions",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Modal traps focus inside the dialog until closed, and returns focus to the trigger element, ensuring keyboard users don't lose their place on the page.",
        "Sets aria-labelledby to the Modal.Title id so screen readers announce the title on open.",
        "Enter must never trigger a destructive action without a typed confirmation; default focus should land on Cancel to prevent accidental triggers.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "The parent controls the Modal's open/close state entirely through the open prop; close should happen after the API settles or stay open on error for retry.",
        "Supports setting an initial focus target (e.g., focus-input-on-open) to direct focus into a specific input control inside the modal on open.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "On small viewports Modal remains centered and limits its width to the viewport minus 20 px.",
        "Content is capped at 80vh and scrolls; use BottomSheet when the experience should be a mobile bottom panel.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Modal's backdrop overlay color, content background, and button colors all follow theme tokens, automatically adapting for light and dark modes.",
        "Custom color schemes integrate seamlessly with design system token variables for consistent brand visuals.",
      ],
    },
  },
  "multi-select": {
    slug: "multi-select",
    locale: "en-US",
    summary: "A multi-select menu composed from a trigger, popover content, and checkbox rows.",
    whenToUse: [
      "When more than one option may be active, such as multi-value filters, tag selection, or multi-field configuration.",
      "When each row needs Only or Check All shortcuts and the page owns the selected state.",
    ],
    whenNotToUse: [
      "When only a single searchable selection is needed, use Combobox; Multi Select's semantics are designed for multiple values and should not be mixed.",
      "When there are very few (2–3) mutually exclusive options, a Toggle or Switch is more intuitive and doesn't require a complex dropdown-multi select component.",
    ],
    examples: [
      {
        id: "select-actions",
        kind: "minimal",
        title: "Select actions",
        description:
          "Shows MultiSelectRow toggle, select-only, and select-all callbacks; the page derives the trigger summary from external state.",
        demoKey: "select-actions",
      },
      {
        id: "keyboard-navigation",
        kind: "stateful",
        title: "Keyboard navigation",
        description:
          "Demonstrates navigating the option list via keyboard arrow keys, Tab, and Space for toggling selections, ensuring non-mouse users can interact efficiently.",
        demoKey: "keyboard-navigation",
      },
      {
        id: "controlled-state",
        kind: "advanced",
        title: "Controlled state",
        description:
          "The page owns the selected array and passes checked, onChange, onSelectOnly, and onSelectAll to each row for form or query integration.",
        demoKey: "controlled-state",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Each row checkbox and shortcut action has an aria-label containing the option name, so screen readers distinguish toggle, select-only, and select-all actions.",
        "Focus enters the dialog on open; Up/Down move across rows, Left/Right switch between checkbox and action, Tab cycles controls, and Popover handles Escape dismissal.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Multi Select does not own a selected array; the page passes checked and action callbacks to every MultiSelectRow.",
        "MultiSelectRoot controls only popover visibility through Radix Root open/defaultOpen/onOpenChange props.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "The root fills available width on small screens; content is at least trigger-width and caps its scroll area to the available viewport height.",
        "The trigger summary truncates to one line so long content cannot displace the trailing disclosure icon.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Highlighted color, border, and background of selected items are drawn from theme tokens; contrast meets accessibility requirements in both light and dark modes.",
        "Dropdown list background, scrollbar, and hover effects follow the current theme for a consistent visual style.",
      ],
    },
  },
  note: {
    slug: "note",
    locale: "en-US",
    summary:
      "Displays inline contextual feedback or additional information that requires attention, with semantic variants.",
    whenToUse: [
      "For inline contextual feedback next to the field, card, or section it describes, such as a region change warning, rate-limit notice, or usage gauge.",
      "When you need to display a persistent message inline until the underlying state changes, without escalating to a full-page banner or transient toast.",
      "When conveying different types of feedback through semantic variants (destructive, warning, success).",
    ],
    whenNotToUse: [
      "Pick Banner when the message is page-level or system-wide and needs a CTA, Toast for transient acknowledgments, Modal for destructive confirmations.",
      "One Note per concept. Stacking three Notes on a card means the page architecture, not the Note copy, is wrong.",
    ],
    examples: [
      {
        id: "sizes",
        kind: "variant",
        title: "Sizes",
        description:
          "Note offers multiple size variants to suit different layout density needs — compact fits dense table rows, standard works well between cards and paragraphs.",
        demoKey: "Sizes",
      },
      {
        id: "action",
        kind: "minimal",
        title: "With action",
        description:
          "Adds a call-to-action button or link within a Note so users can execute a follow-up action directly, such as viewing documentation or learning more details.",
        demoKey: "Action",
      },
      {
        id: "label",
        kind: "stateful",
        title: "With label",
        description:
          "Attaches a custom label to a Note for improved semantic clarity, displaying an icon and text label before the note body to help users quickly understand the meaning of the notice content.",
        demoKey: "Label",
      },
      {
        id: "custom-icon",
        kind: "advanced",
        title: "Custom icon",
        description:
          "Replaces the default icon slot with a custom SVG icon to meet brand-specific visual needs and provide richer contextual expression.",
        demoKey: "Custom icon",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Different variants (destructive, warning, success) convey semantics through color and icons, but color alone is insufficient — explicit text descriptions must accompany them.",
        "A Note is persistent rather than transient; its content is announced immediately by screen readers on page load.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Note is a purely presentational notification component with no internal interactive state. Its behavior is entirely driven by props (variant, icon, children), with no controlled/uncontrolled distinction.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Note's width adapts to its container, remaining legible and non-overflowing on narrow screens.",
        "Size variants (small/large) can be selected based on the density requirements of the surrounding area.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Each semantic variant color (destructive, warning, success, secondary, violet, cyan) is drawn from theme tokens, automatically adapting for light and dark mode contrast.",
        "Disabled Note state reduces opacity while retaining sufficient contrast for readability.",
      ],
    },
  },
  pagination: {
    slug: "pagination",
    locale: "en-US",
    summary:
      "Sequentially navigates through numbered pages of a dataset, ideal for articles, posts, and step sequences.",
    whenToUse: [
      "For sequential navigation between sibling pages (docs articles, blog posts, onboarding steps) where the user reads one page at a time.",
      "As a previous/next document rail when users need to advance or retreat through a series of pages.",
    ],
    whenNotToUse: [
      "To reveal more rows of the same data set, use Show More or a numbered pager instead of Pagination.",
      "When users must jump to numbered pages, use a data-table-specific numeric pager.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default pagination",
        description:
          "The most basic pagination usage: renders a set of page number links with a previous/next rail, highlights the currently active page, and keeps other pages as plain anchor links.",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        'Current page is rendered with the isActive property and carries aria-current="page" so screen readers announce the current page number.',
        "All page numbers are anchor button elements supporting keyboard navigation and Enter activation, ensuring accessibility for all users.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Controls the currently active page through the activePage prop; the parent can listen to page change callbacks to update routing or trigger data requests.",
        "Total page count is passed via the total prop, and the component auto-renders the corresponding set of page buttons.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "On small viewports automatically hides middle page buttons, keeping only the first, last, and pages near the current one for a compact layout.",
        "Previous / Next buttons hide themselves at sequence start or end rather than being visually disabled; an empty rail reads cleaner than a dimmed link.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The current page highlight background and text color follow theme tokens, remaining clear and discernible in dark mode.",
        "Divider and alignment styles are drawn from theme tokens, staying consistent with the overall design system.",
      ],
    },
  },
  phone: {
    slug: "phone",
    locale: "en-US",
    summary:
      "Frames mobile screenshots inside a realistic phone shell, suited for showcasing mobile app designs on marketing pages and docs.",
    whenToUse: [
      "Around mobile screenshots, recordings, and demo images on landing pages, docs, and introduction pages, using Phone as marketing chrome.",
      "When you need to show readers what a mobile app looks and feels like — the Phone frame provides a realistic mockup effect.",
    ],
    whenNotToUse: [
      "Don't render live mobile product UI inside the frame; the chrome implies a captured screenshot, not an interactive surface, and misleads users into thinking they can tap.",
      "If you only need to demonstrate web responsiveness, use the Browser component instead — Browser is better suited for webpage screenshots.",
    ],
    examples: [
      {
        id: "composition",
        kind: "minimal",
        title: "Composition",
        description:
          "Showcases the basic composition of the Phone component: a realistic phone shell framing an inner image, including status bar, rounded corners, and bezel decorations.",
        demoKey: "Composition",
      },
      {
        id: "colors",
        kind: "variant",
        title: "Colors",
        description:
          "Phone offers multiple color schemes for the outer frame, allowing you to pick a tone that matches your page theme for cohesive design consistency.",
        demoKey: "Colors",
      },
      {
        id: "dynamic-island",
        kind: "variant",
        title: "Dynamic Island",
        description:
          "Enables the Dynamic Island variant to showcase the latest iPhone's notch feature, ideal for marketing materials targeting modern iOS devices.",
        demoKey: "Dynamic Island",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The Phone chrome is marked as decorative (aria-hidden); accessible naming belongs on the inner screenshot — screen readers will read the alt text of the embedded screenshot.",
        "Set meaningful alt text on the inner mobile screenshot so screen reader users understand the screenshot's content and purpose.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Phone is a purely presentational chrome component with no internal interactive state or user interaction capability. It provides the visual shell of a phone; all content is determined entirely by the child elements and props passed to it.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "The Phone frame maintains its aspect ratio across viewports, ensuring the phone shape looks consistent regardless of screen size.",
        "The inner screenshot area scales proportionally with the container, though on wide screens a max-width constraint is typically recommended to avoid excessive stretching.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The Phone frame's color, shadow, and border-radius are drawn from theme tokens, automatically adapting to light and dark mode contrast requirements.",
        "The Safari Chrome variant's browser UI colors also follow the theme, maintaining a consistent visual style.",
      ],
    },
  },
};
