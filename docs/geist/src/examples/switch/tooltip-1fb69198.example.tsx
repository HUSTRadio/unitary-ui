import { Switch, SwitchControl } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";

export function SwitchTooltip1FB69198Example() {
  return (
    <Switch name="view-mode">
      <Tooltip text="View Source">
        <SwitchControl defaultChecked label="Source" size="large" value="source" />
      </Tooltip>
      <Tooltip text="View Output">
        <SwitchControl label="Output" size="large" value="output" />
      </Tooltip>
    </Switch>
  );
}
