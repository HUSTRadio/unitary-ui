import { Smartphone, type LucideIcon } from "lucide-react";

import { COMPONENTS, type ComponentMeta } from "./components";
import type { DocsLanguage } from "../i18n/language";

export type DocsGroupId = "foundations" | "layout" | "api" | "components" | "charts" | "patterns";
export type StaticPageKey =
  | "introduction"
  | "icons"
  | "colors"
  | "typography"
  | "materials"
  | "grid";
export type LocalizedPageKey = "lifecycle-and-hooks" | "app-shell" | "charts";

/** 条目状态标记（侧栏 / 汉堡面板右端胶囊的色调）。 */
export type DocsRouteStatus = "new" | "updated";

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
  aliases?: readonly string[];
  sidebar: boolean;
  icon?: LucideIcon;
  /** 最近版本新增/更新的状态标记（决定侧栏与汉堡面板是否渲染状态胶囊）。 */
  status?: DocsRouteStatus;
  renderer: DocsRenderer;
}

/**
 * 分组内的二级分类（当前只有「组件」区块使用）。
 * `items` 与所属分组的扁平序列保持同一相对顺序，二级分类只是同一批路由的再切分。
 */
export interface DocsRouteSubgroup {
  id: string;
  title: string;
  titleZh: string;
  items: readonly DocsRoute[];
}

export interface DocsRouteGroup {
  id: DocsGroupId;
  title: string;
  titleZh: string;
  /** 分组内 sidebar 可见路由的扁平序列（顺序即侧栏顺序）。 */
  items: readonly DocsRoute[];
  /** 二级分类；存在时 `items` 是其扁平投影（顺序一致）。 */
  subgroups?: readonly DocsRouteSubgroup[];
}

const DOCS_GROUPS: readonly Omit<DocsRouteGroup, "items">[] = [
  { id: "foundations", title: "Foundations", titleZh: "基础" },
  { id: "layout", title: "Layout & Organization", titleZh: "排版与布局" },
  { id: "api", title: "API", titleZh: "API" },
  { id: "components", title: "Components", titleZh: "组件" },
  { id: "charts", title: "Charts", titleZh: "图表" },
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
    group: "layout",
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
    group: "layout",
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

/**
 * 布局原语归入「排版与布局」（Layout & Organization）分组，与 Typography / Grid 静态页同级；
 * 其余组件页仍在「组件」分组。
 */
const LAYOUT_COMPONENT_NAMES: ReadonlySet<string> = new Set(["safe-area", "stack"]);

/**
 * 图表组件（Tremor Raw 内置）归入「图表」（Charts）顶级分组，路由挂在 /charts/<name>，
 * 不参与「组件」区块的二级分类（componentSubgroupId 对其不适用）。
 */
export const CHART_COMPONENT_NAMES: ReadonlySet<string> = new Set([
  "area-chart",
  "bar-chart",
  "line-chart",
  "combo-chart",
  "donut-chart",
  "spark-chart",
  "category-bar",
  "bar-list",
  "tracker",
  "progress-circle",
]);

/**
 * 「组件」区块的二级分类（按元件职责划分的功能域）。
 * 数组顺序即侧栏顺序，也是组件页在 DOCS_ROUTE_SEQUENCE 中的相邻顺序。
 */
const COMPONENT_SUBGROUPS = [
  { id: "actions", title: "Actions", titleZh: "操作" },
  { id: "forms", title: "Forms & Input", titleZh: "表单与输入" },
  { id: "navigation", title: "Navigation", titleZh: "导航" },
  { id: "data-display", title: "Data Display", titleZh: "数据展示" },
  { id: "feedback", title: "Feedback & Status", titleZh: "反馈与状态" },
  { id: "overlays", title: "Overlays & Containers", titleZh: "浮层与容器" },
  { id: "content", title: "Content & Media", titleZh: "内容与媒体" },
  { id: "mobile", title: "Mobile only", titleZh: "仅移动端" },
] as const satisfies readonly Omit<DocsRouteSubgroup, "items">[];

export type ComponentSubgroupId = (typeof COMPONENT_SUBGROUPS)[number]["id"];

/** 仅移动端可用的元件统一收进末位二级分类（来源为 ComponentMeta.mobileOnly）。 */
const MOBILE_ONLY_SUBGROUP_ID: ComponentSubgroupId = "mobile";

/**
 * 非移动端元件 → 二级分类。标记 mobileOnly 的元件**不**写在此表，
 * 由 componentSubgroupId 依据 ComponentMeta.mobileOnly 统一归入「仅移动端」。
 */
const COMPONENT_SUBGROUP_BY_NAME: Readonly<Record<string, ComponentSubgroupId>> = {
  /* Actions —— 触发动作、命令与菜单 */
  button: "actions",
  "command-menu": "actions",
  "context-menu": "actions",
  "copy-button": "actions",
  "dots-menu": "actions",
  "edit-menu": "actions",
  link: "actions",
  "load-more-button": "actions",
  menu: "actions",
  "menu-bar": "actions",
  "show-more": "actions",
  "split-button": "actions",
  toolbar: "actions",

  /* Forms & Input —— 表单控件与输入 */
  calendar: "forms",
  checkbox: "forms",
  choicebox: "forms",
  "clearable-input": "forms",
  combobox: "forms",
  fieldset: "forms",
  input: "forms",
  "keyboard-input": "forms",
  label: "forms",
  "multi-select": "forms",
  radio: "forms",
  "search-input": "forms",
  select: "forms",
  slider: "forms",
  switch: "forms",
  textarea: "forms",
  "theme-switcher": "forms",
  toggle: "forms",

  /* Navigation —— 位置与视图切换 */
  breadcrumbs: "navigation",
  footer: "navigation",
  "hamburger-menu": "navigation",
  navbar: "navigation",
  pagination: "navigation",
  "sidebar-nav": "navigation",
  tabs: "navigation",

  /* Data Display —— 数据、状态与标识的展示 */
  avatar: "data-display",
  badge: "data-display",
  description: "data-display",
  entity: "data-display",
  "file-tree": "data-display",
  gauge: "data-display",
  "json-view": "data-display",
  "middle-truncate": "data-display",
  pill: "data-display",
  progress: "data-display",
  "relative-time-card": "data-display",
  "status-dot": "data-display",
  "step-point": "data-display",
  table: "data-display",
  "text-with-copy-button": "data-display",

  /* Feedback & Status —— 加载、空态、错误与用户反馈 */
  "empty-state": "feedback",
  error: "feedback",
  "error-boundary": "feedback",
  "error-card": "feedback",
  feedback: "feedback",
  "loading-dots": "feedback",
  skeleton: "feedback",
  spinner: "feedback",
  toast: "feedback",
  tooltip: "feedback",

  /* Overlays & Containers —— 浮层与容器基元 */
  collapse: "overlays",
  "context-card": "overlays",
  "continuous-surface": "overlays",
  "destructive-action-modal": "overlays",
  grid: "overlays",
  modal: "overlays",
  "responsive-drawer": "overlays",
  "side-panel": "overlays",
  scroller: "overlays",
  separator: "overlays",
  sheet: "overlays",

  /* Content & Media —— 内容排版、代码与拟真外框 */
  banner: "content",
  book: "content",
  browser: "content",
  code: "content",
  "code-block": "content",
  device: "content",
  note: "content",
  "project-banner": "content",
  snippet: "content",
  video: "content",
};

/** 元件所属二级分类；mobileOnly 优先，非移动端必须显式归类（缺失即 fail-closed）。 */
function componentSubgroupId(component: ComponentMeta): ComponentSubgroupId {
  if (component.mobileOnly) return MOBILE_ONLY_SUBGROUP_ID;
  const subgroupId = COMPONENT_SUBGROUP_BY_NAME[component.name];
  if (!subgroupId) {
    throw new Error(
      `元件「${component.name}」缺少「组件」区块二级分类：请在 docs-routes.ts 的 COMPONENT_SUBGROUP_BY_NAME 中归类。`,
    );
  }
  return subgroupId;
}

/** 二级分类在侧栏中的序号；同时决定组件页在 canonical 序列中的相邻顺序。 */
function componentSubgroupRank(component: ComponentMeta): number {
  const subgroupId = componentSubgroupId(component);
  const rank = COMPONENT_SUBGROUPS.findIndex((subgroup) => subgroup.id === subgroupId);
  if (rank === -1) {
    throw new Error(`未知的「组件」二级分类：${subgroupId}`);
  }
  return rank;
}

/**
 * 组件页排序键。布局原语不属于「组件」区块的二级分类，统一取 -1 排在最前——
 * 它们最终归入 layout 分组，与其他分组的相对顺序由 DOCS_ROUTE_SEQUENCE 的分组投影决定。
 * 图表组件同理不参与二级分类，取 COMPONENT_SUBGROUPS.length + 1 排在末位，归入 charts 分组。
 */
function componentSortRank(component: ComponentMeta): number {
  if (CHART_COMPONENT_NAMES.has(component.name)) return COMPONENT_SUBGROUPS.length + 1;
  return LAYOUT_COMPONENT_NAMES.has(component.name) ? -1 : componentSubgroupRank(component);
}

const COMPONENT_DETAIL_ROUTES: readonly DocsRoute[] = [...COMPONENTS]
  .sort((left, right) => {
    const rankDelta = componentSortRank(left) - componentSortRank(right);
    return rankDelta !== 0 ? rankDelta : left.label.localeCompare(right.label, "en");
  })
  .map((component) => ({
    to: CHART_COMPONENT_NAMES.has(component.name)
      ? `/charts/${component.name}`
      : `/components/${component.name}`,
    group: CHART_COMPONENT_NAMES.has(component.name)
      ? "charts"
      : LAYOUT_COMPONENT_NAMES.has(component.name)
        ? "layout"
        : "components",
    label: component.label,
    labelZh: component.labelZh ?? component.label,
    sidebar: true,
    renderer: { kind: "component-detail", componentName: component.name },
  }));

/** 组件页路径 → 二级分类（切分「组件」区块时使用；布局原语与图表组件不在此列）。 */
const COMPONENT_SUBGROUP_BY_PATH: ReadonlyMap<string, ComponentSubgroupId> = new Map(
  COMPONENTS.filter(
    (component) =>
      !LAYOUT_COMPONENT_NAMES.has(component.name) && !CHART_COMPONENT_NAMES.has(component.name),
  ).map((component) => [
    `/components/${component.name}`,
    componentSubgroupId(component),
  ]),
);

const APP_SHELL_ROUTE: DocsRoute = {
  to: "/patterns/app-shell",
  group: "patterns",
  label: "App Shell",
  labelZh: "应用壳层",
  sidebar: true,
  icon: Smartphone,
  renderer: { kind: "localized", page: "app-shell" },
};

/** 图表分组首页：画廊式索引页（/charts），逐组件详情页在 COMPONENT_DETAIL_ROUTES 中生成。 */
const CHART_GALLERY_ROUTE: DocsRoute = {
  to: "/charts",
  group: "charts",
  label: "Charts",
  labelZh: "图表",
  sidebar: true,
  renderer: { kind: "localized", page: "charts" },
};

const ALL_DOCS_ROUTES: readonly DocsRoute[] = [
  ...STATIC_DOCS_ROUTES,
  ...COMPONENT_DETAIL_ROUTES,
  APP_SHELL_ROUTE,
  CHART_GALLERY_ROUTE,
];

/**
 * 条目状态标记表 —— 只登记 CHANGELOG 里真正新增或更新过公开面/文档的页面，
 * 未登记的页面一律不带胶囊（侧栏节奏优先，不做全量打标）：
 * - new：《HIG 交互组件族》（MenuBar / Toolbar）、《Shape family 与连续曲率》（ContinuousSurface）、
 *   《布局原语》（SafeArea）
 * - updated：《组件变体 API》（Modal 新增 placement、Tabs 新增 compact 密度）
 * 键为 canonical 路由（布局原语的 path 仍是 /components/*，归组见 COMPONENT_DETAIL_ROUTES）。
 */
const DOCS_ROUTE_STATUS: Readonly<Record<string, DocsRouteStatus>> = {
  "/components/menu-bar": "new",
  "/components/toolbar": "new",
  "/components/continuous-surface": "new",
  "/components/safe-area": "new",
  "/components/modal": "updated",
  "/components/tabs": "updated",
  "/charts": "new",
  "/charts/area-chart": "new",
  "/charts/bar-chart": "new",
  "/charts/line-chart": "new",
  "/charts/combo-chart": "new",
  "/charts/donut-chart": "new",
  "/charts/spark-chart": "new",
  "/charts/category-bar": "new",
  "/charts/bar-list": "new",
  "/charts/tracker": "new",
  "/charts/progress-circle": "new",
};

/**
 * 序列按**分组顺序**投影，而不是"静态页 → 组件页 → 模式页"：
 * 这样侧栏分组、上下页相邻与搜索顺序始终是同一个顺序，
 * 新增分组（如"排版与布局"）不会让三者错位。
 * 状态标记在此统一附加，保证侧栏、汉堡面板与搜索看到同一份路由对象。
 */
export const DOCS_ROUTE_SEQUENCE: readonly DocsRoute[] = DOCS_GROUPS.flatMap((group) =>
  ALL_DOCS_ROUTES.filter((route) => route.group === group.id).map((route) => {
    const status = DOCS_ROUTE_STATUS[route.to];
    return status ? { ...route, status } : route;
  }),
);

export const DOCS_ROUTE_GROUPS: readonly DocsRouteGroup[] = DOCS_GROUPS.map((group) => {
  const items = DOCS_ROUTE_SEQUENCE.filter((route) => route.sidebar && route.group === group.id);
  if (group.id !== "components") return { ...group, items };
  // 「组件」区块按二级分类再切分：items 仍是扁平投影，顺序与 subgroups 的拼接结果一致。
  return {
    ...group,
    items,
    subgroups: COMPONENT_SUBGROUPS.map((subgroup) => ({
      id: subgroup.id,
      title: subgroup.title,
      titleZh: subgroup.titleZh,
      items: items.filter((route) => COMPONENT_SUBGROUP_BY_PATH.get(route.to) === subgroup.id),
    })).filter((subgroup) => subgroup.items.length > 0),
  };
});

export function getRouteSearchText(item: Pick<DocsRoute, "label" | "labelZh" | "aliases">): string {
  return [item.label, item.labelZh, ...(item.aliases ?? [])]
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

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
