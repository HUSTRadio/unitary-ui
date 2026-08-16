/**
 * Multi-batch 1 — book / description / destructive-action-modal / loading-dots /
 * load-more-button 的 demo 区块独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE_MULTI_BATCH1[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - demo 函数里的 demoText(language, "X") 替换为字符串 "X"；useState 保留为
 *   可运行的最小交互示例（batch4 modal 风格：裸 const；batch2 风格：Component 包装）。
 * - 共享常量 / demo 包装（边框、min-h、data-demo-*）省略，仅保留必要布局。
 * - blockId：book 按 demo 内 4 个 <section> 的 h3 标题（Default / Variants /
 *   Custom color / Responsive and textured）；其余组件整函数为一个 "Default" 区块。
 */

export const DEMO_CODE_MULTI_BATCH1: Record<string, Record<string, string>> = {
  book: {
    Default: `import { Book } from "@/components/ui/book";

<Book title="The user experience of the Frontend Cloud" />`,
    Variants: `import { Book } from "@/components/ui/book";

<div className="grid gap-8 sm:grid-cols-2">
  <Book title="The user experience of the Frontend Cloud" variant="simple" />
  <Book title="The user experience of the Frontend Cloud" />
</div>`,
    "Custom color": `import { Book } from "@/components/ui/book";

<div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
  <Book color="#9D2127" title="How Vercel improves your website's search engine ranking" />
  <Book color="#7DC1C1" textColor="white" title="Design Engineering at Vercel" variant="simple" />
  <Book color="#FED954" title="The user experience of the Frontend Cloud" />
</div>`,
    "Responsive and textured": `import { Book } from "@/components/ui/book";

<Book
  color="#7DC1C1"
  textured
  title="Design Engineering at Vercel"
  variant="simple"
  width={{ sm: 150, md: 196 }}
 />`,
  },
  description: {
    default: `import { Description } from "@/components/ui/description";

<Description
  title="Section Title"
  content="Data about this section."
  tooltip="Additional context about what this section refers to."
/>`,
    "text-right": `import { Description } from "@/components/ui/description";

<Description
  right
  title="Section Title"
  content="Data about this section."
  tooltip="Additional context about what this section refers to."
/>`,
    ellipsis: `import { Description } from "@/components/ui/description";

<Description
  ellipsis
  title="Section Title"
  content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed venenatis libero."
  tooltip="Additional context about what this section refers to."
/>`,
  },
  "destructive-action-modal": {
    Default: `import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

const [open, setOpen] = useState(false);

<>
  <Button typeName="button" type="error" onClick={() => setOpen(true)}>
    Delete Project
  </Button>
  <DestructiveActionModal
    open={open}
    onCancel={() => setOpen(false)}
    onConfirm={() => setOpen(false)}
    title="Delete Project"
    description="next-year-boilerplate and all its deployments, domains, and environment variables will be permanently deleted."
    confirmLabel="Delete Project"
    verificationPhrase="next-year-boilerplate"
    verificationLabel="project name"
    irreversibleDescription="Deleting next-year-boilerplate cannot be undone."
  />
</>`,
  },
  "loading-dots": {
    Default: `import { LoadingDots } from "@/components/ui/loading-dots";

<div className="flex items-center gap-3 text-copy-14 text-muted-foreground">
  Loading deployment <LoadingDots />
</div>`,
  },
  "load-more-button": {
    Default: `import { LoadMoreButton } from "@/components/ui/load-more-button";
import { useState } from "react";

export function Component() {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setCount((c) => c + 1);
    }, 1200);
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <LoadMoreButton onClick={handleClick} loading={loading}>
        Load More
      </LoadMoreButton>
      <p className="text-center text-copy-13 text-muted-foreground">
        {count} items loaded
      </p>
    </div>
  );
}`,
  },
};
