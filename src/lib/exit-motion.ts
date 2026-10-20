/** Wait only for this element's finite motion, never a descendant's event.
 * Native completion handles shortened/reversed transitions; computed timing is
 * a fallback for environments without WAAPI, not a second fixed duration. */
export function waitForExitMotion(node: HTMLElement, complete: () => void): () => void {
  const view = node.ownerDocument.defaultView!;
  const media = view.matchMedia?.("(prefers-reduced-motion: reduce)");
  let disposed = false;
  let timer: number | undefined;
  let deadline = Infinity;
  const finish = () => { if (!disposed) { dispose(); complete(); } };
  const changed = () => { if (media?.matches) finish(); };
  const dispose = () => {
    disposed = true;
    view.clearTimeout(timer);
    media?.removeEventListener("change", changed);
    node.removeEventListener("animationend", ended);
    node.removeEventListener("transitionend", ended);
    node.removeEventListener("animationcancel", ended);
    node.removeEventListener("transitioncancel", ended);
  };
  const ownAnimations = () => (node.getAnimations?.() ?? []).filter(animation =>
    animation.effect?.getTiming().iterations !== Infinity && animation.playState !== "finished"
    && animation.playState !== "idle");
  const ended = (event: Event) => {
    if (event.target === node && Date.now() >= deadline) finish();
  };
  const style = view.getComputedStyle(node); // Flush the exit state before collecting effects.
  const animations = ownAnimations();
  media?.addEventListener("change", changed);
  if (media?.matches) queueMicrotask(finish);
  else if (animations.length) Promise.allSettled(animations.map(animation => animation.finished)).then(finish);
  else if (typeof node.getAnimations === "function") queueMicrotask(finish);
  else {
    const times = (value: string) => value.split(",").map(part => {
      const n = Number.parseFloat(part);
      return Number.isFinite(n) ? n * (part.trim().endsWith("ms") ? 1 : 1000) : 0;
    });
    const span = (durations: string, delays: string) => {
      const ds = times(durations), ls = times(delays);
      return Math.max(0, ...ds.map((duration, index) => duration + ls[index % ls.length]));
    };
    const duration = Math.max(span(style.transitionDuration, style.transitionDelay), span(style.animationDuration, style.animationDelay));
    deadline = Date.now() + duration;
    timer = view.setTimeout(finish, duration);
    node.addEventListener("animationend", ended);
    node.addEventListener("transitionend", ended);
    node.addEventListener("animationcancel", ended);
    node.addEventListener("transitioncancel", ended);
  }
  return dispose;
}
