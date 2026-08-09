import { Search } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { cn } from "@/lib/utils";

import { NAV_GROUPS, type NavGroup, type NavItem } from "../data/nav";

/**
 * 文档站外壳 — Banner + Sidebar。
 * Banner：logo（内联 SVG 三角）+ 搜索框（kbd Ctrl K 提示）+ 三态主题切换。
 * Sidebar：分组导航（Foundations / Components），NavLink 选中态。
 */

/* ---------- Banner ---------- */

function DocsBanner() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background px-6">
      {/* Logo — 内联 SVG 三角（Geist 风格符号） */}
      <a
        href="#/"
        className="flex shrink-0 items-center gap-2"
        aria-label="Geist Style Framework 首页"
      >
        <svg viewBox="0 0 24 24" className="size-5 fill-foreground" aria-hidden>
          <path d="M12 2.5 22.5 21h-21L12 2.5Z" />
        </svg>
        <span className="hidden whitespace-nowrap text-label-14 font-medium text-foreground sm:block">
          Geist Style Framework
        </span>
      </a>

      {/* Search — 复用根 Input，右侧 kbd 提示 */}
      <div className="relative hidden w-72 md:block" role="search">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input placeholder="Search Geist" aria-label="搜索文档" className="pr-14 pl-9" />
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 text-label-12 text-muted-foreground">
          Ctrl K
        </kbd>
      </div>

      {/* 主题切换 — 官方三态 ThemeSwitcher */}
      <div className="ml-auto">
        <ThemeSwitcher small />
      </div>
    </header>
  );
}

/* ---------- Sidebar ---------- */

function DocsSidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          "group relative -ml-2 flex h-10 items-center gap-2.5 rounded-md px-3 py-1.5 text-[14px] leading-5 outline-none transition-colors",
          isActive
            ? "bg-gray-alpha-100 text-foreground"
            : "text-muted-foreground hover:bg-gray-alpha-100 hover:text-foreground",
        )
      }
    >
      {Icon && <Icon className="size-3.5 shrink-0 text-current" aria-hidden />}
      {item.label}
    </NavLink>
  );
}

function DocsSidebarGroup({ group }: { group: NavGroup }) {
  return (
    <div className="mb-0.5">
      <p className="mb-0.5 flex h-10 items-center gap-2 py-1.5 pl-1 text-[14px] leading-5 font-medium text-foreground">
        {group.title}
      </p>
      <ul>
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
    <aside className="hidden w-[260px] shrink-0 border-r border-border lg:block">
      <nav className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <DocsSidebarGroup key={group.title} group={group} />
        ))}
      </nav>
    </aside>
  );
}

export { DocsBanner, DocsSidebar };
