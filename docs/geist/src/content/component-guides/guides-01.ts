import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_01_ZH: Record<string, ComponentGuide> = {
  avatar: {
    slug: "avatar",
    locale: "zh-CN",
    summary: "用图片或回退占位符表示用户或团队。",
    whenToUse: [
      "用 Avatar 表示单个用户或团队，并在头像旁显示姓名和角色信息。",
      "使用堆叠（Stacked）Avatar 展示一组人员，如团队成员列表或评论者集合。",
      "为图片加载失败或缺失的场景提供回退（如首字母、图标或占位色块），保证识别性。",
    ],
    whenNotToUse: [
      "不需要在卡片、表格等组件内部重复渲染头像——优先用 Entity 行或其他结构化布局。",
      "不要用 Avatar 展示非人物的实体（产品 logo、系统图标等），这些应使用 Icon 或通用占位符。",
      "不要将 Avatar 用作装饰性背景元素；它的语义是表示一个真实的人。",
    ],
    examples: [
      {
        id: "size",
        kind: "minimal",
        title: "尺寸",
        description: "展示 sm、default、lg 三种预设尺寸，匹配密集行、列表提及和档案页头的上下文。",
        demoKey: "Size",
      },
      {
        id: "fallback",
        kind: "variant",
        title: "回退状态",
        description: "演示当图片不可用时的首字母、自定义图标和占位色块回退方案。",
        demoKey: "Letter",
      },
      {
        id: "stacking",
        kind: "advanced",
        title: "堆叠与重叠",
        description: "展示多个 Avatar 的重叠排列方式，包括固定重叠间距。",
        demoKey: "Stacking order",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "必须设置有意义的 alt 文本，以便屏幕阅读器朗读头像所代表的人物名称。",
        "堆叠 Avatar 组应在容器上添加 aria-label 说明总人数，避免逐条朗读造成冗余。",
        "无图回退的首字母头像应使用高对比度的背景色，确保文字可读。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Avatar 是无交互的展示型组件，不接收受控属性；图像回退由内部逻辑处理，无需外部状态控制。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Avatar 的尺寸通过 props 显式指定而非响应式断点，因此在任何视口下表现一致。",
        "堆叠 Avatar 在窄屏上保持重叠顺序不变，最多显示四个后以 +N 数字汇总呈现剩余人数。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Avatar 的颜色和样式跟随 Geist 主题变量（字体、色板），支持暗色/亮色模式自动适配。",
        "占位色块默认从用户名哈希派生颜色，可通过 CSS 变量覆盖。",
      ],
    },
  },
  badge: {
    slug: "badge",
    locale: "zh-CN",
    summary: "用于状态、数量和元数据的小标签。",
    whenToUse: [
      "在描述对象的旁边放置简短、可快速扫描的元数据标签：状态、计划层级、环境或角色。",
      "展示生命周期阶段标签（Alpha、Beta、Early Access），并配合 Tooltip 注明限制信息。",
      "用颜色映射表达含义：绿色表示健康，红色表示错误，琥珀色表示警告，蓝色表示信息或生产环境。",
    ],
    whenNotToUse: [
      "不要让 Badge 成为可点击元素；如果用户需要操作该值，提升为 Button 或链接。",
      "不要在 Badge 内嵌套另一个 Badge 或多个图标——每行只放一个 Badge。",
      "不要在 Badge 中塞入整句文案（如 Currently Active），周围行已经提供了上下文。",
    ],
    examples: [
      {
        id: "variants",
        kind: "minimal",
        title: "变体",
        description: "展示 subtle、neutral、warning、error、primary 等不同颜色变体。",
        demoKey: "Variants",
      },
      {
        id: "sizes",
        kind: "variant",
        title: "尺寸",
        description: "展示 md 和 sm 两种尺寸，适用于不同密度的布局。",
        demoKey: "Sizes",
      },
      {
        id: "icons",
        kind: "variant",
        title: "带图标",
        description: "展示图标加文字的 Badge，以及纯圆点变体（Status Dot）。",
        demoKey: "With icons",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "仅靠图标或颜色模糊不清的 Badge 应设置 title 属性，以便屏幕阅读器朗读其含义。",
        "不要仅仅依赖颜色传递信息——文本必须在没有颜色的情况下也可读。",
        "对于含敏感状态的 Badge（如 Error），避免将其放在低对比度表面上。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "Badge 是静态标签，不支持受控行为或交互状态；内容通过 props 直接渲染。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Badge 采用紧凑的内联排版，在窄屏和宽屏上保持一致的视觉密度。",
        "长文本在窄屏上自动换行或通过省略号截断，不会溢出父容器边界。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "每个变体对应一套深色/浅色模式下的颜色对，跟随主题变量的更新。",
        "-subtle 后缀色调可在密集表面上调低任何变体的饱和度，减少视觉干扰。",
      ],
    },
  },
  banner: {
    slug: "banner",
    locale: "zh-CN",
    summary: "一个横跨容器全宽的醒目消息区域，用于宣布重要信息。",
    whenToUse: [
      "在页面顶部或区块起始处展示全局公告、维护通知或关键提示，确保用户注意到。",
      "需要用颜色和图标传达语义状态时（成功、警告、错误），使用 Banner 作为区域级别的错误提示。",
      "当消息需要跨越完整内容宽度并提供上下文时（如部署状态变更）。",
    ],
    whenNotToUse: [
      "不要用 Banner 展示频繁变化的动态信息——优先考虑 Toast 通知，因为它更轻量且可持久化。",
      "不要在同一页面堆叠多个 Banner；超过两个说明应改用折叠面板或信息列表。",
      "不要把 Banner 用于表单级别的字段验证错误——使用 ErrorText 或 Input 的 error 属性。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认横幅",
        description: "展示默认的 Banner 外观，包含标题和描述文本。",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Banner 的语义相当于 alert 或 status 角色，屏幕阅读器应正确识别并朗读其内容。",
        "Banner 标题使用较高级别（Heading 2 或 3），描述文本紧跟其后以保持阅读层次。",
        "可关闭的 Banner 按钮应有明确的 aria-label 描述关闭动作。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Banner 支持 open/collapsed 状态的可编程控制，开发者可以决定何时自动收起或手动干预。",
        "关闭动画完成后返回焦点到触发按钮，保持键盘用户的导航连贯性。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Banner 在全宽容器内水平铺满，在小屏幕上自动调整内边距和字号比例。",
        "移动设备上 Banner 的高度降低，内容以堆叠布局替代行内布局。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "不同语义类型的 Banner（成功、警告、错误）在暗色/亮色模式下各有对应的配色方案。",
        "Banner 的背景色和边框颜色通过主题变量管理，支持全局自定义。",
      ],
    },
  },
  book: {
    slug: "book",
    locale: "zh-CN",
    summary: "一个响应式的书籍造型组件，用于营销页面和技术文档的封面展示。",
    whenToUse: [
      "在营销页面、文档着陆页封面和更新日志的醒目位置使用 Book，内容为标题载体时需要书籍的隐喻。",
      "使用简单（simple）风格让标题主导设计，或使用条纹（stripe）风格用图标或彩色条纹添加类别层级。",
      "在孤立的主题摄影场景中保留纹理处理，用于单篇文章或章节的视觉呈现。",
    ],
    whenNotToUse: [
      "不要在产品信息卡和管理仪表板的平铺中使用 Book——它过于装饰性，不适合重复排列的 UI 行。",
      "不要把 Book 当作可交互的内容编辑器——它是纯粹的展示框架，不支持编辑功能。",
      "不要在需要无障碍优先的场景中将封面作为主要内容源——封面应被视为装饰元素，标题应由底层标题元素提供。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认手册",
        description: "展示 Book 的基本用法，包含封面、书脊和厚度效果。",
        demoKey: "Default",
      },
      {
        id: "variants",
        kind: "variant",
        title: "变体",
        description: "展示 simple 和 stripe 两种风格变体。",
        demoKey: "Variants",
      },
      {
        id: "custom-illustration",
        kind: "advanced",
        title: "自定义插图",
        description: "展示如何替换内置插画并自定义颜色，创建个性化的书籍封面效果。",
        demoKey: "Custom illustration",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Book 的封面应标记为装饰性 chrome，标题应通过底层的 heading 元素呈现，以免屏幕阅读器双重朗读。",
        '封面插图的 alt 文本应为空（decorative="true"），因为实际意义已在标题中体现。',
        "书页厚度效果不应影响核心内容的可读性和聚焦能力。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Book 是无交互的展示型组件，没有任何状态转换或受控属性；封面造型完全通过 props 配置。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Book 使用响应式宽度来保留封面的宽高比，在不同视口下自动缩放而不失真。",
        "窄屏上书名可能缩小字号或启用多行，但保持封面比例的完整性。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Book 的阴影、边框和渐变效果跟随主题变量，在暗色/亮色模式下自动适配。",
        "可通过 props 自定义颜色（custom color）覆盖默认主题色，实现品牌一致性。",
      ],
    },
  },
  breadcrumbs: {
    slug: "breadcrumbs",
    locale: "zh-CN",
    summary: "导航辅助组件，展示用户在站点层级中的当前位置。",
    whenToUse: [
      "在具有多层级结构的应用中展示面包屑导航，帮助用户理解当前所在位置并快速跳转至上层节点。",
      "当 URL 路径反映了资源的层级关系时（如 /projects/space/documents），面包屑是自然的同步展现方式。",
      "在页面标题上方放置面包屑，作为标题的前置上下文引导。",
    ],
    whenNotToUse: [
      "不要在扁平结构中滥用面包屑——如果只有两层路径，简单的页面导航菜单就足够了。",
      "不要将面包屑用于过滤器和排序选项的展示——它们不是层级关系，应使用过滤器栏或标签切换。",
      "不要在移动端强制展示完整面包屑链——空间有限时应裁剪为非核心层级或使用抽屉式导航。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认面包屑",
        description: "展示默认的面包屑导航，包含分隔符和多级层级。",
        demoKey: "Default",
      },
      {
        id: "active",
        kind: "variant",
        title: "激活状态",
        description: "展示最后一项的激活/禁用样式，标识当前所在路径。",
        demoKey: "Active",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "面包屑包裹在 <nav> 元素中并带有 aria-label='Breadcrumb' 角色，帮助屏幕阅读器识别。",
        "当前页面的最后一个条目（激活态）不应是可链接的，应设置为 aria-current='page'。",
        "禁用态的面包屑项仍保留在 DOM 中但跳过 tabindex，确保键盘导航的一致性。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "面包屑是展示型的导航指示器，由路由状态驱动渲染；本身不接受受控属性或交互控制。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "面包屑在窄屏上自动截断中间层级（Home › ... › Current），保持最末端的当前位置可见。",
        "分隔符在各屏幕尺寸下保持一致的间距比例，确保可读性不因缩放而受损。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "面包屑的文字颜色、悬停态和当前页高亮跟随主题变量的文本色板和焦点指示。",
        "分隔符的颜色也来自主题变量，确保在暗色/亮色模式下均有足够的对比度。",
      ],
    },
  },
};

export const GUIDES_01_EN: Record<string, ComponentGuide> = {
  avatar: {
    slug: "avatar",
    locale: "en-US",
    summary: "Represents a user or a team with an image or fallback.",
    whenToUse: [
      "Use Avatar to represent a single user or team, displayed alongside name and role information.",
      "Use stacked Avatars to represent a group of people, such as team member lists or collections of commenters.",
      "Provide a fallback (initials, icon, or placeholder) so the avatar still reads when the image fails to load or is missing.",
    ],
    whenNotToUse: [
      "Do not repeat headshots inside cards or tables—prefer Entity rows or other structured layouts instead.",
      "Do not use Avatar for non-human entities (product logos, system icons)—use Icon or a generic placeholder for those.",
      "Do not use Avatar as a decorative background element; its semantic meaning is to represent a real person.",
    ],
    examples: [
      {
        id: "size",
        kind: "minimal",
        title: "Sizes",
        description:
          "Showcases the sm, default, and lg preset sizes, matching dense rows, list mentions, and profile header contexts.",
        demoKey: "Size",
      },
      {
        id: "fallback",
        kind: "variant",
        title: "Fallback states",
        description:
          "Demonstrates the initials, custom icon, and placeholder fallback schemes when an image is unavailable.",
        demoKey: "Letter",
      },
      {
        id: "stacking",
        kind: "advanced",
        title: "Stacking and overlap",
        description: "Shows overlapped arrangement of multiple Avatars with fixed overlap spacing.",
        demoKey: "Stacking order",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Always set meaningful alt text so screen readers announce the name of the person the avatar depicts.",
        "Grouped stacks should carry an aria-label describing the total count to avoid redundant individual announcements.",
        "Initial-only fallback avatars should use high-contrast background colors to ensure text legibility.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Avatar is a passive display component with no interactive state or controlled properties; fallback rendering is handled internally without external state control.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Avatar size is specified explicitly via props rather than responsive breakpoints, keeping consistent appearance across all viewports.",
        "Stacked Avatars maintain their overlap order on narrow screens, showing at most four before collapsing the remainder into a +N numeric indicator.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Avatar colors and styles follow Geist theme variables (typography, color palette) and adapt automatically between dark and light modes.",
        "Placeholder blocks derive their color from a hash of the username by default, overridable via CSS variables.",
      ],
    },
  },
  badge: {
    slug: "badge",
    locale: "en-US",
    summary: "Small labels for statuses, counts, and metadata.",
    whenToUse: [
      "Place short, scannable metadata labels next to the thing they describe: status, plan tier, environment, or role.",
      "Showcase lifecycle stage labels (Alpha, Beta, Early Access) paired with a Tooltip noting any limitations.",
      "Map meaning to color: green for healthy, red for error, amber for warning, blue for informational or production.",
    ],
    whenNotToUse: [
      "Never make a Badge clickable—if the user needs to act on the value, promote it to a Button or link.",
      "Never nest another Badge or multiple icons inside a Badge—one badge per row only.",
      "Avoid stuffing sentences inside a Badge (Currently Active); the surrounding row supplies the context.",
    ],
    examples: [
      {
        id: "variants",
        kind: "minimal",
        title: "Variants",
        description: "Showcases subtle, neutral, warning, error, and primary color variants.",
        demoKey: "Variants",
      },
      {
        id: "sizes",
        kind: "variant",
        title: "Sizes",
        description: "Showcases md and sm sizes for different layout densities.",
        demoKey: "Sizes",
      },
      {
        id: "icons",
        kind: "variant",
        title: "With icons",
        description: "Showcases icon-plus-text Badges and the standalone dot variant (Status Dot).",
        demoKey: "With icons",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Icon-only or ambiguous badges should have a title attribute so screen readers announce the meaning.",
        "Never rely on color alone; the text has to be readable without it.",
        "Error-status badges should avoid low-contrast surfaces to ensure visibility.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Badge is a static label with no controlled behavior or interactive state; content renders directly via props.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Badge uses compact inline typography that maintains consistent visual density on both narrow and wide screens.",
        "Long text auto-wraps or truncates with ellipsis on narrow viewports, never overflowing its parent container.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Each variant comes with a paired dark/light mode color set managed through theme variables.",
        "The -subtle suffix tone lowers saturation of any variant on dense surfaces to reduce visual interference.",
      ],
    },
  },
  banner: {
    slug: "banner",
    locale: "en-US",
    summary:
      "A prominent message that spans the full width of its container to announce important information.",
    whenToUse: [
      "Display global announcements, maintenance notices, or critical alerts at the top of a page or section start where user attention is needed.",
      "Use Banner as a section-level error indicator when conveying semantic states with color and icons (success, warning, error).",
      "When a message requires full content width and contextual framing (such as deployment status changes).",
    ],
    whenNotToUse: [
      "Avoid using Banner for frequently changing dynamic info—consider Toast notifications instead, as they are lighter and persistible.",
      "Do not stack more than two banners on one page; beyond that, switch to a collapse panel or info list.",
      "Do not use Banner for form-level field validation errors—use ErrorText or the Input error prop instead.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default banner",
        description: "Displays the default Banner appearance with title and description text.",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Banner carries alert or status semantics so screen readers correctly recognize and announce its content.",
        "Banner titles use a higher heading level (Heading 2 or 3), with description text following to maintain reading hierarchy.",
        "Dismissable Banner buttons should have an explicit aria-label describing the close action.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Banner supports programmatic control of open/collapsed state, allowing developers to decide when to auto-dismiss or manually intervene.",
        "Focus returns to the trigger button after the close animation completes, maintaining keyboard user navigation continuity.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Banner fills horizontally within its full-width container and adjusts padding and font scaling automatically on smaller screens.",
        "On mobile devices, Banner height is reduced with content arranged in a stacked layout instead of inline.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Different semantic Banner types (success, warning, error) have corresponding color palettes in both dark and light modes.",
        "Banner background and border colors are managed through theme variables, supporting global customization.",
      ],
    },
  },
  book: {
    slug: "book",
    locale: "en-US",
    summary:
      "A responsive book-shaped component for marketing pages and documentation hero displays.",
    whenToUse: [
      "Use Book for marketing pages, docs landing covers, and changelog hero shots where content needs the metaphor of a labeled volume.",
      "Use simple when the title carries the design; use stripe when an icon or color stripe adds category hierarchy.",
      "Reserve the textured treatment for isolated hero shots used for single articles or chapter presentations.",
    ],
    whenNotToUse: [
      "Do not use Book inside product info cards or dashboard tiles—it is too decorative for repeated UI rows.",
      "Do not treat Book as an interactive content editor—it is a purely presentational frame with no editing capabilities.",
      "In accessibility-first scenarios, do not use the cover as the primary content source—the cover should be treated as decorative chrome with the title surfaced via an underlying heading element.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default book",
        description: "Displays basic Book usage with cover, spine, and thickness effects.",
        demoKey: "Default",
      },
      {
        id: "variants",
        kind: "variant",
        title: "Variants",
        description: "Showcases the simple and stripe style variants.",
        demoKey: "Variants",
      },
      {
        id: "custom-illustration",
        kind: "advanced",
        title: "Custom illustration",
        description:
          "Demonstrates replacing the built-in illustration and customizing colors for a personalized book cover effect.",
        demoKey: "Custom illustration",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Book's cover should be marked as decorative chrome with the title surfaced through an underlying heading element so screen readers do not double-announce.",
        "Cover illustrations should have empty alt text (decorative=true) since meaning is already conveyed in the title.",
        "Page thickness effects should not impact core content legibility and focus capability.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Book is a passive display component with no state transitions or controlled properties; cover styling is configured entirely through props.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Book uses responsive widths to preserve the cover proportion, scaling automatically without distortion across viewports.",
        "On narrow screens, book title may shrink font size or enable multi-line wrapping while preserving the cover ratio integrity.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Book's shadows, borders, and gradient effects follow theme variables, adapting automatically between dark and light modes.",
        "Custom colors can override the default theme color via props to achieve brand consistency.",
      ],
    },
  },
  breadcrumbs: {
    slug: "breadcrumbs",
    locale: "en-US",
    summary: "Navigation aid that shows the user's location within a site's hierarchy.",
    whenToUse: [
      "Display breadcrumb navigation in applications with multi-level structures to help users understand their current position and jump quickly to parent nodes.",
      "Use Breadcrumbs when URL paths reflect resource hierarchy (e.g., /projects/space/documents) as a natural synchronization mechanism.",
      "Place Breadcrumbs above the page title as a leading context guide.",
    ],
    whenNotToUse: [
      "Do not overuse Breadcrumbs in flat structures—a simple page navigation menu suffices when there are only two path levels.",
      "Do not use Breadcrumbs for displaying filter and sort options—they are not hierarchical; use a filter bar or tab toggle instead.",
      "Do not force a full breadcrumb chain on mobile—in constrained space, truncate to non-core levels or use a drawer-based navigation.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default breadcrumbs",
        description:
          "Displays default breadcrumb navigation with separators and multiple hierarchy levels.",
        demoKey: "Default",
      },
      {
        id: "active",
        kind: "variant",
        title: "Active state",
        description:
          "Displays the active/disabled style for the last item to indicate the current path.",
        demoKey: "Active",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Breadcrumbs wrap in a <nav> element with aria-label='Breadcrumb', helping screen readers identify it.",
        "The final entry (active state) should not be linked and should carry aria-current='page'.",
        "Disabled breadcrumb entries remain in the DOM but skip tabindex to ensure keyboard navigation consistency.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Breadcrumbs is a passive navigational indicator driven by routing state; it accepts no controlled properties or interactive control.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Breadcrumbs auto-truncate middle levels (Home › … › Current) on narrow screens, keeping the final current position visible.",
        "Separators maintain consistent spacing proportions across all screen sizes, ensuring readability is preserved during scaling.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Breadcrumb text color, hover state, and current-page highlight follow theme variable text palettes and focus indicators.",
        "Separator colors also come from theme variables, ensuring sufficient contrast in both dark and light modes.",
      ],
    },
  },
};
