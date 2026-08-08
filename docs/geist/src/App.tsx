import { useLocation } from "react-router-dom";

import { DocsBanner, DocsSidebar } from "./components/docs-shell";
import { IntroductionPage } from "./components/docs-pages";

/**
 * docs/geist 文档站布局壳 — Banner + Sidebar + 内容区。
 * 内容区按 hash 路由渲染：/ 与 /introduction 显示 Introduction 首页
 * （标题区 + 发丝线卡片网格），其余路由为占位，由后续任务实现。
 */
export default function App() {
  const { pathname } = useLocation();
  const isIntroduction = pathname === "/" || pathname === "/introduction";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DocsBanner />
      <div className="flex flex-1">
        <DocsSidebar />
        <main className="min-w-0 flex-1 px-8 py-10">
          {isIntroduction ? (
            <IntroductionPage />
          ) : (
            <>
              <h1 className="text-heading-32 text-foreground">页面开发中</h1>
              <p className="mt-2 text-copy-14 text-muted-foreground">
                该页面（{pathname}）由后续任务实现。
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
