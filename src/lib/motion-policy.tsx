import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

const ForcedReducedMotion = /* @__PURE__ */ createContext(false);

function subscribe(listener: () => void) {
  const query = typeof window === "undefined" ? undefined : window.matchMedia?.("(prefers-reduced-motion: reduce)");
  query?.addEventListener("change", listener);
  return () => query?.removeEventListener("change", listener);
}

function getSnapshot() {
  return typeof window === "undefined" || (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
}

/** The server remains static; both engines respond to live system changes. */
export function useMotionReduced(): boolean {
  const forced = useContext(ForcedReducedMotion);
  const system = useSyncExternalStore(subscribe, getSnapshot, () => true);
  return forced || system;
}

export function MotionPolicyProvider({ always, children }: { always: boolean; children: ReactNode }) {
  const inherited = useContext(ForcedReducedMotion);
  return <ForcedReducedMotion.Provider value={inherited || always}>{children}</ForcedReducedMotion.Provider>;
}
