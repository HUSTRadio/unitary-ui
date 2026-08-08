import { Monitor, Moon, Search, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useTheme, type ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";

import { NAV_GROUPS, type NavGroup, type NavItem } from "../data/nav";

/**
 * 文档站外壳 — Banner + Sidebar。
 * Banner：logo（内联 SVG 三角）+ 搜索框（kbd Ctrl K 提示）+ 三态主题切换。
 * Sidebar：分组导航（Foundations / Brands / Components），NavLink 选中态。
 */

/* ---------- Banner ---------- */

const THEME_OPTIONS: { value: ThemePreference; label: React.ReactNode }[] = [
  {
    value: "system",
    label: (
      <>
        <Monitor className="size-3.5" aria-hidden /> system
      </>
    ),
  },
  {
    value: "light",
    label: (
      <>
        <Sun className="size-3.5" aria-hidden /> light
      </>
    ),
  },
  {
    value: "dark",
    label: (
      <>
        <Moon className="size-3.5" aria-hidden /> dark
      </>
    ),
  },
];

function DocsBanner() {
  const { preference, setPreference } = useTheme();
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background px-6">
      {/* Logo — 内联 SVG 三角（Geist 风格符号） */}
      <a href="#/" className="flex shrink-0 items-center gap-2" aria-label="Geist Style Framework 首页">
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

      {/* 主题切换 — 三态 SegmentedControl（icon + label） */}
      <div className="ml-auto">
        <SegmentedControl
          options={THEME_OPTIONS}
          value={preference}
          onValueChange={(value) => setPreference(value as ThemePreference)}
          ariaLabel="主题切换"
        />
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
          "flex items-center gap-2 rounded-md px-2 py-1.5 text-label-14 transition-colors",
          isActive
            ? "bg-selected text-foreground"
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
    <div className="mb-8">
      <p className="mb-2 px-2 text-label-12 uppercase tracking-wide text-muted-foreground">
        {group.title}
      </p>
      <ul className="space-y-0.5">
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
    <aside className="hidden w-60 shrink-0 border-r border-border bg-surface lg:block">
      <nav className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto px-3 py-6">
        {NAV_GROUPS.map((group) => (
          <DocsSidebarGroup key={group.title} group={group} />
        ))}
      </nav>
    </aside>
  );
}

export { DocsBanner, DocsSidebar };
