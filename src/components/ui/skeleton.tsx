import * as React from "react";

import { cn, toCssSize } from "@/lib/utils";

/**
 * Skeleton — 加载占位骨架（docs/geist-markdown-refs/components/skeleton.md 官方语义）。
 * 导出：Skeleton。
 *
 * 官方 API：
 * - width / height / boxHeight：尺寸（number 视为 px，或 CSS 字符串）。
 *   包裹 children 且未给尺寸时，按 children 自动计算；给固定尺寸时展开/收起不回流。
 * - pill / rounded / squared：胶囊 / 圆角 8px / 直角 形状变体（默认 rounded-md）。
 * - animated：是否播放加载动画（默认 true），配合全局 prefers-reduced-motion。
 * - button：按钮形态，外加 1px 边框贴合按钮外框。
 * - show：是否显示骨架（默认 true）。true 时 children 以 visibility:hidden 隐藏
 *   （仍占位、不可聚焦）；false 时显示真实 children 并保留盒子尺寸。
 * 材质对齐 Geist 实测：bg-gray-alpha-200（light rgba(0,0,0,0.08) /
 * dark rgba(255,255,255,0.09)）。
 *
 * 动画语义（2026-09-12 起）：
 * - 从整体呼吸的 `animate-pulse`（Tailwind 默认 2s cubic-bezier(0.4,0,0.6,1)）
 *   改为 1.4s 流光带扫过（`--animate-skeleton-shimmer`）。原因有两条：
 *   1) 周期：2s 的整块明暗呼吸在感知上偏慢、偏"装饰"，像静态占位而不是进行中；
 *      1.4s 与同族 LoadingDots 的 blink 同周期，一次循环内就能读出节奏。
 *   2) 语义：pulse 只是明暗变化，没有方向；流光带的水平位移天然表达"数据正在
 *      流入这块区域"，与 Apple HIG「Loading」章节要求的
 *      「不要空白等待，尽早显示占位内容并让用户看出正在进行」一致
 *      （HIG 未规定帧率/时长，只规定确定型 vs 不确定型的选择逻辑）。
 * - 降级：`motion-reduce:` 完全停用动画并保留静态底色（HIG 无障碍要求）。
 */

type Size = number | string;

export interface SkeletonProps extends React.ComponentProps<"div"> {
  /** 骨架宽度（number 视为 px） */
  width?: Size;
  /** 骨架高度（number 视为 px） */
  height?: Size;
  /** 包裹 children 时盒子高度（number 视为 px），与 height 等价 */
  boxHeight?: Size;
  /** 胶囊形状（圆角全满） */
  pill?: boolean;
  /** 圆角 8px */
  rounded?: boolean;
  /** 直角 */
  squared?: boolean;
  /** 是否播放加载动画（默认 true） */
  animated?: boolean;
  /** 按钮形态：外加 1px 边框 */
  button?: boolean;
  /** 是否显示骨架（默认 true；false 时显示 children 并保留尺寸） */
  show?: boolean;
}

function Skeleton({
  className,
  width,
  height,
  boxHeight,
  pill,
  rounded,
  squared,
  animated = true,
  button,
  show = true,
  children,
  style,
  ...props
}: SkeletonProps) {
  const boxStyle = React.useMemo<React.CSSProperties>(() => {
    const next: React.CSSProperties = {};
    if (width != null) next.width = toCssSize(width);
    const resolvedHeight = height ?? boxHeight;
    if (resolvedHeight != null) {
      next.height = toCssSize(resolvedHeight);
    } else if (children == null && width != null) {
      // 无 children 且只给宽度时，给一个文本行默认高度
      next.height = "16px";
    }
    return next;
  }, [width, height, boxHeight, children]);

  return (
    <div
      data-slot="skeleton"
      data-show={show || undefined}
      className={cn(
        "inline-flex flex-initial",
        show && [
          // 流光带需要相对定位的裁切容器：overflow-hidden 保证扫过元素边缘的
          // 40% 宽渐隐带不会溢出到相邻内容上。
          animated && "relative overflow-hidden motion-reduce:!animate-none",
          "rounded-md bg-gray-alpha-200",
          pill && "rounded-full",
          rounded && "rounded-lg",
          squared && "rounded-none",
          button && "border border-gray-alpha-400",
        ],
        !show && !button && "rounded-md",
        className,
      )}
      style={{ ...boxStyle, ...style }}
      {...props}
    >
      {show && animated ? (
        // 渐变本体放在子层而不是 ::after：Skeleton 的外层会被调用方用 className
        // 覆盖成任意形态（例如 pill 头像、100% 宽卡片），子层跟着父级盒模型走，
        // 不需要再去推导伪元素的尺寸。aria-hidden 保证装饰层不进无障碍树。
        <span
          aria-hidden="true"
          data-slot="skeleton-shimmer"
          className={cn(
            "pointer-events-none absolute inset-0 animate-(--animate-skeleton-shimmer) will-change-transform",
            "bg-[linear-gradient(90deg,transparent,var(--uni-gray-alpha-300),transparent)]",
          )}
        />
      ) : null}
      {children != null && <div className={cn(show && "invisible")}>{children}</div>}
    </div>
  );
}

export { Skeleton };
