import { useEffect, useMemo, useState } from "react";
import { Languages, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { HamburgerMenu } from "@/components/ui/hamburger-menu";
import { Input } from "@/components/ui/input";
import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";
import { NAV_CONTENT_INSET } from "@/components/ui/nav-layout";
import { Navbar } from "@/components/ui/navbar";
import {
  SidebarNav,
  type SidebarNavBadge,
  type SidebarNavGroup,
} from "@/components/ui/sidebar-nav";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useDismissOnNavigate } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { UnitaryLogoHorizontal } from "./unitary-logo";

import type { DocsRouteStatus } from "../data/docs-routes";
import { NAV_GROUPS } from "../data/nav";
import { LANGUAGE_OPTIONS, SHELL_COPY, type ShellCopy } from "../i18n/catalog";
import { useLanguage } from "../i18n/language";

/**
 * 文档站外壳 — Navbar + Sidebar（框架组件组装层）。
 * Navbar：<Navbar scrollBehavior="pinned"> 内组织 Logo / 搜索框 / 语言菜单 /
 *   主题切换；<lg 显示 HamburgerMenu（topbar 延伸落下 + 内建搜索过滤），
 *   ≥lg 隐藏（桌面形态无汉堡）。面板工具行（搜索/主题/语言）只在 <md 渲染，
 *   md 起该行整行隐藏——topbar 自身已有这些入口，且关闭控件由触发按钮承担。
 * Sidebar：lg 断点起常驻的 <SidebarNav>；260px 宽与 sticky 容器由本层控制，
 *   组件只出导航内容；内容内缩与滚动条槽位来自库内共享契约（NAV_CONTENT_INSET /
 *   nav-scroll）——与 <lg 的抽屉导航同一组数值，折叠换形态不换排版。
 */

/* ---------- Navbar ---------- */
/**
 * 桌面侧栏分组折叠状态的记忆键（localStorage）。
 * 键名与组件库无关：记忆是文档站自身的偏好，组件只负责读写。
 */
const SIDEBAR_COLLAPSE_KEY = "unitary.docs.sidebar.collapsed-groups";

/** registry 的状态标记 → 条目右端胶囊（色调随标记，文案随语言）。 */
function statusBadge(
  status: DocsRouteStatus | undefined,
  copy: ShellCopy,
): SidebarNavBadge | undefined {
  if (!status) return undefined;
  return { tone: status, label: status === "new" ? copy.itemBadgeNew : copy.itemBadgeUpdated };
}

function DocsBanner({ onSearchOpen }: { onSearchOpen: () => void }) {
  const { language, setLanguage } = useLanguage();
  const { pathname } = useLocation();
  const copy = SHELL_COPY[language];
  const navigate = useNavigate();
  // 汉堡面板受控开关：导航后收回面板（与旧壳层 Drawer 行为一致）
  const [menuOpen, setMenuOpen] = useState(false);
  // HIG-AUD-017：任何导航（前进/后退、程序化 navigate、面板外的链接）都收起面板；
  // 点击面板条目这条路径已由 HamburgerMenu 自身关闭 + 下面的 onNavigate 兜底。
  useDismissOnNavigate(() => setMenuOpen(false));
  // <md 的主题/语言进面板工具行；搜索始终由可见顶栏的 CommandMenu 入口负责。
  // Theme/language move into the mobile toolbar; search stays in the topbar.
  const searchMode: "query" | "toolbar" = "toolbar";
  // 汉堡面板锚元素：navbar 根元素（面板从其底边延伸落下、与其同宽共享边框）
  const [navbarEl, setNavbarEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setNavbarEl(document.querySelector<HTMLElement>('[data-slot="navbar"]'));
  }, []);
  // 保留 NAV_GROUPS 分组、二级分类与小标题；label/title 均随语言。
  // id 必须显式带上：折叠记忆键与侧栏同源（两侧共用 SIDEBAR_COLLAPSE_KEY）。
  const menuGroups = useMemo(
    () =>
      NAV_GROUPS.map((group) => ({
        id: group.id,
        title: language === "zh-CN" ? (group.titleZh ?? group.title) : group.title,
        items: group.items.map((item) => ({
          label: language === "zh-CN" ? (item.labelZh ?? item.label) : item.label,
          to: item.to,
          badge: statusBadge(item.status, copy),
        })),
        ...(group.subgroups
          ? {
              subgroups: group.subgroups.map((subgroup) => ({
                title:
                  language === "zh-CN" ? (subgroup.titleZh ?? subgroup.title) : subgroup.title,
                items: subgroup.items.map((item) => ({
                  label: language === "zh-CN" ? (item.labelZh ?? item.label) : item.label,
                  to: item.to,
                  badge: statusBadge(item.status, copy),
                })),
              })),
            }
          : {}),
      })),
    [copy, language],
  );

  return (
    <Navbar scrollBehavior="pinned" className="mx-auto w-full max-w-[1220px]">
      {/* Navbar 容器本身即 1220px 居中 sticky 块（官方架构，回退 f08fd84 全宽化）：
          留白区透出页面底色；内层只做内容布局，不再重复 mx-auto/max-w。
          品牌区宽 = sidebar 宽(260) − 内容容器左 padding(22) = 238 → border-r 与 sidebar 右缘对齐 */}
      <div className="flex h-full w-full pl-[22px] border-gray-alpha-400 lg:border-l lg:border-r max-lg:border-l-0 max-lg:border-r-0 max-md:grid max-md:grid-cols-[44px_1fr_44px] max-md:items-center max-md:px-3">
        {/* 左区块：汉堡按钮（<lg 可见）+ Logo */}
        <div className="border-gray-alpha-400 flex grow items-center gap-2 py-4 pl-px lg:w-[238px] lg:grow-0 lg:border-r max-md:contents">
          {/* max-md:contents —— 左区块解体为 grid item：汉堡占第1列、品牌占第2列（居中） */}
          {/* 双向锁：容器 lg:hidden —— ≥lg 无汉堡按钮；ExpandPanel 经 Portal 渲染不受影响 */}
          <div
            className="lg:hidden"
            /* 面板内链接 href 为裸路径，hash 路由下交由 react-router 导航：
               捕获阶段拦下浏览器默认整页跳转 */
            onClickCapture={(event) => {
              const anchor = (event.target as HTMLElement).closest("a");
              if (anchor?.getAttribute("href")?.startsWith("/")) event.preventDefault();
            }}
          >
            <HamburgerMenu
              anchor="topbar"
              anchorElement={navbarEl}
              direction="left"
              /* belowTopbar 下不传 showCloseButton：topbar 保持可见可交互，其触发
                 按钮在打开态即为关闭控件（组件契约同样忽略该 prop），面板内再加
                 一个 X 会与它垂直相邻、功能重复。
                 md 起整行隐藏工具行：≥md 时 topbar 已提供搜索/主题/语言入口，
                 slots 在该区间无内容，不隐藏会留下 64px 空行。 */
              className="[&>[data-slot=panel-toolbar]]:md:hidden"
              disableSearch={searchMode === "toolbar"}
              searchMode={searchMode}
              maxExpandedHeight="100dvh"
              maxExpandedWidth="292px"
              belowTopbar
              staggerIn
              /* 抽屉是「侧栏折叠后的形态」：排版与交互同源（nav-layout 契约），
                 分组标题同样可折叠，并共用侧栏的折叠记忆键——换形态不换排版、
                 也不换用户的折叠偏好。 */
              collapsible
              persistKey={SIDEBAR_COLLAPSE_KEY}
              toolbarRight={
                searchMode === "toolbar" ? (
                  <div className="flex items-center gap-2">
                    <div className="[&_button]:min-h-11 [&_button]:min-w-11 [&_button]:px-1">
                      <ThemeSwitcher small />
                    </div>
                    <MenuContainer position="bottom-end">
                      <MenuButton
                        variant="unstyled"
                        aria-label={copy.languageAria}
                        className="flex size-11 items-center justify-center rounded-md text-muted-foreground hover:bg-gray-alpha-100 hover:text-foreground focus-ring"
                      >
                        <Languages className="size-4 shrink-0" aria-hidden />
                      </MenuButton>
                      <Menu width={128} stateful aria-label={copy.languageLabel}>
                        {LANGUAGE_OPTIONS.map((option) => (
                          <MenuItem
                            key={option.value}
                            aria-current={option.value === language ? "true" : undefined}
                            active={option.value === language}
                            onSelect={() => setLanguage(option.value)}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </MenuContainer>
                  </div>
                ) : undefined
              }
              groups={menuGroups}
              activeTo={pathname}
              open={menuOpen}
              onOpenChange={setMenuOpen}
              onNavigate={(to) => {
                navigate(to);
                setMenuOpen(false);
              }}
            />
          </div>
          <a
            href="#/"
            data-slot="docs-topbar-brand"
            className="flex shrink-0 items-center max-md:justify-self-center"
            aria-label={copy.homeAria}
          >
            {/* 横版品牌 Logo：mark 蓝块 + D-DIN Pro "Unitary" 轮廓一体成型，
                替代原先「三角图标 + 文字」组合；高 24px 时 cap 高 ≈16.6px，
                与原 text-heading-16 视觉字号衔接 */}
            <UnitaryLogoHorizontal className="h-6 w-auto" />
          </a>
        </div>
        {/* 右区块：Search + ThemeSwitcher */}
        <div className="flex items-center justify-between p-4 max-md:p-0 lg:grow">
          <div className="relative hidden lg:block" role="search" data-slot="docs-desktop-search">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            {/* 入口只由点击/键盘打开：CommandMenu 关闭时按 HIG 把焦点还给触发元素，
                若触发元素用 onFocus 打开（此前的 readOnly + onFocus），焦点归还
                会立刻再次打开面板，形成「ESC/点空白关闭 → 立即重开」的死循环。 */}
            <Input
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchAria}
              readOnly
              onClick={onSearchOpen}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSearchOpen();
                }
              }}
              className="cursor-pointer pr-14 pl-9"
            />
            <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 text-label-12 text-muted-foreground">
              Ctrl K
            </kbd>
          </div>
          <div className="flex items-center gap-2" data-slot="docs-topbar-actions">
            <button
              type="button"
              onClick={onSearchOpen}
              aria-label={copy.searchAria}
              className="group -m-1.5 shrink-0 rounded-md p-1.5 focus-ring max-md:[margin-right:0px] lg:hidden"
            >
              {/* 视觉保持 32px，命中区扩到 44px（Apple HIG ≥44pt / WCAG 2.5.8） */}
              <span className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-gray-alpha-100 group-hover:text-foreground">
                <Search className="size-4" aria-hidden />
              </span>
            </button>
            {/* 语言菜单：移动端（<md）收进抽屉工具行，topbar 仅 ≥md 显示 */}
            <div className="max-md:hidden">
              <MenuContainer position="bottom-end">
                <MenuButton
                  variant="unstyled"
                  aria-label={copy.languageAria}
                  className="flex h-8 items-center gap-1.5 rounded-md px-2 text-label-13 text-muted-foreground hover:bg-gray-alpha-100 hover:text-foreground focus-ring"
                >
                  <Languages className="size-3.5 shrink-0" aria-hidden />
                  {LANGUAGE_OPTIONS.find((option) => option.value === language)?.label}
                </MenuButton>
                <Menu width={128} stateful aria-label={copy.languageLabel}>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <MenuItem
                      key={option.value}
                      aria-current={option.value === language ? "true" : undefined}
                      active={option.value === language}
                      onSelect={() => setLanguage(option.value)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Menu>
              </MenuContainer>
            </div>
            {/* 主题切换：同语言菜单，<md 收进抽屉工具行 */}
            <div className="max-md:hidden">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
}

/* ---------- Sidebar ---------- */

function DocsSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const copy = SHELL_COPY[language];
  // NAV_GROUPS → SidebarNav 数据模型（label/title 随语言，二级分类与状态胶囊一并投影）
  const groups: SidebarNavGroup[] = useMemo(
    () =>
      NAV_GROUPS.map((group) => ({
        id: group.id,
        label: language === "zh-CN" ? (group.titleZh ?? group.title) : group.title,
        items: group.items.map((item) => ({
          label: language === "zh-CN" ? (item.labelZh ?? item.label) : item.label,
          to: item.to,
          icon: item.icon,
          badge: statusBadge(item.status, copy),
        })),
        ...(group.subgroups
          ? {
              subgroups: group.subgroups.map((subgroup) => ({
                label:
                  language === "zh-CN" ? (subgroup.titleZh ?? subgroup.title) : subgroup.title,
                items: subgroup.items.map((item) => ({
                  label: language === "zh-CN" ? (item.labelZh ?? item.label) : item.label,
                  to: item.to,
                  icon: item.icon,
                  badge: statusBadge(item.status, copy),
                })),
              })),
            }
          : {}),
      })),
    [copy, language],
  );

  return (
    <aside
      data-slot="docs-sidebar"
      className={cn(
        // 滚动条槽位与细滚动条走库内标准工具类（nav-scroll），内容内缩走共享契约
        // （NAV_CONTENT_INSET）：与抽屉导航区同一组数值 → 折叠成抽屉时文字列不变。
        "nav-scroll relative hidden w-[260px] shrink-0 self-start overflow-y-auto border-l border-r border-gray-alpha-400 lg:sticky lg:top-16 lg:bottom-0 lg:block lg:h-[calc(100vh-4rem)]",
        NAV_CONTENT_INSET,
      )}
    >
      <SidebarNav
        groups={groups}
        activeTo={pathname}
        onNavigate={(to) => navigate(to)}
        side="left"
        collapsible
        persistKey={SIDEBAR_COLLAPSE_KEY}
        className="min-h-full"
      />
      <div
        className="from-background pointer-events-none absolute inset-x-0 top-0 h-4 bg-linear-to-b"
        aria-hidden
      />
    </aside>
  );
}

export { DocsBanner, DocsSidebar };
