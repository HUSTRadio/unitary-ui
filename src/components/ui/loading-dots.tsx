import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * LoadingDots — 内联加载三点动画（docs/geist-markdown-refs/components/loading-dots.md 官方语义）。
 * 官方 API 与实测值：
 * - size: "sm" | "md" | "lg"（圆点直径 2 / 3 / 4px，官方 size-0.5 / size-[3px] / size-1），
 *   也接受任意 px 数值（官方 Best Practices：与相邻字号匹配）；
 * - 可包裹文字内容（官方 "With text" 用法：<LoadingDots size="md"><p>Loading</p></LoadingDots>）；
 *   文字渲染在圆点左侧，与圆点之间 8px 间距（官方 mr-2 wrapper）；
 * - 圆点 mx-px（相邻 2px）+ blink 动画（1.4s ease infinite，delay 0/0.2/0.4s）；
 * - 包裹 span 带 aria-live="polite"；圆点纯装饰（aria-hidden）；
 * - prefers-reduced-motion 时停止动画。
 */

const DOT_SIZES = {
  sm: 2,
  md: 3,
  lg: 4,
} as const;

type LoadingDotsSize = keyof typeof DOT_SIZES;

interface LoadingDotsProps extends React.ComponentProps<"span"> {
  /** 圆点直径：sm(2px) / md(3px) / lg(4px)，或任意 px 数值（官方 Best Practices） */
  size?: LoadingDotsSize | number;
}

function LoadingDots({ className, size = "md", children, ...props }: LoadingDotsProps) {
  const dotSize = typeof size === "number" ? size : DOT_SIZES[size];

  return (
    <span
      data-slot="loading-dots"
      aria-live="polite"
      className={cn("inline-flex items-center align-middle", className)}
      {...props}
    >
      {children ? <div className="mr-2">{children}</div> : null}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className="mx-px inline-block animate-blink rounded-full bg-gray-900 motion-reduce:animate-none"
          style={{
            width: dotSize,
            height: dotSize,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  );
}

export { LoadingDots, type LoadingDotsProps, type LoadingDotsSize };
