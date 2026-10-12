import { Toggle } from "@hustradio/unitary-ui";

export function ToggleDisabled17EB3C01Example() {
  return (
    <div className="flex flex-col">
      <Toggle aria-label="Enable Firewall" checked={false} readOnly disabled />
      <Toggle aria-label="Enable Firewall" checked readOnly disabled />
    </div>
  );
}
