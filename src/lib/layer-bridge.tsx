import * as React from "react";
import { useLayerVariables } from "@/components/ui/layer";
import { subscribeTokens } from "./tokens";

/** Radix copies z-index to its positioning wrapper once. Keep live edits in sync. */
export function useLayerContentRef<T extends HTMLElement>(forwardedRef?: React.Ref<T>): React.RefCallback<T> {
  const [node, setNode] = React.useState<T | null>(null);
  React.useEffect(() => {
    if (!node) return;
    const sync = () => {
      const wrapper = node.closest<HTMLElement>("[data-radix-popper-content-wrapper]");
      if (!wrapper || wrapper === node) return;
      const value = node.ownerDocument.defaultView?.getComputedStyle(node).zIndex;
      if (value && wrapper.style.zIndex !== value) wrapper.style.zIndex = value;
    };
    sync();
    const unsubscribe = subscribeTokens(sync, { target: node });
    // The first mutation can precede a CSS z-index transition. Read the final
    // computed value after it settles, preserving authored class/style overrides.
    node.addEventListener("transitionend", sync);
    node.addEventListener("transitioncancel", sync);
    node.addEventListener("animationend", sync);
    return () => {
      unsubscribe();
      node.removeEventListener("transitionend", sync);
      node.removeEventListener("transitioncancel", sync);
      node.removeEventListener("animationend", sync);
    };
  }, [node]);
  return React.useCallback((element: T | null) => {
    setNode(element);
    if (typeof forwardedRef === "function") return forwardedRef(element);
    if (forwardedRef) forwardedRef.current = element;
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
