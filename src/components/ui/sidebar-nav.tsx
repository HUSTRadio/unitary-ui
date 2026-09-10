import type { MouseEvent } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  label: string;
  to: string;
  icon?: LucideIcon;
}

export interface SidebarNavGroup {
  label: string;
  items: SidebarNavItem[];
}

export interface SidebarNavProps {
  /** Grouped navigation entries. */
  groups: SidebarNavGroup[];
  /** `to` value of the currently active item, if any. */
  activeTo?: string;
  /** Called with the item's `to` when a link is activated. */
  onNavigate?: (to: string) => void;
  /** Layout side. `right` adds a left divider; `left` leaves divider ownership to the outer shell. */
  side?: "left" | "right";
  className?: string;
}

/**
 * Shared click-handler factory (exported for unit testing). Native anchor
 * navigation remains intact unless an `onNavigate` interceptor is provided.
 */
export function createNavigateHandler(
  onNavigate: ((to: string) => void) | undefined,
  to: string,
) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      !onNavigate ||
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    onNavigate(to);
  };
}

/**
 * Generic sidebar navigation. Geometry mirrors vercel.com/geist (measured
 * 2026-08-24, 1536px viewport):
 * - sidebar 259px, padding 24px；item span: h-10(40px), text-style-subhead, rounded-md,
 *   px-3 + -mx-1（两侧各外扩 4px）
 * - item 宽 = 内容区全宽 + 8px
 * - hover: bg-gray-100；focus-visible: focus-ring（仅键盘）
 * - group heading: h-10, text-style-subhead font-semibold
 * Apple HIG 优先级说明：HIG 未规定侧栏行几何 → fallback Geist 实测值；
 * HIG 滚动条规范（overlay，不占布局）→ 侧栏滚动条不挤压内容宽度。
 */
export function SidebarNav({
  groups,
  activeTo,
  onNavigate,
  side = "left",
  className,
}: SidebarNavProps) {
  const ariaLabel = groups[0]?.label ?? "Sidebar navigation";
  const sidebarRowInset = "-mx-1 px-3";

  return (
    <nav
      data-slot="sidebar-nav"
      aria-label={ariaLabel}
      className={cn(
        "flex flex-col gap-4",
        side === "left" ? "" : "border-l",
        className,
      )}
    >
      {groups.map((group) => (
        <div key={group.label} data-slot="sidebar-nav-group">
          <div
            data-slot="sidebar-nav-heading"
            className={`${sidebarRowInset} mb-0.5 flex h-10 items-center text-style-subhead font-semibold text-gray-1000`}
          >
            {group.label}
          </div>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = activeTo === item.to;
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <a
                    href={item.to}
                    aria-current={active ? "page" : undefined}
                    onClick={createNavigateHandler(onNavigate, item.to)}
                    data-slot="sidebar-nav-item"
                    className={`${sidebarRowInset} flex h-10 items-center gap-2 rounded-md py-0 text-style-subhead font-normal focus-ring ${
                      active
                        ? "bg-gray-alpha-100 text-gray-1000"
                        : "text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {Icon ? <Icon size={14} /> : null}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
