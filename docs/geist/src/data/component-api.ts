import { COMPONENTS } from "./components";

/** A small, hand-maintained index of the public surface exposed by each component. */
export type ApiRow = {
  name: string;
  type: string;
  description: string;
  descriptionZh: string;
  required?: boolean;
  defaultValue?: string;
  deprecated?: boolean;
};

export type ComponentApi = {
  exports: string[];
  extends?: string;
  rows: ApiRow[];
  notes?: { en: string; zh: string }[];
};

const row = (
  name: string,
  type: string,
  description: string,
  descriptionZh: string,
  options: Omit<ApiRow, "name" | "type" | "description" | "descriptionZh"> = {},
): ApiRow => ({ name, type, description, descriptionZh, ...options });

const component = (exports: string[], rows: ApiRow[] = [], extendsType?: string): ComponentApi => ({
  exports,
  extends: extendsType,
  rows,
});

const O = {
  avatar: component(
    ["Avatar", "AvatarGroup", "AvatarWithIcon"],
    [
      row("src", "string", "Image source.", "图片地址。"),
      row("alt", "string", "Accessible image description.", "图片的无障碍说明。"),
      row(
        "fallback",
        "ReactNode",
        "Fallback shown when no image is available.",
        "无图片时显示的后备内容。",
      ),
    ],
    "ImgHTMLAttributes<HTMLImageElement>",
  ),
  badge: component(
    ["Badge", "badgeVariants"],
    [row("type", "BadgeType", "Semantic badge color.", "语义化徽章颜色。")],
    "HTMLAttributes<HTMLSpanElement>",
  ),
  banner: component(
    ["Banner"],
    [row("button", "BannerButton", "Optional linked call to action.", "可选的链接操作。")],
  ),
  book: component(["Book"], [row("title", "string", "Book cover title.", "手册封面标题。")]),
  browser: component(
    ["Browser"],
    [
      row(
        "url",
        "string",
        "Address displayed by the decorative browser chrome.",
        "装饰性浏览器框中显示的地址。",
      ),
    ],
  ),
  breadcrumbs: component(
    ["Breadcrumb", "BreadcrumbItem"],
    [row("href", "string", "Navigation destination for an item.", "条目的导航目标。")],
  ),
  button: component(
    ["Button", "ButtonLink", "CustomButton", "buttonVariants"],
    [
      row(
        "type",
        '"secondary" | "error"',
        "Visual intent. The default is the primary action.",
        "视觉语义，默认是主操作。",
        { defaultValue: '"secondary"' },
      ),
      row("typeName", '"button" | "submit" | "reset"', "Native button type.", "原生按钮 type。", {
        defaultValue: '"button"',
      }),
      row(
        "loading",
        "boolean",
        "Keeps the button focusable while announcing progress.",
        "在提示加载时保持按钮可聚焦。",
        { defaultValue: "false" },
      ),
    ],
    "ButtonHTMLAttributes<HTMLButtonElement>",
  ),
  calendar: component(
    ["Calendar"],
    [
      row(
        "onChange",
        "(range: CalendarDateRange) => void",
        "Called after a valid range selection changes.",
        "有效日期范围选择变化后调用。",
      ),
      row(
        "presets",
        "Record<string, CalendarPreset>",
        "Named date ranges for the optional preset picker.",
        "可选预设选择器的命名日期范围。",
      ),
      row(
        "horizontalLayout",
        "boolean",
        "Places range inputs beside the month grid on wide surfaces.",
        "在宽屏上把范围输入框放在月历旁。",
        { defaultValue: "false" },
      ),
    ],
  ),
  checkbox: component(
    ["Checkbox"],
    [
      row("checked", "boolean", "Controlled checked state.", "受控选中状态。"),
      row(
        "onCheckedChange",
        "(checked: boolean) => void",
        "Receives the new state.",
        "接收新状态。",
      ),
    ],
  ),
  choicebox: component(
    ["ChoiceboxGroup", "ChoiceboxGroupItem"],
    [row("value", "string | string[]", "Controlled selected value(s).", "受控选择值。")],
  ),
  "clearable-input": component(
    ["ClearableInput"],
    [
      row(
        "onClear",
        "() => void",
        "Called when the clear affordance is activated.",
        "点击清除控件时调用。",
      ),
    ],
    "InputHTMLAttributes<HTMLInputElement>",
  ),
  code: component(
    ["Code", "InlineCode"],
    [row("children", "ReactNode", "Code content.", "代码内容。")],
  ),
  "code-block": component(
    ["CodeBlock", "CodeBlockHeader", "CodeBlockContent"],
    [
      row("code", "string", "Code rendered by the default content slot.", "默认内容槽展示的代码。"),
      row("language", "string", "Language label for syntax highlighting.", "语法高亮的语言标签。"),
    ],
  ),
  collapse: component(
    ["Collapse", "CollapseTrigger", "CollapseContent"],
    [
      row("open", "boolean", "Controlled expanded state.", "受控展开状态。"),
      row("defaultOpen", "boolean", "Initial uncontrolled state.", "非受控初始状态。"),
      row(
        "onOpenChange",
        "(open: boolean) => void",
        "Called when expansion changes.",
        "展开状态变化时调用。",
      ),
    ],
  ),
  "command-menu": component(
    [
      "CommandMenu",
      "CommandMenuInput",
      "CommandMenuList",
      "CommandMenuGroup",
      "CommandMenuItem",
      "CommandMenuDivider",
    ],
    [
      row("open", "boolean", "Controlled dialog state.", "受控对话框状态。"),
      row(
        "onOpenChange",
        "(open: boolean) => void",
        "Called for open and close requests.",
        "请求打开或关闭时调用。",
      ),
      row("callback", "() => void", "Runs the command's action.", "执行命令操作。"),
    ],
  ),
  "context-card": component(
    [
      "ContextCard",
      "ContextCardTrigger",
      "ContextCardHeader",
      "ContextCardTitle",
      "ContextCardDescription",
      "ContextCardAvatar",
      "ContextCardBody",
      "ContextCardFooter",
    ],
    [
      row(
        "side",
        '"top" | "right" | "bottom" | "left"',
        "Preferred placement relative to its trigger.",
        "相对触发器的优先位置。",
      ),
      row(
        "openDelay",
        "number",
        "Delay before opening on pointer intent.",
        "鼠标意图触发前的延迟。",
      ),
    ],
  ),
  "context-menu": component(
    ["ContextMenu", "ContextMenuItem", "ContextMenuSeparator"],
    [
      row("open", "boolean", "Controlled menu state.", "受控菜单状态。"),
      row(
        "onOpenChange",
        "(open: boolean) => void",
        "Receives menu state changes.",
        "接收菜单状态变化。",
      ),
    ],
  ),
  "copy-button": component(
    ["CopyButton"],
    [
      row("textToCopy", "string", "Text written to the clipboard.", "写入剪贴板的文本。", {
        required: true,
      }),
      row(
        "onCopy",
        "(text: string) => void",
        "Called after a successful copy.",
        "复制成功后调用。",
      ),
      row("onError", "(error: unknown) => void", "Called when copying fails.", "复制失败时调用。"),
    ],
    "ButtonHTMLAttributes<HTMLButtonElement>",
  ),
  description: component(
    ["Description"],
    [
      row("title", "ReactNode", "Description term.", "描述术语。"),
      row("children", "ReactNode", "Description value.", "描述值。"),
    ],
  ),
  "destructive-action-modal": component(
    ["DestructiveActionModal"],
    [
      row("open", "boolean", "Controlled dialog state.", "受控对话框状态。"),
      row(
        "onConfirm",
        "() => void | Promise<void>",
        "Owns the destructive action.",
        "负责执行破坏性操作。",
        { required: true },
      ),
    ],
  ),
  "dots-menu": component(
    ["DotsMenu", "DotsMenuItem", "DotsMenuSeparator"],
    [row("align", '"start" | "center" | "end"', "Menu alignment.", "菜单对齐方式。")],
  ),
  drawer: component(
    ["Drawer", "DrawerTitle", "DrawerDescription"],
    [
      row("show", "boolean", "Controlled drawer state.", "受控抽屉状态。"),
      row(
        "onDismiss",
        "() => void",
        "Called after Escape, outside press, or a dismissal gesture.",
        "按 Escape、点击外部或执行关闭手势后调用。",
      ),
      row("height", "number", "Optional panel height in pixels.", "可选的面板像素高度。"),
    ],
  ),
  "empty-state": component(
    ["EmptyState", "EmptyStateIcon"],
    [row("title", "ReactNode", "Explains the current absence.", "说明当前为空的原因。")],
  ),
  error: component(
    ["Error"],
    [row("message", "ReactNode", "Actionable error message.", "可操作的错误信息。")],
  ),
  feedback: component(
    ["Feedback"],
    [
      row(
        "onSubmit",
        "(value: FeedbackRatingValue) => void | Promise<void>",
        "Receives a production feedback rating.",
        "接收生产环境中的反馈评分。",
      ),
    ],
  ),
  fieldset: component(
    [
      "Fieldset",
      "FieldsetTitle",
      "FieldsetSubtitle",
      "FieldsetContent",
      "FieldsetFooter",
      "FieldsetFooterStatus",
      "FieldsetFooterAction",
    ],
    [row("legend", "ReactNode", "Accessible group label.", "无障碍分组标签。")],
  ),
  "file-tree": component(
    ["FileTree", "FileTreeItem", "FileTreeLabel", "FileTreeIcon"],
    [
      row("open", "string[]", "Controlled expanded node IDs.", "受控展开节点 ID。"),
      row("defaultOpen", "string[]", "Initial expanded node IDs.", "初始展开节点 ID。"),
      row(
        "onOpenChange",
        "(ids: string[]) => void",
        "Receives expanded node IDs.",
        "接收展开节点 ID。",
      ),
    ],
  ),
  gauge: component(
    ["Gauge"],
    [
      row("value", "number", "Current value.", "当前数值。", { required: true }),
      row("max", "number", "Upper bound.", "上限。", { defaultValue: "100" }),
    ],
  ),
  grid: component(
    ["Grid", "GridCell", "GridCross", "GridPage", "GridSystem"],
    [
      row("columns", "GridColumns", "Number of visible guide columns.", "可见参考列数量。"),
      row("rows", "GridRows", "Number of visible guide rows.", "可见参考行数量。"),
    ],
  ),
  input: component(
    ["Input"],
    [row("size", '"small" | "default" | "large"', "Input size.", "输入框尺寸。")],
    "InputHTMLAttributes<HTMLInputElement>",
  ),
  "json-view": component(
    ["JsonView", "makeJsonViewHighlightPattern"],
    [
      row("value", "unknown", "JSON-compatible data to render.", "要展示的 JSON 兼容数据。", {
        required: true,
      }),
      row("collapsed", "boolean", "Starts nested objects collapsed.", "初始折叠嵌套对象。"),
    ],
  ),
  "keyboard-input": component(
    ["KeyboardInput", "Kbd"],
    [row("children", "ReactNode", "Shortcut keys and separators.", "快捷键按键和分隔符。")],
  ),
  label: component(
    ["Label"],
    [row("htmlFor", "string", "Associates the label with a control ID.", "与控件 ID 关联。")],
    "LabelHTMLAttributes<HTMLLabelElement>",
  ),
  "load-more-button": component(
    ["LoadMoreButton"],
    [
      row(
        "loading",
        "boolean",
        "Shows progress while more results load.",
        "加载更多结果时显示进度。",
      ),
    ],
  ),
  "loading-dots": component(
    ["LoadingDots"],
    [row("size", "LoadingDotsSize", "Dot size.", "圆点尺寸。")],
  ),
  menu: component(
    [
      "MenuContainer",
      "MenuButton",
      "Menu",
      "MenuItem",
      "MenuItemLocked",
      "MenuLink",
      "MenuDivider",
      "MenuSection",
    ],
    [
      row("open", "boolean", "Controlled menu state.", "受控菜单状态。"),
      row(
        "onOpenChange",
        "(open: boolean) => void",
        "Receives menu state changes.",
        "接收菜单状态变化。",
      ),
      row("onSelect", "() => void", "Runs an item action.", "执行条目操作。"),
    ],
  ),
  "middle-truncate": component(
    ["MiddleTruncate"],
    [
      row("text", "string", "Text shortened through its middle.", "从中间缩短的文本。", {
        required: true,
      }),
    ],
  ),
  modal: component(
    ["Modal", "ModalContent", "ModalTitle", "ModalDescription", "ModalClose"],
    [
      row("open", "boolean", "Controlled dialog state.", "受控对话框状态。"),
      row("defaultOpen", "boolean", "Initial uncontrolled state.", "非受控初始状态。"),
      row(
        "onOpenChange",
        "(open: boolean) => void",
        "Receives open state changes.",
        "接收打开状态变化。",
      ),
    ],
  ),
  "multi-select": component(
    ["MultiSelectRoot", "MultiSelectTrigger", "MultiSelectContent", "MultiSelectRow"],
    [
      row("open", "boolean", "Controlled popover state.", "受控浮层状态。"),
      row(
        "onOpenChange",
        "(open: boolean) => void",
        "Receives popover state changes.",
        "接收浮层状态变化。",
      ),
      row("checked", "boolean", "Whether a row is selected.", "行是否被选中。"),
    ],
  ),
  note: component(
    ["Note", "NoteContent", "NoteAction", "NoteLabel"],
    [row("type", "NoteVariant", "Semantic note style.", "语义提示样式。")],
  ),
  pagination: component(
    ["Pagination"],
    [
      row("page", "number", "Current page.", "当前页。"),
      row(
        "onPageChange",
        "(page: number) => void",
        "Receives navigation requests.",
        "接收翻页请求。",
      ),
    ],
  ),
  phone: component(
    ["Phone", "PhoneScreen"],
    [row("children", "ReactNode", "Screen content.", "屏幕内容。")],
  ),
  pill: component(["Pill"], [row("children", "ReactNode", "Pill label.", "胶囊标签。")]),
  progress: component(
    ["Progress"],
    [
      row("value", "number", "Known progress value.", "已知进度数值。"),
      row("indeterminate", "boolean", "Use when progress is unknown.", "进度未知时使用。", {
        defaultValue: "false",
      }),
    ],
  ),
  "project-banner": component(
    ["ProjectBanner", "ProjectBannerContent", "ProjectBannerClose"],
    [row("variant", "ProjectBannerVariant", "Banner emphasis.", "横幅强调样式。")],
  ),
  radio: component(
    ["Radio", "RadioGroup", "RadioGroupItem", "useRadio"],
    [
      row("value", "string", "Controlled selected value.", "受控选择值。"),
      row("onValueChange", "(value: string) => void", "Receives a new selection.", "接收新选择。"),
    ],
  ),
  "relative-time-card": component(
    ["RelativeTimeCard"],
    [
      row(
        "date",
        "Date | string | number",
        "Timestamp to format relative to now.",
        "相对当前时间格式化的时间戳。",
      ),
    ],
  ),
  scroller: component(
    ["Scroller"],
    [
      row("orientation", '"horizontal" | "vertical"', "Scrollable axis.", "滚动轴。", {
        defaultValue: '"horizontal"',
      }),
    ],
  ),
  "search-input": component(
    ["SearchInput"],
    [
      row("value", "string", "Controlled query.", "受控搜索词。"),
      row(
        "onValueChange",
        "(value: string) => void",
        "Receives query changes.",
        "接收搜索词变化。",
      ),
    ],
  ),
  select: component(
    ["Select"],
    [
      row("value", "string", "Controlled selected value.", "受控选择值。"),
      row(
        "onValueChange",
        "(value: string) => void",
        "Receives selection changes.",
        "接收选择变化。",
      ),
    ],
  ),
  separator: component(
    ["Separator"],
    [
      row(
        "orientation",
        '"horizontal" | "vertical"',
        "Visual separator orientation.",
        "视觉分隔线方向。",
        { defaultValue: '"horizontal"' },
      ),
    ],
  ),
  sheet: component(
    ["Sheet", "SheetContent", "SheetTitle", "SheetDescription", "SheetClose"],
    [
      row("open", "boolean", "Controlled sheet state.", "受控面板状态。"),
      row(
        "modal",
        "boolean",
        "Whether the sheet blocks outside interaction.",
        "是否阻止外部交互。",
        { defaultValue: "false" },
      ),
    ],
  ),
  "show-more": component(
    ["ShowMore"],
    [row("children", "ReactNode", "Content revealed on expansion.", "展开时显示的内容。")],
  ),
  skeleton: component(
    ["Skeleton"],
    [
      row(
        "children",
        "ReactNode",
        "Optional layout-matching placeholder content.",
        "可选的匹配布局占位内容。",
      ),
    ],
  ),
  slider: component(
    ["Slider"],
    [
      row("value", "number[]", "Controlled value.", "受控值。"),
      row(
        "onValueCommit",
        "(value: number[]) => void",
        "Canonical callback after a committed change.",
        "确认变更后的标准回调。",
      ),
      row(
        "onValueCommitted",
        "(value: number[]) => void",
        "Compatibility alias for onValueCommit.",
        "onValueCommit 的兼容别名。",
        { deprecated: true },
      ),
    ],
  ),
  snippet: component(
    ["Snippet"],
    [
      row("text", "string", "Text available for copying.", "可复制的文本。"),
      row("onCopyError", "(error: unknown) => void", "Handles a failed copy.", "处理复制失败。"),
    ],
  ),
  spinner: component(
    ["Spinner"],
    [row("size", "number | string", "Spinner dimensions.", "加载器尺寸。")],
  ),
  "split-button": component(
    ["SplitButton", "SplitButtonMain", "SplitButtonMenu", "SplitButtonMenuItem"],
    [
      row("onClick", "MouseEventHandler<HTMLButtonElement>", "Primary action.", "主操作。"),
      row("menu", "ReactNode", "Secondary action menu.", "次级操作菜单。"),
    ],
  ),
  "status-dot": component(
    ["StatusDot"],
    [
      row("state", "StatusDotState", "Status represented by the dot.", "圆点表示的状态。", {
        required: true,
      }),
    ],
  ),
  "step-point": component(
    ["StepPoint"],
    [row("status", "StepStatus", "Step state.", "步骤状态。", { defaultValue: '"idle"' })],
  ),
  switch: component(
    ["Switch", "SwitchControl"],
    [
      row("value", "string", "Controlled selected option.", "受控选择项。"),
      row("onValueChange", "(value: string) => void", "Receives a new selection.", "接收新选择。"),
    ],
  ),
  table: component(
    [
      "TableRoot",
      "Table",
      "TableHeader",
      "TableBody",
      "TableRow",
      "TableHead",
      "TableCell",
      "TableCaption",
    ],
    [
      row("striped", "boolean", "Alternates row backgrounds.", "交替行背景。"),
      row("bordered", "boolean", "Adds row separators.", "增加行分隔线。"),
      row("interactive", "boolean", "Enables row hover affordance.", "启用行悬停反馈。"),
    ],
  ),
  tabs: component(
    ["Tabs"],
    [
      row("selected", "string", "Controlled selected tab.", "受控选中的标签。"),
      row("setSelected", "(value: string) => void", "Receives tab selection.", "接收标签选择。"),
    ],
  ),
  "text-with-copy-button": component(
    ["TextWithCopyButton"],
    [
      row("textToCopy", "string", "Text displayed and copied.", "展示并复制的文本。", {
        required: true,
      }),
      row("textLabel", "string", "Visible text label.", "可见文本标签。", { required: true }),
      row("onCopy", "(text: string) => void", "Called after copy succeeds.", "复制成功后调用。"),
      row("onError", "(error: unknown) => void", "Called when copying fails.", "复制失败时调用。"),
    ],
  ),
  textarea: component(
    ["Textarea"],
    [row("size", "TextareaSize", "Textarea size.", "文本域尺寸。")],
    "TextareaHTMLAttributes<HTMLTextAreaElement>",
  ),
  toast: component(
    ["Toasts", "useToasts"],
    [
      row(
        "addToast",
        "(options: ToastOptions) => string",
        "Creates a toast and returns its ID.",
        "创建 Toast 并返回 ID。",
      ),
      row("dismiss", "(id: string) => void", "Dismisses a toast by ID.", "按 ID 关闭 Toast。"),
    ],
  ),
  toggle: component(
    ["Toggle"],
    [
      row("checked", "boolean", "Controlled on/off state.", "受控开关状态。"),
      row(
        "onCheckedChange",
        "(checked: boolean) => void",
        "Receives state changes.",
        "接收状态变化。",
      ),
    ],
  ),
  tooltip: component(
    ["Tooltip"],
    [
      row("content", "ReactNode", "Supplemental explanation.", "补充说明。", { required: true }),
      row("delayDuration", "number", "Delay before the tooltip opens.", "提示打开前的延迟。"),
    ],
  ),
  "theme-switcher": component(
    ["ThemeSwitcher"],
    [
      row("theme", '"light" | "dark" | "system"', "Current theme mode.", "当前主题模式。"),
      row("onThemeChange", "(theme: Theme) => void", "Receives theme changes.", "接收主题变化。"),
    ],
  ),
  video: component(
    ["Video"],
    [
      row("src", "string", "Media source.", "媒体地址。"),
      row(
        "onEnded",
        "ReactEventHandler<HTMLVideoElement>",
        "Native media lifecycle callback.",
        "原生媒体生命周期回调。",
      ),
    ],
    "VideoHTMLAttributes<HTMLVideoElement>",
  ),
  combobox: component(
    ["Combobox", "ComboboxInput", "ComboboxList", "ComboboxOption"],
    [
      row("value", "string", "Controlled selected value.", "受控选择值。"),
      row(
        "onValueChange",
        "(value: string) => void",
        "Receives selection changes.",
        "接收选择变化。",
      ),
    ],
  ),
  entity: component(
    ["Entity", "EntityMedia", "EntityContent", "EntityTitle", "EntityDescription", "EntityAction"],
    [row("children", "ReactNode", "Composable entity slots.", "可组合的实体槽位。")],
  ),
  "error-card": component(
    ["ErrorCard", "ErrorCardTitle", "ErrorCardDescription", "ErrorCardAction"],
    [row("children", "ReactNode", "Composable error content.", "可组合的错误内容。")],
  ),
} satisfies Record<string, ComponentApi>;

/**
 * Covers every page in the component registry. Components with a deliberately
 * compact surface still receive an export summary instead of an empty API pane.
 */
export const COMPONENT_API: Record<string, ComponentApi> = Object.fromEntries(
  COMPONENTS.map(({ name, label }) => [name, O[name as keyof typeof O] ?? component([label])]),
);

export const getComponentApi = (name: string) => COMPONENT_API[name];
