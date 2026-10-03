import * as React from "react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export interface FullPageScrollerProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  orientation?: "vertical" | "horizontal";
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  wheelThreshold?: number;
  touchThreshold?: number;
  disabled?: boolean;
}

function FullPageScroller({
  orientation = "vertical",
  index,
  defaultIndex = 0,
  onIndexChange,
  wheelThreshold = 80,
  touchThreshold = 50,
  disabled = false,
  children,
  className,
  onKeyDown,
  ...props
}: FullPageScrollerProps) {
  const { t } = useI18n();
  const items = React.Children.toArray(children);
  const [internalIndex, setInternalIndex] = React.useState(defaultIndex);
  const clamp = (value: number) =>
    Math.min(
      Math.max(0, Number.isFinite(value) ? Math.floor(value) : 0),
      Math.max(0, items.length - 1),
    );
  const current = clamp(index ?? internalIndex);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const currentRef = React.useRef(current);
  currentRef.current = current;
  const vertical = orientation === "vertical";
  const change = React.useRef<(value: number) => void>(() => {});
  change.current = (value: number) => {
    const target = clamp(value);
    if (disabled || target === currentRef.current) return;
    currentRef.current = target;
    if (index === undefined) setInternalIndex(target);
    onIndexChange?.(target);
  };

  React.useEffect(() => {
    const element = rootRef.current;
    if (!element || disabled || items.length < 2) return;
    let accumulated = 0;
    let lastWheel = 0;
    let lockedUntil = 0;
    let touch: { x: number; y: number; target: EventTarget | null; native: boolean } | null = null;
    const duration = () =>
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? 0
        : parseFloat(getComputedStyle(element).getPropertyValue("--uni-duration-slower")) || 500;
    const canMove = (direction: number) =>
      direction > 0 ? currentRef.current < items.length - 1 : currentRef.current > 0;
    const nestedCanScroll = (target: EventTarget | null, delta: number) => {
      let node = target instanceof Element ? target : null;
      while (node && node !== element) {
        if (node instanceof HTMLElement) {
          const style = getComputedStyle(node);
          const overflow = vertical ? style.overflowY : style.overflowX;
          const position = vertical ? node.scrollTop : node.scrollLeft;
          const maximum = vertical
            ? node.scrollHeight - node.clientHeight
            : node.scrollWidth - node.clientWidth;
          if (
            /auto|scroll/.test(overflow) &&
            maximum > 1 &&
            (delta > 0 ? position < maximum - 1 : position > 1)
          )
            return true;
        }
        node = node.parentElement;
      }
      return false;
    };
    const wheel = (event: WheelEvent) => {
      if (
        event.ctrlKey ||
        nestedCanScroll(event.target, vertical ? event.deltaY : event.deltaX || event.deltaY)
      )
        return;
      const raw = vertical
        ? event.deltaY
        : Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      if (!raw || (vertical && Math.abs(event.deltaX) > Math.abs(event.deltaY))) return;
      const delta =
        raw *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? vertical
              ? element.clientHeight
              : element.clientWidth
            : 1);
      const now = Date.now();
      const gap = now - lastWheel;
      lastWheel = now;
      // 惯性尾部属于同一次手势；等待静默后才能再次翻屏。
      // Momentum belongs to one gesture; require a quiet gap before another page.
      if (now < lockedUntil || (lockedUntil && gap < 160)) {
        event.preventDefault();
        return;
      }
      lockedUntil = 0;
      if (!canMove(Math.sign(delta))) {
        accumulated = 0;
        return;
      }
      event.preventDefault();
      if (gap > 160 || Math.sign(delta) !== Math.sign(accumulated)) accumulated = 0;
      accumulated += delta;
      if (Math.abs(accumulated) >= Math.max(1, wheelThreshold)) {
        change.current(currentRef.current + Math.sign(accumulated));
        accumulated = 0;
        lockedUntil = now + duration();
      }
    };
    const start = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        touch = null;
        return;
      }
      touch = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
        target: event.target,
        native: false,
      };
    };
    const move = (event: TouchEvent) => {
      if (!touch || event.touches.length !== 1) {
        touch = null;
        return;
      }
      const dx = touch.x - event.touches[0].clientX;
      const dy = touch.y - event.touches[0].clientY;
      const delta = vertical ? dy : dx;
      if (Math.abs(vertical ? dx : dy) > Math.abs(delta)) {
        touch.native = true;
        return;
      }
      if (nestedCanScroll(touch.target, delta)) {
        touch.native = true;
        return;
      }
      if (!touch.native && canMove(Math.sign(delta))) event.preventDefault();
    };
    const end = (event: TouchEvent) => {
      if (!touch || !event.changedTouches.length) {
        touch = null;
        return;
      }
      const delta = vertical
        ? touch.y - event.changedTouches[0].clientY
        : touch.x - event.changedTouches[0].clientX;
      const cross = vertical
        ? touch.x - event.changedTouches[0].clientX
        : touch.y - event.changedTouches[0].clientY;
      if (
        !touch.native &&
        Date.now() >= lockedUntil &&
        Math.abs(delta) >= Math.max(1, touchThreshold) &&
        Math.abs(delta) > Math.abs(cross)
      ) {
        change.current(currentRef.current + Math.sign(delta));
        lockedUntil = Date.now() + duration();
      }
      touch = null;
    };
    const cancel = () => {
      touch = null;
    };
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("touchstart", start, { passive: true });
    element.addEventListener("touchmove", move, { passive: false });
    element.addEventListener("touchend", end);
    element.addEventListener("touchcancel", cancel);
    return () => {
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("touchstart", start);
      element.removeEventListener("touchmove", move);
      element.removeEventListener("touchend", end);
      element.removeEventListener("touchcancel", cancel);
    };
  }, [disabled, vertical, items.length, wheelThreshold, touchThreshold]);

  const keyboardChange = (value: number) => {
    const target = clamp(value);
    if (disabled || target === current) return;
    if (index === undefined) setInternalIndex(target);
    onIndexChange?.(target);
  };
  return (
    <div
      {...props}
      ref={rootRef}
      data-slot="full-page-scroller"
      data-index={current}
      role={props.role ?? "region"}
      aria-label={props["aria-label"] ?? t("Paged scroller")}
      tabIndex={props.tabIndex ?? 0}
      className={cn("relative h-dvh w-full overflow-hidden focus-ring", className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || disabled || event.target !== event.currentTarget) return;
        const next = vertical ? ["ArrowDown", "PageDown"] : ["ArrowRight", "PageDown"];
        const previous = vertical ? ["ArrowUp", "PageUp"] : ["ArrowLeft", "PageUp"];
        const target =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? items.length - 1
              : next.includes(event.key)
                ? current + 1
                : previous.includes(event.key)
                  ? current - 1
                  : null;
        if (target === null) return;
        event.preventDefault();
        keyboardChange(target);
      }}
    >
      <div
        data-slot="full-page-track"
        className={cn(
          "flex h-full w-full transition-transform duration-(--uni-duration-slower) ease-snap motion-reduce:transition-none",
          vertical && "flex-col",
        )}
        style={{
          // Carousel 的叠层淡入淡出复用此手势容器，覆盖位移而不改变分页状态。
          // Stacked carousel fades reuse paging gestures while overriding translation.
          transform: `var(--uni-page-transform, ${vertical ? `translateY(-${current * 100}%)` : `translateX(-${current * 100}%)`})`,
        }}
      >
        {items.map((child, position) => (
          <div
            key={React.isValidElement(child) ? (child.key ?? position) : position}
            data-slot="full-page-section"
            role="group"
            aria-label={t("Section {index} of {count}", {
              index: position + 1,
              count: items.length,
            })}
            aria-hidden={position !== current || undefined}
            inert={position !== current || undefined}
            className="h-full w-full min-w-0 shrink-0 overflow-auto"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

export { FullPageScroller };
