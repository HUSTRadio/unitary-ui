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
 * 2026-08-24, 1536px viewport):
 * - sidebar 259px, padding 24px；item span: h-10(40px), text-copy-14, rounded-md,
 *   px-3 + ml-[-8px]（左溢出 8px 进 padding，hover 背景与侧栏左缘留 16px 视觉对齐）
 * - item 宽 = 内容区全宽 + 8px 左溢出（官方实测 212px）
 * - hover: bg-gray-100；focus-visible: focus-ring（仅键盘）
 * - group heading: h-10, text-copy-14 font-medium
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
          {/* 标题与 item 文本对齐：同 item 一样左溢出 8px（ml-[-8px]）+ px-3 */}
          <div className="mb-0.5 -ml-2 flex h-10 items-center px-3 text-[14px] font-medium leading-5 text-gray-900">
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
                      // 官方实测：item 左溢出 8px（ml-[-8px]）+ pl 补偿，hover 背景
                      // 比文本区宽、与侧栏 padding 形成 16px 视觉左缘
                      "-ml-2 flex h-10 items-center gap-2 rounded-md py-0 pr-3 pl-3 text-copy-14 outline-none",
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
