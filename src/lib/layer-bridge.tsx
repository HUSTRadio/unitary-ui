import * as React from "react";
import { useLayerVariables } from "@/components/ui/layer";
import { subscribeTokens } from "./tokens";

/** Radix copies z-index to its positioning wrapper once. Keep live edits in sync. */
export function useLayerContentRef<T extends HTMLElement>(forwardedRef?: React.Ref<T>): React.RefCallback<T> {
  const releaseRef = React.useRef<(() => void) | null>(null);
  const subscriptionRef = React.useRef<{
    node: T; active: boolean; version: number; resume: () => void; suspend: () => void; dispose: () => void;
  } | null>(null);
  return React.useCallback((node: T | null) => {
    releaseRef.current?.();
    if (!node) return;
    let subscription = subscriptionRef.current;
    if (subscription?.node !== node) {
      subscription?.dispose();
      const state = { node, active: true, version: 0, resume: () => {}, suspend: () => {}, dispose: () => {} };
      subscription = subscriptionRef.current = state;
      const view = node.ownerDocument.defaultView;
      let disposed = false, pending = false, frame: number | undefined;
      let unsubscribe = () => {};
      const sync = () => {
        if (disposed || !state.active) return;
        const wrapper = node.closest<HTMLElement>("[data-radix-popper-content-wrapper]");
        if (!wrapper || wrapper === node) return;
        const value = view?.getComputedStyle(node).zIndex;
        if (value && wrapper.style.zIndex !== value) wrapper.style.zIndex = value;
      };
      const schedule = () => {
        if (disposed || !state.active) return;
        pending = true;
        if (frame !== undefined || !view) return;
        frame = view.requestAnimationFrame(() => { frame = undefined; pending = false; sync(); });
      };
      state.resume = () => {
        state.active = true; state.version++;
        if (pending) schedule();
      };
      state.suspend = () => {
        state.active = false; state.version++;
        if (frame !== undefined) view?.cancelAnimationFrame(frame);
        frame = undefined;
      };
      state.dispose = () => {
        if (disposed) return;
        disposed = true; pending = false; state.suspend(); unsubscribe();
        for (const name of ["transitionend", "transitioncancel", "animationend"]) node.removeEventListener(name, schedule);
        if (subscriptionRef.current === state) subscriptionRef.current = null;
      };
      // Radix publishes its wrapper in the mount commit. Subscribe without a
      // ref -> state render, retaining one subscription per actual DOM node.
      queueMicrotask(() => {
        if (disposed || !state.active) return;
        // Radix already reads the initial level in its layout effect. Batch our
        // reconciliation with live invalidations before paint, avoiding a second
        // forced style refresh in the opening task.
        schedule(); unsubscribe = subscribeTokens(schedule, { target: node });
        for (const name of ["transitionend", "transitioncancel", "animationend"]) node.addEventListener(name, schedule);
      });
    } else {
      subscription.resume();
    }
    const current = subscription;
    let released = false;
    const forwardedCleanup = typeof forwardedRef === "function" ? forwardedRef(node) : undefined;
    if (forwardedRef && typeof forwardedRef !== "function") forwardedRef.current = node;
    const release = () => {
      if (released) return;
      released = true; current.suspend();
      if (typeof forwardedCleanup === "function") forwardedCleanup();
      else if (typeof forwardedRef === "function") forwardedRef(null);
      else if (forwardedRef) forwardedRef.current = null;
      if (releaseRef.current === release) releaseRef.current = null;
      const version = current.version;
      // A composed ref can change identity while its DOM node remains mounted.
      // Stop queued reads immediately; dispose only if no replacement reattaches
      // the same node in this commit. Forwarded cleanup stays synchronous.
      queueMicrotask(() => {
        if (!current.active && current.version === version) current.dispose();
      });
    };
    releaseRef.current = release;
    return release;
  }, [forwardedRef]);
}

/** Preserve the primitive's DOM, presence, accessibility and ref contracts. */
export function withLayerBridge<P extends { style?: React.CSSProperties }, T extends HTMLElement>(Primitive: React.ForwardRefExoticComponent<P & React.RefAttributes<T>>) {
  const Bridged = React.forwardRef<T, P>((props, ref) => {
    const vars = useLayerVariables();
    const contentRef = useLayerContentRef(ref);
    return <Primitive {...(props as P)} style={{ ...vars, ...props.style }} ref={contentRef} />;
  });
  Bridged.displayName = `LayerBridge(${Primitive.displayName ?? "Primitive"})`;
  return Bridged;
}
