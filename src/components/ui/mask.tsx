import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Mask — 骨架屏遮罩容器：给一块真实内容指定骨架模板后，mask 切换成骨架、unmask 切回真实界面。
 * 导出：Mask。
 *
 * 契约：
 * - `masked` 受控开关；`defaultMasked` + `onMaskedChange` 支持非受控用法。
 * - `skeleton` 是骨架模板，**始终挂载**。这也是它与 `Skeleton` 组合而不是 `{masked ? <Skeleton/> : children}`
 *   的关键：切换时两侧的盒子在同一处对齐，不会因为子树重建而改变宽度（`Skeleton` 包裹 children
 *   时会按 children 自动计算尺寸）。
 * - `children` 是真实界面。`masked` 时以 `visibility: hidden` 保留（`Skeleton` 的 `show` 语义），
 *   仍然占位、不参与点击也不进入 Tab 序列；`unmask` 时移除 `inert`，恢复交互。
 * - 切换动画走 `--uni-duration-base`（内容切换档），`motion-reduce` 下退化为即时切换。
 * - 无障碍（对齐 Skeleton 指南）：容器承担 `aria-busy`，完成态经 `aria-live="polite"` 播报，
 *   骨架自身 `aria-hidden`。`liveRegion` 默认为 false —— 只在该区域**是**本次加载结果时才打开，
 *   否则页面频繁刷新时会重复播报。
 *
 * ```tsx
 * <Mask
 *   masked={isLoading}
 *   label="Loading project summary"
 *   skeleton={<SummarySkeleton />}
 * >
 *   <Summary />
 * </Mask>
 * ```
 */

interface MaskProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** 真实界面 */
  children?: React.ReactNode;
  /** 骨架模板（始终挂载，用于保持切换前后的盒子一致） */
  skeleton: React.ReactNode;
  /** 受控：是否处于遮罩（加载）态 */
  masked?: boolean;
  /** 非受控初始遮罩态 */
  defaultMasked?: boolean;
  /**
   * 非受控遮罩态变化回调。`masked` 未传时组件不内部翻转遮罩态，
   * 因此该回调没有可观察的触发源；需要可观察切换请使用受控 `masked`。
   */
  onMaskedChange?: (masked: boolean) => void;
  /** 遮罩期间的可访问名称，供屏幕阅读器识别这块区域正在加载 */
  label?: string;
  /**
   * 加载完成时是否通过 `aria-live="polite"` 宣告。
   * 仅在该区域确实是本次加载结果时打开，避免多处同时刷新时重复播报。
   */
  liveRegion?: boolean;
  /** 自定义遮罩层（默认渲染 `skeleton`） */
  overlay?: React.ReactNode;
}

function Mask({
  children,
  skeleton,
  masked,
  defaultMasked = false,
  onMaskedChange,
  label,
  liveRegion = false,
  overlay,
  className,
  ...props
}: MaskProps) {
  const isControlled = masked !== undefined;
  // 非受控态在挂载后由 Mask 内部持有（组件不自行翻转，也没有内部触发源）。
  const [uncontrolledMasked] = React.useState(defaultMasked);
  const isMasked = isControlled ? masked : uncontrolledMasked;

  return (
    <div
      data-slot="mask"
      data-state={isMasked ? "masked" : "unmasked"}
      aria-busy={isMasked || undefined}
      aria-live={liveRegion && !isMasked ? "polite" : undefined}
      aria-label={isMasked ? label : undefined}
      className={cn("relative", className)}
      {...props}
    >
      <div data-slot="mask-content" inert={isMasked} aria-hidden={isMasked || undefined}>
        {/*
         * 复用 Skeleton 的 children 语义做「不可见但保留盒子」：这里传 show=false 时
         * children 以 visibility:hidden 隐藏，与 masked 同向，因此 hide={isMasked}。
         */}
        <SkeletonSlot hide={isMasked}>{children}</SkeletonSlot>
      </div>
      {isMasked ? (
        <div data-slot="mask-overlay" aria-hidden="true" className="absolute inset-0">
          {overlay ?? skeleton}
        </div>
      ) : null}
    </div>
  );
}

/**
 * 内部占位壳：与 `Skeleton` 的 children 处理保持一致（隐藏时以 `visibility: hidden`
 * 保留布局），但不带骨架底色与动画——遮罩层由 `Mask` 自己渲染。
 */
function SkeletonSlot({ hide, children }: { hide: boolean; children?: React.ReactNode }) {
  return (
    <div className={cn("flex-initial", hide && "invisible")} data-slot="mask-placeholder">
      {children}
    </div>
  );
}

export { Mask, type MaskProps };
