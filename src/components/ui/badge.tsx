import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Badge — 官方 @vercel/geistcn Badge 对齐实现（vercel.com/geist/badge 实测）。
 *
 * - 尺寸体系：sm h-5 / md h-6 / lg h-8，圆角全 pill，无 border（官方无透明边框）。
 * - 变体：gray/blue/purple/amber/red/pink/green/teal/inverted/trial/turbo/pill
 *   + contrast="low"（subtle 底色经 ::before 渲染，tint 取对应语义 *-200 token）。
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
        green: "bg-green-900 text-white dark:bg-green-800",
        teal: "bg-teal-900 text-white dark:bg-teal-800",
        inverted: "bg-gray-1000 text-gray-100",
        trial: "bg-black text-white bg-linear-[135deg,#0070f3,#f81ce5]",
        turbo: "bg-black text-white bg-linear-[135deg,#ff1e56,#0096ff]",
        pill: "bg-background text-black dark:text-white ring-1 ring-gray-alpha-400 ring-inset hover:[a,button]:bg-gray-200",
      },
      contrast: {
        low: "relative bg-transparent before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:content-[''] before:mix-blend-multiply dark:before:mix-blend-screen",
      },
    },
    compoundVariants: [
      {
        variant: "gray",
        contrast: "low",
        className:
          "text-gray-1000 before:bg-[oklch(from_var(--gray-200)_0.94_c_h)] dark:before:bg-[oklch(from_var(--gray-200)_0.27_c_h)]",
      },
      {
        variant: "blue",
        contrast: "low",
        className:
          "text-blue-900 before:bg-[oklch(from_var(--blue-200)_0.94_c_h)] dark:before:bg-[oklch(from_var(--blue-200)_0.27_c_h)]",
      },
      {
        variant: "purple",
        contrast: "low",
        className:
          "text-purple-800 dark:text-purple-900 before:bg-[oklch(from_var(--purple-200)_0.94_c_h)] dark:before:bg-[oklch(from_var(--purple-200)_0.27_c_h)]",
      },
      {
        variant: "amber",
        contrast: "low",
        className:
          "text-amber-900 before:bg-[oklch(from_var(--amber-200)_0.94_c_h)] dark:before:bg-[oklch(from_var(--amber-200)_0.27_c_h)]",
      },
      {
        variant: "red",
        contrast: "low",
        className:
          "text-badge-red-subtle-foreground before:bg-[oklch(from_var(--red-200)_0.94_c_h)] dark:before:bg-[oklch(from_var(--red-200)_0.27_c_h)]",
      },
      {
        variant: "pink",
        contrast: "low",
        className:
          "text-pink-800 dark:text-pink-900 before:bg-[oklch(from_var(--pink-200)_0.94_c_h)] dark:before:bg-[oklch(from_var(--pink-200)_0.27_c_h)]",
      },
      {
        variant: "green",
        contrast: "low",
        className:
          "text-green-900 before:bg-[oklch(from_var(--green-200)_0.94_c_h)] dark:before:bg-[oklch(from_var(--green-200)_0.27_c_h)]",
      },
      {
        variant: "teal",
        contrast: "low",
        className:
          "text-teal-900 before:bg-[oklch(from_var(--teal-200)_0.94_c_h)] dark:before:bg-[oklch(from_var(--teal-200)_0.27_c_h)]",
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
