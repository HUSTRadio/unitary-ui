import { type LucideIcon } from "lucide-react";

/**
 * 文档站侧栏导航数据（docs/geist 专用）。
 * 分组与条目对齐官方 Geist 文档站侧栏（foundations/components），
 * Components 组直接由组件 registry 生成，避免 metadata、路由和侧栏漂移。
 */

import { COMPONENTS } from "./components";

export interface NavItem {
  label: string;
  /** hash 路由路径（react-router NavLink） */
  to: string;
  /** 可选 lucide 图标 */
  icon?: LucideIcon;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Foundations",
    items: [
      { label: "Introduction", to: "/" },
      { label: "Colors", to: "/colors" },
      { label: "Typography", to: "/typography" },
      { label: "Materials", to: "/materials" },
      { label: "Grid", to: "/grid" },
    ],
  },
  {
    title: "Components",
    items: [...COMPONENTS]
      .sort((left, right) => left.label.localeCompare(right.label, "en"))
      .map((component) => ({
        label: component.label,
        to: `/components/${component.name}`,
      })),
  },
];
