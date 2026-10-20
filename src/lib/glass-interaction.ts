import * as React from "react";
import { useMotionReduced } from "./motion-policy";

type Options = { enabled?: boolean; keys?: "button" | "link" | "choice"; target?: (host: HTMLElement) => HTMLElement | null };

/** Existing author background and filter utilities retain ownership. */
export const hasGlassBackgroundOverride = (className: string | undefined) => /(?:^|\s)(?:[^\s]+:)*!?bg-/.test(className ?? "");
export const hasGlassFilterOverride = (className: string | undefined) => /(?:^|\s)(?:[^\s]+:)*!?(?:backdrop-|filter(?:\s|$|:|-))/.test(className ?? "");

/** Local CSS glint feedback; native state and foreground geometry stay with the control. */
export function useGlassInteraction({ enabled = true, keys = "button", target }: Options = {}) {
  const reduced = useMotionReduced();
  const touched = React.useRef(new Set<HTMLElement>());
  const pending = React.useRef(new Map<HTMLElement, { x?: number; y?: number }>());
  const held = React.useRef(new Set<HTMLElement>());
  const frame = React.useRef(0);
  const available = enabled && !reduced;
  const clearDirection = (surface: HTMLElement) => {
    surface.style.removeProperty("--_uni-glass-pointer-x");
    surface.style.removeProperty("--_uni-glass-pointer-y");
    surface.removeAttribute("data-uni-glass-contact");
  };
  const direction = (surface: HTMLElement, kind: string, point?: { clientX: number; clientY: number }, keyboard = false) => {
    if (kind === "reset" || keyboard && kind === "release") {
      pending.current.delete(surface); held.current.delete(surface); clearDirection(surface);
      if (!pending.current.size) { cancelAnimationFrame(frame.current); frame.current = 0; }
      return;
    }
    if (kind === "move" && held.current.has(surface)) return;
    if (kind === "press") { held.current.add(surface); surface.setAttribute("data-uni-glass-contact", ""); }
    if (kind === "release") { held.current.delete(surface); surface.removeAttribute("data-uni-glass-contact"); }
    pending.current.set(surface, { x: point?.clientX, y: point?.clientY });
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      for (const [node, input] of pending.current) {
        if (!node.isConnected) { clearDirection(node); continue; }
        const bounds = node.getBoundingClientRect();
        const axis = (value: number | undefined, start: number, size: number) => value === undefined || !size ? 0 : Math.max(-1, Math.min(1, (value - start) / size * 2 - 1));
        node.style.setProperty("--_uni-glass-pointer-x", String(axis(input.x, bounds.left, bounds.width)));
        node.style.setProperty("--_uni-glass-pointer-y", String(axis(input.y, bounds.top, bounds.height)));
      }
      pending.current.clear();
    });
  };
  const send = (host: HTMLElement, kind: string, event?: { clientX: number; clientY: number }, keyboard = false) => {
    if (!available) return;
    const surface = target ? target(host) : host;
    if (!surface) return;
    if (host.ownerDocument.documentElement.dataset.texture !== "glass") {
      direction(surface, "reset"); return;
    }
    touched.current.add(surface);
    direction(surface, kind, event, keyboard);
  };
  // A shared hook can keep running while one Tabs item loses its interaction
  // marker. Release only that item's contact and queued input after the commit.
  React.useLayoutEffect(() => {
    for (const surface of touched.current) {
      if (surface.isConnected && surface.hasAttribute("data-uni-glass-interaction") &&
        !surface.matches(':disabled, [aria-disabled="true"], [data-disabled="true"]')) continue;
      direction(surface, "reset");
      touched.current.delete(surface);
    }
  });
  React.useEffect(() => {
    const nodes = touched.current;
    const queue = pending.current;
    const contacts = held.current;
    return () => {
      cancelAnimationFrame(frame.current); frame.current = 0;
      for (const surface of nodes) {
        clearDirection(surface);
      }
      nodes.clear(); queue.clear(); contacts.clear();
    };
  }, [available]);
  const handlers: React.HTMLAttributes<HTMLElement> = {
    onPointerEnter(event) { if (event.pointerType !== "touch") send(event.currentTarget, "move", event); },
    onPointerMove(event) { if (event.pointerType !== "touch") send(event.currentTarget, "move", event); },
    onPointerDown(event) {
      if (event.isPrimary !== false && event.button === 0) send(event.currentTarget, "press", event);
    },
    onPointerUp(event) { send(event.currentTarget, event.pointerType === "touch" ? "reset" : "release", event); },
    onPointerLeave(event) { send(event.currentTarget, "reset"); },
    onPointerCancel(event) { send(event.currentTarget, "reset"); },
    onLostPointerCapture(event) { send(event.currentTarget, "reset"); },
    onBlur(event) { send(event.currentTarget, "reset"); },
    onKeyDown(event) {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === "Enter" && keys !== "choice" || event.key === " " && keys !== "link") send(event.currentTarget, "press", undefined, true);
    },
    onKeyUp(event) {
      if (event.key === "Enter" && keys !== "choice" || event.key === " " && keys !== "link") send(event.currentTarget, "release", undefined, true);
    },
  };
  return {
    marker: available ? "" : undefined,
    handlers,
    compose<T extends object>(props: T): T & React.HTMLAttributes<HTMLElement> {
      const result = { ...props, "data-uni-glass-motion": enabled && reduced ? "reduced" : undefined } as T & React.HTMLAttributes<HTMLElement>;
      for (const name of Object.keys(handlers) as Array<keyof typeof handlers>) {
        const optical = handlers[name] as (event: React.SyntheticEvent<HTMLElement>) => void;
        const author = (props as React.HTMLAttributes<HTMLElement>)[name] as typeof optical | undefined;
        Object.assign(result, { [name]: (event: React.SyntheticEvent<HTMLElement>) => {
          author?.(event); if (!event.defaultPrevented) optical(event);
        } });
      }
      return result;
    },
  };
}
