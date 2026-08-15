import * as React from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * ContextCard — Geist 官方 Context Card 规范（docs/geist-markdown-refs/components/context-card.md）。
 * 浮层卡片：内容自适应、6px 圆角、tooltip 材质与方向箭头。
 * 组合：Header（avatar + title/description）→ Body（元数据行）→ Footer（单一主操作）。
 *
 * ContextCardTrigger — 官方契约（hover/focus 打开、~150ms 延迟、Escape 关闭并返回焦点）。
 * 基于 Radix HoverCard：hover 与键盘 focus 均打开，openDelay 默认 150ms，
 * Escape/失焦/外部点击关闭（Radix DismissableLayer），焦点始终留在 trigger 上。
 * - content：卡片文案（string 或任意节点，以 text-copy-13 呈现）
 * - side/align/sideOffset：浮层位置（默认 top/center/8）
 * - render：自定义 trigger 元素（如 <a>），行为合并到该元素上；默认渲染
 *   role="button" tabIndex=0 的 <div>（键盘可达），children 作为 accessible name
 */

function ContextCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="context-card"
      className={cn(
        "w-fit rounded-[6px] bg-background-100 p-3 shadow-[var(--material-shadow-tooltip)]",
        className,
      )}
      {...props}
    />
  );
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
            role="button"
            tabIndex={0}
            data-slot="context-card-trigger"
            className="inline-flex cursor-pointer outline-none focus-ring"
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
            "z-[1000000] w-fit rounded-[6px] bg-background-100 p-3 shadow-[var(--material-shadow-tooltip)] outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className,
          )}
        >
          {typeof content === "string" ? (
            <p className="text-copy-16 whitespace-nowrap text-foreground">{content}</p>
          ) : (
            content
          )}
          <HoverCardPrimitive.Arrow
            width={14}
            height={7}
            className="fill-background-100 stroke-gray-alpha-400"
          />
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
