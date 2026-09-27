import type {
  ComponentGuide,
  ComponentGuideRegistry,
  GuideLocale,
} from "../component-guide-schema";

/**
 * 图表分组（Tremor Raw 内置）双语组件指南。
 * demoKey 对应 examples/registry.ts 中登记的 demo id。
 */
export const CHARTS_GUIDES: Partial<ComponentGuideRegistry> = {
  "area-chart": {
    "zh-CN": {
      slug: "area-chart",
      locale: "zh-CN",
      summary: "面积图用分层填充表达时间趋势的构成，支持堆叠与百分比模式、渐变/纯色填充与自定义提示。",
      whenToUse: [
        "展示一个或多个序列随时间的趋势，且希望填充增强量感。",
        "需要表达总量（stacked）或份额（percent）而非单序列数值。",
      ],
      whenNotToUse: [
        "只需要干净的走势对比——用 LineChart。",
        "跨类目比较——用 BarChart。",
      ],
      examples: [
        { id: "area-chart-default", kind: "minimal", title: "默认面积图", description: "双系列渐变填充，valueFormatter 统一货币格式。" },
        { id: "area-chart-stacked", kind: "variant", title: "堆叠面积", description: "type=\"stacked\" 表达渠道构成的总访问量。" },
        { id: "area-chart-custom-tooltip", kind: "advanced", title: "自定义提示", description: "customTooltip 汇总两系列为合计卡片。" },
        { id: "area-chart-chart-card", kind: "advanced", title: "图表卡模式", description: "卡片头部承载标题与区间筛选，图表用 customTooltip 输出合计卡片。", demoKey: "chart-card" },
      ],
      accessibility: { status: "covered", content: ["数值经由 tooltip 与 valueFormatter 提供，不单靠颜色承载语义。", "图表容器保留语义化容器类名，可被读屏跳过或标注 aria-label。"] },
      controlledBehavior: { status: "not-applicable", reason: "图表为展示型组件，内部状态仅用于交互高亮，不提供受控值。" },
      responsiveBehavior: { status: "covered", content: ["宽度随 ResponsiveContainer 自适应父容器；示例容器需显式高度（默认 h-80）。"] },
      themeBehavior: { status: "covered", content: ["坐标轴、网格与提示卡片使用语义 token，明暗主题自动适配；系列色为固定 9 色调色板。"] },
    },
    "en-US": {
      slug: "area-chart",
      locale: "en-US",
      summary: "The area chart expresses trend composition over time with layered fills, including stacked and percent modes, gradient or solid fills, and custom tooltips.",
      whenToUse: [
        "Showing one or more series over time where the fill reinforces magnitude.",
        "Communicating totals (stacked) or shares (percent) instead of single-series values.",
      ],
      whenNotToUse: [
        "Clean trend comparison only — use LineChart.",
        "Comparing across categories — use BarChart.",
      ],
      examples: [
        { id: "area-chart-default", kind: "minimal", title: "Default area", description: "Two gradient-filled series with a shared currency formatter." },
        { id: "area-chart-stacked", kind: "variant", title: "Stacked areas", description: "type=\"stacked\" shows channel composition of total visits." },
        { id: "area-chart-custom-tooltip", kind: "advanced", title: "Custom tooltip", description: "customTooltip aggregates both series into a total card." },
        { id: "area-chart-chart-card", kind: "advanced", title: "Chart card pattern", description: "The card header carries the title and range filter while the chart renders a total card via customTooltip.", demoKey: "chart-card" },
      ],
      accessibility: { status: "covered", content: ["Values flow through the tooltip and valueFormatter, so color never carries meaning alone.", "The chart container keeps semantic class names and can be labeled with aria-label."] },
      controlledBehavior: { status: "not-applicable", reason: "Display-only component; internal state exists solely for interaction highlighting." },
      responsiveBehavior: { status: "covered", content: ["Width adapts to the parent via ResponsiveContainer; example containers need an explicit height (default h-80)."] },
      themeBehavior: { status: "covered", content: ["Axes, grid, and tooltip card use semantic tokens for automatic light/dark adaptation; series colors come from the fixed 9-color palette."] },
    },
  },
  "bar-chart": {
    "zh-CN": {
      slug: "bar-chart",
      locale: "zh-CN",
      summary: "柱状图用于跨类目比较，支持堆叠、百分比与垂直布局，柱体可点击并与图例联动。",
      whenToUse: ["跨类目比较离散数值。", "表达份额（percent）或构成（stacked）。", "类目标签较长时使用垂直布局。"],
      whenNotToUse: ["连续时间趋势——用面积图或折线图。", "占比只有两三段且空间紧张——用 CategoryBar。"],
      examples: [
        { id: "bar-chart-default", kind: "minimal", title: "默认柱状图", description: "分组双系列，valueFormatter 输出货币。" },
        { id: "bar-chart-stacked", kind: "variant", title: "堆叠柱状", description: "type=\"stacked\" 表达平台构成。" },
        { id: "bar-chart-vertical", kind: "variant", title: "垂直布局", description: "layout=\"vertical\" 适配长类目标签。" },
      ],
      accessibility: { status: "covered", content: ["图例与 tooltip 提供数值；颜色仅用于区分系列。", "柱体与图例均可键盘访问。" ] },
      controlledBehavior: { status: "not-applicable", reason: "展示型组件；onValueChange 仅回报交互选择，不提供受控值。" },
      responsiveBehavior: { status: "covered", content: ["宽度自适应；类目过多时建议减少类目或开启 startEndOnly。"] },
      themeBehavior: { status: "covered", content: ["网格、坐标轴与提示卡片走语义 token，明暗主题自动适配。"] },
    },
    "en-US": {
      slug: "bar-chart",
      locale: "en-US",
      summary: "The bar chart compares values across categories, with stacked, percent, and vertical layouts; bars are clickable and linked to the legend.",
      whenToUse: ["Comparing discrete values across categories.", "Showing share (percent) or composition (stacked).", "Using the vertical layout when category labels are long."],
      whenNotToUse: ["Continuous time trends — use area or line charts.", "Two or three share segments in tight space — use CategoryBar."],
      examples: [
        { id: "bar-chart-default", kind: "minimal", title: "Default bars", description: "Grouped two-series chart with a currency formatter." },
        { id: "bar-chart-stacked", kind: "variant", title: "Stacked bars", description: "type=\"stacked\" shows platform composition." },
        { id: "bar-chart-vertical", kind: "variant", title: "Vertical layout", description: "layout=\"vertical\" fits long category labels." },
      ],
      accessibility: { status: "covered", content: ["Legend and tooltip carry the values; color only distinguishes series.", "Bars and legend items are keyboard accessible."] },
      controlledBehavior: { status: "not-applicable", reason: "Display-only component; onValueChange reports interaction selection only." },
      responsiveBehavior: { status: "covered", content: ["Width adapts to the container; reduce categories or enable startEndOnly when crowded."] },
      themeBehavior: { status: "covered", content: ["Grid, axes, and tooltip card use semantic tokens for both themes."] },
    },
  },
  "line-chart": {
    "zh-CN": {
      slug: "line-chart",
      locale: "zh-CN",
      summary: "折线图渲染连续趋势的干净线条，支持坐标轴标题、首尾刻度与自定义提示。",
      whenToUse: ["连续趋势且不希望面积填充带来量感干扰。", "需要标注坐标轴语义（xAxisLabel / yAxisLabel）。"],
      whenNotToUse: ["强调构成或总量——用面积图。", "类目比较——用柱状图。"],
      examples: [
        { id: "line-chart-default", kind: "minimal", title: "默认折线", description: "双指标趋势带坐标轴标题。" },
        { id: "line-chart-custom-tooltip", kind: "advanced", title: "自定义提示", description: "customTooltip 输出自定义样式的数值卡。" },
      ],
      accessibility: { status: "covered", content: ["数值由 tooltip 与格式化器提供，颜色不单独承载语义。"] },
      controlledBehavior: { status: "not-applicable", reason: "展示型组件。" },
      responsiveBehavior: { status: "covered", content: ["宽度自适应父容器；容器需显式高度。"] },
      themeBehavior: { status: "covered", content: ["坐标轴、网格与提示卡片使用语义 token。"] },
    },
    "en-US": {
      slug: "line-chart",
      locale: "en-US",
      summary: "The line chart renders clean continuous trends with optional axis titles, first/last ticks, and custom tooltips.",
      whenToUse: ["Continuous trends where area fills would add visual noise.", "Annotating axis semantics via xAxisLabel / yAxisLabel."],
      whenNotToUse: ["Emphasizing composition or totals — use the area chart.", "Category comparison — use the bar chart."],
      examples: [
        { id: "line-chart-default", kind: "minimal", title: "Default lines", description: "Two-metric trend with axis titles." },
        { id: "line-chart-custom-tooltip", kind: "advanced", title: "Custom tooltip", description: "customTooltip renders a custom value card." },
      ],
      accessibility: { status: "covered", content: ["Values flow through the tooltip and formatter; color never carries meaning alone."] },
      controlledBehavior: { status: "not-applicable", reason: "Display-only component." },
      responsiveBehavior: { status: "covered", content: ["Width adapts to the parent; the container needs an explicit height."] },
      themeBehavior: { status: "covered", content: ["Axes, grid, and tooltip card use semantic tokens."] },
    },
  },
  "combo-chart": {
    "zh-CN": {
      slug: "combo-chart",
      locale: "zh-CN",
      summary: "组合图在同一类目轴上组合柱与折线系列，可选双轴以适配不可比的数值范围。",
      whenToUse: ["两个相关指标共享同一类目轴（如收入与利润率）。", "两系列数值范围不可比时开启 enableBiaxial。"],
      whenNotToUse: ["指标多于两条主线——拆成多图或用图卡组合。", "只需要单一图表形态——直接用 BarChart / LineChart。"],
      examples: [
        { id: "combo-chart-default", kind: "minimal", title: "默认组合", description: "柱（收入）+ 线（成本）共轴。" },
        { id: "combo-chart-biaxial", kind: "variant", title: "双轴", description: "enableBiaxial 让金额与百分比共存。" },
      ],
      accessibility: { status: "covered", content: ["图例形状区分柱与线；数值经 tooltip 提供。"] },
      controlledBehavior: { status: "not-applicable", reason: "展示型组件。" },
      responsiveBehavior: { status: "covered", content: ["宽度自适应；双轴时右轴标签占位，注意窄屏留白。" ] },
      themeBehavior: { status: "covered", content: ["网格、轴与提示卡片走语义 token。"] },
    },
    "en-US": {
      slug: "combo-chart",
      locale: "en-US",
      summary: "The combo chart combines bar and line series on one category axis, optionally on two axes for incompatible value ranges.",
      whenToUse: ["Two related metrics sharing a category axis (e.g. revenue and margin).", "Enabling enableBiaxial when the series ranges are incomparable."],
      whenNotToUse: ["More than two main metrics — split into multiple charts or chart cards.", "A single shape suffices — use BarChart / LineChart directly."],
      examples: [
        { id: "combo-chart-default", kind: "minimal", title: "Default combo", description: "Bars (revenue) plus a line (costs) on a shared axis." },
        { id: "combo-chart-biaxial", kind: "variant", title: "Biaxial", description: "enableBiaxial puts currency and percent side by side." },
      ],
      accessibility: { status: "covered", content: ["Legend shapes distinguish bars from lines; values flow through the tooltip."] },
      controlledBehavior: { status: "not-applicable", reason: "Display-only component." },
      responsiveBehavior: { status: "covered", content: ["Width adapts; with biaxial mode the right axis reserves space on narrow screens."] },
      themeBehavior: { status: "covered", content: ["Grid, axes, and tooltip card use semantic tokens."] },
    },
  },
  "donut-chart": {
    "zh-CN": {
      slug: "donut-chart",
      locale: "zh-CN",
      summary: "环形图表达部分占整体，中心可放置主指标；variant=\"pie\" 可退化为饼形。",
      whenToUse: ["占比结构 ≤5 段。", "中心主指标无需悬停即可读。"],
      whenNotToUse: ["精确数值比较——柱状图或条形列表更易读。", "扇区很多——合并为「其他」或改用 BarList。"],
      examples: [
        { id: "donut-chart-default", kind: "minimal", title: "默认环形", description: "四城访客占比带中心合计。" },
        { id: "donut-chart-pie", kind: "variant", title: "饼形", description: "variant=\"pie\" 去除中心留白。" },
      ],
      accessibility: { status: "covered", content: ["扇区与图例均可交互，tooltip 提供精确值。"] },
      controlledBehavior: { status: "not-applicable", reason: "展示型组件。" },
      responsiveBehavior: { status: "covered", content: ["固定 h-40 w-40 方形容器，横向排列时注意留白。"] },
      themeBehavior: { status: "covered", content: ["提示卡片与图例走语义 token；扇区色为固定调色板。"] },
    },
    "en-US": {
      slug: "donut-chart",
      locale: "en-US",
      summary: "The donut chart shows parts of a whole with an optional center metric; variant=\"pie\" yields a full pie.",
      whenToUse: ["Share-of-total structures with five or fewer slices.", "A center metric readable without hovering."],
      whenNotToUse: ["Precise value comparison — bars or a bar list read faster.", "Many slices — bucket into \"Other\" or switch to BarList."],
      examples: [
        { id: "donut-chart-default", kind: "minimal", title: "Default donut", description: "Four-city visitor share with a center total." },
        { id: "donut-chart-pie", kind: "variant", title: "Pie", description: "variant=\"pie\" removes the center hole." },
      ],
      accessibility: { status: "covered", content: ["Slices and legend are interactive; the tooltip provides exact values."] },
      controlledBehavior: { status: "not-applicable", reason: "Display-only component." },
      responsiveBehavior: { status: "covered", content: ["Fixed h-40 w-40 square container; mind spacing in horizontal layouts."] },
      themeBehavior: { status: "covered", content: ["Tooltip card and legend follow semantic tokens; slice colors come from the fixed palette."] },
    },
  },
  "spark-chart": {
    "zh-CN": {
      slug: "spark-chart",
      locale: "zh-CN",
      summary: "迷你趋势图（SparkAreaChart / SparkLineChart / SparkBarChart）以内联小图传达走势，适合卡片与表格单元格。",
      whenToUse: ["在紧凑空间传达单一序列的走势方向。", "与显式数值配对使用（数值负责精确，小图负责形状）。"],
      whenNotToUse: ["需要坐标轴、图例或 tooltip 的完整图表场景。", "多系列对比。"],
      examples: [
        { id: "spark-chart-default", kind: "minimal", title: "三种迷你图", description: "面积、折线、柱形三列并排展示。" },
        { id: "spark-chart-kpi-card", kind: "advanced", title: "KPI 统计卡模式", description: "指标大字号 + 趋势微图 + 涨跌标注，第三张卡用环形微图表达占比。", demoKey: "kpi-card" },
      ],
      accessibility: { status: "covered", content: ["迷你图不承载精确数值，须搭配文本数值；可用 aria-label 标注趋势摘要。"] },
      controlledBehavior: { status: "not-applicable", reason: "展示型组件。" },
      responsiveBehavior: { status: "covered", content: ["宽度自适应父容器，高度固定紧凑。"] },
      themeBehavior: { status: "covered", content: ["颜色沿用图表调色板，容器无底色依赖。"] },
    },
    "en-US": {
      slug: "spark-chart",
      locale: "en-US",
      summary: "Spark charts (SparkAreaChart / SparkLineChart / SparkBarChart) convey trends as inline mini charts for cards and table cells.",
      whenToUse: ["Conveying a single series' direction in compact space.", "Pairing with an explicit number (number for precision, spark for shape)."],
      whenNotToUse: ["Full chart contexts needing axes, legends, or tooltips.", "Multi-series comparison."],
      examples: [
        { id: "spark-chart-default", kind: "minimal", title: "Three spark kinds", description: "Area, line, and bar sparks side by side." },
        { id: "spark-chart-kpi-card", kind: "advanced", title: "KPI card pattern", description: "Large metric, trend spark, and delta marker, with a donut micro-chart for share in the third card.", demoKey: "kpi-card" },
      ],
      accessibility: { status: "covered", content: ["Sparks never carry exact values; pair them with text and optionally aria-label trend summaries."] },
      controlledBehavior: { status: "not-applicable", reason: "Display-only component." },
      responsiveBehavior: { status: "covered", content: ["Width adapts to the parent with a fixed compact height."] },
      themeBehavior: { status: "covered", content: ["Colors reuse the chart palette; containers carry no background dependency."] },
    },
  },
  "category-bar": {
    "zh-CN": {
      slug: "category-bar",
      locale: "zh-CN",
      summary: "分类条用分段横条紧凑表达占比结构，可带刻度标记与悬停提示。",
      whenToUse: ["占比上下文需要紧凑呈现（如卡片内）。", "需要标记目标线或阈值（marker）。"],
      whenNotToUse: ["精确数值或排名——用 BarList。", "扇区语义或中心指标——用环形图。"],
      examples: [
        { id: "category-bar-default", kind: "minimal", title: "默认分类条", description: "三段占比加目标标记。" },
      ],
      accessibility: { status: "covered", content: ["累计标签提供数值锚点；marker 带悬停提示。"] },
      controlledBehavior: { status: "not-applicable", reason: "纯展示组件。" },
      responsiveBehavior: { status: "covered", content: ["宽度自适应父容器。"] },
      themeBehavior: { status: "covered", content: ["分段色为调色板色；标签文字用语义 token。"] },
    },
    "en-US": {
      slug: "category-bar",
      locale: "en-US",
      summary: "The category bar renders share-of-total structure as a segmented horizontal bar, with an optional marker and hover tooltip.",
      whenToUse: ["Compact share-of-total context (e.g. inside cards).", "Marking a target or threshold via marker."],
      whenNotToUse: ["Exact values or rankings — use BarList.", "Slice semantics or a center metric — use the donut chart."],
      examples: [
        { id: "category-bar-default", kind: "minimal", title: "Default category bar", description: "Three segments plus a target marker." },
      ],
      accessibility: { status: "covered", content: ["Cumulative labels anchor the values; the marker exposes a hover tooltip."] },
      controlledBehavior: { status: "not-applicable", reason: "Static display component." },
      responsiveBehavior: { status: "covered", content: ["Width adapts to the parent container."] },
      themeBehavior: { status: "covered", content: ["Segments use palette colors; label text uses semantic tokens."] },
    },
  },
  "bar-list": {
    "zh-CN": {
      slug: "bar-list",
      locale: "zh-CN",
      summary: "条形列表按值排序渲染名称、等比条形与数值，行可带链接与图标。",
      whenToUse: ["需要行上下文（名称 + 数值 + 链接）的排名比较。", "页面流量、来源榜等榜单场景。"],
      whenNotToUse: ["占比结构——用环形图或分类条。", "连续趋势——用迷你趋势图。"],
      examples: [
        { id: "bar-list-default", kind: "minimal", title: "默认条形列表", description: "页面访问量排行，数值格式化输出。" },
      ],
      accessibility: { status: "covered", content: ["名称与数值均为文本，读屏可读；颜色仅装饰。"] },
      controlledBehavior: { status: "not-applicable", reason: "纯展示组件。" },
      responsiveBehavior: { status: "covered", content: ["宽度自适应；名称过长自动截断省略。"] },
      themeBehavior: { status: "covered", content: ["文本与条形底色走语义 token。"] },
    },
    "en-US": {
      slug: "bar-list",
      locale: "en-US",
      summary: "The bar list renders ranked names with proportional bars and values; rows may carry links and icons.",
      whenToUse: ["Ranked comparisons that benefit from row context (name + value + link).", "Leaderboards such as page traffic or sources."],
      whenNotToUse: ["Share-of-total structure — use the donut chart or category bar.", "Continuous trends — use a spark chart."],
      examples: [
        { id: "bar-list-default", kind: "minimal", title: "Default bar list", description: "Page-visit ranking with formatted values." },
      ],
      accessibility: { status: "covered", content: ["Names and values are plain text; color is decorative only."] },
      controlledBehavior: { status: "not-applicable", reason: "Static display component." },
      responsiveBehavior: { status: "covered", content: ["Width adapts; long names truncate with an ellipsis."] },
      themeBehavior: { status: "covered", content: ["Text and bar track colors follow semantic tokens."] },
    },
  },
  tracker: {
    "zh-CN": {
      slug: "tracker",
      locale: "zh-CN",
      summary: "跟踪条以状态块序列呈现离散事件历史（可用性、CI 运行），每块带悬停提示。",
      whenToUse: ["离散事件历史（uptime、构建结果）。", "需要紧凑的时间线状态概览。"],
      whenNotToUse: ["连续指标——用面积图或折线图。", "需要精确数值标签——用表格。"],
      examples: [
        { id: "tracker-default", kind: "minimal", title: "默认跟踪条", description: "29 天状态块序列。" },
      ],
      accessibility: { status: "covered", content: ["每块颜色必须搭配 tooltip 文本，避免仅靠颜色传达语义。"] },
      controlledBehavior: { status: "not-applicable", reason: "纯展示组件。" },
      responsiveBehavior: { status: "covered", content: ["块数量与容器宽度相称，超长横向滚动。"] },
      themeBehavior: { status: "covered", content: ["状态色沿用功能色 token；空槽使用低对比色。"] },
    },
    "en-US": {
      slug: "tracker",
      locale: "en-US",
      summary: "The tracker renders discrete event history (uptime, CI runs) as a sequence of status blocks with hover tooltips.",
      whenToUse: ["Discrete event histories (uptime, build outcomes).", "A compact timeline status overview."],
      whenNotToUse: ["Continuous metrics — use area or line charts.", "Exact value labels — use a table."],
      examples: [
        { id: "tracker-default", kind: "minimal", title: "Default tracker", description: "A 29-day sequence of status blocks." },
      ],
      accessibility: { status: "covered", content: ["Every block color must be paired with tooltip text; color never carries meaning alone."] },
      controlledBehavior: { status: "not-applicable", reason: "Static display component." },
      responsiveBehavior: { status: "covered", content: ["Block count should match container width; long histories scroll horizontally."] },
      themeBehavior: { status: "covered", content: ["Status colors reuse functional tokens; empty slots use low-contrast tones."] },
    },
  },
  "progress-circle": {
    "zh-CN": {
      slug: "progress-circle",
      locale: "zh-CN",
      summary: "进度环以圆形比例表达单一指标（完成度、容量），中心可放置数值与说明。",
      whenToUse: ["单一比例指标的醒目表达。", "中心数值 + 副标签的组合场景。"],
      whenNotToUse: ["表盘式仪表读数——用 Gauge。", "多段占比——用分类条或环形图。"],
      examples: [
        { id: "progress-circle-default", kind: "minimal", title: "默认进度环", description: "带宽宽使用率与中心百分比。" },
      ],
      accessibility: { status: "covered", content: ["具体数值作为 children 渲染为文本，不依赖颜色读数。"] },
      controlledBehavior: { status: "not-applicable", reason: "纯展示组件，进度由 value/max props 决定。" },
      responsiveBehavior: { status: "covered", content: ["尺寸由 radius 与 strokeWidth 决定，配合布局容器使用。"] },
      themeBehavior: { status: "covered", content: ["轨道使用低对比 token，进度色可从调色板选择。"] },
    },
    "en-US": {
      slug: "progress-circle",
      locale: "en-US",
      summary: "The progress circle expresses a single ratio (completion, capacity) as a ring with an optional center metric.",
      whenToUse: ["A prominent single-ratio metric.", "Center value plus sub-label compositions."],
      whenNotToUse: ["Dial-style gauge readings — use Gauge.", "Multi-segment shares — use the category bar or donut chart."],
      examples: [
        { id: "progress-circle-default", kind: "minimal", title: "Default progress circle", description: "Bandwidth usage with a center percentage." },
      ],
      accessibility: { status: "covered", content: ["The concrete value renders as text children, so reading never depends on color."] },
      controlledBehavior: { status: "not-applicable", reason: "Static display component; progress derives from value/max props." },
      responsiveBehavior: { status: "covered", content: ["Sizing comes from radius and strokeWidth; pair with layout containers."] },
      themeBehavior: { status: "covered", content: ["The track uses low-contrast tokens; the progress color comes from the palette."] },
    },
  },
};

/**
 * 与其他 guides-XX 一致的 ZH / EN 扁平记录（由上方双语结构派生）。
 * CHARTS_GUIDES 声明为 Partial，因此需要跳过未登记的条目。
 */
function flattenChartsGuides(locale: GuideLocale): Record<string, ComponentGuide> {
  const flattened: Record<string, ComponentGuide> = {};
  for (const [slug, pair] of Object.entries(CHARTS_GUIDES)) {
    if (pair) {
      flattened[slug] = pair[locale];
    }
  }
  return flattened;
}

export const CHARTS_GUIDES_ZH: Record<string, ComponentGuide> = flattenChartsGuides("zh-CN");

export const CHARTS_GUIDES_EN: Record<string, ComponentGuide> = flattenChartsGuides("en-US");
