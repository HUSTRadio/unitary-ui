import { cn } from "@/lib/utils";

/** 导航条目状态标记的色调：`new` 蓝色档，`updated` 中性灰档。 */
export type NavStatusTone = "new" | "updated";

export interface NavStatusBadgeProps {
  label: string;
  /** @default "new" */
  tone?: NavStatusTone;
  className?: string;
}

/**
 * 色调 → token（Geist 灰阶/蓝色阶在明暗两套 token 下自动翻转，无需 dark: 覆盖）：
 * - new：light bg #ebf5ff + text #0060d6；dark bg #0f1e2e + text #5ea2ff
 * - updated：light bg #f2f2f2 + text #4d4d4d；dark bg #1a1a1a + text #a1a1a1
 */
const TONE_CLASS: Record<NavStatusTone, string> = {
  new: "bg-blue-100 text-blue-900",
  updated: "bg-gray-100 text-gray-900",
};

/**
 * NavStatusBadge — 导航条目右端的状态胶囊。
 *
 * 几何对齐 Tremor 文档侧栏的 `Updated` 徽标（实测 2026-09-21）：
 * `rounded-sm` + `px-1.5 py-0.5` + HIG Caption 1（12/16）+ font-medium，
 * 无边框（实测无 border，2px padding × 2 + 16px 行高 = 20px 高）、
 * 紧贴条目文字右侧（由调用方用 `ml-auto` 推到行尾）。
 *
 * 内部视觉原子：SidebarNav 与 HamburgerMenu 共用，避免两侧观感漂移；
 * 不进入包根公开面（与 hamburger-icon 同级的内部实现）。
 */
function NavStatusBadge({ label, tone = "new", className }: NavStatusBadgeProps) {
  return (
    <span
      data-slot="nav-status-badge"
      data-tone={tone}
      className={cn(
        "inline-flex shrink-0 items-center rounded-sm px-1.5 py-0.5 text-label-12 font-medium whitespace-nowrap",
        TONE_CLASS[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}

export { NavStatusBadge };
