import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * EmptyState — 空状态（docs/geist-markdown-refs/components/empty-state.md 官方语义）。
 * 官方实测（2026-08 vercel.com/geist/empty-state 实时 DOM/computed style）：
 * - 容器：带边框卡片（rounded-[8px] r:8px、border gray-200 #ebebeb、bg-background、
 *   px-[70px] py-12、gap-6、flex-col items-center、[&>a]:text-sm）
 * - 图标气泡 EmptyStateIcon：54×54、rounded-[8px]、border gray-alpha-400、
 *   bg-background、p-[10px]、32px 图标、fg gray-900
 * - title：text-heading-16 + font-medium（16px/500/24px）、gray-1000、
 *   mx-auto max-w-[340px] text-center text-balance
 * - description：text-copy-14（14px/400/20px）、gray-900、同 title 居中约束
 * - title+description 上下 gap-2；CTA（children）为容器直接子元素，gap-6 分隔
 */

interface EmptyStateProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** 标题（Title Case） */
  title?: React.ReactNode;
  /** 描述（sentence case，补充信息而非复述标题） */
  description?: React.ReactNode;
  /** 图标气泡：<EmptyStateIcon icon={<Icon size={32} />} /> */
  icon?: React.ReactNode;
}

function EmptyState({ title, description, icon, className, children, ...props }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex w-full flex-col items-center gap-6 rounded-lg border border-gray-200 bg-background px-[70px] py-12 [&>a]:text-sm",
        className,
      )}
      {...props}
    >
      {icon}
      {(title || description) && (
        <div className="flex flex-col gap-2">
          {title && (
            <div className="mx-auto max-w-[340px] text-center text-balance text-heading-16 font-medium text-foreground">
              {title}
            </div>
          )}
          {description && (
            <div className="mx-auto max-w-[340px] text-center text-balance text-copy-14 text-muted-foreground">
              {description}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

interface EmptyStateIconProps extends React.ComponentProps<"div"> {
  /** 图标（32px，官方 IconChartBarPeak size={32}） */
  icon?: React.ReactNode;
}

function EmptyStateIcon({ icon, className, children, ...props }: EmptyStateIconProps) {
  // 官方 DOM：匿名包裹 div > aria-hidden 气泡（气泡承载全部视觉样式）。
  return (
    <div {...props}>
      <div
        aria-hidden="true"
        data-slot="empty-state-icon"
        className={cn(
          "flex size-[54px] shrink-0 items-center justify-center rounded-lg border border-gray-alpha-400 bg-background p-[10px] text-muted-foreground",
          className,
        )}
      >
        {icon ?? children}
      </div>
    </div>
  );
}

export { EmptyState, EmptyStateIcon };
