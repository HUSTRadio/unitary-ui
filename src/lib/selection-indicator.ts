import { useLayoutEffect, useRef, type RefObject } from "react";

import { getTokens } from "./tokens";

interface SlidingIndicatorOptions {
  rootRef: RefObject<HTMLElement | null>;
  activeKey: string | undefined;
  enabled?: boolean;
}

function milliseconds(value: string): number {
  const match = value.trim().match(/^(\d*\.?\d+)(ms|s)$/);
  return match ? Number(match[1]) * (match[2] === "s" ? 1000 : 1) : 0;
}

/** 同一最基层分组内接续指示条位移，保留条目内的静态几何与语义。
 * Continue indicator motion within a leaf group, preserving item-local geometry and semantics. */
export function useSlidingIndicator({ rootRef, activeKey, enabled = true }: SlidingIndicatorOptions) {
  const previous = useRef<HTMLElement | null>(null);
  const animation = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const target = enabled && activeKey !== undefined
      ? root?.querySelector<HTMLElement>("[data-selection-indicator][data-slot]") ?? null
      : null;
    const source = previous.current;
    // 未选中的条仍保留在 DOM（visibility:hidden），快速切换时可读取正在运动的位置。
    // Hidden markers remain in the DOM so rapid retargeting can sample the in-flight position.
    const sourceBox = source?.isConnected ? source.getBoundingClientRect() : null;
    animation.current?.cancel();
    animation.current = null;
    previous.current = target;
    if (!target || !source || source === target || !sourceBox) return;
    const group = target.closest("[data-selection-indicator-group]");
    if (!group || source.closest("[data-selection-indicator-group]") !== group) return;
    const view = target.ownerDocument.defaultView;
    if (!view || view.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      || target.closest("[inert]") || typeof target.animate !== "function") return;

    const targetBox = target.getBoundingClientRect();
    if (sourceBox.width <= 0 || sourceBox.height <= 0 || targetBox.width <= 0 || targetBox.height <= 0) return;
    // 视口矩形包含祖先缩放；transform 位移使用条目本地的 CSS 像素。
    // Viewport rectangles include ancestor scaling; transforms use item-local CSS pixels.
    const style = view.getComputedStyle(target);
    const localWidth = Number.parseFloat(style.width);
    const localHeight = Number.parseFloat(style.height);
    const scaleX = localWidth > 0 ? targetBox.width / localWidth : 1;
    const scaleY = localHeight > 0 ? targetBox.height / localHeight : 1;
    const dx = sourceBox.left + sourceBox.width / 2 - targetBox.left - targetBox.width / 2;
    const dy = sourceBox.top + sourceBox.height / 2 - targetBox.top - targetBox.height / 2;
    if (dx === 0 && dy === 0 && sourceBox.width === targetBox.width && sourceBox.height === targetBox.height) return;
    const tokens = getTokens(["--uni-motion-state", "--ease-snap"], { target });
    const duration = milliseconds(tokens["--uni-motion-state"]);
    if (duration <= 0 || !tokens["--ease-snap"]) return;
    // 取消后读取自然尺寸，避免快速连点把上一次拉伸反复放大。
    // Read resting dimensions after cancellation so rapid retargeting cannot compound stretch.
    const restingBox = source.getBoundingClientRect();
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    const length = horizontal ? "width" : "height";
    const naturalLength = Math.max(restingBox[length], targetBox[length]);
    const extra = Math.min(Math.abs(horizontal ? dx : dy) * 0.35, naturalLength * 0.6);
    const peak = 0.6;
    let peakWidth = sourceBox.width + (targetBox.width - sourceBox.width) * peak;
    let peakHeight = sourceBox.height + (targetBox.height - sourceBox.height) * peak;
    const spanStart = Math.min(horizontal ? sourceBox.left : sourceBox.top, horizontal ? targetBox.left : targetBox.top);
    const spanEnd = Math.max(horizontal ? sourceBox.right : sourceBox.bottom, horizontal ? targetBox.right : targetBox.bottom);
    const peakLength = Math.min(Math.max(sourceBox[length], naturalLength + extra), spanEnd - spanStart);
    if (horizontal) peakWidth = peakLength;
    else peakHeight = peakLength;
    let peakLeft = targetBox.left + targetBox.width / 2 + dx * (1 - peak) - peakWidth / 2;
    let peakTop = targetBox.top + targetBox.height / 2 + dy * (1 - peak) - peakHeight / 2;
    // 宽度差异较大时仍留在起点与终点之间，避免被滚动容器裁切。
    // Keep unequal-width peaks within the endpoints' span to avoid scroll-container clipping.
    if (horizontal) peakLeft = Math.max(spanStart, Math.min(peakLeft, spanEnd - peakWidth));
    else peakTop = Math.max(spanStart, Math.min(peakTop, spanEnd - peakHeight));
    const frame = (left: number, top: number, width: number, height: number, offset: number): Keyframe => ({
      transform: `translate(${(left - targetBox.left) / scaleX}px, ${(top - targetBox.top) / scaleY}px) scale(${width / targetBox.width}, ${height / targetBox.height})`,
      transformOrigin: "top left", offset,
    });
    try {
      animation.current = target.animate([
        frame(sourceBox.left, sourceBox.top, sourceBox.width, sourceBox.height, 0),
        frame(peakLeft, peakTop, peakWidth, peakHeight, peak),
        { transform: "none", transformOrigin: "top left", offset: 1 },
      ], { duration, easing: tokens["--ease-snap"] });
    } catch {
      // 无效的自定义动效值不应阻断选中状态更新。
      // Invalid custom motion values must not interrupt selection updates.
    }
  }, [rootRef, activeKey, enabled]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const view = root?.ownerDocument.defaultView;
    if (!root || !view) return;
    const reducedMotion = view.matchMedia?.("(prefers-reduced-motion: reduce)");
    const stop = () => {
      animation.current?.cancel();
      animation.current = null;
    };
    const preferenceChanged = () => { if (reducedMotion?.matches) stop(); };
    reducedMotion?.addEventListener("change", preferenceChanged);
    view.addEventListener("resize", stop);
    root.ownerDocument.fonts?.addEventListener("loadingdone", stop);
    return () => {
      stop();
      previous.current = null;
      reducedMotion?.removeEventListener("change", preferenceChanged);
      view.removeEventListener("resize", stop);
      root.ownerDocument.fonts?.removeEventListener("loadingdone", stop);
    };
  }, [rootRef, enabled]);
}
