import {
  type LucideIcon,
} from "lucide-react";

/**
 * 文档站侧栏导航数据（docs/geist 专用）。
 * 分组与条目对齐官方 Geist 文档站侧栏（foundations/components），
 * 但 Components 组只列本框架已实现的 13 个元件。
 */

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
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Badge", to: "/components/badge" },
      { label: "Button", to: "/components/button" },
      { label: "Checkbox", to: "/components/checkbox" },
      { label: "Dropdown Menu", to: "/components/dropdown-menu" },
      { label: "Input", to: "/components/input" },
      { label: "Segmented Control", to: "/components/segmented-control" },
      { label: "Select", to: "/components/select" },
      { label: "Step Point", to: "/components/step-point" },
      { label: "Table", to: "/components/table" },
      { label: "Tabs", to: "/components/tabs" },
      { label: "Textarea", to: "/components/textarea" },
      { label: "Toggle", to: "/components/toggle" },
      { label: "Theme Switch", to: "/components/theme-switch" },
    ],
  },
];
