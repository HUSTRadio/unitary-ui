import * as React from "react";

import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

/**
 * CodeBlock — 代码块展示（docs/geist-markdown-refs/components/code-block.md 官方语义）。
 * 导出：CodeBlock, CodeBlockHeader, CodeBlockContent。
 * - CodeBlock：容器（overflow-hidden rounded-[8px] border gray-alpha-400 bg-background），
 *   传入字符串 children 时自动套 CodeBlockContent；filename/language 时渲染 CodeBlockHeader
 * - CodeBlockHeader：header 栏（border-b + px-3 py-1.5），左侧文件名、右侧语言 + 复制按钮
 * - CodeBlockContent：pre 滚动区（overflow-x-auto p-4 font-mono text-copy-13）
 */

interface CodeBlockProps extends React.ComponentPropsWithoutRef<"div"> {
  /** 文件名（显示在 header 左侧） */
  filename?: string;
  /** 语言标签（显示在 header 右侧，复制按钮之前） */
  language?: string;
}

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ className, filename, language, children, ...props }, ref) => {
    const code = typeof children === "string" ? children : undefined;

    return (
      <div
        ref={ref}
        data-slot="code-block"
        className={cn(
          "overflow-hidden rounded-[8px] border border-gray-alpha-400 bg-background",
          className,
        )}
        {...props}
      >
        {(filename || language) && (
          <CodeBlockHeader>
            <span className="truncate text-label-13-mono text-muted-foreground">{filename}</span>
            <span className="flex shrink-0 items-center gap-2">
              {language && (
                <span className="text-label-13-mono text-muted-foreground">{language}</span>
              )}
              {code !== undefined && <CopyButton textToCopy={code} />}
            </span>
          </CodeBlockHeader>
        )}
        {code !== undefined ? <CodeBlockContent>{code}</CodeBlockContent> : children}
      </div>
    );
  },
);
CodeBlock.displayName = "CodeBlock";

const CodeBlockHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="code-block-header"
      className={cn(
        "flex items-center justify-between border-b border-gray-alpha-400 px-4 py-3",
        className,
      )}
      {...props}
    />
  ),
);
CodeBlockHeader.displayName = "CodeBlockHeader";

const CodeBlockContent = React.forwardRef<HTMLPreElement, React.ComponentPropsWithoutRef<"pre">>(
  ({ className, ...props }, ref) => (
    <pre
      ref={ref}
      data-slot="code-block-content"
      className={cn(
        "overflow-x-auto p-4 font-mono text-copy-13 leading-5 text-foreground",
        className,
      )}
      {...props}
    />
  ),
);
CodeBlockContent.displayName = "CodeBlockContent";

export { CodeBlock, CodeBlockHeader, CodeBlockContent };
