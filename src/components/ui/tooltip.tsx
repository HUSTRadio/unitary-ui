import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

import { TIP_ARROW_PATH } from "@/lib/tip-arrow";
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
  // HIG-AUD-015：**不制造焦点**——此前对非可聚焦子元素强注 `tabIndex ?? 0`，把纯展示内容
  // （`<span>`、纯文本）塞进 Tab 序列。现在只**透传**调用方显式声明的 `tabIndex`：需要键盘
  // 触发时由调用方声明（如 `<span tabIndex={0}>`）或直接用可聚焦元素（`<button>`/`<a>`）。
  // 本仓库内部消费点均属这两类（`tabs`/`progress`/`description` 已显式声明 tabIndex）。
  // hover + focus **双通道不变**：焦点落在子元素上时 Tooltip 照常打开。
  const trigger =
    React.isValidElement<{ tabIndex?: number; className?: string }>(children) &&
    children.type !== React.Fragment ? (
      React.cloneElement(children, {
        tabIndex: children.props.tabIndex,
        className: cn("outline-none focus-ring", children.props.className),
      })
    ) : (
      <span className="inline-flex outline-none focus-ring">{children}</span>
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
              "z-[var(--uni-z-tooltip)] max-w-[250px] rounded-overlay bg-[var(--tooltip-background)] px-2 py-1.5 text-[13px]/[1.3] text-[var(--tooltip-foreground)] outline-none data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:duration-(--uni-duration-fast) data-[state=delayed-open]:ease-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-(--uni-duration-fast) motion-reduce:animate-none!",
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
                      d={TIP_ARROW_PATH}
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
