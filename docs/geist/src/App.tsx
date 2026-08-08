import type { ComponentType } from "react";
import { useLocation } from "react-router-dom";

import { DocsBanner, DocsSidebar } from "./components/docs-shell";
import { DocsPagination, FeedbackPanel } from "./components/docs-feedback";
import { ComponentsPage } from "./components/docs-components-page";
import {
  BrandsPage,
  ColorsPage,
  IntroductionPage,
  MaterialsPage,
  TypographyPage,
} from "./components/docs-pages";

/**
 * docs/geist 文档站布局壳 — Banner + Sidebar + 内容区。
 * 内容区按 hash 路由渲染：/ 与 /introduction 显示 Introduction 首页，
 * /colors /typography /materials /brands 显示对应内容页，
 * /components 与 /components/:name 显示 Components 总览 / 元件详情，
 * 其余路由为占位。
 */
const PAGE_COMPONENTS: Record<string, ComponentType> = {
  "/": IntroductionPage,
  "/introduction": IntroductionPage,
  "/colors": ColorsPage,
  "/typography": TypographyPage,
  "/materials": MaterialsPage,
  "/brands": BrandsPage,
  "/components": ComponentsPage,
};

export default function App() {
  const { pathname } = useLocation();
  const Page =
    PAGE_COMPONENTS[pathname] ??
    (pathname.startsWith("/components/") ? ComponentsPage : undefined);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DocsBanner />
      <div className="flex flex-1">
        <DocsSidebar />
        <main className="min-w-0 flex-1 px-8 py-10">
          <div className="mx-auto max-w-[1280px]">
            {Page ? (
              <Page />
            ) : (
              <>
                <h1 className="text-heading-32 text-foreground">页面开发中</h1>
                <p className="mt-2 text-copy-14 text-muted-foreground">
                  该页面（{pathname}）由后续任务实现。
                </p>
              </>
            )}

            {/* 内容页页脚 — 反馈区 + Next 分页（官方文档站每个页面底部都有） */}
            {Page && (
              <div className="mt-16 border-t border-border pt-8">
                <FeedbackPanel />
                <DocsPagination />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
