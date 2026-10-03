import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_11_ZH: Record<string, ComponentGuide> = {
  scroller: {
    slug: "scroller",
    locale: "zh-CN",
    summary: "在固定区域内滚动浏览溢出的内容。",
    whenToUse: [
      "当需要在单一方向上展示一组同类项目的溢出列表时，例如标签行、日志流或图片平铺。",
      "当容器尺寸小于总内容大小时，希望用户通过方向滚动发现被截断的项目。",
    ],
    whenNotToUse: [
      "当项目需要在两个维度自由布局时，网格布局更适合这种二维展示。",
      "当目的仅为区分内容区块而非提供滚动交互时，应该使用分隔线或间距。",
    ],
    examples: [
      {
        id: "vertical",
        kind: "minimal",
        title: "垂直滚动容器",
        description: "展示一个基础的纵向滚动示例，容器高度固定时内部长内容自动产生垂直滚动条。",
        demoKey: "Vertical",
      },
      {
        id: "horizontal",
        kind: "variant",
        title: "水平排列的标签轨道",
        description: "横向排列一系列标签卡片，适合筛选标签行或平铺内容展示。",
        demoKey: "Horizontal",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "滚动区域内的每个子项目拥有独立的语义和无障碍名称。",
        "Tab 键顺序遵循 DOM 顺序，因此应按阅读顺序排列项目，无论滚动方向如何。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "滚动容器以被动展示为主，其滚动位置由浏览器原生处理，通常不由父组件显式控制。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "可根据视口宽度调整滚动轴向：宽屏下使用水平滚动展示更多内容，窄屏回退为垂直或无滚动。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: ["支持自定义滚动区域的边框、圆角及暗色主题适配，边缘渐隐遮罩也可通过样式微调。"],
    },
  },
  "search-input": {
    slug: "search-input",
    locale: "zh-CN",
    summary: "带搜索图标的输入框，用于输入查询条件。",
    whenToUse: [
      "需要用户输入文本查询驱动结果过滤的场景。",
      "需要一个带可视化搜索图标前缀、便于识别的输入控件。",
    ],
    whenNotToUse: [
      "用于普通表单输入（姓名、地址等），应使用通用 Input 组件。",
      "仅需静态文字展示时，不应使用交互型输入控件。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "基础搜索输入",
        description: "基本搜索输入用法，带有默认搜索图标前缀和占位提示文本。",
        demoKey: "default",
      },
      {
        id: "loading",
        kind: "stateful",
        title: "加载中状态的搜索输入",
        description: "在搜索结果正在更新时通过加载指示器向用户提供实时反馈。",
        demoKey: "loading",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "输入框拥有语义明确的类型（role=search）和无障碍名称，方便屏幕阅读器识别用途。",
        "应与可见标签或等效的无障碍名称关联，以确保无障碍上下文完整。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "父组件通过 value 和 onChange 管理搜索词。",
    },
    responsiveBehavior: {
      status: "covered",
      content: ["在不同视口宽度下自适应输入框宽度，保持可点击的命中区域。"],
    },
    themeBehavior: {
      status: "covered",
      content: ["支持暗色模式下颜色反转，并可与整体品牌主题保持一致。"],
    },
  },
  select: {
    slug: "select",
    locale: "zh-CN",
    summary: "从下拉列表中选择一个选项。",
    whenToUse: [
      "从简短固定的选项列表中快速选择一个值时，尤其适合大约十个以内的选项。",
      "空间受限的设置面板、筛选器行或紧凑型表单中，需要使用下拉选择节省垂直空间。",
    ],
    whenNotToUse: [
      "面对需要从大量选项中通过输入筛选的场景，组合框（Combobox）更合适。",
      "需要同时选择多个选项时，应使用多选控件（Multi Select）。",
    ],
    examples: [
      {
        id: "sizes",
        kind: "minimal",
        title: "不同尺寸的 Select",
        description: "展示 Select 组件的不同尺寸变体，从小号到大号的视觉效果对比。",
        demoKey: "sizes",
      },
      {
        id: "error",
        kind: "stateful",
        title: "带错误状态的 Select",
        description: "输入校验失败时在 Select 下方展示错误提示信息。",
        demoKey: "error",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "遵循 WAI-ARIA 的下拉列表语义，键盘用户可以流畅地上下遍历选项并通过 Enter 进行选择。",
        "选中后屏幕阅读器会清晰地播报新的选项值及其对应的标签。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "通过 value 和 onValueChange 属性实现完全的外部状态控制，也可通过 defaultValue 使用非受控初始值。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: ["支持多种内置尺寸，在狭窄视口中可通过减小字号和间距保持可用性。"],
    },
    themeBehavior: {
      status: "covered",
      content: ["下拉弹出层的背景、边框和文字颜色随主题系统自动适配，确保暗色模式下同样可用。"],
    },
  },
  separator: {
    slug: "separator",
    locale: "zh-CN",
    summary: "用水平或垂直分隔线区分内容组。",
    whenToUse: [
      "需要在菜单项之间、列表区块或页面布局的不同部分之间添加视觉分割线时。",
      "当希望在不增加额外间距的情况下提供清晰的分区感时，分隔线是轻量级方案。",
    ],
    whenNotToUse: [
      "如果空白间距或背景面的切换已能充分区分内容区块，则不需要额外添加分隔线。",
      "如果分隔线只用于视觉装饰，请显式设置 decorative={true}，避免向辅助技术暴露多余语义。",
    ],
    examples: [
      {
        id: "horizontal",
        kind: "minimal",
        title: "水平分隔线",
        description: "一条横跨容器全宽的横线，适合在垂直堆叠的内容块之间做分割。",
        demoKey: "horizontal",
      },
      {
        id: "vertical",
        kind: "variant",
        title: "垂直分隔线",
        description: "一条竖线填充 Flex 行的可用高度，常用于横向排列项之间的间隔。",
        demoKey: "vertical",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "默认 decorative={false}，组件向辅助技术暴露语义分隔线及其方向。",
        "仅用于视觉装饰时应显式设置 decorative={true}，让辅助技术忽略它。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "分隔线是一个纯粹的展示组件，没有内部状态。",
    },
    responsiveBehavior: {
      status: "covered",
      content: ["水平分隔线自动适应容器全宽；垂直分隔线根据 Flex 子元素的可用高度动态伸缩。"],
    },
    themeBehavior: {
      status: "covered",
      content: ["颜色通过 CSS 变量继承主题色，可以在暗色主题中自动获得合适的描边和颜色。"],
    },
  },
  sheet: {
    slug: "sheet",
    locale: "zh-CN",
    summary: "从屏幕边缘打开面板，显示与当前页面相关的详情。",
    whenToUse: [
      "需要展示持久的关联上下文（如部署详情或成员档案）同时保持主页内容可交互时。",
      "需要用户可主动打开和关闭的侧边详情面板时。",
    ],
    whenNotToUse: [
      "当需要完全阻塞页面的决策确认时，请使用模态对话框（Modal）。",
      "当需要确认破坏性操作时，默认的保持页面可交互会削弱严重程度提示。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认侧边面板",
        description: "从右侧滑出的基础面板，包含标题区域、内容主体和关闭按钮。",
        demoKey: "default",
      },
      {
        id: "with-side",
        kind: "variant",
        title: "不同方向的侧边面板",
        description: "展示侧边面板从左侧或右侧滑出的变体，可根据触发按钮的位置选择合适的方向。",
        demoKey: "with-side",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Sheet 默认 modal=false：页面保持可交互、不锁滚动、outside-click 不关闭。焦点捕获与 Escape 关闭仅在显式 <Sheet modal> 时由 Radix Dialog 提供。",
        "标题通过 aria-labelledby 关联，屏幕阅读器会在面板打开时播报标题内容。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "支持通过外部状态（如 isOpen 变量）或回调函数控制面板的打开与关闭，适合构建复杂的交互模式。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: ["在大视口下固定在页面边缘展示，在小视口中可退化为全屏覆盖模式以适配移动端布局。"],
    },
    themeBehavior: {
      status: "covered",
      content: ["面板的背景色、边框和阴影均可自定义，并且能与应用的暗色主题配合。"],
    },
  },
};

export const GUIDES_11_EN: Record<string, ComponentGuide> = {
  scroller: {
    slug: "scroller",
    locale: "en-US",
    summary: "Scroll through overflowing content within a bounded area.",
    whenToUse: [
      "When you need to present an overflowing list of peer items in a single direction, such as chip rows, log streams, or tile grids.",
      "When the container is smaller than the total content and users should discover clipped items through directional scrolling.",
    ],
    whenNotToUse: [
      "When items require free-form two-dimensional layout; a grid component serves that purpose better.",
      "When the goal is purely visual separation rather than scrollable overflow; use a separator or spacing instead.",
    ],
    examples: [
      {
        id: "vertical",
        kind: "minimal",
        title: "Vertical scrolling container",
        description:
          "A basic vertically scrolling example where a fixed-height container reveals longer inner content with a vertical scrollbar.",
        demoKey: "Vertical",
      },
      {
        id: "horizontal",
        kind: "variant",
        title: "Horizontal chip rail",
        description:
          "Horizontally arranged tag cards suitable for filter chips rows or tile-style showcases.",
        demoKey: "Horizontal",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Each child item within the scroll area has independent semantics and an accessible name.",
        "Tab order follows DOM order, so place items in reading order regardless of the scroll direction.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "The scroller is primarily passive in nature; its scroll position is handled natively by the browser and is typically not exposed for parent-controlled manipulation.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Can adapt the scroll axis based on viewport width: horizontal scrolling for wider screens, falling back to vertical or no scrolling on narrower viewports.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Supports custom border radius, shadows, and dark-mode adaptation on the scroll area; edge-fade masks can also be tweaked via styles.",
      ],
    },
  },
  "search-input": {
    slug: "search-input",
    locale: "en-US",
    summary: "A text input with a search icon for entering a query.",
    whenToUse: [
      "When users need to enter text queries that drive result filtering.",
      "When you want an input control with a visible search icon prefix for instant visual recognition.",
    ],
    whenNotToUse: [
      "For ordinary form text entry such as names or email addresses; use the generic Input component instead.",
      "When only static text display is needed; do not use an interactive input control for that purpose.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Basic search input",
        description:
          "The simplest use of SearchInput with a default magnifying-glass icon prefix and placeholder text.",
        demoKey: "default",
      },
      {
        id: "loading",
        kind: "stateful",
        title: "Search input with loading indicator",
        description:
          "Shows a loading state while search results are updating, providing real-time feedback to the user.",
        demoKey: "loading",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The input carries semantic type (role=search) and an accessible name so screen readers understand its purpose.",
        "Should be associated with a visible label or equivalent accessible name for full contextual announcement.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "The parent manages the query through value and onChange.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Adapts its width fluidly across viewport sizes while maintaining an adequate hit area for tapping.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Colors invert gracefully in dark mode and can stay consistent with overall brand theming.",
      ],
    },
  },
  select: {
    slug: "select",
    locale: "en-US",
    summary: "Choose one option from a dropdown list.",
    whenToUse: [
      "When selecting a single value from a short, fixed set of roughly ten options or fewer.",
      "In constrained form layouts, settings panels, or filter rows where a dropdown saves vertical space.",
    ],
    whenNotToUse: [
      "When filtering from a large, open-ended list where typing materially helps; Combobox is the right tool.",
      "When users need to pick multiple values at once; use Multi Select for multi-value selection.",
    ],
    examples: [
      {
        id: "sizes",
        kind: "minimal",
        title: "Select with different sizes",
        description:
          "The Small, Default, and Large size variants of Select shown side by side for visual comparison.",
        demoKey: "sizes",
      },
      {
        id: "error",
        kind: "stateful",
        title: "Select in an error state",
        description: "An error message displayed below the Select after a validation failure.",
        demoKey: "error",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Follows WAI-ARIA dropdown-listbox semantics; keyboard users navigate options with arrow keys and activate with Enter.",
        "After selection, the screen reader announces the chosen value and its label clearly.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Fully controllable via value and onValueChange; defaultValue provides an uncontrolled initial value.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Built-in size variants adapt to narrow viewports by reducing font size and padding to remain usable.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The dropdown popover inherits background, border, and text colors from the theme system, ensuring readability in dark mode.",
      ],
    },
  },
  separator: {
    slug: "separator",
    locale: "en-US",
    summary: "Separate groups of content with a horizontal or vertical line.",
    whenToUse: [
      "When you need a visual divider between menu items, list sections, or layout blocks.",
      "When a lightweight line conveys partitioning better than additional spacing layers alone.",
    ],
    whenNotToUse: [
      "When whitespace or background surface transitions already provide sufficient visual grouping.",
      "For a purely visual rule, set decorative={true} explicitly so it does not add unnecessary semantics.",
    ],
    examples: [
      {
        id: "horizontal",
        kind: "minimal",
        title: "Horizontal separator",
        description:
          "A horizontal line spanning the full container width, suitable for separating vertically stacked content blocks.",
        demoKey: "horizontal",
      },
      {
        id: "vertical",
        kind: "variant",
        title: "Vertical separator",
        description:
          "A vertical line filling the available height of a flex row, useful for spacing horizontally laid-out items.",
        demoKey: "vertical",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The default decorative={false} exposes a semantic separator and its orientation to assistive technologies.",
        "Set decorative={true} only for a purely visual rule that assistive technologies should ignore.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "The separator is a display component with no interactive state or internal mutability; controlled behavior does not apply.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Horizontal separators stretch to fill the container width; vertical ones grow to fill the flex item's available height.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Color inherits from theme CSS variables, adjusting automatically for stroke and contrast in dark themes.",
      ],
    },
  },
  sheet: {
    slug: "sheet",
    locale: "en-US",
    summary:
      "Open a panel from the screen edge to show details related to the current page.",
    whenToUse: [
      "When presenting persistent associated context (deployment details, member profiles) while keeping the underlying page interactive.",
      "Use it for a side detail panel that users can open and close.",
    ],
    whenNotToUse: [
      "When a fully blocking decision overlay is required; use Modal for blocking interactions.",
      "When confirming destructive actions; the default interactive page underneath weakens the severity signal.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default sheet panel",
        description:
          "A panel sliding in from the right with a title area, body content region, and a close button.",
        demoKey: "default",
      },
      {
        id: "with-side",
        kind: "variant",
        title: "Sheet positioned on different edges",
        description:
          "Variants showing the sheet sliding from the left or the right, matching the trigger's location on the page.",
        demoKey: "with-side",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Sheet defaults to modal=false: the page stays interactive, scrolling is unlocked, and outside clicks don't close it. Focus trapping and Escape-to-close only apply with an explicit <Sheet modal>, provided by Radix Dialog.",
        "The title is linked via aria-labelledby so screen readers announce it upon opening.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Open and close are managed through external state (e.g., an isOpen variable) or callback functions, supporting complex interaction patterns.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "On wide viewports the sheet sticks to the page edge; on small viewports it can fall back to a full-screen overlay for mobile layouts.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The panel's background, borders, and shadows are fully customizable and integrate seamlessly with dark-theme systems.",
      ],
    },
  },
};
