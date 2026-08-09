import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Code — 行内代码标记（docs/geist-markdown-refs/components/code.md 官方语义）。
 * 导出：Code。
 * 样式对齐官方实测行内 code：bg #f2f2f2（gray-100，dark #1a1a1a）、
 * 圆角 6px、文字 muted（#4d4d4d）、mono 13px。
 * 注：官方 Code 组件本体是语法高亮代码块（border r5、pad 24、16px mono），
 * 与本仓库 CodeBlock 的角色映射属产品决策（BLOCKED），此处保持行内语义。
 */

const Code = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"code">>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      data-slot="code"
      className={cn(
        "rounded-[6px] bg-gray-100 px-1.5 py-0.5 font-mono text-copy-13 text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
);
Code.displayName = "Code";

export { Code };
