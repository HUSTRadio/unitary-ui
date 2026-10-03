import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_07_ZH: Record<string, ComponentGuide> = {
  gauge: {
    slug: "gauge",
    locale: "zh-CN",
    summary: "用圆弧显示配额、利用率等百分比。",
    whenToUse: [
      "在固定最大值的 0–100 比率中传达数值，例如配额使用率、构建缓存命中率、运行时间或计费周期消耗。",
      "需要一个紧凑的视觉指标来替代数字文本以快速扫描页面时。",
      "与进度条相比，这里关注的是整体容量中的占比而非任务完成进度。",
    ],
    whenNotToUse: [
      "确定性的任务进度（如文件上传、多步设置）应使用 Progress，因为它有已知总量和明确的完成语义。",
      "二元或枚举状态请使用 Status Dot（部署状态）或 Badge（其他元数据），而非环形仪表。",
    ],
    examples: [
      {
        id: "label",
        kind: "minimal",
        title: "带标签的仪表盘",
        description:
          "基本用法：传入一个百分比值并配以描述性标签，让屏幕阅读器和可见读者都能理解该数值所代表的含义。",
        demoKey: "Label",
      },
      {
        id: "custom-color-range",
        kind: "variant",
        title: "自定义颜色范围",
        description:
          "通过定义分段阈值来自定义弧线的颜色分布，适用于需要语义化分段的场景，如配额用量进入警告区间时改变色调。",
        demoKey: "Custom color range",
      },
      {
        id: "arc-priority",
        kind: "advanced",
        title: "弧线优先级",
        description:
          "在同一圆环上渲染主、次两个进度段，用于同时呈现两个指标；传入第二种颜色时，arcPriority=\"equal\" 会让两段等权分布。",
        demoKey: "Arc priority",
      },
      {
        id: "indeterminate",
        kind: "variant",
        title: "不确定状态",
        description:
          "当数据正在加载且具体百分比尚不可用时，用不确定的旋转动画代替静态弧线，向用户传达系统仍在处理中。",
        demoKey: "Indeterminate",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        '组件设置 role="progressbar"，并提供 aria-valuemin、aria-valuemax 和 aria-valuenow 属性，屏幕阅读器会正确播报当前进度。',
        "为仪表配上文字标签或 Tooltip，说明百分比代表什么。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Gauge 没有内部状态；父组件通过 value 和颜色属性更新读数。",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason: "Gauge 使用 tiny、small、medium、large 四个固定尺寸，不会根据视口或父容器自动缩放。",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "轨道颜色跟随主题变量；默认进度段使用固定的红、琥珀和绿色阈值。",
        "colors 可传阈值映射或主次颜色对，并可使用 CSS 变量等普通 CSS 颜色值，但不解析渐变。",
      ],
    },
  },
  grid: {
    slug: "grid",
    locale: "zh-CN",
    summary: "用单元格和可见参考线组织二维布局。",
    whenToUse: [
      "需要在营销页面、文档首页和功能分解图中实现二维的单元格加引导线布局，其中引导线和单元格边框本身就是设计的一部分。",
      "希望在不增加复杂嵌套的情况下对齐多个项目并保持视觉层次。",
    ],
    whenNotToUse: [
      "对于普通的 n 列响应式内容（卡片列表等），直接使用 Tailwind 的 grid-cols-* 工具类即可；Grid 在没有引导线可见时属于过度设计。",
      "不应嵌套超过一层 Grid，引导线的叠加会产生视觉噪音并破坏单元格的对齐计算。",
    ],
    examples: [
      {
        id: "basic-grid",
        kind: "minimal",
        title: "基础栅格",
        description:
          "基本网格布局示例：定义几行几列，元素自动按网格填充，带有默认的引导线和间距。",
        demoKey: "Basic grid",
      },
      {
        id: "solid-cells",
        kind: "variant",
        title: "实心单元格",
        description:
          "为每个单元格添加实线边框以形成更强烈的分区感，适合需要对齐关系非常明确的数据面板展示。",
        demoKey: "Solid cells",
      },
      {
        id: "responsive-grid",
        kind: "stateful",
        title: "响应式栅格",
        description:
          "根据不同视口自动调整行列数量和尺寸，在小屏减少列数以保持可读性，在大屏充分利用横向空间。",
        demoKey: "Responsive grid",
      },
      {
        id: "dashed-grid-with-cross",
        kind: "advanced",
        title: "虚线加十字的栅格",
        description:
          "结合虚线引导线和交叉点装饰的高级用法，创造出具有设计感的结构网格，常用于技术文档或品牌页面的装饰性布局。",
        demoKey: "Dashed grid with cross",
      },
    ],
    accessibility: {
      status: "not-applicable",
      reason:
        "Grid 是一个纯视觉布局组件，不包含可交互的元素或语义化的 ARIA 角色。内容的可访问性由网格内放置的实际组件（按钮、链接、标题等）决定。",
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Grid 作为布局容器，不管理任何内部状态或用户交互数据。它的行为完全由传递给子元素的 props（行数、列数、对齐方式等）决定。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Grid 组件内置响应式断点，在不同视口下自动调整列数和引导线的显示方式。",
        "视口档位为 xs≤400、sm>400 且≤600、smd>600 且≤768、md>768 且≤960、lg>960px（默认 16px 字号）；前四个 grid token 表示上界。历史 grid-lg: 工具类阈值仍为 1280px，不是组件 lg 档入口。容器查询保留 400/401、600/601、768/769、960/961px 的独立像素边界。",
        "可以分别隐藏行引导线或列引导线以适应特定的布局需求，当两侧引导线都隐藏时通常意味着纯 Tailwind 网格更为合适。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "网格线颜色和单元格背景色从主题变量获取，确保浅色模式和深色模式下的正确对比度。",
        "引导线粗细和样式（实线、虚线）可通过 props 调整并与设计系统的 Token 保持一致。",
      ],
    },
  },
  input: {
    slug: "input",
    locale: "zh-CN",
    summary: "输入名称、邮箱等单行文本。",
    whenToUse: [
      "用户需要输入单行自由格式文本时，如项目名称、邮箱地址、API 密钥或域名。",
      "需要进行字段级验证并以即时反馈告诉用户输入是否有效的场景。",
      "作为表单的一部分，与其他控件一起提交到后端。",
    ],
    whenNotToUse: [
      "当内容可能换行为多行时，应使用 Textarea 而非 Input，因为 Input 的 single-line 语义不适合块状文本。",
      "当值来自预定义的列表供用户筛选选择时，应使用 Combobox 而非自由输入。",
      "不要将带标签的 Input 包裹在 Tooltip 中——应将解释说明放在旁边的图标按钮上，以确保标签能被屏幕阅读器正确播报。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认输入框",
        description:
          "基本输入框用法，包含占位符提示和标准的外观样式，适用于大多数通用文本输入场景。",
        demoKey: "default",
      },
      {
        id: "prefix-and-suffix",
        kind: "variant",
        title: "前缀和后缀",
        description:
          "在输入框内部添加前缀和后缀元素，如在 URL 输入框中添加 'https://' 前缀或在用户名后添加域名后缀。",
        demoKey: "prefix-and-suffix",
      },
      {
        id: "error",
        kind: "stateful",
        title: "错误状态",
        description:
          "通过 error prop 传递验证消息字符串来展示字段的校验失败状态，红色边框和错误文本提供清晰的视觉反馈。",
        demoKey: "error",
      },
      {
        id: "label",
        kind: "advanced",
        title: "带标签的输入框",
        description:
          "配合可见 label 的正确用法；组件会关联标签与输入，并在未提供 id 时自动生成。",
        demoKey: "label",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "传入 label 时，Input 通过 htmlFor/id 关联标签与字段；未提供 id 时会自动生成。",
        "错误状态通过 error prop 传递的消息会被添加到 aria-describedby 中，帮助器文本也应通过此机制关联。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Input 接受 value 和 onChange 来控制受控行为，也可使用未受控方式通过默认值初始化。",
        "提交前去除首尾空格，避免相同输入被识别为不同值。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Input 会遵循调用方提供的宽度与父容器约束；组件本身不包含视口断点或自动字号调整。",
        "前缀和后缀保持固定的内联布局；窄屏下的宽度、换行与重排由调用方容器负责。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "输入框的边框颜色、背景色和聚焦状态均遵循主题变量，包括深色模式的适配。",
        "错误状态的红色边框和正常状态的颜色区分遵循设计系统的色彩规范。",
      ],
    },
  },
  "json-view": {
    slug: "json-view",
    locale: "zh-CN",
    summary: "以可展开的高亮树查看 JSON 对象和数组。",
    whenToUse: [
      "用户需要检查、浏览或折叠展开 JSON 对象/数组时，交互式查看是核心功能。",
      "作为产品界面的一部分展示 API 返回的结构化数据，允许用户逐层探索数据结构。",
    ],
    whenNotToUse: [
      "当数据是静态文档内容而非交互式产品界面时，应使用普通的代码块，JSON View 的交互特性是不必要的开销。",
      "不要将已经 stringify 的 JSON 字符串传入 data 属性——应保持原始对象或数组格式以便组件正确渲染树形结构。",
    ],
    examples: [
      {
        id: "single-line",
        kind: "minimal",
        title: "单行模式",
        description: "将整个 JSON 对象压缩为单行展示，适合篇幅较小的数据结构或需要快速预览的场景。",
        demoKey: "Single line",
      },
      {
        id: "wrapped",
        kind: "variant",
        title: "自动换行",
        description:
          "长键名和长值会在容器边缘自动换行，避免水平滚动条出现，适合宽表格内的紧凑布局。",
        demoKey: "Wrapped",
      },
      {
        id: "collapsed",
        kind: "stateful",
        title: "折叠状态",
        description:
          "默认折叠深层嵌套节点以减少初始渲染量，用户可以逐级展开感兴趣的分支，提升大数据结构的浏览效率。",
        demoKey: "Collapsed",
      },
      {
        id: "highlighted",
        kind: "advanced",
        title: "高亮文本匹配",
        description:
          "通过 highlightPattern 正则高亮键名或原始值中的匹配文本，帮助用户快速定位重要字段。",
        demoKey: "Highlighted",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "JSON View 的展开按钮可通过 Tab 聚焦，并用 Enter 或 Space 切换；组件不提供树级方向键漫游。",
        "每个节点都有语义化的角色和标签，屏幕阅读器可以正确播报层级和键值信息。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "通过 defaultExpandDepth 设置初始展开深度；展开集合随后由组件内部管理。",
        "组件不提供受控 expandedKeys 或展开变更回调；如需外部持有展开状态，应在调用方使用其他树组件。",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "JsonView 使用固定字号和缩进，不设置随视口变化的最大高度或纵向滚动；需要这些约束时由调用方容器提供。",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "树的基础文字和背景跟随主题；字符串、数字、布尔值和 null 使用组件定义的语法配色。",
        "匹配文本使用固定黄色高亮，键名使用显式亮/暗色值；不要把它描述为可配置的完整主题变量方案。",
      ],
    },
  },
  "keyboard-input": {
    slug: "keyboard-input",
    locale: "zh-CN",
    summary: "以键帽样式显示按键或快捷键组合。",
    whenToUse: [
      "在正文文本、菜单项和按钮后缀中显示快捷键提示，让用户直观了解触发某个操作所需的键盘组合。",
      "在长篇文档中叙述某个快捷操作时，用 Kbd 元素呈现按键样式使文档更加专业易读。",
    ],
    whenNotToUse: [
      "不要将修饰键拼写出来放在 children 中——应通过 boolean props（meta、shift、alt、ctrl）明确选择要展示的符号；组件不会检测操作系统。",
      "标点符号应放在 Kbd 元素之外，如句号、逗号和「或」分隔符保留在周围的正文中，以免屏幕阅读器将它们误报为按键名称。",
    ],
    examples: [
      {
        id: "modifiers",
        kind: "minimal",
        title: "修饰键组合",
        description:
          "使用 boolean props 明确传递修饰键：meta、shift、alt、ctrl 分别渲染 ⌘、⇧、⌥、⌃；调用方负责选择适合目标平台的提示。",
        demoKey: "modifiers",
      },
      {
        id: "combination",
        kind: "variant",
        title: "多键组合",
        description:
          "展示多个按键的组合序列，如在文档中显示 Shift + K 表示需要先按住 Shift 再按 K 键。",
        demoKey: "combination",
      },
      {
        id: "small",
        kind: "variant",
        title: "小型键盘输入",
        description:
          "在密集表面（如菜单行、命令栏项目或表格单元格）中使用 small 尺寸，以避免挤压相邻文本的显示空间。",
        demoKey: "small",
      },
      {
        id: "plain-command",
        kind: "stateful",
        title: "纯命令按键",
        description:
          "用于展示不带修饰键的单个按键或命名键，如 Enter、Esc 等，children 应为单个按键名称而非句子。",
        demoKey: "plain-command",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Kbd 元素使用语义化的键盘角色，屏幕阅读器能正确播报按键名称及其修饰组合。",
        "修饰键由调用方显式选择；在面向特定平台的界面中，应传入与该平台快捷键一致的组合。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Kbd 只显示按键提示，不处理按键事件，也不保存状态。",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "Kbd 组件本身不涉及响应式布局逻辑。其尺寸变化由所在容器的上下文决定——在密集表面使用 small 变体即可适应空间约束。",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "按键的背景色、边框和文字颜色均从主题变量获取，确保在浅色和深色模式下都有良好的对比度和视觉效果。",
        "激活状态（如果有的话）的颜色切换也遵循主题规范。",
      ],
    },
  },
};

export const GUIDES_07_EN: Record<string, ComponentGuide> = {
  gauge: {
    slug: "gauge",
    locale: "en-US",
    summary:
      "Show a percentage, such as quota usage or utilization, as an arc.",
    whenToUse: [
      "In a 0–100 ratio against a fixed maximum where the comparison is the point, like quota usage, build cache hit rate, uptime, or billing-period consumption.",
      "When you need a compact visual indicator to replace raw numbers for quick page scanning.",
      "When the metric represents proportion of total capacity rather than task completion progress.",
    ],
    whenNotToUse: [
      "For determinate task progress with a known total (uploads, multi-step setup), use Progress instead, as it conveys a clear completion semantics.",
      "For binary or enumerated state, use Status Dot for deployments or Badge for other metadata.",
    ],
    examples: [
      {
        id: "label",
        kind: "minimal",
        title: "Labelled gauge",
        description:
          "The simplest usage: pass a percentage value with a descriptive label so both sighted users and screen readers understand what the number represents.",
        demoKey: "Label",
      },
      {
        id: "custom-color-range",
        kind: "variant",
        title: "Custom color range",
        description:
          "Define threshold segments to customize the arc's color distribution, useful when you need semantic coloring such as shifting hue when quota enters a warning zone.",
        demoKey: "Custom color range",
      },
      {
        id: "arc-priority",
        kind: "advanced",
        title: "Arc priority",
        description:
          "Render primary and secondary progress segments on the same ring; with a secondary color, arcPriority=\"equal\" distributes the two segments equally.",
        demoKey: "Arc priority",
      },
      {
        id: "indeterminate",
        kind: "variant",
        title: "Indeterminate state",
        description:
          "When data is loading and the specific percentage is not yet available, use a spinning animation instead of a static arc to communicate that the system is still processing.",
        demoKey: "Indeterminate",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        'The component sets role="progressbar" with aria-valuemin, aria-valuemax, and aria-valuenow so screen readers announce the current progress correctly.',
        "Add a text label or Tooltip to explain what the percentage represents.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Gauge has no internal state; the parent updates its value and colors through props.",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason: "Gauge uses four fixed sizes—tiny, small, medium, and large—and does not scale from the viewport or parent container.",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The track follows theme tokens; default progress segments use fixed red, amber, and green thresholds.",
        "colors accepts a threshold map or primary/secondary pair and can use ordinary CSS colors such as variables, but it does not parse gradients.",
      ],
    },
  },
  grid: {
    slug: "grid",
    locale: "en-US",
    summary:
      "Create a two-dimensional layout with cells and visible guide lines.",
    whenToUse: [
      "For two-dimensional cell-and-guide layouts in marketing pages, docs landing pages, and feature breakdowns where the rule lines and cell borders are part of the design.",
      "When you want to align multiple items without excessive nesting while maintaining visual hierarchy.",
    ],
    whenNotToUse: [
      "For plain n-column responsive content (cards, lists), use Tailwind grid grid-cols-* utilities directly; Grid is overkill when guides aren't visible.",
      "Don't nest Grids more than one level; the guide overlap reads as visual noise and breaks the cell math.",
    ],
    examples: [
      {
        id: "basic-grid",
        kind: "minimal",
        title: "Basic grid",
        description:
          "The simplest grid layout example: define rows and columns, elements fill the grid automatically with default guides and spacing.",
        demoKey: "Basic grid",
      },
      {
        id: "solid-cells",
        kind: "variant",
        title: "Solid cells",
        description:
          "Add solid borders to every cell for a stronger partition feel, suitable for data panels where alignment relationships must be very explicit.",
        demoKey: "Solid cells",
      },
      {
        id: "responsive-grid",
        kind: "stateful",
        title: "Responsive grid",
        description:
          "Automatically adjusts column count and dimensions based on viewport, reducing columns on small screens for readability while maximizing horizontal space on larger views.",
        demoKey: "Responsive grid",
      },
      {
        id: "dashed-grid-with-cross",
        kind: "advanced",
        title: "Dashed grid with cross",
        description:
          "Combines dashed guide lines with cross-point decorations for an advanced, design-forward structured grid, often used for decorative layouts in technical docs or branded pages.",
        demoKey: "Dashed grid with cross",
      },
    ],
    accessibility: {
      status: "not-applicable",
      reason:
        "Grid is a layout component without interactive elements or semantic ARIA roles. Accessibility is determined by the actual components placed inside the grid cells (buttons, links, headings, etc.).",
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "As a layout container, Grid manages no internal state or user interaction data. Its behavior is entirely dictated by props passed to child elements (row count, column count, alignment, etc.).",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "The Grid component includes built-in responsive breakpoints that automatically adjust column counts and guide visibility across different viewports.",
        "Viewport tiers are xs≤400, sm>400 and≤600, smd>600 and≤768, md>768 and≤960, lg>960px at the default 16px font size; the first four grid tokens are upper bounds. The legacy grid-lg: utility keeps its 1280px threshold, distinct from the component's lg entry. Container queries retain independent pixel boundaries at 400/401, 600/601, 768/769 and 960/961px.",
        "Row and column guides can be hidden independently to suit specific layout needs; hiding both usually means a plain Tailwind grid is the right tool.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Grid line colors and cell backgrounds are drawn from theme tokens, ensuring proper contrast in both light and dark modes.",
        "Guide thickness and style (solid, dashed) are adjustable via props and stay consistent with design system tokens.",
      ],
    },
  },
  input: {
    slug: "input",
    locale: "en-US",
    summary:
      "Enter single-line text, such as a name or email address.",
    whenToUse: [
      "When the user needs to enter a single line of free-form text, such as project name, email address, API key, or domain.",
      "When field-level validation with immediate feedback is needed to inform the user whether their input is valid.",
      "As part of a form submitted together with other controls to a backend.",
    ],
    whenNotToUse: [
      "When content can wrap to multiple lines, use Textarea instead of Input, since Input's single-line semantics are unsuited for block text.",
      "When the value comes from a known list the user filters by typing, use Combobox instead of free-form input.",
      "Don't wrap a labelled <Input> in a Tooltip; put the explainer on a sibling icon button so the label stays announced.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default input",
        description:
          "The most basic input usage with a placeholder hint and standard styling, suitable for most generic text input scenarios.",
        demoKey: "default",
      },
      {
        id: "prefix-and-suffix",
        kind: "variant",
        title: "Prefix and suffix",
        description:
          "Add prefix and suffix elements inside the input field, such as a 'https://' prefix for URL inputs or a domain suffix after usernames.",
        demoKey: "prefix-and-suffix",
      },
      {
        id: "error",
        kind: "stateful",
        title: "Error state",
        description:
          "Display a field's validation failure state by passing a validation message string to the error prop, with a red border and error text for clear visual feedback.",
        demoKey: "error",
      },
      {
        id: "label",
        kind: "advanced",
        title: "Labeled input",
        description:
          "Correct usage paired with a visible label; the component associates the label and input and generates an id when one is not supplied.",
        demoKey: "label",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "When label is provided, Input associates the label and field through htmlFor/id; it generates an id when one is not supplied.",
        "Error messages passed via the error prop are added to aria-describedby; helper text should also be linked through this mechanism.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Input accepts value and onChange for controlled behavior, or can be used uncontrolled via defaultValue initialization.",
        "Trim leading and trailing spaces before submission so equivalent input is treated consistently.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Input follows caller-provided width and parent constraints; it has no viewport breakpoint or automatic font-size behavior of its own.",
        "Prefix and suffix keep a fixed inline layout; the caller owns narrow-screen width, wrapping, and reflow.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Border color, background, and focus state all follow theme tokens, including dark mode adaptation.",
        "Error state red borders and normal state color distinction follow the design system's color specifications.",
      ],
    },
  },
  "json-view": {
    slug: "json-view",
    locale: "en-US",
    summary:
      "Inspect JSON objects and arrays in an expandable, highlighted tree.",
    whenToUse: [
      "When users need to inspect, browse, or collapse and expand JSON objects or arrays; interactive viewing is the core requirement.",
      "As part of a product interface presenting API response data, allowing users to explore the data structure layer by layer.",
    ],
    whenNotToUse: [
      "When the value is static documentation rather than an interactive product surface, use a regular code block; JSON View's interactivity would be unnecessary overhead.",
      "Keep the source data as an object or array. Do not pre-stringify JSON before passing it to data.",
    ],
    examples: [
      {
        id: "single-line",
        kind: "minimal",
        title: "Single line",
        description:
          "Collapse the entire JSON object to a single line for quick preview of small data structures or situations where brevity is key.",
        demoKey: "Single line",
      },
      {
        id: "wrapped",
        kind: "variant",
        title: "Wrapped",
        description:
          "Long key names and values auto-wrap at container edges, avoiding horizontal scrollbars, ideal for compact layouts within wide tables.",
        demoKey: "Wrapped",
      },
      {
        id: "collapsed",
        kind: "stateful",
        title: "Collapsed state",
        description:
          "Deeply nested nodes are collapsed by default to reduce initial render cost; users can progressively expand branches of interest for efficient browsing of large data structures.",
        demoKey: "Collapsed",
      },
      {
        id: "highlighted",
        kind: "advanced",
        title: "Highlighted text matches",
        description:
          "Use the highlightPattern regular expression to highlight matching text in key names or primitive values.",
        demoKey: "Highlighted",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "JSON View disclosure buttons are reachable with Tab and toggle with Enter or Space; the component does not implement tree-level arrow-key roaming.",
        "Every node has semantic roles and labels so screen readers can correctly announce hierarchy and key-value information.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Set the initial expansion depth with defaultExpandDepth; the component manages the expanded set internally after that.",
        "There is no controlled expandedKeys prop or expansion-change callback. Use another tree primitive when external expansion state is required.",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "JsonView uses fixed typography and indentation and does not add viewport-based max-height or vertical scrolling. Apply those constraints on a caller-owned container.",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Base text and background follow the theme, while strings, numbers, booleans, and nulls use component-defined syntax colors.",
        "Matched text uses a fixed yellow highlight and keys use explicit light/dark values; this is not a fully configurable token palette.",
      ],
    },
  },
  "keyboard-input": {
    slug: "keyboard-input",
    locale: "en-US",
    summary:
      "Display a key or shortcut combination as keycaps.",
    whenToUse: [
      "For shortcut hints inside prose, menu items, and button suffixes, letting users intuitively know the keyboard combination to trigger an action.",
      "In long-form documentation narrating a shortcut, rendering keys as Kbd elements makes the document look professional and easy to scan.",
    ],
    whenNotToUse: [
      "Don't spell out modifiers inside children; use the boolean props (meta, shift, alt, ctrl) to choose the symbols explicitly. The component does not detect the operating system.",
      "Punctuation lives outside the element: period, comma, and or separators stay in surrounding prose so screen readers don't announce them as keys.",
    ],
    examples: [
      {
        id: "modifiers",
        kind: "minimal",
        title: "Modifier keys",
        description:
          "Pass modifier keys explicitly: meta, shift, alt, and ctrl render ⌘, ⇧, ⌥, and ⌃. The caller chooses the combination appropriate for the target platform.",
        demoKey: "modifiers",
      },
      {
        id: "combination",
        kind: "variant",
        title: "Key combination",
        description:
          "Display a sequence of multiple key presses, such as Shift + K, indicating the user should hold Shift then press K.",
        demoKey: "combination",
      },
      {
        id: "small",
        kind: "variant",
        title: "Small keyboard input",
        description:
          "Use the small size in dense surfaces like menu rows, command-bar items, or table cells to avoid crowding adjacent text.",
        demoKey: "small",
      },
      {
        id: "plain-command",
        kind: "stateful",
        title: "Plain command key",
        description:
          "Used for single keys or named keys without modifiers, such as Enter or Esc. The children prop should contain a single key name, not a sentence.",
        demoKey: "plain-command",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Kbd elements use semantic keyboard roles so screen readers pronounce key names and modifier combinations correctly.",
        "The component does not detect the operating system or swap symbols. Callers must choose meta or ctrl for the target platform.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Kbd displays key hints without handling key events or storing state.",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "The Kbd component itself does not implement responsive layout logic. Its sizing is determined by context: use the small variant in dense surfaces to fit spatial constraints.",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Background color, border, and text color of key badges are all drawn from theme tokens, ensuring good contrast and visual appearance in both light and dark modes.",
        "Active state color transitions (when applicable) also follow theme specifications.",
      ],
    },
  },
};
