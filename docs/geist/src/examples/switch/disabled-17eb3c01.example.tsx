import { Switch, SwitchControl } from "@/components/ui/switch";

export function SwitchDisabled17EB3C01Example() {
  return (
    <Switch name="view-mode">
      <SwitchControl defaultChecked disabled label="Source" value="source" />
      <SwitchControl disabled label="Output" value="output" />
    </Switch>
  );
}
