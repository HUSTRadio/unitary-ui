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
  /** Which edge carries the separator border. @default "left" */
  side?: "left" | "right";
  className?: string;
}

/**
 * Shared click-handler factory (exported for unit testing): prevents the
 * default anchor navigation and forwards the item's `to` to `onNavigate`.
 */
export function createNavigateHandler(
  onNavigate: ((to: string) => void) | undefined,
  to: string,
) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate?.(to);
  };
}

/**
 * Generic sidebar navigation. Geometry mirrors vercel.com/geist (measured
 * 2026-08-23, 1440px viewport):
 * - nav item: h-10 (40px) row, text-copy-14, 2px gap between rows (space-y-0.5)
 * - group heading: h-10 flex items-center, text-[14px] leading-5 font-medium
 *   text-gray-900, mb-0.5
 * - group spacing: 16px between groups (space-y-4 on the outer column)
 */
export function SidebarNav({
  groups,
  activeTo,
  onNavigate,
  side = "left",
  className,
}: SidebarNavProps) {
  const ariaLabel = groups[0]?.label ?? "Sidebar navigation";

  return (
    <nav
      data-slot="sidebar-nav"
      aria-label={ariaLabel}
      className={cn(
        "flex flex-col gap-4",
        side === "left" ? "border-r" : "border-l",
        className,
      )}
    >
      {groups.map((group) => (
        <div key={group.label} data-slot="sidebar-nav-group">
          <div className="mb-0.5 flex h-10 items-center px-3 text-[14px] font-medium leading-5 text-gray-900">
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
                    className={cn(
                      "flex h-10 items-center gap-2 rounded-md px-3 text-copy-14 outline-none",
                      active
                        ? "bg-gray-alpha-100 text-gray-1000"
                        : "text-gray-900 hover:bg-gray-100",
                    )}
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
