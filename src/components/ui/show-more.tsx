import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/**
 * ShowMore — 展开 / 折叠触发器（docs/geist-markdown-refs/components/show-more.md 官方语义）。
 * 导出：ShowMore。
 *
 * 官方 API（受控触发器）：expanded / onClick / noBorder，渲染为白底 pill 按钮
 * （h-32px · pad 0 12px · 500 14px/21px · 1px hairline 边框，官方实测），
 * 文案 "Show More" / "Show Less"（Title Case）+ 方向箭头，aria-expanded 随状态切换。
 * 触发器是 <button> 且带 aria-expanded；调用方可通过原生 aria-controls 关联内容区域。
 * 组件只渲染触发器，不管理目标内容、焦点移动或 live region。
 */

export interface ShowMoreProps extends Omit<React.ComponentProps<"button">, "children"> {
  /** 官方 API：受控展开状态 */
  expanded?: boolean;
  /** 官方 API：无边框变体 */
  noBorder?: boolean;
}

function ShowMore({ expanded = false, noBorder, className, ...props }: ShowMoreProps) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      data-slot="show-more"
      aria-expanded={expanded}
      className={cn(
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-background px-3 text-[length:14px] font-medium whitespace-nowrap text-foreground transition-colors outline-none hover:bg-gray-alpha-200 focus-ring disabled:pointer-events-none disabled:opacity-50",
        !noBorder && "border border-gray-alpha-400",
        className,
      )}
      {...props}
    >
      {t(expanded ? "Show Less" : "Show More")}
      {expanded ? (
        <ChevronUp aria-hidden className="size-4" />
      ) : (
        <ChevronDown aria-hidden className="size-4" />
      )}
    </button>
  );
}

export { ShowMore };
