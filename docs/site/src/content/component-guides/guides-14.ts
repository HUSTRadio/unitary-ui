import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_14_ZH: Record<string, ComponentGuide> = {
  tabs: {
    slug: "tabs",
    locale: "zh-CN",
    summary: "在同一页面内切换概览、日志等相关视图。",
    whenToUse: [
      "在同一页面中切换概览、日志、设置等相关视图。",
      "多个视图共享同一个 URL 父级和数据模型时，使用标签页保持上下文同步。",
      "需要通过 URL 状态实现深度链接和刷新恢复（如 query param 或路径映射）的场景。",
    ],
    whenNotToUse: [
      "不要在无关页面之间的导航中使用 Tab 标签——应使用子菜单或普通链接替代。",
      "不要把大量标签塞进一行；桌面端超过 5–7 个或移动端超过 3–4 个时应整合或折叠到菜单后。",
      "不要用 Tab 作为主要的全局导航；它只适用于页面内部的局部视图切换。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认标签页",
        description: "展示带有默认样式的多标签面板切换效果。",
        demoKey: "Default",
      },
      {
        id: "with-icons",
        kind: "variant",
        title: "带图标",
        description: "演示在每个标签上添加图标的用法，增强视觉识别度。",
        demoKey: "With icons",
      },
      {
        id: "secondary",
        kind: "variant",
        title: "次要样式",
        description: "展示 Secondary 模式下的标签页，用于弱化次要分组的内容切换。",
        demoKey: "Secondary",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "每个 tablist 应在没有可见标题的情况下使用 aria-label 标注（如 aria-label='Sections'），帮助屏幕阅读器识别功能。",
        "使用左右方向键在标签之间移动焦点，Enter 或 Space 激活当前标签，不要劫持这些键盘快捷键用于全局操作。",
        "活动标签必须始终保持可见的焦点环样式，不能为追求视觉效果而移除焦点指示。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "通过必填的 selected 与 setSelected 控制当前标签；selected 使用标签项的 id，而不是数组索引。",
        "需要 URL 持久化时，由调用方在 setSelected 更新路径中同步路由状态。",
        "禁用态的标签通过 disabled 属性隐藏交互能力，配合 Tooltip 说明禁用原因（权限不足或数据为空）。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "移动端建议限制在 3–4 个标签以内；超出范围应将次要视图移至 Menu 下拉中。",
        "标签行保持固定字号和间距，并在内容超出可用宽度时提供水平滚动；组件不会自动压缩排版。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "标签页的颜色、下划线和激活高亮跟随主题变量变化，在暗色/亮色模式下各有对应的配色方案。",
        "Secondary 模式在不同主题下会自动调整为对比度更低的变体颜色。",
      ],
    },
  },
  "text-with-copy-button": {
    slug: "text-with-copy-button",
    locale: "zh-CN",
    summary: "显示文本，并在旁边提供复制按钮。",
    whenToUse: [
      "展示一段短文本供用户快速复制，如令牌、命令、ID 或配置值等需要按原样使用的字符串。",
      "需要在代码片段、终端命令或环境变量旁边提供便捷的复制操作时，作为内联辅助功能使用。",
    ],
    whenNotToUse: [
      "不要复制超过一行的长文本块——对于较长的代码块，优先使用 CodeBlock 或 Snippet 组件自带的复制按钮。",
      "不要在不需要交互的纯展示场景中添加复制按钮——复制 affordance 应服务于实际需要复制内容的用户。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认文本复制",
        description: "展示默认的文本+复制按钮布局，文本右侧紧邻复制图标。",
        demoKey: "Default",
      },
      {
        id: "small-tertiary",
        kind: "variant",
        title: "省略号摘要",
        description: "演示使用 ellipsis 截断较长的配置摘要，并提供明确的复制操作名称。",
        demoKey: "With Small and Tertiary",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "复制按钮作为仅图标按钮时应设置 aria-label（如 'Copy deployment URL'），让屏幕阅读器准确描述操作目标。",
        "复制成功后显示约 1 秒的对勾反馈，使操作结果对视觉用户清晰可辨。",
        "组件使用 navigator.clipboard.writeText；写入失败时显示错误 toast 并调用 onError，不会尝试 legacy execCommand 回退。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "TextWithCopyButton 是展示型组件，复制行为由内部处理；其核心逻辑是读取文本并写入剪贴板，不需要外部状态来控制复制过程。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "只有显式传入 ellipsis 时文本才会截断；默认文本保持单行且不自动启用省略号。",
        "复制图标区域为 16px，组件不保证 44px 触控目标；触屏场景应由调用方提供更大的外层命中区域。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "文本颜色和复制按钮图标跟随主题变量更新，在暗色/亮色模式下均保持良好的对比度和可读性。",
        "复制成功状态的视觉反馈（对勾图标）在不同主题下均有对应的颜色适配。",
      ],
    },
  },
  textarea: {
    slug: "textarea",
    locale: "zh-CN",
    summary: "输入描述、备注等多行文本。",
    whenToUse: [
      "输入可以换行的内容（如提交消息、描述信息、备注），需要用户在编辑器中输入多行自由格式文本时。",
      "表单字段需要预留足够的书写空间且不希望单行 Input 被撑破布局时，Textarea 提供了可控的行数和自动扩展能力。",
    ],
    whenNotToUse: [
      "不要将 Textarea 用于只需要单个值的输入（如用户名、域名、令牌）——此类场景应使用 Input 单行输入框。",
      "不要在缺乏垂直空间的主操作区上方强制展开大尺寸 Textarea——它会挤压下方的关键操作按钮，导致用户需要滚动才能找到提交按钮。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认多行输入框",
        description: "展示默认外观的多行文本输入框，包含基本占位符和边框样式。",
        demoKey: "default",
      },
      {
        id: "sizes",
        kind: "variant",
        title: "尺寸变体",
        description: "展示不同尺寸的 Textarea，匹配不同密度的表单布局需求。",
        demoKey: "Sizes",
      },
      {
        id: "error",
        kind: "variant",
        title: "错误状态",
        description: "演示错误状态下的文本域：红色边框和内联验证提示信息。",
        demoKey: "Error",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "多行文本域应关联可见的 <label> 元素，并通过 htmlFor/id 建立关联，使屏幕阅读器能够正确朗读字段名称。",
        "验证错误信息应通过 aria-describedby 链接到文本域本身，确保屏幕阅读器在聚焦时同步播报错误提示。",
        "占位符应展示示例值（如 my-description）而非指令性文案（如 Enter a description），避免误导辅助技术用户。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "通过 value 和 onChange 受控管理文本内容，支持编程式赋值和实时输入监听。",
        "readOnly 属性可将文本域设为只读模式，不可编辑但仍可聚焦和选择文本内容。",
        "disabled 状态阻止所有用户输入，此时文本域呈现灰度样式且跳过键盘导航 tabindex。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Textarea 设置充足的默认行数并在有垂直空间时增长，但不会让字段本身把主操作按钮推到视口之外。",
        "在窄屏设备上 Textarea 宽度自动充满可用空间，行高和内边距保持比例缩放。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "文本域的边框、背景和文字颜色跟随主题变量变化，在暗色/亮色模式下各自有优化的配色方案。",
        "错误状态的红色边框（aria-invalid + error 变体）在不同主题下均保证足够的对比度以确保可读性；文本域没有独立的警告（warning）配色态。",
      ],
    },
  },
  "theme-switcher": {
    slug: "theme-switcher",
    locale: "zh-CN",
    summary: "在浅色、深色和跟随系统三种主题偏好间切换。",
    whenToUse: [
      "作为应用中唯一的官方主题切换入口，放置在页脚或设置页面，提供简洁的主题选择。",
      "需要 Light / System / Dark 三态偏好切换时使用；组件内置图标、语义标签和 System 模式检测。",
    ],
    whenNotToUse: [
      "将主题切换器放在共用页脚或设置页，避免重复提供入口。",
      "不要自行用 Switch 或三个图标按钮重写主题选择器——Theme Switcher 已经处理了图标、aria-label 和 System 模式检测等细节。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认主题切换器",
        description: "展示默认大小的三色主题选择控件（Light / System / Dark）。",
        demoKey: "Default",
      },
      {
        id: "compact",
        kind: "variant",
        title: "紧凑尺寸",
        description: "演示 compact 尺寸版本，适用于页脚、下拉菜单等高密度 chrome 区域。",
        demoKey: "Compact",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Theme Switcher 的每个选项都配有独立的 aria-label 描述，确保屏幕阅读器用户能准确了解可选的三种主题状态。",
        "组件以 role=radiogroup / role=radio + aria-checked 公开当前偏好，选项标签经框架 i18n（t()）本地化，与界面语言保持一致。",
        "当前激活的主题选项应有明确的焦点环和视觉选中状态标记，让键盘用户清楚看到当前的选择。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Theme Switcher 通过框架的 ThemeProvider（src/lib/theme.tsx）读取和写入主题偏好；应用根节点用 ThemeProvider 包裹一次即可，无需把主题状态冗余映射到本地 React 状态。",
        "本库不依赖 next-themes：公开 API 仅有 className / compact / disabled 三个 prop，没有 onChange 回调或 forcedTheme 概念。",
        "需要拦截主题切换（如跟随系统设置联动）时，直接使用 useTheme() 的 preference/setPreference，而不是包一层回调。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Theme Switcher 在桌面端呈现完整的三选项行，在窄屏上不裁剪任何选项以保持完整功能。",
        "compact 尺寸（compact prop）在任意视口下都能保持紧凑排列，适合页脚和导航栏等空间受限区域。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Theme Switcher 本身是主题切换的核心控件，其图标和文字随所选主题实时变化，是当前选中主题的可视化反映。",
        "设置页等空间充足的区域使用默认尺寸。",
      ],
    },
  },
  toast: {
    slug: "toast",
    locale: "zh-CN",
    summary: "短暂显示操作结果或通知。",
    whenToUse: [
      "对用户发起的操作给出非阻塞的确认反馈，如 'Domain added'、'Project archived'、'Deployment canceled'。",
      "异步流程结束时发送最终的状态通知（成功或错误），不需要在中间步骤堆叠多条 toast。",
    ],
    whenNotToUse: [
      "不要单独用 Toast 处理计费失败、权限拒绝或构建失败等需要用户处理的严重问题——需搭配持续性更强的消息行提供恢复指引。",
      "不要用 Toast 叙述连续的异步流程；只需在最终步骤发出最终的 success 或 error toast 即可，避免在等待期间堆积消息。",
      "不要在完成类 toast 中包含 successfully——遵循 {名词}{过去分词} 格式（如 Blob deleted），不要写 Blob successfully deleted。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "默认轻提示",
        description: "展示默认的 toast 外观：短暂显示后自动消失的消息通知。",
        demoKey: "Default",
      },
      {
        id: "action",
        kind: "variant",
        title: "带动作按钮",
        description: "演示带有操作按钮的 toast，允许用户执行 Undo 等后续操作。",
        demoKey: "Action",
      },
      {
        id: "success",
        kind: "stateful",
        title: "成功状态",
        description: "展示成功类型的 toast 提示（绿色标识），表示操作顺利完成。",
        demoKey: "Success",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Toast 区域通过 aria-live='polite' 向屏幕阅读器广播新消息，确保辅助技术用户能感知到通知的出现。",
        "仅对真正阻断性的错误才使用 assertive 类型，普通操作确认统一使用 polite 以避免打断用户当前阅读。",
        "对于 preserve={true} 的 toast，应在关闭前确保用户已有足够时间读取或执行所需操作。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Toast 通过 useToasts() hook 编程式触发：message / success / warning / error 各自对应一种消息类型，可在任何组件上下文中弹出一条消息。",
        "默认情况下 toast 会自动消失；传入 preserve={true} 时可防止自动关闭，要求用户先阅读或采取行动后再手动关闭。",
        "不同类型的 toast（.success(), .warning(), .error()）提供对应的语义化和色彩区分。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Toast 通知在窄屏和宽屏上均自动适配容器宽度，确保消息不会被过度截断影响可读性。",
        "移动端 Toast 定位在底部安全区域内，避免遮挡底部导航栏或手势操作区域。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "各种语义类型的 Toast（成功、警告、错误）在暗色和亮色模式下各有对应的配色方案，保证一致的视觉体验。",
        "Toast 的背景色、文字颜色和边框样式通过主题变量统一管理，支持在全局自定义定制。",
      ],
    },
  },
};

export const GUIDES_14_EN: Record<string, ComponentGuide> = {
  tabs: {
    slug: "tabs",
    locale: "en-US",
    summary:
      "Switch between related views, such as overview and logs, within a page.",
    whenToUse: [
      "Switch between related views, such as overview, logs, and settings, within a page.",
      "When deep-linking and refresh preservation via URL state (query param or path segment) keeps the current view in sync.",
      "Display multiple related sections side by side under a shared parent container without requiring full page navigation.",
    ],
    whenNotToUse: [
      "Do not use Tabs for navigation between unrelated pages—use a sub-menu or regular links instead; Tabs imply shared context.",
      "Do not crowd more than 5–7 tabs on desktop or 3–4 on mobile into a single row; consolidate or move secondary views behind a Menu.",
      "Tabs are not suitable for global site navigation—they are scoped to intra-page section switching only.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default tabs",
        description:
          "Displays a multi-tab panel with default styling and smooth transition between views.",
        demoKey: "Default",
      },
      {
        id: "with-icons",
        kind: "variant",
        title: "With icons",
        description:
          "Showcases adding icons to each tab label for enhanced visual identification and quick scanning.",
        demoKey: "With icons",
      },
      {
        id: "secondary",
        kind: "variant",
        title: "Secondary style",
        description:
          "Demonstrates the Secondary mode for de-emphasized content grouping and less prominent view switching.",
        demoKey: "Secondary",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Label the tablist with aria-label when no visible heading sits above it (e.g. aria-label='Sections'), so screen readers identify the purpose.",
        "Left/Right arrows move focus across tabs, Enter or Space activates; do not hijack these keyboard shortcuts for global operations.",
        "Always maintain a visible focus ring on the active tab—do not suppress focus styles for visual polish.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Control the active tab with the required selected and setSelected props; selected uses a tab item's id rather than its array index.",
        "For URL persistence, synchronize route state from the caller's setSelected update path.",
        "Disabled tabs hide interactivity via the disabled prop and should be paired with a Tooltip explaining the constraint (permissions insufficient or empty data).",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "On mobile, limit tabs to 3–4; beyond that, move secondary views behind a Menu dropdown.",
        "The tab row keeps fixed typography and gaps and scrolls horizontally when it exceeds the available width; it does not compress those styles automatically.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Tab colors, underline indicators, and activation highlights follow theme variables with corresponding palettes for dark and light modes.",
        "Secondary mode automatically adjusts to lower-contrast variant colors that adapt across themes.",
      ],
    },
  },
  "text-with-copy-button": {
    slug: "text-with-copy-button",
    locale: "en-US",
    summary:
      "Display text with a copy button beside it.",
    whenToUse: [
      "Present short strings for users to copy verbatim, such as tokens, commands, IDs, or configuration values.",
      "Provide an inline copy affordance next to code snippets, terminal commands, or environment variable values for easy retrieval.",
    ],
    whenNotToUse: [
      "Do not copy multi-line blocks with this component—for longer code segments, prefer CodeBlock or Snippet which ship with built-in copy affordances.",
      "Do not add a copy button to purely presentational contexts where users have no need to duplicate the content.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default text copy",
        description:
          "Shows the default text-plus-copy-button layout with the copy icon positioned immediately to the right of the text.",
        demoKey: "Default",
      },
      {
        id: "small-tertiary",
        kind: "variant",
        title: "Ellipsized summary",
        description:
          "Uses ellipsis to truncate a longer configuration summary and gives the copy action a specific accessible label.",
        demoKey: "With Small and Tertiary",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Icon-only copy buttons should carry an aria-label (e.g. 'Copy deployment URL') so screen readers accurately describe the action target.",
        "After a successful copy, show a checkmark feedback indicator for about one second so sighted users clearly perceive the result.",
        "The component uses navigator.clipboard.writeText; failures show an error toast and call onError rather than attempting a legacy execCommand fallback.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "TextWithCopyButton is a passive display component; copy behavior is handled internally by reading text and writing to the clipboard, requiring no external state control.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Text truncates only when ellipsis is passed explicitly; the default remains a single untruncated line.",
        "The copy icon area is 16px and does not guarantee a 44px touch target. Add a larger caller-owned hit area for touch-heavy surfaces.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Text color and the copy button icon follow theme variables, maintaining good contrast and legibility in both dark and light modes.",
        "The visual feedback for a successful copy (checkmark icon) adapts its color appropriately across different themes.",
      ],
    },
  },
  textarea: {
    slug: "textarea",
    locale: "en-US",
    summary:
      "Enter multi-line text, such as a description or notes.",
    whenToUse: [
      "Input content that wraps to multiple lines, such as commit messages, descriptions, or notes where users enter free-form multi-line text.",
      "When a form field needs sufficient writing space and a single-line Input would break the layout, Textarea offers controllable row count and optional growth.",
    ],
    whenNotToUse: [
      "Do not use Textarea for single-value inputs (usernames, domains, tokens)—use Input for those scenarios.",
      "Do not force a large Textarea above primary action zones lacking vertical room—it can push critical action buttons below the fold, forcing users to scroll to find submit controls.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default textarea",
        description:
          "Displays the default Textarea appearance with basic placeholder text and border styling.",
        demoKey: "default",
      },
      {
        id: "sizes",
        kind: "variant",
        title: "Sizes",
        description:
          "Showcases different size variants of Textarea to match varying form layout densities.",
        demoKey: "Sizes",
      },
      {
        id: "error",
        kind: "variant",
        title: "Error state",
        description:
          "Demonstrates the error state with a red border and inline validation message displayed inside the field.",
        demoKey: "Error",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Associate the textarea with a visible <label> element linked via htmlFor/id so screen readers can announce the field name correctly.",
        "Validation error messages should be linked to the textarea via aria-describedby so screen readers announce them together when focused.",
        "Placeholders should show an example value (e.g. my-description), never instruction text (e.g. Enter a description), to avoid misleading assistive technology users.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Manage text content controllably via value and onChange props, supporting programmatic assignment and real-time input listening.",
        "The readOnly property puts the textarea into a read-only mode where the text cannot be edited but remains selectable and focusable.",
        "Disabled state prevents all user input with a grayed appearance and skips the element in keyboard navigation order.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Set a generous default row count and grow only when the surface has vertical room, without pushing primary action buttons below the fold.",
        "On narrow screens, the Textarea width fills the available space proportionally with proportional scaling of line height and padding.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Textarea borders, background, and text color follow theme variables with optimized palettes for both dark and light modes.",
        "Error-state red borders (aria-invalid + error variant) maintain sufficient contrast across themes for legibility; the textarea has no separate warning color state.",
      ],
    },
  },
  "theme-switcher": {
    slug: "theme-switcher",
    locale: "en-US",
    summary:
      "Choose light, dark, or system theme preference.",
    whenToUse: [
      "As the sole canonical theme toggle in an app, placed in the footer or settings page for clean, centralized access.",
      "For Light / System / Dark three-state preference switching; Theme Switcher ships with built-in icons, semantic labels, and System mode detection.",
    ],
    whenNotToUse: [
      "Place the theme switcher in a shared footer or settings page to avoid duplicate controls.",
      "Do not rebuild a theme picker with Switch components or three icon buttons—Theme Switcher already handles icons, aria-labels, and System detection.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default theme switcher",
        description:
          "Displays the default-sized three-option theme selector (Light / System / Dark).",
        demoKey: "Default",
      },
      {
        id: "compact",
        kind: "variant",
        title: "Compact size",
        description:
          "Demonstrates the compact-size variant, ideal for dense chrome areas like footers and dropdowns.",
        demoKey: "Compact",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Each option in Theme Switcher carries its own aria-label describing the three theme states so screen-reader users understand their choices clearly.",
        "The control exposes the current preference via role=radiogroup / role=radio + aria-checked; option labels are localized through the framework i18n (t()) to match the UI language.",
        "The currently selected option must have a clear focus ring and visual selection marker so keyboard users see the active choice.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Theme Switcher reads from and writes to the framework's own ThemeProvider (src/lib/theme.tsx); wrap the app in ThemeProvider once at the root without mirroring into local React state.",
        "The library does not depend on next-themes: the public API is just className / compact / disabled—there is no onChange callback or forcedTheme concept.",
        "To intercept theme changes (e.g. syncing with system settings), consume preference/setPreference from useTheme() directly instead of wrapping a callback.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "On desktop, Theme Switcher renders all three options in a row; on narrow screens no options are cropped to preserve full functionality.",
        "The compact variant stays tightly packed on any viewport, fitting well in footers and nav bars.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Theme Switcher itself is the core theme-control element; its icons and labels change in real time with the selected theme, visually reflecting the active choice.",
        "Use the default size where space allows, such as a settings page.",
      ],
    },
  },
  toast: {
    slug: "toast",
    locale: "en-US",
    summary:
      "Briefly display an action result or notification.",
    whenToUse: [
      "Provide non-blocking acknowledgments of user-initiated actions, e.g. 'Domain added', 'Project archived', 'Deployment canceled'.",
      "Emit a final status notification (success or error) at the terminal step of an async flow, avoiding stacked intermediate messages.",
    ],
    whenNotToUse: [
      "Do not rely on Toast alone for billing failures, permission denials, or build failures that require user triage—pair with a persistent alert row carrying the recovery step.",
      "Do not stack multiple toasts to narrate one async flow; emit one success or error toast at the terminal step.",
      "Never include successfully in completion toasts—follow the {Noun} {past-participle} pattern (e.g. Blob deleted), not Blob successfully deleted.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Default toast",
        description: "Displays a default toast that appears briefly and then auto-dismisses.",
        demoKey: "Default",
      },
      {
        id: "action",
        kind: "variant",
        title: "With action button",
        description:
          "Demonstrates a toast with an action button allowing users to perform follow-up operations like Undo.",
        demoKey: "Action",
      },
      {
        id: "success",
        kind: "stateful",
        title: "Success state",
        description:
          "Showcases the success-type toast (green indicator) indicating an operation completed successfully.",
        demoKey: "Success",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The toast region announces new messages with aria-live='polite', ensuring assistive technology users are aware of incoming notifications.",
        "Reserve assertive for truly blocking errors only; use polite for all standard action confirmations to avoid interrupting the user's reading flow.",
        "For preserved toasts (preserve={true}), ensure users have adequate time to read or act before auto-closing.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Trigger toasts programmatically via the useToasts() hook—message / success / warning / error each map to a toast kind—available in any component context.",
        "Toasts auto-dismiss by default; pass preserve={true} to prevent auto-close, requiring the user to dismiss manually.",
        "Different toast types (.success(), .warning(), .error()) provide corresponding semantic styling and color differentiation.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Toast notifications automatically adapt their container width on both narrow and wide screens to prevent excessive text truncation.",
        "On mobile, toasts position in the bottom safe area to avoid overlapping bottom navigation bars or gesture regions.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Different semantic toast types (success, warning, error) each have corresponding color schemes for dark and light modes.",
        "Toast backgrounds, text colors, and border styles are managed through theme variables, supporting global customization.",
      ],
    },
  },
};
