import * as React from "react";
import type { MouseEvent } from "react";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useScrollTracking, type ScrollTrackingMode } from "@/lib/scroll-tracking";

import { Collapse, CollapseContent, CollapseTrigger } from "./collapse";
import {
  NAV_GROUP_BODY_INSET,
  NAV_GROUP_RHYTHM,
  NAV_HEADING_BASE,
  NAV_ITEM_BASE,
  NAV_ITEM_INDICATOR,
  NAV_ITEM_STATE_ACTIVE,
  NAV_ITEM_STATE_IDLE,
  NAV_SUBGROUP_DIVIDER,
  NAV_SUBHEADING_BASE,
  navGroupKey,
  useNavGroupCollapse,
} from "./nav-layout";
import { NavStatusBadge, type NavStatusTone } from "./nav-status-badge";
import { Separator } from "./separator";

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

/** Scroll to the active link or its nearest category heading. */
export type SidebarNavScrollTrackingTarget = "item" | "category";

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
  /** 活动项滚动跟随；默认禁用。 / Active-item scroll tracking; disabled by default. */
  scrollTracking?: ScrollTrackingMode;
  /** Align the item or its subgroup heading (group heading when ungrouped). @default "item" */
  scrollTrackingTarget?: SidebarNavScrollTrackingTarget;
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
 * - 条目行：rounded-md + nav-item-row(36px, HIG 指针行高) + 导航条目字号
 *   text-style-nav-item(15/20)；行距 space-y-1(4px)
 *   （Tremor 原为 32px/2px，太紧凑 → 按 HIG 放宽）
 * - 行内缩：条目 -mx-1 px-3.5（药丸两侧各外扩 4px，文字左内缩 14px；Tremor pl-3.5 同值）；
 *   小标题一律不内缩，文字左缘 = 药丸左缘
 * - 默认文字 text-gray-900（light #4d4d4d ≈ Tremor gray-600；dark #a1a1a1 ≈ Tremor gray-400）
 * - 悬停 bg-gray-100 + text-gray-1000（Tremor hover:bg-gray-100 + hover:text-gray-800）
 * - 选中 = 与悬停同底色 + 强化文字 + 左侧 2×14px 指示条（贴近中文字形墨迹高度，无独立底色）
 * - 三级标签统一字号（text-style-nav-heading / -subheading / -item 同一 15/20，
 *   见 src/styles/index.css 的 nav token）
 * - 层次感来自对齐：一级/二级小标题都对齐到条目药丸左缘，条目标签再内缩 14px
 *   → 标题永远在读层级的外侧
 * - 二级小组靠 40px 短水平分割线（左缘与小标题同轴）+ 上下留白区分；
 *   垂直节奏「一级→首组 6px」＜「组间 9px」：分组之间呼吸更松
 * - 行高 token：--uni-nav-item-height 36px（指针）/ --uni-nav-item-height-touch
 *   44px（触控面板 = HIG 最小命中区 44×44pt）
 * - 分组标题 font-semibold tracking-wide + text-gray-1000
 *   （Tremor：text-sm font-semibold tracking-wide text-gray-800，标题强于条目）
 * - 状态胶囊 text-label-12 + rounded-sm + px-1.5 py-0.5（Tremor：text-xs 500 + px-1.5 py-0.5）
 * Apple HIG 优先级说明：HIG 未规定侧栏行几何 → fallback 实测值；
 * HIG 滚动条规范（overlay，不占布局）→ 侧栏滚动条不挤压内容宽度。
 */

/*
 * 几何与配色取值一律来自共享契约模块 ./nav-layout.ts —— 侧栏与折叠抽屉的唯一
 * 来源，改一处两处导航同时生效（用户实测 2026-09-29：抽屉与侧栏排版漂移）。
 * 本组件只负责结构（分组 → 标题 → 内容 → 条目）与交互（折叠记忆、当前页标记）。
 */

function groupIdOf(group: SidebarNavGroup, index: number): string {
  return navGroupKey(group.id, group.label, index);
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
  scrollTracking = "disabled",
  scrollTrackingTarget = "item",
  className,
}: SidebarNavProps) {
  const navRef = React.useRef<HTMLElement>(null);
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

  // 折叠状态（记忆读写、路由变化自动展开）与抽屉共用同一实现，见 ./nav-layout.ts。
  const { isCollapsed, setGroupOpen, ready } = useNavGroupCollapse({
    enabled: collapsible,
    persistKey,
    activeGroupId,
  });

  useScrollTracking({
    mode: scrollTracking,
    activeKey: activeTo === undefined ? undefined : `${scrollTrackingTarget}:${activeTo}`,
    rootRef: navRef,
    axis: "block", owner: "ancestor", ready,
    targetSelector: scrollTrackingTarget === "category"
      ? '[data-scroll-tracking-category]'
      : '[data-slot="sidebar-nav-item"][aria-current="page"]',
    precedingSelector: '[data-slot="sidebar-nav-item"], [data-slot="sidebar-nav-heading"], [data-slot="sidebar-nav-subheading"]',
  });

  const renderItems = (items: SidebarNavItem[]) => (
    <ul className="space-y-1">
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
                NAV_ITEM_BASE,
                active ? NAV_ITEM_STATE_ACTIVE : NAV_ITEM_STATE_IDLE,
                scrollTracking !== "disabled" && "scroll-tracking-inset",
              )}
            >
              {active ? (
                <span
                  aria-hidden
                  data-slot="sidebar-nav-indicator"
                  className={NAV_ITEM_INDICATOR}
                />
              ) : null}
              {Icon ? <Icon size={16} className="shrink-0" aria-hidden /> : null}
              <span className="truncate ink-shift-cjk">{item.label}</span>
              {badge ? (
                <NavStatusBadge className="ml-auto" label={badge.label} tone={badge.tone} />
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );

  const renderGroupBody = (group: SidebarNavGroup) => (
    <div className={NAV_GROUP_BODY_INSET}>
      {group.subgroups ? (
        /* 二级小组：组间短水平分割线 + 上下留白区分，不做水平缩进层级 */
        <div>
          {group.subgroups.map((subgroup, index) => (
            <React.Fragment key={subgroup.label}>
              {index > 0 ? (
                <Separator
                  decorative
                  length="short"
                  data-slot="sidebar-nav-subgroup-divider"
                  className={NAV_SUBGROUP_DIVIDER}
                />
              ) : null}
              <div data-slot="sidebar-nav-subgroup">
                {/* 二级小标题：与一级 heading 同字号（统一字号），靠字重 + 次级色分层 */}
                <div data-slot="sidebar-nav-subheading"
                  data-scroll-tracking-category={subgroup.items.some((item) => item.to === activeTo) ? "" : undefined}
                  className={cn(NAV_SUBHEADING_BASE, scrollTracking !== "disabled" && "scroll-tracking-inset")}>
                  <span className="truncate ink-shift-cjk">{subgroup.label}</span>
                </div>
                {renderItems(subgroup.items)}
              </div>
            </React.Fragment>
          ))}
        </div>
      ) : (
        renderItems(group.items)
      )}
    </div>
  );

  return (
    <nav
      ref={navRef}
      data-slot="sidebar-nav"
      aria-label={ariaLabel}
      className={cn(NAV_GROUP_RHYTHM, side === "left" ? "" : "border-l", className)}
    >
      {groups.map((group, index) => {
        const id = groupIds[index];
        const category = !group.subgroups && id === activeGroupId ? "" : undefined;
        const headingClass = cn(NAV_HEADING_BASE, scrollTracking !== "disabled" && "scroll-tracking-inset");
        // 不可折叠：保持既有单层/二级分类结构，标题不成为交互元素。
        if (!collapsible) {
          return (
            <div key={id} data-slot="sidebar-nav-group">
              <div data-slot="sidebar-nav-heading" data-scroll-tracking-category={category} className={headingClass}>
                <span className="truncate ink-shift-cjk">{group.label}</span>
              </div>
              {renderGroupBody(group)}
            </div>
          );
        }

        const open = !isCollapsed(id);
        return (
          /*
           * 折叠行为直接用标准 Collapse（Radix Collapsible，见 collapse.tsx）：
           * - 受控 open + onOpenChange：折叠记忆/路由自动展开仍由本组件持有；
           * - CollapseTrigger as="div"：不是 button 元素、没有按钮外观（无底色/边框/
           *   悬停药丸），只有 disclosure 语义与键盘开关；
           * - size="bare"：去掉标题内边距，行几何回到侧栏自己的 h-8 契约；
           * - indicatorAlign="inline"：chevron 紧跟标题（要行尾右对齐时改 "end"）；
           * - CollapseContent：保留内容节点 + 折叠态 inert，不卸载上百条链接。
           */
          <Collapse
            key={id}
            data-slot="sidebar-nav-group"
            open={open}
            onOpenChange={(next) => setGroupOpen(id, next)}
            size="bare"
            indicatorAlign="inline"
          >
            <CollapseTrigger
              as="div"
              data-slot="sidebar-nav-heading"
              data-scroll-tracking-category={category}
              className={cn(headingClass, "select-none")}
            >
              <span className="truncate ink-shift-cjk">{group.label}</span>
            </CollapseTrigger>
            <CollapseContent data-slot="sidebar-nav-content" aria-label={group.label}>
              {renderGroupBody(group)}
            </CollapseContent>
          </Collapse>
        );
      })}
    </nav>
  );
}
