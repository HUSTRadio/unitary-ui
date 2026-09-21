import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Pill — 可点击的筛选 chip（对应官方 Pill，docs/geist-markdown-refs/components/pill.md）。
 * 用于在一组互斥/多选的筛选项中切换查询条件。
 * variant="active" 高亮当前选中项（bg-selected + 前景色）；默认态为灰色描边 chip。
 * 颜色消费语义 token（--selected / --gray-alpha / --foreground 随主题切换），零 `dark:` 分支。
 *
 * 垂直光学补偿：项目字体栈解析到 OPPO Sans 时字形墨迹在行盒内整体偏下
 * （fontBoundingBox 16/4，4:1 不对称），`items-center` 只能居中行盒 ——
 * 实测各标签墨迹中心比药丸中心低 0.5~2.5px（拉丁 x-height 词最重），
 * 统一上移 `--uni-ink-shift`（14px ≈ 1.5px）后最大偏差 ≤1px。
 * 补偿量走共享 token（不再本组件硬编码），其它档位由 data-font-tier 归零。
 * 实现用 calc 内边距法：内容盒上移 token 值、上下内边距和不变 → 总高与 py-1 相同。
 * `text-box: trim-both` 在本项目目标浏览器不生效，已实测排除。
 */
export interface PillProps extends React.ComponentProps<"button"> {
  variant?: "default" | "active";
}

function Pill({ variant = "default", className, ...props }: PillProps) {
  return (
    <button
      type="button"
      data-slot="pill"
      data-variant={variant}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-background-100 px-3 pt-[calc(4px+var(--uni-ink-shift))] pb-[calc(4px-var(--uni-ink-shift))] text-label-14 text-foreground transition-colors",
        "hover:bg-gray-200",
        "focus-ring",
        "data-[variant=active]:border-transparent data-[variant=active]:bg-selected data-[variant=active]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Pill };
