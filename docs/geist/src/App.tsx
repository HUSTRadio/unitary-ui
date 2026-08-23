import { useEffect, useState, type ComponentType } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { DocsBanner, DocsSidebar } from "./components/docs-shell";
import { DocsPagination, FeedbackPanel } from "./components/docs-feedback";
import { ComponentsPage } from "./components/docs-components-page";
import {
  CommandMenu,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@/components/ui/command-menu";
import { Footer, type FooterColumn } from "@/components/ui/footer";
import { Toasts } from "@/components/ui/toast";
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
import { COMPONENTS } from "./data/components";
import { NAV_GROUPS } from "./data/nav";
import { SHELL_COPY } from "./i18n/catalog";
import { demoText } from "./i18n/components-demo";
import { useLanguage, type DocsLanguage } from "./i18n/language";

/**
 * docs/geist 文档站布局壳 — Banner + Sidebar + 内容区。
 * 内容区按 hash 路由渲染：/ 与 /introduction 显示 Introduction 首页，
 * /colors /typography /materials 显示对应内容页，
 * /components 与 /components/:name 显示 Components 总览 / 元件详情，
 * 其余路由为占位。
 */
const PAGE_COMPONENTS: Record<string, ComponentType> = {
  "/": IntroductionPage,
  "/introduction": IntroductionPage,
  "/colors": ColorsPage,
  "/typography": TypographyPage,
  "/materials": MaterialsPage,
  "/grid": GridPage,
  "/components": ComponentsPage,
  "/icons": IconsPage,
};

/** 需要 language prop 的结构化内容页（i18n 走内容模型而非 JSX 内联三元）。 */
const PAGE_CONTENT_COMPONENTS: Record<string, ComponentType<{ language: DocsLanguage }>> = {
  "/lifecycle-and-hooks": LifecycleAndHooksPage,
  "/patterns/app-shell": AppShellDemo,
};

const PAGE_TITLES: Record<string, string> = {
  "/": "Geist Style Framework",
  "/introduction": "Introduction",
  "/colors": "Colors",
  "/typography": "Typography",
  "/materials": "Materials",
  "/grid": "Grid",
  "/components": "Components",
  "/icons": "Icons",
  "/lifecycle-and-hooks": "Lifecycle & Hooks",
  "/patterns/app-shell": "App Shell",
};

function getPageTitle(pathname: string, language: DocsLanguage) {
  const componentName = pathname.startsWith("/components/")
    ? pathname.slice("/components/".length)
    : undefined;
  const component = componentName
    ? COMPONENTS.find((candidate) => candidate.name === componentName)
    : undefined;
  const pageTitle = component
    ? language === "zh-CN"
      ? (component.labelZh ?? component.label)
      : component.label
    : demoText(language, PAGE_TITLES[pathname] ?? "Page Not Found");
  return pageTitle === "Geist Style Framework" ? pageTitle : `${pageTitle} – Geist Style Framework`;
}

/** 页脚列内容（组件 / 资源 / 关于 三列，链接指向 docs 内部 hash 路由，i18n 双语）。 */
const FOOTER_COLUMNS: Record<DocsLanguage, FooterColumn[]> = {
  "zh-CN": [
    {
      title: "组件",
      links: [
        { label: "组件总览", href: "#/components" },
        { label: "图标", href: "#/icons" },
      ],
    },
    {
      title: "资源",
      links: [
        { label: "颜色", href: "#/colors" },
        { label: "排版", href: "#/typography" },
        { label: "材质", href: "#/materials" },
        { label: "网格", href: "#/grid" },
      ],
    },
    {
      title: "关于",
      links: [
        { label: "介绍", href: "#/" },
        { label: "生命周期与钩子", href: "#/lifecycle-and-hooks" },
      ],
    },
  ],
  "en-US": [
    {
      title: "Components",
      links: [
        { label: "Components overview", href: "#/components" },
        { label: "Icons", href: "#/icons" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Colors", href: "#/colors" },
        { label: "Typography", href: "#/typography" },
        { label: "Materials", href: "#/materials" },
        { label: "Grid", href: "#/grid" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "Introduction", href: "#/" },
        { label: "Lifecycle & Hooks", href: "#/lifecycle-and-hooks" },
      ],
    },
  ],
};

export default function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const copy = SHELL_COPY[language];
  const [cmdOpen, setCmdOpen] = useState(false);
  const Page =
    PAGE_COMPONENTS[pathname] ?? (pathname.startsWith("/components/") ? ComponentsPage : undefined);
  const ContentPage = PAGE_CONTENT_COMPONENTS[pathname];

  useEffect(() => {
    document.title = getPageTitle(pathname, language);
    document.documentElement.lang = language;
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
        className="mx-auto w-full max-w-[1220px] flex-1 lg:grid lg:grid-cols-[260px_1fr]"
      >
        <DocsSidebar />
        <div className="min-w-0 border-r border-gray-alpha-400 py-10">
          <div className="px-6 lg:px-12">
            {Page ? (
              <Page />
            ) : ContentPage ? (
              <ContentPage language={language} />
            ) : (
              <>
                <h1 className="text-heading-32 text-foreground">{copy.pageInProgress}</h1>
                <p className="mt-2 text-copy-14 text-muted-foreground">
                  {copy.pageInProgressDescription(pathname)}
                </p>
              </>
            )}

            {/* 内容页页脚 - 反馈区 + Next 分页（官方文档站每个页面底部都有） */}
            {Page || ContentPage ? (
              <div className="mt-16 border-t border-border pt-8">
                <FeedbackPanel />
                <DocsPagination />
              </div>
            ) : null}
          </div>
        </div>
      </main>
      {/* 页脚 — 组件 / 资源 / 关于 三列 + 品牌区 */}
      <Footer
        columns={FOOTER_COLUMNS[language]}
        className="mx-auto w-full max-w-[1220px] px-6 lg:px-12"
        slotLeading={
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="size-4 fill-foreground" aria-hidden>
              <path d="M12 2.5 22.5 21h-21L12 2.5Z" />
            </svg>
            <span className="text-copy-13 font-medium text-gray-1000">
              Geist Style Framework
            </span>
          </div>
        }
      />
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
