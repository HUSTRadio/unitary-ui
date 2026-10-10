import type * as React from "react";
import { allowAutomaticPrefetch, createPrefetch, type PrefetchResource } from "@/lib/prefetch";
import { canonicalDocsPath, getDocsRoute } from "./docs-routes";

// 导航预载与实际渲染共用同一资源，创建加载器列表不会下载页面。
// Navigation prefetch and rendering share resources; constructing them starts no work.
export const DOCS_PAGE_RESOURCES = {
  components: createPrefetch(() => import("../components/docs-components-page")),
  grid: createPrefetch(() => import("../components/docs-grid-page")),
  layer: createPrefetch(() => import("../pages/layer")),
  "api-overview": createPrefetch(() => import("../pages/api-overview")),
  icons: createPrefetch(() => import("../components/docs-icons")),
  "state-and-events": createPrefetch(() => import("../pages/state-and-events")),
  tokens: createPrefetch(() => import("../pages/tokens")),
  "color-schemes": createPrefetch(() => import("../color-schemes/page")),
  "color-scheme-api": createPrefetch(() => import("../pages/color-scheme-api")),
  charts: createPrefetch(() => import("../pages/charts-gallery")),
  "app-shell": createPrefetch(() => import("../components/patterns/app-shell-demo")),
  "site-shell": createPrefetch(() => import("../components/patterns/site-shell-demo")),
};

const routes = new Map<string, PrefetchResource<void>>();
export function getDocsPrefetchResource(path: string): PrefetchResource<void> | undefined {
  const canonical = canonicalDocsPath(path);
  const route = getDocsRoute(canonical);
  if (!route) return undefined;
  let resource = routes.get(canonical);
  if (!resource) {
    resource = createPrefetch(async () => {
      const renderer = route.renderer;
      if (renderer.kind === "component-detail" || renderer.kind === "component-index") {
        const module = await DOCS_PAGE_RESOURCES.components.load();
        if (renderer.kind === "component-detail") await module.loadComponentExamples(renderer.componentName);
      } else if (renderer.kind === "localized") {
        await DOCS_PAGE_RESOURCES[renderer.page].load();
      } else if (renderer.kind === "static" && (renderer.page === "icons" || renderer.page === "grid")) {
        await DOCS_PAGE_RESOURCES[renderer.page].load();
      }
    });
    routes.set(canonical, resource);
  }
  return resource;
}

/** 导航容器事件委托，兼容 SidebarNav、移动抽屉与概览链接。
 * Delegate intent from existing navigation links without changing their semantics. */
export function prefetchDocsLink(event: React.SyntheticEvent<HTMLElement>) {
  if (event.defaultPrevented || !allowAutomaticPrefetch() || !(event.target instanceof Element)) return;
  const link = event.target.closest("a[href]");
  const href = link?.getAttribute("href");
  if (!href) return;
  const path = href.startsWith("#/") ? href.slice(1) : href;
  if (path.startsWith("/")) void getDocsPrefetchResource(path)?.prefetch();
}
