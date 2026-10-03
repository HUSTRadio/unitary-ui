import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_04_ZH: Record<string, ComponentGuide> = {
  "command-menu": {
    slug: "command-menu",
    locale: "zh-CN",
    summary: "搜索资源、跳转页面或执行命令的面板，支持键盘操作。",
    whenToUse: [
      "需要在应用中提供一个全局键盘快捷键（如 ⌘K / Ctrl+K）触发的命令面板来搜索资源、跳转页面或执行操作。",
      "菜单项数量可能超过大约 30 条，需要按类型或最近使用分组为多个页面，以避免单平铺列表过长。",
    ],
    whenNotToUse: [
      "如果菜单仅作用于单个可见触发元素上的上下文操作，应改用 Menu 组件；如果是行上右键操作，应改用 ContextMenu。",
      "如果需要为页面内某个过滤输入复用相同的快捷键绑定，不要将 ⌘K/Ctrl+K 同时绑给普通输入框——它是全局快捷键。",
    ],
    examples: [
      {
        id: "cmd-default",
        kind: "minimal",
        title: "基本命令面板",
        description: "渲染一个可搜索的命令面板；父级通过 open/setOpen 控制显示，并可按应用需要另行绑定全局快捷键。",
        demoKey: "default",
      },
      {
        id: "cmd-divider",
        kind: "variant",
        title: "带分隔符的命令面板",
        description: "在命令面板中使用分隔线区分不同功能组，提升视觉层次和浏览效率。",
        demoKey: "with-divider",
      },
      {
        id: "cmd-suffix",
        kind: "advanced",
        title: "带后缀标签的命令面板",
        description: "为命令项添加后缀标签显示辅助信息，例如快捷键提示或状态指示。",
        demoKey: "with-suffix",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "面板打开后焦点限制在内部；按 Escape 关闭，并将焦点返回触发按钮。",
        "每个命令项都应提供清晰的 Title Case 动词短语描述（例如 'Deploy Project'），避免使用歧义词汇。",
        "当输入为空时展示最近或默认项目集合，确保无输入状态下菜单仍然可用。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "CommandMenu 要求父级传入 open 和 setOpen 控制可见性；全局 ⌘K / Ctrl+K 监听也由应用层按需实现。",
        "命令项激活后执行调用方提供的动作；组件不把当前命令作为受控 value 暴露。",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "CommandMenu 为模态覆盖层，在不同屏幕尺寸下保持相似的表现形式，没有显著的响应式布局变化。",
    },
    themeBehavior: {
      status: "not-applicable",
      reason: "CommandMenu 遵循系统主题模式（深色/浅色），不针对特定主题状态做自定义布局调整。",
    },
  },
  "context-card": {
    slug: "context-card",
    locale: "zh-CN",
    summary: "悬停或聚焦时显示用户、部署等对象的补充信息。",
    whenToUse: [
      "需要在悬停或聚焦时揭示实体的元数据信息，例如用户头像旁的用户详情、部署名称旁的构建信息等。",
      "触发器通常为密集数据中的名称链接或头像，需要补充一行识别信息和 2–4 行的 Label: value 元数据。",
    ],
    whenNotToUse: [
      "如果只需一行简要解释而不含多行元数据，应改用 Tooltip 而非 Context Card。",
      "不要使用 Context Card 展示破坏性操作（如删除），因为鼠标移出可能导致面板在用户提交前被意外关闭。",
    ],
    examples: [
      {
        id: "ctx-default",
        kind: "minimal",
        title: "默认上下文卡片",
        description: "在触发元素悬停时显示包含实体名称、识别行和元数据行的基础上下文卡片。",
        demoKey: "default",
      },
      {
        id: "ctx-alignment",
        kind: "variant",
        title: "对齐方式变体",
        description: "演示上下文卡片相对于触发器的不同弹出对齐位置，以适配不同的空间布局需求。",
        demoKey: "alignment",
      },
      {
        id: "ctx-render-prop",
        kind: "advanced",
        title: "自定义渲染属性",
        description:
          "通过 render prop 完全自定义卡片的内部渲染逻辑，适用于需要特殊布局或非标准数据的场景。",
        demoKey: "render-prop",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "ContextCard 不限制焦点在卡片内。触发元素需可聚焦，按 Escape 可关闭卡片。",
        "触发元素需有自己的无障碍名称；卡片只提供补充信息。",
        "卡片内的内容不应重复触发元素已经展示的可见信息，避免信息冗余。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "ContextCard 根据鼠标悬停、聚焦等交互事件自动控制开闭状态，不提供外部值控制的 API。",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason: "ContextCard 为浮动覆盖卡片，通常在小区域内呈现，不涉及复杂的响应式布局调整。",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "上下文卡片支持深色/浅色主题，样式跟随 Unitary 设计系统的颜色变量自动适配用户偏好的配色方案。",
      ],
    },
  },
  "context-menu": {
    slug: "context-menu",
    locale: "zh-CN",
    summary: "右键点击或长按对象，打开相关操作菜单。",
    whenToUse: [
      "需要对行、文件或画布对象提供右键单击或长按触发的上下文快捷操作菜单。",
      "需要为同一操作同时提供右键菜单入口和可见的菜单触发器（按钮/图标），确保鼠标用户和键盘用户都有等效访问路径。",
    ],
    whenNotToUse: [
      "ContextMenu 绝不能是唯一的操作入口；必须将其镜像到可见的 Menu 触发器或行按钮中，否则键盘用户将无法访问。",
      "不要在页面上整个范围抑制原生浏览器菜单，只应在触发元素区域内抑制右键菜单。",
    ],
    examples: [
      {
        id: "ctxmenu-default",
        kind: "minimal",
        title: "基本右键菜单",
        description: "在触发区域右键点击，打开相关操作列表。",
        demoKey: "default",
      },
      {
        id: "ctxmenu-disabled",
        kind: "variant",
        title: "禁用菜单项",
        description: "演示在上下文菜单中禁用某些选项的使用场景，灰色显示不可操作的命令。",
        demoKey: "disabled-items",
      },
      {
        id: "ctxmenu-link",
        kind: "stateful",
        title: "链接菜单项",
        description: "菜单中包含链接类型的选项，点击后跳转到目标页面而非执行本地动作。",
        demoKey: "link-items",
      },
      {
        id: "ctxmenu-prefix-suffix",
        kind: "advanced",
        title: "前后缀菜单项",
        description: "为菜单项添加前缀和后缀，显示图标、状态指示或辅助信息以增强可操作性。",
        demoKey: "prefix-and-suffix",
      },
      {
        id: "ctxmenu-quick-actions",
        kind: "advanced",
        title: "快速操作",
        description:
          "触屏长按（或桌面右键）卡片弹出定宽竖排的快速操作列表：大图标 + 副标题，背景模糊遮罩，底部破坏性系统项用分隔线隔开，点击后先弹确认浮层（可取消）。",
        demoKey: "quick-actions",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "为每个菜单项设置语义化的 aria-label，确保屏幕阅读器能够正确朗读操作内容。",
        "桌面端绑定右键点击，移动端绑定长按触发；Windows/Linux 下 Shift+F10 同样可以打开同一菜单。",
        "在每个菜单项上使用 Title Case 动词 + 名词格式（例如 'Open in New Tab'、'Copy URL'、'Delete Deployment'）。",
        "破坏性系统项用红色语义标记，并在执行前请用户确认：确认浮层出现在菜单之外的独立位置、可取消（示例的 Remove App 流程）——HIG 要求红字与确认成对。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "ContextMenu 管理自身打开/关闭状态，不暴露外部值控制 API；激活任意项即关闭菜单。",
    },
    responsiveBehavior: {
      status: "covered",
      content: ["普通菜单项高度由 --uni-popover-row-height 控制，默认 36px；Quick Actions 使用独立的行布局。"],
    },
    themeBehavior: {
      status: "not-applicable",
      reason: "ContextMenu 跟随系统主题切换，不进行自定义的主题相关样式调整。",
    },
  },
  "copy-button": {
    slug: "copy-button",
    locale: "zh-CN",
    summary: "复制指定文本，并用图标反馈复制结果。",
    whenToUse: [
      "需要将一个简短字符串原样复制到剪贴板，例如令牌（token）、命令行指令、唯一标识符 ID。",
      "需要在复制完成后显示约 1.2 秒的打勾确认反馈，让用户明确感知复制操作已完成。",
    ],
    whenNotToUse: [
      "对于较长的代码块或多行文本，应使用完整的 Snippet 组件搭配其自带的复制功能，而不是单独使用 CopyButton。",
      "不要在图标按钮上省略 aria-label；屏幕阅读器无法通过纯图标理解按钮的功能意图。",
    ],
    examples: [
      {
        id: "copy-default",
        kind: "minimal",
        title: "基本复制按钮",
        description: "点击后将指定文本复制到剪贴板，并显示成功反馈图标。",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "为图标-only 按钮设置 aria-label 属性，使屏幕阅读器宣布具体操作含义（如 'Copy deployment URL'），而不仅是图标本身。",
        "优先使用 navigator.clipboard.writeText API，并附加隐藏的 textarea execCommand 降级方案，以兼容缺少剪贴板权限的环境。",
        "复制成功后保留约 1.2 秒的打勾视觉反馈，之后重置回原始状态以便下一次点击。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "CopyButton 内部管理复制成功的短暂视觉反馈状态，不暴露外部的受控 value/onChange API。",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason: "CopyButton 为小型图标按钮，在所有视口下保持一致的尺寸和行为。",
    },
    themeBehavior: {
      status: "not-applicable",
      reason: "CopyButton 的颜色和样式自动跟随 Unitary 设计系统主题变量适配当前配色方案。",
    },
  },
  description: {
    slug: "description",
    locale: "zh-CN",
    summary: "以键值对显示地区、套餐等元数据。",
    whenToUse: [
      "需要以定义列表展示元数据：短小的 Title Case 键名配对单一值（例如 'Last Deployed'、'Region'、'Plan'）。",
      "需要让 <dl>/<dt>/<dd> 语义结构被屏幕阅读器正确识别，每对 key/value 作为一个定义项朗读。",
    ],
    whenNotToUse: [
      "如果是在表单字段下方的行内帮助文字，应使用 input 的 helper-text slot 而非 Description 组件。",
      "不要将描述组件包裹在额外的段落标签中，这会破坏定义的列表语义结构。",
    ],
    examples: [
      {
        id: "desc-default",
        kind: "minimal",
        title: "默认定义列表",
        description: "左对齐显示一组键值对。",
        demoKey: "default",
      },
      {
        id: "desc-text-right",
        kind: "variant",
        title: "右对齐文本",
        description: "将描述值右对齐显示，适用于数值型或对齐有要求的元数据场景。",
        demoKey: "text-right",
      },
      {
        id: "desc-ellipsis",
        kind: "advanced",
        title: "省略号截断",
        description: "当值过长时使用省略号截断显示，配合 tooltip 展开查看详情以保持紧凑布局。",
        demoKey: "ellipsis",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Unitary 渲染 <dl>/<dt>/<dd> 原生 HTML 定义列表，屏幕阅读器会将每对键值作为一个定义单元朗读。",
        "键名使用 Title Case 名词格式，值使用句子大小写，除非是字面标识符、ID 或时间戳需保持原始格式。",
        "不要在键槽位放置交互控件；按钮、菜单和链接应放在值槽位或父级布局中。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "Description 只显示传入的键值对，没有内部状态。",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason: "Description 作为定义列表组件在各视口下表现一致，没有显著响应式行为变化。",
    },
    themeBehavior: {
      status: "not-applicable",
      reason: "Description 的排版和颜色由 Unitary 设计系统的主题变量自动处理，无需额外主题定制。",
    },
  },
};

export const GUIDES_04_EN: Record<string, ComponentGuide> = {
  "command-menu": {
    slug: "command-menu",
    locale: "en-US",
    summary:
      "Search resources, navigate to pages, or run commands from a panel with keyboard support.",
    whenToUse: [
      "Provide a global keyboard shortcut (⌘K on macOS, Ctrl+K elsewhere) triggered command palette to search resources, navigate pages, or execute actions across the application.",
      "When menu item count could exceed roughly 30 items that would span multiple categories or recent usage, group them into separate pages rather than presenting a single flat list.",
    ],
    whenNotToUse: [
      "If the menu only serves contextual actions on a single visible trigger element, use Menu instead; for right-click row actions, use ContextMenu.",
      "Do not reuse the ⌘K/Ctrl+K binding for any in-page filter input—it is reserved as a global shortcut.",
    ],
    examples: [
      {
        id: "cmd-default",
        kind: "minimal",
        title: "Basic command palette",
        description:
          "Renders a searchable command palette whose visibility is controlled by the parent through open/setOpen; the app may bind a global shortcut separately.",
        demoKey: "default",
      },
      {
        id: "cmd-divider",
        kind: "variant",
        title: "Command palette with dividers",
        description:
          "Uses separators to distinguish different functional groups in the command palette, improving visual hierarchy and browsing efficiency.",
        demoKey: "with-divider",
      },
      {
        id: "cmd-suffix",
        kind: "advanced",
        title: "Command palette with suffix labels",
        description:
          "Adds suffix labels to command items to show auxiliary information such as keyboard shortcuts or status indicators.",
        demoKey: "with-suffix",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Keep focus inside the open panel. Escape closes it and returns focus to the trigger.",
        "Each command item should provide a clear Title Case verb phrase description (e.g., 'Deploy Project'), avoiding ambiguous phrasing.",
        "Show a recent or default item set when the input is empty so the menu is useful before typing.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "CommandMenu requires the parent to provide open and setOpen; any global ⌘K / Ctrl+K listener is also implemented at the application layer.",
        "Activating a command runs the caller-provided action; the component does not expose the current command as a controlled value.",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "CommandMenu is a modal overlay that maintains a similar appearance across different screen sizes, without significant responsive layout changes.",
    },
    themeBehavior: {
      status: "not-applicable",
      reason:
        "CommandMenu follows system theme mode (dark/light) and does not perform custom layout adjustments for specific theme states.",
    },
  },
  "context-card": {
    slug: "context-card",
    locale: "en-US",
    summary:
      "Show details about a user, deployment, or other item on hover or focus.",
    whenToUse: [
      "Reveal entity metadata on hover or focus: a user detail near their avatar, build info next to a deployment name, or project stats beside a link.",
      "The trigger is typically a name link or avatar in dense data tables; the card supplements with one identifying line and 2–4 Label: value metadata rows.",
    ],
    whenNotToUse: [
      "For a one-line explanation without metadata rows, use Tooltip instead of Context Card.",
      "Do not use Context Card to surface destructive actions—the panel can dismiss on cursor exit before the user commits.",
    ],
    examples: [
      {
        id: "ctx-default",
        kind: "minimal",
        title: "Default context card",
        description:
          "Shows a basic context card on trigger hover, displaying entity name, an identifying line, and metadata rows.",
        demoKey: "default",
      },
      {
        id: "ctx-alignment",
        kind: "variant",
        title: "Alignment variants",
        description:
          "Demonstrates different popup alignment positions of the context card relative to the trigger to fit varying spatial layouts.",
        demoKey: "alignment",
      },
      {
        id: "ctx-render-prop",
        kind: "advanced",
        title: "Custom render prop",
        description:
          "Fully customizes the internal rendering logic of the card through a render prop, suitable for special layouts or non-standard data scenarios.",
        demoKey: "render-prop",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "ContextCard does not trap focus. Keep its trigger focusable; Escape closes the card.",
        "Give the trigger its own accessible name; the card provides supporting information.",
        "Content in the card should not restate what the trigger already displays visibly, avoiding information redundancy.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "ContextCard controls its own open/close state based on mouse hover, focus, and other interaction events; it does not expose an external value-controlled API.",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "ContextCard is a floating overlay card rendered in a small area, and does not involve complex responsive layout adjustments.",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Context Card supports dark and light themes, with styles automatically adapting to the user's preferred color scheme following the Unitary design system color tokens.",
      ],
    },
  },
  "context-menu": {
    slug: "context-menu",
    locale: "en-US",
    summary:
      "Right-click or long-press an item to open its action menu.",
    whenToUse: [
      "Provide right-click or long-press contextual shortcut action menus on rows, files, or canvas objects.",
      "Mirror every menu action in both the right-click menu and a visible Menu trigger or row button, ensuring parity between mouse-only and keyboard-only users.",
    ],
    whenNotToUse: [
      "ContextMenu must never be the only entry point for an action—always mirror items in a visible Menu trigger or row button so keyboard users have equivalent access.",
      "Suppress the native browser menu only on the trigger area, not the entire page.",
    ],
    examples: [
      {
        id: "ctxmenu-default",
        kind: "minimal",
        title: "Basic context menu",
        description:
          "Right-click the trigger area to open its action list.",
        demoKey: "default",
      },
      {
        id: "ctxmenu-disabled",
        kind: "variant",
        title: "Disabled menu items",
        description:
          "Demonstrates disabling certain options in the context menu, shown in grayed-out text for inoperative commands.",
        demoKey: "disabled-items",
      },
      {
        id: "ctxmenu-link",
        kind: "stateful",
        title: "Link menu items",
        description:
          "Includes link-type options in the menu that navigate to a target page instead of executing a local action on click.",
        demoKey: "link-items",
      },
      {
        id: "ctxmenu-prefix-suffix",
        kind: "advanced",
        title: "Prefix and suffix menu items",
        description:
          "Adds prefix icons and suffix labels to menu items, showing status indicators or auxiliary information to enhance operability.",
        demoKey: "prefix-and-suffix",
      },
      {
        id: "ctxmenu-quick-actions",
        kind: "advanced",
        title: "Quick Actions",
        description:
          "A fixed-width vertical Quick Actions list on long-press (or right-click): large icons with subtitles over a blurred backdrop, with the destructive system item separated at the bottom and its confirmation opened before it runs.",
        demoKey: "quick-actions",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Set semantic aria-labels on each menu item to ensure screen readers correctly announce the action content.",
        "Bind to right-click on desktop and long-press on touch; Shift+F10 on Windows/Linux opens the same menu without right-click.",
        "Follow the same Title Case Verb + Noun format for menu items as Menu (e.g., 'Open in New Tab', 'Copy URL', 'Delete Deployment').",
        "Destructive system items carry red semantics and ask for confirmation before running: the confirmation appears outside the menu and can be cancelled (the Remove App flow in the example) — HIG requires the red text and the confirmation as a pair.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "ContextMenu manages its own open/closed state internally and does not expose an external value-controlled API; activating any item closes the menu.",
    },
    responsiveBehavior: {
      status: "covered",
      content: ["Ordinary menu item height follows --uni-popover-row-height, defaulting to 36px; Quick Actions uses an independent row layout."],
    },
    themeBehavior: {
      status: "not-applicable",
      reason:
        "ContextMenu follows system theme switching without performing custom theme-related style adjustments.",
    },
  },
  "copy-button": {
    slug: "copy-button",
    locale: "en-US",
    summary:
      "Copy text and show the result with an icon.",
    whenToUse: [
      "Copy a short string verbatim to the clipboard, such as a token, a command-line instruction, or a unique identifier ID.",
      "Display a checkmark confirmation for about 1.2 seconds after copying succeeds, so the user clearly perceives the copy action is done.",
    ],
    whenNotToUse: [
      "For longer code blocks or multiline text, use a full Snippet component with its built-in copy affordance instead of a standalone CopyButton.",
      "Never omit aria-label on an icon-only button—screen readers cannot infer functionality from the icon alone.",
    ],
    examples: [
      {
        id: "copy-default",
        kind: "minimal",
        title: "Basic copy button",
        description:
          "Clicking copies specified text to the clipboard and shows a success feedback icon.",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Set the aria-label attribute on icon-only buttons so screen readers announce the specific action meaning (e.g., 'Copy deployment URL') rather than just the icon itself.",
        "Prefer navigator.clipboard.writeText API with a hidden-textarea execCommand fallback so copying still works where clipboard permissions are missing.",
        "Retain the checkmark feedback for about 1.2 seconds after a successful copy, then reset to the original state for the next click.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "CopyButton manages its own brief visual feedback state after copying; it does not expose an external value-controlled onChange API.",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "CopyButton is a small icon button that maintains consistent size and behavior across all viewports.",
    },
    themeBehavior: {
      status: "not-applicable",
      reason:
        "CopyButton colors and styles automatically adapt to the current color scheme following the Unitary design system theme tokens.",
    },
  },
  description: {
    slug: "description",
    locale: "en-US",
    summary:
      "Display metadata, such as region or plan, as key–value pairs.",
    whenToUse: [
      "Present metadata as a definition list: a short Title Case key paired with a single value (e.g., 'Last Deployed', 'Region', 'Plan').",
      "Need the <dl>/<dt>/<dd> semantic HTML structure recognized by screen readers, reading each key/value pair as one definition unit.",
    ],
    whenNotToUse: [
      "For inline help text below a form field, use the input's helper-text slot instead of the Description component.",
      "Do not wrap the Description component in extra paragraph tags, as this breaks the definition list semantics.",
    ],
    examples: [
      {
        id: "desc-default",
        kind: "minimal",
        title: "Default definition list",
        description:
          "Display a left-aligned list of key–value pairs.",
        demoKey: "default",
      },
      {
        id: "desc-text-right",
        kind: "variant",
        title: "Right-aligned text",
        description:
          "Aligns description values to the right, suitable for numeric or alignment-sensitive metadata scenarios.",
        demoKey: "text-right",
      },
      {
        id: "desc-ellipsis",
        kind: "advanced",
        title: "Ellipsis truncation",
        description:
          "Truncates overflow values with ellipsis display, paired with a tooltip to expand and view details while maintaining compact layout.",
        demoKey: "ellipsis",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Unitary renders <dl>/<dt>/<dd> native HTML definition list structure, where screen readers read each key-value pair as a definition unit.",
        "Keys use Title Case noun format, values use sentence case unless they are literal identifiers, IDs, or timestamps that should be preserved verbatim.",
        "Do not place interactive controls in the key slot; buttons, menus, and links belong in the value slot or parent layout.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Description displays the supplied key–value pairs and has no internal state.",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "Description as a definition list component behaves consistently across all viewports without significant responsive behavior changes.",
    },
    themeBehavior: {
      status: "not-applicable",
      reason:
        "Description typography and colors are handled automatically by the Unitary design system theme tokens, requiring no additional theme customization.",
    },
  },
};
