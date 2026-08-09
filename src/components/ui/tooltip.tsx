import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Tooltip — Geist 浮动提示（对应官方 Tooltip，docs/geist-markdown-refs/components/tooltip.md）。
 * 官方实测（2026-08-08 浏览器 computed style，官方页面 /geist/tooltip）：
 * - 内容：bg 前景色（深色文字）· text 背景色 · r:6px · pad:0px 6px · 500 14px/21px
 * - 浮层材质：--material-shadow-tooltip（1px 描边 + 柔和投影，明暗主题均随 token 切换）
 * - sideOffset: 4；打开动画 data-[state=delayed-open]:animate-in（Radix 延迟 700ms 后进入 delayed-open）
 * 官方语义：Tooltip 用于解释「为什么存在」，而非「是什么」；图标-only 触发需配
 * aria-label 命名动作，Tooltip 正文补充上下文、不替代标签。
 * 颜色消费语义 token（--foreground / --background / --material-shadow-tooltip 随主题切换），
 * 不引入任何 `dark:` 前缀变体（Geist 原则：组件零主题分支）。
 */
const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-[6px] bg-foreground px-2 py-1 text-label-12 text-background shadow-[var(--material-shadow-tooltip)] data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
