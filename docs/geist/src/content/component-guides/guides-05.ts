import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_05_ZH: Record<string, ComponentGuide> = {
  "destructive-action-modal": {
    slug: "destructive-action-modal",
    locale: "zh-CN",
    summary:
      "用于确认危险操作的模态框，通过红色 AlertTriangle 标题和需验证文本输入的二次确认机制来防止误操作。",
    whenToUse: [
      "当操作具有不可逆或严重后果（如删除、吊销密钥、降级计划）且需要强制用户明确意图时使用。",
      "对于可恢复但后果严重的数据删除操作，使用此组件并在标题中说明影响范围。",
      "需要在提交前让用户输入确认短语以证明其理解操作后果时。",
    ],
    whenNotToUse: [
      "常规低风险确认不需要二次验证的保存草稿、丢弃未保存更改等场景，应使用普通 Modal。",
      "操作结果仅涉及轻度界面刷新或可立即撤销的情况不应引入额外的输入门槛。",
      "非阻塞式轻量提示应使用 Toast 而非 Modal。",
    ],
    examples: [
      {
        id: "destructive-action-modal-default",
        kind: "minimal",
        title: "默认危险操作确认",
        description:
          "展示标题、描述文本和输入验证的最小结构，用户须输入与标题完全匹配的短语才能点击确认。",
        demoKey: "Default",
      },
      {
        id: "destructive-action-modal-reversible",
        kind: "stateful",
        title: "可恢复的危险操作",
        description: "操作本身可撤销但仍需谨慎处理，使用此模式并移除不可恢复警告横幅。",
        demoKey: "Reversible",
      },
      {
        id: "destructive-action-modal-loading",
        kind: "variant",
        title: "加载中状态",
        description: "按钮处于加载时两个按钮均禁用，调用方管理打开状态并在 API 完成后关闭。",
        demoKey: "Loading",
      },
      {
        id: "destructive-action-modal-error",
        kind: "variant",
        title: "错误状态处理",
        description: "API 失败时保持模态框打开让用户可以重试，而不是静默关闭。",
        demoKey: "With error",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "输入验证在打开时获取焦点以便用户立即开始输入，提交按钮在值完全匹配前禁用。",
        "标题应使用 Title Case 命名陈述句（如 Delete Project），而非疑问句。",
        "loading 状态会禁用两个按钮以防止重复提交。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "调用方负责控制 open 状态，不自行关闭——应在 API 结算后或出错时保持打开。",
        "loading 属性同时禁用两个按钮，由父组件管理交互状态。",
        "输入字段在打开时自动聚焦并持续校验匹配性。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "模态框在小屏幕上显示为全屏覆盖，在大屏上居中显示。",
        "标题和输入字段的字体大小根据视口宽度进行响应式调整。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "使用语义化变体颜色表示危险操作（红色渐变）。",
        "支持暗色/亮色主题切换，红色警示信号在所有主题下保持一致。",
      ],
    },
  },
  "dots-menu": {
    slug: "dots-menu",
    locale: "zh-CN",
    summary:
      "通过三点图标触发的溢出菜单，在下拉面板中展现更多操作选项，是行级或卡片级菜单的标准入口。",
    whenToUse: [
      "行内、卡片或资源项上空间有限，需要展开更多相关操作时使用。",
      "与 Context Menu 互补：Dots Menu 面向可见触发器和键盘/鼠标通用操作，右击快捷操作则由 Context Menu 承担。",
    ],
    whenNotToUse: [
      "操作数量超过 10 项时应考虑使用 Split Button + Menu 分组或导航至独立的设置页面。",
      "单一直达主操作不应使用 Dots Menu，应将最常用的行动放在最显眼的位置。",
      "右键上下文操作应由 Context Menu 提供而非仅靠 Dots Menu。",
    ],
    examples: [
      {
        id: "dots-menu-default",
        kind: "minimal",
        title: "默认省略号菜单",
        description: "展示默认大小的三点图标触发下拉菜单的基本用法。",
        demoKey: "default",
      },
      {
        id: "dots-menu-sizes",
        kind: "variant",
        title: "不同尺寸",
        description: "演示多种尺寸的省略号菜单以适配不同的密集度布局。",
        demoKey: "sizes",
      },
      {
        id: "dots-menu-disabled",
        kind: "stateful",
        title: "禁用状态",
        description: "在不可操作状态下将省略号菜单禁用，视觉反馈操作不可用。",
        demoKey: "disabled",
      },
      {
        id: "dots-menu-disabled-item",
        kind: "stateful",
        title: "禁用的菜单项",
        description: "部分菜单项因权限或条件限制被禁用，其余仍可使用。",
        demoKey: "disabled-menu-item",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "三点图标按钮需要明确的 aria-label 以便屏幕阅读器识别菜单功能。",
        "菜单打开时通过 Escape 键关闭并返回焦点到触发器。",
        "方向键在菜单项目间移动，Enter 或 Space 激活选中项。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "菜单打开状态由父组件控制，通过 open 属性管理显示与隐藏。",
        "点击菜单项后自动关闭并执行对应动作，将焦点归还触发器。",
        "受控模式下可通过编程方式打开或关闭菜单。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "位置策略 auto-flip 根据窗口边界自适应定位，避免在窄屏下内容裁剪。",
        "大间距环境下菜单项目间距增大以提升触摸目标面积。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "遵循应用主题系统渲染背景、边框和高亮颜色。",
        "禁用状态的色调通过 CSS 变量从主题令牌获取，确保亮/暗模式一致。",
      ],
    },
  },
  drawer: {
    slug: "drawer",
    locale: "zh-CN",
    summary:
      "在现有内容下方从底部弹出的覆盖层视图，专用于移动端短表单和轻量面板，保持上下文连续性。",
    whenToUse: [
      "小视口中需要展示短聚焦动作，如单个表单、筛选面板或与 Cancel 配对的主 CTA。",
      "需要在保留当前浏览上下文的同时呈现辅助内容，但不需要桌面端侧边栏那样的持久面板。",
    ],
    whenNotToUse: [
      "确认危险操作时不要用 Drawer——缺乏完全遮挡的遮罩降低了删除和吊销流程所需的严重程度信号。",
      "桌面端需要交互性侧面板时使用 Sheet 而非 Drawer。",
      "长内容或多步骤表单应路由到独立页面而非塞入 Drawer。",
    ],
    examples: [
      {
        id: "drawer-default",
        kind: "minimal",
        title: "默认抽屉",
        description: "从底部弹出填充视口大部分高度的默认 Drawer，用于短表单或信息面板。",
        demoKey: "default",
      },
      {
        id: "drawer-custom-height",
        kind: "variant",
        title: "自定义高度",
        description: "通过自定义高度参数控制 Drawer 的具体占屏比例以适应不同的内容量需求。",
        demoKey: "custom-height",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Drawer 打开时捕获内部焦点，关闭后将焦点返回到触发器元素。",
        "Escape 键关闭 Drawer，确保键盘用户的完整退出路径。",
        "DrawerTitle 应为 Title Case 名词短语，命名所展示的资源实体。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "open 状态由父组件完全控制，内部不自行管理打开与关闭。",
        "关闭时通过回调通知父组件以同步外部状态。",
        "锁住 body 滚动以开放状态保持，恢复于关闭时。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "专为移动端设计——仅在小型视口中使用；桌面端替代为 Sheet。",
        "Swipe-down 手势支持默认关闭行为，确保触屏设备的自然交互。",
        "自定义高度 prop 可根据视口大小灵活适配内容。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "背景层、阴影和分隔线颜色跟随应用主题。",
        "Body 滚动锁定在暗色/亮色主题下均有正确的对比度表现。",
      ],
    },
  },
  "empty-state": {
    slug: "empty-state",
    locale: "zh-CN",
    summary: "当无内容已添加或视图为空时填充区域的通用组件；场景差异由调用方通过标题、图标和 children 组合。",
    whenToUse: [
      "列表过滤后返回零条结果或资源尚未创建时，由调用方传入相应标题、描述、图标和操作。",
      "用户访问了其无权查看的路由时，可由页面布局全屏承载 EmptyState 并提供导航建议。",
      "数据完成加载后的清空视图或已完成工作的 cleared 状态。",
    ],
    whenNotToUse: [
      "不要在 Empty State 中放置关键持续性警告——空状态随列表填充而消失，持续性警告应放在 Note 或页面头部。",
      "已加载但有数据的正常视图中不需要 Empty State；异步网络错误的空列表应使用 Error 组件。",
      "三个以上的 CTAs 会使空状态变得臃肿——最多一个主行动加一个次行动。",
    ],
    examples: [
      {
        id: "empty-state-design-framework",
        kind: "advanced",
        title: "空状态设计框架",
        description:
          "完整的空状态组合方法——按用户需求配置标题、描述、图标和操作；这些名称不是内置 variant API。",
        demoKey: "empty-state-design-framework",
      },
      {
        id: "empty-state-blank-slate",
        kind: "minimal",
        title: "空白画布",
        description: "用户尚未创建任何资源时的初始空状态，搭配一个主 CTA 引导创建。",
        demoKey: "blank-slate",
      },
      {
        id: "empty-state-informational",
        kind: "variant",
        title: "信息型空状态",
        description: "通过通用 props 和 children 补充上下文，帮助用户理解当前状态而非盲目等待。",
        demoKey: "informational",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        '异步筛选变更后使用 aria-live="polite" 包裹区域以确保屏幕阅读器播报新状态。',
        "标题使用 Title Case；描述使用 sentence case 并补充标题之外的新信息。",
        "图标装饰性标记 aria-hidden，真正可访问的名称在文字内容中。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Empty State 是展示型组件，根据数据源的有无决定渲染何种空状态，没有受控开关。内容由父组件传入的 props 驱动，不存在 open/close 状态。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "CTA 按钮在窄屏下单列堆叠，宽屏中可水平排列。",
        "插图尺寸和间距在不同断点下自动缩放以保持可读性。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "色彩方案基于语义状态映射——成功绿色、警告琥珀色、错误红色。",
        "暗色主题下的插图和文字配色经过专门调优以保证可读性。",
      ],
    },
  },
  entity: {
    slug: "entity",
    locale: "zh-CN",
    summary: "结构化行组件，用于展示一个描述性对象及其主操作，适用于单个资源的行列组合展示。",
    whenToUse: [
      "展示单一描述性对象附带一个主操作行，例如成员行、集成行或资源详情行。",
      "需要将媒体、内容和操作固定在稳定列中以保证加载和选中状态不会改变行的布局时。",
    ],
    whenNotToUse: [
      "多行共享可比列的场景应使用 Table 而非 Entity，Table 更适合横向比较。",
      "键/值元数据块应使用 Description 组件而非 Entity。",
      "空列表数据应渲染 Empty State 而非空 Entity 行。",
    ],
    examples: [
      {
        id: "entity-default",
        kind: "minimal",
        title: "默认实体行",
        description: "标准 Entity 行结构包含媒体区域、内容区域和操作区域三列。",
        demoKey: "default",
      },
      {
        id: "entity-with-skeleton",
        kind: "stateful",
        title: "骨架屏加载中",
        description: "Entity 行在数据异步加载时显示骨架屏占位，加载完成后平滑过渡到真实内容。",
        demoKey: "entity-with-skeleton",
      },
      {
        id: "entity-with-list",
        kind: "variant",
        title: "带列表的实体",
        description: "多个 Entity 行组合成的列表视图，每行展示独立资源的详细信息和主操作。",
        demoKey: "entity-with-list",
      },
      {
        id: "entity-with-fill",
        kind: "variant",
        title: "弹性填充布局",
        description: "Entity 使用 fill 布局使各列按比例伸缩以适应容器宽度变化。",
        demoKey: "entity-with-fill",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "主操作按钮需要明确的 aria-label 命名具体操作和目标资源。",
        "每个 Entity 行作为独立语义区块组织，便于屏幕阅读器逐行播报。",
        "操作区域中的链接和按钮应有足够的触摸目标尺寸。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Entity 本质上是展示型行组件，不维护自身交互状态。选中态由父组件控制并通过 props 传递，Row 级别的点击通常由外层容器处理，Entity 组件本身不负责打开/关闭逻辑。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Entity 本身使用固定的 flex 行布局，不会在窄屏自动隐藏内容或把操作改为图标。",
        "调用方可通过 className、leftClassName 和 rightClassName 添加断点、换行或隐藏策略。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "行的背景、边框和悬停高亮通过 CSS 令牌跟随主题系统。",
        "分隔线和 hover 效果在暗色/亮色模式间正确转换。",
      ],
    },
  },
  "edit-menu": {
    slug: "edit-menu",
    locale: "zh-CN",
    summary: "选区驱动的横向胶囊编辑工具条，在容器内出现有效文本选区时浮现于选区上方。",
    whenToUse: [
      "需要对当前选中的文本执行剪切、复制、粘贴、全选、查询或共享时。",
      "希望操作条紧贴选区、随选区消失而隐藏时。",
    ],
    whenNotToUse: [
      "对某个对象（行、文件、画布元素）执行操作——那是 ContextMenu 的场景。",
      "需要常驻可见的编辑按钮组，而不是随选区浮现的浮层。",
    ],
    examples: [
      {
        id: "edit-menu-default",
        kind: "minimal",
        title: "默认编辑菜单",
        description: "选中文本后浮现胶囊工具条，并提供剪切、复制、粘贴、全选、查询与共享。",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "胶囊容器使用 role=\"toolbar\" 并带 aria-label，每个操作是可聚焦的原生 button。",
        "Escape 关闭胶囊；点击胶囊不会清除当前选区。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "组件自行监听选区，调用方只需提供各操作回调；未提供回调的标准操作不会渲染。",
        "Cut 由组件复制文本后交给 onCut，删除动作由调用方执行。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "上方空间不足时翻转到选区下方，水平方向居中于选区并 clamp 进视口。",
        "滚动与视口缩放时收起，避免浮层与选区脱节。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "胶囊背景、分隔线与文字色跟随主题 Token，暗色模式下保持对比度。",
        "入场缩放淡入动画在 prefers-reduced-motion 下禁用。",
      ],
    },
  },
  "activity-view": {
    slug: "activity-view",
    locale: "zh-CN",
    summary: "底部分享面板：横向滚动的分享目标网格 + 操作列表 + 取消行，复用 BottomSheet 容器。",
    whenToUse: [
      "需要从当前内容分享到多个目标（app、服务）时。",
      "需要把复制、打印、存储等操作与分享目标放在同一个底部面板时。",
    ],
    whenNotToUse: [
      "需要多档位可拖拽的底部弹层——直接用 BottomSheet。",
      "需要常驻的工具栏操作——用 Toolbar 而非一次性面板。",
    ],
    examples: [
      {
        id: "activity-view-default",
        kind: "minimal",
        title: "默认活动视图",
        description: "分享按钮唤起底部面板：目标网格、操作列表与取消行。",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "面板复用 Radix Dialog：焦点进入面板、Esc 与外部点击关闭、关闭后焦点归还触发元素。",
        "每个目标与操作都是带可见名称的原生 button，破坏性操作仅用颜色加语义标签区分。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "open 与 onOpenChange 完全受控；选中目标或操作后触发回调并自动关闭。",
        "标题可自定义，传 null 则不渲染标题行。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "目标区横向滚动，超出面板宽度时保持单行动线。",
        "面板占视口高度 60%，底部留出安全区内边距。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "面板背景、图标块底色与文字色跟随主题 Token。",
        "破坏性操作使用错误色 token，暗色模式下保持对比度。",
      ],
    },
  },
  "menu-bar": {
    slug: "menu-bar",
    locale: "zh-CN",
    summary: "横向应用菜单栏：顶级菜单、右对齐快捷键、子菜单与勾选项，键盘模型由 Radix Menubar 提供。",
    whenToUse: [
      "需要应用级命令集合（File / Edit / View）并展示键盘快捷键时。",
      "需要多级子菜单或可勾选的视图开关时。",
    ],
    whenNotToUse: [
      "页面级导航链接与滚动行为——用 Navbar。",
      "单命令的溢出操作——用 DotsMenu 或 Menu。",
    ],
    examples: [
      {
        id: "menu-bar-default",
        kind: "minimal",
        title: "默认菜单栏",
        description: "File / Edit / View 三个顶级菜单，含快捷键、子菜单、勾选态与禁用项。",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Radix Menubar 提供 role=menubar 与完整键盘模型：左右切顶级菜单、上下进菜单项、Esc 逐级关闭。",
        "快捷键文本标为 aria-hidden，仅作视觉提示，不干扰读屏播报命令名。",
        "禁用项保持可见并带 aria-disabled，命令仍可被发现。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "菜单开合由 Radix 自管；勾选项通过 checked 与 onCheckedChange 受控。",
        "组件不注册全局快捷键监听，按键绑定由调用方自行接入。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "顶级菜单横向排列，宽度不足时容器横向滚动。",
        "菜单浮层在视口内碰撞翻转，最大高度受限后可滚动。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "菜单栏与浮层使用 surface 与描边 token，暗色模式下自动切换。",
        "浮层入场缩放在 prefers-reduced-motion 下禁用。",
      ],
    },
  },
  toolbar: {
    slug: "toolbar",
    locale: "zh-CN",
    summary: "窗口级工具操作条：leading / center / trailing 三段分组，空间不足时按组折叠进溢出菜单。",
    whenToUse: [
      "需要窗口级命令组（导航、视图切换、收尾动作）并希望空间不足自动折叠时。",
      "需要把工具项按语义分成前、中、后三段时。",
    ],
    whenNotToUse: [
      "页面级导航链接与滚动行为——用 Navbar。",
      "应用级命令菜单（带快捷键与子菜单）——用 MenuBar。",
    ],
    examples: [
      {
        id: "toolbar-default",
        kind: "minimal",
        title: "默认工具栏",
        description: "前中后三组工具项，缩小容器后组折叠进尾部溢出菜单。",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "工具项是带无障碍名称的原生 button；仅图标显示时 label 仍作为 aria-label。",
        "选中态通过 aria-pressed 暴露，不依赖颜色单通道传达。",
        "溢出菜单复用 DotsMenu，键盘可达；禁用与选中状态一并透传到菜单项（disabled 不可点、aria-current 标记当前档）。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "折叠状态由容器内部测量自管（可通过 collapse=false 关闭），不暴露受控开关。",
        "工具项激活由 onSelect 回调驱动，选中态由调用方传入 active。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "空间不足时可折叠组整组收起，组内 ToolbarItem 进入溢出菜单；含搜索框 / MenuButton 等非 ToolbarItem 内容的组保持常驻（这类内容没有溢出入口）。",
        "展开启用 24px 滞回，避免临界宽度下反复折叠。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "工具栏使用 background 与描边 token，暗色模式下自动切换。",
        "项的高亮、选中与禁用态均使用灰阶 alpha token。",
      ],
    },
  },
  "safe-area": {
    slug: "safe-area",
    locale: "zh-CN",
    summary: "安全区间距容器：内边距取「间距档」与设备安全区 env(safe-area-inset-*) 的较大值。",
    whenToUse: [
      "内容需要避开圆角、刘海或系统栏时。",
      "需要为页面四周统一最小内边距时。",
    ],
    whenNotToUse: [
      "需要栅格或多列布局——用 Grid。",
      "需要滚动容器或吸附行为——用 Scroller。",
    ],
    examples: [
      {
        id: "safe-area-default",
        kind: "minimal",
        title: "默认安全区",
        description: "上下两边应用安全区边距，内容不被系统栏遮挡。",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "not-applicable",
      reason: "纯布局容器：不含交互与 ARIA 角色，可访问性由内部内容决定。",
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "无状态：只输出内边距，不接收也不持有任何状态。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "内边距与设备安全区取较大值，设备旋转或系统栏变化时自动跟随。",
        "可按边启用：只给需要的边（如仅上下）应用安全区。",
      ],
    },
    themeBehavior: {
      status: "not-applicable",
      reason: "只输出内边距，不消费颜色 token，因此不随主题变化。",
    },
  },
  stack: {
    slug: "stack",
    locale: "zh-CN",
    summary: "方向 + 间距堆叠：语义化的 flex 预设，用统一间距档替代随机的 gap 值。",
    whenToUse: [
      "需要把子元素按单一方向排列并统一间距时。",
      "希望间距来自设计系统的档位而非临时数值时。",
    ],
    whenNotToUse: [
      "需要栅格、列宽或不规则排布——用 Grid。",
      "需要滚动、吸附或虚拟列表——用 Scroller。",
    ],
    examples: [
      {
        id: "stack-default",
        kind: "minimal",
        title: "默认堆叠",
        description: "纵向堆叠两组行：一组居中对齐，一组两端对齐。",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "not-applicable",
      reason: "纯布局容器：不改变内容的语义与可访问性树。",
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "无状态：方向、间距与对齐均由 props 直接决定。",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason: "方向固定，不随断点变化；需要响应式时由调用方传入 className 或断点类。",
    },
    themeBehavior: {
      status: "not-applicable",
      reason: "只输出 flex 与间距，不消费颜色 token，因此不随主题变化。",
    },
  },
};

export const GUIDES_05_EN: Record<string, ComponentGuide> = {
  "destructive-action-modal": {
    slug: "destructive-action-modal",
    locale: "en-US",
    summary:
      "A modal that confirms destructive actions with a red AlertTriangle header and a typed verification gate to prevent accidental execution.",
    whenToUse: [
      "When the action is destructive and warrants friction — delete, rotate, revoke, disconnect, downgrade. The typed gate forces deliberate intent.",
      "For reversible destructive actions too, when the consequence is serious enough to warrant a pause but still benefit from the typed gate.",
      "When you need the user to type a confirmation phrase to prove their understanding of the consequences before proceeding.",
    ],
    whenNotToUse: [
      "Routine confirmations such as save draft, discard changes, or close without saving should use a plain Modal — the typed gate reads as melodrama when the stakes are low.",
      "Actions that only involve a light UI refresh or immediate undo don't merit an input barrier — use a non-blocking toast instead.",
      "Non-blocking acknowledgments belong to Toast, not Modal — a destructive confirmation needs the blocking overlay.",
    ],
    examples: [
      {
        id: "destructive-action-modal-default",
        kind: "minimal",
        title: "Default destructive confirmation",
        description:
          "The minimal structure with title, body text, and input verification — the user must type the phrase exactly to enable confirm.",
        demoKey: "Default",
      },
      {
        id: "destructive-action-modal-reversible",
        kind: "stateful",
        title: "Reversible destructive action",
        description:
          "The action itself is reversible but still requires caution — show this mode and drop the irreversibility band from the body.",
        demoKey: "Reversible",
      },
      {
        id: "destructive-action-modal-loading",
        kind: "variant",
        title: "Loading state",
        description:
          "Both buttons are disabled during loading — the caller owns the open state and closes after the API settles.",
        demoKey: "Loading",
      },
      {
        id: "destructive-action-modal-error",
        kind: "variant",
        title: "Error handling",
        description:
          "Keep the modal open on API failure so the user can retry, rather than silently dismissing.",
        demoKey: "With error",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The verification input gets focus on open so the user can start typing immediately; submit stays disabled until the value matches exactly.",
        "Title should be a Title Case statement — never a question — e.g. Delete Project, not Delete this project?.",
        "The loading state disables both buttons to prevent duplicate submissions.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "The caller owns open — do not self-dismiss from onConfirm; close after the API settles or keep open on error so the user can retry.",
        "The loading property disables both buttons simultaneously, managed by the parent component.",
        "The input field auto-focuses on open and continuously validates against the confirmation phrase.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "On small screens the modal displays as a full-screen cover; on larger viewports it centers with appropriate margins.",
        "Font sizes for the title and input field scale responsively across breakpoints.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Uses semantic variant coloring for destructive actions (red tones).",
        "Dark/light theme switching preserves the red warning signal across all themes.",
      ],
    },
  },
  "dots-menu": {
    slug: "dots-menu",
    locale: "en-US",
    summary:
      "An overflow menu triggered by a three-dot icon that reveals additional actions in a dropdown — the standard entry point for row-level or card-level secondary actions.",
    whenToUse: [
      "Where space is limited on rows, cards, or resource items and you need to surface additional related actions.",
      "As a complement to Context Menu: Dots Menu handles visible triggers with keyboard/mouse parity, while right-click shortcuts are handled by Context Menu.",
    ],
    whenNotToUse: [
      "When there are more than 10 actions — consider using Split Button + Menu with grouping or navigate to a dedicated settings page.",
      "The single most common action should not be buried in a Dots Menu — place it prominently.",
      "Right-click contextual actions belong in Context Menu, not solely behind a Dots Menu trigger.",
    ],
    examples: [
      {
        id: "dots-menu-default",
        kind: "minimal",
        title: "Default dots menu",
        description: "Basic usage showing the default three-dot icon triggering a dropdown menu.",
        demoKey: "default",
      },
      {
        id: "dots-menu-sizes",
        kind: "variant",
        title: "Sizes",
        description: "Different dot-menu sizes to fit various density layouts and contexts.",
        demoKey: "sizes",
      },
      {
        id: "dots-menu-disabled",
        kind: "stateful",
        title: "Disabled dots menu",
        description:
          "Disabling the dots menu when the resource has no available actions, providing visual feedback.",
        demoKey: "disabled",
      },
      {
        id: "dots-menu-disabled-item",
        kind: "stateful",
        title: "Disabled menu item",
        description:
          "Some menu items are disabled due to permissions or conditions, while others remain active.",
        demoKey: "disabled-menu-item",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The three-dot icon button requires a clear aria-label so screen readers announce the menu purpose.",
        "Escape closes the menu and returns focus to the trigger.",
        "Arrow keys move focus through items; Enter or Space activates the selected item.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Menu open state is controlled by the parent via the open prop for show and hide.",
        "Items close automatically on activation and execute the corresponding action, returning focus to the trigger.",
        "In controlled mode the menu can be opened or closed programmatically.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Position strategy auto-flips based on window bounds to avoid clipping on narrow viewports.",
        "Touch targets expand in large-spacing environments for better tap accuracy.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Background, border, and highlight colors follow the application theme system.",
        "Disabled-state tones are sourced from CSS variables ensuring consistency across light and dark modes.",
      ],
    },
  },
  drawer: {
    slug: "drawer",
    locale: "en-US",
    summary:
      "A bottom-overlay panel that slides up from the viewport edge for short mobile forms and lightweight side panels, preserving context continuity.",
    whenToUse: [
      "On small viewports for short focused actions: a single form, a filter sheet, or a primary CTA paired with Cancel.",
      "When you need to present auxiliary content while keeping the browsing context intact without requiring a desktop-side-panel–level persistent surface.",
    ],
    whenNotToUse: [
      "Don't use Drawer to confirm destructive actions — the lack of a fully blocking dim weakens the severity signal delete and revoke flows need.",
      "Use Sheet on desktop for persistent associated context instead of a Drawer.",
      "Long multi-step forms should route to a dedicated page rather than squeezed into a Drawer.",
    ],
    examples: [
      {
        id: "drawer-default",
        kind: "minimal",
        title: "Default drawer",
        description:
          "A drawer that slides up from the bottom covering most of the viewport, used for short forms or info panels.",
        demoKey: "default",
      },
      {
        id: "drawer-custom-height",
        kind: "variant",
        title: "Custom height",
        description:
          "Controlling the drawer's viewport proportion via the custom height prop to match different content volumes.",
        demoKey: "custom-height",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Focus is trapped inside the drawer while open and returned to the trigger element on close.",
        "Escape closes the drawer, ensuring a complete keyboard exit path.",
        "DrawerTitle should be a Title Case noun phrase naming the displayed resource entity.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "The open state is fully controlled by the parent — internals do not manage open/close independently.",
        "Close callbacks notify the parent to synchronize external state.",
        "Body scroll is locked while open and restored on close.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Designed for mobile — use only on small viewports; replace with Sheet on desktop.",
        "Swipe-down gesture dismissal is supported natively for natural touchscreen interaction.",
        "Custom height prop allows flexible adaptation to different content needs.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Backdrop shadow and divider colors follow the application theme.",
        "Body scroll lock maintains proper contrast in both dark and light themes.",
      ],
    },
  },
  "empty-state": {
    slug: "empty-state",
    locale: "en-US",
    summary:
      "Fills an area when no content has been added or a view is empty. The caller composes each scenario from title, description, icon, and children.",
    whenToUse: [
      "When a filtered list returns zero results or a resource has not been created, pass scenario-specific copy, iconography, and actions.",
      "When a user lands on a route they cannot view, the page layout can render EmptyState full-page with navigation guidance.",
      "For cleared states after completed work or finished downloads.",
    ],
    whenNotToUse: [
      "Don't put critical persistent warnings in Empty States — they vanish when the list populates; persistent warnings belong in a Note or the page header.",
      "Normal loaded views with data should not show Empty State — asynchronously failed loads should use the Error component instead.",
      "Three CTAs make an empty state bloated — cap at one primary plus one secondary action.",
    ],
    examples: [
      {
        id: "empty-state-design-framework",
        kind: "advanced",
        title: "Empty state design framework",
        description:
          "Compose title, description, icon, and actions for the user's need; these scenario names are not a built-in variant API.",
        demoKey: "empty-state-design-framework",
      },
      {
        id: "empty-state-blank-slate",
        kind: "minimal",
        title: "Blank slate",
        description:
          "Initial empty state when no resources have been created, paired with a primary CTA to guide creation.",
        demoKey: "blank-slate",
      },
      {
        id: "empty-state-informational",
        kind: "variant",
        title: "Informational empty state",
        description:
          "Uses the generic props and children to add context that helps users understand the current state rather than waiting blindly.",
        demoKey: "informational",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        'Wrap the region in aria-live="polite" after an async filter change so screen readers announce the new state.',
        "Title is Title Case; description is sentence case and adds new information instead of restating the title.",
        "Decorative icons use aria-hidden; meaningful accessible names live in the text content.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Empty State is a presentation-only component driven by whether the data source has content. It does not manage an open/close toggle — content is passed as props from the parent, and there is no interactive state to control.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "CTA buttons stack vertically on narrow screens and can sit horizontally aligned on wider viewports.",
        "Illustration size and spacing scale down automatically to maintain readability at smaller breakpoints.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Color mapping follows semantic states — green for success, amber for warning, red for error.",
        "Dark-mode illustration and text color combinations are specifically tuned for legibility.",
      ],
    },
  },
  entity: {
    slug: "entity",
    locale: "en-US",
    summary:
      "A structured row for a descriptive object with one primary row action — ideal for single-resource row layouts with media, content, and action columns.",
    whenToUse: [
      "For one descriptive object with one primary row action, like a membership row, integration row, or resource detail row.",
      "When you need media, content, and actions in stable columns so loading and selected states do not shift the row layout.",
    ],
    whenNotToUse: [
      "Use Table when rows share comparable columns — Entity is for single-object rows, not tabular comparison.",
      "A key/value metadata block on a detail page should use Description, not Entity.",
      "Empty lists should render Empty State outside the table rather than empty Entity rows.",
    ],
    examples: [
      {
        id: "entity-default",
        kind: "minimal",
        title: "Default entity row",
        description:
          "Standard Entity row structure with three columns: media area, content area, and action area.",
        demoKey: "default",
      },
      {
        id: "entity-with-skeleton",
        kind: "stateful",
        title: "Skeleton loading",
        description:
          "Entity row shows skeleton placeholders during async data loading, transitioning smoothly to real content on resolve.",
        demoKey: "entity-with-skeleton",
      },
      {
        id: "entity-with-list",
        kind: "variant",
        title: "Entity with list",
        description:
          "Multiple Entity rows combined into a list view, each row displaying independent resource details and the primary action.",
        demoKey: "entity-with-list",
      },
      {
        id: "entity-with-fill",
        kind: "variant",
        title: "Fill layout",
        description:
          "Entity uses fill layout so columns stretch proportionally to adapt to container width changes.",
        demoKey: "entity-with-fill",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Primary action buttons require clear aria-labels naming the specific action and target resource.",
        "Each Entity row is organized as an independent semantic block for screen-reader-friendly line-by-line narration.",
        "Action-area links and buttons should have adequate touch target sizes.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Entity is fundamentally a presentation row component and does not manage its own interaction state. Selection state is controlled externally via props, and row-level clicks are typically handled by the outer container — the Entity component itself is responsible for displaying, not for open/close logic.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Entity uses a fixed flex row and does not automatically hide content or convert actions to icons on narrow screens.",
        "Use className, leftClassName, and rightClassName to add application-specific breakpoints, wrapping, or visibility rules.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Row background, borders, and hover highlights follow the application's CSS token system.",
        "Dividers and hover effects transition correctly between dark and light modes.",
      ],
    },
  },
  "edit-menu": {
    slug: "edit-menu",
    locale: "en-US",
    summary:
      "A selection-driven horizontal capsule toolbar of edit actions that floats above the active text selection inside the container.",
    whenToUse: [
      "When you need cut, copy, paste, select all, look up, or share for the current text selection.",
      "When the toolbar should hug the selection and disappear as soon as the selection does.",
    ],
    whenNotToUse: [
      "For actions on an object such as a row, file, or canvas element — that is ContextMenu.",
      "For an always-visible edit button group rather than a floating layer tied to a selection.",
    ],
    examples: [
      {
        id: "edit-menu-default",
        kind: "minimal",
        title: "Default edit menu",
        description:
          "Selecting text reveals the capsule with cut, copy, paste, select all, look up, and share.",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The capsule uses role=\"toolbar\" with an aria-label, and every action is a focusable native button.",
        "Escape closes the capsule; pressing the capsule never clears the current selection.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "The component watches the selection itself; callers only supply handlers, and standard actions without a handler are not rendered.",
        "Cut copies the text for you and then hands it to onCut, which performs the deletion.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "It flips below the selection when there is no room above and clamps horizontally inside the viewport.",
        "It collapses on scroll and viewport resize so the capsule never drifts away from the selection.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Capsule background, dividers, and text colors follow theme tokens and keep contrast in dark mode.",
        "The scale-and-fade entrance is disabled under prefers-reduced-motion.",
      ],
    },
  },
  "activity-view": {
    slug: "activity-view",
    locale: "en-US",
    summary:
      "A bottom share sheet: a horizontally scrolling grid of share targets, an action list, and a cancel row, built on the BottomSheet container.",
    whenToUse: [
      "When the current content can be shared to several targets such as apps or services.",
      "When copy, print, or save actions belong in the same bottom panel as the share targets.",
    ],
    whenNotToUse: [
      "For a draggable multi-detent bottom layer — use BottomSheet directly.",
      "For always-available toolbar actions — use a toolbar instead of a one-shot panel.",
    ],
    examples: [
      {
        id: "activity-view-default",
        kind: "minimal",
        title: "Default activity view",
        description:
          "A share button opens the bottom panel with a target grid, an action list, and a cancel row.",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The panel reuses the Radix dialog: focus moves into the panel, Escape and outside clicks close it, and focus returns to the trigger.",
        "Every target and action is a native button with a visible name; destructive actions differ by color and wording, not color alone.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "open and onOpenChange are fully controlled; picking a target or action runs the callback and closes the panel.",
        "The title is customizable; pass null to drop the title row entirely.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "The target row scrolls horizontally so targets stay on a single line when they overflow.",
        "The panel takes 60% of the viewport height and reserves bottom safe-area padding.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Panel background, icon tile color, and text colors follow theme tokens.",
        "Destructive actions use the error color token and keep contrast in dark mode.",
      ],
    },
  },
  "menu-bar": {
    slug: "menu-bar",
    locale: "en-US",
    summary:
      "A horizontal application menu bar with top-level menus, right-aligned shortcuts, submenus, and checkable items, backed by the Radix Menubar keyboard model.",
    whenToUse: [
      "For application-level command sets (File / Edit / View) that expose keyboard shortcuts.",
      "For multi-level submenus or checkable view toggles.",
    ],
    whenNotToUse: [
      "For page-level navigation links and scroll behavior — use Navbar.",
      "For a single command's overflow actions — use DotsMenu or Menu.",
    ],
    examples: [
      {
        id: "menu-bar-default",
        kind: "minimal",
        title: "Default menu bar",
        description:
          "File, Edit, and View menus with shortcuts, a submenu, a checkbox item, and a disabled item.",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Radix Menubar supplies role=menubar and the full keyboard model: arrow keys move between top-level menus and items, Escape closes one level at a time.",
        "Shortcut text is aria-hidden so screen readers announce the command name, not the key hint.",
        "Disabled items stay visible with aria-disabled so the command remains discoverable.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Menu open state is managed by Radix; checkbox items are controlled through checked and onCheckedChange.",
        "The component registers no global key handlers — you wire up the real shortcuts yourself.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Top-level menus sit in a row and the bar scrolls horizontally when space runs out.",
        "Menu surfaces flip on viewport collision and scroll once they hit the max height.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The bar and its surfaces use surface and border tokens that switch automatically in dark mode.",
        "The surface's scale entrance is disabled under prefers-reduced-motion.",
      ],
    },
  },
  toolbar: {
    slug: "toolbar",
    locale: "en-US",
    summary:
      "A window-level bar of tool items grouped into leading, center, and trailing slots that collapse group by group into an overflow menu.",
    whenToUse: [
      "For window-level command groups (navigation, view switching, finishing actions) that should collapse when space runs out.",
      "When tool items need a semantic front, middle, and back split.",
    ],
    whenNotToUse: [
      "For page-level navigation links and scroll behavior — use Navbar.",
      "For application-level command menus with shortcuts and submenus — use MenuBar.",
    ],
    examples: [
      {
        id: "toolbar-default",
        kind: "minimal",
        title: "Default toolbar",
        description:
          "Three groups of tool items; narrow the container and the groups collapse into the trailing overflow menu.",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Tool items are native buttons with an accessible name; in icon-only mode the label still becomes the aria-label.",
        "The selected state is exposed through aria-pressed rather than color alone.",
        "The overflow menu reuses DotsMenu and stays keyboard reachable; disabled and selected states carry over to its items (disabled is not actionable, aria-current marks the current option).",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Collapse state is measured internally (turn it off with collapse=false) and is not a controlled prop.",
        "Activation runs the onSelect callback; the selected state comes from the caller's active prop.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Collapsible groups fold away as a unit and their ToolbarItems move into the overflow menu; groups holding non-ToolbarItem content such as a search field stay in place because that content has no overflow entry point.",
        "Expanding uses a 24px hysteresis band so the bar does not flap at the threshold width.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The bar uses background and border tokens that switch automatically in dark mode.",
        "Hover, selected, and disabled states all use grayscale alpha tokens.",
      ],
    },
  },
  "safe-area": {
    slug: "safe-area",
    locale: "en-US",
    summary:
      "A spacing container whose padding is the larger of the spacing step and the device safe area (env(safe-area-inset-*)).",
    whenToUse: [
      "When content must stay clear of rounded corners, notches, or system bars.",
      "When a page needs one consistent minimum inset on all sides.",
    ],
    whenNotToUse: [
      "For grid or multi-column layout — use Grid.",
      "For scrolling or snapping behavior — use Scroller.",
    ],
    examples: [
      {
        id: "safe-area-default",
        kind: "minimal",
        title: "Default safe area",
        description:
          "Safe-area padding on the top and bottom edges keeps content clear of system bars.",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "not-applicable",
      reason: "A pure layout container: no interaction and no ARIA role; accessibility comes from its content.",
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "Stateless — it only emits padding and holds no state of its own.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Padding takes the larger of the spacing step and the device safe area, so it follows rotation and system bar changes.",
        "Edges are opt-in: apply the safe area only where it is needed, such as top and bottom.",
      ],
    },
    themeBehavior: {
      status: "not-applicable",
      reason: "It only emits padding and consumes no color tokens, so it does not vary by theme.",
    },
  },
  stack: {
    slug: "stack",
    locale: "en-US",
    summary:
      "A flex preset that stacks children in one direction using a shared spacing step instead of ad-hoc gap values.",
    whenToUse: [
      "When children line up in a single direction with one consistent gap.",
      "When spacing should come from design-system steps rather than arbitrary numbers.",
    ],
    whenNotToUse: [
      "For grids, column widths, or irregular placement — use Grid.",
      "For scrolling, snapping, or virtualized lists — use Scroller.",
    ],
    examples: [
      {
        id: "stack-default",
        kind: "minimal",
        title: "Default stack",
        description: "A column stack of two rows: one centered, one justified to the ends.",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "not-applicable",
      reason: "A pure layout container: it does not change the semantics or the accessibility tree of its content.",
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "Stateless — direction, gap, and alignment come directly from props.",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason: "The direction is fixed and does not change at breakpoints; pass className or breakpoint classes for responsive behavior.",
    },
    themeBehavior: {
      status: "not-applicable",
      reason: "It only emits flex and spacing and consumes no color tokens, so it does not vary by theme.",
    },
  },
};
