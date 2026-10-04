import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/** Semantic stacking roles. Values remain owned by the stylesheet. */
export const LAYER_TOKENS = {
  base: "--uni-z-base",
  calendar: "--uni-z-calendar",
  header: "--uni-z-header",
  menu: "--uni-z-menu",
  drawer: "--uni-z-drawer",
  modal: "--uni-z-modal",
  popover: "--uni-z-popover",
  toast: "--uni-z-toast",
  tooltip: "--uni-z-tooltip",
  "context-card": "--uni-z-context-card",
} as const;

export type LayerLevel = keyof typeof LAYER_TOKENS;
type LayerLevels = Partial<Record<LayerLevel, number>>;
const LayerContext = React.createContext<LayerLevels>({});

const LEVEL_CLASSES: Record<LayerLevel, string> = {
  base: "z-[var(--uni-z-base)]",
  calendar: "z-[var(--uni-z-calendar)]",
  header: "z-[var(--uni-z-header)]",
  menu: "z-[var(--uni-z-menu)]",
  drawer: "z-[var(--uni-z-drawer)]",
  modal: "z-[var(--uni-z-modal)]",
  popover: "z-[var(--uni-z-popover)]",
  toast: "z-[var(--uni-z-toast)]",
  tooltip: "z-[var(--uni-z-tooltip)]",
  "context-card": "z-[var(--uni-z-context-card)]",
};

function variables(levels: LayerLevels): React.CSSProperties {
  return Object.fromEntries(Object.entries(levels).map(([level, value]) => [LAYER_TOKENS[level as LayerLevel], value]));
}

/** Internal bridge: never replaces an existing consumer's z-index overrides. */
export function useLayerVariables(): React.CSSProperties {
  return variables(React.useContext(LayerContext));
}

export function useLayerStyle(level: LayerLevel): React.CSSProperties {
  return { ...useLayerVariables(), zIndex: `var(${LAYER_TOKENS[level]})` };
}

export interface LayerProps extends React.ComponentProps<"div"> {
  level?: LayerLevel;
}

export function Layer({ level = "base", className, style, ...props }: LayerProps) {
  const vars = useLayerVariables();
  return <div data-slot="layer" data-level={level} className={cn("relative", LEVEL_CLASSES[level], className)} style={{ ...vars, ...style }} {...props} />;
}

export interface LayerScopeProps extends React.ComponentProps<"div"> {
  levels?: LayerLevels;
  isolate?: boolean;
}

export function LayerScope({ levels = {}, isolate = false, className, style, children, ...props }: LayerScopeProps) {
  const parent = React.useContext(LayerContext);
  for (const [level, value] of Object.entries(levels)) {
    if (!Object.hasOwn(LAYER_TOKENS, level)) throw new TypeError(`Unknown layer level: ${level}`);
    if (!Number.isSafeInteger(value)) throw new TypeError(`Layer level ${level} must be a safe integer`);
  }
  const merged = { ...parent, ...levels };
  return (
    <LayerContext.Provider value={merged}>
      <div data-slot="layer-scope" data-isolate={isolate || undefined} className={cn(isolate && "isolate", className)} style={{ ...style, ...variables(merged) }} {...props}>{children}</div>
    </LayerContext.Provider>
  );
}

export interface LayerPortalProps extends React.ComponentProps<"div"> {
  container?: Element | DocumentFragment | null;
}

export function LayerPortal({ container, style, ...props }: LayerPortalProps) {
  const vars = useLayerVariables();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(<div data-slot="layer-portal" style={{ ...style, ...vars }} {...props} />, container ?? document.body);
}
