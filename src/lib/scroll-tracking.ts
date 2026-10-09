import { useEffect, useRef, type RefObject } from "react";

import { animateScroll, type ScrollAnimation } from "./scroll-animation";

/** 活动项滚动跟随档位。 / Active-item scroll tracking modes. */
export type ScrollTrackingMode = "disabled" | "on-reload" | "always";

type Axis = "block" | "inline";

interface TrackingOptions {
  mode: ScrollTrackingMode;
  activeKey: string | undefined;
  rootRef: RefObject<HTMLElement | null>;
  axis: Axis;
  targetSelector: string;
  precedingSelector: string;
  owner: "self" | "ancestor";
  ready?: boolean;
}

function scrollOwner(root: HTMLElement, axis: Axis, self: boolean): HTMLElement | null {
  if (self) return root;
  const view = root.ownerDocument.defaultView;
  for (let node: HTMLElement | null = root; node; node = node.parentElement) {
    // 组件跟随只使用局部滚动区，避免滚动 document 或外层正文。
    // Only local scroll owners participate; never fall back to the document.
    if (node === root.ownerDocument.body || node === root.ownerDocument.documentElement) break;
    const style = view?.getComputedStyle(node);
    const overflow = axis === "block" ? style?.overflowY : style?.overflowX;
    if (overflow === "auto" || overflow === "scroll") return node;
  }
  return null;
}

function layoutMoving(root: HTMLElement): boolean {
  if (typeof root.getAnimations !== "function") return false;
  return root.getAnimations({ subtree: true }).some((animation) => {
    if (animation.playState !== "running") return false;
    const effect = animation.effect;
    if (!effect || !("getKeyframes" in effect)) return false;
    return (effect as KeyframeEffect).getKeyframes().some((frame) =>
      ["height", "maxHeight", "width", "maxWidth", "gridTemplateRows"].some((key) => key in frame),
    );
  });
}

/** 留白按既有间距尺度减半，避免前一项的文字或图标残留在起始边。
 * Halve the preferred spacing until preceding content clears the start edge. */
function trackingInset(root: HTMLElement, target: HTMLElement, box: DOMRect, axis: Axis, rtl: boolean, preferred: number, precedingSelector: string): number {
  if (preferred <= 0) return preferred;
  const entries = Array.from(root.querySelectorAll<HTMLElement>(precedingSelector));
  for (let index = entries.indexOf(target) - 1; index >= 0; index -= 1) {
    const preceding = entries[index];
    if (preceding.closest("[inert]")) continue;
    const range = root.ownerDocument.createRange();
    range.selectNodeContents(preceding);
    if (typeof range.getBoundingClientRect !== "function") return preferred;
    const content = range.getBoundingClientRect();
    if (content.width <= 0 || content.height <= 0) continue;
    const clearance = Math.max(0, axis === "block"
      ? box.top - content.bottom
      : rtl ? content.left - box.right : box.left - content.right);
    if (clearance === 0) return 0;
    return preferred / 2 ** Math.max(0, Math.ceil(Math.log2(preferred / clearance)));
  }
  return preferred;
}

function align({
  root,
  owner,
  axis,
  targetSelector,
  precedingSelector,
  handled,
  finished,
}: {
  root: HTMLElement;
  owner: HTMLElement;
  axis: Axis;
  targetSelector: string;
  precedingSelector: string;
  handled: () => void;
  finished: () => void;
}): () => void {
  const view = root.ownerDocument.defaultView!;
  let animation: ScrollAnimation;
  let previousDestination: number | undefined;
  let previousMaximum: number | undefined;
  let stableFrames = 0;
  const cleanup = () => {
    resizeObserver?.disconnect();
    mutationObserver?.disconnect();
    root.ownerDocument.removeEventListener("DOMContentLoaded", schedule);
    delete root.dataset.scrollTrackingState;
    finished();
  };
  const schedule = () => animation.refresh();
  const measure = () => {
    if (root.ownerDocument.readyState === "loading") return null;
    const target = root.querySelector<HTMLElement>(targetSelector);
    const size = axis === "block" ? owner.clientHeight : owner.clientWidth;
    const box = target?.getBoundingClientRect();
    if (!target || !box || box.width <= 0 || box.height <= 0 || size <= 0 || target.closest("[inert]")) {
      // 尚未显示的区域由 observer 唤醒，不使用永不停歇的 RAF 轮询。
      // Observers wake hidden regions; pending work does not poll forever.
      return null;
    }

    const ownerBox = owner.getBoundingClientRect();
    const style = view.getComputedStyle(target);
    const rtl = axis === "inline" && view.getComputedStyle(owner).direction === "rtl";
    const maximum = Math.max(0, axis === "block"
      ? owner.scrollHeight - owner.clientHeight
      : owner.scrollWidth - owner.clientWidth);
    const position = axis === "block" ? owner.scrollTop : rtl ? -owner.scrollLeft : owner.scrollLeft;
    const preferredInset = Number.parseFloat(axis === "block" ? style.scrollMarginBlockStart : style.scrollMarginInlineStart) || 0;
    const inset = trackingInset(root, target, box, axis, rtl, preferredInset, precedingSelector);
    const delta = axis === "block"
      ? box.top - ownerBox.top - owner.clientTop
      : rtl
        ? ownerBox.left + owner.clientLeft + owner.clientWidth - box.right
        : box.left - ownerBox.left - owner.clientLeft;
    const destination = Math.min(maximum, Math.max(0, position + delta - inset));
    stableFrames = previousDestination !== undefined &&
      Math.abs(destination - previousDestination) < 0.5 && maximum === previousMaximum
      ? stableFrames + 1 : 0;
    previousDestination = destination;
    previousMaximum = maximum;
    return axis === "block" ? { top: destination } : { left: rtl ? -destination : destination };
  };

  const resizeObserver = typeof view.ResizeObserver === "function"
    ? new view.ResizeObserver(schedule) : null;
  resizeObserver?.observe(root);
  if (owner !== root) resizeObserver?.observe(owner);
  const mutationObserver = typeof view.MutationObserver === "function"
    ? new view.MutationObserver(schedule) : null;
  mutationObserver?.observe(root, {
    childList: true, subtree: true, attributes: true,
    attributeFilter: ["inert", "data-state", "class", "style", "hidden"],
  });
  root.ownerDocument.addEventListener("DOMContentLoaded", schedule);
  root.dataset.scrollTrackingState = "pending";
  animation = animateScroll(owner, {
    target: root,
    destination: measure,
    // Follow changing collapse geometry, then release every tracking observer.
    settled: () => stableFrames >= 2 && !layoutMoving(root),
    onStart: () => {
      handled();
      root.dataset.scrollTrackingState = "running";
    },
    onInterrupt: handled,
    onFinish: cleanup,
  });
  return animation.cancel;
}

/** 内部共享实现；公开 API 只暴露档位，不绑定路由或改变活动值。
 * Internal shared behavior; public components retain control of activation. */
export function useScrollTracking({ mode, activeKey, rootRef, axis, targetSelector, precedingSelector, owner, ready = true }: TrackingOptions) {
  const state = useRef<{
    mode: ScrollTrackingMode;
    key: string | undefined;
    initialHandled: boolean;
    handledKey: string | undefined;
    cancel: (() => void) | null;
  }>({ mode: "disabled", key: undefined, initialHandled: false, handledKey: undefined, cancel: null });

  // 每次提交检查延迟出现的目标；已处理的活动值不会因重渲染重新滚动。
  // Check delayed targets on commits without retracking an already handled key.
  useEffect(() => {
    const current = state.current;
    const changed = mode !== current.mode || activeKey !== current.key;
    if (changed) {
      current.cancel?.();
      current.cancel = null;
      if (mode === "always") current.handledKey = undefined;
    }
    current.mode = mode;
    current.key = activeKey;
    if (mode === "disabled" || !ready || activeKey === undefined || current.cancel) return;
    if (mode === "on-reload" ? current.initialHandled : current.handledKey === activeKey) return;
    const root = rootRef.current;
    if (!root || !root.ownerDocument.defaultView?.requestAnimationFrame) return;
    const scroll = scrollOwner(root, axis, owner === "self");
    if (!scroll) return;
    current.cancel = align({
      root, owner: scroll, axis, targetSelector, precedingSelector,
      handled: () => {
        current.initialHandled = true;
        current.handledKey = activeKey;
      },
      finished: () => { current.cancel = null; },
    });
  });
  useEffect(() => () => {
    state.current.cancel?.();
    state.current.cancel = null;
    // StrictMode 的 effect 重挂载需重试尚未开始的任务。
    // StrictMode effect remounts retry work that has not started yet.
  }, []);
}
