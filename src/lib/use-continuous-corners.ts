"use client";

import * as React from "react";

import { continuousCornerPath, type ContinuousCornerOptions } from "./continuous-corner";

/** Measures an element and returns an adaptive clip path with a circular fallback. */
export function useContinuousCorners<T extends HTMLElement>(options: ContinuousCornerOptions): {
  ref: React.RefObject<T | null>;
  style: React.CSSProperties;
} {
  const ref = React.useRef<T | null>(null);
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);
  const { radius, exponent, samples } = options;

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      // clip-path coordinates are local CSS pixels, not transformed viewport bounds.
      const computed = getComputedStyle(element);
      const px = (value: string) => Number.parseFloat(value) || 0;
      const extra = computed.boxSizing === "border-box" ? 0 : 1;
      const width = px(computed.width) + extra * (
        px(computed.paddingLeft) + px(computed.paddingRight) +
        px(computed.borderLeftWidth) + px(computed.borderRightWidth)
      );
      const height = px(computed.height) + extra * (
        px(computed.paddingTop) + px(computed.paddingBottom) +
        px(computed.borderTopWidth) + px(computed.borderBottomWidth)
      );
      const next = width > 0 && height > 0 ? { width, height } : null;
      setSize((previous) => previous?.width === next?.width && previous?.height === next?.height
        ? previous : next);
    };
    measure();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element, { box: "border-box" });
    return () => observer.disconnect();
  }, []);

  const style = React.useMemo<React.CSSProperties>(() => {
    const fallback: React.CSSProperties = { borderRadius: radius };
    if (!size || typeof CSS === "undefined" || !CSS.supports("clip-path", 'path("M 0 0 H 1 V 1 Z")')) {
      return fallback;
    }
    return {
      // A fallback radius would independently round the painted background,
      // hiding the extra corner area supplied by the continuous path.
      borderRadius: 0,
      clipPath: `path("${continuousCornerPath(size.width, size.height, {
        radius,
        exponent,
        samples,
      })}")`,
    };
  }, [exponent, radius, samples, size]);

  return { ref, style };
}
