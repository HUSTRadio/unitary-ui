import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_01_ZH: Record<string, ComponentGuide> = {
  avatar: {
    slug: "avatar",
    locale: "zh-CN",
    summary: "用图片、首字母或占位内容表示用户或团队。",
    whenToUse: [
      "用 Avatar 表示单个用户或团队，并在头像旁显示姓名和角色信息。",
      "使用堆叠（Stacked）Avatar 展示一组人员，如团队成员列表或评论者集合。",
      "为图片加载失败或缺失的场景提供首字母或占位色块回退；需要叠加图标时使用 AvatarWithIcon。",
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
        description: "展示 24、32、48 px 等数值尺寸，匹配密集行、列表提及和档案页头的上下文。",
        demoKey: "Size",
      },
      {
        id: "fallback",
        kind: "variant",
        title: "回退状态",
        description: "演示当图片不可用时的首字母和占位色块回退方案。",
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
        "图片头像应设置有意义的 alt 文本；首字母或占位色块头像可通过 title 提供人物名称。",
        "堆叠 Avatar 组应在容器上添加 aria-label 说明总人数，避免逐条朗读造成冗余。",
        "无图回退的首字母头像应使用高对比度的背景色，确保文字可读。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Avatar 是展示组件，不接收受控属性；图像回退由内部逻辑处理，无需外部状态控制。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Avatar 的尺寸通过 props 显式指定而非响应式断点，因此在任何视口下表现一致。",
        "AvatarGroup 在传入 limit 且成员超出限制时，自动以 +N Avatar 汇总其余成员；未传 limit 时会展示全部成员。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Avatar 的边框和加载状态跟随主题变量，支持暗色/亮色模式自动适配。",
        "首字母回退使用固定的中性色表面；GitHub、GitLab、Bitbucket 头像根据 username 构造对应服务的图片 URL。",
      ],
    },
  },
  badge: {
    slug: "badge",
    locale: "zh-CN",
    summary: "用简短标签显示状态、数量或元数据。",
    whenToUse: [
      "在对象旁用短标签显示状态、套餐、环境或角色。",
      "展示生命周期阶段标签（Alpha、Beta、Early Access），并配合 Tooltip 注明限制信息。",
      "用颜色映射表达含义：绿色表示健康，红色表示错误，琥珀色表示警告，蓝色表示信息或生产环境。",
    ],
    whenNotToUse: [
      "标签需要点击操作时，使用 Button 或链接。",
      "不要在 Badge 内嵌套另一个 Badge 或多个图标——每行只放一个 Badge。",
      "不要在 Badge 中塞入整句文案（如 Currently Active），周围行已经提供了上下文。",
    ],
    examples: [
      {
        id: "variants",
        kind: "minimal",
        title: "变体",
        description: "展示 gray、blue、purple、amber、red、pink、green、teal 等颜色及其低对比度样式，以及 inverted、trial、turbo、outline 变体。",
        demoKey: "Variants",
      },
      {
        id: "sizes",
        kind: "variant",
        title: "尺寸",
        description: "展示 compact、sm、md 和 lg 四种尺寸，适用于不同密度的布局。",
        demoKey: "Sizes",
      },
      {
        id: "compact-rounded",
        kind: "variant",
        title: "圆角矩形与紧凑档",
        description:
          'shape="rounded"（4px 圆角矩形）+ size="compact"（20px 高）+ contrast="soft"（柔和底色）的组合，用于导航状态标记等密集场景。',
        demoKey: "Compact rounded",
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
        "Badge 文本不自动换行。保持标签简短，长文本由外层布局处理。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "每个变体对应一套深色/浅色模式下的颜色对，跟随主题变量的更新。",
        "contrast=\"low\" 使用无填充的文字样式；contrast=\"soft\" 使用柔和底色。",
      ],
    },
  },
  banner: {
    slug: "banner",
    locale: "zh-CN",
    summary: "在容器顶部显示全宽公告或重要提示。",
    whenToUse: [
      "在页面顶部或区块起始处展示全局公告、维护通知或关键提示，确保用户注意到。",
      "公告需要操作链接时，通过 button 配置链接文案和目标。",
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
        description: "展示默认的 Banner 消息文本，以及可选的链接式 CTA。",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Banner 默认渲染为普通 div；仅在内容确实需要即时播报时，由调用方添加合适的语义角色。",
        "消息文本应独立清晰，不能只依赖位置或颜色表达重要性。",
        "链接式 CTA 的 content 应明确描述目标或动作。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "Banner 不维护打开、折叠或关闭状态；显示时机与移除逻辑由父组件决定。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Banner 在父容器内占用可用宽度（最大 1080 px），并通过 flex-wrap 在空间不足时换行。",
        "组件没有断点级字号或高度变化；窄屏布局由内容宽度和父容器共同决定。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Banner 外壳默认透明，文本和 CTA 使用主题变量适配暗色与亮色模式。",
        "组件没有内置成功、警告或错误变体；需要语义配色时由调用方组合样式和语义。",
      ],
    },
  },
  book: {
    slug: "book",
    locale: "zh-CN",
    summary: "用书籍封面造型展示文章、手册或营销内容。",
    whenToUse: [
      "在营销页、文档首页或更新日志中，用书籍封面突出文章或手册。",
      "使用简单（simple）风格让标题主导设计，或使用条纹（stripe）风格用图标或彩色条纹添加类别层级。",
      "纹理效果适合单独展示的文章或章节封面。",
    ],
    whenNotToUse: [
      "不要在产品信息卡和管理仪表板的平铺中使用 Book——它过于装饰性，不适合重复排列的 UI 行。",
      "Book 用于封面展示，不支持内容编辑。",
      "重要标题和内容应以可读文字提供，不能只放在封面图中。",
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
        "标题使用可读文字；仅作装饰的图案应对屏幕阅读器隐藏。",
        "自定义插图仅作装饰时，图片使用 alt=\"\"，SVG 使用 aria-hidden。",
        "书页厚度效果不应影响核心内容的可读性和聚焦能力。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Book 是展示组件，没有任何状态转换或受控属性；封面造型完全通过 props 配置。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "width 可传数值或按断点设置的宽度，封面按比例缩放。",
        "窄屏上应保持书名简短，并检查所设宽度是否适合容器。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Book 的阴影、边框和渐变效果跟随主题变量，适配明暗主题。",
        "可通过 props 自定义颜色（custom color）覆盖默认主题色，实现品牌一致性。",
      ],
    },
  },
  breadcrumbs: {
    slug: "breadcrumbs",
    locale: "zh-CN",
    summary: "显示当前页面的层级路径，方便返回上级页面。",
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
        description:
          "以 type='text'（<nav> 列表 + 分隔符）与 type='menu'（芯片按钮组）两种变体呈现同一组层级。",
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
        "type='text'（默认）渲染带 aria-label='Breadcrumb' 的 <nav>；type='menu' 渲染带 role='navigation' 与同一 aria-label 的 <div>，两者都对屏幕阅读器暴露为导航区域。",
        "active 会在条目上设置 aria-current='page'；若同时传入 href，条目仍会渲染为链接。需要不可点击的当前页时应省略 href。",
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
        "窄屏下组件保持单行并允许横向滚动；如需省略中间层级，调用方应显式构造对应条目。",
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
    summary: "Represent a user or team with an image, initials, or a placeholder.",
    whenToUse: [
      "Use Avatar to represent a single user or team, displayed alongside name and role information.",
      "Use stacked Avatars to represent a group of people, such as team member lists or collections of commenters.",
      "Provide initials or a placeholder when an image fails or is missing; use AvatarWithIcon when an overlaid icon is required.",
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
          "Showcases numeric sizes such as 24, 32, and 48 px for dense rows, list mentions, and profile headers.",
        demoKey: "Size",
      },
      {
        id: "fallback",
        kind: "variant",
        title: "Fallback states",
        description:
          "Demonstrates initials and placeholder fallback schemes when an image is unavailable.",
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
        "Set meaningful alt text on image avatars; initials and placeholder avatars can expose the person's name through title.",
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
        "When limit is set and members exceed it, AvatarGroup automatically summarizes the remainder in a +N Avatar; without limit, it shows every member.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Avatar borders and loading states follow theme variables and adapt between dark and light modes.",
        "Initial fallbacks use a fixed neutral surface; GitHub, GitLab, and Bitbucket avatars derive service image URLs from username.",
      ],
    },
  },
  badge: {
    slug: "badge",
    locale: "en-US",
    summary: "Show a status, count, or metadata in a short label.",
    whenToUse: [
      "Use short labels beside an item to show its status, plan, environment, or role.",
      "Showcase lifecycle stage labels (Alpha, Beta, Early Access) paired with a Tooltip noting any limitations.",
      "Map meaning to color: green for healthy, red for error, amber for warning, blue for informational or production.",
    ],
    whenNotToUse: [
      "Use a Button or link when the label needs to trigger an action.",
      "Never nest another Badge or multiple icons inside a Badge—one badge per row only.",
      "Avoid stuffing sentences inside a Badge (Currently Active); the surrounding row supplies the context.",
    ],
    examples: [
      {
        id: "variants",
        kind: "minimal",
        title: "Variants",
        description: "Shows gray, blue, purple, amber, red, pink, green, and teal colors with low-contrast forms, plus inverted, trial, turbo, and outline variants.",
        demoKey: "Variants",
      },
      {
        id: "sizes",
        kind: "variant",
        title: "Sizes",
        description: "Shows compact, sm, md, and lg sizes for different layout densities.",
        demoKey: "Sizes",
      },
      {
        id: "compact-rounded",
        kind: "variant",
        title: "Rounded rectangle & compact",
        description:
          'The shape="rounded" (4px radius) + size="compact" (20px tall) + contrast="soft" combination used by dense navigation status markers.',
        demoKey: "Compact rounded",
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
        "Badge text does not wrap automatically. Keep labels short and handle long text in the outer layout.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Each variant comes with a paired dark/light mode color set managed through theme variables.",
        "contrast=\"low\" uses text without a fill; contrast=\"soft\" uses a soft background.",
      ],
    },
  },
  banner: {
    slug: "banner",
    locale: "en-US",
    summary:
      "Show a full-width announcement or important notice at the top of a container.",
    whenToUse: [
      "Display global announcements, maintenance notices, or critical alerts at the top of a page or section start where user attention is needed.",
      "Use button to configure the label and destination of an action link.",
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
        description: "Displays the default Banner message with an optional linked call to action.",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Banner renders a plain div by default; callers add an appropriate semantic role only when the message truly needs immediate announcement.",
        "Message text should remain understandable without relying on placement or color alone.",
        "The linked CTA content should clearly describe its destination or action.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "Banner has no open, collapsed, or dismissal state; its parent decides when to render or remove it.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Banner takes the available parent width up to 1080 px and uses flex-wrap when the message and CTA no longer fit on one line.",
        "It has no breakpoint-specific font or height changes; narrow layouts follow content width and the parent container.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The Banner shell is transparent by default, while text and CTA colors use theme tokens for light and dark modes.",
        "There are no built-in success, warning, or error variants; callers compose semantic color and roles when needed.",
      ],
    },
  },
  book: {
    slug: "book",
    locale: "en-US",
    summary:
      "Present an article, manual, or marketing content as a book cover.",
    whenToUse: [
      "Use a book cover to feature an article or manual on a marketing page, docs landing page, or changelog.",
      "Use simple when the title carries the design; use stripe when an icon or color stripe adds category hierarchy.",
      "Reserve textures for standalone article or chapter covers.",
    ],
    whenNotToUse: [
      "Do not use Book inside product info cards or dashboard tiles—it is too decorative for repeated UI rows.",
      "Book displays a cover and does not support editing.",
      "Provide important titles and content as readable text, rather than only in the cover image.",
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
        "Use readable text for the title and hide purely decorative artwork from screen readers.",
        "For decorative custom illustrations, use alt=\"\" on images or aria-hidden on SVGs.",
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
        "width accepts a number or breakpoint-specific widths; the cover scales proportionally.",
        "On narrow screens, keep titles short and check that the chosen width fits the container.",
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
    summary: "Show the current page’s hierarchy and provide links to parent pages.",
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
          "Renders the same hierarchy as type='text' (a <nav> list with separators) and type='menu' (a chip button group).",
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
        "type='text' (the default) renders a <nav> with aria-label='Breadcrumb'; type='menu' renders a <div> with role='navigation' and the same aria-label. Both surface as a navigation landmark to screen readers.",
        "active adds aria-current='page' to the item. If href is also provided, the item still renders as a link; omit href when the current page must be inert.",
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
        "On narrow screens, the component stays on one line and allows horizontal scrolling. Callers must explicitly construct an omitted-middle item when that presentation is needed.",
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
