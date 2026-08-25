import { useEffect, useState, type ComponentType } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { DocsBanner, DocsSidebar } from "./components/docs-shell";
import { DocsPagination } from "./components/docs-feedback";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ComponentsPage } from "./components/docs-components-page";
import {
  CommandMenu,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@/components/ui/command-menu";
import { Toasts } from "@/components/ui/toast";
import { useFontMetrics } from "@/lib/font-metrics";
import { IconsPage } from "./components/docs-icons";
import { LifecycleAndHooksPage } from "./pages/lifecycle-and-hooks";
import { AppShellDemo } from "./components/patterns/app-shell-demo";
import {
  ColorsPage,
  GridPage,
  IntroductionPage,
  MaterialsPage,
  TypographyPage,
} from "./components/docs-pages";
import {
  canonicalDocsPath,
  getDocsRoute,
  getDocsRouteLabel,
  type LocalizedPageKey,
  type StaticPageKey,
} from "./data/docs-routes";
import { NAV_GROUPS } from "./data/nav";
import { SHELL_COPY } from "./i18n/catalog";
import { demoText } from "./i18n/components-demo";
import { useLanguage, type DocsLanguage } from "./i18n/language";

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

  useEffect(() => {
    document.title = route
      ? canonicalPath === "/"
        ? "Unitary"
        : `${getDocsRouteLabel(route, language)} – Unitary`
      : demoText(language, "Page Not Found");
    document.documentElement.lang = language;
  }, [canonicalPath, language]);

  useEffect(() => {
    // 路由切换滚动复位（item 21）：仅 pathname 变化时回到顶部，语言切换不触发
    window.scrollTo(0, 0);
  }, [pathname]);

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
    <div className="flex min-h-screen flex-col bg-background">
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
        className="mx-auto w-full max-w-[1220px] flex-1 border-gray-alpha-400 lg:grid lg:grid-cols-[260px_1fr] lg:border-r"
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
                <div className="py-16 text-center">
                  <p className="text-heading-20 text-foreground">页面渲染失败</p>
                  <p className="mt-2 text-copy-14 text-muted-foreground">
                    此页面组件抛出了异常，其余功能不受影响。可刷新重试或返回首页。
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Button typeName="button" size="small" onClick={() => window.location.reload()}>
                      刷新
                    </Button>
                    <Button typeName="button" size="small" onClick={() => navigate("/")}>
                      返回首页
                    </Button>
                  </div>
                </div>
              }
            >
              {StaticPage ? (
                <StaticPage />
              ) : LocalizedPage ? (
                <LocalizedPage language={language} />
              ) : isComponentsPage ? (
                <ComponentsPage />
              ) : (
                <>
                  <h1 className="text-heading-32 text-foreground">{copy.pageInProgress}</h1>
                  <p className="mt-2 text-copy-14 text-muted-foreground">
                    {copy.pageInProgressDescription(pathname)}
                  </p>
                </>
              )}
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

      {/* 全局命令面板 — NAV_GROUPS 跳转（搜索随查询过滤，选择即导航） */}
      <CommandMenu open={cmdOpen} setOpen={setCmdOpen}>
        <CommandMenuInput placeholder={copy.searchPlaceholder} />
        <CommandMenuList>
          {NAV_GROUPS.map((group) => (
            <CommandMenuGroup
              key={group.title}
              heading={language === "zh-CN" ? (group.titleZh ?? group.title) : group.title}
            >
              {group.items.map((item) => (
                <CommandMenuItem
                  key={item.to}
                  value={`${group.title} ${item.label}`}
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
