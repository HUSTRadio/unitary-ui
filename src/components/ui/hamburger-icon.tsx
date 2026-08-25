/**
 * HamburgerIcon — 官方 Geist 图标原样引用 + 自制 morph 过渡。
 *
 * 图形来源：@vercel/geist-icons 官方 path 数据（2026-08-23 提取，
 * viewBox 0 0 16 16，逐字未改动——遵循"SVG path 禁止手改，只整体引用"约定）：
 * - 汉堡 = Menu（三横杠）：M1 2h14v1.5H1zm0 10.5h14V14H1zm.75-5.25H1v1.5h14v-1.5z
 * - 叉号 = Cross：m12.47 13.53.53.53L14.06 13l-.53-.53L9.06 8l4.47-4.47.53-.53L13
 *   1.94l-.53.53L8 6.94 3.53 2.47 3 1.94 1.94 3l.53.53L6.94 8l-4.47 4.47-.53.53L3
 *   14.06l.53-.53L8 9.06z
 *
 * 过渡（自制）：两枚同尺寸 SVG 绝对定位叠放，切换时旧图形旋转缩小淡出、
 * 新图形反向旋入，300ms cubic-bezier(0.32,0.72,0,1)；颜色继承 currentColor。
 */
import type { CSSProperties } from "react";

export interface HamburgerIconProps {
  /** Whether the icon shows the crossed (X) state. */
  open: boolean;
  /** Square box size in pixels. @default 16 */
  size?: number;
  className?: string;
}

/** 官方 Menu（三横杠）path —— 逐字引用，勿编辑。 */
const MENU_PATH =
  "M1 2h14v1.5H1zm0 10.5h14V14H1zm.75-5.25H1v1.5h14v-1.5z";

/** 官方 Cross path —— 逐字引用，勿编辑。 */
const CROSS_PATH =
  "m12.47 13.53.53.53L14.06 13l-.53-.53L9.06 8l4.47-4.47.53-.53L13 1.94l-.53.53L8 6.94 3.53 2.47 3 1.94 1.94 3l.53.53L6.94 8l-4.47 4.47-.53.53L3 14.06l.53-.53L8 9.06z";

export function HamburgerIcon({
  open,
  size = 16,
  className,
}: HamburgerIconProps) {
  const boxStyle: CSSProperties = {
    width: size,
    height: size,
  };

  const svgBase =
    "absolute inset-0 h-full w-full transition-[opacity,transform] duration-(--uni-duration-slow) ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";

  return (
    <span
      data-slot="hamburger-icon"
      data-open={String(open)}
      role="none"
      aria-hidden="true"
      className={`relative block${className ? ` ${className}` : ""}`}
      style={boxStyle}
    >
      {/* 汉堡态：open 时顺时针缩小淡出 */}
      <svg
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-state={open ? "hidden" : "shown"}
        className={`${svgBase} ${
          open ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      >
        <path d={MENU_PATH} fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
      </svg>
      {/* 叉号态：closed 时逆时针缩小隐藏 */}
      <svg
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-state={open ? "shown" : "hidden"}
        className={`${svgBase} ${
          open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
        }`}
      >
        <path d={CROSS_PATH} fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
      </svg>
    </span>
  );
}
