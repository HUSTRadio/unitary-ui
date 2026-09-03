import { Gauge } from "@/components/ui/gauge";

export function GaugeIndeterminateD5DB1EBAExample() {
  return (
    <div className="flex flex-row flex-wrap items-stretch justify-start gap-2">
      <Gauge indeterminate size="tiny" value={25} />
      <Gauge indeterminate size="small" value={25} />
      <Gauge indeterminate size="medium" value={25} />
      <Gauge indeterminate size="large" value={25} />
    </div>
  );
}
