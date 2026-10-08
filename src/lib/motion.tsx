import { createElement, forwardRef, useCallback, useInsertionEffect, useLayoutEffect, useRef, type ComponentType, type ElementType, type ForwardedRef, type ReactNode } from "react";
import { LazyMotion, MotionConfig, visualElementStore, type Transition } from "motion/react";
import * as slimMotion from "motion/react-m";
import { MotionPolicyProvider, useMotionReduced } from "./motion-policy";
import { useTokens, type TokenOptions } from "./tokens";

export { AnimatePresence } from "motion/react";

function makeNativeAnimationsFinite(element: Element) {
  for (const animation of element.getAnimations?.() ?? []) {
    // 仅处理 JS 创建的 WAAPI 动画；保留现有 CSS 动效的媒体查询策略。
    // Leave CSS animations/transitions to their existing media-query policy.
    if ("animationName" in animation || "transitionProperty" in animation) continue;
    if (animation.effect?.getTiming().iterations === Infinity) animation.effect.updateTiming({ iterations: 1 });
    if (animation.playbackRate === 0) animation.playbackRate = 1;
  }
}

function applyMotionPolicy(element: Element | null, reduced: boolean) {
  if (!element) return;
  const visual = visualElementStore.get(element);
  if (!visual) return;
  // Motion 14 captures these flags at mount. Keep the public visual element in
  // sync, and finish both JS and native animations so presence can complete.
  visual.shouldReduceMotion = reduced;
  visual.shouldSkipAnimations = reduced;
  if (!reduced) return;
  Array.from(visual.values.values()).forEach(value => {
    const animation = value.animation;
    if (!animation) return;
    if (!("complete" in animation) || typeof animation.complete !== "function") { animation.stop(); return; }
    try { animation.complete(); }
    catch (error) {
      if (typeof error !== "object" || !error || !("name" in error) || error.name !== "InvalidStateError") throw error;
      // complete() 会先解析待定关键帧，可能此时才创建无限 WAAPI 动画。
      // Completion can resolve pending keyframes and create an infinite WAAPI effect.
      makeNativeAnimationsFinite(element);
      animation.complete();
    }
  });
}

function bindMotionRef(ref: ForwardedRef<Element>, element: Element): (() => void) | undefined {
  if (typeof ref === "function") {
    const cleanup = ref(element);
    return typeof cleanup === "function" ? cleanup : () => ref(null);
  }
  if (ref) {
    ref.current = element;
    return () => { ref.current = null; };
  }
}

function withMotionPolicy<T extends ElementType>(Component: T): T {
  const Adapted = forwardRef<Element, Record<string, unknown>>((props, forwardedRef) => {
    const reduced = useMotionReduced();
    const preference = useRef(reduced);
    preference.current = reduced;
    const element = useRef<Element | null>(null);
    const externalRef = useRef(forwardedRef);
    const boundRef = useRef(forwardedRef);
    const releaseRef = useRef<(() => void) | undefined>(undefined);
    useInsertionEffect(() => { externalRef.current = forwardedRef; }, [forwardedRef]);
    const attach = useCallback((instance: Element | null) => {
      releaseRef.current?.();
      element.current = instance;
      boundRef.current = externalRef.current;
      releaseRef.current = instance ? bindMotionRef(externalRef.current, instance) : undefined;
      applyMotionPolicy(instance, preference.current);
    }, []);
    useLayoutEffect(() => {
      if (boundRef.current === forwardedRef) return;
      releaseRef.current?.();
      boundRef.current = forwardedRef;
      releaseRef.current = element.current ? bindMotionRef(forwardedRef, element.current) : undefined;
    }, [forwardedRef]);
    useLayoutEffect(() => { applyMotionPolicy(element.current, reduced); }, [reduced]);
    return createElement(Component as ComponentType<Record<string, unknown>>, { ...props, ref: attach });
  });
  Adapted.displayName = "UnitaryMotion";
  return Adapted as unknown as T;
}

// Adapt only accessed slim components; retain their original prop/ref types.
// The cache keeps React component identity stable across renders.
const components = new Map<PropertyKey, unknown>();
const create = ((...args: Parameters<typeof slimMotion.create>) => withMotionPolicy(slimMotion.create(...args))) as typeof slimMotion.create;
function getMotionComponent(key: PropertyKey) {
  if (key === "create") return create;
  const Component = Reflect.get(slimMotion, key);
  if (typeof key !== "string" || !Component) return Component;
  if (!components.has(key)) components.set(key, withMotionPolicy(Component));
  return components.get(key);
}
export const motion: typeof slimMotion = /* @__PURE__ */ new Proxy({} as typeof slimMotion, {
  get: (_, key) => getMotionComponent(key),
  ownKeys: () => Reflect.ownKeys(slimMotion),
  getOwnPropertyDescriptor: (_, key) => Reflect.has(slimMotion, key) ? {
    configurable: true, enumerable: true, value: getMotionComponent(key),
  } : undefined,
});

export type MotionTier = "feedback" | "state" | "overlay" | "expansive";
export interface MotionProviderProps {
  children: ReactNode;
  /** Follow the system by default; always enforces a static presentation. */
  reducedMotion?: "user" | "always";
}

const tiers = {
  feedback: ["--uni-motion-feedback", "--ease-snap"],
  state: ["--uni-motion-state", "--ease-snap"],
  overlay: ["--uni-motion-overlay", "--ease-pop"],
  expansive: ["--uni-motion-expansive", "--ease-snap"],
} as const;
const instant: Transition = { type: "tween", duration: 0, delay: 0, skipAnimations: true };
const cssEases: Record<string, [number, number, number, number]> = {
  linear: [0, 0, 1, 1], ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1], "ease-out": [0, 0, 0.58, 1], "ease-in-out": [0.42, 0, 0.58, 1],
};

/** Resolve the existing scoped CSS timing contract into Motion's seconds. */
export function useMotionTransition(tier: MotionTier = "state", options: TokenOptions = {}): Transition {
  const [durationName, easeName] = tiers[tier];
  const tokens = useTokens([durationName, easeName], options);
  const reduced = useMotionReduced();
  const durationMatch = tokens[durationName].trim().match(/^(\d*\.?\d+)(ms|s)$/);
  const duration = durationMatch ? Number(durationMatch[1]) / (durationMatch[2] === "ms" ? 1000 : 1) : 0;
  const easing = tokens[easeName].trim();
  const easeMatch = easing.match(/^cubic-bezier\(\s*([^)]*)\)$/);
  const parts = easeMatch?.[1].split(",").map((value) => value.trim());
  const ease = cssEases[easing] ?? (parts?.every((value) => value !== "") ? parts.map(Number) : undefined);
  if (reduced || !Number.isFinite(duration) || duration <= 0 || !ease || ease.length !== 4
    || ease.some((value) => !Number.isFinite(value)) || ease[0] < 0 || ease[0] > 1 || ease[2] < 0 || ease[2] > 1) return instant;
  return { type: "tween", duration, ease: ease as [number, number, number, number] };
}

const loadFeatures = () => import("./motion-features").then((module) => module.default);

function ConfiguredMotion({ children }: { children: ReactNode }) {
  const reduced = useMotionReduced();
  const transition = useMotionTransition("state");
  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"} skipAnimations={reduced} transition={transition}>
      <LazyMotion features={loadFeatures} strict>{children}</LazyMotion>
    </MotionConfig>
  );
}

export function MotionProvider({ children, reducedMotion = "user" }: MotionProviderProps) {
  return (
    <MotionPolicyProvider always={reducedMotion === "always"}>
      <ConfiguredMotion>{children}</ConfiguredMotion>
    </MotionPolicyProvider>
  );
}
