import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * LoadingDots — 内联加载三点动画（docs/geist-markdown-refs/components/loading-dots.md 官方语义）。
 * 官方 API：
 * - size: "sm" | "md" | "lg"（圆点直径 8 / 12 / 16px），也接受任意 px 数值；
 * - 可包裹文字内容（官方 "With text" 用法：<LoadingDots size="md"><p>Loading</p></LoadingDots>）；
 * - 包裹 span 带 aria-live="polite"；圆点纯装饰（aria-hidden）；
 * - prefers-reduced-motion 时停止动画。
 */

const DOT_SIZES = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

type LoadingDotsSize = keyof typeof DOT_SIZES;

interface LoadingDotsProps extends React.ComponentProps<"span"> {
  /** 圆点直径：sm(8px) / md(12px) / lg(16px)，或任意 px 数值（官方 Best Practices） */
  size?: LoadingDotsSize | number;
}

function LoadingDots({ className, size = "md", children, ...props }: LoadingDotsProps) {
  const dotSize = typeof size === "number" ? size : DOT_SIZES[size];

  return (
    <span
      data-slot="loading-dots"
      aria-live="polite"
      className={cn("inline-flex items-center gap-1 align-middle", className)}
      {...props}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className="animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none"
          style={{
            width: dotSize,
            height: dotSize,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
      {children}
    </span>
  );
}

export { LoadingDots, type LoadingDotsProps, type LoadingDotsSize };
