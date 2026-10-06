import { withLayerBridge } from "@/lib/layer-bridge";
// Tremor Raw · Tracker [v1.0.0] —— 源码内置自 github.com/tremorlabs/tremor（Apache-2.0，© Tremor contributors）
// 本地适配：radix-ui 聚合导入、cn 工具、语义 token（bg-foreground/text-background/text-copy-13）、
// 默认底色改用随主题翻转的 bg-gray-400、移除 tremor-id 标记；其余保持上游逻辑。

import React from "react"
import { HoverCard as HoverCardPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const LayerHoverCardPrimitiveContent = withLayerBridge(HoverCardPrimitive.Content);

export interface TrackerBlockProps {
  key?: string | number
  color?: string
  tooltip?: string
  hoverEffect?: boolean
  defaultBackgroundColor?: string
}

const Block = ({
  color,
  tooltip,
  defaultBackgroundColor,
  hoverEffect,
}: TrackerBlockProps) => {
  const [open, setOpen] = React.useState(false)
  return (
    <HoverCardPrimitive.Root
      open={open}
      onOpenChange={setOpen}
      openDelay={0}
      closeDelay={0}
    >
      <HoverCardPrimitive.Trigger onClick={() => setOpen(true)} asChild>
        <div className="size-full overflow-hidden px-[0.5px] transition first:rounded-l-[4px] first:pl-0 last:rounded-r-[4px] last:pr-0 sm:px-px">
          <div
            className={cn(
              "size-full rounded-[1px]",
              color || defaultBackgroundColor,
              hoverEffect ? "hover:opacity-50" : "",
            )}
          />
        </div>
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal>
        <LayerHoverCardPrimitiveContent
          data-material="floating"
          data-material-surface="inverted"
          sideOffset={10}
          side="top"
          align="center"
          avoidCollisions
          className={cn(
            // base
            "z-[var(--uni-z-tooltip)] w-auto rounded-overlay px-2 py-1 text-copy-13",
            // 材质
            "shadow-(--material-shadow-base)",
            // text color
            "text-background",
            // background color
            "bg-foreground",
          )}
        >
          {tooltip}
        </LayerHoverCardPrimitiveContent>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  )
}

Block.displayName = "Block"

export interface TrackerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TrackerBlockProps[]
  defaultBackgroundColor?: string
  hoverEffect?: boolean
}

const Tracker = React.forwardRef<HTMLDivElement, TrackerProps>(
  (
    {
      data = [],
      defaultBackgroundColor = "bg-gray-400",
      className,
      hoverEffect,
      ...props
    },
    forwardedRef,
  ) => {
    return (
      <div
        ref={forwardedRef}
        data-slot="tracker"
        className={cn("group flex h-8 w-full items-center", className)}
        {...props}
      >
        {data.map((props, index) => (
          <Block
            key={props.key ?? index}
            defaultBackgroundColor={defaultBackgroundColor}
            hoverEffect={hoverEffect}
            {...props}
          />
        ))}
      </div>
    )
  },
)

Tracker.displayName = "Tracker"

export { Tracker }
