import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_08_ZH: Record<string, ComponentGuide> = {
  label: {
    slug: "label",
    locale: "zh-CN",
    summary: "为表单控件提供可访问的文本标签，确保屏幕阅读器正确播报字段名称。",
    whenToUse: [
      "需要将可见文字标签与表单控件关联时，让屏幕阅读器播报字段名称。",
      "通过 htmlFor 和控制器的 id 匹配标签，使点击标签时聚焦对应输入框。",
      "使用简短的 Title Case 名词作为标签文本，例如 Project Name、Domain、Environment Variable Name。",
    ],
    whenNotToUse: [
      "不要将带标签的 Input 包裹在 Tooltip 中——应将解释说明放在旁边的图标按钮上，以确保标签能被屏幕阅读器正确播报。",
      "当不需要关联表单控件且没有无障碍播报需求时，直接使用普通文本段落即可。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认标签",
        description:
          "最基础的 Label 用法：传入一个文本字符串作为可见标签，自动渲染为语义化的 <label> 元素并与关联的表单控件绑定。",
        demoKey: "default",
      },
      {
        id: "with-input",
        kind: "variant",
        title: "带输入框的标签",
        description:
          "Label 与 Input 配合的正确用法：通过 htmlFor/id 配对实现点击标签聚焦输入框的功能，确保键盘操作和屏幕阅读器的无障碍体验。",
        demoKey: "With Input",
      },
      {
        id: "bypass-casing",
        kind: "variant",
        title: "绕过大小写转换",
        description:
          "当标签文本需要保留特定的大小写格式（如品牌名称或技术标识符）时使用 bypassCasing 属性，避免组件自动转换字母大小写。",
        demoKey: "Bypass Casing",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Label 通过 htmlFor/id 与表单控件关联，屏幕阅读器能正确播报字段名称，确保残障用户可以理解每个字段的用途。",
        "所有带标签的输入框都必须通过 aria-describedby 将辅助说明与输入控件关联起来。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Label 是一个纯展示型组件，只负责渲染给定的标签文本并建立与目标表单控件的关联。它没有内部状态或用户交互能力，所有行为由传入的 props 决定。",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "Label 组件本身不涉及响应式布局逻辑。其视觉表现由所在表单行容器的上下文决定，在不同视口下跟随父容器自然流动。",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "标签文字的颜色从主题令牌获取，确保浅色模式和深色模式下都有良好的可读性和对比度。",
        "字体大小和字重遵循设计系统的排版规范，与相邻输入框保持一致的视觉层级。",
      ],
    },
  },
  "load-more-button": {
    slug: "load-more-button",
    locale: "zh-CN",
    summary: "一个全宽按钮，用于向分页列表追加更多项目，适合无限滚动场景中的手动加载更多操作。",
    whenToUse: [
      "用户在信息流或数据列表中需要手动触发加载更多内容时，比自动加载更能让用户掌控浏览节奏。",
      "列表内容分多页加载，需要在当前页面底部放置一个明确的加载更多入口来保持页面结构清晰。",
    ],
    whenNotToUse: [
      "如果可以使用无限滚动（监听视口位置自动加载），优先使用自动加载而非要求用户每次手动点击按钮。",
      "对于固定数量的完整数据集，应使用编号分页器让用户可以自由跳转到任何页码，而不是仅支持向后追加。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认加载更多按钮",
        description:
          "最基本的加载更多内容按钮：占据整行宽度，带有标准的加载状态和文案，适用于大多数需要分页加载数据的场景。",
        demoKey: "Default",
      },
      {
        id: "loading",
        kind: "variant",
        title: "加载中状态",
        description:
          "按钮在进入加载状态后显示旋转指示器和禁用外观，防止用户重复提交请求，同时传达系统正在处理新内容的信号。",
        demoKey: "Loading",
      },
      {
        id: "custom-text",
        kind: "variant",
        title: "自定义空闲文案",
        description:
          "children 可定制非加载状态的按钮文案；loading=true 时组件固定显示本地化的 Loading...。",
        demoKey: "Custom Text",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "按钮使用原生 <button> 元素，确保键盘用户可通过 Tab 导航和操作，并在加载状态下自动禁用以防止重复触发。",
        "加载状态下的按钮会通过 aria-busy 告知屏幕阅读器当前正在加载新内容。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "通过 loading prop 控制按钮的加载状态，调用方管理数据加载的生命周期并在完成时重置按钮状态。",
        "可以通过 onClick 回调拦截点击事件来处理实际的数据加载逻辑，按钮本身不执行网络请求。",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "Load More Button 始终占据容器全宽，其尺寸变化由外层容器的填充和间距决定。组件自身不包含响应式断点逻辑。",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "按钮的背景色、边框和文字颜色均从主题令牌获取，包括深色模式下的自动适配和高对比度模式的特殊处理。",
        "加载状态的渐变动画和禁用态的透明度遵循设计系统的交互反馈规范。",
      ],
    },
  },
  "loading-dots": {
    slug: "loading-dots",
    locale: "zh-CN",
    summary: "用三个弹跳圆点表示后台正在运行的操作，适合嵌入到短文本中以传达等待中的即时状态。",
    whenToUse: [
      "在短文本中嵌入加载提示，例如 Saving + Loading Dots 或 Building + Loading Dots，让用户知道操作正在进行中。",
      "不确定等待时长但时间较短的场景，圆点动画比进度条更轻量且不显得过于正式。",
      "需要保持周围文本可读性的内联加载指示，而非页面级的全屏遮罩加载效果。",
    ],
    whenNotToUse: [
      "对于按钮请使用 loading prop 而非在按钮文字中放入圆点，以保持按钮的可访问性和焦点管理能力。",
      "确定性的任务进度应使用 Progress 组件，因为它有已知总量和明确的完成语义；布局占位请使用 Skeleton。",
      "不要在动作完成后再添加 Loading Dots——例如 Saved + Loading Dots 是错误的，圆点暗示工作仍在进行中。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认加载圆点",
        description:
          "最基本的三种弹跳圆点动画：没有额外文本说明，仅用动画本身传达系统正在处理中，适用于上下文已经明确的场景。",
        demoKey: "Default",
      },
      {
        id: "with-text",
        kind: "variant",
        title: "带文本的加载圆点",
        description:
          "在圆点前面附加具体描述性文本，例如 Saving、Deploying、Uploading 等，让用户即使在等待超过一秒后仍清楚系统正在执行什么操作。",
        demoKey: "With text",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        '包装 span 设置 aria-live="polite"，让屏幕阅读器在不打断用户的情况下拾取当前正在进行的操作标签。',
        "圆点本身是装饰性的——周围的文本承载了核心含义，因此不应给组件本身添加 aria-label。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Loading Dots 没有 isLoading prop，挂载后始终渲染动画；调用方通过条件渲染决定何时显示，reduced-motion 偏好会禁用动画。",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "Loading Dots 作为内联元素，其尺寸跟随当前行的字体大小自然缩放。组件本身不涉及响应式断点或布局切换。",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "圆点的颜色从主题令牌获取，确保浅色和深色模式下都具有良好的对比度和视觉效果。",
        "组件当前始终运行点状动画；若产品需要响应 prefers-reduced-motion，应由应用层提供静态替代或额外样式。",
      ],
    },
  },
  menu: {
    slug: "menu",
    locale: "zh-CN",
    summary: "在弹出菜单中展示一组操作项，适合对单个资源进行发现和管理操作的场景。",
    whenToUse: [
      "需要一个可发现的触发器来打开针对单一资源的行动列表，例如行上的省略号菜单或主实体的下拉菜单。",
      "用户对某个资源（如项目、部署、用户）需要进行多种相关操作（重命名、复制、删除等），且这些操作共享同一个上下文。",
      "需要按类别分组操作项时使用 MenuSection，将相关的动作组织在一起以提高可发现性。",
    ],
    whenNotToUse: [
      "对于右击或长按操作请使用 ContextMenu。对于 ⌘K 后面的全局命令请使用 CommandMenu。对于两个相关的核心操作，应使用拆分按钮而非将次要操作藏在深层菜单中。",
      "菜单项数量超过大约 10 个时应使用 MenuSection 进行分组或将次要操作移至设置页面，以避免弹出窗口过长难以浏览。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认菜单",
        description:
          "最简单的菜单用法：一个触发器点开一组操作项，每一项采用 Title Case 动词+名词格式，如 Rename Project、Duplicate Deployment。",
        demoKey: "Default",
      },
      {
        id: "with-chevron",
        kind: "variant",
        title: "带箭头的触发器",
        description:
          "在 MenuButton 触发器上显示向下箭头，提示该按钮会打开当前菜单；组件不提供嵌套子菜单原语。",
        demoKey: "With chevron",
      },
      {
        id: "disabled-items",
        kind: "variant",
        title: "禁用项",
        description:
          "某些菜单项在当前上下文中不可用时变为灰色且不可点击，帮助用户了解哪些操作在当前状态下被限制。",
        demoKey: "Disabled items",
      },
      {
        id: "locked-items",
        kind: "variant",
        title: "锁定项",
        description:
          "使用 MenuItemLocked 为权限受限的操作显示锁形图标和禁用状态，明确解释为何该行为无效以及需要何种权限才能解锁。",
        demoKey: "Locked items",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "使用 Up/Down 方向键在菜单项间移动焦点，Home/End 跳转到首尾项，Enter 或 Space 激活选中项。",
        "Typeahead 功能跳转到下一个以输入字符开头的菜单项；可见标签排在前面，以便 typeahead 匹配用户所见的文本。",
        "关闭菜单后将焦点返回到触发器上，确保键盘用户在行中保持当前位置。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "通过 open prop 控制菜单的开闭状态，调用方管理触发条件（点击、悬停之外的其他事件）并在合适时机关闭菜单。",
        "点击菜单项、按 Escape 或点击外部区域时自动关闭菜单；也可以通过编程方式手动关闭。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "菜单位置会根据窗口的边界自动翻转（如向上弹出或向下弹出），不会在窄视口中因硬编码侧边而裁剪。",
        "Radix 会做碰撞位移，但组件不自动设置小屏最大宽度；长内容的宽度与换行由调用方约束。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "菜单的背景色、边框和分隔线颜色从主题令牌获取，确保浅色模式和深色模式下的正确对比度。",
        "悬停态、聚焦态和禁用态的颜色区分遵循设计系统的色彩规范，包括高对比度模式的特殊处理。",
      ],
    },
  },
  "middle-truncate": {
    slug: "middle-truncate",
    locale: "zh-CN",
    summary:
      "保留长标识符的开头和结尾部分，中间用省略号替代，适用于路径、URL、哈希值等双端有意义的场景。",
    whenToUse: [
      "需要展示文件路径、URL、哈希值和标识符等长文本时，同时保留前缀和后缀以便用户识别来源和目标。",
      "用户需要既能快速识别标识符的大致含义（通过两端关键字符），又不会因为过长文本破坏布局整齐度时。",
    ],
    whenNotToUse: [
      "当整个字符串都需要被用户看到时（如需要精确复制粘贴），不应截断——应提供完整的副本按钮或其他展开机制。",
      "对于不需要前缀后缀信息的纯文本内容，不需要使用截断——完整显示更友好。",
    ],
    examples: [
      {
        id: "examples",
        kind: "minimal",
        title: "中间截断示例",
        description:
          "展示 Middle Truncate 的典型用法：将长路径 /home/user/documents/project/index.tsx 截断为 /home/user/doc…index.tsx，既保留了起止信息又控制了宽度。",
        demoKey: "Examples",
      },
      {
        id: "full-access-restore",
        kind: "variant",
        title: "恢复完整值",
        description:
          "通过 title 属性或旁边的复制按钮暴露截断前的原始完整值，确保截断不会彻底销毁用户对源值的访问能力。",
        demoKey: "Examples",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "截断后的文本通过 title 属性或邻近的复制按钮暴露完整原始值，确保屏幕阅读用户可以获取被截断的部分。",
        "省略号本身使用专门的 Unicode 字符或 CSS 样式呈现，使其在屏幕阅读时被正确跳过而不产生额外的朗读干扰。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Middle Truncate 是一个纯展示型组件，只负责在给定的字符串上应用中间省略逻辑。它没有内部状态管理、用户交互或事件处理能力，所有截断行为由 maxLen 和可选的 prefix/suffix 配置决定。",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "Middle Truncate 组件自身的截断逻辑基于 maxLen 参数而非视口尺寸。其响应式表现由外层容器的宽度约束决定，组件本身不参与布局自适应。",
    },
    themeBehavior: {
      status: "not-applicable",
      reason:
        "Middle Truncate 的视觉呈现完全继承自父元素的文本样式——颜色、字号、字体均来自上下文。组件自身不提供独立的主题定制能力。",
    },
  },
};

export const GUIDES_08_EN: Record<string, ComponentGuide> = {
  label: {
    slug: "label",
    locale: "en-US",
    summary:
      "Provides an accessible text label for form controls, ensuring screen readers announce the field name.",
    whenToUse: [
      "When a visible text label needs to be associated with a form control so screen readers announce the field name.",
      "By matching the label to the control via htmlFor and the control's id so clicking the label focuses the field.",
      "Keep labels short Title Case nouns such as Project Name, Domain, and Environment Variable Name.",
    ],
    whenNotToUse: [
      "Don't wrap a labelled Input in a Tooltip; put the explainer on a sibling icon button so the label stays announced to screen readers.",
      "When no form control association or accessibility announcement is needed, use plain text paragraphs directly instead.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default label",
        description:
          "The most basic Label usage: pass a text string as a visible label that renders as a semantic <label> element bound to the associated form control.",
        demoKey: "default",
      },
      {
        id: "with-input",
        kind: "variant",
        title: "Label with input",
        description:
          "Correct usage of Label paired with Input: establish focus-on-click behavior through htmlFor/id pairing, ensuring keyboard operation and screen reader accessibility.",
        demoKey: "With Input",
      },
      {
        id: "bypass-casing",
        kind: "variant",
        title: "Bypass casing",
        description:
          "Use bypassCasing when the label text requires preserving specific capitalization (such as brand names or technical identifiers), preventing the component from auto-converting letter case.",
        demoKey: "Bypass Casing",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Label associates with form controls via htmlFor/id pairing so screen readers correctly announce the field name, enabling users with disabilities to understand each field's purpose.",
        "All labelled inputs must wire helper text through aria-describedby to associate supplementary instructions with the input control.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Label is a purely presentational component that renders only the given label text and establishes its association with a target form control. It has no internal state or user interaction capability; all behavior is determined by the passed props.",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "The Label component itself involves no responsive layout logic. Its visual presentation flows naturally with the containing form row context across different viewports.",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Label text color is drawn from theme tokens, ensuring good readability and contrast in both light and dark modes.",
        "Font size and weight follow the design system's typography scale, maintaining consistent visual hierarchy with adjacent inputs.",
      ],
    },
  },
  "load-more-button": {
    slug: "load-more-button",
    locale: "en-US",
    summary:
      "A full-width button for appending more items to a paginated list, suited for manual load-more interactions in infinite scroll scenarios.",
    whenToUse: [
      "When users need to manually trigger loading more content in an information feed or data list, giving them control over browsing pace compared to auto-loading.",
      "When list content loads in pages and a clear load-more entry point at the bottom keeps page structure readable and predictable.",
    ],
    whenNotToUse: [
      "If infinite scroll (auto-loading on viewport intersection) is viable, prefer automatic loading over requiring manual button clicks each time.",
      "For fixed-size complete datasets, use a numbered pager that lets users jump to any page directly instead of only supporting backward append.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default load more button",
        description:
          "The most basic load-more button: spans full width with a standard loading state and default text, suitable for most pagination-load-data scenarios.",
        demoKey: "Default",
      },
      {
        id: "loading",
        kind: "variant",
        title: "Loading state",
        description:
          "The button enters a loading state showing a spinner indicator and disabled appearance, preventing duplicate requests while signaling to users that new content is being processed.",
        demoKey: "Loading",
      },
      {
        id: "custom-text",
        kind: "variant",
        title: "Custom idle label",
        description:
          "children customizes the idle button label. When loading=true, the component always shows the localized Loading... label.",
        demoKey: "Custom Text",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The button uses a native <button> element, ensuring keyboard users can Tab to navigate and activate, and is automatically disabled during loading to prevent duplicate submissions.",
        "The loading state informs screen readers via aria-busy that new content is being fetched.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "The loading prop controls the button's loading state; the caller manages the data-fetch lifecycle and resets the button state upon completion.",
        "An onClick callback allows interception of click events to handle the actual data loading logic; the button itself does not perform network requests.",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "The Load More Button always occupies the container's full width. Its dimensional changes are determined by outer container padding and spacing, not by the component's own logic.",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Button background color, border, and text color are drawn from theme tokens, including automatic adaptation for dark mode and high-contrast mode handling.",
        "Loading-state gradient animation and disabled-state opacity follow the design system's interaction feedback guidelines.",
      ],
    },
  },
  "loading-dots": {
    slug: "loading-dots",
    locale: "en-US",
    summary:
      "Indicates an action running in the background with three bouncing dots, ideal for inline wait indicators embedded within short text.",
    whenToUse: [
      "Embedding a loading hint inside short copy, e.g. Saving<LoadingDots /> or Building<LoadingDots />, so users know an operation is in progress.",
      "For short-duration indeterminate waits where the dot animation is lighter-weight and less formal than a progress bar.",
      "Inline loading indications that keep surrounding text readable, rather than full-page overlay loading effects.",
    ],
    whenNotToUse: [
      "For buttons, set the loading prop on Button instead of dropping dots inside the label, to maintain button accessibility and focus management.",
      "For determinate task progress, use Progress with a known total and clear completion semantics; for layout placeholders use Skeleton.",
      "Don't append Loading Dots after a completed verb—for example Saved<LoadingDots /> is wrong because the dots imply ongoing work.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default loading dots",
        description:
          "The simplest three-dot bounce animation without additional explanatory text, communicating that the system is processing solely through the animation itself—ideal for contexts where the action is already clear.",
        demoKey: "Default",
      },
      {
        id: "with-text",
        kind: "variant",
        title: "With text",
        description:
          "Append specific descriptive text before the dots—for example Saving, Deploying, or Uploading—so users still know what's happening even after a wait exceeds one second.",
        demoKey: "With text",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        'The wrapping span carries aria-live="polite" so screen readers pick up the in-progress label without interrupting the user.',
        "The dots themselves are decorative—the surrounding text carries the core meaning, so adding aria-label to the component is unnecessary.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Loading Dots has no isLoading prop and animates whenever it is mounted. The caller conditionally renders it, while reduced-motion preferences disable the animation.",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "As an inline element, Loading Dots scales with the current line's font size. The component itself involves no responsive breakpoints or layout switching.",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Dot colors are drawn from theme tokens, ensuring good contrast and visual clarity in both light and dark modes.",
        "The dot animation currently always runs; applications that need prefers-reduced-motion support should provide a static alternative or an additional style.",
      ],
    },
  },
  menu: {
    slug: "menu",
    locale: "en-US",
    summary:
      "Displays a list of actions in a floating popup menu, suited for discoverability and management operations on a single resource.",
    whenToUse: [
      "When a discoverable trigger opens a list of actions on a single resource, such as a dots menu on a row or a dropdown on a primary entity.",
      "When a user needs to perform multiple related operations (rename, duplicate, delete) on a resource (project, deployment, user) sharing the same context.",
      "Use MenuSection to group actions by category, organizing related moves together for improved discoverability.",
    ],
    whenNotToUse: [
      "For right-click or long-press, use ContextMenu. For global commands behind ⌘K, use CommandMenu. For two related primary actions, use a split button rather than burying the secondary action in a deep menu.",
      "Cap the menu around 10 items. Past that, group with MenuSection or move secondary actions to a settings page to avoid an overly long popup.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default menu",
        description:
          "The simplest menu usage: a trigger opens a set of action items, each in Title Case Verb+Noun format such as Rename Project or Duplicate Deployment.",
        demoKey: "Default",
      },
      {
        id: "with-chevron",
        kind: "variant",
        title: "Trigger with chevron",
        description:
          "Show a downward chevron on MenuButton to indicate that the trigger opens the current menu; nested submenu primitives are not provided.",
        demoKey: "With chevron",
      },
      {
        id: "disabled-items",
        kind: "variant",
        title: "Disabled items",
        description:
          "Some menu items become greyed-out and non-clickable when unavailable in the current context, helping users understand which operations are restricted in the current state.",
        demoKey: "Disabled items",
      },
      {
        id: "locked-items",
        kind: "variant",
        title: "Locked items",
        description:
          "Use MenuItemLocked to display a lock icon and disabled state for permission-gated actions, clearly explaining why the row is inert and what permission is needed to unlock it.",
        demoKey: "Locked items",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Up/Down arrows move focus through items, Home/End jump to the first and last items, and Enter or Space activates the selected item.",
        "Typeahead jumps to the next item whose label starts with the typed character; the visible label comes first so typeahead matches what the user sees.",
        "Return focus to the trigger on close so keyboard users keep their place in the row.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Control menu open/close state via the open prop; the caller manages triggering conditions (other than hover) and closes the menu at appropriate times.",
        "The menu closes automatically on item activation, Escape, and outside-click; it can also be closed programmatically.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Menu position auto-flips based on window bounds (upward or downward pop-up) so it doesn't clip on narrow viewports due to hardcoded sides.",
        "Radix shifts the menu to avoid collisions, but the component does not set a small-screen maximum width; callers own width and wrapping for long content.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Menu background color, borders, and divider colors are drawn from theme tokens, ensuring proper contrast in both light and dark modes.",
        "Hover, focus, and disabled states follow the design system's color guidelines, including special handling for high-contrast modes.",
      ],
    },
  },
  "middle-truncate": {
    slug: "middle-truncate",
    locale: "en-US",
    summary:
      "Preserves the beginning and end of long identifiers with ellipsis in the middle, suited for paths, URLs, hashes, and other dual-end-meaningful scenarios.",
    whenToUse: [
      "When displaying long text such as file paths, URLs, hashes, and identifiers where both prefix and suffix carry identifying meaning.",
      "When users need to quickly recognize a rough sense of the identifier's origin/target while preventing excessively long text from breaking layout neatness.",
    ],
    whenNotToUse: [
      "When the entire string needs to be visible to the user (for precise copy-paste), don't truncate—provide the full value with a copy button or expand mechanism.",
      "For plain text content where prefix and suffix are irrelevant, full display is friendlier than truncation.",
    ],
    examples: [
      {
        id: "examples",
        kind: "minimal",
        title: "Truncation examples",
        description:
          "Demonstrates typical Middle Truncate usage: truncating /home/user/documents/project/index.tsx to /home/user/doc…index.tsx, preserving start and end information while controlling width.",
        demoKey: "Examples",
      },
      {
        id: "full-access-restore",
        kind: "variant",
        title: "Full value restore",
        description:
          "Expose the pre-truncated original full value through the title attribute or an adjacent copy button, ensuring truncation does not completely destroy access to the source value.",
        demoKey: "Examples",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The truncated text exposes the complete original value via the title attribute or an adjacent copy affordance, ensuring screen reader users can access what was truncated.",
        "Ellipsis characters are rendered using dedicated Unicode characters or CSS styles so they are correctly skipped by screen readers without causing extra reading interference.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Middle Truncate is a purely presentational component that applies ellipsis logic to a given string. It has no internal state management, user interaction, or event handling capability; all truncation behavior is determined by maxLen and optional prefix/suffix configuration.",
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason:
        "The Middle Truncate component's truncation logic is based on the maxLen parameter, not viewport dimensions. Its responsive behavior is determined by the width constraints of the outer container, and the component itself does not participate in layout adaptation.",
    },
    themeBehavior: {
      status: "not-applicable",
      reason:
        "The visual presentation of Middle Truncate fully inherits from the parent element's text styles—color, font size, and font family all come from context. The component itself provides no independent theming capabilities.",
    },
  },
};
