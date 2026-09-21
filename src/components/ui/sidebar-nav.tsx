import * as React from "react";
import type { MouseEvent } from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { ChevronDown, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { NavStatusBadge, type NavStatusTone } from "./nav-status-badge";

/** 条目右端状态胶囊（对齐 Tremor 文档侧栏的 `Updated` 徽标形态）。 */
export interface SidebarNavBadge {
  label: string;
  /** 视觉色调：`new` 走蓝色档，`updated` 走中性灰档。@default "new" */
  tone?: NavStatusTone;
}

export interface SidebarNavItem {
  label: string;
  to: string;
  icon?: LucideIcon;
  /** 可选的右端状态胶囊。 */
  badge?: SidebarNavBadge;
}

/** 分组内的二级分类条目。 */
export interface SidebarNavSubgroup {
  label: string;
  items: SidebarNavItem[];
}

export interface SidebarNavGroup {
  /**
   * 与语言无关的稳定标识，用于折叠状态记忆；缺省回退 `label`。
   * label 会随语言变化，有 i18n 的调用方应显式传入 id。
   */
  id?: string;
  label: string;
  /** 分组内全部条目（扁平）；有 subgroups 时是其顺序一致的投影。 */
  items: SidebarNavItem[];
  /**
   * 可选的二级分类。存在时按分类渲染二级小标题，条目以 subgroups 为准；
   * 不传则维持单层分组形态。
   */
  subgroups?: SidebarNavSubgroup[];
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
  /** 分组标题可点击开合。@default false */
  collapsible?: boolean;
  /**
   * 折叠状态记忆键：传入后折叠结果写入 `localStorage` 并在下次挂载恢复；
   * 不传则完全无持久化。首帧一律全展开（静态渲染不触碰存储）。
   */
  persistKey?: string;
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

/*
 * 行几何与配色：vercel.com/geist 侧栏实测（2026-08-24）→ Tremor 文档站侧栏实测
 * （2026-09-21，1440px，明暗双主题 computed styles）后的 Unitary token 落点：
 * - 条目行：rounded-md + py-1.5(6px) + HIG Subhead(15/20) → 行高 32px（Tremor 实测 32px）
 * - 行内缩：-mx-1 px-3.5（两侧各外扩 4px，文字左内缩 14px；Tremor pl-3.5 同值）
 * - 默认文字 text-gray-900（light #4d4d4d ≈ Tremor gray-600；dark #a1a1a1 ≈ Tremor gray-400）
 * - 悬停 bg-gray-100 + text-gray-1000（Tremor hover:bg-gray-100 + hover:text-gray-800）
 * - 选中 = 与悬停同底色 + 强化文字 + 左侧 2×16px 指示条（Tremor 签名式做法，无独立底色）
 * - 分组标题 text-style-subhead font-semibold tracking-wide + text-gray-1000
 *   （Tremor：text-sm font-semibold tracking-wide text-gray-800，标题强于条目）
 * - 状态胶囊 text-label-12 + rounded-sm + px-1.5 py-0.5（Tremor：text-xs 500 + px-1.5 py-0.5）
 * Apple HIG 优先级说明：HIG 未规定侧栏行几何 → fallback 实测值；
 * HIG 滚动条规范（overlay，不占布局）→ 侧栏滚动条不挤压内容宽度。
 */

/** 行内缩契约：标题行与条目行共用，保证文字左缘对齐。 */
const ROW_INSET = "-mx-1 px-3.5";
const HEADING_BASE = `${ROW_INSET} flex h-8 items-center gap-2 rounded-md text-style-subhead font-semibold tracking-wide text-gray-1000 focus-ring`;
const ITEM_BASE = `${ROW_INSET} relative flex items-center gap-2 rounded-md py-1.5 text-style-subhead focus-ring`;

/** 折叠记忆读取：存储不可用时静默降级为「无记忆」。 */
function readCollapsedGroups(key: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set<string>();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set<string>();
    return new Set(parsed.filter((entry): entry is string => typeof entry === "string"));
  } catch {
    return new Set<string>();
  }
}

/** 折叠记忆写入：隐私模式/配额受限时静默降级为「不记忆」。 */
function writeCollapsedGroups(key: string, collapsed: ReadonlySet<string>): void {
  try {
    window.localStorage.setItem(key, JSON.stringify([...collapsed]));
  } catch {
    // 折叠本身仍然工作，只是跨会话不记忆。
  }
}

function groupIdOf(group: SidebarNavGroup, index: number): string {
  return group.id ?? group.label ?? String(index);
}

/** 渲染用条目投影（有 subgroups 时以二级分类为准，同时并入扁平序列以做当前页定位）。 */
function groupRoutes(group: SidebarNavGroup): SidebarNavItem[] {
  return [...group.items, ...(group.subgroups?.flatMap((subgroup) => subgroup.items) ?? [])];
}

export function SidebarNav({
  groups,
  activeTo,
  onNavigate,
  side = "left",
  collapsible = false,
  persistKey,
  className,
}: SidebarNavProps) {
  const ariaLabel = groups[0]?.label ?? "Sidebar navigation";
  const groupIds = React.useMemo(
    () => groups.map((group, index) => groupIdOf(group, index)),
    [groups],
  );
  const activeGroupId = React.useMemo(() => {
    const index = groups.findIndex((group) =>
      groupRoutes(group).some((item) => item.to === activeTo),
    );
    return index === -1 ? null : groupIds[index];
  }, [groups, groupIds, activeTo]);

  // 折叠的是「分组 id 集合」；首帧为空集 = 全展开（静态渲染与首帧确定性）。
  const [collapsed, setCollapsed] = React.useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );
  const [storageReady, setStorageReady] = React.useState(false);
  const [seenActiveTo, setSeenActiveTo] = React.useState<string | undefined>(activeTo);

  // 路由变化时展开新页面所在分组：渲染期派生，避免「当前页被折叠藏起来」。
  if (seenActiveTo !== activeTo) {
    setSeenActiveTo(activeTo);
    if (activeGroupId && collapsed.has(activeGroupId)) {
      const next = new Set(collapsed);
      next.delete(activeGroupId);
      setCollapsed(next);
    }
  }

  // 记忆恢复：挂载后读取，静态渲染路径不触碰存储。
  // persistKey/collapsible 变化才重读；此处只关心首次读取的 activeGroupId（闭包捕获当次值即可）。
  React.useEffect(() => {
    if (!collapsible || !persistKey) return;
    const stored = readCollapsedGroups(persistKey);
    // 当前页所在分组永不以折叠态恢复
    if (activeGroupId) stored.delete(activeGroupId);
    setCollapsed(stored);
    setStorageReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsible, persistKey]);

  // 记忆写入：storageReady 之后才写，避免用首帧空集覆盖已存状态。
  React.useEffect(() => {
    if (!storageReady || !persistKey) return;
    writeCollapsedGroups(persistKey, collapsed);
  }, [collapsed, persistKey, storageReady]);

  const handleGroupOpenChange = React.useCallback((id: string, nextOpen: boolean) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (nextOpen) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const renderItems = (items: SidebarNavItem[]) => (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const active = activeTo === item.to;
        const Icon = item.icon;
        const badge = item.badge;
        return (
          <li key={item.to}>
            <a
              href={item.to}
              aria-current={active ? "page" : undefined}
              onClick={createNavigateHandler(onNavigate, item.to)}
              data-slot="sidebar-nav-item"
              className={cn(
                ITEM_BASE,
                active
                  ? "bg-gray-100 font-medium text-gray-1000"
                  : "text-gray-900 hover:bg-gray-100 hover:text-gray-1000",
              )}
            >
              {active ? (
                <span
                  aria-hidden
                  data-slot="sidebar-nav-indicator"
                  className="absolute top-1/2 left-1.5 h-4 w-0.5 -translate-y-1/2 rounded-full bg-gray-900"
                />
              ) : null}
              {Icon ? <Icon size={16} className="shrink-0" aria-hidden /> : null}
              <span className="truncate">{item.label}</span>
              {badge ? (
                <NavStatusBadge className="ml-auto" label={badge.label} tone={badge.tone} />
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );

  const renderGroupBody = (group: SidebarNavGroup) =>
    group.subgroups ? (
      <div className="space-y-2">
        {group.subgroups.map((subgroup) => (
          <div key={subgroup.label} data-slot="sidebar-nav-subgroup">
            {/* 二级小标题：比一级 heading 低一档字号 + 次级文本色，条目几何保持不变 */}
            <div
              data-slot="sidebar-nav-subheading"
              className={`${ROW_INSET} flex h-7 items-center text-style-footnote font-medium text-gray-900`}
            >
              {subgroup.label}
            </div>
            {renderItems(subgroup.items)}
          </div>
        ))}
      </div>
    ) : (
      renderItems(group.items)
    );

  return (
    <nav
      data-slot="sidebar-nav"
      aria-label={ariaLabel}
      className={cn("flex flex-col gap-4", side === "left" ? "" : "border-l", className)}
    >
      {groups.map((group, index) => {
        const id = groupIds[index];
        // 不可折叠：保持既有单层/二级分类结构，标题不成为交互元素。
        if (!collapsible) {
          return (
            <div key={id} data-slot="sidebar-nav-group">
              <div data-slot="sidebar-nav-heading" className={HEADING_BASE}>
                {group.label}
              </div>
              {renderGroupBody(group)}
            </div>
          );
        }

        const open = !collapsed.has(id);
        return (
          <CollapsiblePrimitive.Root
            key={id}
            data-slot="sidebar-nav-group"
            open={open}
            onOpenChange={(next) => handleGroupOpenChange(id, next)}
          >
            <CollapsiblePrimitive.Trigger
              data-slot="sidebar-nav-heading"
              className={cn(HEADING_BASE, "cursor-pointer hover:bg-gray-100")}
            >
              <span className="truncate">{group.label}</span>
              <ChevronDown
                aria-hidden
                className={cn(
                  "size-4 shrink-0 text-gray-900 transition-transform duration-(--uni-duration-base) ease-in-out motion-reduce:transition-none",
                  open && "rotate-180",
                )}
              />
            </CollapsiblePrimitive.Trigger>
            {/* 保留内容节点（forceMount）+ grid-rows 过渡：不卸载上百条链接、不打断 Tab 序；
                折叠态用 inert 退出可访问性树与焦点序（与 collapse.tsx 同款技法）。 */}
            <CollapsiblePrimitive.Content
              data-slot="sidebar-nav-content"
              forceMount
              inert={open ? undefined : true}
              className={cn(
                "grid transition-[grid-template-rows] duration-(--uni-duration-base) ease-in-out motion-reduce:transition-none",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">{renderGroupBody(group)}</div>
            </CollapsiblePrimitive.Content>
          </CollapsiblePrimitive.Root>
        );
      })}
    </nav>
  );
}
