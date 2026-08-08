import { DocsCardGrid } from "./docs-cards";

/**
 * 文档站页面组件（docs/geist 专用）。
 * 当前实现 Introduction 首页；Colors / Typography / Materials 等
 * 页面由后续任务填充。
 */

/** Introduction — Geist 文档站首页：H1 + 副标题 + 发丝线卡片网格 */
export function IntroductionPage() {
  return (
    <div>
      <h1 className="text-heading-40 text-foreground">Geist Style Framework</h1>
      <p className="mt-3 max-w-xl text-copy-16 text-muted-foreground">
        Vercel design system for building consistent web experiences.
      </p>
      <DocsCardGrid className="mt-10" />
    </div>
  );
}
