import { DocsBanner, DocsSidebar } from "./components/docs-shell";

/**
 * docs/geist 文档站布局壳 — Banner + Sidebar + 内容区。
 * 内容区在后续任务实现（当前为占位）。
 */
export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DocsBanner />
      <div className="flex flex-1">
        <DocsSidebar />
        <main className="min-w-0 flex-1 px-8 py-10">
          <h1 className="text-heading-32 text-foreground">Geist Style Framework</h1>
          <p className="mt-2 text-copy-14 text-muted-foreground">
            文档站外壳已就绪（Banner / Sidebar / 搜索 / 三态主题切换）。
            各页面内容将在后续任务实现。
          </p>
        </main>
      </div>
    </div>
  );
}
