import * as React from "react";

import { highlightLines } from "@/lib/highlight";
import { cn } from "@/lib/utils";

/**
 * Code — 语法高亮代码块展示（docs/geist-markdown-refs/components/code.md 官方语义）。
 * 导出：Code, InlineCode。
 * - Code：BLOCK 级语法高亮代码显示（官方实测：pre border accents-2、r5、p-6、
 *   my-8、whitespace-pre、touch-pan-y、透明背景；code mono 13px/20px）。
 *   `syntax` 属性映射为 <code class="language-*">，由消费方语法主题着色
 *   （与官方组件一致：组件本身不做高亮，只挂 language-* 钩子）。
 *   本仓库无 accents-* 令牌，实测等价色 light #eaeaea / dark #333 ≈ border-border
 *   （light #ebebeb / dark #2e2e2e）。
 * - InlineCode：文档正文行内 code（官方实测：纯 mono 文本，无背景、无圆角）。
 */

interface CodeProps extends React.ComponentPropsWithoutRef<"pre"> {
  /** 语法语言（如 "javascript"），映射为 <code class="language-*"> 供语法主题着色 */
  syntax?: string;
}

const Code = React.forwardRef<HTMLPreElement, CodeProps>(
  ({ className, syntax, children, ...props }, ref) => {
    const code = typeof children === "string" ? children : "";
    const lines = syntax ? highlightLines(code.replace(/\n$/, ""), syntax) : null;
    return (
      <pre
        ref={ref}
        data-slot="code"
        className={cn(
          "mx-0 my-8 touch-pan-y whitespace-pre rounded-[5px] border border-border bg-transparent p-6 text-foreground",
          className,
        )}
        {...props}
      >
        <code
          data-slot="code-content"
          className={cn("font-mono text-copy-13 leading-5", syntax && `language-${syntax}`)}
        >
          {lines
            ? lines.map((tokens, lineIndex) => (
                <React.Fragment key={lineIndex}>
                  {lineIndex > 0 ? "\n" : null}
                  {tokens.map((token, tokenIndex) => (
                    <span key={tokenIndex} className={`token ${token.type}`}>
                      {token.content}
                    </span>
                  ))}
                </React.Fragment>
              ))
            : children}
        </code>
      </pre>
    );
  },
);
Code.displayName = "Code";

const InlineCode = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"code">>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      data-slot="inline-code"
      className={cn("font-mono text-copy-13", className)}
      {...props}
    />
  ),
);
InlineCode.displayName = "InlineCode";

export { Code, InlineCode };
