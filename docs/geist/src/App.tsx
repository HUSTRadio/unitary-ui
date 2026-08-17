import { useEffect, type ComponentType } from "react";
import { useLocation } from "react-router-dom";

import { DocsBanner, DocsSidebar } from "./components/docs-shell";
import { DocsPagination, FeedbackPanel } from "./components/docs-feedback";
import { ComponentsPage } from "./components/docs-components-page";
import { Toasts } from "@/components/ui/toast";
import { IconsPage } from "./components/docs-icons";
import {
  ColorsPage,
  GridPage,
  IntroductionPage,
  MaterialsPage,
  TypographyPage,
} from "./components/docs-pages";
import { COMPONENTS } from "./data/components";
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

const PAGE_TITLES: Record<string, string> = {
  "/": "Geist Style Framework",
  "/introduction": "Introduction",
  "/colors": "Colors",
  "/typography": "Typography",
  "/materials": "Materials",
  "/grid": "Grid",
  "/components": "Components",
  "/icons": "Icons",
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

export default function App() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const copy = SHELL_COPY[language];
  const Page =
    PAGE_COMPONENTS[pathname] ?? (pathname.startsWith("/components/") ? ComponentsPage : undefined);

  useEffect(() => {
    document.title = getPageTitle(pathname, language);
    document.documentElement.lang = language;
  }, [language, pathname]);

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
      <DocsBanner />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-[1220px] flex-1 xl:grid xl:grid-cols-[260px_1fr]"
      >
        <DocsSidebar />
        <div className="min-w-0 border-r border-gray-alpha-400 py-10">
          <div className="px-6 xl:px-12">
            {Page ? (
              <Page />
            ) : (
              <>
                <h1 className="text-heading-32 text-foreground">{copy.pageInProgress}</h1>
                <p className="mt-2 text-copy-14 text-muted-foreground">
                  {copy.pageInProgressDescription(pathname)}
                </p>
              </>
            )}

            {/* 内容页页脚 - 反馈区 + Next 分页（官方文档站每个页面底部都有） */}
            {Page && (
              <div className="mt-16 border-t border-border pt-8">
                <FeedbackPanel />
                <DocsPagination />
              </div>
            )}
          </div>
        </div>
      </main>
      <Toasts />
    </div>
  );
}
