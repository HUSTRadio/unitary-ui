import { useState } from "react";
import { NumberedPagination } from "@/components/ui/pagination";
import { Carousel } from "@/components/ui/carousel";
import { FullPageScroller } from "@/components/ui/full-page-scroller";
import { LazyLoad } from "@/components/ui/lazy-load";
import { Skeleton } from "@/components/ui/skeleton";

export function PagedMediaExample() {
  const [page, setPage] = useState(6);
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-heading-24">数字分页 · Numbered pagination</h2>
        <p className="text-copy-14 text-muted-foreground">
          搜索结果第 {page} 页 / Search results page {page}
        </p>
        <NumberedPagination totalPages={24} page={page} onPageChange={setPage} />
      </section>
      <section className="space-y-3">
        <h2 className="text-heading-24">图片轮播 · Image carousel</h2>
        <Carousel
          className="max-w-2xl"
          images={[
            { src: "/gallery-coast.svg", alt: "海岸 · Coast" },
            { src: "/gallery-desert.svg", alt: "沙漠 · Desert" },
            { src: "/gallery-forest.svg", alt: "森林 · Forest" },
          ]}
        />
      </section>
      <section className="space-y-3">
        <h2 className="text-heading-24">整屏滚动 · Full page scrolling</h2>
        <FullPageScroller className="h-80 rounded-lg border border-border">
          {[1, 2, 3].map((value) => (
            <div
              key={value}
              className="flex h-full items-center justify-center bg-surface text-heading-32"
            >
              第 {value} 屏 · Section {value}
            </div>
          ))}
        </FullPageScroller>
      </section>
      <section className="space-y-3">
        <h2 className="text-heading-24">延迟加载 · Lazy loading</h2>
        <LazyLoad
          className="aspect-[16/9] max-w-2xl overflow-hidden rounded-lg"
          placeholder={<Skeleton className="h-full w-full" />}
        >
          <img
            src="/gallery-forest.svg"
            alt="森林与雪山 · Forest and snowy mountains"
            width={960}
            height={540}
            className="h-full w-full object-cover"
          />
        </LazyLoad>
      </section>
    </div>
  );
}
