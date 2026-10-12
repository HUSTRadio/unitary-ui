import { useState } from "react";
import { LazyLoad } from "@hustradio/unitary-ui";
import { Skeleton } from "@hustradio/unitary-ui";
import { useI18n } from "@hustradio/unitary-ui";

export default function LazyLoadExample() {
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(0);
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  return (
    <div className="w-full space-y-3">
      <p role="status" className="text-copy-14 text-muted-foreground">
        {zh
          ? `已挂载 ${loaded} / 6 张图片；向下滚动加载更多。`
          : `${loaded} / 6 images mounted; scroll down to load more.`}
      </p>
      <div
        ref={setViewport}
        data-slot="lazy-demo-viewport"
        tabIndex={0}
        aria-label={zh ? "延迟加载图片列表" : "Lazy image list"}
        className="h-80 overflow-y-auto rounded-lg border border-border p-3 focus-ring"
      >
        <div className="space-y-4">
          {["coast", "desert", "forest", "coast", "desert", "forest"].map((name, position) => (
            <LazyLoad
              key={position}
              root={viewport}
              rootMargin="80px"
              className="aspect-[16/9] w-full overflow-hidden rounded-md"
              placeholder={<Skeleton className="h-full w-full" />}
              onLoad={() => setLoaded((count) => count + 1)}
            >
              <img
                src={`/gallery-${name}.svg`}
                alt={zh ? `风景插画 ${position + 1}` : `Landscape illustration ${position + 1}`}
                width={960}
                height={540}
                className="h-full w-full object-cover"
              />
            </LazyLoad>
          ))}
        </div>
      </div>
    </div>
  );
}
