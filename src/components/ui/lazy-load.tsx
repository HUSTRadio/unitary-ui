import * as React from "react";

export interface LazyLoadProps extends React.ComponentProps<"div"> {
  placeholder?: React.ReactNode;
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number;
  onLoad?: () => void;
  disabled?: boolean;
}

function LazyLoad({
  children,
  placeholder,
  root = null,
  rootMargin = "200px",
  threshold = 0,
  onLoad,
  disabled = false,
  ...props
}: LazyLoadProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const callbackRef = React.useRef(onLoad);
  callbackRef.current = onLoad;
  const [loaded, setLoaded] = React.useState(disabled);

  React.useEffect(() => {
    if (loaded) return;
    let active = true;
    const reveal = () => {
      if (!active) return;
      active = false;
      setLoaded(true);
      callbackRef.current?.();
    };
    // 不支持观察器时直接显示；显示过的内容永不因离开视口而卸载。
    // Fall back to eager rendering; never unmount content after its first reveal.
    if (disabled || typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          active &&
          entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= threshold)
        ) {
          observer.disconnect();
          reveal();
        }
      },
      { root, rootMargin, threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [loaded, disabled, root, rootMargin, threshold]);

  return (
    <div {...props} ref={ref} data-slot="lazy-load" data-loaded={loaded}>
      {loaded ? children : placeholder}
    </div>
  );
}

export { LazyLoad };
