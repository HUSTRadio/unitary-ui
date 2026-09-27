import { Gauge } from "@/components/ui/gauge";

export function GaugeDefaultColorScale4B7E0E9CExample() {
  return (
    <div className="flex flex-row flex-wrap items-stretch justify-start gap-8">
      <Gauge size="small" value={14} />
      <Gauge size="small" value={34} />
      <Gauge size="small" value={68} />
    </div>
  );
}
