import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Progress — Geist 官方 Progress 规范（docs/geist-markdown-refs/components/progress.md 实测）。
 * 官方实测：4px 高（h-1）、全宽圆角轨道 bg gray-alpha-200；
 * 填充指示器用 bg-progress，随 value 以 transition-transform 平滑移动。
 * 默认 value=0 / max=100；用法 <Progress value={30} />。
 *
 * 修复（2026-08）：value/max 此前被解构用于计算百分比后未转发给 Radix Root（仅 {...props}），
 * 导致 aria-valuenow 永不输出、max={40} 时 aria-valuemax 仍为 100。
 * 现在 value={value} max={max} 显式传入 Root，aria-valuenow/aria-valuemax 随值输出；
 * value=null 时 Radix 渲染 indeterminate（无 aria-valuenow，同原生 <progress> 无 value 语义）。
 */

function Progress({
  className,
  value,
  max = 100,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  value?: number | null;
}) {
  const percent = value == null ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      max={max}
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full bg-gray-alpha-200",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-progress transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
