import { useState } from "react";
import { Prefetch, usePrefetchState, type PrefetchTrigger } from "@hustradio/unitary-ui";
import { createPrefetch } from "@hustradio/unitary-ui";
import { Button } from "@hustradio/unitary-ui";
import { Select, SelectItem } from "@hustradio/unitary-ui";
import { useI18n } from "@hustradio/unitary-ui";

export default function PrefetchStrategiesExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const [trigger, setTrigger] = useState<PrefetchTrigger>("viewport");
  const [attempt, setAttempt] = useState(0);
  const [requests, setRequests] = useState(0);
  const [resource] = useState(() => createPrefetch(async (signal) => {
    setRequests((count) => count + 1);
    const response = await fetch("/prefetch-preview.json", { signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }));
  const state = usePrefetchState(resource);
  const reset = () => {
    resource.invalidate();
    setAttempt((value) => value + 1);
    viewport?.scrollTo({ top: 0 });
  };
  return (
    <div className="w-full space-y-4" data-slot="prefetch-strategies-demo">
      <div className="flex flex-wrap items-center gap-3">
        <Select aria-label={zh ? "预载触发方式" : "Prefetch trigger"} value={trigger} onValueChange={(value) => { setTrigger(value as PrefetchTrigger); reset(); }}>
          <SelectItem value="viewport">{zh ? "接近视口" : "Near viewport"}</SelectItem>
          <SelectItem value="idle">{zh ? "浏览器空闲" : "Browser idle"}</SelectItem>
        </Select>
        <Button typeName="button" type="secondary" onClick={reset}>{zh ? "重新演示" : "Restart demo"}</Button>
      </div>
      <p role="status" className="text-copy-14">
        {zh ? `状态：${state.status}；请求次数：${requests}` : `Status: ${state.status}; Requests: ${requests}`}
      </p>
      <div ref={setViewport} data-slot="prefetch-demo-viewport" tabIndex={0}
        aria-label={zh ? "预载滚动演示" : "Prefetch scroll demo"}
        className="h-48 overflow-y-auto rounded-lg border border-border p-4 focus-ring">
        <p className="text-copy-14 text-muted-foreground">{zh ? "向下滚动，让目标接近容器底边。空闲方式无需滚动。" : "Scroll down until the target approaches the container. Idle mode needs no scrolling."}</p>
        <Prefetch key={`${trigger}-${attempt}`} resource={resource} trigger={trigger} root={viewport} rootMargin="40px" className="mt-80 rounded-md border border-border p-4">
          {zh ? "这个目标始终挂载；只提前准备资源。" : "This target stays mounted; its resource is prepared ahead of use."}
        </Prefetch>
      </div>
    </div>
  );
}
