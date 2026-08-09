import * as React from "react";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tooltip } from "./tooltip";

/**
 * Description — 标题 + 内容说明（docs/geist-markdown-refs/components/description.md 官方语义）。
 * 官方实测（2026-08 vercel.com/geist/description 实时 DOM/computed style）：
 * - 单组件 prop API：title / content / tooltip / right / ellipsis
 * - 渲染 <dl>/<dt>/<dd>（dl m-0，屏幕阅读器按定义列表朗读）
 * - dt：14px/400、leading 14px、min-h 14px、capitalize、nowrap、
 *   color gray-900（#4d4d4d）、mb-2（8px）；title 后跟 14px 圆形 info 图标
 *   （ml-1 align-[-2px]，tooltip prop 存在时渲染，悬浮展示 tooltip 文本）
 * - dd：14px/500、leading 16px、color gray-1000（#171717）、m-0
 * - right：整个 dl text-right
 * - ellipsis：dl w-full + dt/dd truncate（nowrap + overflow hidden + ellipsis）
 */

interface DescriptionProps extends Omit<React.ComponentProps<"dl">, "content"> {
  /** 标题（dt，Title Case 名词） */
  title: string;
  /** 内容（dd，sentence case） */
  content: React.ReactNode;
  /** 可选：title 后 info 图标的悬浮提示文本 */
  tooltip?: string;
  /** 右对齐 */
  right?: boolean;
  /** 单行省略（dt/dd 均截断） */
  ellipsis?: boolean;
}

function Description({
  title,
  content,
  tooltip,
  right,
  ellipsis,
  className,
  ...props
}: DescriptionProps) {
  return (
    <dl
      data-slot="description"
      className={cn(
        "m-0",
        right && "text-right",
        ellipsis && "w-full [&>dt]:overflow-hidden [&>dt]:truncate [&>dd]:truncate",
        className,
      )}
      {...props}
    >
      <dt
        data-slot="description-title"
        className="mb-2 min-h-[14px] text-sm leading-[14px] capitalize whitespace-nowrap text-muted-foreground"
      >
        {title}
        {tooltip && (
          <Tooltip text={tooltip}>
            <span
              tabIndex={0}
              className="ml-1 inline-flex items-center align-[-2px] text-muted-foreground"
            >
              <Info className="size-3.5" aria-hidden />
            </span>
          </Tooltip>
        )}
      </dt>
      <dd data-slot="description-content" className="text-sm leading-4 font-medium text-foreground">
        {content}
      </dd>
    </dl>
  );
}

export { Description };
