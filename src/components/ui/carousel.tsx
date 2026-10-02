import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { FullPageScroller } from "./full-page-scroller";

export interface CarouselImage {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  srcSet?: string;
  sizes?: string;
}

export interface CarouselProps extends Omit<React.ComponentProps<"div">, "children" | "onChange"> {
  images: CarouselImage[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  loop?: boolean;
}

function Carousel({
  images,
  index,
  defaultIndex = 0,
  onIndexChange,
  loop = false,
  className,
  ...props
}: CarouselProps) {
  const { t } = useI18n();
  const [internalIndex, setInternalIndex] = React.useState(defaultIndex);
  const current = Math.min(
    Math.max(0, Math.floor(index ?? internalIndex) || 0),
    Math.max(0, images.length - 1),
  );
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
      data-slot="carousel"
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
