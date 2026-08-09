import * as React from "react";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/ui/copy-button";

/**
 * Snippet — 代码片段展示（docs/geist-markdown-refs/components/snippet.md 官方语义）。
 * 导出：Snippet。
 * 左侧 font-mono 代码 + 右侧可选 Copy 按钮。
 * 材质对齐 Geist 实测（2026-08）：
 * - 容器：flex items-center gap-2 rounded-[8px] border border-gray-alpha-400 bg-background p-3
 * - 文本：font-mono text-copy-13 text-foreground
 */

interface SnippetProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 要展示（并复制）的代码字符串 */
  code: string;
  /** 是否显示右侧复制按钮 */
  showCopy?: boolean;
}

function Snippet({ className, code, showCopy = true, ...props }: SnippetProps) {
  return (
    <div
      data-slot="snippet"
      className={cn(
        "flex items-center gap-2 rounded-[8px] border border-gray-alpha-400 bg-background p-3",
        className,
      )}
      {...props}
    >
      <code className="min-w-0 flex-1 truncate font-mono text-copy-13 text-foreground">
        {code}
      </code>
      {showCopy && <CopyButton text={code} className="shrink-0" />}
    </div>
  );
}

export { Snippet };
