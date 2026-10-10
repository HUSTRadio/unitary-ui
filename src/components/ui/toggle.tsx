import * as React from "react";

import { cn } from "@/lib/utils";
import { getTokens } from "@/lib/tokens";
import { parseEasing } from "@/lib/motion-easing";

/** Animate the visual thumb without taking ownership of the native checkbox state. */
function useToggleThumbMotion(
  inputRef: React.RefObject<HTMLInputElement | null>,
  thumbRef: React.RefObject<HTMLSpanElement | null>,
  checked: boolean | undefined,
  geometry: readonly [ToggleProps["size"], boolean | undefined, string | undefined, string | undefined],
) {
  const previous = React.useRef<{ checked: boolean; x: number } | null>(null);
  const animation = React.useRef<Animation | null>(null);
  const previousGeometry = React.useRef(geometry);
  const controlled = React.useRef(checked !== undefined);
  controlled.current = checked !== undefined;
  const binding = React.useRef<{
    input: HTMLInputElement;
    thumb: HTMLSpanElement;
    form: HTMLFormElement | null;
    dispose: () => void;
  } | null>(null);

  const stop = React.useCallback(() => {
    animation.current?.cancel();
    animation.current = null;
  }, []);

  const update = React.useCallback(() => {
    const input = inputRef.current;
    const thumb = thumbRef.current;
    const view = thumb?.ownerDocument.defaultView;
    if (!input || !thumb || !view) return;
    if (previous.current?.checked === input.checked) return;

    // An active longhand-translate animation masks the new checked endpoint,
    // allowing a reversal to sample its current position and width unchanged.
    const inFlight = animation.current && !["finished", "idle"].includes(animation.current.playState);
    const source = inFlight ? thumb.getBoundingClientRect() : null;
    const old = previous.current;
    stop();
    const target = thumb.getBoundingClientRect();
    const style = view.getComputedStyle(thumb);
    const translation = style.translate.match(/^(-?\d*\.?\d+)px(?:\s+(.+))?$/);
    previous.current = translation ? { checked: input.checked, x: Number(translation[1]) } : null;
    if (!old || !translation || input.disabled || thumb.closest("[inert]")
      || view.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      || typeof thumb.animate !== "function") return;

    const width = Number.parseFloat(style.width);
    if (!(width > 0) || !(target.width > 0) || !(target.height > 0)) return;
    const scaleX = target.width / width;
    const x = Number(translation[1]);
    const y = translation[2] ?? "0px";
    const startWidth = source ? source.width / scaleX : width;
    const startX = source ? x + (source.left - target.left) / scaleX : old.x;
    const distance = x - startX;
    if (!Number.isFinite(startWidth) || startWidth <= 0
      || (distance === 0 && Math.abs(startWidth - width) < 0.001)) return;
    const tokens = getTokens(["--uni-motion-state", "--ease-snap"], { target: thumb });
    const durationValue = tokens["--uni-motion-state"].trim().match(/^(\d*\.?\d+)(ms|s)$/);
    const duration = durationValue ? Number(durationValue[1]) * (durationValue[2] === "s" ? 1000 : 1) : 0;
    const curve = parseEasing(tokens["--ease-snap"]);
    if (duration <= 0 || !curve) return;

    const peak = 0.6;
    const spanStart = Math.min(startX, x);
    const spanEnd = Math.max(startX + startWidth, x + width);
    // Keep the 10px small thumb legible: stretch only the travel axis, and
    // bound the peak within the endpoints so it never protrudes past the track.
    const peakWidth = Math.min(
      Math.max(startWidth, width + Math.min(Math.abs(distance) * 0.35, width * 0.25)),
      spanEnd - spanStart,
    );
    const peakCenter = (startX + startWidth / 2) * (1 - peak) + (x + width / 2) * peak;
    const peakX = Math.max(spanStart, Math.min(peakCenter - peakWidth / 2, spanEnd - peakWidth));
    const frame = (position: number, length: number, offset: number): Keyframe => ({
      translate: `${position}px ${y}`, width: `${length}px`, offset,
    });
    try {
      animation.current = thumb.animate([
        frame(startX, startWidth, 0), frame(peakX, peakWidth, peak), frame(x, width, 1),
      ], { duration, easing: `cubic-bezier(${curve.join(", ")})` });
    } catch {
      // Invalid custom motion values must not interrupt native state changes.
    }
  }, [inputRef, thumbRef, stop]);

  React.useLayoutEffect(() => {
    const input = inputRef.current;
    const thumb = thumbRef.current;
    const view = input?.ownerDocument.defaultView;
    if (!input || !thumb || !view) return;
    const form = input.form;
    if (binding.current?.input !== input || binding.current.thumb !== thumb || binding.current.form !== form) {
      binding.current?.dispose();
      previous.current = null;
      const reducedMotion = view.matchMedia?.("(prefers-reduced-motion: reduce)");
      const preferenceChanged = () => { if (reducedMotion?.matches) stop(); };
      // Controlled updates animate only after React commits the accepted state.
      // Native change events also cover defaultChecked without introducing state.
      const changed = () => { if (!controlled.current) update(); };
      const align = () => { stop(); previous.current = null; update(); };
      // Reset's default action can run after the listener's microtasks. Read the
      // baseline in the next task so the next click starts at defaultChecked.
      let mounted = true;
      let resetTimer: number | undefined;
      const reset = () => {
        stop();
        previous.current = null;
        view.clearTimeout(resetTimer);
        resetTimer = view.setTimeout(() => {
          resetTimer = undefined;
          if (mounted) update();
        }, 0);
      };
      input.addEventListener("change", changed);
      form?.addEventListener("reset", reset);
      reducedMotion?.addEventListener("change", preferenceChanged);
      view.addEventListener("resize", align);
      input.ownerDocument.fonts?.addEventListener("loadingdone", align);
      binding.current = {
        input, thumb, form,
        dispose: () => {
          mounted = false;
          view.clearTimeout(resetTimer);
          stop();
          input.removeEventListener("change", changed);
          form?.removeEventListener("reset", reset);
          reducedMotion?.removeEventListener("change", preferenceChanged);
          view.removeEventListener("resize", align);
          input.ownerDocument.fonts?.removeEventListener("loadingdone", align);
        },
      };
    }
    if (geometry.some((value, index) => value !== previousGeometry.current[index])) {
      stop();
      previous.current = null;
    }
    previousGeometry.current = geometry;
    update();
  });

  React.useLayoutEffect(() => () => {
    binding.current?.dispose();
    binding.current = null;
    previous.current = null;
  }, []);
}

/**
 * Toggle — Geist 布尔开关（对应官方 Toggle，docs/geist-markdown-refs/components/toggle.md）。
 * 原生 <input type="checkbox"> + sr-only + peer + 轨道/圆钮（结构对齐官方，非 Radix button[role=switch]）。
 *
 * 官方 API：checked（受控）/ onChange（无参数）/ aria-label / size / color / disabled。
 * 官方语义：Toggle = 单个布尔设置（ON 立即生效）；2–3 个互斥视图用 Switch（分段控件）。
 *
 * 官方实测几何（2026-08-08 computed + bbox，Light/Dark 一致）：
 * - 轨道：small 28×14 / medium 36×20 / large 40×24，圆角 14px；checked 蓝/琥珀/红，unchecked 灰
 * - 圆钮：10 / 16 / 20px（依用户视觉反馈较官方值收紧 1px），absolute left-[1.5px] top-1/2 -translate-y-1/2，
 *   checked 位移 15 / 17 / 17px；两端仍保留 1.5px 等距留白
 * - 边距 1.5px（非 2px，避免 125% DPI 下亚像素 .5 导致圆钮歪斜）
 * - 颜色全部消费语义 token，零 `dark:` 分支（Geist 原则：组件零主题分支）
 */

export type ToggleProps = Omit<
  React.ComponentProps<"input">,
  "type" | "checked" | "onChange" | "size" | "children"
> & {
  checked?: boolean;
  onChange?: () => void;
  size?: "small" | "medium" | "large";
  color?: "blue" | "amber" | "red";
  labelCasing?: "title" | "normal";
  direction?: "ltr" | "rtl";
  icon?: { checked?: React.ReactNode; unchecked?: React.ReactNode };
  thumbClassName?: string;
  children?: React.ReactNode;
};

function Toggle({
  className,
  thumbClassName,
  icon,
  children,
  size = "small",
  color = "blue",
  labelCasing = "title",
  direction = "ltr",
  checked,
  onChange,
  disabled,
  ref,
  ...props
}: ToggleProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const thumbRef = React.useRef<HTMLSpanElement>(null);
  const mergedRef = React.useCallback((input: HTMLInputElement | null) => {
    inputRef.current = input;
    if (typeof ref === "function") {
      const cleanup = ref(input);
      if (cleanup) return () => { inputRef.current = null; cleanup(); };
      return;
    }
    if (ref) ref.current = input;
  }, [ref]);
  useToggleThumbMotion(inputRef, thumbRef, checked, [size, disabled, className, thumbClassName]);
  const control = (
    <span className="relative inline-flex shrink-0">
      <input
        ref={mergedRef}
        type="checkbox"
        className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {/* 轨道 */}
      <span
        data-slot="toggle-track"
        aria-hidden
        className={cn(
          "block cursor-pointer rounded-[14px] transition-[background,border-color] duration-(--uni-duration-base) ease-in-out",
          "bg-gray-400 peer-focus-visible:focus-ring peer-disabled:cursor-not-allowed",
          color === "blue" && "peer-checked:bg-[var(--toggle-checked)]",
          color === "amber" && "peer-checked:bg-warning",
          color === "red" && "peer-checked:bg-[var(--toggle-checked-red)]",
          "peer-disabled:bg-[var(--toggle-disabled-track-unchecked)] peer-disabled:peer-checked:bg-[var(--toggle-disabled-track-checked)]",
          size === "small" && "h-[14px] w-7",
          size === "medium" && "h-5 w-9",
          size === "large" && "h-6 w-10",
          className,
        )}
      />
      {/* 圆钮 */}
      <span
        ref={thumbRef}
        data-slot="toggle-thumb"
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 left-[1.5px] block -translate-y-1/2 rounded-full border-gray-400 bg-[var(--toggle-thumb)] shadow-[0_0_3px_-1px_rgba(0,0,0,0.24),0_0_0.5px_rgba(0,0,0,0.16),-0.5px_2px_3px_-2px_rgba(0,0,0,0.36)]",
          "peer-disabled:border-transparent peer-disabled:shadow-none peer-disabled:bg-[var(--toggle-disabled-thumb-unchecked)] peer-disabled:peer-checked:bg-[var(--toggle-disabled-thumb-checked)]",
          size === "small" && "size-2.5 peer-checked:translate-x-[15px]",
          size === "medium" && "size-4 peer-checked:translate-x-[17px]",
          size === "large" && "size-5 peer-checked:translate-x-[17px]",
          thumbClassName,
        )}
      >
        {icon?.checked ? (
          <span className="absolute inset-0 hidden items-center justify-center text-[8px] text-[#171717] peer-checked:flex">
            {icon.checked}
          </span>
        ) : null}
        {icon?.unchecked ? (
          <span className="absolute inset-0 hidden items-center justify-center text-[8px] text-[#171717] peer-checked:hidden">
            {icon.unchecked}
          </span>
        ) : null}
      </span>
    </span>
  );

  if (!children) {
    return (
      <span
        data-slot="toggle-line"
        className={cn(
          "flex items-center",
          size === "small" ? "h-5" : size === "medium" ? "h-[26px]" : "h-[30px]",
        )}
      >
        {control}
      </span>
    );
  }

  return (
    <label
      className={cn(
        "text-toggle-label inline-flex cursor-pointer items-center gap-3 whitespace-nowrap py-[3px] has-[:disabled]:cursor-not-allowed has-[:disabled]:text-gray-700",
        direction === "rtl" && "flex-row-reverse",
      )}
    >
      <span className={labelCasing === "title" ? "capitalize" : undefined}>{children}</span>
      {control}
    </label>
  );
}

export { Toggle };
