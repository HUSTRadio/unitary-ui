import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { LayerScope } from "@/components/ui/layer";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";

export function LayerScopedExample() {
  const zh = useI18n().locale === "zh-CN";
  const [level, setLevel] = useState(2100);
  return <div className="flex flex-wrap gap-4">
    <LayerScope levels={{ popover: level, tooltip: level + 1 }} data-layer-demo="scoped">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setLevel(level === 2100 ? 2200 : 2100)}>{zh ? "修改已打开浮层的层级" : "Change open popup level"}</Button>
        <Select placeholder={zh ? "局部选择器" : "Scoped select"}><SelectItem value="first">{zh ? "第一项" : "First"}</SelectItem><SelectItem value="second">{zh ? "第二项" : "Second"}</SelectItem></Select>
        <Tooltip text={zh ? "局部提示" : "Scoped tooltip"}><Button>Tooltip</Button></Tooltip>
      </div>
      <output className="text-copy-13">{zh ? "弹出层" : "Popover layer"}: {level}</output>
    </LayerScope>
    <LayerScope data-layer-demo="independent"><Select placeholder={zh ? "独立选择器" : "Independent select"}><SelectItem value="default">{zh ? "默认层级" : "Default level"}</SelectItem></Select></LayerScope>
  </div>;
}
