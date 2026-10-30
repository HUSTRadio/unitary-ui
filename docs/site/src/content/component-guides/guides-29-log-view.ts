import type { ComponentGuide } from "../component-guide-schema";

const LOG_VIEW_ZH: ComponentGuide = {
  slug: "log-view",
  locale: "zh-CN",
  summary:
    "展示调用方传入的日志：按级别过滤、复制与导出，并在用户上滚前持续跟随最新一行。",
  whenToUse: [
    "构建、部署或任务输出需要逐行查看，并希望按级别快速收窄。",
    "需要把当前可见日志复制走或导出成文本文件交给别人。",
    "日志总量可控（数百行级），首版不做虚拟化。",
  ],
  whenNotToUse: [
    "结构化事件、可排序可筛选的表格用 DataTable。",
    "单个任务的进度与状态用 Task；构建状态徽标用 StatusDot。",
    "需要虚拟滚动的十万行级日志，等待后续专项。",
  ],
  examples: [
    {
      id: "log-view-follow",
      kind: "stateful",
      title: "跟随与暂停",
      description:
        "追加日志时自动贴底；手动上滚后暂停跟随并出现「跳到最新」，过滤按最低级别生效。",
      demoKey: "follow",
      showDescriptionInDemo: true,
    },
  ],
  accessibility: {
    status: "not-applicable",
    reason:
      "本轮不含无障碍增强：LogView 不声明日志区域的 ARIA 角色与 aria-live 播报，按级别过滤与跟随状态以可见控件与 data-* 表达，播报策略由调用方决定。",
  },
  controlledBehavior: {
    status: "covered",
    content: [
      "entries 完全受控：组件不排序、不合并、不追加，也不发起请求。",
      "level 支持受控与非受控：传 level 时以它为准并通过 onLevelChange 报告；不传时用 defaultLevel 与内部状态。",
      "复制与导出都在可见行上执行；提供 onExport 时由调用方接手文本，否则下载文本文件。",
      "跟随由滚动位置推导：贴底即跟随，上滚即暂停，点击「跳到最新」恢复。",
    ],
  },
  responsiveBehavior: {
    status: "covered",
    content: [
      "头部标题与操作区使用 flex-wrap，窄屏下操作换行而不挤压标题。",
      "滚动视口高度固定（默认 320px，可传数字或 CSS 长度），行内容在视口内滚动。",
      "消息列使用 whitespace-pre-wrap + break-words：长行换行而非截断，也保留原始缩进。",
    ],
  },
  themeBehavior: {
    status: "covered",
    content: [
      "视口使用 background-200 与 gray-alpha-300 边线，级别颜色复用 text-gray-1000 / gray-700 / button-warning / error-foreground 语义色。",
      "级别筛选按钮的激活态用 gray-alpha-300，深浅色主题自动跟随，不新增颜色 token。",
    ],
  },
};

const LOG_VIEW_EN: ComponentGuide = {
  slug: "log-view",
  locale: "en-US",
  summary:
    "Render caller-owned log entries with severity filtering, copy and export, and follow the newest line until the reader scrolls up.",
  whenToUse: [
    "Build, deploy or task output needs line-by-line reading with quick severity narrowing.",
    "The visible log should be copyable or exportable as a text file.",
    "The entry count is bounded (hundreds of lines); the first version does not virtualise.",
  ],
  whenNotToUse: [
    "Structured events that need sorting or column filtering belong to DataTable.",
    "Single-task progress and status belong to Task; build badges belong to StatusDot.",
    "Hundreds of thousands of lines that need virtual scrolling wait for a dedicated effort.",
  ],
  examples: [
    {
      id: "log-view-follow",
      kind: "stateful",
      title: "Follow and pause",
      description:
        "Appending sticks to the bottom; scrolling up pauses following and reveals Jump to latest, while filtering keeps the minimum severity.",
      demoKey: "follow",
      showDescriptionInDemo: true,
    },
  ],
  accessibility: {
    status: "not-applicable",
    reason:
      "Accessibility work is out of scope this round: LogView declares no ARIA role or aria-live region for the log surface, and expresses filtering and follow state through visible controls and data attributes. Announcement strategy stays with the caller.",
  },
  controlledBehavior: {
    status: "covered",
    content: [
      "entries are fully controlled: the component never sorts, merges, appends or fetches.",
      "level supports both modes: passing level makes it authoritative and reports changes through onLevelChange; omitting it uses defaultLevel plus internal state.",
      "Copy and export act on the visible rows; pass onExport to take the text, otherwise a text file downloads.",
      "Following is derived from the scroll position: at the bottom it follows, scrolling up pauses it, and Jump to latest restores it.",
    ],
  },
  responsiveBehavior: {
    status: "covered",
    content: [
      "The header wraps with flex-wrap, so actions move to a new line instead of squeezing the title.",
      "The scroll viewport keeps a fixed height (320px by default, or any CSS length).",
      "The message column uses whitespace-pre-wrap with break-words: long lines wrap instead of truncating and keep their indentation.",
    ],
  },
  themeBehavior: {
    status: "covered",
    content: [
      "The viewport uses background-200 with a gray-alpha-300 edge, and levels reuse text-gray-1000, gray-700, button-warning and error-foreground semantic colors.",
      "Active filter buttons use gray-alpha-300, so both themes follow without new color tokens.",
    ],
  },
};

export const LOG_VIEW_GUIDES_ZH: Record<string, ComponentGuide> = { "log-view": LOG_VIEW_ZH };
export const LOG_VIEW_GUIDES_EN: Record<string, ComponentGuide> = { "log-view": LOG_VIEW_EN };
