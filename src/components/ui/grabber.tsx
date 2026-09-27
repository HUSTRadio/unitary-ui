import * as React from "react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/**
 * Grabber — BottomSheet 顶部拖拽指示条（Geist Drawer grabber 语义）。
 * - button role="slider" + aria 四件套（valuemin/valuemax/valuenow/orientation 对应垂直高度档位）
 * - ArrowUp/ArrowRight 增一档，ArrowDown/ArrowLeft 减一档，Home/End 跳到两端；边界钳制
 * - 视觉条：mx-auto mt-2 h-1 w-9 rounded-full bg-gray-700 dark:bg-gray-600
 * - 命中区横向覆盖面板、纵向扩展（w-full py-5 px-6 -my-5），点击（无拖动位移）循环切换档位
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
  /** 键盘指定目标档位（父组件负责受控/非受控状态提交） */
  onDetentChange?: (nextDetent: number) => void;
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
  onDetentChange,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  className,
}: GrabberProps) {
  const { t } = useI18n();
  const maxDetent = Math.max(0, detentCount - 1);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    let nextDetent: number | null = null;
    switch (event.key) {
      case "ArrowUp":
      case "ArrowRight":
        nextDetent = Math.min(currentDetent + 1, maxDetent);
        break;
      case "ArrowDown":
      case "ArrowLeft":
        nextDetent = Math.max(currentDetent - 1, 0);
        break;
      case "Home":
        nextDetent = 0;
        break;
      case "End":
        nextDetent = maxDetent;
        break;
      default:
        return;
    }

    // Slider 键会滚动页面；由控件消费，且在边界同样阻止默认滚动。
    event.preventDefault();
    // 边界钳制后值未变则不重复上报，避免受控消费方无意义重渲染。
    if (nextDetent !== currentDetent) onDetentChange?.(nextDetent);
  };

  return (
    <button
      type="button"
      role="slider"
      data-slot="grabber"
      aria-label={t("Resize height")}
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={maxDetent}
      aria-valuenow={currentDetent}
      onKeyDown={handleKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClick={() => onCycleDetent?.()}
      className={cn(
        // 命中区横向铺满面板；只用负纵向 margin 扩展触控区域，不移动水平中心。
        "focus-ring relative block w-full cursor-grab touch-none select-none outline-none active:cursor-grabbing",
        "py-5 px-6 -my-5",
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
