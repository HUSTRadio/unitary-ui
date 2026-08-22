import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type TooltipBoxAlign = "left" | "center" | "right";
export type TooltipType = "default" | "success" | "error" | "warning" | "violet";

export interface TooltipProps {
  children: React.ReactNode;
  text: React.ReactNode;
  position?: TooltipPosition;
  boxAlign?: TooltipBoxAlign;
  delay?: boolean | number;
  tip?: boolean;
  center?: boolean;
  type?: TooltipType;
  /** @deprecated 兼容内部组合用法；新代码应按条件决定是否渲染 Tooltip。 */
  disableTriggers?: boolean;
  className?: string;
}

const tooltipColors: Record<TooltipType, { background: string; foreground: string }> = {
  // Official default tooltip uses the normal surface: bg background-100 (light #fff / dark #0a0a0a) + gray-1000 text.
  default: { background: "var(--background-100)", foreground: "var(--foreground)" },
  success: { background: "var(--success)", foreground: "#ffffff" },
  error: {
    background: "var(--destructive)",
    foreground: "var(--destructive-foreground)",
  },
  warning: { background: "var(--warning)", foreground: "#0a0a0a" },
  violet: { background: "var(--purple-700)", foreground: "#ffffff" },
};

/** Official Geist single-component Tooltip contract. */
function Tooltip({
  children,
  text,
  position = "top",
  boxAlign = "center",
  delay = true,
  tip = true,
  center = true,
  type = "default",
  disableTriggers = false,
  className,
}: TooltipProps) {
  const trigger = React.isValidElement(children) ? (
    children
  ) : (
    <span tabIndex={0} className="inline-flex outline-none focus-ring">
      {children}
    </span>
  );
  const colors = tooltipColors[type];
  const delayDuration = typeof delay === "number" ? delay : delay ? 400 : 0;
  const tipClipId = React.useId();

  if (disableTriggers) return <>{children}</>;

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{trigger}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={position}
            align={boxAlign === "left" ? "start" : boxAlign === "right" ? "end" : "center"}
            sideOffset={10}
            collisionPadding={8}
            style={
              {
                "--tooltip-background": colors.background,
                "--tooltip-foreground": colors.foreground,
                /* 官方 tooltip 材质：1px 边框（shadow-as-border）+ 轻投影；
                   箭头描边与主体边框同源，保证气泡轮廓连续。 */
                "--tooltip-tip-stroke": "var(--gray-alpha-400)",
                boxShadow:
                  "0 0 0 1px var(--gray-alpha-400), 0 1px 1px #00000005, 0 4px 8px #0000000a",
              } as React.CSSProperties
            }
            className={cn(
              "z-[99999] max-w-[250px] rounded-[8px] bg-[var(--tooltip-background)] px-2 py-1.5 text-[13px]/[1.3] text-[var(--tooltip-foreground)] outline-none data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:duration-100 data-[state=delayed-open]:ease-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-100 motion-reduce:animate-none",
              center ? "text-center" : "text-left",
              className,
            )}
          >
            {text}
            {tip ? (
              <TooltipPrimitive.Arrow asChild>
                <svg width="14" height="7" viewBox="0 0 14 7" fill="none" aria-hidden>
                  <g clipPath={`url(#${tipClipId})`}>
                    <path
                      d="M15 -0.5V0.5H12.9834L12.8184 0.508789C12.4377 0.550822 12.0853 0.738056 11.8359 1.03418L8.53027 4.95996C7.73114 5.90893 6.26886 5.90892 5.46973 4.95996L2.16406 1.03418C1.87905 0.695733 1.45907 0.5 1.0166 0.5H-1V-0.5H15Z"
                      fill="var(--tooltip-background)"
                      stroke="var(--tooltip-tip-stroke)"
                    />
                  </g>
                  <defs>
                    <clipPath id={tipClipId}>
                      <rect width="14" height="7" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </TooltipPrimitive.Arrow>
            ) : null}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export { Tooltip };
