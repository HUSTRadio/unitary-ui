import { useEffect, useRef, useState } from "react";

export interface PageScrollState {
  scrolled: boolean;
  direction: "up" | "down" | "idle";
  progress: number;
}

export function usePageScroll(threshold = 80, target?: HTMLElement | null): PageScrollState {
  const [state, setState] = useState<PageScrollState>({
    scrolled: false,
    direction: "idle",
    progress: 0,
  });
  const previous = useRef(0);
  useEffect(() => {
    const owner = target ?? window;
    let frame: number | null = null;
    const update = () => {
      frame = null;
      const position = Math.max(0, target ? target.scrollTop : window.scrollY);
      const extent = target
        ? target.scrollHeight - target.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      const delta = position - previous.current;
      const changed = Math.abs(delta) >= Math.max(1, threshold);
      if (changed || position === 0) previous.current = position;
      setState((current) => {
        const next: PageScrollState = {
          scrolled: position > threshold,
          direction:
            position === 0 ? "idle" : changed ? (delta > 0 ? "down" : "up") : current.direction,
          progress: extent > 0 ? Math.min(1, position / extent) : 0,
        };
        return next.scrolled === current.scrolled &&
          next.direction === current.direction &&
          next.progress === current.progress
          ? current
          : next;
      });
    };
    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };
    previous.current = target ? target.scrollTop : window.scrollY;
    update();
    owner.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(target ?? document.documentElement);
    return () => {
      owner.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [threshold, target]);
  return state;
}

export function useMediaMatch(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}
