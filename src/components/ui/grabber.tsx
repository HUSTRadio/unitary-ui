import * as React from "react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/**
 * Grabber — BottomSheet 顶部拖拽指示条（Geist Drawer grabber 语义）。
 * - button role="slider" + aria 三件套（valuemin/valuemax/valuenow 对应 detent 档位）
 * - 视觉条：mx-auto mt-2 h-1 w-9 rounded-full bg-gray-700 dark:bg-gray-600
 * - 命中区向四周扩展（py-5 px-6 -my-5 -mx-6），点击（无拖动位移）循环切换档位
 * - 拖拽手势（pointer 四连）由 BottomSheet 注入：手势只从这里启动，
 *   面板内容区不受 pointer capture 劫持，内部按钮的 click 正常派发。
 */
interface GrabberProps {
  /** 档位总数 */
  detentCount: number;
  /** 当前档位索引 */
  currentDetent: number;
  /** 点击（无拖动位移时）循环切换档位回调 */
  onCycleDetent?: () => void;
  /** 拖拽手势四连（BottomSheet 注入） */
  onPointerDown?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerMove?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerUp?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerCancel?: React.PointerEventHandler<HTMLButtonElement>;
  className?: string;
}

function Grabber({
  detentCount,
  currentDetent,
  onCycleDetent,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  className,
}: GrabberProps) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      role="slider"
      data-slot="grabber"
      aria-label={t("Resize height")}
      aria-valuemin={0}
      aria-valuemax={Math.max(0, detentCount - 1)}
      aria-valuenow={currentDetent}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClick={() => onCycleDetent?.()}
      className={cn(
        // 命中区扩展到视觉条之外：block（width:auto）+ 负 margin 自动拉宽、中心
        // 不偏移——w-full（显式 width:100%）配 -mx-6 会把整盒左移 24px（width 不
        // 随负 margin 拉伸），指示条因此偏左，故必须用 width:auto 的拉宽方式。
        "focus-ring relative block cursor-grab touch-none select-none outline-none active:cursor-grabbing",
        "py-5 px-6 -my-5 -mx-6",
        className,
      )}
    >
      {/* 对比度实测：light 面板白底 gray-700(#8f8f8f)=3.23:1、dark 面板黑底
          gray-600(#878787)=5.51:1，均满足 WCAG 1.4.11 ≥3:1（原 gray-alpha-500
          双主题仅 1.66/2.06:1 不达标）。 */}
      <span className="mx-auto mt-2 block h-1 w-9 rounded-full bg-gray-700 dark:bg-gray-600" />
    </button>
  );
}

export { Grabber };
export type { GrabberProps };
