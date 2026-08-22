import { useEffect, useRef, useState } from "react";

export type ScrollDirection = "up" | "down" | "idle";

/**
 * useScrollDirection：检测页面垂直滚动方向。
 *
 * - 初始为 "idle"；位移绝对值 ≥ threshold 时翻转为 "down"/"up"；
 * - scroll 监听经 requestAnimationFrame 节流，同一帧只处理一次；
 * - SSR 安全：typeof window === "undefined" 时恒为 "idle"，不挂监听。
 */
export function useScrollDirection(threshold = 24): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>("idle");
  const lastY = useRef(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastY.current = window.scrollY;

    const onScroll = () => {
      if (frame.current !== null) return; // 本帧已有待处理回调，合并
      frame.current = window.requestAnimationFrame(() => {
        frame.current = null;
        const y = window.scrollY;
        const delta = y - lastY.current;
        if (Math.abs(delta) < threshold) return; // 小于阈值不翻转
        lastY.current = y;
        setDirection(delta > 0 ? "down" : "up");
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [threshold]);

  return direction;
}
