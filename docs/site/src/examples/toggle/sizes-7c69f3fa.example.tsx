import { Toggle } from "@/components/ui/toggle";

export function ToggleSizes7C69F3FAExample() {
  return (
    <div className="flex flex-row flex-wrap">
      <Toggle aria-label="Enable Firewall" checked={false} readOnly />
      <Toggle aria-label="Enable Firewall" checked={false} readOnly size="medium" />
      <Toggle aria-label="Enable Firewall" checked={false} readOnly size="large" />
    </div>
  );
}
