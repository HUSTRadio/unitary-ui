import { Switch, SwitchControl } from "@hustradio/unitary-ui";
import { Tooltip } from "@hustradio/unitary-ui";

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
