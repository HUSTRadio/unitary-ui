import { useEffect, useMemo, useRef, useState } from "react";
import { Languages, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  HamburgerMenu,
  type HamburgerMenuHandle,
} from "@/components/ui/hamburger-menu";
import { Input } from "@/components/ui/input";
import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";
import { Navbar } from "@/components/ui/navbar";
import { SidebarNav, type SidebarNavGroup } from "@/components/ui/sidebar-nav";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

import { NAV_GROUPS } from "../data/nav";
import { LANGUAGE_OPTIONS, SHELL_COPY } from "../i18n/catalog";
import { useLanguage } from "../i18n/language";

/**
 * 文档站外壳 — Navbar + Sidebar（框架组件组装层）。
 * Navbar：<Navbar scrollBehavior="pinned"> 内组织 Logo / 搜索框 / 语言菜单 /
 *   主题切换；<lg 显示 HamburgerMenu（topbar 延伸落下 + 内建搜索过滤），
 *   ≥lg 隐藏（桌面形态无汉堡）。
 * Sidebar：lg 断点起常驻的 <SidebarNav>；260px 宽与 sticky 容器由本层控制，
 *   组件只出导航内容。
 */

/* ---------- Navbar ---------- */

function DocsBanner({ onSearchOpen }: { onSearchOpen: () => void }) {
  const { language, setLanguage } = useLanguage();
  const copy = SHELL_COPY[language];
  const navigate = useNavigate();
  // 汉堡面板受控开关：导航后收回面板（与旧壳层 Drawer 行为一致）
  const [menuOpen, setMenuOpen] = useState(false);
  // 搜索模式：<md 用焦点驱动工具行（搜索/主题/语言进面板首行），md–lg 无内建搜索
  const searchMode: "query" | "toolbar" = "toolbar";
  // 命令式句柄：手机端工具行搜索按钮 → openSearch()
  const menuRef = useRef<HamburgerMenuHandle | null>(null);
  // 汉堡面板锚元素：navbar 根元素（面板从其底边延伸落下、与其同宽共享边框）
  const [navbarEl, setNavbarEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setNavbarEl(document.querySelector<HTMLElement>('[data-slot="navbar"]'));
  }, []);
  // 过滤数据源：NAV_GROUPS 扁平化 [{label, to}]，label 随语言
  const menuItems = useMemo(
    () =>
      NAV_GROUPS.flatMap((group) =>
        group.items.map((item) => ({
          label: language === "zh-CN" ? (item.labelZh ?? item.label) : item.label,
          to: item.to,
        })),
      ),
    [language],
  );

  return (
    <Navbar scrollBehavior="pinned">
      {/* 内容容器：Navbar 全宽（border-b 贯穿左右留白），内容 1220px 居中；
          品牌区宽 = sidebar 宽(260) − 内容容器左 padding(22) = 238 → border-r 与 sidebar 右缘对齐 */}
      <div className="mx-auto flex h-full w-full max-w-[1220px] pl-[22px] dark:border-[#242424] max-lg:border-l-0 max-lg:border-r-0 max-md:grid max-md:grid-cols-[44px_1fr_44px] max-md:items-center max-md:pl-0">
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
              ref={menuRef}
              anchor="topbar"
              anchorElement={navbarEl}
              direction="left"
              showCloseButton
              disableSearch={searchMode === "toolbar"}
              searchMode={searchMode}
              maxExpandedHeight="100dvh"
              maxExpandedWidth="292px"
              belowTopbar
              staggerIn
              toolbarLeft={
                searchMode === "toolbar" ? (
                  <button
                    type="button"
                    aria-label={copy.searchAria}
                    onClick={() => menuRef.current?.openSearch()}
                    className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-[var(--ds-gray-alpha-200)]"
                  >
                    <Search className="size-4" aria-hidden />
                  </button>
                ) : undefined
              }
              toolbarRight={
                searchMode === "toolbar" ? (
                  <>
                    <ThemeSwitcher small />
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
                  </>
                ) : undefined
              }
              items={menuItems}
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
            className="flex shrink-0 items-center gap-2 max-md:justify-self-center max-sm:gap-0 sm:gap-2"
            aria-label={copy.homeAria}
          >
            <svg viewBox="0 0 24 24" className="size-6 fill-foreground" aria-hidden>
              <path d="M12 2.5 22.5 21h-21L12 2.5Z" />
            </svg>
            <span className="whitespace-nowrap text-heading-16 text-foreground max-md:block">
              Unitary
            </span>
          </a>
        </div>
        {/* 右区块：Search + ThemeSwitcher */}
        <div className="flex items-center justify-between p-4 lg:grow">
          <div className="relative hidden lg:block" role="search">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchAria}
              readOnly
              onFocus={onSearchOpen}
              onClick={onSearchOpen}
              className="pr-14 pl-9"
            />
            <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 text-label-12 text-muted-foreground">
              Ctrl K
            </kbd>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSearchOpen}
              aria-label={copy.searchAria}
              className="group -m-1.5 shrink-0 rounded-md p-1.5 focus-ring lg:hidden"
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
  // NAV_GROUPS → SidebarNav 数据模型（label/title 随语言）
  const groups: SidebarNavGroup[] = useMemo(
    () =>
      NAV_GROUPS.map((group) => ({
        label: language === "zh-CN" ? (group.titleZh ?? group.title) : group.title,
        items: group.items.map((item) => ({
          label: language === "zh-CN" ? (item.labelZh ?? item.label) : item.label,
          to: item.to,
          icon: item.icon,
        })),
      })),
    [language],
  );

  return (
    <aside className="docs-sidebar relative hidden w-[260px] shrink-0 self-start overflow-y-auto border-l border-gray-alpha-400 lg:sticky lg:top-16 lg:bottom-0 lg:block lg:h-[calc(100vh-4rem)]">
      <SidebarNav
        groups={groups}
        activeTo={pathname}
        onNavigate={(to) => navigate(to)}
        side="left"
        className="h-full min-h-0 border-gray-alpha-400 px-6 pb-3.5 pt-4"
      />
      <div
        className="from-background pointer-events-none absolute inset-x-0 top-0 h-4 bg-linear-to-b"
        aria-hidden
      />
    </aside>
  );
}

export { DocsBanner, DocsSidebar };
