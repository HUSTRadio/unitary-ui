import type { CSSProperties, ReactNode } from "react";

import { useScrollDirection } from "@/lib/use-scroll-direction";

export interface NavbarProps {
  /**
   * 定位行为：
   * - pinned（默认）：sticky top-0 常驻顶部；
   * - static：随文档流滚动；
   * - auto-hide：fixed 吸顶，向下滚动时隐藏、向上滚回复现。
   */
  scrollBehavior?: "static" | "pinned" | "auto-hide";
  /** solid（默认）常驻底色；transparent 无底色，可配合 solidOnScroll 滚动后补色。 */
  variant?: "solid" | "transparent";
  /** 仅 transparent 下有意义：向下滚动超阈值后自动补底色与下边框。 */
  solidOnScroll?: boolean;
  /** 数字→内联 style.height；字符串→透传为高度类名。默认 h-16。 */
  height?: string | number;
  className?: string;
  children?: ReactNode;
}

/** auto-hide / solidOnScroll 共用的滚动触发阈值。 */
const SCROLL_THRESHOLD = 80;

/**
 * Navbar：可配置定位与外观的顶栏。
 *
 * - 渲染 `<header data-slot="navbar">`，children 即内容 slot 区
 *   （leading/default/trailing 三区由调用方 flex 组织）；
 * - pinned→`sticky top-0`；static→`relative`；auto-hide→`fixed inset-x-0 top-0`
 *   且向下滚动后加 `-translate-y-full` 收起；
 * - 注意：auto-hide 的 header transform 会创建 containing block，
 *   请勿在其内部再放 sticky/fixed 子元素。
 */
export function Navbar({
  scrollBehavior = "pinned",
  variant = "solid",
  solidOnScroll = false,
  height,
  className,
  children,
}: NavbarProps) {
  const direction = useScrollDirection(SCROLL_THRESHOLD);
  const scrolledDown = direction === "down";

  const positionClass =
    scrollBehavior === "static"
      ? "relative"
      : scrollBehavior === "auto-hide"
        ? "fixed inset-x-0 top-0 z-[var(--uni-z-header,40)] transition-transform duration-(--uni-duration-slow) ease-snap motion-reduce:transition-none"
        : "sticky top-0 z-[var(--uni-z-header,40)]";

  const hidden = scrollBehavior === "auto-hide" && scrolledDown;

  // solid 常驻底色；transparent + solidOnScroll 在滚动后才补底色。
  const filled = variant === "solid" || (solidOnScroll && scrolledDown);
  const surfaceClass = filled
    ? "bg-background-100 border-b border-gray-alpha-400"
    : "";

  const isNumericHeight = typeof height === "number";
  // 数字走内联样式（变量稳定）；字符串透传类名；未指定用默认 h-16。
  const heightClass = isNumericHeight ? "" : (height ?? "h-16");
  const style: CSSProperties | undefined = isNumericHeight
    ? { height }
    : undefined;

  return (
    <header
      data-slot="navbar"
      data-behavior={scrollBehavior}
      data-solid-on-scroll={solidOnScroll ? "true" : undefined}
      className={`${positionClass} ${heightClass} ${hidden ? "-translate-y-full " : ""}${surfaceClass}${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
    </header>
  );
}
