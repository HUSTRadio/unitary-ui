import { useI18n } from "@hustradio/unitary-ui";
import { useState } from "react";
import { Layer, LayerScope } from "@hustradio/unitary-ui";
import { Button } from "@hustradio/unitary-ui";

export function LayerDefaultExample() {
  const zh = useI18n().locale === "zh-CN";
  const [raised, setRaised] = useState(false);
  return <div>
    <Button onClick={() => setRaised(!raised)}>{zh ? "切换页首层级" : "Toggle header level"}</Button>
    <LayerScope isolate levels={raised ? { header: 2100 } : {}} className="relative mt-4 h-40">
      <Layer level="header" data-layer-hit="header" className="absolute inset-y-4 left-4 w-3/5 rounded-lg border bg-background-200 p-4">{zh ? "页首层" : "Header layer"}</Layer>
      <Layer level="popover" data-layer-hit="popover" className="absolute inset-y-8 left-1/4 w-3/5 rounded-lg border bg-background-100 p-4">{zh ? "弹出层" : "Popover layer"}</Layer>
    </LayerScope>
  </div>;
}
