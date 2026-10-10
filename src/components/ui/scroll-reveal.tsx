import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useMediaMatch } from "@/lib/use-page-scroll";

export interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
  root?: HTMLElement | null;
}

export function ScrollReveal({ root = null, className, style, ...props }: ScrollRevealProps) {
  const element = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const reduced = useMediaMatch("(prefers-reduced-motion: reduce)");
  useEffect(() => {
    if (reduced || typeof IntersectionObserver === "undefined" || !element.current) {
      setPending(false);
      return;
    }
    const bounds = element.current.getBoundingClientRect();
    const viewport = root?.getBoundingClientRect();
    if (bounds.top < (viewport?.bottom ?? window.innerHeight)) {
      setPending(false);
      return;
    }
    setPending(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPending(false);
          observer.disconnect();
        }
      },
      { root, threshold: 0.05 },
    );
    observer.observe(element.current);
    return () => observer.disconnect();
  }, [root, reduced]);
  return (
    <div
      ref={element}
      data-slot="scroll-reveal"
      data-pending={pending || undefined}
      className={cn(
        "transition-[opacity,transform] duration-(--uni-duration-slow) ease-snap data-[pending=true]:opacity-0 data-[pending=true]:translate-y-4 motion-reduce:transition-none motion-reduce:opacity-100! motion-reduce:translate-y-0! focus-within:opacity-100! focus-within:translate-y-0!",
        className,
      )}
      style={style}
      {...props}
    />
  );
}
