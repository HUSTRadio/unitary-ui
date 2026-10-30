import type { ComponentGuide } from "../component-guide-schema";

const TASK_ZH: ComponentGuide = {
  slug: "task",
  locale: "zh-CN",
  summary:
    "展示长时间运行的任务：显式状态、进度、当前阶段，以及仅在合适状态下出现的取消与重试操作。",
  whenToUse: [
    "导入、同步、构建等会持续数秒以上的操作，需要让用户看到当前进展与阶段。",
    "需要在失败或部分完成后提供一次明确的重试入口。",
    "状态由调用方或 `taskReducer` 推导，界面只负责呈现时。",
  ],
  whenNotToUse: [
    "瞬时请求用按钮的 `loading` 状态即可，不需要整块任务区域。",
    "只有一个 0–100 的读数、没有阶段与操作时用 Progress Circle。",
    "构建与部署语义（QUEUED / BUILDING / READY）属于 StatusDot，不要用 Task 表达。",
  ],
  examples: [
    {
      id: "task-progress",
      kind: "stateful",
      title: "进度、阶段与操作",
      description:
        "用 taskReducer 推进进度；取消只在 running 出现，重试只在 failed/partial 出现。",
      demoKey: "progress",
      showDescriptionInDemo: true,
    },
  ],
  accessibility: {
    status: "not-applicable",
    reason:
      "本轮不含无障碍增强：Task 通过可见文案与 data-status 表达状态，进度不声明 ARIA 角色；播报策略由调用方决定。",
  },
  controlledBehavior: {
    status: "covered",
    content: [
      "完全受控：status、progress、stage 全部由调用方传入，组件不持有状态、不设定时器、不发请求。",
      "取消与重试只调用 onCancel / onRetry，真正的中止或重排由调用方执行。",
      "仅在 running 时渲染取消，仅在 failed / partial 时渲染重试；状态与可用操作始终一致。",
    ],
  },
  responsiveBehavior: {
    status: "covered",
    content: [
      "根容器使用 w-full min-w-0，宽度跟随外层布局，不会撑破栅格。",
      "操作按钮通过 flex-wrap 在窄屏换行，不挤压进度条。",
      "进度条按容器宽度伸缩，percentage 只影响填充宽度，不改变高度。",
    ],
  },
  themeBehavior: {
    status: "covered",
    content: [
      "进度轨道用 gray-alpha-300、填充用 primary、标题与说明用 gray-1000 / gray-700，深浅色主题自动跟随。",
      "宽度过渡使用 --uni-motion-state 与 ease-snap，减少动态效果时由 motion-reduce 关闭。",
    ],
  },
};

const TASK_EN: ComponentGuide = {
  slug: "task",
  locale: "en-US",
  summary:
    "Show long-running work with an explicit status, progress, current stage and cancel or retry actions that only appear in the states that allow them.",
  whenToUse: [
    "Imports, syncs or builds that take more than a moment and need visible progress and stage.",
    "A failed or partially completed run should offer one clear retry entry point.",
    "The status comes from the caller or taskReducer and the UI only presents it.",
  ],
  whenNotToUse: [
    "A one-shot request is covered by a button's loading state; it does not need a full task block.",
    "A single 0–100 reading with no stage or actions belongs to Progress Circle.",
    "Build and deploy semantics (QUEUED / BUILDING / READY) belong to StatusDot, not Task.",
  ],
  examples: [
    {
      id: "task-progress",
      kind: "stateful",
      title: "Progress, stage and actions",
      description:
        "taskReducer advances the progress; cancel appears only while running and retry only after failed or partial.",
      demoKey: "progress",
      showDescriptionInDemo: true,
    },
  ],
  accessibility: {
    status: "not-applicable",
    reason:
      "Accessibility work is out of scope this round: Task expresses state through visible copy and data-status, and the progress bar declares no ARIA role. Announcement strategy stays with the caller.",
  },
  controlledBehavior: {
    status: "covered",
    content: [
      "Fully controlled: status, progress and stage come from the caller; the component holds no state, timers or requests.",
      "Cancel and retry only call onCancel and onRetry; aborting or requeueing stays with the caller.",
      "Cancel renders only while running and retry only for failed or partial, so the offered action always matches the state.",
    ],
  },
  responsiveBehavior: {
    status: "covered",
    content: [
      "The root uses w-full min-w-0, so width follows the surrounding layout instead of overflowing grids.",
      "Actions wrap through flex-wrap on narrow widths without squeezing the progress bar.",
      "The bar stretches with its container; the percentage only changes the fill width, never the track height.",
    ],
  },
  themeBehavior: {
    status: "covered",
    content: [
      "The track uses gray-alpha-300, the fill uses primary, and title and description use gray-1000 and gray-700, so both themes follow automatically.",
      "The width transition uses --uni-motion-state with ease-snap and is disabled under motion-reduce.",
    ],
  },
};

export const TASK_GUIDES_ZH: Record<string, ComponentGuide> = { task: TASK_ZH };
export const TASK_GUIDES_EN: Record<string, ComponentGuide> = { task: TASK_EN };
