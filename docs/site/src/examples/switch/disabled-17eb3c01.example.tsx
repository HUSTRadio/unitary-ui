import { Switch, SwitchControl } from "@hustradio/unitary-ui";

export function SwitchDisabled17EB3C01Example() {
  return (
    <Switch name="view-mode">
      <SwitchControl defaultChecked disabled label="Source" value="source" />
      <SwitchControl disabled label="Output" value="output" />
    </Switch>
  );
}
