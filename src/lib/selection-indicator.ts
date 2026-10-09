import { useLayoutEffect, useRef, type RefObject } from "react";

import { getTokens } from "./tokens";
import { parseEasing } from "./motion-easing";

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
    const x = (sourceBox.left - targetBox.left) / scaleX;
    const y = (sourceBox.top - targetBox.top) / scaleY;
    const width = sourceBox.width / targetBox.width;
    const height = sourceBox.height / targetBox.height;
    if (x === 0 && y === 0 && width === 1 && height === 1) return;
    const tokens = getTokens(["--uni-motion-state", "--ease-snap"], { target });
    const duration = milliseconds(tokens["--uni-motion-state"]);
    const curve = parseEasing(tokens["--ease-snap"]);
    if (duration <= 0 || !curve) return;
    try {
      animation.current = target.animate([
        { transform: `translate(${x}px, ${y}px) scale(${width}, ${height})`, transformOrigin: "top left" },
        { transform: "none", transformOrigin: "top left" },
      ], { duration, easing: `cubic-bezier(${curve.join(", ")})` });
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
