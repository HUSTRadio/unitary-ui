import { Smartphone, type LucideIcon } from "lucide-react";

import { COMPONENTS } from "./components";
import type { DocsLanguage } from "../i18n/language";

export type DocsGroupId = "foundations" | "api" | "components" | "patterns";
export type StaticPageKey =
  | "introduction"
  | "icons"
  | "colors"
  | "typography"
  | "materials"
  | "grid";
export type LocalizedPageKey = "lifecycle-and-hooks" | "app-shell";

export type DocsRenderer =
  | { kind: "static"; page: StaticPageKey }
  | { kind: "localized"; page: LocalizedPageKey }
  | { kind: "component-index" }
  | { kind: "component-detail"; componentName: string };

export interface DocsRoute {
  to: string;
  group: DocsGroupId;
  label: string;
  labelZh: string;
  sidebar: boolean;
  icon?: LucideIcon;
  renderer: DocsRenderer;
}

export interface DocsRouteGroup {
  id: DocsGroupId;
  title: string;
  titleZh: string;
  items: readonly DocsRoute[];
}

const DOCS_GROUPS: readonly Omit<DocsRouteGroup, "items">[] = [
  { id: "foundations", title: "Foundations", titleZh: "基础" },
  { id: "api", title: "API", titleZh: "API" },
  { id: "components", title: "Components", titleZh: "组件" },
  { id: "patterns", title: "Patterns", titleZh: "模式" },
];

const STATIC_DOCS_ROUTES: readonly DocsRoute[] = [
  {
    to: "/",
    group: "foundations",
    label: "Introduction",
    labelZh: "介绍",
    sidebar: true,
    renderer: { kind: "static", page: "introduction" },
  },
  {
    to: "/icons",
    group: "foundations",
    label: "Icons",
    labelZh: "图标",
    sidebar: true,
    renderer: { kind: "static", page: "icons" },
  },
  {
    to: "/colors",
    group: "foundations",
    label: "Colors",
    labelZh: "颜色",
    sidebar: true,
    renderer: { kind: "static", page: "colors" },
  },
  {
    to: "/typography",
    group: "foundations",
    label: "Typography",
    labelZh: "排版",
    sidebar: true,
    renderer: { kind: "static", page: "typography" },
  },
  {
    to: "/materials",
    group: "foundations",
    label: "Materials",
    labelZh: "材质",
    sidebar: true,
    renderer: { kind: "static", page: "materials" },
  },
  {
    to: "/grid",
    group: "foundations",
    label: "Grid",
    labelZh: "网格",
    sidebar: true,
    renderer: { kind: "static", page: "grid" },
  },
  {
    to: "/lifecycle-and-hooks",
    group: "api",
    label: "Lifecycle & Hooks",
    labelZh: "生命周期与钩子",
    sidebar: true,
    renderer: { kind: "localized", page: "lifecycle-and-hooks" },
  },
  {
    to: "/components",
    group: "components",
    label: "Components",
    labelZh: "组件",
    sidebar: false,
    renderer: { kind: "component-index" },
  },
];

const COMPONENT_DETAIL_ROUTES: readonly DocsRoute[] = [...COMPONENTS]
  .sort((left, right) => left.label.localeCompare(right.label, "en"))
  .map((component) => ({
    to: `/components/${component.name}`,
    group: "components",
    label: component.label,
    labelZh: component.labelZh ?? component.label,
    sidebar: true,
    renderer: { kind: "component-detail", componentName: component.name },
  }));

const APP_SHELL_ROUTE: DocsRoute = {
  to: "/patterns/app-shell",
  group: "patterns",
  label: "App Shell",
  labelZh: "应用壳层",
  sidebar: true,
  icon: Smartphone,
  renderer: { kind: "localized", page: "app-shell" },
};

export const DOCS_ROUTE_SEQUENCE: readonly DocsRoute[] = [
  ...STATIC_DOCS_ROUTES,
  ...COMPONENT_DETAIL_ROUTES,
  APP_SHELL_ROUTE,
];

export const DOCS_ROUTE_GROUPS: readonly DocsRouteGroup[] = DOCS_GROUPS.map((group) => ({
  ...group,
  items: DOCS_ROUTE_SEQUENCE.filter((route) => route.sidebar && route.group === group.id),
}));

export function canonicalDocsPath(pathname: string): string {
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const withoutTrailingSlash =
    withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, "") : withLeadingSlash;
  const aliases: Readonly<Record<string, string>> = {
    "/introduction": "/",
    "/components/phone": "/components/device",
  };
  return aliases[withoutTrailingSlash] ?? withoutTrailingSlash;
}

export function getDocsRoute(pathname: string): DocsRoute | undefined {
  const canonicalPath = canonicalDocsPath(pathname);
  return DOCS_ROUTE_SEQUENCE.find((route) => route.to === canonicalPath);
}

export function getDocsRouteLabel(route: DocsRoute, language: DocsLanguage): string {
  return language === "zh-CN" ? route.labelZh : route.label;
}

export function getAdjacentDocsPages(pathname: string): {
  previous?: DocsRoute;
  next?: DocsRoute;
} {
  const routeIndex = DOCS_ROUTE_SEQUENCE.findIndex(
    (route) => route.to === canonicalDocsPath(pathname),
  );
  return routeIndex === -1
    ? {}
    : {
        previous: DOCS_ROUTE_SEQUENCE[routeIndex - 1],
        next: DOCS_ROUTE_SEQUENCE[routeIndex + 1],
      };
}
