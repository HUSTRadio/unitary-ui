import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

type TooltipPosition = "top" | "bottom" | "left" | "right";
type TooltipBoxAlign = "left" | "center" | "right";
type TooltipType = "default" | "success" | "error" | "warning" | "violet";

interface TooltipProps {
  children: React.ReactNode;
  text: React.ReactNode;
  position?: TooltipPosition;
  boxAlign?: TooltipBoxAlign;
  delay?: boolean | number;
  tip?: boolean;
  center?: boolean;
  type?: TooltipType;
  disableTriggers?: boolean;
  className?: string;
}

const tooltipColors: Record<TooltipType, { background: string; foreground: string }> = {
  // Official uses the INVERTED surface: light -> bg #0a0a0a fg #ededed; dark -> bg white fg #0a0a0a
  default: { background: "var(--invert-background)", foreground: "var(--invert-foreground)" },
  success: { background: "var(--success)", foreground: "#ffffff" },
  error: { background: "var(--destructive)", foreground: "#ffffff" },
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
  const delayDuration = typeof delay === "number" ? delay : delay ? 150 : 0;

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
              } as React.CSSProperties
            }
            className={cn(
              "z-[99999] max-w-64 rounded-[8px] bg-[var(--tooltip-background)] px-2 py-1.5 text-[13px]/[1.3] text-[var(--tooltip-foreground)] shadow-[var(--material-shadow-tooltip)] outline-none data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none",
              center ? "text-center" : "text-left",
              className,
            )}
          >
            {text}
            {tip ? (
              <TooltipPrimitive.Arrow
                width={14}
                height={7}
                className="fill-[var(--tooltip-background)]"
              />
            ) : null}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export { Tooltip };
