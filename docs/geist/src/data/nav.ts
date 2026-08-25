import type { LucideIcon } from "lucide-react";

import { DOCS_ROUTE_GROUPS } from "./docs-routes";

/**
 * 文档站侧栏导航兼容投影（docs/geist 专用）。
 * Route metadata、排序和 sidebar 可见性都由 docs-routes registry 管理。
 */
export interface NavItem {
  label: string;
  labelZh?: string;
  /** hash 路由路径（react-router NavLink） */
  to: string;
  /** 可选 lucide 图标 */
  icon?: LucideIcon;
}

export interface NavGroup {
  title: string;
  titleZh?: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = DOCS_ROUTE_GROUPS.map((group) => ({
  title: group.title,
  titleZh: group.titleZh,
  items: group.items.map(({ label, labelZh, to, icon }) => ({ label, labelZh, to, icon })),
}));
