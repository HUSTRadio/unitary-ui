import { COMPONENTS } from "./components";

/** A small, hand-maintained index of the public surface exposed by each component. */
export type ApiRow = {
  name: string;
  type: string;
  description: string;
  descriptionZh: string;
  required?: boolean;
  defaultValue?: string;
  /** official = 官方 API 原样（默认）；extension = 框架扩展（API 表渲染「框架扩展」徽标） */
  origin?: "official" | "extension";
};

export type ComponentApi = {
  exports: string[];
  importPath?: string;
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
  prefetch: {
    importPath: "@hustradio/unitary-ui",
    ...component(["Prefetch", "createPrefetch", "usePrefetchState"], [
      row("resource", "PrefetchResource<unknown>", "Shared resource created with createPrefetch; creation starts no work.", "createPrefetch 创建的共享资源；创建时不启动工作。", { required: true, origin: "extension" }),
      row("trigger", '"intent" | "viewport" | "idle"', "Intent uses mouse/pen entry, keyboard focus and touch press; viewport and idle schedule once per setup.", "意图模式响应鼠标/笔进入、键盘聚焦与触摸按下；视口与空闲模式每次设置调度一次。", { defaultValue: '"intent"', origin: "extension" }),
      row("asChild", "boolean", "Merges behavior into one existing element without adding a wrapper.", "将行为合并到一个现有元素，不额外添加包装层。", { defaultValue: "false", origin: "extension" }),
      row("disabled", "boolean", "Suppresses automatic prefetch; explicit resource.load() remains available.", "禁止自动预载；显式 resource.load() 仍可用。", { defaultValue: "false", origin: "extension" }),
      row("respectDataSaver", "boolean", "Skips automatic prefetch when navigator.connection.saveData is available and true.", "navigator.connection.saveData 可用且为 true 时跳过自动预载。", { defaultValue: "true", origin: "extension" }),
      row("root", "Element | Document | null", "IntersectionObserver root for viewport mode.", "视口模式的 IntersectionObserver 根节点。", { defaultValue: "null", origin: "extension" }),
      row("rootMargin", "string", "Viewport-mode intersection margin.", "视口模式的相交边距。", { defaultValue: '"200px"', origin: "extension" }),
      row("threshold", "number", "Minimum intersection ratio in viewport mode.", "视口模式要求的最小相交比例。", { defaultValue: "0", origin: "extension" }),
      row("createPrefetch", "<T>(loader: (signal: AbortSignal) => T | PromiseLike<T>) => PrefetchResource<T>", "Creates a caller-owned resource; use stable instances, or one instance per SSR request for private data.", "创建由调用方持有的资源；保持实例稳定，私有数据在 SSR 中每个请求使用独立实例。", { origin: "extension" }),
      row("resource.load", "() => Promise<T>", "Returns the same in-flight or successful promise; errors reject and the next call can retry.", "返回同一个进行中或成功的 Promise；错误会拒绝，下一次调用可重试。", { origin: "extension" }),
      row("resource.prefetch", "() => Promise<void>", "Warms the load cache; handles background rejection and exposes errors in the snapshot.", "预热 load 缓存；处理后台拒绝，错误通过快照提供。", { origin: "extension" }),
      row("resource.invalidate", "() => void", "Clears the cache, aborts pending work honoring its signal and ignores stale completions.", "清除缓存，中止支持信号的进行中工作，并忽略旧结果。", { origin: "extension" }),
      row("resource.getSnapshot", "() => PrefetchSnapshot<T>", "Stable readonly idle/loading/ready/error snapshot; ready contains data and error contains the failure.", "稳定的只读 idle/loading/ready/error 快照；ready 提供 data，error 提供失败原因。", { origin: "extension" }),
      row("resource.subscribe", "(listener: () => void) => () => void", "Subscribes to changes and returns an unsubscribe function.", "订阅状态变化，返回取消订阅函数。", { origin: "extension" }),
      row("usePrefetchState", "<T>(resource: PrefetchResource<T>) => PrefetchSnapshot<T>", "Observes state without loading; SSR and initial hydration use idle.", "只订阅状态，不启动加载；SSR 与首次水合使用 idle。", { origin: "extension" }),
    ], 'Omit<ComponentPropsWithoutRef<"div">, "resource">'),
    notes: [{ zh: "Prefetch 是 Unitary 扩展。它保留已挂载子元素，不设置视觉样式；动态 import 会执行模块。缺少观察器时使用空闲调度，缺少空闲 API 时使用 200ms 定时器；卸载只取消尚未执行的调度。", en: "Prefetch is a Unitary extension. Children remain mounted and no visual styles are added; dynamic import executes modules. Missing observers fall back to idle scheduling, and missing idle APIs use a 200ms timer. Unmounting cancels pending scheduling only." }],
  },
  "carousel": component(["Carousel"], [
    row("variant", "\"slide\" | \"fade-linear\" | \"fade\" | \"fade-scale\"", "Slide, linear fade, eased fade or eased fade with subtle scaling. All respect reduced motion.", "滑动、线性淡入淡出、缓入缓出或缓入缓出加轻微缩放；均支持减少动画。", { defaultValue: "\"slide\"", origin: "extension" }),
    row("images", "CarouselImage[]", "Images with src, required alt, optional caption, srcSet and sizes.", "图片列表：src、必填 alt，以及可选 caption、srcSet 和 sizes。", {"required":true,"origin":"extension"}),
    row("index", "number", "Controlled zero-based slide index.", "受控的零起始图片索引。", {"origin":"extension"}),
    row("defaultIndex", "number", "Initial uncontrolled slide index.", "非受控模式的初始图片索引。", {"defaultValue":"0","origin":"extension"}),
    row("onIndexChange", "(index: number) => void", "Reports selection by controls, keyboard or gestures.", "报告按钮、键盘或手势选择的新索引。", {"origin":"extension"}),
    row("loop", "boolean", "Wraps previous/next arrow controls at the ends; gestures stop at the boundary.", "方向按钮在首尾循环；手势到达边界后停止。", {"defaultValue":"false","origin":"extension"}),
  ], "Omit<ComponentProps<\"div\">, \"children\" | \"onChange\">"),
  "full-page-scroller": component(["FullPageScroller"], [
    row("orientation", "\"vertical\" | \"horizontal\"", "Paging axis.", "整屏切换方向。", {"defaultValue":"\"vertical\"","origin":"extension"}),
    row("index", "number", "Controlled zero-based section index.", "受控的零起始区块索引。", {"origin":"extension"}),
    row("defaultIndex", "number", "Initial uncontrolled index.", "非受控模式的初始索引。", {"defaultValue":"0","origin":"extension"}),
    row("onIndexChange", "(index: number) => void", "Reports a requested section change.", "报告请求切换到的区块索引。", {"origin":"extension"}),
    row("wheelThreshold", "number", "Accumulated wheel distance in pixels; line and page inputs are normalized.", "累计滚轮阈值，单位像素；行和页单位会转换。", {"defaultValue":"80","origin":"extension"}),
    row("touchThreshold", "number", "Minimum completed swipe distance in pixels.", "完成滑动时的最小距离，单位像素。", {"defaultValue":"50","origin":"extension"}),
    row("disabled", "boolean", "Disables gesture and keyboard paging.", "禁用手势及键盘翻屏。", {"defaultValue":"false","origin":"extension"}),
    row("children", "ReactNode", "Each direct child occupies one full section.", "每个直接子节点占据一整屏。", {"origin":"extension"}),
  ], "Omit<ComponentProps<\"div\">, \"onChange\">"),
  "lazy-load": component(["LazyLoad"], [
    row("placeholder", "ReactNode", "Content shown before the first reveal.", "首次显示前的占位内容。", {"origin":"extension"}),
    row("root", "Element | Document | null", "IntersectionObserver scroll root; null uses the viewport.", "IntersectionObserver 滚动根节点；null 使用浏览器视口。", {"defaultValue":"null","origin":"extension"}),
    row("rootMargin", "string", "Observer margin for loading before content is visible.", "观察器边距，用于提前加载。", {"defaultValue":"\"200px\"","origin":"extension"}),
    row("threshold", "number", "Required intersection ratio.", "要求的相交比例。", {"defaultValue":"0","origin":"extension"}),
    row("onLoad", "() => void", "Called once when deferred content mounts; not an image download callback.", "延迟内容首次挂载时调用一次；不代表图片下载完成。", {"origin":"extension"}),
    row("disabled", "boolean", "Renders content eagerly.", "立即渲染内容。", {"defaultValue":"false","origin":"extension"}),
    row("children", "ReactNode", "Subtree mounted once, then retained.", "首次挂载后保持挂载的内容子树。", {"origin":"extension"}),
  ], "ComponentProps<\"div\">"),
  /* Charts —— 图表分组（Tremor Raw 内置，/charts/<name>） */
  "area-chart": component(
    ["AreaChart"],
    [
      row("data", "Record<string, any>[]", "Data records; one point per index value.", "数据记录；每个索引值一条。", { required: true }),
      row("index", "string", "Field used for the x axis.", "x 轴所用字段。", { required: true }),
      row("categories", "string[]", "Series field names rendered as stacked areas.", "渲染为面积系列的字段名。", { required: true }),
      row("colors", "AvailableChartColorsKeys[]", "Series palette order.", "系列取色顺序。", { defaultValue: "AvailableChartColors" }),
      row("type", '"default" | "stacked" | "percent"', "Series composition mode.", "系列组合模式。", { defaultValue: '"default"' }),
      row("fill", '"gradient" | "solid" | "none"', "Area fill treatment.", "面积填充形态。", { defaultValue: '"gradient"' }),
      row("valueFormatter", "(value: number) => string", "Formats axis and tooltip values.", "格式化坐标轴与提示数值。"),
      row("onValueChange", "(value: AreaChartEventProps) => void", "Reports dot / legend interactions.", "回报数据点 / 图例交互。"),
      row("customTooltip", "React.ComponentType<TooltipProps>", "Replaces the built-in tooltip card.", "替换内置提示卡片。"),
    ],
    "React.HTMLAttributes<HTMLDivElement>",
  ),
  "bar-chart": component(
    ["BarChart"],
    [
      row("data", "Record<string, any>[]", "Data records; one point per index value.", "数据记录；每个索引值一条。", { required: true }),
      row("index", "string", "Field used for the category axis.", "类目轴所用字段。", { required: true }),
      row("categories", "string[]", "Series field names rendered as bars.", "渲染为柱系列的字段名。", { required: true }),
      row("type", '"default" | "stacked" | "percent"', "Bar composition mode.", "柱状组合模式。", { defaultValue: '"default"' }),
      row("layout", '"horizontal" | "vertical"', "Bar orientation.", "柱状方向。", { defaultValue: '"horizontal"' }),
      row("colors", "AvailableChartColorsKeys[]", "Series palette order.", "系列取色顺序。", { defaultValue: "AvailableChartColors" }),
      row("valueFormatter", "(value: number) => string", "Formats axis and tooltip values.", "格式化坐标轴与提示数值。"),
      row("onValueChange", "(value: BarChartEventProps) => void", "Reports bar / legend interactions.", "回报柱 / 图例交互。"),
      row("customTooltip", "React.ComponentType<TooltipProps>", "Replaces the built-in tooltip card.", "替换内置提示卡片。"),
    ],
    "React.HTMLAttributes<HTMLDivElement>",
  ),
  "line-chart": component(
    ["LineChart"],
    [
      row("data", "Record<string, any>[]", "Data records; one point per index value.", "数据记录；每个索引值一条。", { required: true }),
      row("index", "string", "Field used for the x axis.", "x 轴所用字段。", { required: true }),
      row("categories", "string[]", "Series field names rendered as lines.", "渲染为折线的字段名。", { required: true }),
      row("connectNulls", "boolean", "Bridges missing values in a series.", "跨接系列中的缺失值。", { defaultValue: "false" }),
      row("xAxisLabel", "string", "Optional x axis title.", "可选的 x 轴标题。"),
      row("yAxisLabel", "string", "Optional y axis title.", "可选的 y 轴标题。"),
      row("valueFormatter", "(value: number) => string", "Formats axis and tooltip values.", "格式化坐标轴与提示数值。"),
      row("onValueChange", "(value: LineChartEventProps) => void", "Reports dot / legend interactions.", "回报数据点 / 图例交互。"),
      row("customTooltip", "React.ComponentType<TooltipProps>", "Replaces the built-in tooltip card.", "替换内置提示卡片。"),
    ],
    "React.HTMLAttributes<HTMLDivElement>",
  ),
  "combo-chart": component(
    ["ComboChart"],
    [
      row("data", "Record<string, any>[]", "Data records; one point per index value.", "数据记录；每个索引值一条。", { required: true }),
      row("index", "string", "Field used for the category axis.", "类目轴所用字段。", { required: true }),
      row("barSeries", "ChartSeries & { type?: \"default\" | \"stacked\" }", "Bar series config (categories, colors, valueFormatter, axis).", "柱系列配置（categories、colors、valueFormatter、轴）。", { required: true }),
      row("lineSeries", "ChartSeries & { connectNulls?: boolean }", "Line series config.", "折线系列配置。"),
      row("enableBiaxial", "boolean", "Renders the line series on a second y axis.", "将折线系列渲染到第二 y 轴。", { defaultValue: "false" }),
      row("onValueChange", "(value: ComboChartEventProps) => void", "Reports bar / dot / legend interactions.", "回报柱 / 数据点 / 图例交互。"),
      row("customTooltip", "React.ComponentType<TooltipProps>", "Replaces the built-in tooltip card.", "替换内置提示卡片。"),
    ],
    "React.HTMLAttributes<HTMLDivElement>",
  ),
  "donut-chart": component(
    ["DonutChart"],
    [
      row("data", "any[]", "Data records; one slice per record.", "数据记录；每条一个扇区。", { required: true }),
      row("category", "string", "Field used for slice labels.", "扇区标签所用字段。", { required: true }),
      row("value", "string", "Field used for slice sizes.", "扇区大小所用字段。", { required: true }),
      row("variant", '"donut" | "pie"', "Ring or full pie rendering.", "环形或完整饼形渲染。", { defaultValue: '"donut"' }),
      row("valueFormatter", "(value: number) => string", "Formats tooltip values.", "格式化提示数值。"),
      row("onValueChange", "(value: DonutChartEventProps) => void", "Reports slice / legend interactions.", "回报扇区 / 图例交互。"),
      row("children", "React.ReactNode", "Center metric (donut variant only).", "中心指标（仅 donut 形态）。"),
      row("customTooltip", "React.ComponentType<TooltipProps>", "Replaces the built-in tooltip card.", "替换内置提示卡片。"),
    ],
  ),
  "spark-chart": component(
    ["SparkAreaChart", "SparkLineChart", "SparkBarChart"],
    [
      row("data", "Record<string, any>[]", "Data records; one point per index value.", "数据记录；每个索引值一条。", { required: true }),
      row("index", "string", "Field used for the x axis.", "x 轴所用字段。", { required: true }),
      row("categories", "string[]", "Single-series field name.", "单系列字段名。", { required: true }),
      row("colors", "AvailableChartColorsKeys[]", "Series color.", "系列颜色。", { defaultValue: "AvailableChartColors" }),
    ],
    "React.HTMLAttributes<HTMLDivElement>",
  ),
  "category-bar": component(
    ["CategoryBar"],
    [
      row("values", "number[]", "Segment values; widths are proportional to the total.", "分段数值；宽度按总和等比分配。", { required: true }),
      row("colors", "AvailableChartColorsKeys[]", "Segment palette order.", "分段取色顺序。", { defaultValue: "AvailableChartColors" }),
      row("marker", "{ value: number; tooltip?: string; className?: string }", "Optional marker with hover tooltip.", "可选标记及其悬停提示。"),
      row("showLabels", "boolean", "Shows cumulative value labels.", "显示累计数值标签。", { defaultValue: "true" }),
    ],
    "React.HTMLAttributes<HTMLDivElement>",
  ),
  "bar-list": component(
    ["BarList"],
    [
      row("data", "{ name: string; value: number; href?: string; icon?: React.ElementType; key?: string }[]", "Ranked entries to render.", "待渲染的排名条目。", { required: true }),
      row("color", "AvailableChartColorsKeys", "Bar color.", "条形颜色。", { defaultValue: '"gray"' }),
      row("valueFormatter", "(value: number) => string", "Formats the trailing value.", "格式化行尾数值。"),
      row("showAnimation", "boolean", "Animates bars on mount.", "挂载时播放条形动画。", { defaultValue: "false" }),
      row("sortOrder", '"ascending" | "descending" | "none"', "Sorts entries by value.", "按数值排序条目。", { defaultValue: '"descending"' }),
    ],
    "React.HTMLAttributes<HTMLDivElement>",
  ),
  tracker: component(
    ["Tracker"],
    [
      row("data", "TrackerBlockProps[]", "Status blocks rendered left to right.", "从左到右渲染的状态块。", { required: true }),
      row("children", "React.ReactNode", "Optional overlay content.", "可选的覆盖内容。"),
    ],
    "React.HTMLAttributes<HTMLDivElement>",
  ),
  "progress-circle": component(
    ["ProgressCircle"],
    [
      row("value", "number", "Current progress value.", "当前进度值。", { required: true }),
      row("max", "number", "Value that means 100%.", "视为 100% 的值。", { defaultValue: "100" }),
      row("radius", "number", "Circle radius in pixels.", "圆环半径（像素）。", { required: true }),
      row("strokeWidth", "number", "Ring stroke thickness.", "圆环描边宽度。", { defaultValue: "6" }),
      row("color", "AvailableChartColorsKeys", "Ring color.", "圆环颜色。", { defaultValue: '"blue"' }),
      row("children", "React.ReactNode", "Center content (value, label).", "中心内容（数值、标签）。"),
    ],
    "React.HTMLAttributes<HTMLDivElement>",
  ),
  avatar: component(
    [
      "Avatar",
      "AvatarGroup",
      "AvatarWithIcon",
      "GitHubAvatar",
      "GitLabAvatar",
      "BitbucketAvatar",
    ],
    [
      row("size", "number", "Avatar or AvatarGroup diameter in pixels.", "Avatar 或 AvatarGroup 的头像直径（像素）。", {
        defaultValue: "32",
      }),
      row("src", "string", "Image source.", "图片地址。"),
      row("alt", "string", "Accessible image description.", "图片的无障碍说明。"),
      row("username", "string", "GitHub username used as an image source.", "用作图片来源的 GitHub 用户名。"),
      row("letter", "string", "One or two fallback initials.", "一到两个后备首字母。"),
      row("placeholder", "boolean", "Shows the placeholder shell.", "显示占位外壳。"),
      row("title", "string", "Entity name used for the accessible label.", "用作无障碍标签的实体名称。"),
      row(
        "members",
        "AvatarGroupMember[]",
        "Required AvatarGroup members.",
        "AvatarGroup 必填的成员列表。",
        { required: true },
      ),
      row("limit", "number", "Maximum AvatarGroup slots, including the +N summary when needed.", "AvatarGroup 的最大头像槽位数，超出时包含 +N 汇总头像。"),
      row("overlap", '"auto" | number', "AvatarGroup overlap amount.", "AvatarGroup 的重叠量。", {
        defaultValue: '"auto"',
      }),
      row("reverse", "boolean", "Reverses AvatarGroup overlap stacking order.", "反转 AvatarGroup 的重叠层叠顺序。", {
        defaultValue: "false",
      }),
    ],
    "ComponentProps<typeof AvatarPrimitive.Root>",
  ),
  badge: component(
    ["Badge", "badgeVariants"],
    [
      row("variant", "BadgeVariant", "Visual badge variant.", "徽章视觉变体。", {
        defaultValue: '"gray"',
      }),
      row(
        "shape",
        '"pill" | "rounded"',
        "Full pill or rounded rectangle (4px radius).",
        "全圆胶囊或圆角矩形（4px 半径）。",
        {
          defaultValue: '"pill"',
        },
      ),
      row("size", '"compact" | "sm" | "md" | "lg"', "Badge size.", "徽章尺寸。", {
        defaultValue: '"md"',
      }),
      row(
        "contrast",
        '"low" | "soft"',
        "Low-contrast text treatment, or a soft tinted fill.",
        "低对比度文字样式，或柔和底色档。",
      ),
      row("icon", "ReactNode", "Optional leading icon.", "可选的前置图标。"),
      row("asChild", "boolean", "Renders through the child element.", "通过子元素渲染。", {
        defaultValue: "false",
      }),
    ],
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
        "address",
        "string",
        "Address shown in the browser chrome; renders a copy button that briefly reports the copied state.",
        "浏览器框中显示的地址；附带复制按钮，复制成功后短暂显示已复制状态。",
      ),
    ],
  ),
  breadcrumbs: component(
    ["Breadcrumb", "BreadcrumbItem"],
    [
      row(
        "type",
        '"text" | "menu"',
        'Layout variant. "text" renders a <nav> with chevron separators; "menu" renders a role="navigation" <div> of chip buttons, so the native attributes each variant accepts also switch from <nav> to <div>.',
        '"text"：渲染 <nav> 与 chevron 分隔符；"menu"：渲染 role="navigation" 的 <div> 芯片按钮组，可传入的原生属性也从 <nav> 换成 <div>。',
        { defaultValue: '"text"' },
      ),
      row("href", "string", "Navigation destination for an item.", "条目的导航目标。"),
    ],
  ),
  button: component(
    ["Button", "ButtonLink", "CustomButton", "buttonVariants"],
    [
      row(
        "type",
        '"default" | "secondary" | "tertiary" | "error" | "warning"',
        "Visual variant.",
        "视觉变体。",
        { defaultValue: '"default"' },
      ),
      row("typeName", '"submit" | "button" | "reset"', "Native button type.", "原生按钮 type。", {
        defaultValue: '"submit"',
      }),
      row(
        "loading",
        "boolean",
        "Shows a spinner, preserves the label, and disables the native button.",
        "显示加载图标、保留标签，并禁用原生按钮。",
        { defaultValue: "false" },
      ),
      row(
        "size",
        '"tiny" | "small" | "medium" | "large"',
        "Control height and horizontal padding.",
        "控制高度与水平内边距。",
        { defaultValue: '"medium"' },
      ),
      row(
        "shape",
        '"square" | "circle" | "rounded"',
        "Corner treatment; rounded pairs with shadow for marketing CTAs.",
        "圆角形态；rounded 可配合 shadow 用于营销 CTA。",
        { defaultValue: '"square"' },
      ),
      row(
        "shadow",
        "boolean",
        'Marketing-page shadow (used with shape="rounded").',
        "营销页阴影（配合 shape=\"rounded\"）。",
        { defaultValue: "false" },
      ),
      row(
        "svgOnly",
        "boolean",
        "Icon-only mode: collapses padding and requires aria-label.",
        "纯图标按钮：缩小内边距，需提供 aria-label。",
        { defaultValue: "false" },
      ),
      row("prefix", "ReactNode", "Leading icon slot.", "前缀图标。"),
      row("suffix", "ReactNode", "Trailing icon slot.", "后缀图标。"),
      row("asChild", "boolean", "Renders as the child element (Slot).", "以子元素渲染（Slot）。", {
        defaultValue: "false",
      }),
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
        "onChange",
        "() => void",
        "No-argument change callback (official). Toggle your own state.",
        "无参数变更回调（官方）。自行切换状态。",
      ),
      row(
        "defaultChecked",
        "boolean",
        "Uncontrolled initial value (framework extension).",
        "非受控初始值（框架扩展）。",
        { origin: "extension" },
      ),
      row(
        "indeterminate",
        "boolean",
        "Visual mixed state, not a third value.",
        "视觉半选态，非第三值。",
      ),
      row("disabled", "boolean", "Disables the checkbox.", "禁用复选框。"),
      row(
        "size",
        '"sm" | "default" | "lg"',
        "Control size (framework extension).",
        "控件尺寸（框架扩展）。",
        {
          origin: "extension",
          defaultValue: '"sm"',
        },
      ),
    ],
  ),
  choicebox: component(
    ["ChoiceboxGroup", "ChoiceboxGroupItem"],
    [
      row("label", "string", "Accessible group label.", "选择组的无障碍标签。", {
        required: true,
      }),
      row("type", '"radio" | "checkbox"', "Single- or multi-select group mode.", "单选或多选组模式。", {
        required: true,
      }),
      row("value", "string | string[]", "Controlled selected value(s), matching the group type.", "与组模式匹配的受控选择值。", {
        required: true,
      }),
      row("onChange", "((value: string) => void) | ((value: string[]) => void)", "Receives the next value shape for the selected group type.", "按所选组模式接收对应结构的新值。", {
        required: true,
      }),
      row("listClassName", "string", "Controls the item list layout.", "控制选项列表布局。"),
      row("showLabel", "boolean", "Renders the group label visibly.", "显示选择组标签。", {
        defaultValue: "false",
      }),
      row("disabled", "boolean", "Disables every item in the group.", "禁用组内所有选项。", {
        defaultValue: "false",
      }),
      row("required", "boolean", "Marks the group as required.", "将选择组标记为必填。", {
        defaultValue: "false",
      }),
      row("title", "ReactNode", "Choicebox item title.", "Choicebox 选项标题。", {
        required: true,
      }),
      row("description", "ReactNode", "Choicebox item description.", "Choicebox 选项描述。", {
        required: true,
      }),
    ],
  ),
  "clearable-input": component(
    ["ClearableInput"],
    [
      row("label", "string", "Visible label associated with the native input.", "与原生输入框关联的可见标签。"),
      row("cmdk", "boolean", "Shows the desktop command-menu shortcut suffix.", "显示桌面端命令菜单快捷键后缀。", {
        defaultValue: "false",
      }),
      row(
        "onClear",
        "() => void",
        "Called when the clear affordance is activated.",
        "点击清除控件时调用。",
      ),
      row("layout", "ControlLayout", "Controls root width and input surface height constraints.", "控制根容器宽度和输入表面高度约束。"),
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
      row("children", "string", "Code rendered by the default content slot.", "默认内容槽展示的代码。", {
        required: true,
      }),
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
      row("size", '"default" | "small" | "bare"', "Trigger padding scale.", "触发器内边距档位。", {
        defaultValue: '"default"',
      }),
      row(
        "icon",
        '"chevron" | "plus"',
        "Indicator glyph; plus rotates 45° into an × when open.",
        "指示图标；plus 展开时旋转 45° 变 ×。",
        { defaultValue: '"chevron"' },
      ),
      row(
        "indicatorAlign",
        '"inline" | "end"',
        "Indicator placement: inline sits right after the title, end pushes it to the row's trailing edge.",
        "指示图标位置：inline 紧跟标题，end 推到行尾右对齐。",
        { defaultValue: '"end"' },
      ),
      row(
        "as",
        "ElementType",
        "Trigger element type. Non-button elements have no button styling and use role=button with Enter/Space support.",
        "触发元素类型。非按钮元素不使用按钮样式，并通过 role=button 支持 Enter/Space 操作。",
      ),
      row("disabled", "boolean", "Blocks toggling and dims the row.", "阻止展开并整行变淡。", {
        defaultValue: "false",
      }),
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
        "setOpen",
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
    [
      "ContextMenu",
      "ContextMenuTrigger",
      "ContextMenuContent",
      "ContextMenuItem",
      "ContextMenuSeparator",
      "ContextMenuQuickActionsContent",
      "ContextMenuQuickActionsItem",
    ],
    [
      row("open", "boolean", "Controlled menu state.", "受控菜单状态。"),
      row(
        "onOpenChange",
        "(open: boolean) => void",
        "Receives menu state changes.",
        "接收菜单状态变化。",
      ),
      row("inset", "boolean", "Indents a ContextMenuItem.", "缩进 ContextMenuItem。"),
      row("value", "string", "Optional item value exposed as data-value.", "作为 data-value 暴露的可选菜单项值。"),
      row("href", "string", "Renders a ContextMenuItem as a link.", "将 ContextMenuItem 渲染为链接。"),
      row("prefix", "ReactNode", "Leading item content.", "菜单项前置内容。"),
      row("suffix", "ReactNode", "Trailing item content.", "菜单项后置内容。"),
      row(
        "width",
        "number",
        "Width in pixels of the Quick Actions list.",
        "Quick Actions 列表宽度（像素）。",
        { defaultValue: "224" },
      ),
      row(
        "backdropBlur",
        "boolean",
        "Whether the Quick Actions list renders a blurred backdrop.",
        "Quick Actions 列表是否渲染背景模糊遮罩。",
        { defaultValue: "true" },
      ),
      row("icon", "ReactNode", "Leading 20px icon of a Quick Actions item.", "Quick Actions 项的行首图标（20px 档）。"),
      row("title", "ReactNode", "Primary label of a Quick Actions item.", "Quick Actions 项的主标题。"),
      row("subtitle", "ReactNode", "Secondary muted line of a Quick Actions item.", "Quick Actions 项的次要说明行。"),
      row(
        "destructive",
        "boolean",
        "Marks a system item such as Remove App in red.",
        "将系统项（如“移除 App”）标红。",
      ),
    ],
  ),
  "edit-menu": component(
    ["EditMenu"],
    [
      row(
        "children",
        "ReactNode",
        "Selectable content the menu watches for a text selection.",
        "组件监听文本选区的可选中内容。",
        { required: true },
      ),
      row(
        "standardActions",
        "readonly EditMenuStandardAction[]",
        "Enabled standard actions and their order; defaults to cut, copy, paste, selectAll, lookUp, share.",
        "启用的标准操作及其顺序；默认为 cut、copy、paste、selectAll、lookUp、share。",
      ),
      row(
        "actions",
        "readonly EditMenuAction[]",
        "Custom actions appended after the standard actions behind a divider.",
        "追加在标准操作之后、以分隔线隔开的自定义操作。",
      ),
      row(
        "onCut",
        "(text: string, rawText: string) => void",
        "Receives the trimmed and the raw selection after it is copied; perform the deletion yourself with the raw text. Not called when the clipboard write fails.",
        "复制选区后收到「已 trim 文本」与「选区原文」，删除动作由调用方执行（应用原文）。剪贴板写入失败时不触发。",
      ),
      row(
        "onCopy",
        "(text: string, rawText: string) => void",
        "Receives the trimmed and the raw selection after the component copies it. Not called when the clipboard write fails.",
        "组件复制选区后收到「已 trim 文本」与「选区原文」。剪贴板写入失败时不触发。",
      ),
      row(
        "onPaste",
        "() => void",
        "Paste handler; the component does not read the clipboard for you.",
        "粘贴回调；组件不会替你读取剪贴板。",
      ),
      row("onSelectAll", "() => void", "Selects all content in the container.", "全选容器内的内容。"),
      row(
        "onLookUp",
        "(text: string, rawText: string) => void",
        "Look up handler for the current selection (trimmed and raw).",
        "查询当前选区（已 trim 文本与选区原文）。",
      ),
      row(
        "onShare",
        "(text: string, rawText: string) => void",
        "Share handler for the current selection (trimmed and raw).",
        "共享当前选区（已 trim 文本与选区原文）。",
      ),
      row(
        "onError",
        "(error: unknown) => void",
        "Clipboard write failures. Cut and copy callbacks are not fired; render the visible feedback yourself.",
        "剪贴板写入失败。此时不触发 Cut / Copy 回调，可见反馈由调用方渲染。",
      ),
      row(
        "offset",
        "number",
        "Gap in pixels between the capsule and the selection.",
        "胶囊与选区之间的间距（像素）。",
        { defaultValue: "8" },
      ),
    ],
    undefined,
  ),
  "activity-view": component(
    ["ActivityView"],
    [
      row("open", "boolean", "Controlled open state.", "受控打开状态。", { required: true }),
      row(
        "onOpenChange",
        "(open: boolean) => void",
        "Receives open state changes.",
        "接收打开状态变化。",
        { required: true },
      ),
      row(
        "targets",
        "readonly ActivityTarget[]",
        "Share targets rendered as a horizontally scrolling grid.",
        "以横向滚动网格渲染的分享目标。",
      ),
      row(
        "actions",
        "readonly ActivityAction[]",
        "Action rows rendered beneath the targets.",
        "渲染在目标下方的操作行。",
      ),
      row(
        "title",
        "ReactNode",
        "Panel title; pass null to omit the title row.",
        "面板标题；传 null 则不渲染标题行。",
      ),
      row(
        "showCancel",
        "boolean",
        "Renders the trailing cancel row.",
        "渲染底部取消行。",
        { defaultValue: "true" },
      ),
      row(
        "sheetProps",
        "Partial<BottomSheetProps>",
        "Pass-through to the underlying BottomSheet; overrides the default detents, gestures, and indicator.",
        "透传给底层 BottomSheet；可覆盖默认的档位、手势与指示条配置。",
      ),
    ],
    undefined,
  ),
  "menu-bar": component(
    [
      "MenuBar",
      "MenuBarMenu",
      "MenuBarTrigger",
      "MenuBarContent",
      "MenuBarItem",
      "MenuBarCheckboxItem",
      "MenuBarSeparator",
      "MenuBarSub",
      "MenuBarSubTrigger",
      "MenuBarSubContent",
    ],
    [
      row("shortcut", "ReactNode", "Right-aligned shortcut hint; display only, no key binding.", "右对齐快捷键提示；仅展示，不绑定按键。"),
      row("inset", "boolean", "Indents a MenuBarItem to align with checkbox items.", "缩进 MenuBarItem 以与勾选项对齐。"),
      row("checked", "boolean", "Checked state of a MenuBarCheckboxItem.", "MenuBarCheckboxItem 的勾选状态。", {
        defaultValue: "false",
      }),
      row(
        "onCheckedChange",
        "(checked: boolean) => void",
        "Receives checkbox item state changes.",
        "接收勾选项状态变化。",
      ),
      row("disabled", "boolean", "Keeps a command visible but inert.", "保持命令可见但不可操作。"),
    ],
    undefined,
  ),
  toolbar: component(
    ["Toolbar", "ToolbarGroup", "ToolbarItem"],
    [
      row(
        "collapse",
        "boolean",
        "Collapses collapsible groups into an overflow menu when space runs out.",
        "空间不足时把可折叠组收进溢出菜单。",
        { defaultValue: "true" },
      ),
      row("slot", "ToolbarSlot", "Group placement: leading, center, or trailing.", "组的位置：leading、center 或 trailing。", {
        defaultValue: '"leading"',
      }),
      row(
        "collapsible",
        "boolean",
        "Whether the group collapses when space runs out. Defaults by content: only all-ToolbarItem groups collapse; groups holding a search field, MenuButton, or custom controls stay in place.",
        "空间不足时该组是否折叠。未指定时按组内容决定：组内全部是 ToolbarItem 才折叠，含搜索框 / MenuButton / 自定义控件时保持常驻。",
      ),
      row("label", "ReactNode", "Item label, reused as the overflow menu item text and accessible name.", "项名称；折叠后作为溢出菜单文案与无障碍名称。", {
        required: true,
      }),
      row("icon", "ReactNode", "Leading 16px icon of a tool item.", "工具项的行首图标（16px 档）。"),
      row("iconOnly", "boolean", "Hides the label visually but keeps it as the accessible name.", "隐藏可见文案，但仍作为无障碍名称。"),
      row("active", "boolean", "Marks the item as the current selection.", "标记该项为当前选中。"),
      row("onSelect", "() => void", "Runs when the item is activated.", "项被激活时触发。"),
    ],
    undefined,
  ),
  "safe-area": component(
    ["SafeArea"],
    [
      row(
        "edges",
        "SafeAreaEdge | readonly SafeAreaEdge[]",
        "Edges that receive safe-area padding; \"all\" covers every side.",
        "应用安全区边距的边；all 表示四边。",
        { defaultValue: '"all"' },
      ),
      row(
        "padding",
        "LayoutSpacing",
        "Spacing step used as the minimum inset, compared against env(safe-area-inset-*).",
        "作为最小内边距的间距档，与 env(safe-area-inset-*) 取较大值。",
        { defaultValue: '"md"' },
      ),
    ],
    undefined,
  ),
  stack: component(
    ["Stack"],
    [
      row("direction", "\"row\" | \"column\"", "Stacking direction.", "堆叠方向。", {
        defaultValue: '"column"',
      }),
      row("gap", "LayoutSpacing", "Spacing step between children.", "子项之间的间距档。", {
        defaultValue: '"md"',
      }),
      row(
        "align",
        "\"start\" | \"center\" | \"end\" | \"stretch\" | \"baseline\"",
        "Cross-axis alignment.",
        "交叉轴对齐。",
      ),
      row(
        "justify",
        "\"start\" | \"center\" | \"end\" | \"between\"",
        "Main-axis distribution.",
        "主轴分布。",
      ),
      row("wrap", "boolean", "Allows children to wrap onto multiple lines.", "允许子项换行。"),
    ],
    undefined,
  ),
  "continuous-surface": component(
    ["ContinuousSurface"],
    [
      row("radius", "number", "Visual corner radius in CSS pixels.", "以 CSS 像素表示的视觉圆角半径。", {
        defaultValue: "12",
      }),
      row("exponent", "number", "Curve exponent; 2 is circular.", "曲线指数；2 表示圆弧。", {
        defaultValue: "3",
      }),
      row("samples", "number", "Line segments sampled per non-circular corner.", "每个非圆弧角的采样线段数。", {
        defaultValue: "24",
      }),
    ],
    "HTMLAttributes<HTMLDivElement>",
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
      row("title", "string", "Description term.", "描述术语。", { required: true }),
      row("content", "ReactNode", "Description value.", "描述值。", { required: true }),
      row("tooltip", "string", "Optional explanation shown beside the term.", "显示在术语旁的可选解释。"),
      row("right", "boolean", "Right-aligns the term and value.", "右对齐术语和值。", {
        defaultValue: "false",
      }),
      row("ellipsis", "boolean", "Truncates overflowing term and value text.", "截断溢出的术语和值文本。", {
        defaultValue: "false",
      }),
    ],
  ),
  "destructive-action-modal": component(
    ["DestructiveActionModal"],
    [
      row("open", "boolean", "Controlled dialog state.", "受控对话框状态。"),
      row("onCancel", "() => void", "Handles cancellation and dismissal.", "处理取消与关闭。"),
      row(
        "onConfirm",
        "() => void",
        "Owns the destructive action.",
        "负责执行破坏性操作。",
      ),
      row("title", "string", "Dialog title.", "对话框标题。", { required: true }),
      row("description", "ReactNode", "Consequence description.", "后果说明。"),
      row("confirmLabel", "string", "Confirmation button label.", "确认按钮文案。", { required: true }),
      row("verificationPhrase", "string", "Exact phrase required to unlock confirmation.", "解锁确认所需精确输入的短语。", { required: true }),
      row("verificationLabel", "string", "Noun used in the verification prompt.", "验证提示中使用的名词。"),
      row("irreversibleDescription", "ReactNode", "Optional irreversible-action warning band.", "可选的不可撤销操作警告带。"),
      row("loading", "boolean", "Disables both actions and shows progress.", "禁用两个操作并显示加载状态。", { defaultValue: "false" }),
      row("error", "string | Error", "Inline confirmation error.", "行内确认错误。"),
    ],
  ),
  "dots-menu": component(
    ["DotsMenu", "DotsMenuItem", "DotsMenuSeparator"],
    [
      row("position", "MenuPosition", "Menu placement relative to the trigger.", "菜单相对触发器的位置。", {
        defaultValue: '"bottom-end"',
      }),
      row("iconSize", "number", "Trigger icon size in pixels.", "触发器图标的像素尺寸。", {
        defaultValue: "18",
      }),
      row("disabled", "boolean", "Disables the menu trigger.", "禁用菜单触发器。"),
    ],
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
  "responsive-drawer": component(
    [
      "ResponsiveDrawer",
      "ResponsiveDrawerTrigger",
      "ResponsiveDrawerContent",
      "ResponsiveDrawerHeader",
      "ResponsiveDrawerTitle",
      "ResponsiveDrawerDescription",
      "ResponsiveDrawerBody",
      "ResponsiveDrawerFooter",
      "ResponsiveDrawerClose",
    ],
    [
      row("open", "boolean", "Controlled open state.", "受控打开状态。"),
      row("defaultOpen", "boolean", "Initial uncontrolled state.", "非受控初始状态。"),
      row(
        "onOpenChange",
        "(open: boolean) => void",
        "Called when the drawer opens or closes.",
        "抽屉打开或关闭时调用。",
      ),
      row(
        "responsive",
        "boolean",
        "Bottom geometry below 640px and a right panel above it; takes precedence over placement.",
        "640px 以下用底部形态、以上用右侧面板；优先于 placement。",
        { defaultValue: "false" },
      ),
      row(
        "placement",
        '"bottom" | "right" | "left" | "top"',
        "Fixed edge for the panel.",
        "面板固定贴靠的边。",
        { defaultValue: '"right"' },
      ),
      row(
        "detents",
        "number[]",
        "Bottom height steps as viewport ratios; ignored by side placements. The slider indicator supports Arrow keys plus Home and End.",
        "底部形态的高度档位（占视口比例）；侧栏形态忽略。slider 指示条支持方向键及 Home / End。",
        { defaultValue: "[0.5, 1]" },
      ),
      row(
        "showIndicator",
        '"automatic" | boolean',
        "Drag indicator policy; automatic renders it for multiple detents. The bottom grabber is a vertical slider supporting Arrow keys and Home/End.",
        "拖拽指示条策略；automatic 在多档位时渲染。底部指示条是垂直 slider，支持方向键与 Home/End。",
        { defaultValue: '"automatic"' },
      ),
      row(
        "gestures",
        "{ resize?: boolean; expandUp?: boolean; collapseDown?: boolean }",
        "Toggles for the bottom drag gestures.",
        "底部拖拽手势开关。",
      ),
      row("size", '"sm" | "md" | "lg"', "Side panel width step.", "侧栏面板宽度档位。", {
        defaultValue: '"md"',
      }),
      row(
        "onDetentChange",
        "(index: number) => void",
        "Called with the target index after drag, click, or keyboard adjustment.",
        "拖拽、点击或键盘调档后以目标档位下标调用。",
      ),
    ],
  ),
  "empty-state": component(
    ["EmptyState", "EmptyStateIcon"],
    [row("title", "ReactNode", "Explains the current absence.", "说明当前为空的原因。")],
  ),
  error: component(
    ["Error"],
    [
      row("children", "ReactNode", "Inline error content.", "行内错误内容。"),
      row("label", "string | false", "Optional emphasized label; false hides it.", "可选的强调标签；false 时隐藏。"),
      row("size", '"small" | "default" | "large"', "Error text size.", "错误文字尺寸。", {
        defaultValue: '"default"',
      }),
      row("error", "{ message: string; action?: string; link?: string }", "Structured error with an optional external action.", "带可选外部操作的结构化错误。"),
    ],
    "ComponentProps<\"div\">",
  ),
  "error-boundary": component(
    ["ErrorBoundary"],
    [
      row("children", "ReactNode", "The render subtree protected by the boundary.", "由边界保护的渲染子树。", {
        required: true,
      }),
      row("fallback", "ReactNode", "Custom recovery UI rendered after a captured error.", "捕获错误后渲染的自定义恢复界面。"),
      row("resetKeys", "unknown[]", "Shallow-compared keys whose changes clear the captured error.", "浅比较的键；任一变化会清除已捕获错误。"),
      row(
        "onError",
        "(error: Error, info: React.ErrorInfo) => void",
        "Reports the captured render error and component stack.",
        "上报捕获的渲染错误与组件栈。",
      ),
      row("name", "string", "Boundary name used in logs and the built-in fallback.", "用于日志和内置恢复界面的边界名称。"),
      row("className", "string", "Class name applied to the built-in fallback only.", "仅应用于内置恢复界面的类名。"),
    ],
  ),
  feedback: component(
    ["Feedback", "RatingPill"],
    [
      row("value", "RatingValue", "RatingPill only: controlled rating.", "仅 RatingPill：受控评分。"),
      row("onValueChange", "(value: RatingValue) => void", "RatingPill only: reports each selection.", "仅 RatingPill：回报每次选择。"),
      row("label", "string", "Text shown by the default secondary trigger.", "默认次级触发按钮显示的文本。", {
        defaultValue: '"Feedback"',
      }),
      row("copy", "string", "Optional form copy; for Inline, replaces the capsule question.", "可选表单文案；在 Inline 中替换胶囊问题文本。"),
      row("dryRun", "boolean", "Demo mode: Send neither calls onSubmit nor closes the current surface.", "演示模式：Send 不调用 onSubmit，也不关闭当前界面。", {
        defaultValue: "false",
      }),
      row("type", '"inline"', "Uses the persistent rating capsule that expands in place.", "使用常显评分胶囊，并在同一容器内展开。"),
      row("showTopics", "boolean", "Shows the predefined product-topic selector.", "显示预定义的产品主题选择器。", {
        defaultValue: "false",
      }),
      row(
        "topics",
        "readonly string[]",
        "Explicit topic options; passing a non-empty array renders the selector without showTopics.",
        "显式主题选项；传入非空数组时无需 showTopics 也会渲染选择器。",
      ),
      row("topic", "string", "Controlled topic value; pair with onTopicChange.", "受控主题值；与 onTopicChange 配对使用。"),
      row("defaultTopic", "string", "Initial uncontrolled topic.", "非受控初始主题。"),
      row("onTopicChange", "(topic: string) => void", "Called when the topic selection changes.", "主题选择变化时调用。"),
      row(
        "includeTopicInMetadata",
        "boolean",
        "Also merges the selected topic into the third onSubmit argument as metadata.topic. Default is false so metadata stays exactly what the caller passed.",
        "额外把所选主题以 metadata.topic 合并进 onSubmit 第三个参数。默认 false，保证 metadata 与调用方传入内容完全一致。",
        { defaultValue: "false" },
      ),
      row("metadata", "Record<string, string>", "Context forwarded to onSubmit.", "透传给 onSubmit 的上下文。"),
      row("prefix", "ReactNode", "Content before the trigger or Inline question.", "触发器或 Inline 问题文本之前的内容。"),
      row("suffix", "ReactNode", "Content after the trigger or Inline question.", "触发器或 Inline 问题文本之后的内容。"),
      row(
        "defaultValue",
        "RatingValue",
        "Initial uncontrolled rating; all ratings use the same blue selected state.",
        "初始非受控评分；所有评分统一使用蓝色选中态。",
      ),
      row(
        "onSubmit",
        "(rating: FeedbackRatingValue | undefined, text: string, metadata?: Record<string, string>, topic?: string) => void",
        "Receives the rating, text, caller metadata, and the selected topic after a non-dry-run submission. The topic selector only renders in the default Popover variant.",
        "在非 dryRun 提交后接收评分、文本、调用方 metadata 与所选主题。主题选择器只在默认 Popover 变体中渲染。",
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
      "FieldsetFooterActions",
      "FieldsetFooterAction",
      "ErrorText",
      "WarningText",
      "DisabledWall",
    ],
    [
      row("type", "FieldsetType", "Visual tone for the card border and footer.", "卡片边框与页脚的配色样式。", {
        defaultValue: '"default"',
      }),
      row("title", "ReactNode", "Optional title rendered in FieldsetContent.", "在 FieldsetContent 中渲染的可选标题。"),
      row("subtitle", "ReactNode", "Optional subtitle rendered below the title.", "渲染在标题下方的可选副标题。"),
      row("disabled", "boolean", "Disables the FieldsetContent region with an interaction wall.", "通过交互遮罩禁用 FieldsetContent 内容区。", {
        defaultValue: "false",
      }),
      row("highlight", "boolean", "Applies the highlighted FieldsetFooter background.", "为 FieldsetFooter 应用高亮背景。", {
        defaultValue: "false",
      }),
    ],
  ),
  "file-tree": component(
    ["FileTree", "FileTreeItem", "FileTreeLabel", "FileTreeIcon"],
    [
      row("open", "boolean", "Controlled expansion state for FileTreeItem.", "FileTreeItem 的受控展开状态。"),
      row("defaultOpen", "boolean", "Initial expansion state for FileTreeItem.", "FileTreeItem 的初始展开状态。"),
      row(
        "onOpenChange",
        "(open: boolean) => void",
        "Receives FileTreeItem expansion changes.",
        "接收 FileTreeItem 展开状态变化。",
      ),
      row("href", "string", "Renders a leaf FileTreeItem as a link.", "将叶子 FileTreeItem 渲染为链接。"),
      row("type", '"file" | "folder" | "folder-open"', "FileTreeIcon glyph type.", "FileTreeIcon 图标类型。", { defaultValue: '"file"' }),
    ],
  ),
  gauge: component(
    ["Gauge"],
    [
      row("value", "number", "Current value.", "当前数值。", { required: true }),
      row("size", '"tiny" | "small" | "medium" | "large"', "Fixed gauge size preset.", "固定的仪表尺寸预设。", {
        defaultValue: '"medium"',
      }),
      row("showValue", "boolean", "Shows the numeric value in the center.", "在中心显示数值。", {
        defaultValue: "false",
      }),
      row("indeterminate", "boolean", "Shows a rotating indeterminate gauge.", "显示旋转的不定状态仪表。", {
        defaultValue: "false",
      }),
      row("colors", "GaugeColors", "Threshold colors or a primary/secondary pair.", "阈值色表或主色/次色组合。"),
      row("arcPriority", '"equal"', "Uses equal-priority primary and secondary arcs.", "使用同优先级的主弧与次弧。"),
    ],
  ),
  grid: component(
    ["Grid", "GridCell", "GridCross", "GridPage", "GridSystem"],
    [
      row("columns", "GridColumns", "Number of visible guide columns.", "可见参考列数量。"),
      row("rows", "GridRows", "Number of visible guide rows.", "可见参考行数量。"),
      row("height", "GridHeight", "Grid height or responsive aspect-ratio behavior.", "栅格高度或响应式宽高比行为。"),
      row("hideGuides", "GridHideGuides", "Hides row or column guides.", "隐藏行或列参考线。"),
      row("column", "GridCellPosition", "GridCell column placement.", "GridCell 的列位置。"),
      row("row", "GridCellPosition", "GridCell row placement.", "GridCell 的行位置。"),
      row("solid", "boolean", "Renders a solid GridCell surface.", "渲染实心 GridCell 表面。"),
      row("debug", "boolean", "Shows GridSystem debug guides.", "显示 GridSystem 调试参考线。"),
      row("dashedGuides", "boolean", "Uses dashed GridSystem guides.", "使用虚线 GridSystem 参考线。"),
      row("guideWidth", "number", "Sets the GridSystem guide width.", "设置 GridSystem 参考线宽度。"),
      row("unstable_useContainer", "boolean", "Enables the experimental container-query wrapper.", "启用实验性的容器查询包装器。"),
    ],
  ),
  input: component(
    ["Input"],
    [
      row(
        "size",
        '"small" | "default" | "large" | number',
        "Input height; a number is forwarded to the native size attribute.",
        "输入框高度；数字会透传给原生 size 属性。",
        { defaultValue: '"default"' },
      ),
      row("error", "ReactNode", "Validation message rendered below the field.", "字段下方渲染的校验消息。"),
      row("label", "ReactNode", "Visible label associated with the input.", "与输入框关联的可见标签。"),
      row("prefix", "ReactNode", "Leading input adornment.", "输入框前缀装饰内容。"),
      row("prefixStyling", "boolean", "Styles and separates the prefix.", "为前缀添加样式和分隔线。", {
        defaultValue: "true",
      }),
      row("suffix", "ReactNode", "Trailing input adornment.", "输入框后缀装饰内容。"),
      row("suffixStyling", "boolean", "Styles and separates the suffix.", "为后缀添加样式和分隔线。", {
        defaultValue: "true",
      }),
      row("rounded", "boolean", "Renders a pill-shaped input surface.", "渲染胶囊形输入框表面。"),
      row("layout", "ControlLayout", "Sets width, height, size limits, and flex. Numbers use pixels; strings accept CSS values.", "设置宽高、尺寸上下限和 flex。数字以像素为单位，字符串可使用 CSS 值。"),
    ],
    "InputHTMLAttributes<HTMLInputElement>",
  ),
  "json-view": component(
    ["JsonView", "makeJsonViewHighlightPattern"],
    [
      row("data", "unknown", "Data to render as a JSON tree.", "以 JSON 树展示的数据。", {
        required: true,
      }),
      row("defaultExpandDepth", "number", "Initial expansion depth; zero collapses the root.", "初始展开深度；0 会折叠根节点。"),
      row("highlightPattern", "RegExp | null", "Highlights matching keys and primitive values.", "高亮匹配的键与原始值。"),
    ],
  ),
  "keyboard-input": component(
    ["KeyboardInput", "Kbd"],
    [row("children", "ReactNode", "Shortcut keys and separators.", "快捷键按键和分隔符。")],
  ),
  label: component(
    ["Label"],
    [
      row("id", "string", "ID of the associated input control.", "关联输入控件的 ID。", { required: true }),
      row("value", "string", "Visible label text.", "可见标签文字。", { required: true }),
      row("bypassCasing", "boolean", "Disables automatic capitalization.", "禁用自动首字母大写。"),
    ],
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
  link: component(
    ["Link"],
    [
      row("href", "string", "Internal path, HTTP(S) URL, or gh:/github: shorthand.", "站内路径、HTTP(S) URL 或 gh:/github: 简写。"),
      row(
        "iconSide",
        '"left" | "right"',
        "Overrides icon placement; forge brands default left and generic external indicators default right.",
        "覆盖图标位置；代码托管平台品牌默认左置，普通外链指示符默认右置。",
      ),
      row("children", "ReactNode", "Visible link label.", "可见链接文案。", { required: true }),
    ],
    "ComponentProps<\"a\">",
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
      row("value", "string", "Text shortened through its middle.", "从中间缩短的文本。", {
        required: true,
      }),
    ],
  ),
  modal: component(
    [
      "Modal",
      "ModalTrigger",
      "ModalPortal",
      "ModalOverlay",
      "ModalContent",
      "ModalHeader",
      "ModalTitle",
      "ModalDescription",
      "ModalFooter",
      "ModalClose",
    ],
    [
      row("open", "boolean", "Controlled dialog state.", "受控对话框状态。"),
      row("defaultOpen", "boolean", "Initial uncontrolled state.", "非受控初始状态。"),
      row(
        "onOpenChange",
        "(open: boolean) => void",
        "Receives open state changes.",
        "接收打开状态变化。",
      ),
      row("showCloseButton", "boolean", "Shows the optional close button in ModalContent.", "在 ModalContent 中显示可选关闭按钮。", {
        defaultValue: "false",
      }),
      row("bodyClassName", "string", "Additional class name for the ModalContent body.", "ModalContent 内容区的额外类名。"),
      row(
        "placement",
        '"center" | "top"',
        'Center zooms in place; "top" pins the dialog to the viewport top edge and drops in from above (macOS sheet).',
        'center 原地缩放淡入；top 贴视口顶边并自顶部下落入场（macOS sheet 语义）。',
        { defaultValue: '"center"' },
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
      row("className", "string", "Additional classes for the root container.", "根容器的附加类名。"),
      row("layout", "ControlLayout", "Controls root width and flex behavior.", "控制根容器宽度和 flex 行为。"),
      row("name", "string", "Row label used for visible and accessible text.", "用于可见文本和无障碍文本的行标签。", {
        required: true,
      }),
      row("checked", "boolean", "Whether a row is selected.", "行是否被选中。", {
        required: true,
      }),
      row("onChange", "() => void", "Toggles the row selection.", "切换行选择状态。", {
        required: true,
      }),
      row("onSelectOnly", "() => void", "Selects only this row.", "仅选择当前行。", {
        required: true,
      }),
      row("onSelectAll", "() => void", "Selects all rows.", "选择所有行。", {
        required: true,
      }),
      row("count", "number", "Optional count displayed beside the row name.", "显示在行名称旁的可选计数。"),
    ],
  ),
  note: component(
    ["Note", "NoteContent", "NoteAction", "NoteLabel"],
    [
      row("variant", "NoteVariant", "Semantic note style.", "语义提示样式。", {
        defaultValue: '"default"',
      }),
      row("fill", "boolean", "Uses a soft filled background.", "使用柔和填充背景。", {
        defaultValue: "false",
      }),
      row("size", '"small" | "medium"', "Note size.", "提示尺寸。", {
        defaultValue: '"medium"',
      }),
      row("icon", "ReactNode | null", "Custom icon; null removes the icon.", "自定义图标；null 会移除图标。"),
      row("disabled", "boolean", "Disables actions inside the note.", "禁用提示内的操作。", {
        defaultValue: "false",
      }),
    ],
  ),
  pagination: component(
    ["Pagination", "NumberedPagination"],
    [
      row("NumberedPagination.totalPages", "number", "Total page count (required).", "总页数（必填）。", { required: true, origin: "extension" }),
      row("NumberedPagination.page", "number", "Controlled one-based current page.", "受控的从 1 起始的当前页。", { origin: "extension" }),
      row("NumberedPagination.defaultPage", "number", "Initial uncontrolled page.", "非受控模式的初始页。", { defaultValue: "1", origin: "extension" }),
      row("NumberedPagination.onPageChange", "(page: number) => void", "Reports page selection.", "报告选择的新页码。", { origin: "extension" }),
      row("NumberedPagination.siblingCount", "number", "Number of neighboring pages on each side (0–10).", "当前页两侧邻居页码的数量（0–10）。", { defaultValue: "1", origin: "extension" }),
      row("NumberedPagination.getPageHref", "(page: number) => string", "Renders real page links; otherwise uses buttons.", "提供真实页面链接；未提供时渲染按钮。", { origin: "extension" }),
      row("NumberedPagination.disabled", "boolean", "Disables every page control.", "禁用所有翻页控件。", { defaultValue: "false", origin: "extension" }),
      row("previous", "PaginationRailLink", "Previous-page title and destination.", "上一页标题与目标地址。"),
      row("next", "PaginationRailLink", "Next-page title and destination.", "下一页标题与目标地址。"),
      row("children", "ReactNode", "Optional centered pagination content on wide screens.", "宽屏时可选的居中分页内容。"),
    ],
    "ComponentProps<\"nav\">",
  ),
  device: {
    ...component(
      ["Device", "DeviceScreen"],
      [
        row("model", "DeviceModelId", "Registered device model.", "已注册的设备型号。", {
          required: true,
        }),
        row(
          "color",
          "DeviceColor<M>",
          "Body color supported by the selected model.",
          "所选型号支持的机身颜色。",
        ),
        row(
          "landscape",
          "boolean",
          "Rotates devices that support landscape.",
          "将支持横屏的设备旋转为横向。",
          {
            defaultValue: "false",
          },
        ),
        row(
          "dynamicIsland",
          'ChromeGate<M, "notch", boolean>',
          "Shows the notch treatment on supported models.",
          "在支持的型号上显示灵动岛装饰。",
          {
            defaultValue: "false",
          },
        ),
        row(
          "statusBar",
          'ChromeGate<M, "status-bar", boolean | PhoneStatusBarOptions>',
          "Shows or configures the decorative status bar on supported models.",
          "在支持的型号上显示或配置装饰性状态栏。",
          {
            defaultValue: "true",
          },
        ),
        row(
          "safari",
          'ChromeGate<M, "safari", boolean | PhoneSafariOptions>',
          "Shows or configures decorative Safari chrome on supported models.",
          "在支持的型号上显示或配置装饰性 Safari 外观。",
          {
            defaultValue: "false",
          },
        ),
        row(
          "autoFit",
          "boolean",
          "Shrinks the frame to fit narrow containers without enlarging it.",
          "缩小外框以适配窄容器，但不会放大。",
          {
            defaultValue: "true",
          },
        ),
        row(
          "zoom",
          "number",
          "Explicit scale that takes precedence over autoFit.",
          "优先于 autoFit 的显式缩放比例。",
        ),
        row(
          "animated",
          "boolean",
          "Enables the short frame transform transition unless reduced motion is requested.",
          "在未请求减少动效时启用短促的外框变换过渡。",
          {
            defaultValue: "false",
          },
        ),
        row(
          "frameClassName",
          "string",
          "Class name forwarded to the MockFrame root.",
          "透传给 MockFrame 根元素的类名。",
        ),
        row(
          "children",
          "ReactNode",
          "Screen content, normally wrapped in DeviceScreen.",
          "屏幕内容，通常包裹在 DeviceScreen 中。",
        ),
      ],
    ),
  },
  pill: component(["Pill"], [row("children", "ReactNode", "Pill label.", "胶囊标签。")]),
  progress: component(
    ["Progress"],
    [
      row(
        "value",
        "number | null",
        "Known progress value; null or omission renders indeterminate progress.",
        "已知进度数值；传 null 或省略时渲染不定进度。",
      ),
    ],
  ),
  "project-banner": component(
    ["ProjectBanner", "ProjectBannerContent", "ProjectBannerClose"],
    [
      row(
        "variant",
        "ProjectBannerVariant",
        "Banner emphasis.",
        '横幅强调样式，决定整条横幅 bg/border/text 三件套：success=blue、warning=amber、error=red；default 视觉即 gray（routine 项目级通知），"gray" 为等价别名。官方按设计不可关闭，ProjectBannerClose 为本地扩展。',
      ),
    ],
  ),
  radio: component(
    ["Radio", "RadioGroup", "RadioGroupItem", "useRadio"],
    [
      row("value", "string", "Controlled selected value.", "受控选择值。"),
      row("onChange", "(value: string) => void", "Receives a new group selection.", "接收单选组的新选择。"),
    ],
  ),
  "relative-time-card": component(
    ["RelativeTimeCard"],
    [
      row(
        "date",
        "number",
        "Unix timestamp in milliseconds to format relative to now.",
        "相对当前时间格式化的 Unix 毫秒时间戳。",
        { required: true },
      ),
      row("side", '"top" | "right" | "bottom" | "left"', "Preferred hover-card side.", "悬浮卡片的优先方位。", { defaultValue: '"top"' }),
      row("locale", "string", "BCP 47 locale for relative and absolute time.", "相对与绝对时间使用的 BCP 47 语言标签。"),
    ],
  ),
  scroller: component(
    ["Scroller"],
    [
      row("overflow", '"x" | "y" | "both"', "Scrollable axes.", "滚动轴。", {
        defaultValue: '"x"',
      }),
      row("height", "number | string", "Scroller height.", "滚动容器高度。", { defaultValue: '"100%"' }),
      row("width", "number | string", "Scroller width.", "滚动容器宽度。", { defaultValue: '"100%"' }),
      row("withButtons", "boolean", "Shows direct-child navigation buttons.", "显示按直接子元素导航的按钮。", { defaultValue: "false" }),
      row("childrenContainerClassName", "string", "Class name for the scrolling children container.", "滚动子元素容器的类名。"),
    ],
  ),
  "search-input": component(
    ["SearchInput"],
    [
      row("value", "string", "Controlled query.", "受控搜索词。"),
      row(
        "onChange",
        "React.ChangeEventHandler<HTMLInputElement>",
        "Receives native input change events.",
        "接收原生输入变更事件。",
      ),
      row("cmdk", "boolean", "Shows the Command-K hint while empty.", "空值时显示 Command-K 提示。"),
      row("loading", "boolean", "Replaces the search icon with a spinner.", "用加载器替换搜索图标。"),
      row("prefix", "ReactNode", "Custom leading content.", "自定义前置内容。"),
    ],
  ),
  select: component(
    ["Select", "SelectItem", "SelectGroup", "SelectSeparator"],
    [
      row("value", "string", "Controlled selected value.", "受控选择值。"),
      row("defaultValue", "string", "Initial uncontrolled selected value.", "非受控的初始选择值。"),
      row(
        "onValueChange",
        "(value: string) => void",
        "Receives selection changes.",
        "接收选择变化。",
      ),
      row("placeholder", "string", "Text displayed when no value is selected.", "未选择值时显示的文本。"),
      row(
        "size",
        '"small" | "default" | "large"',
        "Select trigger height and typography.",
        "选择触发器的高度和排版。",
        { defaultValue: '"default"' },
      ),
      row("label", "ReactNode", "Visible label that names the trigger.", "为触发器命名的可见标签。"),
      row("aria-label", "string", "Accessible name forwarded to the trigger.", "透传给触发器的无障碍名称。"),
      row(
        "aria-labelledby",
        "string",
        "IDs of external elements that name the trigger.",
        "为触发器命名的外部元素 ID。",
      ),
      row("error", "ReactNode", "Validation message rendered below the field.", "字段下方渲染的校验消息。"),
      row("prefix", "ReactNode", "Leading trigger adornment.", "触发器前缀装饰内容。"),
      row("suffix", "ReactNode", "Trailing trigger adornment that replaces the chevron.", "替代下拉箭头的触发器后缀装饰内容。"),
      row("layout", "ControlLayout", "Sets width, height, size limits, and flex. Numbers use pixels; strings accept CSS values.", "设置宽高、尺寸上下限和 flex。数字以像素为单位，字符串可使用 CSS 值。"),
    ],
    "React.ComponentProps<typeof SelectPrimitive.Root>",
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
      row(
        "length",
        '"full" | "short"',
        "Length scale: full spans the available length, short renders a 40px stub for dense lists.",
        "长度档位：full 占满可用长度，short 是 40px 短线（密集列表的分组提示）。",
        { defaultValue: '"full"' },
      ),
    ],
  ),
  sheet: component(
    [
      "Sheet",
      "SheetTrigger",
      "SheetContent",
      "SheetHeader",
      "SheetTitle",
      "SheetDescription",
      "SheetFooter",
      "SheetClose",
    ],
    [
      row("open", "boolean", "Controlled sheet state.", "受控面板状态。"),
      row(
        "modal",
        "boolean",
        "Whether the sheet blocks outside interaction.",
        "是否阻止外部交互。",
        { defaultValue: "false" },
      ),
      row("side", "SheetSide", "Edge from which SheetContent enters.", "SheetContent 进入的屏幕边缘。", {
        defaultValue: '"right"',
      }),
      row("noOverlay", "boolean", "Omits the SheetContent backdrop.", "不渲染 SheetContent 遮罩层。", {
        defaultValue: "false",
      }),
    ],
  ),
  "show-more": component(
    ["ShowMore"],
    [
      row("expanded", "boolean", "Controlled expanded state reflected by the label and arrow.", "由文案和箭头反映的受控展开状态。", { defaultValue: "false" }),
      row("noBorder", "boolean", "Removes the trigger border.", "移除触发器边框。"),
      row("onClick", "MouseEventHandler<HTMLButtonElement>", "Handles expansion requests.", "处理展开请求。"),
    ],
    "ButtonHTMLAttributes<HTMLButtonElement>",
  ),
  skeleton: component(
    // SkeletonMask 是同一文档页上的框架扩展：它的语义完全建立在 Skeleton 的
    // children 契约之上，因此 API 参考与 Skeleton 合并展示，不单独占一个组件页。
    ["Skeleton", "SkeletonMask"],
    [
      row(
        "children",
        "ReactNode",
        "Optional layout-matching placeholder content (Skeleton); the real interface, kept as a box while masked (SkeletonMask).",
        "可选的匹配布局占位内容（Skeleton）；遮罩期间保留盒子的真实界面（SkeletonMask）。",
      ),
      row(
        "skeleton",
        "ReactNode",
        "SkeletonMask only: skeleton template for the masked state. Always mounted so the swap keeps one box.",
        "仅 SkeletonMask：遮罩态的骨架模板。始终挂载，保证切换前后盒子一致。",
        { origin: "extension" },
      ),
      row(
        "masked",
        "boolean",
        "SkeletonMask only: controlled masked state; the component never flips it on its own.",
        "仅 SkeletonMask：受控遮罩态；组件不会自行翻转。",
        { origin: "extension" },
      ),
      row(
        "defaultMasked",
        "boolean",
        "SkeletonMask only: initial masked state for uncontrolled use.",
        "仅 SkeletonMask：非受控初始遮罩态。",
        { origin: "extension", defaultValue: "false" },
      ),
      row(
        "onMaskedChange",
        "(masked: boolean) => void",
        "SkeletonMask only: uncontrolled masked-state callback; there is no internal trigger while masked is unset.",
        "仅 SkeletonMask：非受控遮罩态回调；masked 未传时没有内部触发源。",
        { origin: "extension" },
      ),
      row(
        "label",
        "string",
        "SkeletonMask only: accessible name announced while the region is masked.",
        "仅 SkeletonMask：遮罩期间播报的无障碍名称。",
        { origin: "extension" },
      ),
      row(
        "liveRegion",
        "boolean",
        "SkeletonMask only: announces completion through aria-live=\"polite\". Enable only for the region the load result belongs to.",
        "仅 SkeletonMask：经 aria-live=\"polite\" 宣告完成。仅在该区域是本次加载结果时开启。",
        { origin: "extension", defaultValue: "false" },
      ),
      row(
        "overlay",
        "ReactNode",
        "SkeletonMask only: replaces skeleton as the masked overlay when a bespoke layer is needed.",
        "仅 SkeletonMask：需要自定义遮罩层时替代 skeleton。",
        { origin: "extension" },
      ),
    ],
  ),
  slider: component(
    ["Slider"],
    [
      row("value", "number[]", "Controlled value.", "受控值。"),
      row(
        "onValueChange",
        "(value: number[]) => void",
        "Called for every value change from dragging, keyboard input, or the numeric inputs.",
        "拖拽、键盘或数值输入导致的值变化都会调用。",
      ),
      row(
        "marks",
        "boolean | Array<{ value: number; label?: string }>",
        "Tick marks: `true` generates one per step (max 50), or an explicit array.",
        "刻度：`true` 按 step 自动生成（上限 50），或传入显式数组。",
        { origin: "extension" },
      ),
      row(
        "markLabelFormat",
        "(value: number) => string",
        "Formats labels for marks without an explicit label.",
        "为未显式提供 label 的刻度格式化标签。",
        { origin: "extension" },
      ),
      row(
        "onValueCommit",
        "(value: number[]) => void",
        "Canonical callback after a committed change.",
        "确认变更后的标准回调。",
      ),
    ],
  ),
  snippet: component(
    ["Snippet"],
    [
      row("text", "string | string[]", "Text available for copying; arrays render multiple lines.", "可复制的文本；数组会渲染为多行。", { required: true }),
      row("width", "number | string", "Snippet width; numbers are pixels.", "代码片段宽度；数字按像素处理。"),
      row("dark", "boolean", "Uses the inverted surface.", "使用反色表面。"),
      row("prompt", "boolean", "Shows the shell prompt without copying it.", "显示但不复制 shell 提示符。", { defaultValue: "true" }),
      row("onCopy", "() => void", "Called after copying succeeds.", "复制成功后调用。"),
      row("type", "SnippetType", "Semantic text color.", "语义文字颜色。", { defaultValue: '"default"' }),
      row("copied", "boolean", "Controlled copied state.", "受控的已复制状态。"),
      row("copyText", "string", "Overrides the clipboard payload.", "覆盖剪贴板内容。"),
    ],
  ),
  spinner: component(
    ["Spinner"],
    [
      row("size", '"sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"', "Spinner size preset.", "加载器尺寸预设。", { defaultValue: '"md"' }),
      row("iconProps", "ComponentProps<typeof Loader2>", "SVG-specific icon overrides.", "SVG 图标专用覆盖属性。"),
      row("aria-hidden", "boolean | \"true\" | \"false\"", "Hides status semantics when another element already announces loading.", "已有其他元素播报加载状态时隐藏 status 语义。"),
    ],
  ),
  "split-button": component(
    ["SplitButton", "SplitButtonMenuItem"],
    [
      row("buttonProps", "ButtonProps", "Props for the primary action button.", "主操作按钮属性。"),
      row("menuButtonLabel", "string", "Accessible label for the menu trigger.", "菜单触发器的无障碍标签。", {
        defaultValue: '"More options"',
      }),
      row(
        "menuButtonDisabled",
        "boolean",
        "Disables the menu trigger only (the primary action stays enabled).",
        "仅禁用菜单触发按钮（主操作保持可用）。",
        { defaultValue: "false" },
      ),
      row("menuAlignment", "SplitButtonMenuAlignment", "Places the menu below the primary or menu button edge.", "将菜单对齐到主按钮或菜单按钮边缘。", {
        defaultValue: '"bottom-start"',
      }),
      row("variant", "SplitButtonVariant", "\"split\" renders a button plus menu list; \"pulldown\" renders a floating card that expands from a corner.", "split 渲染按钮加菜单列表；pulldown 渲染从指定角展开的悬浮卡片。", {
        defaultValue: '"split"',
      }),
      row("expandCorner", "SplitButtonExpandCorner", "Corner the pulldown card stays anchored to; the card expands toward the opposite corner. top-* expands downward with the card below the button; bottom-* expands upward with the card above it.", "pulldown 卡片锚定的角；卡片朝对角方向展开。top-* 向下展开（卡片在按钮下方），bottom-* 向上展开（卡片在按钮上方）。", {
        defaultValue: '"top-left"',
      }),
      row("menuItems", "ReactNode", "Secondary menu items.", "次级菜单项。"),
      row("menuProps", "ComponentProps<typeof Menu>", "Props forwarded to the menu surface.", "透传给菜单表面的属性。"),
      row("title", "ReactNode", "Menu item title.", "菜单项标题。"),
      row("description", "ReactNode", "Menu item description.", "菜单项描述。"),
      row("icon", "ReactNode", "Menu item icon.", "菜单项图标。"),
      row("menuItemProps", "Omit<ComponentProps<typeof MenuItem>, \"children\" | \"prefix\" | \"suffix\">", "Props forwarded to a menu item.", "透传给菜单项的属性。"),
    ],
  ),
  "status-dot": component(
    ["StatusDot"],
    [
      row("state", "StatusDotState", "Status represented by the dot.", "圆点表示的状态。", {
        defaultValue: '"QUEUED"',
      }),
      row("label", "boolean", "Shows the localized status label beside the dot.", "在圆点旁显示本地化状态标签。", {
        defaultValue: "false",
      }),
      row("titlePrefix", "string", "Overrides the subject used in the native title.", "覆盖原生 title 使用的主语。"),
    ],
  ),
  "step-point": component(
    ["StepPoint"],
    [
      row("status", "StepStatus", "Step state.", "步骤状态。", { required: true }),
      row("children", "ReactNode", "Step label.", "步骤标签。", { required: true }),
    ],
  ),
  switch: component(
    ["Switch", "SwitchControl"],
    [
      row(
        "name",
        "string",
        "Form field name (required so the control participates in form submission).",
        "表单字段名（必填，使控件参与表单提交）。",
      ),
      row("value", "string", "Controlled selected option.", "受控选择项。"),
      row("onValueChange", "(value: string) => void", "Receives a new selection.", "接收新选择。"),
    ],
  ),
  table: component(
    [
      "TableRoot",
      "Table",
      "TableColgroup",
      "TableCol",
      "TableHeader",
      "TableBody",
      "TableFooter",
      "TableRow",
      "TableHead",
      "TableCell",
      "TableCaption",
    ],
    [
      row("align", "MaybeAlign", "Default horizontal and vertical cell alignment.", "默认的单元格水平和垂直对齐。"),
      row("rowHeight", 'number | "auto"', "Fixed row height in pixels or content-driven height.", "固定像素行高或内容自适应行高。", {
        defaultValue: '"auto"',
      }),
      row("colWidth", '"auto" | "fit"', "Keeps responsive columns or measures and locks column widths once.", "保持响应式列宽，或测量后一次性锁定列宽。", {
        defaultValue: '"auto"',
      }),
      row("colorScheme", "TableColorScheme", "Basic, striped, bordered, or interactive row treatment.", "基础、斑马纹、行间分隔线或可交互行样式。"),
      row("frame", '"outline" | "none"', "Controls the TableRoot outline while keeping content clipped to its rounded corners.", "控制 TableRoot 外框；超出圆角范围的内容仍会被裁切。", {
        defaultValue: '"outline"',
      }),
      row("columnDividers", "boolean", "Adds logical inline-start dividers after the first cell in each row.", "为每行第二个及后续单元格添加逻辑 inline-start 列分隔线。", {
        defaultValue: "false",
      }),
      row("headerRow", "boolean", "Adds column-header scope semantics to the header row.", "为表头行添加列头 scope 语义。", {
        defaultValue: "false",
      }),
      row("headerCol", "boolean", "Renders the first body column as row headers.", "将正文首列渲染为行头。", {
        defaultValue: "false",
      }),
    ],
  ),
  tabs: component(
    ["Tabs"],
    [
      row("selected", "string", "Controlled selected tab.", "受控选中的标签。"),
      row("setSelected", "(value: string) => void", "Receives tab selection.", "接收标签选择。"),
    ],
  ),
  "sidebar-nav": component(
    ["SidebarNav"],
    [
      row("groups", "SidebarNavGroup[]", "Navigation groups and their links.", "导航分组和链接。", { required: true }),
      row("activeTo", "string", "Path of the active item.", "当前活动条目的路径。"),
      row("onNavigate", "(to: string) => void", "Intercepts unmodified link activation; modified clicks retain native navigation.", "拦截无修饰键的链接激活；修饰键点击仍走原生导航。"),
      row("side", '"left" | "right"', "Places the divider on the right-side variant.", "右侧形态增加左分隔线。", { defaultValue: '"left"' }),
      row("collapsible", "boolean", "Allows group headings to toggle their contents.", "允许分组标题切换展开状态。", { defaultValue: "false" }),
      row("persistKey", "string", "Persists collapsed groups in localStorage when provided.", "提供时将折叠状态保存在 localStorage。"),
    ],
  ),
  navbar: component(
    ["Navbar"],
    [
      row("scrollBehavior", '"static" | "pinned" | "auto-hide"', "Header positioning and scroll behavior.", "顶栏定位与滚动行为。", { defaultValue: '"pinned"' }),
      row("variant", '"solid" | "transparent"', "Initial surface treatment.", "初始表面样式。", { defaultValue: '"solid"' }),
      row("solidOnScroll", "boolean", "Fills a transparent header after scrolling down.", "向下滚动后为透明顶栏补底色。", { defaultValue: "false" }),
      row("height", "string | number", "CSS height class or numeric inline height; defaults to h-16.", "CSS 高度类名或内联数字高度；默认 h-16。", { defaultValue: '"h-16"' }),
      row("children", "ReactNode", "Header content arranged by the caller.", "由调用方编排的顶栏内容。"),
    ],
  ),
  footer: component(
    ["Footer"],
    [
      row("columns", "FooterColumn[]", "Titled link columns.", "带标题的链接列。"),
      row("slotLeading", "ReactNode", "Content before the link columns.", "链接列之前的内容。"),
      row("slotTrailing", "ReactNode", "Content after the link columns.", "链接列之后的内容。"),
      row("sticky", "boolean", "Pins the footer to the bottom of the viewport.", "将页脚固定到视口底部。", { defaultValue: "false" }),
    ],
  ),
  "hamburger-menu": component(
    ["HamburgerMenu"],
    [
      row("anchor", '"topbar" | "sidebar"', "Chooses the trigger context; both anchors open downward by default.", "选择触发场景和默认展开方向。", { required: true }),
      row("anchorElement", "HTMLElement | null", "Element used to position the panel below a topbar.", "用于将面板定位到顶栏下方的元素。"),
      row("container", "HTMLElement | null", "Optional positioned container for the panel and backdrop; defaults to the viewport.", "面板与遮罩的可选定位容器；默认相对视口。"),
      row("direction", '"down" | "left" | "right"', "Expansion direction; topbar defaults to down.", "展开方向；顶栏默认为 down。"),
      row("items", "MenuItem[]", "Flat navigation and search source.", "扁平导航与搜索数据源。"),
      row("groups", "MenuGroup[]", "Grouped navigation and search source.", "分组导航与搜索数据源。"),
      row("loading", "boolean", "Shows a loading status and marks navigation as busy while data loads.", "数据加载时显示加载状态并标记导航区域忙碌。", { defaultValue: "false" }),
      row("emptyMessage", "ReactNode", "Optional message for an empty navigation or no search results.", "空导航或搜索无结果时的自定义文案。"),
      row("activeTo", "string", "Current route for aria-current and highlighting.", "用于 aria-current 与高亮的当前路径。"),
      row("onNavigate", "(to: string) => void", "Called when a navigation item is selected.", "选择导航条目时调用。"),
      row("open", "boolean", "Controlled open state.", "受控打开状态。"),
      row("onOpenChange", "(open: boolean) => void", "Reports open-state changes.", "回报打开状态变化。"),
      row("disableSearch", "boolean", "Hides the built-in search field.", "隐藏内建搜索框。"),
      row("searchMode", '"query" | "toolbar"', "Search by query or input focus.", "按输入内容或焦点进入搜索。", { defaultValue: '"query"' }),
    ],
  ),
  "side-panel": component(
    ["SidePanel", "SidePanelTitle", "SidePanelDescription", "SidePanelClose"],
    [
      row("show", "boolean", "Controlled open state.", "受控打开状态。"),
      row("onDismiss", "() => void", "Called after Escape, outside press, or a close action; caller updates show.", "按 Escape、外点或关闭按钮后调用；由调用方更新 show。"),
      row("side", '"right" | "left"', "Panel docking edge.", "面板停靠方向。", { defaultValue: '"right"' }),
      row("noOverlay", "boolean", "Omits the backdrop and switches to non-modal behavior.", "省略遮罩并切为非模态行为。", { defaultValue: "false" }),
      row("children", "ReactNode", "Panel content, including a title and an explicit close control.", "面板内容，包括标题及显式关闭控件。", { required: true }),
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
    [
      row("size", "TextareaSize", "Textarea size.", "文本域尺寸。", {
        defaultValue: '"medium"',
      }),
      row("error", "ReactNode", "Inline validation message and error styling.", "行内校验消息和错误样式。"),
      row("label", "ReactNode", "Visible label wrapping the textarea surface.", "包裹文本域表面的可见标签。"),
      row("layout", "ControlLayout", "Controls root width and surface height constraints.", "控制根容器宽度和表面高度约束。"),
    ],
    "TextareaHTMLAttributes<HTMLTextAreaElement>",
  ),
  toast: component(
    ["Toasts", "useToasts", "createToastStore"],
    [
      row(
        "message",
        "(options: ToastOptions) => number",
        "Creates a message toast and returns its numeric ID.",
        "创建消息 Toast 并返回数字 ID。",
      ),
      row("success", "(text: ReactNode) => number", "Creates a success toast.", "创建成功 Toast。"),
      row("warning", "(text: ReactNode) => number", "Creates a warning toast.", "创建警告 Toast。"),
      row("error", "(text: ReactNode) => number", "Creates an error toast.", "创建错误 Toast。"),
      row("dismiss", "(id: number) => void", "Dismisses a toast by ID.", "按 ID 关闭 Toast。"),
      row(
        "store",
        "ToastStore",
        "Binds the viewport to an injected store (defaults to the global store).",
        "把视口绑定到注入的 store（默认全局 store）。",
      ),
      row(
        "createToastStore",
        "() => ToastStore",
        "Creates an isolated toast store so toast state can be driven externally.",
        "创建独立 toast store，使 toast 状态可由外部驱动。",
      ),
    ],
  ),
  toggle: component(
    ["Toggle"],
    [
      row("checked", "boolean", "Controlled on/off state.", "受控开关状态。"),
      row("onChange", "() => void", "Receives state changes.", "接收状态变化。"),
    ],
  ),
  tooltip: component(
    ["Tooltip"],
    [
      row("children", "ReactNode", "Tooltip trigger.", "提示触发器。", { required: true }),
      row("text", "ReactNode", "Supplemental explanation.", "补充说明。", { required: true }),
      row("position", '"top" | "bottom" | "left" | "right"', "Preferred placement.", "优先放置方向。", { defaultValue: '"top"' }),
      row("boxAlign", '"left" | "center" | "right"', "Tooltip alignment.", "提示框对齐方式。", { defaultValue: '"center"' }),
      row("delay", "boolean | number", "Whether to delay opening or a custom delay in milliseconds.", "是否延迟打开，或自定义毫秒延迟。", { defaultValue: "true" }),
      row("tip", "boolean", "Shows the arrow tip.", "显示箭头。", { defaultValue: "true" }),
      row("center", "boolean", "Centers tooltip text.", "居中提示文字。", { defaultValue: "true" }),
      row("type", "TooltipType", "Semantic tooltip color.", "语义提示颜色。", { defaultValue: '"default"' }),
    ],
  ),
  "theme-switcher": component(
    ["ThemeSwitcher"],
    [
      row("className", "string", "Additional classes for the radiogroup.", "主题单选组的附加类名。"),
      row("compact", "boolean", "Uses compact theme option buttons.", "使用紧凑的主题选项按钮。", {
        defaultValue: "false",
      }),
      row("disabled", "boolean", "Disables every theme option.", "禁用所有主题选项。", {
        defaultValue: "false",
      }),
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
      row("value", "string | null", "Controlled selected value.", "受控选择值。"),
      row("defaultValue", "string", "Initial uncontrolled selected value.", "非受控选择的初始值。", {
        defaultValue: '""',
      }),
      row(
        "onValueChange",
        "(value: string) => void",
        "Receives selection changes.",
        "接收选择变化。",
      ),
      row("open", "boolean", "Controlled open state (uncontrolled when omitted).", "受控打开状态（不传则非受控）。"),
      row("onOpenChange", "(open: boolean) => void", "Open-state change callback.", "开关回调。"),
      row("placeholder", "string", "Placeholder and fallback search prompt.", "占位文字和默认搜索提示。"),
      row("aria-label", "string", "Accessible name for the search input.", "搜索输入框的无障碍名称。"),
      row("label", "string", "Visible field label.", "可见字段标签。"),
      row("disabled", "boolean", "Disables the combobox.", "禁用组合框。", {
        defaultValue: "false",
      }),
      row("size", '"small" | "medium" | "large"', "Input surface size.", "输入表面尺寸。", {
        defaultValue: '"medium"',
      }),
      row("errored", "boolean", "Uses error colors for the input surface.", "为输入表面使用错误颜色。", {
        defaultValue: "false",
      }),
      row("clearable", "boolean", "Shows a clear button for a selected value.", "为已选值显示清除按钮。", {
        defaultValue: "false",
      }),
      row("width", "number", "Legacy root width in pixels.", "兼容保留的根容器像素宽度。"),
      row("layout", "ControlLayout", "Controls root and input surface dimensions.", "控制根容器和输入表面尺寸。"),
      row("maxWidth", "number", "Minimum panel width beyond the trigger width.", "超出触发器宽度时的面板最小宽度。"),
      row("emptyMessage", "string", "Message shown when filtering has no results.", "筛选无结果时显示的消息。"),
      row("prefix", "ReactNode", "Option leading content.", "选项前置内容。"),
      row("suffix", "ReactNode", "Option trailing content.", "选项后置内容。"),
      row("ignoreDefaultHeight", "boolean", "Lets an option grow to fit multiline content.", "允许选项按多行内容自适应高度。"),
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
  "bottom-sheet": component(
    ["BottomSheet"],
    [
      row("container", "HTMLElement | null", "Optional positioned container for the sheet and backdrop; detents use its height instead of viewport height.", "面板与遮罩的可选定位容器；提供时档位按容器高度计算。"),
      row(
        "detents",
        "number[]",
        "Height detents as viewport-height fractions; sheets with fewer than two detents hide the grabber (HIG automatic).",
        "高度档位（占视口高度比例）；档位少于 2 个时不渲染指示条（HIG automatic）。",
        { defaultValue: "[0.5, 1]" },
      ),
      row(
        "showIndicator",
        '"automatic" | boolean',
        "Grabber visibility strategy; automatic renders it only for multiple detents. The grabber is a vertical slider supporting Arrow keys and Home/End.",
        "拖拽指示条显隐策略；automatic 仅在多档位时渲染。指示条是垂直 slider，支持方向键与 Home/End。",
        { defaultValue: '"automatic"' },
      ),
      row(
        "gestures",
        "{ resize?: boolean; expandUp?: boolean; collapseDown?: boolean }",
        "Per-gesture toggles: drag-to-resize, expand past the top detent, collapse when dragged below the lowest detent.",
        "手势开关：拖拽调高 / 上拉越过最高档 / 低于最低档下拉关闭。",
        { defaultValue: "全开" },
      ),
      row(
        "open",
        "boolean",
        "Controlled open state (uncontrolled when omitted).",
        "受控打开状态（不传则非受控）。",
      ),
      row("onOpenChange", "(open: boolean) => void", "Open-state change callback.", "开关回调。"),
      row(
        "detent",
        "number",
        "Controlled detent index into `detents` (uncontrolled when omitted).",
        "受控档位下标（对应 detents 数组；不传则非受控）。",
      ),
      row(
        "onDetentChange",
        "(index: number) => void",
        "Called with the target detent index after drag, click, or keyboard adjustment. In controlled mode the caller must feed the value back through detent.",
        "拖拽、点击或键盘调档后以目标档位下标调用；受控模式须由调用方通过 detent 更新。",
      ),
      row(
        "aria-label",
        "string",
        "Accessible name for the panel when no visible heading exists.",
        "无可见标题时提供面板的无障碍名称。",
      ),
      row(
        "aria-labelledby",
        "string",
        "Names the panel from an external element, such as a heading rendered by the content layer.",
        "关联外部元素命名面板（如内容层渲染的标题所带的 id）。",
      ),
    ],
  ),
  "sub-frame": component(
    ["SubFrame"],
    [
      row(
        "children",
        "React.ReactNode",
        "Content rendered inside the frame; nested overlays attach to it.",
        "框架内渲染的内容；内部浮层会挂载到它上面。",
      ),
      row(
        "clip",
        "boolean",
        "Clips overlays that would otherwise escape the frame. Turn it off when an overlay must overflow.",
        "裁剪会溢出框架的浮层；浮层需要溢出时关闭。",
        { defaultValue: "true" },
      ),
    ],
    "React.HTMLAttributes<HTMLDivElement>",
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
