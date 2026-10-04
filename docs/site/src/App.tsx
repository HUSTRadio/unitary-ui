import { lazy, Suspense, useEffect, useState, type ComponentType } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { DocsBanner, DocsSidebar } from "./components/docs-shell";
import { DocsPagination } from "./components/docs-feedback";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import {
  CommandMenu,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@/components/ui/command-menu";
import { Toasts } from "@/components/ui/toast";
import { useFontMetrics } from "@/lib/font-metrics";
import { useDismissOnNavigate } from "@/lib/navigation";
import {
  ColorsPage,
  GridPage,
  IntroductionPage,
  MaterialsPage,
  TypographyPage,
} from "./components/docs-pages";
import { DocsPageTitle, DocsParagraph } from "./components/docs-typography";
import {
  canonicalDocsPath,
  DOCS_ROUTE_GROUPS,
  getDocsRoute,
  getDocsRouteLabel,
  getRouteSearchText,
  type LocalizedPageKey,
  type StaticPageKey,
} from "./data/docs-routes";
import { SHELL_COPY } from "./i18n/catalog";
import { demoText } from "./i18n/components-demo";
import { useLanguage, type DocsLanguage } from "./i18n/language";
import { DOCS_PAGE_RESOURCES, prefetchDocsLink } from "./data/page-loaders";

// 外壳与介绍页立即可用，其余页面随导航加载。
// Keep the shell and introduction ready; load specialist pages on navigation.
const ComponentsPage = lazy(() =>
  DOCS_PAGE_RESOURCES.components.load().then((module) => ({ default: module.ComponentsPage })),
);
const IconsPage = lazy(() =>
  DOCS_PAGE_RESOURCES.icons.load().then((module) => ({ default: module.IconsPage })),
);
const LifecycleAndHooksPage = lazy(() =>
  DOCS_PAGE_RESOURCES["lifecycle-and-hooks"].load().then((module) => ({ default: module.LifecycleAndHooksPage })),
);
const TokensPage = lazy(() =>
  DOCS_PAGE_RESOURCES.tokens.load().then((module) => ({ default: module.TokensPage })),
);
const ColorSchemesPage = lazy(() =>
  DOCS_PAGE_RESOURCES["color-schemes"].load().then((module) => ({ default: module.ColorSchemesPage })),
);
const ChartsGalleryPage = lazy(() =>
  DOCS_PAGE_RESOURCES.charts.load().then((module) => ({ default: module.ChartsGalleryPage })),
);
const AppShellDemo = lazy(() =>
  DOCS_PAGE_RESOURCES["app-shell"].load().then((module) => ({ default: module.AppShellDemo })),
);

const STATIC_PAGE_COMPONENTS = {
  introduction: IntroductionPage,
  icons: IconsPage,
  colors: ColorsPage,
  typography: TypographyPage,
  materials: MaterialsPage,
  grid: GridPage,
} satisfies Record<StaticPageKey, ComponentType>;

const LOCALIZED_PAGE_COMPONENTS = {
  "lifecycle-and-hooks": LifecycleAndHooksPage,
  "app-shell": AppShellDemo,
  charts: ChartsGalleryPage,
  tokens: TokensPage,
  "color-schemes": ColorSchemesPage,
} satisfies Record<LocalizedPageKey, ComponentType<{ language: DocsLanguage }>>;

export default function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const copy = SHELL_COPY[language];
  const [cmdOpen, setCmdOpen] = useState(false);

  // 字体度量探针：字体就绪后测量 CJK:ASCII/数字宽/基线偏移，
  // 供 .phone-status-time 等消费点做换字体后的视觉补偿（决策点3）。
  useFontMetrics();
  const canonicalPath = canonicalDocsPath(pathname);
  const route = getDocsRoute(canonicalPath);
  const StaticPage =
    route?.renderer.kind === "static" ? STATIC_PAGE_COMPONENTS[route.renderer.page] : undefined;
  const LocalizedPage =
    route?.renderer.kind === "localized"
      ? LOCALIZED_PAGE_COMPONENTS[route.renderer.page]
      : undefined;
  const isComponentsPage =
    route?.renderer.kind === "component-index" || route?.renderer.kind === "component-detail";
  const componentName =
    route?.renderer.kind === "component-detail" ? route.renderer.componentName : undefined;

  useEffect(() => {
    document.title = route
      ? canonicalPath === "/"
        ? "Unitary"
        : `${getDocsRouteLabel(route, language)} – Unitary`
      : demoText(language, "Page Not Found");
    document.documentElement.lang = language;
  }, [canonicalPath, language]);

  useEffect(() => {
    // 路由切换滚动复位（item 21）：仅 pathname 变化时回到顶部，语言切换不触发。
    // 滚动 owner 是 <main>（topbar 约束后不再是根 document），故复位到该容器。
    // scrollTo 是 HTMLElement 方法，jsdom 等轻量宿主可能未实现，需typeof 守卫。
    const main = document.getElementById("main-content");
    if (main && typeof main.scrollTo === "function") {
      main.scrollTo({ top: 0 });
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  // HIG-AUD-017：路由变化（前进/后退、程序化 navigate）时收起命令面板
  useDismissOnNavigate(() => setCmdOpen(false));

  // 全局 Cmd/Ctrl+K 打开命令面板（HashRouter 下无 SSR 问题）
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCmdOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    // Sticky Navbar 已占据一行，main 撑满剩余视口并负责滚动，不再重复顶栏偏移。
    // Sticky Navbar occupies a flex row; main fills and scrolls the remainder.
    <div className="flex h-dvh flex-col overflow-hidden bg-background"
      onPointerOver={(event) => { if (event.pointerType !== "touch") prefetchDocsLink(event); }}
      onPointerDown={(event) => { if (event.pointerType === "touch") prefetchDocsLink(event); }}
      onFocusCapture={prefetchDocsLink}
    >
      <a
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
        className="focus-ring fixed top-4 left-4 z-50 -translate-y-24 rounded-md bg-foreground px-3 py-2 text-label-14 text-background-100 transition-transform focus:translate-y-0"
      >
        {copy.skip}
      </a>
      <DocsBanner onSearchOpen={() => setCmdOpen(true)} />
      <main
        id="main-content"
        tabIndex={-1}
        className="topbar-offset-scroll mx-auto min-h-0 w-full max-w-[var(--uni-doc-layout-shell-width)] flex-1 overflow-y-auto border-gray-alpha-400 lg:grid lg:grid-cols-[var(--uni-doc-layout-sidebar-width)_1fr] lg:border-r"
      >
        <DocsSidebar />
        <div className="min-w-0 py-10">
          <div className="px-6 lg:px-12 max-md:px-5">
            {/* 页面级边界：单个页面/demo 崩溃只占位此区域，sidebar/topbar/其余导航继续可用；
                resetKeys=pathname 路由切换自动重置重试 */}
            <ErrorBoundary
              name={pathname}
              resetKeys={[pathname]}
              fallback={
                <div data-slot="page-render-error" className="py-16 text-center">
                  <p className="text-heading-20 text-foreground">{copy.pageRenderFailed}</p>
                  <p className="mt-2 text-copy-14 text-muted-foreground">
                    {copy.pageRenderFailedDescription}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Button typeName="button" size="small" onClick={() => window.location.reload()}>
                      {copy.refresh}
                    </Button>
                    <Button typeName="button" size="small" onClick={() => navigate("/")}>
                      {copy.returnHome}
                    </Button>
                  </div>
                </div>
              }
            >
              <Suspense
                key={canonicalPath}
                fallback={
                  <div
                    role="status"
                    data-slot="docs-page-loading"
                    className="py-16 text-copy-14 text-muted-foreground"
                  >
                    {demoText(language, "Loading...")}
                  </div>
                }
              >
                {StaticPage ? (
                  <StaticPage />
                ) : LocalizedPage ? (
                  <LocalizedPage language={language} />
                ) : isComponentsPage ? (
                  <ComponentsPage componentName={componentName} />
                ) : (
                  <>
                    <DocsPageTitle>{copy.pageInProgress}</DocsPageTitle>
                    <DocsParagraph>{copy.pageInProgressDescription(pathname)}</DocsParagraph>
                  </>
                )}
              </Suspense>
            </ErrorBoundary>

            {/* 内容页页脚：分页和默认可见的反馈胶囊共用同一布局行。 */}
            {route ? (
              <div className="mt-16 border-t border-border pt-8">
                <DocsPagination />
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Toasts />

      {/* 全局命令面板 — canonical route registry 跳转（搜索随查询过滤，选择即导航） */}
      <CommandMenu open={cmdOpen} setOpen={setCmdOpen}>
        <CommandMenuInput placeholder={copy.searchPlaceholder} />
        <CommandMenuList>
          {DOCS_ROUTE_GROUPS.map((group) => (
            <CommandMenuGroup
              key={group.title}
              heading={language === "zh-CN" ? (group.titleZh ?? group.title) : group.title}
            >
              {group.items.map((item) => (
                <CommandMenuItem
                  key={item.to}
                  value={getRouteSearchText(item)}
                  onSelect={() => navigate(item.to)}
                >
                  {language === "zh-CN" ? (item.labelZh ?? item.label) : item.label}
                </CommandMenuItem>
              ))}
            </CommandMenuGroup>
          ))}
        </CommandMenuList>
      </CommandMenu>
    </div>
  );
}
