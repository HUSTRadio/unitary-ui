import { useEffect, useRef, useState } from "react";
import { LayoutTemplate, Rows3, Smartphone } from "lucide-react";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Footer } from "@/components/ui/footer";
import { HamburgerMenu } from "@/components/ui/hamburger-menu";
import { Navbar } from "@/components/ui/navbar";
import { SidebarNav, type SidebarNavGroup } from "@/components/ui/sidebar-nav";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

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

const DEMO_COPY = {
  "zh-CN": {
    title: "App Shell 应用壳层",
    lead: "本页是一个自包含的壳层组装演示：顶栏、侧边导航、内容区与页脚全部由框架组件拼装而成。缩放窗口跨过 lg 断点（1024px）即可看到侧边导航与汉堡菜单两种形态的连贯切换。",
    sectionOverview: "总览",
    overviewCards: [
      {
        heading: "Navbar",
        body: "scrollBehavior 支持 static / pinned / auto-hide 三种定位行为；variant 支持 solid / transparent，transparent 可配合 solidOnScroll 在滚动后自动补底色。",
      },
      {
        heading: "SidebarNav",
        body: "通用侧边导航：groups 分组数据、activeTo 高亮当前项、side 控制分隔边，条目可带右侧状态胶囊。打开 collapsible 后分组标题可点击开合。宽度由外层布局控制，lg 断点起显示。",
      },
      {
        heading: "HamburgerMenu",
        body: "HamburgerIcon + ExpandPanel 复合组件：anchor=topbar 时面板从顶栏底边向下延伸（同宽、共享底边框），内建搜索过滤，输入即收起导航列表并渲染结果。",
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
    ] as ApiRowCopy[],
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
    lead: "This page is a self-contained shell assembly demo: topbar, sidebar navigation, content area and footer are all composed from framework components. Resize the window across the lg breakpoint (1024px) to see the coherent switch between the sidebar and the hamburger menu forms.",
    sectionOverview: "Overview",
    overviewCards: [
      {
        heading: "Navbar",
        body: "scrollBehavior supports static / pinned / auto-hide positioning; variant supports solid / transparent, and transparent pairs with solidOnScroll to restore surface after scrolling.",
      },
      {
        heading: "SidebarNav",
        body: "Generic sidebar navigation: grouped data, activeTo highlights the current item, side picks the separator edge, and items can carry a trailing status pill. With collapsible on, group headings toggle open and closed. Width is owned by the outer layout; visible from the lg breakpoint.",
      },
      {
        heading: "HamburgerMenu",
        body: "HamburgerIcon + ExpandPanel composite: with anchor=topbar the panel extends downward from the topbar's bottom edge (same width, shared border), with built-in search filtering.",
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
    ] as ApiRowCopy[],
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
const SECTION_IDS = ["demo-overview", "demo-api", "demo-mobile"] as const;

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
      label: copy.sectionMobile,
      items: [{ label: copy.sectionMobile, to: `#${SECTION_IDS[2]}`, icon: Smartphone }],
    },
  ];
}

export function AppShellDemo({ language }: { language: DocsLanguage }) {
  const copy = DEMO_COPY[language];
  const [activeAnchor, setActiveAnchor] = useState<string>(`#${SECTION_IDS[0]}`);
  const [sheetOpen, setSheetOpen] = useState(false);
  // mini navbar 根元素：HamburgerMenu side=top 面板从其底边延伸落下
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [navbarEl, setNavbarEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setNavbarEl(frameRef.current?.querySelector<HTMLElement>('[data-slot="navbar"]') ?? null);
  }, []);

  // SidebarNav 点击 → 平滑滚动到对应区块并更新高亮（hash 路由下不真改地址）
  const handleAnchorNavigate = (to: string) => {
    setActiveAnchor(to);
    document.getElementById(to.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sidebarGroups = buildSidebarGroups(copy);

  return (
    <div>
      <DocsPageTitle>{copy.title}</DocsPageTitle>
      <DocsPageLead className="max-w-[720px]">{copy.lead}</DocsPageLead>

      {/* ===== 自包含 mini 壳层（页面本身即活文档） ===== */}
      <div
        ref={frameRef}
        data-slot="app-shell-demo"
        className="border-gray-alpha-400 mt-8 overflow-clip rounded-lg border"
      >
        {/* --- Topbar：Logo 文本 + ThemeSwitcher + trailing HamburgerMenu --- */}
        <Navbar scrollBehavior="pinned">
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
              <ThemeSwitcher small />
              {/* trailing：<lg 的汉堡入口，面板从顶栏底边向下延伸 */}
              <HamburgerMenu
                anchor="topbar"
                anchorElement={navbarEl}
                direction="down"
                content="merged"
                items={[
                  { label: copy.sectionOverview, to: `#${SECTION_IDS[0]}` },
                  { label: copy.sectionApi, to: `#${SECTION_IDS[1]}` },
                  { label: copy.sectionMobile, to: `#${SECTION_IDS[2]}` },
                ]}
                onNavigate={(to) => handleAnchorNavigate(to)}
              />
            </div>
          </div>
        </Navbar>

        {/* --- 中段：lg 断点 SidebarNav + 主内容区 --- */}
        <div className="lg:grid lg:grid-cols-[220px_1fr]">
          <aside className="border-gray-alpha-400 hidden self-start lg:sticky lg:top-16 lg:block">
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
            <section id={SECTION_IDS[0]} className="scroll-mt-32">
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
            <section id={SECTION_IDS[1]} className="scroll-mt-32 mt-10">
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

            {/* mobileOnly 说明卡：Smartphone 图标 + 「移动端特化」标注 + 内嵌交互 demo */}
            <section id={SECTION_IDS[2]} className="scroll-mt-32 mt-10">
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
                  onClick={() => setSheetOpen(true)}
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

      {/* 内嵌交互式 BottomSheet demo（受控开关 + [0.4, 0.8] 双档位） */}
      <BottomSheet open={sheetOpen} onOpenChange={setSheetOpen} detents={[0.4, 0.8]}>
        <div className="flex min-h-[240px] flex-col gap-2 px-6 pt-2 pb-8">
          <h4 className="text-label-16 font-medium text-foreground">{copy.sheetTitle}</h4>
          <p className="text-copy-14 text-muted-foreground">{copy.sheetBody}</p>
        </div>
      </BottomSheet>
    </div>
  );
}
