import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/**
 * Grabber — BottomSheet 顶部拖拽指示条（Geist Drawer grabber 语义）。
 * - button role="slider" + aria 三件套（valuemin/valuemax/valuenow 对应 detent 档位）
 * - 视觉条：mx-auto mt-2 h-1 w-9 rounded-full bg-gray-700 dark:bg-gray-600
 * - 命中区向四周扩展（py-5 px-6 -my-5 -mx-6），点击（无拖动位移）循环切换档位
 */
interface GrabberProps {
  /** 档位总数 */
  detentCount: number;
  /** 当前档位索引 */
  currentDetent: number;
  /** 点击（无拖动位移时）循环切换档位回调 */
  onCycleDetent?: () => void;
  className?: string;
}

function Grabber({
  detentCount,
  currentDetent,
  onCycleDetent,
  className,
}: GrabberProps) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      role="slider"
      data-slot="grabber"
      aria-label={t("调整高度")}
      aria-valuemin={0}
      aria-valuemax={Math.max(0, detentCount - 1)}
      aria-valuenow={currentDetent}
      onClick={() => onCycleDetent?.()}
      className={cn(
        "relative block w-full cursor-grab touch-none select-none active:cursor-grabbing",
        // 命中区扩展到视觉条之外
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
