import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Badge — 官方 @vercel/geistcn Badge 对齐实现（vercel.com/geist/badge 实测）。
 *
 * - 尺寸体系：sm h-5 / md h-6 / lg h-8，圆角全 pill（官方无透明边框）。
 * - 变体：gray/blue/purple/amber/red/pink/green/teal/inverted/trial/turbo/pill/outline
 *   + contrast="low"（subtle = 胶囊 + 纯文字无填充，官方 2026-08-24 实测）
 *   + variant="outline"（仅框线无填充，文字与边框同 gray 系）
 */
const badgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.25 whitespace-nowrap rounded-full py-0.5 font-medium capitalize tabular-nums tracking-normal " +
    "**:data-[slot=icon]:block **:data-[slot=icon]:shrink-0 " +
    "**:data-[slot=icon]:data-[glyph=circular]:-ml-1.75 **:data-[slot=icon]:has-[[data-glyph=circular]]:-ml-1.75 has-[[data-glyph=circular]]:pr-2.5",
  {
    variants: {
      size: {
        sm: "h-5 gap-1 px-2 text-[11px]/[20px] tracking-[0.2px] **:data-[slot=icon]:size-3 **:data-[slot=icon]:-ml-0.5 **:data-[slot=icon]:data-[glyph=circular]:-ml-1 **:data-[slot=icon]:has-[[data-glyph=circular]]:-ml-1",
        md: "h-6 gap-1.25 px-3 text-[12px]/[24px] **:data-[slot=icon]:size-3.5 **:data-[slot=icon]:-ml-1 **:data-[slot=icon]:data-[glyph=circular]:-ml-1.75 **:data-[slot=icon]:has-[[data-glyph=circular]]:-ml-1.75 has-[[data-glyph=circular]]:pr-2.5",
        lg: "h-8 gap-1.5 px-3 text-sm **:data-[slot=icon]:size-4 **:data-[slot=icon]:data-[glyph=circular]:-ml-1 **:data-[slot=icon]:has-[[data-glyph=circular]]:-ml-1",
      },
      variant: {
        // 官方变体色值 → palette token 映射（src/styles/index.css 双主题 token）：
        // light/dark 各取与官方实测色最相近的档，保持深底亮字可读性。
        gray: "bg-gray-900 text-white dark:bg-gray-500",
        blue: "bg-blue-900 text-white dark:bg-blue-800",
        purple: "bg-purple-800 text-white",
        amber: "bg-amber-500 text-black dark:bg-amber-700",
        red: "bg-badge-red text-badge-red-foreground",
        pink: "bg-pink-800 text-white",
        green: "bg-badge-green text-badge-green-foreground",
        teal: "bg-badge-teal text-badge-teal-foreground",
        inverted: "bg-gray-1000 text-gray-100",
        trial: "bg-black text-white bg-linear-[135deg,#0070f3,#f81ce5]",
        turbo: "bg-black text-white bg-linear-[135deg,#ff1e56,#0096ff]",
        pill: "bg-background text-black dark:text-white ring-1 ring-gray-alpha-400 ring-inset hover:[a,button]:bg-gray-200",
        // 仅框线（官方 badge 实测 2026-08-24：border 0.57px 半透明 + 透明底 + 文字同色系）。
        // gray-alpha 边框在 light/dark 自适应；文字与边框同 gray 系（light #4d4d4d / dark #a1a1a1）。
        outline:
          "bg-transparent border border-gray-alpha-500 text-gray-900 dark:text-gray-400 dark:border-gray-alpha-500",
      },
      contrast: {
        // 官方 subtle（vercel.com/geist/badge dark 实测 2026-08-24）= 胶囊容器 + 纯文字，
        // 无边框无填充背景无 before 层；文字色随主题（light 深 / dark 亮）。
        // 必须补 dark:bg-transparent 抵消 variant 的 dark:bg-*（cva compound 是追加非覆盖）。
        low: "relative bg-transparent dark:bg-transparent",
      },
    },
    compoundVariants: [
      {
        variant: "gray",
        contrast: "low",
        className: "text-gray-1000", // light #171717 / dark #ededed，官方完全一致
      },
      {
        variant: "blue",
        contrast: "low",
        className: "text-blue-900", // light #0060d6 / dark #5ea2ff，≈官方 #0068d6/#52a8ff
      },
      {
        variant: "purple",
        contrast: "low",
        className:
          "text-purple-800 dark:text-purple-900", // light #773bb5 / dark #c57df0 ≈官方 #7820bc/#bf7af0
      },
      {
        variant: "amber",
        contrast: "low",
        className: "text-amber-900", // light #a35200 / dark #ff9a00 ≈官方 #a35200/#f2a20d
      },
      {
        variant: "red",
        contrast: "low",
        className:
          "text-badge-red-subtle-foreground", // light #cb2a2f / dark #ff6166，官方完全一致
      },
      {
        variant: "pink",
        contrast: "low",
        className:
          "text-pink-800 dark:text-pink-900", // light #d9216e / dark #ff66ad ≈官方 #bd2864/#f75f8f
      },
      {
        variant: "green",
        contrast: "low",
        className: "text-green-900", // light #267a3b / dark #6fe28d ≈官方 #297a3a/#62c073
      },
      {
        variant: "teal",
        contrast: "low",
        className: "text-teal-900", // light #0c7869 / dark #12b5a1 ≈官方 #067a6e/#0ac7b4
      },
    ],
    defaultVariants: {
      variant: "gray",
      size: "md",
    },
  },
);

function Badge({
  className,
  variant = "gray",
  size = "md",
  contrast,
  icon,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** 官方 icon prop：图标会被注入 data-slot="icon" 并按尺寸缩放 */
    icon?: React.ReactNode;
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "span";

  const iconNode =
    icon && React.isValidElement<{ "data-slot"?: string; "aria-hidden"?: boolean }>(icon)
      ? React.cloneElement(icon, { "data-slot": "icon", "aria-hidden": true })
      : null;

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, size, contrast }), className)}
      {...props}
    >
      {iconNode}
      {props.children}
    </Comp>
  );
}

export { Badge, badgeVariants };
