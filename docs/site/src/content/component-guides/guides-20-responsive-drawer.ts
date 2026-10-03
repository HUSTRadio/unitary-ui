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
      "同一个抽屉在手机上从底部打开、在桌面上从右侧打开，支持底部高度档位。",
    whenToUse: [
      "同一内容需要适配手机与桌面时，例如手机底部操作面板和桌面右侧详情面板。",
      "开启 responsive 后，组件按屏幕宽度选择面板方向，并提供遮罩、焦点管理和关闭操作。",
      "需要底部多档位拖拽（先看半屏摘要、再拉到全高看详情）时，用 detents 表达档位，档位吸附沿用 BottomSheet 的交互语义。",
    ],
    whenNotToUse: [
      "需要 Drawer 的高度和 show/onDismiss API 时使用 Drawer；ResponsiveDrawer 使用另一套 API。",
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
        "Header 内置的关闭按钮带无障碍名称（无可见文本时用本地化的 Close），图标 aria-hidden，不单独承载语义。",
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
        "responsive 开启时，640px 以下使用底部面板，带顶部圆角、安全区边距和可选高度档位；640px 起使用右侧面板，四周留白 8px。",
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
      "Use one drawer that opens from the bottom on phones and from the right on desktops, with bottom height detents.",
    whenToUse: [
      "Use it when the same content needs a bottom action panel on phones and a right-side detail panel on desktops.",
      "Enable responsive to choose the panel direction by screen width, with an overlay, focus management, and dismissal controls.",
      "When the bottom form needs height steps (peek at a summary, then drag to full height for detail): express them with detents, which reuse BottomSheet's snap semantics.",
    ],
    whenNotToUse: [
      "Use Drawer when you need its height behavior and show/onDismiss API; ResponsiveDrawer uses a different API.",
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
        "With responsive enabled, widths below 640px use a bottom panel with rounded top corners, safe-area padding, and optional height detents. At 640px and above, a right-side panel has an 8px inset.",
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
