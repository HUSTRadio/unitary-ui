import { cubicProgress, milliseconds, parseEasing } from "./motion-easing";
import { getTokens } from "./tokens";

type ScrollPosition = { top?: number; left?: number };
export interface ScrollAnimation {
  cancel: () => void;
  refresh: () => void;
}
interface ScrollAnimationOptions {
  destination: ScrollPosition | (() => ScrollPosition | null);
  target?: HTMLElement;
  settled?: () => boolean;
  onStart?: () => void;
  onInterrupt?: () => void;
  onUpdate?: () => void;
  onFinish?: (completed: boolean) => void;
}

const active = new WeakMap<HTMLElement, ScrollAnimation>();
const requests = new WeakMap<HTMLElement, number>();

/** Logical inline coordinates use zero at the start in either writing direction. */
export function inlineScrollPosition(owner: HTMLElement): number {
  return owner.ownerDocument.defaultView?.getComputedStyle(owner).direction === "rtl"
    ? -owner.scrollLeft : owner.scrollLeft;
}

export function inlineScrollLeft(owner: HTMLElement, position: number): number {
  return owner.ownerDocument.defaultView?.getComputedStyle(owner).direction === "rtl"
    ? -position : position;
}

/** One cancellable timeline per owner, shared by tracking and explicit scroll commands. */
export function animateScroll(owner: HTMLElement, options: ScrollAnimationOptions): ScrollAnimation {
  const request = (requests.get(owner) ?? 0) + 1;
  requests.set(owner, request);
  active.get(owner)?.cancel();
  // A cancellation callback can synchronously issue a newer command for this owner.
  if (requests.get(owner) !== request) return { cancel() {}, refresh() {} };
  const view = owner.ownerDocument.defaultView;
  if (!view?.requestAnimationFrame) return { cancel() {}, refresh() {} };
  const target = options.target ?? owner;
  const media = view.matchMedia?.("(prefers-reduced-motion: reduce)");
  const previousBehavior = owner.style.getPropertyValue("scroll-behavior");
  const previousPriority = owner.style.getPropertyPriority("scroll-behavior");
  owner.style.setProperty("scroll-behavior", "auto", "important");
  let frame: number | null = null;
  let stopped = false;
  let started = false;
  let startTime = 0;
  let startTop = 0;
  let startLeft = 0;
  let duration = 0;
  let curve: ReturnType<typeof parseEasing> = null;

  const finish = (completed: boolean) => {
    if (stopped) return;
    stopped = true;
    if (frame !== null) view.cancelAnimationFrame(frame);
    frame = null;
    owner.removeEventListener("wheel", interrupt);
    owner.removeEventListener("touchstart", interrupt);
    owner.removeEventListener("pointerdown", interrupt);
    owner.removeEventListener("keydown", interruptKey);
    media?.removeEventListener("change", preferenceChanged);
    if (previousBehavior) owner.style.setProperty("scroll-behavior", previousBehavior, previousPriority);
    else owner.style.removeProperty("scroll-behavior");
    if (active.get(owner) === animation) active.delete(owner);
    options.onFinish?.(completed);
  };
  const interrupt = () => {
    options.onInterrupt?.();
    finish(false);
  };
  const interruptKey = (event: KeyboardEvent) => {
    if (!event.defaultPrevented && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) interrupt();
  };
  const refresh = () => {
    if (!stopped && frame === null) frame = view.requestAnimationFrame(step);
  };
  const step = (now: number) => {
    frame = null;
    if (stopped) return;
    const destination = typeof options.destination === "function" ? options.destination() : options.destination;
    if (!destination) {
      // A hidden or not-yet-mounted target is woken by its caller's observers.
      if (started) finish(false);
      return;
    }
    if (!started) {
      started = true;
      startTime = now;
      startTop = owner.scrollTop;
      startLeft = owner.scrollLeft;
      const tokens = getTokens(["--uni-motion-state", "--ease-in-out"], { target });
      curve = parseEasing(tokens["--ease-in-out"]);
      duration = media?.matches || !curve ? 0 : milliseconds(tokens["--uni-motion-state"]);
      options.onStart?.();
      if (stopped) return;
    }
    const progress = duration > 0 ? Math.min(1, Math.max(0, (now - startTime) / duration)) : 1;
    const eased = curve ? cubicProgress(progress, curve) : progress;
    if (destination.top !== undefined) {
      const maximum = Math.max(0, owner.scrollHeight - owner.clientHeight);
      const end = Math.min(maximum, Math.max(0, destination.top));
      owner.scrollTop = Math.min(maximum, Math.max(0, startTop + (end - startTop) * eased));
    }
    if (destination.left !== undefined) {
      const maximum = Math.max(0, owner.scrollWidth - owner.clientWidth);
      const rtl = view.getComputedStyle(owner).direction === "rtl";
      const end = rtl ? Math.min(0, Math.max(-maximum, destination.left)) : Math.min(maximum, Math.max(0, destination.left));
      owner.scrollLeft = rtl
        ? Math.min(0, Math.max(-maximum, startLeft + (end - startLeft) * eased))
        : Math.min(maximum, Math.max(0, startLeft + (end - startLeft) * eased));
    }
    options.onUpdate?.();
    if (stopped) return;
    if (progress === 1 && (options.settled?.() ?? true)) finish(true);
    else refresh();
  };
  const preferenceChanged = () => {
    if (!media?.matches || stopped) return;
    duration = 0;
    if (frame !== null) view.cancelAnimationFrame(frame);
    frame = null;
    // Finish the requested movement immediately, including opacity-free JS timelines.
    step(view.performance.now());
  };
  const animation = { cancel: () => finish(false), refresh };
  active.set(owner, animation);
  owner.addEventListener("wheel", interrupt, { passive: true });
  owner.addEventListener("touchstart", interrupt, { passive: true });
  owner.addEventListener("pointerdown", interrupt, { passive: true });
  owner.addEventListener("keydown", interruptKey);
  media?.addEventListener("change", preferenceChanged);
  refresh();
  return animation;
}

/** Move only the nearest scroll owner; preserve local shell boundaries and margins. */
export function scrollIntoViewWithMotion(target: HTMLElement, block: "start" | "center" = "start"): ScrollAnimation {
  const view = target.ownerDocument.defaultView;
  let owner = target.parentElement;
  while (owner && owner !== target.ownerDocument.body && owner !== target.ownerDocument.documentElement) {
    const overflow = view?.getComputedStyle(owner).overflowY;
    if ((overflow === "auto" || overflow === "scroll") && owner.scrollHeight > owner.clientHeight) break;
    owner = owner.parentElement;
  }
  owner = owner && owner !== target.ownerDocument.body && owner !== target.ownerDocument.documentElement
    ? owner : target.ownerDocument.scrollingElement as HTMLElement | null;
  if (!owner) return { cancel() {}, refresh() {} };
  const scroll = owner;
  return animateScroll(scroll, {
    target,
    destination: () => {
      const box = target.getBoundingClientRect();
      const ownerBox = scroll.getBoundingClientRect();
      const isDocument = scroll === target.ownerDocument.scrollingElement;
      const top = isDocument ? 0 : ownerBox.top + scroll.clientTop;
      const targetStyle = view?.getComputedStyle(target);
      const margin = Number.parseFloat(targetStyle?.scrollMarginBlockStart ?? "") || 0;
      const marginEnd = Number.parseFloat(targetStyle?.scrollMarginBlockEnd ?? "") || 0;
      const style = view?.getComputedStyle(scroll);
      const paddingStart = Number.parseFloat(style?.scrollPaddingBlockStart ?? "") || 0;
      const paddingEnd = Number.parseFloat(style?.scrollPaddingBlockEnd ?? "") || 0;
      const inset = block === "center"
        ? paddingStart + (scroll.clientHeight - paddingStart - paddingEnd - box.height - margin - marginEnd) / 2 + margin
        : paddingStart + margin;
      return { top: scroll.scrollTop + box.top - top - inset };
    },
  });
}
