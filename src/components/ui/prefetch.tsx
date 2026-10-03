import * as React from "react";
import { Slot } from "radix-ui";
import { allowAutomaticPrefetch, type PrefetchResource, type PrefetchSnapshot } from "@/lib/prefetch";

export type PrefetchTrigger = "intent" | "viewport" | "idle";

export interface PrefetchProps extends Omit<React.ComponentPropsWithoutRef<"div">, "resource"> {
  resource: PrefetchResource<unknown>;
  trigger?: PrefetchTrigger;
  asChild?: boolean;
  disabled?: boolean;
  respectDataSaver?: boolean;
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number;
}

const SERVER_IDLE = { status: "idle", data: undefined, error: undefined } as const;

export function usePrefetchState<T>(resource: PrefetchResource<T>): PrefetchSnapshot<T> {
  return React.useSyncExternalStore(resource.subscribe, resource.getSnapshot, () => SERVER_IDLE);
}

function scheduleIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 1000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 200);
  return () => window.clearTimeout(id);
}

export function Prefetch({
  resource, trigger = "intent", asChild = false, disabled = false, respectDataSaver = true,
  root = null, rootMargin = "200px", threshold = 0,
  onPointerEnter, onPointerDown, onFocusCapture, ...props
}: PrefetchProps) {
  const [element, setElement] = React.useState<HTMLElement | null>(null);
  const snapshot = usePrefetchState(resource);
  const start = React.useCallback(() => {
    if (!disabled && allowAutomaticPrefetch(respectDataSaver)) void resource.prefetch();
  }, [disabled, respectDataSaver, resource]);

  React.useEffect(() => {
    if (disabled || !element || !allowAutomaticPrefetch(respectDataSaver)) return;
    let active = true;
    const run = () => { if (active) start(); };
    if (trigger === "idle" || (trigger === "viewport" && typeof IntersectionObserver === "undefined")) {
      const cancel = scheduleIdle(run);
      return () => { active = false; cancel(); };
    }
    if (trigger !== "viewport") return;
    const observer = new IntersectionObserver((entries) => {
      if (active && entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= threshold)) {
        active = false;
        observer.disconnect();
        start();
      }
    }, { root, rootMargin, threshold });
    observer.observe(element);
    return () => { active = false; observer.disconnect(); };
  }, [disabled, element, trigger, respectDataSaver, root, rootMargin, threshold, start]);

  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      {...props}
      ref={setElement}
      data-slot="prefetch"
      data-state={snapshot.status}
      onPointerEnter={(event) => {
        onPointerEnter?.(event as React.PointerEvent<HTMLDivElement>);
        if (!event.defaultPrevented && trigger === "intent" && event.pointerType !== "touch") start();
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event as React.PointerEvent<HTMLDivElement>);
        if (!event.defaultPrevented && trigger === "intent" && event.pointerType === "touch") start();
      }}
      onFocusCapture={(event) => {
        onFocusCapture?.(event as React.FocusEvent<HTMLDivElement>);
        if (!event.defaultPrevented && trigger === "intent") start();
      }}
    />
  );
}
