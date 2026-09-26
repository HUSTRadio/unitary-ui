import { Switch, SwitchControl } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";

export function SwitchTooltip20F12289Example() {
  return (
    <div className="flex w-full max-w-md flex-col items-start">
      <Switch name="reference-tooltip">
        <Tooltip text="View Source">
          <SwitchControl defaultChecked label="Source" size="large" value="source" />
        </Tooltip>
        <Tooltip text="View Output">
          <SwitchControl label="Output" size="large" value="output" />
        </Tooltip>
      </Switch>
    </div>
  );
}
