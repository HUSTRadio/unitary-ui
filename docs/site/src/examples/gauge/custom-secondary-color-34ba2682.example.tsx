import { Gauge } from "@/components/ui/gauge";

export function GaugeCustomSecondaryColor34BA2682Example() {
  return (
    <div className="flex justify-start">
      <Gauge
        colors={{ primary: "var(--blue-700)", secondary: "var(--blue-300)" }}
        size="medium"
        value={50}
      />
    </div>
  );
}
