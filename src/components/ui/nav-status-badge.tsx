import { cn } from "@/lib/utils";

import { Badge } from "./badge";

/** 导航条目状态标记的色调：`new` 蓝色档，`updated` 中性灰档。 */
export type NavStatusTone = "new" | "updated";

export interface NavStatusBadgeProps {
  label: string;
  /** @default "new" */
  tone?: NavStatusTone;
  className?: string;
}

/**
 * 色调 → 标准 Badge 档位映射（不再自持样式）：
 * - new → variant="blue"：light bg #ebf5ff + text #0060d6；dark bg #0f1e2e + text #5ea2ff
 * - updated → variant="gray"：light bg #f2f2f2 + text #4d4d4d；dark bg #1a1a1a + text #a1a1a1
 */
const TONE_VARIANT: Record<NavStatusTone, "blue" | "gray"> = {
  new: "blue",
  updated: "gray",
};

/**
 * 标签含 CJK 字形时切到中文字形档的墨迹补偿。
 * 同一枚 Badge 在 zh 下渲染「新增」、在 en 下渲染「New」——两者字形类不同
 * （CJK 墨迹几乎铺满 em，约 0.033em；拉丁 x-height 词约 0.17em），
 * Badge 的默认档（拉丁折中值）会把中文标签顶高约 1px，这里按实际标签切换。
 */
const CJK_PATTERN = /[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/;

/**
 * NavStatusBadge — 导航条目右端的状态标记。
 *
 * 视觉完全由标准 `Badge` 承担：`shape="rounded"`（圆角矩形 4px）+ `size="compact"`
 * （20px 高 / 12-16 文字 / 6px 横向内边距）+ `contrast="soft"`（柔和底色档）；
 * 本组件只保留「导航状态色调 → Badge 档位」的映射，桌面侧栏与移动面板共用，
 * 两侧观感不会再各自漂移。不进入包根公开面（与 hamburger-icon 同级的内部实现）。
 */
function NavStatusBadge({ label, tone = "new", className }: NavStatusBadgeProps) {
  return (
    <Badge
      data-tone={tone}
      shape="rounded"
      size="compact"
      variant={TONE_VARIANT[tone]}
      contrast="soft"
      className={cn(
        "font-medium",
        CJK_PATTERN.test(label) && "[--uni-ink-shift:var(--uni-ink-shift-cjk)]",
        className,
      )}
    >
      {label}
    </Badge>
  );
}

export { NavStatusBadge };
