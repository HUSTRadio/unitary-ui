import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { getTokens, subscribeTokens } from "@/lib/tokens";
import { milliseconds, parseEasing } from "@/lib/motion-easing";
import { useMotionReduced } from "@/lib/motion-policy";
import { FullPageScroller } from "./full-page-scroller";

export interface CarouselImage {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  srcSet?: string;
  sizes?: string;
}

export type CarouselVariant = "slide" | "fade" | "fade-scale";

export interface CarouselProps extends Omit<React.ComponentProps<"div">, "children" | "onChange"> {
  images: CarouselImage[];
  variant?: CarouselVariant;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  loop?: boolean;
}

function Carousel({
  images,
  variant = "slide",
  index,
  defaultIndex = 0,
  onIndexChange,
  loop = false,
  className,
  ref: forwardedRef,
  ...props
}: CarouselProps) {
  const { t } = useI18n();
  const rootRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(forwardedRef, () => rootRef.current!, []);
  const animations = React.useRef<Animation[]>([]);
  const previous = React.useRef<{ nodes: HTMLElement[]; variant: CarouselVariant; index: number } | null>(null);
  const reduced = useMotionReduced();
  const [internalIndex, setInternalIndex] = React.useState(defaultIndex);
  const current = Math.min(
    Math.max(0, Math.floor(index ?? internalIndex) || 0),
    Math.max(0, images.length - 1),
  );
  const slideSources = JSON.stringify(images.map(image => image.src));
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = [...root.querySelectorAll<HTMLElement>('[data-slot="full-page-section"]')];
    const before = previous.current;
    const sameSlides = before?.variant === variant && before.nodes.length === nodes.length
      && before.nodes.every((node, index) => node === nodes[index]);
    const styles = nodes.map(node => getComputedStyle(node));
    const weights = styles.map(style => Math.max(0, Number(style.opacity) || 0));
    const transforms = styles.map(style => style.transform);
    animations.current.forEach(animation => animation.cancel());
    animations.current = [];
    previous.current = { nodes, variant, index: current };
    if (variant === "slide") {
      nodes.forEach(node => { node.style.removeProperty("opacity"); node.style.removeProperty("transform"); });
      return;
    }
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    const tokens = getTokens(["--uni-duration-base", "--ease-snap"], { target: root });
    const duration = milliseconds(tokens["--uni-duration-base"]);
    const curve = parseEasing(tokens["--ease-snap"]);
    const animate = sameSlides && before.index !== current && !reduced && duration > 0 && curve;
    const startTime = root.ownerDocument.timeline?.currentTime ?? null;
    nodes.forEach((node, index) => {
      const opacity = index === current ? 1 : 0;
      const transform = variant === "fade-scale" && index !== current ? "scale(1.04)" : "scale(1)";
      node.style.opacity = String(opacity);
      node.style.transform = transform;
      if (!animate || typeof node.animate !== "function") return;
      const animation = node.animate([
        { opacity: total > 0 ? weights[index] / total : Number(index === before.index), transform: transforms[index] },
        { opacity, transform },
      ], { duration, easing: `cubic-bezier(${curve.join(",")})` });
      // A shared start time preserves the sum of weights across all layers,
      // including A -> B -> C interruptions and CSS reversal shortening.
      if (startTime !== null) animation.startTime = startTime;
      animations.current.push(animation);
    });
    const unsubscribe = subscribeTokens(() => {
      // Live token edits settle the current group; the next selection reads them.
      animations.current.forEach(animation => animation.cancel());
      animations.current = [];
    }, { target: root });
    return unsubscribe;
  }, [current, variant, slideSources, reduced]);
  React.useLayoutEffect(() => () => animations.current.forEach(animation => animation.cancel()), []);
  const select = (value: number) => {
    if (!images.length) return;
    const next = loop
      ? (value + images.length) % images.length
      : Math.max(0, Math.min(images.length - 1, value));
    if (next === current) return;
    if (index === undefined) setInternalIndex(next);
    onIndexChange?.(next);
  };
  const buttonClass =
    "inline-flex size-11 items-center justify-center rounded-full border border-gray-alpha-400 bg-background-100 text-foreground focus-ring transition-colors hover:bg-gray-alpha-100 disabled:opacity-40 motion-reduce:transition-none";
  return (
    <div
      {...props}
      ref={rootRef}
      data-slot="carousel"
      data-variant={variant}
      role={props.role ?? "region"}
      aria-roledescription={t("carousel")}
      aria-label={props["aria-label"] ?? t("Image gallery")}
      className={cn("min-w-0 space-y-3", className)}
    >
      <FullPageScroller
        orientation="horizontal"
        index={current}
        onIndexChange={select}
        aria-label={t("Image gallery")}
        className="h-auto aspect-[16/9] rounded-lg border border-gray-alpha-400"
      >
        {images.map((image, position) => (
          <figure key={`${image.src}-${position}`} className="relative h-full w-full">
            <img
              src={image.src}
              alt={image.alt}
              srcSet={image.srcSet}
              sizes={image.sizes}
              draggable={false}
              loading={position === current ? "eager" : "lazy"}
              className="h-full w-full object-cover"
            />
            {image.caption && (
              <figcaption className="absolute inset-x-0 bottom-0 bg-background-100/90 p-3 text-copy-14 text-foreground">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </FullPageScroller>
      {images.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1">
          <button
            type="button"
            className={buttonClass}
            aria-label={t("Previous image")}
            disabled={!loop && current === 0}
            onClick={() => select(current - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <div className="flex flex-wrap items-center justify-center">
            {images.map((image, position) => (
              <button
                key={`${image.src}-${position}`}
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-full focus-ring"
                aria-label={t("Go to image {index}", { index: position + 1 })}
                aria-current={position === current ? "true" : undefined}
                onClick={() => select(position)}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-2 rounded-full bg-gray-alpha-400",
                    position === current && "bg-foreground",
                  )}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            className={buttonClass}
            aria-label={t("Next image")}
            disabled={!loop && current === images.length - 1}
            onClick={() => select(current + 1)}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      )}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {images.length
          ? t("Image {index} of {count}", { index: current + 1, count: images.length })
          : t("No images")}
      </p>
    </div>
  );
}

export { Carousel };
