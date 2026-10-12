import { Gauge } from "@hustradio/unitary-ui";

export function GaugeArcPriorityAB3EBA95Example() {
  return (
    <div className="flex justify-start">
      <Gauge
        arcPriority="equal"
        colors={{ primary: "var(--blue-700)", secondary: "var(--red-700)" }}
        showValue
        size="medium"
        value={50}
      />
    </div>
  );
}
