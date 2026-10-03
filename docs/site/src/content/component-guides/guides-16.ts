import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_16_ZH: Record<string, ComponentGuide> = {
  "bottom-sheet": {
    slug: "bottom-sheet",
    locale: "zh-CN",
    summary:
      "从视口底部展示移动端辅助内容，并在多个高度档位之间拖拽吸附；支持受控与非受控开关状态。",
    whenToUse: [
      "移动端需要在不离开当前页面的前提下展示相关操作、筛选项或辅助详情。",
      "内容需要在少量明确高度档位之间展开，且用户可以通过拖拽调整可见范围。",
    ],
    whenNotToUse: [
      "需要阻断式确认或完整桌面表单时使用 Modal；Bottom Sheet 是移动端的上下文辅助层。",
      "仅需从侧边进入、且不依赖垂直高度档位时使用 Sheet。",
    ],
    examples: [
      {
        id: "bottom-sheet-default",
        kind: "stateful",
        title: "受控多档弹层",
        description: "使用 open、onOpenChange 与 detents 管理弹层，并在内容区提供明确的关闭操作。",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "组件基于 Radix Dialog，打开后由对话框原语管理焦点范围，并支持 Escape 与遮罩点击关闭。",
        "内容开头应提供清晰的可见标题和说明，主要操作不能只依赖拖拽手势。",
        "多档位指示条使用垂直 slider 语义：ArrowUp / ArrowRight 增一档，ArrowDown / ArrowLeft 减一档，Home / End 跳到首尾；边界钳制而不循环。Enter / Space 与点击保持循环切档。",
        "prefers-reduced-motion: reduce 下会移除高度与进出场过渡。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "传入 open 时由外部完全控制开关状态；省略 open 时组件内部管理状态，两种模式都会调用 onOpenChange。",
        "松开拖拽、点击循环或键盘调档都会以目标下标调用 onDetentChange；detent 受控时必须由调用方更新，非受控时组件同步更新高度。向下拖过最低档会按 collapseDown 配置决定是否关闭。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "默认贴合移动视口底边，用 detent × 100dvh 计算高度；传入已定位的 container 时面板与遮罩限定在容器内，档位按容器高度计算。桌面宽屏流程应改用 Modal 或 Sheet。",
        "底部内边距包含 safe-area-inset-bottom，避免操作被设备安全区遮挡。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "面板使用背景与边框主题变量，遮罩保持半透明黑色；亮暗主题下无需传入单独配色。",
      ],
    },
  },
  "error-boundary": {
    slug: "error-boundary",
    locale: "zh-CN",
    summary:
      "捕获 React 子树在渲染期抛出的错误，保留页面其余区域，并以内置或自定义恢复界面替换失败区域。",
    whenToUse: [
      "路由、页面分区或复杂组件崩溃时，不应连带卸载整个应用。",
      "需要通过 onError 上报渲染错误，并在路由或数据标识变化后自动重试失败子树。",
    ],
    whenNotToUse: [
      "事件处理器、异步回调或服务端渲染错误不会被 React 错误边界捕获，应在对应执行路径单独处理。",
      "普通请求失败或字段校验错误应渲染 Error、Error Card 或行内反馈，不应通过抛出渲染异常表达。",
    ],
    examples: [
      {
        id: "error-boundary-default",
        kind: "stateful",
        title: "隔离渲染失败",
        description: "主动触发一个子树渲染错误，并通过自定义 fallback 重置示例。",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "内置恢复界面使用 role=alert；自定义 fallback 也应说明失败区域和下一步操作，并在需要即时播报时提供等价 alert 语义。",
        "重试按钮必须保持明确的动作与目标，例如“重新加载部署预览”，不要使用含糊的“确定”。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "resetKeys 使用浅比较；数组长度或任一项变化时清除已捕获错误并重新渲染 children。",
        "自定义 fallback 是静态 ReactNode；如需在 fallback 内重置外部状态，应由调用方提供带处理函数的节点或通过 key 重新挂载边界。",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason: "错误隔离行为与视口无关；fallback 的响应式布局由调用方负责。",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "内置 fallback 使用最小内联样式以避免依赖业务主题；自定义 fallback 应使用当前应用的语义色与排版 token。",
      ],
    },
  },
};

export const GUIDES_16_EN: Record<string, ComponentGuide> = {
  "bottom-sheet": {
    slug: "bottom-sheet",
    locale: "en-US",
    summary:
      "Presents supporting mobile content from the bottom of the viewport and snaps between draggable height detents in controlled or uncontrolled mode.",
    whenToUse: [
      "For related mobile actions, filters, or supporting details that should preserve the current page context.",
      "When content needs to expand between a small set of meaningful height detents through direct dragging.",
    ],
    whenNotToUse: [
      "Use Modal for a blocking confirmation or full desktop form; Bottom Sheet is a contextual mobile layer.",
      "Use Sheet for an edge panel that does not depend on vertical height detents.",
    ],
    examples: [
      {
        id: "bottom-sheet-default",
        kind: "stateful",
        title: "Controlled multi-detent sheet",
        description:
          "Owns the sheet through open, onOpenChange, and detents while keeping an explicit close action in the content.",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The component uses Radix Dialog, whose primitives constrain focus while open and support Escape and backdrop dismissal.",
        "Begin the content with a clear visible heading and description, and never make dragging the only way to reach the primary action.",
        "The multi-detent indicator is a vertical slider: ArrowUp / ArrowRight increments, ArrowDown / ArrowLeft decrements, and Home / End moves to the first or last detent. Arrow keys clamp instead of wrapping; Enter / Space and click keep cycling.",
        "Height and entrance transitions are removed under prefers-reduced-motion: reduce.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Passing open makes the caller own visibility; omitting open uses internal state. Both modes report changes through onOpenChange.",
        "Drag release, click cycling, and keyboard adjustment report the target index through onDetentChange. A controlled detent must be fed back by the caller; uncontrolled usage updates the height immediately. Dragging below the lowest detent closes only when collapseDown permits it.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "By default, Bottom Sheet docks to the mobile viewport bottom with detent × 100dvh height. With a positioned container, the sheet and backdrop stay inside it and detents use its height. Prefer Modal or Sheet for desktop-wide flows.",
        "Bottom padding includes safe-area-inset-bottom so actions remain clear of device safe areas.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The panel uses background and border theme tokens while the overlay remains translucent black; no separate light or dark palette is required.",
      ],
    },
  },
  "error-boundary": {
    slug: "error-boundary",
    locale: "en-US",
    summary:
      "Catches React render failures within a subtree, preserves the rest of the page, and replaces the failed region with built-in or custom recovery UI.",
    whenToUse: [
      "Around routes, page sections, or complex widgets where one crash must not unmount the whole application.",
      "When render failures need onError reporting and automatic recovery after a route or data identity changes.",
    ],
    whenNotToUse: [
      "React boundaries do not catch event-handler, asynchronous callback, or server-rendering errors; handle those in their execution paths.",
      "Use Error, Error Card, or inline validation for ordinary request and field failures instead of throwing during render.",
    ],
    examples: [
      {
        id: "error-boundary-default",
        kind: "stateful",
        title: "Contain a render failure",
        description: "Triggers a child render error and resets the example through a custom fallback.",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The built-in fallback uses role=alert. A custom fallback should also name the failed region and next action, with equivalent alert semantics when immediate announcement is required.",
        "Use a retry label that names the action and target, such as Reload Deployment Preview, rather than a generic confirmation label.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "resetKeys are shallow-compared; a length or item change clears the captured error and renders children again.",
        "fallback is a static ReactNode. To reset caller state from it, provide a node with the appropriate handler or remount the boundary through key.",
      ],
    },
    responsiveBehavior: {
      status: "not-applicable",
      reason: "Error containment is viewport-independent; the caller owns responsive fallback layout.",
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The built-in fallback uses minimal inline styling so it does not depend on application theme CSS. Custom fallbacks should use the application's semantic color and typography tokens.",
      ],
    },
  },
};
