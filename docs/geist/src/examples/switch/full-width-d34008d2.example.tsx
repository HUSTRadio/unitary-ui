import { Switch, SwitchControl } from "@/components/ui/switch";

export function SwitchFullWidthD34008D2Example() {
  return (
    <Switch name="reference-full-width" style={{ width: "100%" }}>
      <SwitchControl defaultChecked label="Source" value="source" />
      <SwitchControl label="Output" value="output" />
    </Switch>
  );
}
