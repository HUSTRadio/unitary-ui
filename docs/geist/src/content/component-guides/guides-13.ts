import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_13_ZH: Record<string, ComponentGuide> = {
  "split-button": {
    slug: "split-button",
    locale: "zh-CN",
    summary: "将主操作与相关选项组合在一个控件中，减少行空间占用。",
    whenToUse: [
      "两个或更多操作共享同一行且高度相关时（如 'Deploy' 和 'Deploy to staging'）。",
      "需要平衡可见性和节省空间——主要操作需要醒目，次要变体以菜单形式呈现。",
    ],
    whenNotToUse: [
      "超过三个相关动作时使用 Menu 替代；拆分按钮的菜单不应成为垃圾箱。",
      "当两个动作重要程度相当时，使用并排的两个 Button 而非主次分级。",
    ],
    examples: [
      {
        id: "split-btn-01",
        kind: "minimal",
        title: "基础用法",
        description: "带有主操作和基本菜单的下拉拆分按钮。",
        demoKey: "Menu Alignment",
      },
      {
        id: "split-btn-02",
        kind: "variant",
        title: "带图标",
        description: "拆分按钮中使用图标增强操作的视觉识别度。",
        demoKey: "Icon",
      },
      {
        id: "split-btn-03",
        kind: "variant",
        title: "标题与图标组合",
        description: "在按钮标签旁边同时显示文字和图标的用法。",
        demoKey: "Title with Icon",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "菜单按钮应设置描述性 aria-label（如 'Deploy to staging'）而非仅用下三角图标。",
        "主按钮为正常焦点元素，菜单打开后焦点锁定在项目内，Escape 关闭并返回触发元素。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "Split Button 本身不暴露受控 API；菜单的开闭由内部 state 管理。",
    },
    responsiveBehavior: {
      status: "covered",
      content: ["在窄视图中拆分按钮保持完整功能，但菜单宽度随窗口边界自动翻转以避免裁切。"],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "拆分按钮继承 Button 的 variant 体系（primary、secondary、error 等），两个部分风格一致。",
      ],
    },
  },
  "status-dot": {
    slug: "status-dot",
    locale: "zh-CN",
    summary: "用小圆点指示部署的生命周期状态（构建中、就绪、错误等）。",
    whenToUse: [
      "展示部署生命周期状态（QUEUED、BUILDING、READY、ERROR、CANCELED、DELETED）。",
      "在表格行、列表卡片或命令面板中与文本状态标签并列使用。",
    ],
    whenNotToUse: [
      "非部署类的状态标记应使用 Badge（如 Workflow run、Queue message）。",
      "当文本已经清晰命名了状态时，不需要再添加额外的状态圆点造成重复。",
    ],
    examples: [
      {
        id: "status-dot-01",
        kind: "minimal",
        title: "默认状态圆点",
        description: "不带额外文字的默认状态圆点渲染效果。",
        demoKey: "Default",
      },
      {
        id: "status-dot-02",
        kind: "variant",
        title: "带标签的状态圆点",
        description: "状态圆点旁附带可读文本标签，提供双重信息通道。",
        demoKey: "Label",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "当状态圆点旁边已有文本命名状态时，标记为 aria-hidden 避免屏幕阅读器重复播报。",
        "BUILDING / QUEUED 状态的动画圆点应配合 prefers-reduced-motion 尊重用户的无障碍偏好。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: ["通过 value prop 传入当前部署状态字符串；状态变更时圆点的颜色和动画会响应更新。"],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason: "状态圆点是纯装饰性微交互组件，不涉及响应式布局调整。",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "状态圆点的颜色映射与主题联动：绿色表示就绪、红色表示错误、琥珀色表示警告、蓝色表示构建中等。",
      ],
    },
  },
  "step-point": {
    slug: "step-point",
    locale: "zh-CN",
    summary: "在多步流程中标记用户当前的进度节点。",
    whenToUse: [
      "引导用户完成多步流程（如设置向导、注册表单、部署配置）时显示步骤进度。",
      "需要向用户传达线性任务的整体结构，以及当前位置和剩余步骤。",
    ],
    whenNotToUse: [
      "单次操作或无需分步的场景不使用步骤指示点。",
      "当页面有多个独立子流程时，每个子流程应使用独立的步骤指示组件。",
    ],
    examples: [
      {
        id: "step-point-01",
        kind: "minimal",
        title: "默认步骤指示",
        description: "标准的水平步骤指示点排列，展示默认的外观。",
        demoKey: "Default",
      },
      {
        id: "step-point-02",
        kind: "advanced",
        title: "完整多步流程",
        description: "结合步骤指示点和内容区域展示完整的引导流程体验。",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "已完成和当前步骤的指示点应有清晰的焦点样式，键盘用户可以遍历所有步骤。",
        "当前步骤应配合 aria-current 属性让屏幕阅读器知道用户所在位置。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: ["通过 activeIndex 控制当前高亮的步骤索引，completedIndexes 数组标记已完成的步骤。"],
    },
    responsiveBehavior: {
      status: "covered",
      content: ["步骤指示点在窄视图中可以切换为垂直布局或隐藏非活跃步骤以节省空间。"],
    },
    themeBehavior: {
      status: "not-applicable",
      reason:
        "步骤指示点使用固定的状态语义颜色（灰色未激活、品牌色进行中、对勾已完成），不进行主题定制。",
    },
  },
  switch: {
    slug: "switch",
    locale: "zh-CN",
    summary: "作为 2-3 个互斥选项的分段选择器，用于在同一界面的不同视图间切换。",
    whenToUse: [
      "需要在两个或三个互斥选项之间切换时（如 Source 和 Output 两种视图）。",
      "选项数量少且用户经常需要在它们之间来回切换，需要即时反馈。",
    ],
    whenNotToUse: [
      "布尔开关场景应使用 Toggle，而非 Switch 的无线电语义。",
      "超过三个选项或标签很长时应使用 Tabs 或 Select 代替。",
    ],
    examples: [
      {
        id: "switch-01",
        kind: "minimal",
        title: "基础用法",
        description: "带有两个互斥选项的基础分段选择器。",
        demoKey: "default",
      },
      {
        id: "switch-02",
        kind: "variant",
        title: "大小变体",
        description: "不同的尺寸规格，适配紧凑或宽松的面板布局。",
        demoKey: "Sizes",
      },
      {
        id: "switch-03",
        kind: "stateful",
        title: "禁用状态",
        description: "展示不可交互时的禁用外观和原因提示。",
        demoKey: "Disabled",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "每个 Switch.Control 都应提供可访问名称（即使图标-only 也要加 Tooltip 和 sr-only 标签）。",
        "左右箭头键移动焦点，回车或空格激活选项，Escape 退出。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "使用 checked 受控属性精确控制选中状态，配合 onChange 回调同步父级 state。",
        "必须为 Switch 组分配一个 name 属性确保单选互斥；defaultChecked 确定初始选中项。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "全宽模式（full-width）在窄屏上提供更好的触摸目标；各选项填充使最长标签不会导致选中小 pill 的尺寸变化。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: ["激活态 pill 的颜色跟随主题 token，可以在暗色和亮色模式下保持一致的对比度。"],
    },
  },
  table: {
    slug: "table",
    locale: "zh-CN",
    summary: "以行和列展示结构化数据，适用于比较和分析。",
    whenToUse: [
      "数据行具有相同形状且至少有一列可在行间排序或比较时使用。",
      "需要展示密集的结构化数据（订单列表、成员表、部署日志等）。",
    ],
    whenNotToUse: [
      "单行动作配对应使用 Entity 组件而非表格。",
      "详情页面的键值元数据块应使用 Description 组件，不要用两列表格冒充。",
    ],
    examples: [
      {
        id: "table-01",
        kind: "minimal",
        title: "基础表格",
        description: "标准的表头加表体的表格结构，展示核心用法。",
        demoKey: "Default",
      },
      {
        id: "table-02",
        kind: "variant",
        title: "表格边框变体",
        description: "通过 border prop 切换是否有边框线的外观差异。",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "可排序列的头应该是 button 元素，sortable 属性使表头变成可点击的排序按钮。",
        "空单元格应填入 — 而不是 N/A 或空字符串，保证表格结构对齐。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Table 不提供内置排序状态或排序回调；需要排序时，由调用方在渲染前整理 rows，并自行给表头按钮添加状态和事件。",
    },
    responsiveBehavior: {
      status: "covered",
      content: ["窄视图中表格可以启用横向滚动，或切换为卡片堆叠布局以保持可读性。"],
    },
    themeBehavior: {
      status: "covered",
      content: ["表格的背景色、分割线和 hover 高亮都继承主题 token，斑马纹（zebra）可选配。"],
    },
  },
};

export const GUIDES_13_EN: Record<string, ComponentGuide> = {
  "split-button": {
    slug: "split-button",
    locale: "en-US",
    summary: "Combines a primary action with related variants in one control, saving row space.",
    whenToUse: [
      "When two or more related actions share the same row (e.g., 'Deploy' and 'Deploy to staging').",
      "When you need to balance visibility and space — the main action is prominent while secondary variants live in a menu.",
    ],
    whenNotToUse: [
      "When there are more than three related actions; use a regular Menu instead, because the split-button menu must not become a junk drawer.",
      "When two actions are equally important; place two side-by-side Buttons rather than a primary-secondary hierarchy.",
    ],
    examples: [
      {
        id: "split-btn-01",
        kind: "minimal",
        title: "Basic usage",
        description: "A split button with a primary action and a basic dropdown menu.",
        demoKey: "Menu Alignment",
      },
      {
        id: "split-btn-02",
        kind: "variant",
        title: "With icon",
        description:
          "Using an icon inside the split button to enhance visual recognition of the action.",
        demoKey: "Icon",
      },
      {
        id: "split-btn-03",
        kind: "variant",
        title: "Title with icon",
        description: "Displaying both text and icon alongside the button label simultaneously.",
        demoKey: "Title with Icon",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The menu button should carry a descriptive aria-label (e.g. 'Deploy to staging') instead of relying solely on the chevron icon.",
        "The main button is a normal focus element; when the menu opens, focus is trapped inside and Escape closes it while returning focus to the trigger.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Split Button manages its own open/close internal state and does not expose a controlled API.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "On narrow viewports the split button retains full functionality, but the menu width flips automatically based on window bounds to avoid clipping.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The split button inherits the Button variant system (primary, secondary, error, etc.) so both parts stay visually consistent.",
      ],
    },
  },
  "status-dot": {
    slug: "status-dot",
    locale: "en-US",
    summary:
      "Indicates a deployment lifecycle state with a small colored dot (building, ready, error, etc.).",
    whenToUse: [
      "Showing deployment lifecycle states: QUEUED, BUILDING, READY, ERROR, CANCELED, DELETED.",
      "Placed inline beside text labels in table rows, list cards, or command palette items.",
    ],
    whenNotToUse: [
      "Non-deployment statuses should use a Badge (e.g., workflow runs, queue messages).",
      "Do not add a status dot when the adjacent text already clearly names the state, avoiding redundant signaling.",
    ],
    examples: [
      {
        id: "status-dot-01",
        kind: "minimal",
        title: "Default status dot",
        description: "The default rendered appearance of a status dot without extra text.",
        demoKey: "Default",
      },
      {
        id: "status-dot-02",
        kind: "variant",
        title: "Status dot with label",
        description: "A readable text label alongside the dot for a dual information channel.",
        demoKey: "Label",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Mark the dot as aria-hidden when the adjacent text already names the state, so screen readers do not announce it twice.",
        "Animated dots for BUILDING / QUEUED should respect the user's prefers-reduced-motion preference.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "The current deployment state string passed via the value prop drives the dot's color and animation changes reactively.",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "The Status Dot is a purely decorative micro-interaction component with no responsive layout adjustments.",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The dot's color mapping is theme-aware: green for ready, red for error, amber for warning, blue for building.",
      ],
    },
  },
  "step-point": {
    slug: "step-point",
    locale: "en-US",
    summary: "Marks a user's progress through a multi-step flow or wizard.",
    whenToUse: [
      "Guiding users through multi-step flows such as setup wizards, registration forms, or deployment configurations.",
      "Communicating the overall structure of a linear task, current position, and remaining steps.",
    ],
    whenNotToUse: [
      "Single-action or step-less scenarios should not use a step-point indicator.",
      "Multiple independent sub-flows on the same page each deserve their own step-point component.",
    ],
    examples: [
      {
        id: "step-point-01",
        kind: "minimal",
        title: "Default step indicators",
        description:
          "Standard horizontal arrangement of step points showing the default appearance.",
        demoKey: "Default",
      },
      {
        id: "step-point-02",
        kind: "advanced",
        title: "Full multi-step flow",
        description:
          "Combining step indicators with content areas to demonstrate a complete guided flow experience.",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Completed and active step indicators should have clear focus styles; keyboard users can tab through all steps.",
        "The active step should carry an aria-current attribute so screen readers announce the user's position.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Controlled via activeIndex for the highlighted step and a completedIndexes array marking finished steps.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "On narrow viewports, step indicators can switch to vertical layout or hide inactive steps to save space.",
      ],
    },
    themeBehavior: {
      status: "not-applicable",
      reason:
        "Step points use fixed semantic colors (grey unvisited, brand active, checkmark done) and do not support theme customization.",
    },
  },
  switch: {
    slug: "switch",
    locale: "en-US",
    summary:
      "A segmented selector for 2–3 mutually exclusive options, used to toggle between views of the same surface.",
    whenToUse: [
      "Switching between two or three mutually exclusive options (e.g., Source vs Output views).",
      "When options are few and users frequently toggle between them with need for instant feedback.",
    ],
    whenNotToUse: [
      "For boolean on/off toggles use Toggle instead; Switch implements radio semantics, not checkbox semantics.",
      "Past 3 options or when labels grow beyond a couple of words, switch to Tabs or a Select.",
    ],
    examples: [
      {
        id: "switch-01",
        kind: "minimal",
        title: "Basic usage",
        description: "A segmented selector with two mutually exclusive options.",
        demoKey: "default",
      },
      {
        id: "switch-02",
        kind: "variant",
        title: "Size variants",
        description: "Different size specs adapting to compact or spacious panel layouts.",
        demoKey: "Sizes",
      },
      {
        id: "switch-03",
        kind: "stateful",
        title: "Disabled state",
        description: "Demonstrating the disabled appearance and why an option is unavailable.",
        demoKey: "Disabled",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Every Switch.Control should carry an accessible name (even icon-only controls need a Tooltip plus an sr-only label).",
        "Left/Right arrows move focus across options, Enter or Space activates, Escape exits.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Uses the checked prop for controlled state management with onChange callback to sync parent state.",
        "A name prop must be assigned to the Switch group for radio-style mutual exclusion; defaultChecked determines the initial selected option.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "In full-width mode on narrow screens provides better touch targets; padding per control ensures the widest label fits without resizing the active pill.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The active pill color follows theme tokens, maintaining consistent contrast in both light and dark modes.",
      ],
    },
  },
  table: {
    slug: "table",
    locale: "en-US",
    summary: "Displays structured data in rows and columns, suited for comparison and analysis.",
    whenToUse: [
      "When data rows share the same shape and at least one column is sortable or comparable across rows.",
      "Rendering dense structured data such as order lists, member tables, or deployment logs.",
    ],
    whenNotToUse: [
      "A single row paired with one action should use the Entity component instead of a table.",
      "Key/value metadata on a detail page should use Description, not a two-column table impersonation.",
    ],
    examples: [
      {
        id: "table-01",
        kind: "minimal",
        title: "Basic table",
        description: "A standard header-body table structure showing the core usage pattern.",
        demoKey: "Default",
      },
      {
        id: "table-02",
        kind: "variant",
        title: "Table border variants",
        description: "Toggling the presence of border lines via the border prop.",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Sortable column headers are buttons enabled by the sortable prop; the visible label stays Title Case while the sort arrow is decorative.",
        "Empty cells should show an em dash (—), never N/A or an empty string, to keep table alignment correct.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Table does not provide built-in sorting state or callbacks. Sort rows before rendering and implement any sortable header buttons in caller code.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "On narrow viewports the table can enable horizontal scrolling, or switch to a card-stack layout for readability.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Table background colors, dividers, and hover highlights inherit theme tokens; zebra striping is configurable.",
      ],
    },
  },
};
