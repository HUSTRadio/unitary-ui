import { useEffect, useRef, useState } from "react";
import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  FileText,
  Folder,
  Image as ImageIcon,
  LayoutGrid,
  LayoutTemplate,
  List,
  RefreshCw,
  Rows3,
  Settings2,
  Share2,
  Smartphone,
} from "lucide-react";

import { BottomSheet } from "@hustradio/unitary-ui";
import { Browser } from "@hustradio/unitary-ui";
import { Footer } from "@hustradio/unitary-ui";
import { HamburgerMenu } from "@hustradio/unitary-ui";
import {
  MenuBar,
  MenuBarCheckboxItem,
  MenuBarContent,
  MenuBarItem,
  MenuBarMenu,
  MenuBarSeparator,
  MenuBarTrigger,
} from "@hustradio/unitary-ui";
import { Navbar } from "@hustradio/unitary-ui";
import { SidebarNav, type SidebarNavGroup } from "@hustradio/unitary-ui";
import { SubFrame } from "@hustradio/unitary-ui";
import { ThemeSwitcher } from "@hustradio/unitary-ui";
import { Toolbar, ToolbarGroup, ToolbarItem } from "@hustradio/unitary-ui";
import { scrollIntoViewWithMotion, type ScrollAnimation } from "@hustradio/unitary-ui";

import type { DocsLanguage } from "../../i18n/language";
import { DocsPageLead, DocsPageTitle } from "../docs-typography";

/**
 * App Shell 全页连贯式 pattern demo（/patterns/app-shell）。
 *
 * 页面本身即活文档：内嵌一个自包含的 mini 壳层——
 * <Navbar>（Logo 文本 + ThemeSwitcher + trailing HamburgerMenu anchor=topbar 向下延伸）
 * + lg 断点 <SidebarNav> 锚点导航
 * + 主内容说明卡片（各组件可配项表格 / mobileOnly BottomSheet 交互卡）
 * + 2 列 <Footer>。所有文案走 DEMO_COPY 双语目录，禁止裸 JSX 文本。
 */

/* ---------- i18n 文案目录（结构对齐 SHELL_COPY 惯例） ---------- */

interface ApiRowCopy {
  component: string;
  prop: string;
  defaultValue: string;
  description: string;
}

/** 浏览器窗口形态演示里的单个菜单项（分隔线无 label）。 */
type WindowMenuItemCopy =
  | { type: "item"; label: string; shortcut?: string }
  | { type: "separator" }
  | { type: "checkbox"; label: string; shortcut?: string }
  | { type: "disabled"; label: string; shortcut?: string };

interface WindowMenuCopy {
  label: string;
  items: WindowMenuItemCopy[];
}

const DEMO_COPY = {
  "zh-CN": {
    title: "App Shell 应用壳层",
    lead: "用顶栏、侧栏、内容区和页脚搭建应用页面。调整窗口宽度，观察侧栏在 lg 断点（1024px）处切换为汉堡导航菜单。",
    sectionOverview: "总览",
    overviewCards: [
      {
        heading: "Navbar",
        body: "scrollBehavior 支持 static / pinned / auto-hide 三种定位行为；variant 支持 solid / transparent，transparent 可配合 solidOnScroll 在滚动后自动补底色。",
      },
      {
        heading: "SidebarNav",
        body: "groups 定义导航组，activeTo 高亮当前页，side 设置分隔线方向。collapsible 允许折叠分组。本例由外层布局设置宽度，并从 lg 断点起显示侧栏。",
      },
      {
        heading: "HamburgerMenu",
        body: "组合 HamburgerIcon 和 ExpandPanel。anchor=topbar 时，面板从顶栏底边向下展开；输入搜索词后显示匹配结果。",
      },
      {
        heading: "Footer",
        body: "columns 链接列 + slotLeading/slotTrailing 插槽 + sticky 吸底可选。本页演示两列形态。",
      },
    ],
    sectionApi: "可配项速查",
    apiHeaders: { component: "组件", prop: "Prop", defaultValue: "默认值", description: "说明" },
    apiRows: [
      {
        component: "Navbar",
        prop: "scrollBehavior",
        defaultValue: '"pinned"',
        description: "static 随文档流 / pinned 吸顶常驻 / auto-hide 下滚隐藏上滚复现",
      },
      {
        component: "Navbar",
        prop: "variant · solidOnScroll",
        defaultValue: '"solid" · false',
        description: "transparent 无底色；solidOnScroll 滚动超阈值后补底色与下边框",
      },
      {
        component: "SidebarNav",
        prop: "groups · activeTo · side",
        defaultValue: "— · — · \"left\"",
        description: "分组数据源、当前高亮项（aria-current=\"page\"）、分隔边方向",
      },
      {
        component: "SidebarNav",
        prop: "collapsible · persistKey",
        defaultValue: "false · —",
        description: "分组标题可点击开合；persistKey 记忆折叠状态（localStorage，当前页所在分组始终展开）",
      },
      {
        component: "SidebarNav",
        prop: "items[].badge",
        defaultValue: "—",
        description: "条目右端状态胶囊：{ label, tone: \"new\" | \"updated\" }；桌面侧栏与移动端面板同一视觉",
      },
      {
        component: "HamburgerMenu",
        prop: "anchor · direction",
        defaultValue: '— · topbar→"down"',
        description: "触发场景；topbar 向下延伸为顶栏视觉延续，sidebar 建议对侧展开",
      },
      {
        component: "HamburgerMenu",
        prop: "maxExpandedHeight · content",
        defaultValue: '"100dvh" · "merged"',
        description: "展开态最大高；merged 搜索+导航合并 / split 视觉拆分（占位）",
      },
      {
        component: "BottomSheet",
        prop: "detents · gestures",
        defaultValue: "[0.5, 1] · 全开",
        description: "高度档位（≥2 档自动渲染 Grabber）；resize/expandUp/collapseDown 各自可关",
      },
      {
        component: "Footer",
        prop: "columns · sticky",
        defaultValue: "— · false",
        description: "链接列数组；sticky 吸底。slotLeading/slotTrailing 自由插槽",
      },
      {
        component: "MenuBar",
        prop: "MenuBarItem.shortcut · inset",
        defaultValue: "— · false",
        description: "右对齐快捷键（仅展示，不绑定按键）；inset 使无图标项与勾选项对齐",
      },
      {
        component: "MenuBar",
        prop: "MenuBarCheckboxItem · MenuBarSub",
        defaultValue: "— · —",
        description: "勾选项（ItemIndicator 打勾）+ 子菜单（SubTrigger 右向箭头，逐级展开）",
      },
      {
        component: "Toolbar",
        prop: "ToolbarGroup.slot · collapsible",
        defaultValue: '"leading" · true',
        description: "leading / center / trailing 三段排布；空间不足时整组折叠进尾部溢出菜单",
      },
      {
        component: "Toolbar",
        prop: "ToolbarItem.iconOnly · active",
        defaultValue: "false · —",
        description: "仅图标（无障碍名仍取 label）；active 呈选中态，用于分段切换",
      },
    ] as ApiRowCopy[],
    sectionWindow: "应用菜单栏与工具栏",
    windowLead:
      "MenuBar 提供 File / Edit / View 等应用命令；Toolbar 提供导航和视图切换等常用工具，空间不足时按组收进更多操作菜单。本例将菜单栏放在工具栏上方。",
    windowAddress: "unitary-ui.app/editor",
    menuBarAriaLabel: "应用菜单",
    windowMenus: [
      {
        label: "文件",
        items: [
          { type: "item", label: "新建窗口", shortcut: "⌘N" },
          { type: "item", label: "打开…", shortcut: "⌘O" },
          { type: "separator" },
          { type: "item", label: "保存", shortcut: "⌘S" },
          { type: "item", label: "导出为 PDF…", shortcut: "⇧⌘E" },
          { type: "separator" },
          { type: "item", label: "关闭窗口", shortcut: "⌘W" },
        ],
      },
      {
        label: "编辑",
        items: [
          { type: "item", label: "撤销", shortcut: "⌘Z" },
          { type: "item", label: "重做", shortcut: "⇧⌘Z" },
          { type: "separator" },
          { type: "item", label: "剪切", shortcut: "⌘X" },
          { type: "item", label: "拷贝", shortcut: "⌘C" },
          { type: "item", label: "粘贴", shortcut: "⌘V" },
          { type: "separator" },
          { type: "disabled", label: "查找与替换", shortcut: "⌘F" },
        ],
      },
      {
        label: "显示",
        items: [
          { type: "checkbox", label: "显示侧边栏", shortcut: "⌘\\" },
          { type: "checkbox", label: "显示隐藏文件", shortcut: "⇧⌘." },
          { type: "separator" },
          { type: "item", label: "放大", shortcut: "⌘+" },
          { type: "item", label: "缩小", shortcut: "⌘-" },
        ],
      },
    ] as WindowMenuCopy[],
    windowToolbar: {
      back: "后退",
      forward: "前进",
      reload: "刷新",
      gridMode: "网格视图",
      listMode: "列表视图",
      share: "分享",
    },
    windowStatusPrefix: "最近命令：",
    windowStatusIdle: "尚未触发",
    windowPreviewTitle: "窗口内容区",
    windowPreviewItems: [
      { name: "设计规范.md", meta: "Markdown · 12 KB" },
      { name: "组件清单.xlsx", meta: "表格 · 48 KB" },
      { name: "首页草图.png", meta: "图片 · 2.4 MB" },
      { name: "发布配置.json", meta: "配置 · 1 KB" },
    ],
    sectionMobile: "移动端特化",
    mobileBadge: "移动端特化",
    mobileOnlyCardHeading: "BottomSheet 多档位弹层",
    mobileOnlyCardBody:
      "低于最低档继续下拉关闭、点按 Grabber 循环切换档位（Apple HIG 规格）。点击下方按钮打开体验拖拽调高与档位吸附。",
    sheetTrigger: "打开 BottomSheet",
    sheetTitle: "试试拖拽我",
    sheetBody: "拖动顶部指示条调整高度：0.4 ↔ 0.8 两档吸附；拉到最低档以下松手即关闭；点按指示条循环切档。",
    footerColumns: [
      {
        title: "壳层组件",
        links: [
          { label: "Navbar 可配顶栏", href: "#demo-api" },
          { label: "SidebarNav 侧边导航", href: "#demo-api" },
        ],
      },
      {
        title: "移动端",
        links: [
          { label: "BottomSheet 弹层", href: "#demo-mobile" },
          { label: "Grabber 指示条", href: "#demo-mobile" },
        ],
      },
    ],
    footerLeading: "Unitary · Patterns",
    menuAriaLabelPrefix: "跳转到",
  },
  "en-US": {
    title: "App Shell",
    lead: "Build an application page with a topbar, sidebar, content area, and footer. Resize the window to see the sidebar switch to a hamburger menu at the lg breakpoint (1024px).",
    sectionOverview: "Overview",
    overviewCards: [
      {
        heading: "Navbar",
        body: "scrollBehavior supports static / pinned / auto-hide positioning; variant supports solid / transparent, and transparent pairs with solidOnScroll to restore surface after scrolling.",
      },
      {
        heading: "SidebarNav",
        body: "groups defines navigation groups, activeTo highlights the current page, and side sets the separator edge. collapsible allows groups to fold. This demo’s outer layout sets the width and shows the sidebar from the lg breakpoint.",
      },
      {
        heading: "HamburgerMenu",
        body: "Combines HamburgerIcon and ExpandPanel. With anchor=topbar, the panel opens below the topbar; typing a query displays matching results.",
      },
      {
        heading: "Footer",
        body: "columns link groups + slotLeading/slotTrailing slots + optional sticky pinning. This page demonstrates the two-column form.",
      },
    ],
    sectionApi: "Props cheat sheet",
    apiHeaders: { component: "Component", prop: "Prop", defaultValue: "Default", description: "Description" },
    apiRows: [
      {
        component: "Navbar",
        prop: "scrollBehavior",
        defaultValue: '"pinned"',
        description: "static in-flow / pinned sticky / auto-hide hides on scroll down, returns on scroll up",
      },
      {
        component: "Navbar",
        prop: "variant · solidOnScroll",
        defaultValue: '"solid" · false',
        description: "transparent has no surface; solidOnScroll restores surface + bottom border past threshold",
      },
      {
        component: "SidebarNav",
        prop: "groups · activeTo · side",
        defaultValue: "— · — · \"left\"",
        description: "Grouped data source, active item (aria-current=\"page\"), separator edge",
      },
      {
        component: "SidebarNav",
        prop: "collapsible · persistKey",
        defaultValue: "false · —",
        description:
          "Group headings toggle on click; persistKey remembers collapsed groups (localStorage, the active group always stays open)",
      },
      {
        component: "SidebarNav",
        prop: "items[].badge",
        defaultValue: "—",
        description:
          "Trailing status pill per item: { label, tone: \"new\" | \"updated\" }; same visual in the desktop sidebar and the mobile panel",
      },
      {
        component: "HamburgerMenu",
        prop: "anchor · direction",
        defaultValue: '— · topbar→"down"',
        description: "Trigger scenario; topbar extends down as a visual continuation, sidebar expands to the opposite side",
      },
      {
        component: "HamburgerMenu",
        prop: "maxExpandedHeight · content",
        defaultValue: '"100dvh" · "merged"',
        description: "Max expanded height; merged search+nav / split visual separation (placeholder)",
      },
      {
        component: "BottomSheet",
        prop: "detents · gestures",
        defaultValue: "[0.5, 1] · all on",
        description: "Height detents (≥2 renders Grabber automatically); resize/expandUp/collapseDown each toggleable",
      },
      {
        component: "Footer",
        prop: "columns · sticky",
        defaultValue: "— · false",
        description: "Link column array; sticky viewport pinning. slotLeading/slotTrailing free slots",
      },
      {
        component: "MenuBar",
        prop: "MenuBarItem.shortcut · inset",
        defaultValue: "— · false",
        description: "Right-aligned shortcut (display only, not bound); inset aligns icon-less items with checkable ones",
      },
      {
        component: "MenuBar",
        prop: "MenuBarCheckboxItem · MenuBarSub",
        defaultValue: "— · —",
        description: "Checkable item (ItemIndicator check) + submenu (SubTrigger chevron, nested levels)",
      },
      {
        component: "Toolbar",
        prop: "ToolbarGroup.slot · collapsible",
        defaultValue: '"leading" · true',
        description: "leading / center / trailing three-slot layout; whole groups collapse into the trailing overflow menu when space runs out",
      },
      {
        component: "Toolbar",
        prop: "ToolbarItem.iconOnly · active",
        defaultValue: "false · —",
        description: "Icon-only (accessible name still from label); active renders the selected state for segmented toggles",
      },
    ] as ApiRowCopy[],
    sectionWindow: "Menu bar and toolbar",
    windowLead:
      "MenuBar provides application commands such as File, Edit, and View. Toolbar provides tools such as navigation and view switching, moving groups into an overflow menu when space is limited. This demo places the menu bar above the toolbar.",
    windowAddress: "unitary-ui.app/editor",
    menuBarAriaLabel: "Application menu",
    windowMenus: [
      {
        label: "File",
        items: [
          { type: "item", label: "New Window", shortcut: "⌘N" },
          { type: "item", label: "Open…", shortcut: "⌘O" },
          { type: "separator" },
          { type: "item", label: "Save", shortcut: "⌘S" },
          { type: "item", label: "Export as PDF…", shortcut: "⇧⌘E" },
          { type: "separator" },
          { type: "item", label: "Close Window", shortcut: "⌘W" },
        ],
      },
      {
        label: "Edit",
        items: [
          { type: "item", label: "Undo", shortcut: "⌘Z" },
          { type: "item", label: "Redo", shortcut: "⇧⌘Z" },
          { type: "separator" },
          { type: "item", label: "Cut", shortcut: "⌘X" },
          { type: "item", label: "Copy", shortcut: "⌘C" },
          { type: "item", label: "Paste", shortcut: "⌘V" },
          { type: "separator" },
          { type: "disabled", label: "Find and Replace", shortcut: "⌘F" },
        ],
      },
      {
        label: "View",
        items: [
          { type: "checkbox", label: "Show Sidebar", shortcut: "⌘\\" },
          { type: "checkbox", label: "Show Hidden Files", shortcut: "⇧⌘." },
          { type: "separator" },
          { type: "item", label: "Zoom In", shortcut: "⌘+" },
          { type: "item", label: "Zoom Out", shortcut: "⌘-" },
        ],
      },
    ] as WindowMenuCopy[],
    windowToolbar: {
      back: "Back",
      forward: "Forward",
      reload: "Reload",
      gridMode: "Grid view",
      listMode: "List view",
      share: "Share",
    },
    windowStatusPrefix: "Last command: ",
    windowStatusIdle: "none yet",
    windowPreviewTitle: "Window content",
    windowPreviewItems: [
      { name: "design-spec.md", meta: "Markdown · 12 KB" },
      { name: "components.xlsx", meta: "Sheet · 48 KB" },
      { name: "hero-sketch.png", meta: "Image · 2.4 MB" },
      { name: "release.json", meta: "Config · 1 KB" },
    ],
    sectionMobile: "Mobile only",
    mobileBadge: "Mobile only",
    mobileOnlyCardHeading: "BottomSheet multi-detent sheet",
    mobileOnlyCardBody:
      "Pull below the lowest detent to dismiss, tap the grabber to cycle detents (Apple HIG spec). Open it below to try drag-to-resize and detent snapping.",
    sheetTrigger: "Open BottomSheet",
    sheetTitle: "Try dragging me",
    sheetBody: "Drag the top grabber to resize between the 0.4 and 0.8 detents; release below the lowest detent to dismiss; tap the grabber to cycle.",
    footerColumns: [
      {
        title: "Shell components",
        links: [
          { label: "Navbar topbar", href: "#demo-api" },
          { label: "SidebarNav", href: "#demo-api" },
        ],
      },
      {
        title: "Mobile",
        links: [
          { label: "BottomSheet", href: "#demo-mobile" },
          { label: "Grabber", href: "#demo-mobile" },
        ],
      },
    ],
    footerLeading: "Unitary · Patterns",
    menuAriaLabelPrefix: "Jump to",
  },
};

type DemoCopy = (typeof DEMO_COPY)["zh-CN"];

/** mini 壳层的锚点导航数据（SidebarNav 与 HamburgerMenu 共用同一组锚点）。 */
const SECTION_IDS = ["demo-overview", "demo-api", "demo-window", "demo-mobile"] as const;

/** 窗口内容区预览项图标：按下标循环，避免在文案目录里写死组件引用。 */
const WINDOW_PREVIEW_ICONS = [FileText, Folder, ImageIcon, Settings2] as const;

function buildSidebarGroups(copy: DemoCopy): SidebarNavGroup[] {
  return [
    {
      label: copy.sectionOverview,
      items: [{ label: copy.sectionOverview, to: `#${SECTION_IDS[0]}`, icon: LayoutTemplate }],
    },
    {
      label: copy.sectionApi,
      items: [{ label: copy.sectionApi, to: `#${SECTION_IDS[1]}`, icon: Rows3 }],
    },
    {
      label: copy.sectionWindow,
      items: [{ label: copy.sectionWindow, to: `#${SECTION_IDS[2]}`, icon: AppWindow }],
    },
    {
      label: copy.sectionMobile,
      items: [{ label: copy.sectionMobile, to: `#${SECTION_IDS[3]}`, icon: Smartphone }],
    },
  ];
}

export function AppShellDemo({ language }: { language: DocsLanguage }) {
  const copy = DEMO_COPY[language];
  const [activeAnchor, setActiveAnchor] = useState<string>(`#${SECTION_IDS[0]}`);
  const [sheetOpen, setSheetOpen] = useState(false);
  // 浏览器窗口形态演示的本地状态：勾选态按「菜单下标-项下标」记录，避免依赖可见文案
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [lastAction, setLastAction] = useState<string | null>(null);
  // mini navbar 根元素：HamburgerMenu side=top 面板从其底边延伸落下
  const frameRef = useRef<HTMLDivElement | null>(null);
  const scrollAnimationRef = useRef<ScrollAnimation | null>(null);
  useEffect(() => () => scrollAnimationRef.current?.cancel(), []);
  const [navbarEl, setNavbarEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setNavbarEl(frameRef.current?.querySelector<HTMLElement>('[data-slot="navbar"]') ?? null);
  }, []);

  // SidebarNav 点击 → 平滑滚动到对应区块并更新高亮（hash 路由下不真改地址）
  const handleAnchorNavigate = (to: string) => {
    setActiveAnchor(to);
    const target = frameRef.current?.querySelector<HTMLElement>(to);
    if (target) {
      scrollAnimationRef.current?.cancel();
      scrollAnimationRef.current = scrollIntoViewWithMotion(target);
    }
  };

  const sidebarGroups = buildSidebarGroups(copy);

  return (
    <div>
      <DocsPageTitle>{copy.title}</DocsPageTitle>
      <DocsPageLead className="max-w-[720px]">{copy.lead}</DocsPageLead>

      {/* ===== 自包含 mini 壳层（页面本身即活文档）=====
          整块壳层就是一个 SubFrame：内部 HamburgerMenu / BottomSheet 自动把浮层挂到
          这个框架里，不需要再手写 frameRef → container 的接线 */}
      <SubFrame
        ref={frameRef}
        data-slot="app-shell-demo"
        onClickCapture={(event) => {
          const anchor = (event.target as Element).closest("a");
          const href = anchor?.getAttribute("href");
          if (anchor?.closest('[data-slot="menu-nav"], [data-slot="menu-results"]')
            && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
            && SECTION_IDS.some(id => href === `#${id}`)) event.preventDefault();
        }}
        className="border-gray-alpha-400 mt-8 flex h-[min(720px,80dvh)] flex-col rounded-lg border"
      >
        {/* --- Topbar：Logo 文本 + ThemeSwitcher + trailing HamburgerMenu ---
            topbar 是 flex 头部、不参与滚动（static：它本来就不动，再 sticky 会相对
            页面视口黏顶）。滚动 owner 只覆盖其下方区域，滚动条因此不会纵贯顶栏右侧。 */}
        <Navbar scrollBehavior="static" className="shrink-0">
          <div className="border-gray-alpha-400 flex h-full items-center justify-between border-b px-4">
            <a
              href="#demo-overview"
              onClick={(event) => {
                event.preventDefault();
                handleAnchorNavigate("#demo-overview");
              }}
              className="flex items-center gap-2 no-underline"
            >
              <svg viewBox="0 0 24 24" className="size-5 fill-foreground" aria-hidden>
                <path d="M12 2.5 22.5 21h-21L12 2.5Z" />
              </svg>
              <span className="text-label-14 font-medium whitespace-nowrap text-foreground">
                App Shell
              </span>
            </a>
            <div className="flex items-center gap-2">
              {/* 主题切换占位：真实 ThemeSwitcher，双主题下壳层观感即刻可验 */}
              <ThemeSwitcher compact />
              {/* trailing：<lg 的汉堡入口，面板从顶栏底边向下延伸 */}
              <HamburgerMenu
                anchor="topbar"
                anchorElement={navbarEl}
                direction="down"
                maxExpandedWidth="100%"
                content="merged"
                items={[
                  { label: copy.sectionOverview, to: `#${SECTION_IDS[0]}` },
                  { label: copy.sectionApi, to: `#${SECTION_IDS[1]}` },
                  { label: copy.sectionWindow, to: `#${SECTION_IDS[2]}` },
                  { label: copy.sectionMobile, to: `#${SECTION_IDS[3]}` },
                ]}
                onNavigate={(to) => handleAnchorNavigate(to)}
              />
            </div>
          </div>
        </Navbar>

        {/* --- 滚动 owner：topbar 之下的正文区（含页脚） ---
            滚动只发生在这一段内，滚动条轨道从 topbar 底边开始，不穿过顶栏。 */}
        <div data-slot="app-shell-viewport" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {/* --- 中段：lg 断点 SidebarNav + 主内容区 --- */}
        <div className="lg:grid lg:grid-cols-[220px_1fr]">
          {/* 侧栏 sticky 相对本滚动容器：容器顶边已是 topbar 底边，故 top-0 */}
          <aside className="border-gray-alpha-400 hidden self-start lg:sticky lg:top-0 lg:block">
            <SidebarNav
              groups={sidebarGroups}
              activeTo={activeAnchor}
              onNavigate={handleAnchorNavigate}
              side="right"
              className="px-4 py-4"
            />
          </aside>

          <div className="min-w-0 px-6 py-6 lg:px-8">
            {/* 总览卡片区 */}
            <section id={SECTION_IDS[0]} className="scroll-mt-6">
              <h2 className="text-heading-20 text-foreground">{copy.sectionOverview}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {copy.overviewCards.map((card) => (
                  <div
                    key={card.heading}
                    className="border-gray-alpha-400 bg-background rounded-md border p-4"
                  >
                    <h3 className="text-label-16 font-medium text-foreground">{card.heading}</h3>
                    <p className="text-copy-13 mt-2 text-muted-foreground">{card.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 可配项速查表 */}
            <section id={SECTION_IDS[1]} className="scroll-mt-6 mt-10">
              <h2 className="text-heading-20 text-foreground">{copy.sectionApi}</h2>
              <div
                data-slot="docs-local-scroll"
                className="border-gray-alpha-400 mt-4 overflow-x-auto rounded-md border"
              >
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-gray-alpha-400 border-b">
                      <th scope="col" className="text-label-13 px-4 py-2.5 font-medium text-muted-foreground">
                        {copy.apiHeaders.component}
                      </th>
                      <th scope="col" className="text-label-13 px-4 py-2.5 font-medium text-muted-foreground">
                        {copy.apiHeaders.prop}
                      </th>
                      <th scope="col" className="text-label-13 px-4 py-2.5 font-medium text-muted-foreground">
                        {copy.apiHeaders.defaultValue}
                      </th>
                      <th scope="col" className="text-label-13 px-4 py-2.5 font-medium text-muted-foreground">
                        {copy.apiHeaders.description}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {copy.apiRows.map((row) => (
                      <tr key={`${row.component}-${row.prop}`} className="border-gray-alpha-400 border-b last:border-b-0">
                        <td className="text-copy-13 px-4 py-2.5 font-medium whitespace-nowrap text-foreground">
                          {row.component}
                        </td>
                        <td className="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">
                          {row.prop}
                        </td>
                        <td className="text-copy-13 px-4 py-2.5 font-mono whitespace-nowrap text-muted-foreground">
                          {row.defaultValue}
                        </td>
                        <td className="text-copy-13 px-4 py-2.5 text-muted-foreground">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* MenuBar + Toolbar 组合演示：浏览器窗口形态的应用外壳 */}
            <section id={SECTION_IDS[2]} className="scroll-mt-6 mt-10">
              <h2 className="text-heading-20 text-foreground">{copy.sectionWindow}</h2>
              <p className="text-copy-13 mt-2 text-muted-foreground">{copy.windowLead}</p>

              <Browser address={copy.windowAddress} className="mt-4">
                <div className="bg-background-100 px-3 pt-3 pb-3 md:px-4">
                  <MenuBar aria-label={copy.menuBarAriaLabel}>
                    {copy.windowMenus.map((menu, menuIndex) => (
                      <MenuBarMenu key={menu.label}>
                        <MenuBarTrigger>{menu.label}</MenuBarTrigger>
                        <MenuBarContent>
                          {menu.items.map((item, itemIndex) => {
                            const itemKey = `${menuIndex}-${itemIndex}`;
                            if (item.type === "separator") {
                              return <MenuBarSeparator key={itemKey} />;
                            }
                            if (item.type === "checkbox") {
                              return (
                                <MenuBarCheckboxItem
                                  key={itemKey}
                                  checked={checkedItems[itemKey] ?? false}
                                  shortcut={item.shortcut}
                                  onCheckedChange={(value) => {
                                    setCheckedItems((prev) => ({
                                      ...prev,
                                      [itemKey]: value === true,
                                    }));
                                    setLastAction(item.label);
                                  }}
                                >
                                  {item.label}
                                </MenuBarCheckboxItem>
                              );
                            }
                            return (
                              <MenuBarItem
                                key={itemKey}
                                disabled={item.type === "disabled"}
                                shortcut={item.shortcut}
                                onSelect={() => setLastAction(item.label)}
                              >
                                {item.label}
                              </MenuBarItem>
                            );
                          })}
                        </MenuBarContent>
                      </MenuBarMenu>
                    ))}
                  </MenuBar>

                  <Toolbar className="mt-3 bg-background-100">
                    <ToolbarGroup slot="leading">
                      <ToolbarItem
                        iconOnly
                        icon={<ArrowLeft />}
                        label={copy.windowToolbar.back}
                        onSelect={() => setLastAction(copy.windowToolbar.back)}
                      />
                      <ToolbarItem
                        iconOnly
                        icon={<ArrowRight />}
                        label={copy.windowToolbar.forward}
                        onSelect={() => setLastAction(copy.windowToolbar.forward)}
                      />
                      <ToolbarItem
                        iconOnly
                        icon={<RefreshCw />}
                        label={copy.windowToolbar.reload}
                        onSelect={() => setLastAction(copy.windowToolbar.reload)}
                      />
                    </ToolbarGroup>
                    <ToolbarGroup slot="center">
                      <ToolbarItem
                        iconOnly
                        icon={<LayoutGrid />}
                        label={copy.windowToolbar.gridMode}
                        active={viewMode === "grid"}
                        onSelect={() => {
                          setViewMode("grid");
                          setLastAction(copy.windowToolbar.gridMode);
                        }}
                      />
                      <ToolbarItem
                        iconOnly
                        icon={<List />}
                        label={copy.windowToolbar.listMode}
                        active={viewMode === "list"}
                        onSelect={() => {
                          setViewMode("list");
                          setLastAction(copy.windowToolbar.listMode);
                        }}
                      />
                    </ToolbarGroup>
                    <ToolbarGroup slot="trailing">
                      <ToolbarItem
                        icon={<Share2 />}
                        label={copy.windowToolbar.share}
                        onSelect={() => setLastAction(copy.windowToolbar.share)}
                      />
                    </ToolbarGroup>
                  </Toolbar>
                </div>

                {/* 内容区：网格 / 列表两种排布，让 Toolbar 的分段切换可见 */}
                <div
                  data-slot="window-preview"
                  data-view-mode={viewMode}
                  className="bg-background px-4 py-4 md:px-5"
                >
                  <h3 className="text-label-13 font-medium text-muted-foreground">
                    {copy.windowPreviewTitle}
                  </h3>
                  {viewMode === "grid" ? (
                    <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {copy.windowPreviewItems.map((item, index) => {
                        const Icon = WINDOW_PREVIEW_ICONS[index % WINDOW_PREVIEW_ICONS.length];
                        return (
                          <li
                            key={item.name}
                            data-slot="window-preview-item"
                            className="border-gray-alpha-400 bg-background-100 flex flex-col items-center gap-1.5 rounded-md border p-3 text-center"
                          >
                            <Icon className="text-gray-900 size-5" aria-hidden />
                            <span className="text-copy-13 text-foreground">{item.name}</span>
                            <span className="text-label-12 text-muted-foreground">{item.meta}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <ul className="border-gray-alpha-400 divide-gray-alpha-400 mt-3 divide-y overflow-hidden rounded-md border">
                      {copy.windowPreviewItems.map((item, index) => {
                        const Icon = WINDOW_PREVIEW_ICONS[index % WINDOW_PREVIEW_ICONS.length];
                        return (
                          <li
                            key={item.name}
                            data-slot="window-preview-item"
                            className="flex items-center gap-3 px-3 py-2"
                          >
                            <Icon className="text-gray-900 size-4 shrink-0" aria-hidden />
                            <span className="text-copy-13 text-foreground">{item.name}</span>
                            <span className="text-label-12 ml-auto text-muted-foreground">
                              {item.meta}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="bg-background flex min-h-[112px] items-center px-4 py-6 md:px-5">
                  <p className="text-copy-13 text-muted-foreground">
                    {copy.windowStatusPrefix}
                    <span className="font-mono text-foreground">
                      {lastAction ?? copy.windowStatusIdle}
                    </span>
                  </p>
                </div>
              </Browser>
            </section>

            {/* mobileOnly 说明卡：Smartphone 图标 + 「移动端特化」标注 + 内嵌交互 demo */}
            <section id={SECTION_IDS[3]} className="scroll-mt-6 mt-10">
              <h2 className="text-heading-20 text-foreground">{copy.sectionMobile}</h2>
              <div className="border-gray-alpha-400 bg-background mt-4 rounded-md border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <Smartphone className="size-4" aria-hidden />
                    <span className="text-label-14">{copy.mobileBadge}</span>
                  </span>
                  <h3 className="text-label-16 font-medium text-foreground">
                    {copy.mobileOnlyCardHeading}
                  </h3>
                </div>
                <p className="text-copy-13 mt-3 text-muted-foreground">{copy.mobileOnlyCardBody}</p>
                <button
                  type="button"
                  onClick={() => {
                    if (frameRef.current) {
                      scrollAnimationRef.current?.cancel();
                      scrollAnimationRef.current = scrollIntoViewWithMotion(frameRef.current, "center");
                    }
                    setSheetOpen(true);
                  }}
                  className="bg-gray-1000 focus-ring mt-4 inline-flex h-8 cursor-pointer items-center rounded-md px-3 text-label-14 font-medium text-background-100"
                >
                  {copy.sheetTrigger}
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* --- 页脚：两列 + leading 品牌 --- */}
        <Footer
          columns={[...copy.footerColumns]}
          className="px-6 lg:px-8"
          slotLeading={
            <span className="text-copy-13 font-medium whitespace-nowrap text-gray-1000">
              {copy.footerLeading}
            </span>
          }
        />
        </div>

        {/* 内嵌交互式 BottomSheet demo（受控开关 + [0.4, 0.8] 双档位）：
            浮层容器由最近的 SubFrame 继承，无需再手写 container */}
        <BottomSheet open={sheetOpen} onOpenChange={setSheetOpen} detents={[0.4, 0.8]}>
          <div className="flex min-h-[240px] flex-col gap-2 px-6 pt-2 pb-8">
            <h4 className="text-label-16 font-medium text-foreground">{copy.sheetTitle}</h4>
            <p className="text-copy-14 text-muted-foreground">{copy.sheetBody}</p>
          </div>
        </BottomSheet>
      </SubFrame>
    </div>
  );
}
