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
 * Generic sidebar navigation. Visual contract translated from the docs-shell
 * DocsSidebar: active items use bg-gray-alpha-100 + text-gray-1000, inactive
 * items are text-gray-900 with hover:bg-gray-100. Width is intentionally not
 * constrained here — the outer layout owns the width.
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
      className={cn("flex flex-col", side === "left" ? "border-r" : "border-l", className)}
    >
      {groups.map((group) => (
        <div key={group.label} data-slot="sidebar-nav-group">
          <div className="text-copy-13 text-gray-900 px-3 py-2 font-medium">
            {group.label}
          </div>
          <ul>
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
                      "flex items-center gap-2 rounded-md px-3 py-1.5 text-copy-13 outline-none",
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
