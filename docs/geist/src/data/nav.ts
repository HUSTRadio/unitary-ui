import type { LucideIcon } from "lucide-react";

import { DOCS_ROUTE_GROUPS, type DocsGroupId, type DocsRouteStatus } from "./docs-routes";

/**
 * 文档站侧栏导航兼容投影（docs/geist 专用）。
 * Route metadata、排序、sidebar 可见性与二级分类都由 docs-routes registry 管理。
 */
export interface NavItem {
  label: string;
  labelZh?: string;
  /** hash 路由路径（react-router NavLink） */
  to: string;
  /** 可选 lucide 图标 */
  icon?: LucideIcon;
  /** 最近新增/更新的状态标记（胶囊文案由壳层按语言给出）。 */
  status?: DocsRouteStatus;
}

/** 分组内的二级分类投影（与 SidebarNavSubgroup / MenuSubgroup 同构）。 */
export interface NavSubgroup {
  title: string;
  titleZh?: string;
  items: NavItem[];
}

export interface NavGroup {
  /** registry 的稳定分组 id（与语言无关，用作折叠状态记忆键）。 */
  id: DocsGroupId;
  title: string;
  titleZh?: string;
  /** 分组内全部条目（扁平）；有 subgroups 时是其顺序一致的投影。 */
  items: NavItem[];
  subgroups?: NavSubgroup[];
}

function projectItems(
  items: readonly {
    label: string;
    labelZh?: string;
    to: string;
    icon?: LucideIcon;
    status?: DocsRouteStatus;
  }[],
): NavItem[] {
  return items.map(({ label, labelZh, to, icon, status }) => ({
    label,
    labelZh,
    to,
    icon,
    status,
  }));
}

export const NAV_GROUPS: NavGroup[] = DOCS_ROUTE_GROUPS.map((group) => ({
  id: group.id,
  title: group.title,
  titleZh: group.titleZh,
  items: projectItems(group.items),
  ...(group.subgroups
    ? {
        subgroups: group.subgroups.map((subgroup) => ({
          title: subgroup.title,
          titleZh: subgroup.titleZh,
          items: projectItems(subgroup.items),
        })),
      }
    : {}),
}));
