import * as React from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * ContextCard — Geist 官方 Context Card 规范（docs/geist-markdown-refs/components/context-card.md）。
 * 浮层卡片：内容自适应、圆角表面与方向箭头。
 * 组合：Header（avatar + title/description）→ Body（元数据行）→ Footer（单一主操作）。
 *
 * 本组件只是纯内容容器：surface（边框/背景/圆角/阴影/内边距）由 popover 外壳统一承担，
 * 避免 content 与 Content 双层嵌套时出现双层边框。
 *
 * ContextCardTrigger — 官方契约（hover/focus 打开、~150ms 延迟、Escape 关闭并返回焦点）。
 * 基于 Radix HoverCard：hover 与键盘 focus 均打开，openDelay 默认 150ms，
 * Escape/失焦/外部点击关闭（Radix DismissableLayer），焦点始终留在 trigger 上。
 * - content：卡片文案（string 或任意节点，string 以 text-copy-16 呈现）
 * - side/align/sideOffset：浮层位置（默认 top/center/8）
 * - render：自定义 trigger 元素（如 <a>），行为合并到该元素上；默认渲染
 *   flex-[0_1_auto] overflow-hidden 的 <div>，children 作为 accessible name
 */

function ContextCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="context-card" className={cn("w-fit", className)} {...props} />;
}

type ContextCardTriggerProps = {
  /** 卡片内容（string 或 ReactNode） */
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  /** 打开延迟（官方 ~150ms，防快速划过鼠标时闪烁） */
  openDelay?: number;
  closeDelay?: number;
  /** 自定义 trigger 元素（行为合并到该元素上，如 <a />） */
  render?: React.ReactElement<{ className?: string }>;
  className?: string;
  children?: React.ReactNode;
};

function ContextCardTrigger({
  content,
  side = "top",
  align = "center",
  sideOffset = 8,
  openDelay = 150,
  closeDelay = 0,
  render,
  className,
  children,
}: ContextCardTriggerProps) {
  const trigger = render
    ? React.cloneElement(render, {
        className: cn(render.props.className, "outline-none focus-ring"),
      })
    : children;

  return (
    <HoverCardPrimitive.Root openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardPrimitive.Trigger asChild>
        {render ? (
          trigger
        ) : (
          <div
            data-slot="context-card-trigger"
            className="inline-flex flex-[0_1_auto] cursor-pointer overflow-hidden outline-none focus-ring"
          >
            {trigger}
          </div>
        )}
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          data-slot="context-card-popover"
          className={cn(
            "z-[1000000] w-fit rounded-[6px] border border-gray-alpha-400 bg-background-100 p-4 shadow-[var(--material-shadow-tooltip)] outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className,
          )}
        >
          {typeof content === "string" ? (
            <p className="text-copy-16 text-foreground">{content}</p>
          ) : (
            content
          )}
          {/* 官方箭头：14×7，fill 背景色 + stroke 专用 tip 色。手动定位（CSS 根据 data-side），
              根部深入 content 覆盖卡片边框，底边不描 stroke，避免与卡片边框叠加成割裂的内框。 */}
          <svg
            data-slot="context-card-tip"
            width={14}
            height={7}
            viewBox="0 0 14 7"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M15 -0.5V0.5H12.9834L12.8184 0.508789C12.4377 0.550822 12.0853 0.738056 11.8359 1.03418L8.53027 4.95996C7.73114 5.90893 6.26886 5.90892 5.46973 4.95996L2.16406 1.03418C1.87905 0.695733 1.45907 0.5 1.0166 0.5H-1V-0.5H15Z"
              fill="var(--background-100)"
              stroke="var(--context-card-tip-stroke)"
            />
          </svg>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
}

function ContextCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="context-card-header"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  );
}

function ContextCardAvatar({ className, ...props }: React.ComponentProps<"img">) {
  return (
    <img
      data-slot="context-card-avatar"
      className={cn("size-8 shrink-0 rounded-full", className)}
      {...props}
    />
  );
}

function ContextCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      data-slot="context-card-title"
      className={cn("text-label-16 text-foreground", className)}
      {...props}
    />
  );
}

function ContextCardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="context-card-description"
      className={cn("text-copy-13 text-muted-foreground", className)}
      {...props}
    />
  );
}

function ContextCardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="context-card-body"
      className={cn("mt-3 flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function ContextCardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="context-card-footer"
      className={cn("mt-3 flex items-center gap-2", className)}
      {...props}
    />
  );
}

export {
  ContextCard,
  ContextCardTrigger,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardDescription,
  ContextCardAvatar,
  ContextCardBody,
  ContextCardFooter,
};
