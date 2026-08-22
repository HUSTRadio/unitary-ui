import { useRef, useState } from "react";
import { Languages, Menu as MenuIcon, Search, X } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { cn } from "@/lib/utils";

import { NAV_GROUPS, type NavGroup, type NavItem } from "../data/nav";
import { LANGUAGE_OPTIONS, SHELL_COPY } from "../i18n/catalog";
import { useLanguage } from "../i18n/language";

/**
 * 文档站外壳 — Banner + Sidebar + 窄屏 Drawer 导航。
 * Banner：logo（内联 SVG 三角）+ 搜索框（kbd Ctrl K 提示，点击/聚焦打开命令面板）
 *   + 三态主题切换；<xl 显示汉堡按钮（打开 Drawer 侧栏）与搜索图标（打开命令面板）。
 * Sidebar：分组导航（Foundations / Components），NavLink 选中态。
 */

/* ---------- Banner ---------- */

function DocsBanner({ onSearchOpen }: { onSearchOpen: () => void }) {
  const { language, setLanguage } = useLanguage();
  const copy = SHELL_COPY[language];
  const [menuOpen, setMenuOpen] = useState(false);
  // 打开按钮 ref：Drawer 关闭后焦点返还到它（避免 Radix 自动聚焦面板后的竞态）
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <header className="sticky top-0 z-40 mx-auto w-full max-w-[1220px]">
      <div className="bg-background-100 flex h-16 w-full max-w-[1219px] border-b border-l border-r border-gray-alpha-400 pl-[22px] dark:border-[#242424]">
        {/* 左区块：汉堡按钮 + Logo（xl 以下汉堡可见，点击打开 Drawer 侧栏） */}
        <div className="border-gray-alpha-400 flex grow items-center gap-4 py-4 pl-px lg:w-[237px] lg:grow-0 lg:border-r">
          <button
            type="button"
            ref={menuButtonRef}
            onClick={() => setMenuOpen(true)}
            aria-label={copy.menuOpenAria}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className="group -m-1.5 shrink-0 rounded-md p-1.5 focus-ring lg:hidden"
          >
            {/* 视觉保持 32px，命中区经 -m-1.5 p-1.5 扩到 44px（Apple HIG ≥44pt / WCAG 2.5.8） */}
            <span className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-gray-alpha-100 group-hover:text-foreground">
              <MenuIcon className="size-4" aria-hidden />
            </span>
          </button>
          <a href="#/" className="flex shrink-0 items-center gap-2" aria-label={copy.homeAria}>
            <svg viewBox="0 0 24 24" className="size-5 fill-foreground" aria-hidden>
              <path d="M12 2.5 22.5 21h-21L12 2.5Z" />
            </svg>
            <span className="hidden whitespace-nowrap text-label-14 font-medium text-foreground sm:block">
              Geist Style Framework
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
              {/* 视觉保持 32px，命中区扩到 44px（同汉堡按钮） */}
              <span className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-gray-alpha-100 group-hover:text-foreground">
                <Search className="size-4" aria-hidden />
              </span>
            </button>
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
            <ThemeSwitcher />
          </div>
        </div>
      </div>
      {/* 窄屏 Drawer 侧栏 — NAV_GROUPS + 搜索框（含 Ctrl K 提示，点击打开命令面板） */}
      <Drawer
        show={menuOpen}
        onDismiss={() => setMenuOpen(false)}
        restoreFocusTo={menuButtonRef}
        verticalScroll
        aria-label={copy.menuOpenAria}
      >
        <DocsMobileNav onClose={() => setMenuOpen(false)} />
      </Drawer>
    </header>
  );
}

/* ---------- 窄屏 Drawer 导航 ---------- */

function DocsMobileNav({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const copy = SHELL_COPY[language];
  const [filter, setFilter] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const query = filter.trim().toLocaleLowerCase();
  // P1-3：打开时自动滚动到当前激活项（官方 cmdk 打开即 aria-selected 当前页）
  React.useEffect(() => {
    const active = rootRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    // setTimeout 而非 rAF：后台标签页 rAF 会被挂起；面板在 effect 时已完成布局
    const timer = window.setTimeout(() => {
      active?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  // 就地过滤：命中条目 label/labelZh（按当前语言）或分组标题的组保留，其余隐藏
  const groups = query
    ? NAV_GROUPS.map((group) => {
        const groupTitle = language === "zh-CN" ? (group.titleZh ?? group.title) : group.title;
        const items = group.items.filter((item) => {
          const label = language === "zh-CN" ? (item.labelZh ?? item.label) : item.label;
          return (
            label.toLocaleLowerCase().includes(query) ||
            groupTitle.toLocaleLowerCase().includes(query)
          );
        });
        return items.length > 0 ? { ...group, items } : null;
      }).filter((group): group is NavGroup => group !== null)
    : NAV_GROUPS;
  const hasResults = groups.some((group) => group.items.length > 0);

  return (
    <div className="px-6 pt-5 pb-6" ref={rootRef}>
      {/* 就地过滤输入（P1-1）：替代原「打开独立命令面板」的搜索行 */}
      <div className="relative mb-5">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={copy.mobileSearchPlaceholder}
          aria-label={copy.searchAria}
          className="pr-10 pl-9"
        />
        {filter ? (
          <button
            type="button"
            onClick={() => setFilter("")}
            aria-label={copy.searchClearAria}
            className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-alpha-100 hover:text-foreground focus-ring"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        ) : null}
      </div>
      {hasResults ? (
        <nav className="flex flex-col gap-5" aria-label={copy.components}>
          {groups.map((group) => (
            <div key={group.title}>
              <p className="text-label-14 font-medium mb-1 pl-1 text-foreground">
                {language === "zh-CN" ? (group.titleZh ?? group.title) : group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          "flex h-10 items-center gap-2.5 rounded-md px-3 py-1.5 text-copy-14 outline-none transition-colors",
                          isActive
                            ? "bg-gray-alpha-100 text-gray-1000"
                            : "text-gray-900 hover:bg-gray-100",
                        )
                      }
                    >
                      {language === "zh-CN" ? (item.labelZh ?? item.label) : item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      ) : (
        <p className="px-1 py-6 text-center text-copy-14 text-muted-foreground">
          {copy.searchNoResults}
        </p>
      )}
    </div>
  );
}

/* ---------- Sidebar ---------- */

function DocsSidebarLink({ item }: { item: NavItem }) {
  const { language } = useLanguage();
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          "group relative -ml-2 flex h-10 items-center gap-2.5 rounded-md px-3 py-1.5 text-copy-14 outline-none transition-colors",
          isActive ? "bg-gray-alpha-100 text-gray-1000" : "text-gray-900 hover:bg-gray-100",
        )
      }
    >
      {Icon && <Icon className="size-3.5 shrink-0 text-current" aria-hidden />}
      {language === "zh-CN" ? (item.labelZh ?? item.label) : item.label}
    </NavLink>
  );
}

function DocsSidebarGroup({ group }: { group: NavGroup }) {
  const { language } = useLanguage();
  return (
    <div>
      <p className="text-label-14 font-medium mb-0.5 flex h-10 items-center gap-2 py-1.5 pl-1">
        {language === "zh-CN" ? (group.titleZh ?? group.title) : group.title}
      </p>
      <ul className="relative space-y-0.5" style={{ width: "calc(100% + 8px)" }}>
        {group.items.map((item) => (
          <li key={item.to}>
            <DocsSidebarLink item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DocsSidebar() {
  return (
    <aside className="hidden w-[260px] shrink-0 self-start overflow-y-auto border-l border-r border-gray-alpha-400 lg:sticky lg:top-16 lg:bottom-0 lg:block lg:h-[calc(100vh-4rem)]">
      <nav className="relative flex h-full min-h-0 flex-col space-y-4 overflow-y-auto px-6 pb-3.5 pt-4">
        {NAV_GROUPS.map((group) => (
          <DocsSidebarGroup key={group.title} group={group} />
        ))}
      </nav>
      <div
        className="from-background pointer-events-none absolute inset-x-0 top-0 h-4 bg-linear-to-b"
        aria-hidden
      />
    </aside>
  );
}

export { DocsBanner, DocsSidebar };
