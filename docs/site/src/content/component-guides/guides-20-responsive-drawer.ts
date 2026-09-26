import type { ComponentGuide } from "../component-guide-schema";

/**
 * ResponsiveDrawer（本地扩展浮层）双语指南。
 * 与官方镜像 Drawer / Sheet / BottomSheet 的边界写在指南自身：同一条信息架构跨端时用它。
 */

export const RESPONSIVE_DRAWER_GUIDES_ZH: Record<string, ComponentGuide> = {
  "responsive-drawer": {
    slug: "responsive-drawer",
    locale: "zh-CN",
    summary:
      "一个抽屉承载两端形态：手机贴底、桌面贴右；沿用 BottomSheet 的档位与拖拽语义，并补齐 Header 关闭按钮、独立滚动 Body 与响应式 Footer。",
    whenToUse: [
      "同一条信息架构要在手机与桌面同时成立时——例如「部署操作」在手机上是从底部弹出的动作面板，在桌面上是右侧的详情抽屉。",
      "需要浮动面板语义（遮罩、焦点陷阱、Esc 与外点关闭）但又不想在应用层写断点分支时，开启 responsive 由组件决定形态。",
      "需要底部多档位拖拽（先看半屏摘要、再拉到全高看详情）时，用 detents 表达档位，档位吸附沿用 BottomSheet 的交互语义。",
    ],
    whenNotToUse: [
      "需要官方镜像行为时不要替换：官方 Drawer 的固定/自适应高度与仅受控 show/onDismiss 契约由文档固定，本组件不改变它。",
      "侧栏形态不需要拖拽档位；给 right / left 传 detents 不会生效，属于误用。",
      "整页内容都放不下、且不需要遮罩与焦点陷阱时，用普通页面布局或 Scroller，不要把全站导航塞进抽屉。",
    ],
    examples: [
      {
        id: "responsive-drawer-default",
        kind: "minimal",
        title: "默认右侧面板",
        description: "Header 内置关闭按钮、Body 独立滚动、Footer 右侧对齐；关闭后焦点回到触发器。",
        demoKey: "default",
      },
      {
        id: "responsive-drawer-responsive",
        kind: "variant",
        title: "响应式形态切换",
        description: "响应式开启后：<640px 从底部滑入，≥640px 从右侧滑入，应用层无需分支。",
        demoKey: "responsive",
      },
      {
        id: "responsive-drawer-detents",
        kind: "advanced",
        title: "底部多档位拖拽",
        description:
          "placement=\"bottom\" + detents=[0.4, 0.8, 1]：指示条跟手拖动、松手吸附最近档位，拖过最低档收起关闭。",
        demoKey: "detents",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "基于 Radix Dialog：打开时焦点移入面板、Tab 循环限制在面板内、Esc 与外点关闭、关闭后焦点返还到打开按钮。",
        "ResponsiveDrawerTitle / ResponsiveDrawerDescription 通过 Radix 的 aria-labelledby / aria-describedby 关联到面板，保证读屏能播报名称与说明。",
        "Header 内置的关闭按钮带可访问名称（无可见文本时用本地化的 Close），图标 aria-hidden，不单独承载语义。",
        "底部形态的拖拽指示条是垂直 role=\"slider\"，带 aria-valuemin/valuemax/valuenow/orientation；ArrowUp / ArrowRight 增一档、ArrowDown / ArrowLeft 减一档，Home / End 跳首尾且边界不循环。Enter / Space 与点击保持循环切档。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "支持受控（open + onOpenChange）与非受控（defaultOpen）两种模式，与其他浮层组件一致。",
        "onDetentChange 回报拖拽吸附、点击循环或键盘调档后的目标索引，便于上层记录用户上次停留高度；拖拽跟手阶段不回报，避免高频回调。detents 运行时缩短时，当前索引会钳制到新上限。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "responsive 开启时以 640px 为断点：以下使用底部几何（顶缘圆角、safe-area 内边距、可选档位），以上使用右侧面板几何（四周 8px 留白、圆角、细边框、柔阴影）。",
        "placement 固定方位时，左右面板在窄屏退化为 3/4 宽的全高面板，避免小屏上面板过窄。",
        "Footer 在移动端纵向倒序（主操作在上），≥640px 变为右对齐横排；Body 始终独立滚动，Header/Footer 保持吸顶吸底。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "面板使用 bg-background 与 border-border 语义 token，明暗双主题下与 Drawer / Sheet 同族外观。",
        "阴影走 --material-shadow-menu token（dark 主题内层近白环由 token 覆盖），不使用浅色字面量。",
        "进出场动画使用 --uni-motion-expansive（500ms）+ ease-snap；拖拽跟手阶段零过渡，prefers-reduced-motion 下全部降级。",
      ],
    },
  },
};

export const RESPONSIVE_DRAWER_GUIDES_EN: Record<string, ComponentGuide> = {
  "responsive-drawer": {
    slug: "responsive-drawer",
    locale: "en-US",
    summary:
      "One drawer that serves both form factors: docked to the bottom on phones and to the side on desktop, reusing BottomSheet's detents and drag semantics while adding a built-in header close button, a scrollable body, and a responsive footer.",
    whenToUse: [
      "When the same information architecture has to work on phone and desktop — for example \"Deployment Actions\" as a bottom action sheet on mobile and a side detail panel on desktop.",
      "When you need floating-panel semantics (overlay, focus trap, Escape and outside-press dismissal) without writing breakpoint branches in app code: enable responsive and let the component choose the geometry.",
      "When the bottom form needs height steps (peek at a summary, then drag to full height for detail): express them with detents, which reuse BottomSheet's snap semantics.",
    ],
    whenNotToUse: [
      "Don't swap in this component when you need the mirrored Drawer contract: the official fixed/auto height plus controlled-only show/onDismiss API stays untouched.",
      "The side panel has no drag affordance by design; passing detents to right / left is a misuse and has no effect.",
      "When the content simply doesn't fit and you don't need an overlay or focus trap, use page layout or Scroller instead of hiding navigation inside a drawer.",
    ],
    examples: [
      {
        id: "responsive-drawer-default",
        kind: "minimal",
        title: "Default right panel",
        description:
          "Built-in header close button, an independently scrolling body, and a right-aligned footer; focus returns to the trigger on close.",
        demoKey: "default",
      },
      {
        id: "responsive-drawer-responsive",
        kind: "variant",
        title: "Responsive form-factor switch",
        description:
          "With responsive enabled the panel slides in from the bottom below 640px and from the right above it — no app-level branching.",
        demoKey: "responsive",
      },
      {
        id: "responsive-drawer-detents",
        kind: "advanced",
        title: "Bottom detents with drag",
        description:
          "placement=\"bottom\" with detents=[0.4, 0.8, 1]: the indicator tracks your finger, snaps to the nearest step on release, and dismisses past the lowest step.",
        demoKey: "detents",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Built on Radix Dialog: focus moves into the panel on open, Tab is trapped inside, Escape and outside press dismiss, and focus returns to the trigger on close.",
        "ResponsiveDrawerTitle / ResponsiveDrawerDescription are wired to the panel through Radix's aria-labelledby / aria-describedby so screen readers announce the name and description.",
        "The header's built-in close button always has an accessible name (the localized Close when there is no visible label); its icon is aria-hidden and carries no meaning on its own.",
        "In the bottom form the drag indicator is a vertical role=\"slider\" with aria-valuemin/valuemax/valuenow/orientation. ArrowUp / ArrowRight increments, ArrowDown / ArrowLeft decrements, and Home / End moves to either boundary without wrapping; Enter / Space and click keep cycling.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Supports controlled (open + onOpenChange) and uncontrolled (defaultOpen) usage, matching the other overlay components.",
        "onDetentChange reports the target index after drag snapping, click cycling, or keyboard adjustment so callers can remember the last height; it is not fired during finger tracking. If detents shrinks at runtime, the current index clamps to the new maximum.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "With responsive enabled the 640px breakpoint decides the geometry: below it the panel uses the bottom form (top rounding, safe-area padding, optional detents), above it the side panel form (8px inset, rounding, hairline border, soft shadow).",
        "With a fixed placement, side panels degrade to a three-quarter-width full-height panel on narrow viewports so they never become too cramped to use.",
        "The footer stacks in reverse order on mobile (primary action on top) and becomes a right-aligned row at 640px and above; the body always scrolls independently while header and footer stay pinned.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The panel uses bg-background and border-border semantic tokens, matching the Drawer / Sheet family in both themes.",
        "Shadows come from the --material-shadow-menu token (the dark theme's inner light ring is overridden by the token), never from light-theme literals.",
        "Open/close motion uses --uni-motion-expansive (500ms) with ease-snap; finger tracking has no transition, and everything degrades under prefers-reduced-motion.",
      ],
    },
  },
};
