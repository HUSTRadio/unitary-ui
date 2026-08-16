/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）— Split Batch 3（book）。
 *
 * 结构：DEMO_CODE_SPLIT_BATCH3[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - blockId 用官方快照 docs/geist-markdown-refs/components/book.md 的「## 区块标题」原文
 *   （Default / Variants / Custom color / Custom icon / Custom illustration /
 *   Responsive / Width / Textured），共 8 个含 tsx 的官方区块。
 * - 官方 @vercel/geistcn/components → @/components/ui/book。
 * - 官方 @vercel/geistcn-assets/logos 的 LogoIcon* 与 ./lines、./icon 插画 →
 *   lucide-react 图标（Vercel → Triangle，Next → ArrowRight，React → Atom；
 *   Lines 插画 → Waves，Icon 插画 → ChartColumn），不用 @vercel/geistcn-assets。
 * - 官方 prop（title / variant / width / color / textColor / icon / illustration /
 *   textured）本地 Book 均已实现，逐一保留。
 */

export const DEMO_CODE_SPLIT_BATCH3: Record<string, Record<string, string>> = {
  book: {
    Default: `import { Book } from "@/components/ui/book";

<Book title="The user experience of the Frontend Cloud" />`,
    Variants: `import { Book } from "@/components/ui/book";

<div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
  <Book title="The user experience of the Frontend Cloud" variant="simple" width={196} />
  <Book title="The user experience of the Frontend Cloud" variant="stripe" width={196} />
</div>`,
    "Custom color": `import { Book } from "@/components/ui/book";

<div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
  <Book color="#9D2127" title="How Vercel improves your website's search engine ranking" />
  <Book
    color="#7DC1C1"
    textColor="white"
    title="Design Engineering at Vercel"
    variant="simple"
  />
  <Book color="#FED954" title="The user experience of the Frontend Cloud" />
</div>`,
    "Custom icon": `import { Book } from "@/components/ui/book";
import { ArrowRight, Atom, Triangle } from "lucide-react";

<div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
  <Book icon={<Triangle className="size-4" aria-hidden />} title="Vercel Platform Guide" />
  <Book icon={<ArrowRight className="size-4" aria-hidden />} title="Next.js Documentation" />
  <Book icon={<Atom className="size-4" aria-hidden />} title="React Essentials" />
</div>`,
    "Custom illustration": `import { Book } from "@/components/ui/book";
import { ChartColumn, Waves } from "lucide-react";

<div className="flex flex-row items-stretch justify-start gap-8 flex-initial">
  <Book
    illustration={<Waves className="size-8" aria-hidden />}
    title="The user experience of the Frontend Cloud"
  />
  <Book
    illustration={<ChartColumn className="size-8" aria-hidden />}
    title="The user experience of the Frontend Cloud"
    variant="simple"
  />
</div>`,
    Responsive: `import { Book } from "@/components/ui/book";

<Book title="The user experience of the Frontend Cloud" width={{ sm: 150, md: 196 }} />`,
    Width: `import { Book } from "@/components/ui/book";

<div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
  <Book title="The user experience of the Frontend Cloud" width={300} />
  <Book title="The user experience of the Frontend Cloud" width={200} />
  <Book title="The user experience of the Frontend Cloud" width={150} />
</div>`,
    Textured: `import { Book } from "@/components/ui/book";

<div className="flex flex-col items-stretch justify-start gap-12 flex-initial">
  <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
    <Book color="#7DC1C1" textured title="Design Engineering at Vercel" />
    <Book color="#9D2127" textured title="Design Engineering at Vercel" />
    <Book color="#FED954" textured title="Design Engineering at Vercel" />
  </div>
  <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
    <Book
      color="#7DC1C1"
      textColor="white"
      textured
      title="Design Engineering at Vercel"
      variant="simple"
    />
    <Book
      color="#9D2127"
      textColor="#ece4db"
      textured
      title="Design Engineering at Vercel"
      variant="simple"
    />
    <Book
      color="#FED954"
      textColor="#9d3b05"
      textured
      title="Design Engineering at Vercel"
      variant="simple"
    />
  </div>
</div>`,
  },
};
