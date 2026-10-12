import { useRef, useState } from "react";
import { FullPageScroller } from "@hustradio/unitary-ui";
import { Button } from "@hustradio/unitary-ui";
import { useI18n } from "@hustradio/unitary-ui";

export default function FullPageExample() {
  const frame = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-copy-14 text-muted-foreground">
          {zh ? `第 ${index + 1} 屏 / 3` : `Section ${index + 1} / 3`}
        </p>
        <Button
          typeName="button"
          type="secondary"
          onClick={() => frame.current?.requestFullscreen?.()}
        >
          {zh ? "全屏体验" : "Open fullscreen"}
        </Button>
      </div>
      <div
        ref={frame}
        className="h-80 w-full overflow-hidden rounded-lg border border-border bg-background [&:fullscreen]:h-dvh [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
      >
        <FullPageScroller
          className="h-full"
          index={index}
          onIndexChange={setIndex}
          wheelThreshold={80}
          touchThreshold={50}
        >
          {["coast", "desert", "forest"].map((name, position) => (
            <div key={name} className="relative flex h-full w-full items-center justify-center">
              <img
                src={`/gallery-${name}.svg`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="relative mx-6 rounded-lg bg-background-100/90 p-5 text-center text-foreground">
                <h3 className="text-heading-24">
                  {zh ? `第 ${position + 1} 屏` : `Section ${position + 1}`}
                </h3>
                <p className="mt-2 text-copy-14">
                  {zh
                    ? "滚动或滑动达到阈值后切换整屏，也可以使用方向键。"
                    : "Scroll or swipe past the threshold to change sections, or use the arrow keys."}
                </p>
              </div>
            </div>
          ))}
        </FullPageScroller>
      </div>
    </div>
  );
}
