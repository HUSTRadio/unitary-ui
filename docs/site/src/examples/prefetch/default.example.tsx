import { useState } from "react";
import { Prefetch, usePrefetchState } from "@/components/ui/prefetch";
import { createPrefetch } from "@/lib/prefetch";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function PrefetchExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  const [requests, setRequests] = useState(0);
  const [open, setOpen] = useState(false);
  const [resource] = useState(() => createPrefetch(async (signal) => {
    setRequests((count) => count + 1);
    const response = await fetch("/prefetch-preview.json", { signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json() as { title: string; titleZh: string; body: string; bodyZh: string };
  }));
  const state = usePrefetchState(resource);
  const labels = zh
    ? { idle: "尚未开始", loading: "准备中", ready: "已就绪", error: "失败，可重试" }
    : { idle: "Not started", loading: "Preparing", ready: "Ready", error: "Failed; retry available" };
  return (
    <div className="w-full space-y-4" data-slot="prefetch-demo">
      <p className="text-copy-14 text-muted-foreground">
        {zh ? "悬停、聚焦或触摸按钮会预载；点击后复用同一结果。" : "Hover, focus or touch the button to prepare; clicking reuses the result."}
      </p>
      <div className="flex flex-wrap gap-3">
        <Prefetch resource={resource} asChild>
          <Button typeName="button" onClick={async () => {
            try { await resource.load(); setOpen(true); } catch { /* 状态包含错误。 / State exposes the error. */ }
          }}>{zh ? "打开预览" : "Open preview"}</Button>
        </Prefetch>
        <Button typeName="button" type="secondary" onClick={() => { resource.invalidate(); setOpen(false); }}>
          {zh ? "清除缓存" : "Clear cache"}
        </Button>
      </div>
      <p role="status" data-slot="prefetch-demo-status" className="text-copy-14">
        {zh ? `状态：${labels[state.status]}；请求次数：${requests}` : `Status: ${labels[state.status]}; Requests: ${requests}`}
      </p>
      {open && state.status === "ready" ? (
        <div data-slot="prefetch-preview" className="space-y-2 rounded-lg border border-border p-4">
          <h3 className="text-heading-16">{zh ? state.data.titleZh : state.data.title}</h3>
          <p className="text-copy-14">{zh ? state.data.bodyZh : state.data.body}</p>
        </div>
      ) : null}
    </div>
  );
}
