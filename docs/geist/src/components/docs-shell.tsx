import { Search } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { cn } from "@/lib/utils";

import { NAV_GROUPS, type NavGroup, type NavItem } from "../data/nav";
import { LANGUAGE_OPTIONS, SHELL_COPY } from "../i18n/catalog";
import { useLanguage } from "../i18n/language";

/**
 * 文档站外壳 — Banner + Sidebar。
 * Banner：logo（内联 SVG 三角）+ 搜索框（kbd Ctrl K 提示）+ 三态主题切换。
 * Sidebar：分组导航（Foundations / Components），NavLink 选中态。
 */

/* ---------- Banner ---------- */

function DocsBanner() {
  const { language, setLanguage } = useLanguage();
  const copy = SHELL_COPY[language];

  return (
    <header className="sticky top-0 z-40 mx-auto w-full max-w-[1220px]">
      <div className="bg-background-100 flex h-16 w-full max-w-[1219px] border-b border-l border-r border-gray-alpha-400 pl-[22px] dark:border-[#242424]">
        {/* 左区块：Logo + Search */}
        <div className="border-gray-alpha-400 flex grow items-center gap-4 border-r py-4 pl-px xl:w-[237px] xl:grow-0">
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
        <div className="flex items-center justify-between p-4 xl:grow">
          <div className="relative hidden md:block" role="search">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchAria}
              className="pr-14 pl-9"
            />
            <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 text-label-12 text-muted-foreground">
              Ctrl K
            </kbd>
          </div>
          <div className="flex items-center gap-2">
            <MenuContainer position="bottom-end">
              <MenuButton
                variant="unstyled"
                aria-label={copy.languageAria}
                className="flex h-8 items-center rounded-md px-2 text-label-13 text-muted-foreground hover:bg-gray-alpha-100 hover:text-foreground"
              >
                {LANGUAGE_OPTIONS.find((option) => option.value === language)?.label}
              </MenuButton>
              <Menu width={128} aria-label={copy.languageLabel}>
                {LANGUAGE_OPTIONS.map((option) => (
                  <MenuItem
                    key={option.value}
                    aria-current={option.value === language ? "true" : undefined}
                    className={option.value === language ? "bg-gray-alpha-100" : undefined}
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
    </header>
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
          isActive ? "bg-gray-alpha-100 text-gray-900" : "text-gray-900 hover:bg-gray-alpha-100",
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
    <aside className="hidden w-[260px] shrink-0 self-start overflow-y-auto border-l border-r border-gray-alpha-400 xl:sticky xl:top-16 xl:bottom-0 xl:block xl:h-[calc(100vh-4rem)]">
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
