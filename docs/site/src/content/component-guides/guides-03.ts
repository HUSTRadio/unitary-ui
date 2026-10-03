import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_03_ZH: Record<string, ComponentGuide> = {
  "clearable-input": {
    slug: "clearable-input",
    locale: "zh-CN",
    summary: "带 Esc 清除按钮的输入框，可点击按钮或按 Escape 清空。",
    whenToUse: [
      "用户在搜索、过滤或短查询字段中频繁需要清除当前输入值。",
      "需要一种不增加额外按钮空间的快速回退方式，让用户一键还原到空白状态。",
    ],
    whenNotToUse: [
      "表单字段的值不应轻易被清除，比如关键身份验证信息；应使用明确的 Delete 按钮来确认删除操作。",
      "当输入内容较长且用户可能希望部分保留时；截断和粘贴（Middle Truncate）更适合展示型场景。",
    ],
    examples: [
      {
        id: "clearable-input-default",
        kind: "minimal",
        title: "默认可清空输入框",
        description: "不带标签的基础 Clearable Input，展示输入区域及其内联清除键帽。",
        demoKey: "default",
      },
      {
        id: "clearable-input-with-label",
        kind: "minimal",
        title: "带标签的可清空输入框",
        description: "关联可见标签和输入框；按 Escape 仍可清空。",
        demoKey: "with-label",
      },
      {
        id: "clearable-input-with-cmdk",
        kind: "variant",
        title: "与命令菜单集成的可清空输入框",
        description: "在 Command Menu 等命令面板场景中用作搜索输入框，提供 CmdK 风格的键盘交互。",
        demoKey: "with-cmdk",
      },
      {
        id: "clearable-input-disabled",
        kind: "stateful",
        title: "禁用状态的可清空输入框",
        description: "展示输入框不可编辑时的视觉状态；禁止交互而非仅仅隐藏清除图标。",
        demoKey: "disabled",
      },
      {
        id: "clearable-input-with-clear-callback",
        kind: "stateful",
        title: "带清空回调的可清空输入框",
        description:
          "通过 onChange 处理程序监听值的变化，便于在清空后执行自定义逻辑，如重置搜索结果。",
        demoKey: "with-clear-callback",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "为原生输入设置可见标签，确保屏幕阅读器能够正确读取。",
        "清除按钮作为输入的一部分，不需要额外的 aria-label；Escape 键从输入本身即可触发清除。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Clearable Input 受控行为由其父级 input 的值和 onChange 驱动。",
        "传入 value 和 onChange 可实现完全受控模式；点击清除键帽或按 Escape 会沿原生 input 事件路径清空，并在之后调用可选的 onClear。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "宽度由父容器或 layout 控制，可设置固定宽度、最大/最小宽度或 flex。",
        "CmdK 快捷键后缀在窄视口隐藏；清除键帽按钮在粗指针设备隐藏，键盘用户仍可从输入框按 Escape 清空。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "跟随设计系统颜色变量，在不同主题下自动适配边框、文字和背景颜色。",
        "清除键帽继承主题前景色，并在悬停和聚焦时使用同一套语义颜色变量。",
      ],
    },
  },
  code: {
    slug: "code",
    locale: "zh-CN",
    summary: "Code 显示可横向滚动的代码块；InlineCode 显示正文中的短代码。",
    whenToUse: [
      "用 Code 展示轻量的块级代码片段，并通过 syntax 挂接语言高亮。",
      "在正文中引用变量名、函数名或文件路径时使用同模块导出的 InlineCode。",
    ],
    whenNotToUse: [
      "需要文件名头、行号或增删行标记时，请改用功能更完整的 Code Block。",
      "当内容不是有效的代码或标记语言时；Code 组件会应用代码着色样式，错误的内容会产生误导性的视觉效果。",
    ],
    examples: [
      {
        id: "code-default",
        kind: "minimal",
        title: "块级与行内代码",
        description: "在同一示例中展示块级 Code 和正文内的 InlineCode。",
        demoKey: "Default",
      },
      {
        id: "code-nested",
        kind: "variant",
        title: "富文本中的 InlineCode",
        description:
          "在列表、链接和引用块等富文本结构中使用 InlineCode，保持正文流不被块级容器打断。",
      },
    ],
    accessibility: {
      status: "not-applicable",
      reason:
        "Code 输出 <pre><code> 语义，InlineCode 输出 <code>；两者均不包含交互控件，无需额外 ARIA。",
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "Code 只显示代码，不管理交互状态，也不提供 value/onChange。",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason: "Code 使用 overflow-x-auto 保留预格式化内容并在溢出时横向滚动；InlineCode 则随父级正文排版。",
    },
    themeBehavior: {
      status: "covered",
      content: ["语法高亮颜色遵循设计系统的代码颜色变量，支持浅色和深色主题下的正确显示。"],
    },
  },
  "code-block": {
    slug: "code-block",
    locale: "zh-CN",
    summary: "展示多行高亮代码，支持文件名、行号和变更标记。",
    whenToUse: [
      "展示多行、需要语法着色的源代码，读者可能需要逐行扫描或复制粘贴。",
      "当代码示例有明确的粘贴目的地时（如 src/App.tsx、vite.config.ts），利用文件名头增强上下文清晰度。",
    ],
    whenNotToUse: [
      "对于单行内联代码标识符（环境变量名、函数名、文件路径），请使用 InlineCode 组件，它不会产生多余的边框占用。",
      "当需要展示可运行的完整应用程序而不是代码片段时；请使用 Snippet 并配以复制按钮。",
    ],
    examples: [
      {
        id: "code-block-default",
        kind: "minimal",
        title: "默认代码块",
        description: "基础 Code Block 渲染：带边框、文件名头和多行语法高亮。",
        demoKey: "default",
      },
      {
        id: "code-block-no-filename",
        kind: "minimal",
        title: "无文件名的代码块",
        description: "适用于临时示例代码，省略文件名头以保持简洁。",
        demoKey: "no-filename",
      },
      {
        id: "code-block-highlighted-lines",
        kind: "advanced",
        title: "高亮特定行的代码块",
        description: "突出讨论中的行以引导读者注意力；只有相关行被高亮才有效果。",
        demoKey: "highlighted-lines",
      },
      {
        id: "code-block-added-removed",
        kind: "advanced",
        title: "添加和删除行标注的代码块",
        description: "用绿色和红色分别标注新增和被删除的行，清晰呈现 diff 式的变更。",
        demoKey: "added-removed-lines",
      },
      {
        id: "code-block-language-switcher",
        kind: "advanced",
        title: "带语言切换器和选项卡的代码块",
        description: "多语言 Tab 页签 + 动态语言切换，让读者查看同一代码的不同语言版本。",
        demoKey: "language-switcher-with-tabs",
      },
    ],
    accessibility: {
      status: "not-applicable",
      reason:
        "Code Block 是代码展示容器，不包含可交互的 UI 控件；行号和语法着色不参与无障碍树播报。",
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Code Block 是纯展示组件，没有 value / onChange 或展开/折叠状态的控制接口；其内容始终静态渲染。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "代码块在小视口上使用水平滚动以避免换行破坏语法结构，同时保持行号的正确对齐。",
        "文件名头和内容区域会根据可用宽度自适应间距，在大屏幕上保持紧凑的阅读节奏。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "边框颜色、背景色和内边距随设计系统的颜色和令牌变量自动适配浅色与深色主题。",
        "语法高亮颜色与主题的代码调色板保持一致，确保不同主题下的高对比度和可读性。",
      ],
    },
  },
  collapse: {
    slug: "collapse",
    locale: "zh-CN",
    summary:
      "按标题展开或收起补充内容，如常见问题和高级设置。",
    whenToUse: [
      "可选的、高级的或重复出现的内容——常见问题解答、高级设置、请求负载预览——大多数用户在首次访问时会跳过这些内容。",
      "需要在同一个页面中容纳大量信息，但又不想一开始就淹没主要内容，可以使用 Collapse 进行按需展开。",
    ],
    whenNotToUse: [
      "当内容对每个用户都至关重要时；应使用页面章节和普通标题，把核心内容折叠起来等于隐藏了页面的主旨。",
      "不要在封闭的 Collapse 内部放置主要的危险操作；用户需要两次点击才能到达警告信息，降低了安全性。",
    ],
    examples: [
      {
        id: "collapse-default",
        kind: "minimal",
        title: "默认折叠面板",
        description: "初始状态为关闭的 Collapse，标题采用 Title Case 命名主题而非动作。",
        demoKey: "default",
      },
      {
        id: "collapse-expanded",
        kind: "variant",
        title: "展开状态的折叠面板",
        description: "演示 Collapse 打开后的状态及内容区域的平滑过渡动画。",
        demoKey: "expanded",
      },
      {
        id: "collapse-multiple",
        kind: "advanced",
        title: "允许多个面板同时展开的折叠面板",
        description: "multiple 模式允许同时展开多个面板，适合常见问题列表。",
        demoKey: "multiple",
      },
      {
        id: "collapse-small",
        kind: "variant",
        title: "紧凑尺寸的折叠面板",
        description: "小尺寸变体，适用于密集布局或侧边栏等空间受限的场景。",
        demoKey: "small",
      },
      {
        id: "collapse-plus",
        kind: "variant",
        title: "加号图标的折叠面板",
        description:
          "icon=\"plus\" 时指示图标展开逆时针旋转 45° 变成 ×（高频微反馈档位），适合 FAQ 这类「展开更多」的语义。",
        demoKey: "plus",
      },
      {
        id: "collapse-disabled",
        kind: "advanced",
        title: "禁用状态的折叠面板",
        description:
          "disabled 时整行（文本与图标）降不透明度并切换 not-allowed 光标，aria-disabled 与阻止展开的语义保持不变。",
        demoKey: "disabled",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "触发器是 <button> 元素，配有 aria-expanded 属性在切换时翻转，以及 aria-controls 指向内容区域的 ID。",
        "关闭状态下面板内容仍然存在于 DOM 中（通过 hidden 或 visibility 隐藏），这样搜索和查找仍能命中。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Collapse 支持通过 open 受控模式和 onOpenChange 回调实现外部状态管理，开发者可以在父组件中控制面板是否展开。",
        "未受控使用时，内部状态自行维护开/关切换；推荐在有多个 Collapse 时使用受控模式以精确管理展开集合。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "折叠面板在小视口上自动增大触控目标尺寸，确保触摸设备的可操作性。",
        "多面板模式在不同屏幕宽度下保持一致的多选行为，不会因布局变化而改变交互逻辑。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "展开/收起的过渡动画速度、箭头方向图标等视觉细节随设计系统令牌变量一致。",
        "分隔线和边框颜色在不同主题下自动适配。",
      ],
    },
  },
  combobox: {
    slug: "combobox",
    locale: "zh-CN",
    summary: "通过输入搜索并选择一个选项。",
    whenToUse: [
      "当一个选项列表很长，通过输入过滤能显著提升用户找到目标的效率时；对于短小有固定数量的列表，Select 更合适。",
      "需要在选择的同时保持搜索查询的独立状态，这样重新打开列表不会擦除已选值。",
    ],
    whenNotToUse: [
      "对于简单的二元选择（开关/启用/禁用），应该使用 Toggle 而不是 Combobox；组合框的交互成本过高。",
      "需要多选时使用 MultiSelect；Combobox 只支持单选。",
    ],
    examples: [
      {
        id: "combobox-uncontrolled",
        kind: "minimal",
        title: "非受控组合框",
        description: "基础的非受控 Combobox，内部状态自行管理选择和查询值。",
        demoKey: "uncontrolled",
      },
      {
        id: "combobox-controlled",
        kind: "stateful",
        title: "受控组合框",
        description: "通过 value 和 onValueChange 外部控制选中值；搜索查询仍由组件内部维护。",
        demoKey: "controlled",
      },
      {
        id: "combobox-disabled",
        kind: "variant",
        title: "禁用的组合框",
        description: "展示 Combobox 不可交互时的视觉状态，防止用户进行选择。",
        demoKey: "disabled",
      },
      {
        id: "combobox-sizes",
        kind: "minimal",
        title: "不同尺寸的组合框",
        description: "展示 Combobox 提供的尺寸变体（small、medium、large），适配不同布局密度。",
        demoKey: "sizes",
      },
      {
        id: "combobox-with-label",
        kind: "minimal",
        title: "带标签的组合框",
        description: "Label 与输入关联，保证辅助技术正确读出字段名称。",
        demoKey: "with-label",
      },
      {
        id: "combobox-cleared",
        kind: "stateful",
        title: "可清空的组合框",
        description: "清除模式下，用户可以清空已选值回到初始状态。",
        demoKey: "clearable",
      },
      {
        id: "combobox-errored",
        kind: "stateful",
        title: "带错误状态的组合框",
        description: "在无效选择或验证失败时为输入文字和图标应用错误颜色；错误说明由页面另行提供。",
        demoKey: "errored",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Combobox 结合输入和列表的原生语义，支持键盘导航：面板关闭时上/下/Home/End 会先展开列表，打开后上/下箭头移动高亮，Home/End 跳转首尾项，Enter 提交当前高亮项。",
        "输入字符会实时过滤选项；打开后首个可见项高亮，筛选变化时高亮保持在可见集合内。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Combobox 的选中值支持 value/onValueChange 受控模式，也支持 defaultValue 非受控模式。",
        "搜索查询由组件内部维护；ComboboxInput 的 onChange 可观察输入变化，但当前没有受控 query prop。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "下拉列表默认放在输入框下方 8px 并左对齐输入表面；视口空间不足时自动翻转并避让边界，滚动或窗口缩放时实时跟随。",
        "输入框宽度可通过 layout 或兼容的 width prop 设置；下拉列表至少跟随输入框宽度，并可通过 maxWidth 扩大。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "边框、焦点环、选中项背景和下拉列表阴影均自动适配设计系统的颜色和令牌变量。",
        "深色主题下的高对比度配色确保文本可阅读性。",
      ],
    },
  },
};

export const GUIDES_03_EN: Record<string, ComponentGuide> = {
  "clearable-input": {
    slug: "clearable-input",
    locale: "en-US",
    summary: "A text input with an Esc button; click it or press Escape to clear the value.",
    whenToUse: [
      "Users frequently need to reset the current value in search, filter, or short query fields.",
      "You need a fast way to clear the input without adding an extra button to the layout; the inline clear icon serves as a low-friction reset affordance.",
    ],
    whenNotToUse: [
      "When the field value must not be easily cleared, such as sensitive authentication credentials; use an explicit Delete button that requires confirmation instead.",
      "When users may want to partially retain long input; Middle Truncate is better suited for display-only truncation of long identifiers.",
    ],
    examples: [
      {
        id: "clearable-input-default",
        kind: "minimal",
        title: "Default clearable input",
        description:
          "A base Clearable Input without a label, showing the input area and its inline clear keycap.",
        demoKey: "default",
      },
      {
        id: "clearable-input-with-label",
        kind: "minimal",
        title: "Clearable input with label",
        description:
          "Associate the visible label with the input; Escape still clears it.",
        demoKey: "with-label",
      },
      {
        id: "clearable-input-with-cmdk",
        kind: "variant",
        title: "Clearable input integrated with command menu",
        description:
          "Used as a search input in command menus like Command Menu, providing CmdK-style keyboard interaction patterns.",
        demoKey: "with-cmdk",
      },
      {
        id: "clearable-input-disabled",
        kind: "stateful",
        title: "Disabled clearable input",
        description:
          "Displays the disabled visual state of the input; the entire field becomes inert, not just the clear icon.",
        demoKey: "disabled",
      },
      {
        id: "clearable-input-with-clear-callback",
        kind: "stateful",
        title: "Clearable input with clear callback",
        description:
          "Leverages the onChange handler to detect when the value is cleared, enabling custom post-clear logic such as resetting filtered results.",
        demoKey: "with-clear-callback",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Provide a visible label associated with the native input so screen readers announce the field name correctly.",
        "The clear icon is part of the input experience; Escape clears from the input itself without requiring an extra accessible element.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Clearable Input's controlled behavior is driven by the parent input's value and onChange.",
        "Pass value and onChange for fully controlled mode; activating the clear keycap or pressing Escape clears through the native input event path, then calls optional onClear.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Width is controlled by the parent or layout, including fixed, min/max, and flex constraints.",
        "The CmdK shortcut suffix hides on narrow viewports; the clear keycap button hides on coarse-pointer devices while keyboard users can still press Escape from the input.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Follows design system color variables to adapt border, text, and background colors automatically across themes.",
        "The clear keycap inherits semantic foreground colors and uses the same theme tokens for hover and focus states.",
      ],
    },
  },
  code: {
    slug: "code",
    locale: "en-US",
    summary:
      "Code displays a horizontally scrollable code block; InlineCode displays short code within text.",
    whenToUse: [
      "Use Code for a lightweight block-level snippet and pass syntax to attach language highlighting.",
      "Use the module's InlineCode export for variable names, function names, or file paths inside prose.",
    ],
    whenNotToUse: [
      "Use the richer Code Block when the example needs a filename header, line numbers, or added/removed line treatment.",
      "When the content is not valid code or markup; applying Code's syntax coloring to arbitrary text produces misleading visual effects.",
    ],
    examples: [
      {
        id: "code-default",
        kind: "minimal",
        title: "Block and inline code",
        description: "Shows block-level Code and InlineCode embedded in prose in one example.",
        demoKey: "Default",
      },
      {
        id: "code-nested",
        kind: "variant",
        title: "InlineCode in rich text",
        description:
          "Use InlineCode in lists, links, and block quotes without introducing a block-level container.",
      },
    ],
    accessibility: {
      status: "not-applicable",
      reason:
        "Code renders <pre><code> semantics and InlineCode renders <code>; neither contains interactive controls or needs additional ARIA.",
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Code displays code without interactive state or value/onChange props.",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "Code preserves preformatted content and uses overflow-x-auto when it exceeds the container; InlineCode follows the surrounding prose layout.",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Syntax highlighting colors follow the design system's code color tokens, displaying correctly under both light and dark themes.",
      ],
    },
  },
  "code-block": {
    slug: "code-block",
    locale: "en-US",
    summary:
      "Display highlighted code with filenames, line numbers, and change markers.",
    whenToUse: [
      "Displaying multi-line, syntax-highlighted source code that the reader needs to scan line by line or copy and paste.",
      "When the code snippet has a known paste destination (like src/App.tsx or vite.config.ts), use the filename header to reinforce context clarity.",
    ],
    whenNotToUse: [
      "For single-line inline code identifiers (environment variable names, function names, file paths), use the InlineCode component, which avoids the unnecessary visual weight of a bordered block.",
      "When presenting a runnable complete application rather than a code excerpt; use Snippet with its built-in copy affordance instead.",
    ],
    examples: [
      {
        id: "code-block-default",
        kind: "minimal",
        title: "Default code block",
        description:
          "A base Code Block render: bordered, with filename header and multi-line syntax highlighting.",
        demoKey: "default",
      },
      {
        id: "code-block-no-filename",
        kind: "minimal",
        title: "Code block without filename",
        description:
          "Suitable for ephemeral example snippets; omitting the filename header keeps the presentation clean and uncluttered.",
        demoKey: "no-filename",
      },
      {
        id: "code-block-highlighted-lines",
        kind: "advanced",
        title: "Code block with highlighted lines",
        description:
          "Highlights only the lines under discussion to draw the reader's attention; effective when selective lines are emphasized, not every line.",
        demoKey: "highlighted-lines",
      },
      {
        id: "code-block-added-removed",
        kind: "advanced",
        title: "Code block with added and removed line annotations",
        description:
          "Uses green and red annotations to indicate added and deleted lines, clearly presenting diff-style changes.",
        demoKey: "added-removed-lines",
      },
      {
        id: "code-block-language-switcher",
        kind: "advanced",
        title: "Code block with language switcher and tabs",
        description:
          "Multi-language tabbed interface with dynamic language switching, letting readers view different language versions of the same code.",
        demoKey: "language-switcher-with-tabs",
      },
    ],
    accessibility: {
      status: "not-applicable",
      reason:
        "Code Block is a code display container with no interactive UI controls; line numbers and syntax colors do not participate in the accessibility tree announcements.",
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Code Block is a pure presentation component with no value/onChange props or expand/collapse control interfaces; its content is always statically rendered.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "On small viewports, the code block scrolls horizontally to avoid line breaks that would break syntax readability, while maintaining correct line number alignment.",
        "The filename header and content area adapt spacing based on available width, keeping a compact reading rhythm on wider screens.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Border color, background color, and padding automatically adapt to light and dark themes via design system color tokens.",
        "Syntax highlighting colors stay consistent with the theme's code palette, ensuring high contrast and readability across themes.",
      ],
    },
  },
  collapse: {
    slug: "collapse",
    locale: "en-US",
    summary:
      "Expand or collapse supporting content, such as FAQs and advanced settings, under a heading.",
    whenToUse: [
      "Optional, advanced, or repetitive content that most users skip on most visits: FAQs, advanced settings, request payload previews.",
      "When you need to accommodate large amounts of information on one page without burying the main content under the weight of exposition.",
    ],
    whenNotToUse: [
      "When content is critical for every user; use page sections with regular headings instead. Collapsing essential content hides what the page is about.",
      "Don't put primary destructive actions inside a closed Collapse; the user has to click twice to reach the warning, reducing safety.",
    ],
    examples: [
      {
        id: "collapse-default",
        kind: "minimal",
        title: "Default collapse panel",
        description:
          "A Collapse with a closed default state; headings use Title Case to name the topic rather than the action.",
        demoKey: "default",
      },
      {
        id: "collapse-expanded",
        kind: "variant",
        title: "Expanded collapse panel",
        description:
          "Demonstrates the expanded state of a Collapse panel along with the smooth transition animation when opening content.",
        demoKey: "expanded",
      },
      {
        id: "collapse-multiple",
        kind: "advanced",
        title: "Multi-open collapse panel",
        description:
          "multiple allows several panels to stay open, useful for FAQs.",
        demoKey: "multiple",
      },
      {
        id: "collapse-small",
        kind: "variant",
        title: "Compact-size collapse panel",
        description:
          "Small-size variant optimized for dense layouts or constrained spaces like sidebars where vertical room is limited.",
        demoKey: "small",
      },
      {
        id: "collapse-plus",
        kind: "variant",
        title: "Plus-icon collapse panel",
        description:
          "With icon=\"plus\" the indicator rotates 45° counter-clockwise into an × (high-frequency feedback tier), matching the \"reveal more\" reading of FAQ panels.",
        demoKey: "plus",
      },
      {
        id: "collapse-disabled",
        kind: "advanced",
        title: "Disabled collapse panel",
        description:
          "When disabled, the whole row (text and icon) drops opacity and switches to a not-allowed cursor; aria-disabled and the blocked toggle semantics stay intact.",
        demoKey: "disabled",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The trigger is a <button> with aria-expanded that flips on toggle, and aria-controls pointing at the content panel's id.",
        "Panel content remains in the DOM even when closed (via hidden or visibility style), so search and find-in-page still locate it.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Collapse supports externally controlled open state via the open prop and onOpenChange callback; developers can manage whether a panel is expanded from the parent component.",
        "In uncontrolled mode, internal state manages open/close toggling independently; controlled mode is recommended when multiple Collapses coexist on a page to precisely manage the expansion set.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Collapse panels automatically increase touch target sizes on small viewports to ensure tap operability on mobile devices.",
        "Multiple panel mode maintains consistent multi-selection behavior across screen sizes without altering the interaction logic due to layout changes.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Transition animation speed, arrow direction icons, and other visual details stay consistent with design system tokens.",
        "Divider and border colors adapt automatically across themes.",
      ],
    },
  },
  combobox: {
    slug: "combobox",
    locale: "en-US",
    summary:
      "Search by typing and select one option.",
    whenToUse: [
      "When filtering materially helps users find one option from a long list; for short fixed lists, Select is a better fit.",
      "When you need to keep the selected value and search query distinct so reopening the list doesn't erase the prior selection.",
    ],
    whenNotToUse: [
      "For simple binary choices (toggle on/off), use Toggle instead of Combobox; the interaction overhead is too heavy for a simple switch.",
      "Use MultiSelect for multiple selections; Combobox selects one option.",
    ],
    examples: [
      {
        id: "combobox-uncontrolled",
        kind: "minimal",
        title: "Uncontrolled combobox",
        description:
          "A basic uncontrolled Combobox where internal state independently manages the selected value and query.",
        demoKey: "uncontrolled",
      },
      {
        id: "combobox-controlled",
        kind: "stateful",
        title: "Controlled combobox",
        description:
          "Controls the selected value through value and onValueChange while the search query remains internal.",
        demoKey: "controlled",
      },
      {
        id: "combobox-disabled",
        kind: "variant",
        title: "Disabled combobox",
        description:
          "Displays the disabled visual state of the Combobox, preventing user interaction and selection.",
        demoKey: "disabled",
      },
      {
        id: "combobox-sizes",
        kind: "minimal",
        title: "Combobox with different sizes",
        description:
          "Demonstrates the small, medium, and large Combobox sizes for different density contexts.",
        demoKey: "sizes",
      },
      {
        id: "combobox-with-label",
        kind: "minimal",
        title: "Combobox with label",
        description:
          "Label is associated with the input, ensuring assistive technologies read the field name correctly.",
        demoKey: "with-label",
      },
      {
        id: "combobox-cleared",
        kind: "stateful",
        title: "Clearable combobox",
        description:
          "In clearable mode, the user can reset the selection back to the initial empty state at any time.",
        demoKey: "clearable",
      },
      {
        id: "combobox-errored",
        kind: "stateful",
        title: "Errored combobox",
        description:
          "Applies error colors to the input text and icons when validation fails; the page supplies any explanatory error message separately.",
        demoKey: "errored",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Combobox combines input and list semantics for keyboard use. While the panel is closed, Up/Down/Home/End open it first; once open, Up/Down move the highlight, Home/End jump to the first/last item, and Enter commits the highlighted item.",
        "Typing filters the option list in real time; the first visible item is highlighted on open and the highlight remains within the filtered set.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "The selected value supports controlled value/onValueChange and uncontrolled defaultValue modes.",
        "The search query is internal; ComboboxInput onChange can observe typing, but there is currently no controlled query prop.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "The dropdown sits 8px below the input, start-aligned with the input surface; it flips and avoids viewport edges when space is insufficient, and tracks scroll and resize in real time.",
        "Input width comes from layout or the compatibility width prop; the list is at least as wide as the input and maxWidth can widen it.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Borders, focus rings, selected-item backgrounds, and dropdown shadows all adapt automatically via design system color and token variables.",
        "High-contrast color schemes in dark mode ensure readable text across all themes.",
      ],
    },
  },
};
