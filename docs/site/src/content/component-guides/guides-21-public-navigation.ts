import type { ComponentGuide, GuideLocale } from "../component-guide-schema";

type GuideContent = Omit<ComponentGuide, "slug" | "locale">;

const content: Record<GuideLocale, Record<string, GuideContent>> = {
  "zh-CN": {
    "sidebar-nav": {
      summary: "SidebarNav 提供分组导航、当前项状态、可选折叠记忆与活动项滚动跟踪。",
      whenToUse: ["桌面应用需要分组侧栏导航并突出当前页面时。"],
      whenNotToUse: ["移动端需要可展开的全屏导航时，使用 HamburgerMenu。"],
      examples: [
        { id: "default", kind: "minimal", title: "分组导航", description: "选择条目更新当前页状态。", demoKey: "default" },
        { id: "scroll-tracking", kind: "stateful", title: "活动项滚动跟踪", description: "比较三档跟踪模式及条目／分类小标题对齐；选择活动条目、重新载入或手动滚动。", demoKey: "scroll-tracking" },
      ],
      accessibility: { status: "covered", content: ["链接保持原生锚点语义；当前项设置 aria-current，折叠组标题可用键盘操作。", "滚动跟踪不会转移焦点；系统请求减少动画时直接完成定位。"] },
      controlledBehavior: { status: "covered", content: [
        "activeTo 由调用方传入；onNavigate 拦截普通点击，修饰键点击仍沿用原生锚点行为。",
        "scrollTracking 是可选的 Unitary 扩展，类型为 ScrollTrackingMode，默认 disabled；on-reload 在首次挂载、DOM 布局就绪后尝试一次，之后的 activeTo 变化不会触发跟踪；always 在进入该模式及 activeTo 变化时更新位置。",
        "scrollTrackingTarget 默认 item，定位当前条目；category 定位所属二级分类的小标题，没有 subgroups 时定位一级分组标题。文档侧栏使用 on-reload + category。always 也响应对齐目标的切换；on-reload 已执行后切换目标需要重新挂载。",
        "调用方从路由或锚点恢复 activeTo；组件跟踪对应的活动链接。手动滚动会中断当前动画，on-reload 的这次尝试仍视为已用。always 也不会持续锁定同一个活动值的位置。",
      ] },
      responsiveBehavior: { status: "covered", content: ["宽度由外部布局决定；触控行使用更大的命中区。", "跟踪只滚动最近的纵向滚动容器，首选顶部下方 16px；若会露出前一条目或分组标题的文字、图标，按 spacing 尺度缩小为 8px、4px 等。目标被限制在可滚动范围内，不会带动外层页面。"] },
      themeBehavior: { status: "covered", content: ["链接、焦点与选中态使用语义颜色 token。", "滚动跟踪复用 --uni-motion-state（默认 250ms）与 --ease-in-out 非线性曲线；两种主题使用相同的动效 token。"] },
    },
    navbar: {
      summary: "Navbar 是可配置滚动定位和表面样式的页面顶栏。",
      whenToUse: ["页面需要固定、随文档滚动或向下滚动隐藏的顶栏时。"],
      whenNotToUse: ["应用级命令分组应使用 Toolbar，侧栏导航应使用 SidebarNav。"],
      examples: [{ id: "default", kind: "minimal", title: "固定顶栏", description: "在预览区域中展示默认顶栏。", demoKey: "default" }],
      accessibility: { status: "covered", content: ["组件渲染 header；调用方须给交互按钮提供无障碍名称。"] },
      controlledBehavior: { status: "not-applicable", reason: "滚动方向由内部监听；组件没有外部受控状态。" },
      responsiveBehavior: { status: "covered", content: ["顶栏内容和宽度由调用方安排；auto-hide 使用视口固定定位。"] },
      themeBehavior: { status: "covered", content: ["solid 模式使用背景与边框语义 token。"] },
    },
    footer: {
      summary: "Footer 组合品牌区域、链接列与尾部内容。",
      whenToUse: ["页面底部需要分组链接或附加信息时。"],
      whenNotToUse: ["页面顶部导航应使用 Navbar；局部操作应使用 Toolbar。"],
      examples: [{ id: "default", kind: "minimal", title: "链接页脚", description: "分组链接与前置内容。", demoKey: "default" }],
      accessibility: { status: "covered", content: ["组件渲染 footer，链接使用原生锚点；链接文案由调用方提供。"] },
      controlledBehavior: { status: "not-applicable", reason: "Footer 没有内部交互状态。" },
      responsiveBehavior: { status: "covered", content: ["窄屏链接列堆叠；较宽视口与前后插槽并排。"] },
      themeBehavior: { status: "covered", content: ["文字与分隔线使用语义 token。"] },
    },
    "hamburger-menu": {
      summary: "HamburgerMenu 组合触发图标、展开面板、分组导航和搜索。",
      whenToUse: ["小屏或紧凑顶栏需要可展开导航时。"],
      whenNotToUse: ["常驻桌面侧栏应使用 SidebarNav；命令列表应使用 MenuBar。"],
      examples: [{ id: "default", kind: "minimal", title: "展开导航", description: "打开菜单，切换项目／空数据／加载状态，并试用无匹配搜索。", demoKey: "default" }],
      accessibility: { status: "covered", content: ["触发按钮提供无障碍名称；菜单打开后支持 Escape 关闭与焦点归还。", "空数据与无匹配搜索通过 role=status 报告；加载时导航区标记 aria-busy 并显示状态指示。"] },
      controlledBehavior: { status: "covered", content: ["使用 open + onOpenChange 受控；不传 open 时由组件管理展开状态。", "调用方传入 loading 显示加载态，emptyMessage 可覆盖空数据及无匹配搜索的默认提示。"] },
      responsiveBehavior: { status: "covered", content: ["topbar 默认向下展开，sidebar 也默认向下；可显式指定左或右，maxExpandedWidth 和 maxExpandedHeight 可约束面板。传入已定位的 container 可在局部容器内展开并限制遮罩范围。"] },
      themeBehavior: { status: "covered", content: ["面板和导航条目沿用共享语义颜色 token。"] },
    },
    "side-panel": {
      summary: "SidePanel 为桌面提供左侧或右侧的受控悬浮详情面板。",
      whenToUse: ["桌面详情或操作需要可关闭的侧边浮层时。"],
      whenNotToUse: ["触屏底部抽屉使用 Drawer；同一内容需跨端切换形态时使用 ResponsiveDrawer。"],
      examples: [{ id: "default", kind: "minimal", title: "右侧详情", description: "受控打开、关闭并归还触发器焦点。", demoKey: "default" }],
      accessibility: { status: "covered", content: ["通过 SidePanelTitle 命名对话框；Escape 或关闭按钮关闭后焦点返回原触发器。"] },
      controlledBehavior: { status: "covered", content: ["show 和 onDismiss 由调用方成对管理；noOverlay 时降为非模态，外点仍调用 onDismiss。"] },
      responsiveBehavior: { status: "covered", content: ["宽度由 --uni-drawer-width 控制；小屏底部行为不是本组件的职责。"] },
      themeBehavior: { status: "covered", content: ["面板与遮罩使用共享材质、背景和层级 token。"] },
    },
  },
  "en-US": {
    "sidebar-nav": {
      summary: "SidebarNav renders grouped sidebar links with active state, optional collapse persistence and active-item scroll tracking.",
      whenToUse: ["Use it for grouped navigation in desktop application layouts."],
      whenNotToUse: ["Use HamburgerMenu for expandable navigation on a compact screen."],
      examples: [
        { id: "default", kind: "minimal", title: "Grouped links", description: "Select an item to update the current-page state.", demoKey: "default" },
        { id: "scroll-tracking", kind: "stateful", title: "Active-item scroll tracking", description: "Compare three tracking modes and item/category-heading alignment; choose an active item, reload or scroll manually.", demoKey: "scroll-tracking" },
      ],
      accessibility: { status: "covered", content: ["Links retain native anchor semantics; the active item uses aria-current and collapsible headings support keyboard activation.", "Scroll tracking does not move focus; reduced-motion preferences make alignment immediate."] },
      controlledBehavior: { status: "covered", content: [
        "The caller supplies activeTo; onNavigate intercepts unmodified clicks, while modified clicks retain native navigation.",
        "scrollTracking is an optional Unitary extension typed as ScrollTrackingMode and defaults to disabled. on-reload attempts alignment once after the initial mount and DOM layout readiness; later activeTo changes do not trigger tracking. always updates position when entering that mode and when activeTo changes.",
        "scrollTrackingTarget defaults to item for the active link. category aligns its subgroup heading, falling back to the group heading when there are no subgroups. The docs sidebar uses on-reload + category. always also responds to alignment-target changes; after on-reload has run, changing the target requires remounting.",
        "Restore activeTo from the route or anchor in the caller; the component tracks the corresponding active link. Manual scrolling interrupts the current animation and still consumes the on-reload attempt. always does not continually lock the position for the same active value.",
      ] },
      responsiveBehavior: { status: "covered", content: ["The surrounding layout sets the width; touch rows have larger hit targets.", "Tracking scrolls only the nearest vertical scroll container and prefers 16px below its top. If preceding item or group-heading text or icons would remain visible, the spacing scale reduces the inset to 8px, 4px and so on. The target is clamped to the available scroll range and does not scroll the outer page."] },
      themeBehavior: { status: "covered", content: ["Links, focus rings, and selection use semantic color tokens.", "Scroll tracking reuses --uni-motion-state (250ms by default) and the nonlinear --ease-in-out curve; both themes share these motion tokens."] },
    },
    navbar: {
      summary: "Navbar provides configurable positioning and surface treatment for a page header.",
      whenToUse: ["Use it for a static, pinned, or scroll-aware page header."],
      whenNotToUse: ["Use Toolbar for grouped commands and SidebarNav for side navigation."],
      examples: [{ id: "default", kind: "minimal", title: "Pinned header", description: "Show the default header inside a preview region.", demoKey: "default" }],
      accessibility: { status: "covered", content: ["The component renders a header; callers must name interactive controls."] },
      controlledBehavior: { status: "not-applicable", reason: "Scroll direction is observed internally; there is no externally controlled state." },
      responsiveBehavior: { status: "covered", content: ["Callers arrange header content; auto-hide uses viewport-fixed positioning."] },
      themeBehavior: { status: "covered", content: ["The solid variant uses semantic background and border tokens."] },
    },
    footer: {
      summary: "Footer composes brand content, link columns, and trailing content.",
      whenToUse: ["Use it for grouped links or supplementary information at the bottom of a page."],
      whenNotToUse: ["Use Navbar for the page header and Toolbar for local actions."],
      examples: [{ id: "default", kind: "minimal", title: "Link footer", description: "Grouped links with leading content.", demoKey: "default" }],
      accessibility: { status: "covered", content: ["The component renders a footer and native links; callers provide link text."] },
      controlledBehavior: { status: "not-applicable", reason: "Footer has no internal interactive state." },
      responsiveBehavior: { status: "covered", content: ["Link columns stack at narrow widths and align with slots on wider screens."] },
      themeBehavior: { status: "covered", content: ["Text and dividers use semantic tokens."] },
    },
    "hamburger-menu": {
      summary: "HamburgerMenu combines a trigger icon, expandable panel, grouped navigation, and search.",
      whenToUse: ["Use it for expandable navigation in a compact page header."],
      whenNotToUse: ["Use SidebarNav for a persistent desktop rail and MenuBar for application commands."],
      examples: [{ id: "default", kind: "minimal", title: "Expandable navigation", description: "Open the menu, switch between items, empty and loading data, or search for an unmatched item.", demoKey: "default" }],
      accessibility: { status: "covered", content: ["The trigger has an accessible name; Escape closes the menu and returns focus.", "Empty navigation and unmatched search expose role=status; the loading state marks navigation aria-busy and shows a status indicator."] },
      controlledBehavior: { status: "covered", content: ["Use open with onOpenChange for controlled state; omit open for internal state.", "Set loading while data loads; emptyMessage optionally overrides both empty-navigation and unmatched-search messages."] },
      responsiveBehavior: { status: "covered", content: ["Both anchors default to downward expansion; sidebars may specify left or right, with configurable size limits. A positioned container keeps the panel and backdrop within a local frame."] },
      themeBehavior: { status: "covered", content: ["The panel and links use shared semantic color tokens."] },
    },
    "side-panel": {
      summary: "SidePanel is a controlled floating detail panel on either side of a desktop page.",
      whenToUse: ["Use it for a dismissible desktop side detail or action surface."],
      whenNotToUse: ["Use Drawer for mobile bottom actions, or ResponsiveDrawer for a shared cross-device flow."],
      examples: [{ id: "default", kind: "minimal", title: "Right-side details", description: "Open and close a controlled panel with focus restored to its trigger.", demoKey: "default" }],
      accessibility: { status: "covered", content: ["Name the dialog with SidePanelTitle; Escape and the close button return focus to the original trigger."] },
      controlledBehavior: { status: "covered", content: ["Manage show with onDismiss; noOverlay switches to non-modal mode while outside presses still call onDismiss."] },
      responsiveBehavior: { status: "covered", content: ["Width follows --uni-drawer-width; mobile bottom-sheet behavior is outside this component's scope."] },
      themeBehavior: { status: "covered", content: ["The panel and backdrop use shared material, surface, and stacking tokens."] },
    },
  },
};

function guides(locale: GuideLocale): Record<string, ComponentGuide> {
  return Object.fromEntries(Object.entries(content[locale]).map(([slug, guide]) => [slug, { ...guide, slug, locale }]));
}

export const PUBLIC_NAVIGATION_GUIDES_ZH = guides("zh-CN");
export const PUBLIC_NAVIGATION_GUIDES_EN = guides("en-US");
