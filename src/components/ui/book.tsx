import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Book — 官方 @vercel/geistcn Book 对齐实现（vercel.com/geist/book 实测）。
 * 官方 = 静态书封（无 Tabs 翻页）：196×240（aspect 49/60）、bg background-200、
 * radius 6px 4px 4px 6px（书脊侧非对称）、标题 16.38px/600、默认琥珀 #F5B047。
 * props：variant("simple"|"stripe") / width（数字或 {sm,md,…} 响应式）/ color / textColor /
 * icon / illustration / textured。
 * 最佳实践：封面装饰性 aria-hidden，标题走底层 heading 元素。
 */

/** 书脊高光 + 阴影（官方 bind 双渐变实测） */
const BIND_GRADIENT =
  "linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_12%,rgba(255,255,255,0.25)_29.25%,rgba(255,255,255,0)_50.5%,rgba(255,255,255,0)_75.25%,rgba(255,255,255,0.25)_91%,rgba(255,255,255,0)_100%),linear-gradient(90deg,rgba(0,0,0,0.03)_0%,rgba(0,0,0,0.1)_12%,rgba(0,0,0,0)_30%,rgba(0,0,0,0.02)_50%,rgba(0,0,0,0.2)_73.5%,rgba(0,0,0,0.5)_75.25%,rgba(0,0,0,0.15)_85.25%,rgba(0,0,0,0)_100%)";

/** 纸质纹理（官方 book-texture.avif 的 CSS 近似：feTurbulence 噪点，opacity .5 + hard-light + 180°） */
const TEXTURE_URL =
  "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')";

/** 默认封面图标 = Vercel 三角（官方实测 path） */
function VercelMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      data-slot="geist-icon"
      aria-hidden
      className={className}
    >
      <path fill="currentColor" fillRule="evenodd" d="m8 1 8 14H0z" clipRule="evenodd" />
    </svg>
  );
}

type BookWidth = number | { sm?: number; md?: number; lg?: number; xl?: number };

function Book({
  title,
  variant = "stripe",
  width = 196,
  color = "#f5b047",
  textColor,
  icon,
  illustration,
  textured = false,
  className,
}: {
  /** 书名（渲染为封面标题，SR 可读的底层 heading） */
  title?: string;
  variant?: "simple" | "stripe";
  /** 封面宽度；响应式 {sm,md,lg,xl}（任意数值经运行时 <style> 注入媒体查询） */
  width?: BookWidth;
  /** 封面色（默认官方琥珀 #F5B047） */
  color?: string;
  /** 标题颜色（默认跟随 gray-1000 token） */
  textColor?: string;
  /** 封面图标（默认 Vercel 三角 16×16） */
  icon?: React.ReactNode;
  /** 装饰插画（stripe 变体铺满色块；simple 变体渲染在标题下方） */
  illustration?: React.ReactNode;
  /** 纸质纹理 */
  textured?: boolean;
  className?: string;
}) {
  const numericWidth = typeof width === "number" ? width : undefined;
  const breakpoints: { key: "sm" | "md" | "lg" | "xl"; min: number }[] = [
    { key: "sm", min: 640 },
    { key: "md", min: 768 },
    { key: "lg", min: 1024 },
    { key: "xl", min: 1280 },
  ];
  const responsiveRules =
    typeof width === "object"
      ? breakpoints
          .filter((bp) => width[bp.key] !== undefined)
          .map((bp) => `@media (min-width:${bp.min}px){.book-width-resp{width:${width[bp.key]}px}}`)
          .join("")
      : "";

  return (
    <div
      className={cn(typeof width === "object" && "book-width-resp", className)}
      style={numericWidth !== undefined ? { width: numericWidth } : undefined}
    >
      {responsiveRules ? <style>{responsiveRules}</style> : null}
      <div className="relative aspect-[49/60]">
        <div
          className={cn(
            "absolute inset-0 flex flex-col overflow-hidden rounded-[6px_4px_4px_6px] bg-background-200",
            "shadow-[rgba(0,0,0,0.02)_0px_1px_1px_0px,rgba(0,0,0,0.1)_0px_4px_8px_-4px,rgba(0,0,0,0.03)_0px_16px_24px_-8px]",
            variant === "simple" && "bg-[var(--book-color)]",
          )}
          style={{ "--book-color": color } as React.CSSProperties}
        >
          {variant === "stripe" ? (
            <div
              aria-hidden
              className="relative flex flex-1 flex-row items-stretch justify-start gap-2 overflow-hidden"
              style={{ backgroundColor: color }}
            >
              <div className="w-full">{illustration}</div>
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 w-4 [background-image:var(--book-bind)]"
                style={{ "--book-bind": BIND_GRADIENT } as React.CSSProperties}
              />
            </div>
          ) : null}
          <div className="flex flex-row items-stretch">
            <div
              aria-hidden
              className="w-4 shrink-0 [background-image:var(--book-bind)]"
              style={{ "--book-bind": BIND_GRADIENT } as React.CSSProperties}
            />
            <div
              className="flex flex-col items-stretch gap-6 p-[calc(var(--book-width)*0.061)]"
              style={{ "--book-width": `${numericWidth ?? 196}px` } as React.CSSProperties}
            >
              <h3
                className="text-[16.38px]/[20.48px] font-semibold text-gray-1000"
                style={textColor ? { color: textColor } : undefined}
              >
                {title}
              </h3>
              {variant === "simple" && illustration ? (
                <div aria-hidden className="h-14 w-full">
                  {illustration}
                </div>
              ) : (
                (icon ?? <VercelMark />)
              )}
            </div>
          </div>
          {textured ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rotate-180 bg-[var(--book-texture)] opacity-50 mix-blend-hard-light"
              style={{ "--book-texture": TEXTURE_URL } as React.CSSProperties}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { Book };
