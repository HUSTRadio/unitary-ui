import { Switch, SwitchControl } from "@/components/ui/switch";

export function SwitchDefault37A8EEC1Example() {
  return (
    <Switch name="default">
      <SwitchControl defaultChecked label="Source" value="source" />
      <SwitchControl label="Output" value="output" />
    </Switch>
  );
}
