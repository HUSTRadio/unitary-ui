/**
 * Split-batch 4 — snippet 的官方 demo 区块独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE_SPLIT_BATCH4[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - blockId 用官方快照 docs/geist-markdown-refs/components/snippet.md 的
 *   「## 区块标题」原文（Default / Inverted / Multi line / No prompt / Callback /
 *   Variants / Controlled Copied State），共 7 个区块。
 * - 官方 6 个区块无 useState，直接 import + JSX；Controlled Copied State 含 useState，
 *   保留 export function Component() 包装。
 * - 本地 SnippetProps 已实现 text / width / dark / prompt / onCopy / type / copied，
 *   官方 prop 全部映射；ContextCardTrigger 映射到 @/components/ui/context-card
 *   （本地实现 content / side 等 props）。
 */

export const DEMO_CODE_SPLIT_BATCH4: Record<string, Record<string, string>> = {
  snippet: {
    Default: `import { Snippet } from "@/components/ui/snippet";

<Snippet text="npm init next-app" width="300px" />`,
    Inverted: `import { Snippet } from "@/components/ui/snippet";

<Snippet dark text="npm init next-app" width="300px" />`,
    "Multi line": `import { Snippet } from "@/components/ui/snippet";

<Snippet text={["cd project", "now"]} width="100%" />`,
    "No prompt": `import { Snippet } from "@/components/ui/snippet";

<Snippet prompt={false} text="npm init next-app" width="300px" />`,
    Callback: `import { Snippet } from "@/components/ui/snippet";

<Snippet onCopy={() => alert("You copied the text!")} text="npm init next-app" width="300px" />`,
    Variants: `import { Snippet } from "@/components/ui/snippet";

<div className="flex flex-col items-stretch justify-start gap-3 flex-initial">
  <Snippet text="npm init next-app" type="success" width="300px" />
  <Snippet text="npm init next-app" type="error" width="300px" />
  <Snippet text="npm init next-app" type="warning" width="300px" />
</div>`,
    "Controlled Copied State": `"use client";

import { useCallback, useRef, useState } from "react";
import { ContextCardTrigger } from "@/components/ui/context-card";
import { Snippet } from "@/components/ui/snippet";
import type { JSX } from "react";

const COPY_TEXT = \`# About
Template for a full-featured Next.js AI chatbot

# Requirements
This template uses the Vercel AI Gateway to access multiple AI models through a unified interface. The default model is OpenAI GPT-4.1 Mini, with support for Anthropic, Google, and xAI models.\`;

export function Component(): JSX.Element {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(COPY_TEXT);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1000);
  }, []);

  return (
    <ContextCardTrigger
      content={<div className="text-copy-13-mono w-96 whitespace-pre-line">{COPY_TEXT}</div>}
      side="top"
    >
      {/* <div> since we don't want to wrap a button around a button */}
      <div
        role="button"
        tabIndex={0}
        aria-label="copy content"
        onClick={handleCopy}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCopy();
          }
        }}
        className="cursor-pointer"
      >
        <Snippet copied={copied} text="Copy install prompt" prompt={false} width="300px" />
      </div>
    </ContextCardTrigger>
  );
}`,
  },
};
