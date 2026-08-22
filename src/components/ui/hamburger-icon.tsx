import type { CSSProperties } from "react";

export interface HamburgerIconProps {
  /** Whether the icon shows the morphed close (X) state. */
  open: boolean;
  /** Square box size in pixels. @default 16 */
  size?: number;
  /** Line thickness in pixels. @default 2 */
  strokeWidth?: number;
  className?: string;
}

/**
 * Animated hamburger icon drawn with plain CSS span lines (no SVG paths).
 * Closed: three stacked bars. Open: top/bottom bars rotate into an X while
 * the middle bar fades out. Color inherits from `currentColor`.
 */
export function HamburgerIcon({
  open,
  size = 16,
  strokeWidth = 2,
  className,
}: HamburgerIconProps) {
  // Distance each outer line travels to reach the vertical center.
  const offset = (size - strokeWidth) / 2;

  const lineStyle: CSSProperties = { height: strokeWidth };

  const lineBase =
    "absolute left-0 w-full rounded-full bg-current " +
    "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";

  return (
    <span
      data-slot="hamburger-icon"
      data-open={String(open)}
      role="none"
      aria-hidden="true"
      className={`relative block${className ? ` ${className}` : ""}`}
      style={{
        width: size,
        height: size,
        ["--ds-ham-offset" as string]: `${offset}px`,
      }}
    >
      {/* Top line */}
      <span
        data-line="top"
        className={`${lineBase} top-0 ${
          open ? "translate-y-[var(--ds-ham-offset)] rotate-45" : ""
        }`}
        style={lineStyle}
      />
      {/* Middle line */}
      <span
        data-line="middle"
        className={`${lineBase} top-1/2 -translate-y-1/2 ${open ? "opacity-0" : ""}`}
        style={lineStyle}
      />
      {/* Bottom line */}
      <span
        data-line="bottom"
        className={`${lineBase} bottom-0 ${
          open ? "-translate-y-[var(--ds-ham-offset)] -rotate-45" : ""
        }`}
        style={lineStyle}
      />
    </span>
  );
}
