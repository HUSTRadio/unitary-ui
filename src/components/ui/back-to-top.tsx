import { useEffect, useRef, type ButtonHTMLAttributes } from "react";
import { usePageScroll } from "@/lib/use-page-scroll";
import { animateScroll, type ScrollAnimation } from "@/lib/scroll-animation";
import { cn } from "@/lib/utils";

export interface BackToTopProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  target?: HTMLElement | null;
  focusTarget?: HTMLElement | null;
  threshold?: number;
}

export function BackToTop({
  target,
  focusTarget,
  threshold = 640,
  className,
  children,
  onClick,
  ...props
}: BackToTopProps) {
  const { scrolled } = usePageScroll(threshold, target);
  const animation = useRef<ScrollAnimation | null>(null);
  useEffect(() => () => animation.current?.cancel(), [target]);
  return (
    <button
      type="button"
      data-slot="back-to-top"
      hidden={!scrolled}
      className={cn(
        "min-h-11 min-w-11 rounded-full border border-gray-alpha-400 bg-background-100 px-4 text-copy-14 text-foreground shadow-sm focus-ring",
        className,
      )}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        focusTarget?.focus({ preventScroll: true });
        const owner = target ?? document.scrollingElement as HTMLElement | null;
        if (owner) animation.current = animateScroll(owner, { destination: { top: 0 } });
      }}
    >
      {children}
    </button>
  );
}
