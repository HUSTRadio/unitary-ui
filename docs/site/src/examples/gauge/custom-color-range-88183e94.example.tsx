import { Gauge } from "@hustradio/unitary-ui";

export function GaugeCustomColorRange88183E94Example() {
  const PINK_SCALE = {
    "0": "var(--pink-100)",
    "10": "var(--pink-200)",
    "20": "var(--pink-300)",
    "30": "var(--pink-400)",
    "50": "var(--pink-500)",
    "60": "var(--pink-600)",
    "70": "var(--pink-700)",
    "80": "var(--pink-800)",
    "90": "var(--pink-900)",
    "100": "var(--pink-1000)",
  };

  return (
    <div className="flex flex-row flex-wrap items-stretch justify-start gap-2">
      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
        <Gauge key={value} colors={PINK_SCALE} size="small" value={value} />
      ))}
    </div>
  );
}
