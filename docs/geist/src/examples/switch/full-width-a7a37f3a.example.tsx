import { Switch, SwitchControl } from "@/components/ui/switch";

export function SwitchFullWidthA7A37F3AExample() {
  return (
    <Switch name="full-width" style={{ width: "100%" }}>
      <SwitchControl defaultChecked label="Source" size="large" value="source" />
      <SwitchControl label="Output" size="large" value="output" />
    </Switch>
  );
}
