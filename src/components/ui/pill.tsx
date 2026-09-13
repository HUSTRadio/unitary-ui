import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Pill — 可点击的筛选 chip（对应官方 Pill，docs/geist-markdown-refs/components/pill.md）。
 * 用于在一组互斥/多选的筛选项中切换查询条件。
 * variant="active" 高亮当前选中项（bg-selected + 前景色）；默认态为灰色描边 chip。
 * 颜色消费语义 token（--selected / --gray-alpha / --foreground 随主题切换），零 `dark:` 分支。
 *
 * 垂直光学补偿（pt 2.5 / pb 5.5，总高与 py-1 相同）：项目字体栈解析到 OPPO Sans
 * （fontBoundingBox 16/4，4:1 不对称），`items-center` 只能居中行盒，而字形墨迹在
 * 行盒内整体偏下 —— 实测各标签墨迹中心比药丸中心低 0.5~2.5px（拉丁 x-height 词最重）。
 * 上提 1.5px 后最大偏差 ≤1px（all −0.5 / ready +1 / error +1 / 全部 −1）。
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
        "inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-background-100 px-3 pt-[2.5px] pb-[5.5px] text-label-14 text-foreground transition-colors",
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
