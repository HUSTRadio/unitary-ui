import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { Layer, LayerPortal, LayerScope, useLayerStyle } from "@/components/ui/layer";

function CustomSurface() {
  const zh = useI18n().locale === "zh-CN";
  return <div style={useLayerStyle("popover")} className="relative rounded-lg border bg-background-100 p-4">{zh ? "自定义表面：useLayerStyle" : "Custom surface: useLayerStyle"}</div>;
}

export function LayerPortalExample() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return <LayerScope isolate levels={{ popover: 12 }}>
    <div ref={setContainer} data-layer-demo="portal-target" className="relative min-h-28 rounded-lg border border-dashed p-4" />
    {container && <LayerPortal container={container}><Layer level="base"><CustomSurface /></Layer></LayerPortal>}
  </LayerScope>;
}
