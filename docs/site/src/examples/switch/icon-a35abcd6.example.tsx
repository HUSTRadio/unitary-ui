import { LayoutGrid, List } from "lucide-react";
import { Switch, SwitchControl } from "@hustradio/unitary-ui";

export function SwitchIconA35ABCD6Example() {
  return (
    <div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="reference-icons-small" size="small">
          <SwitchControl
            defaultChecked
            icon={<LayoutGrid />}
            label="Source"
            value="source"
          />
          <SwitchControl icon={<List />} label="Output" value="output" />
        </Switch>
      </div>
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="reference-icons-default">
          <SwitchControl
            defaultChecked
            icon={<LayoutGrid />}
            label="Source"
            value="source"
          />
          <SwitchControl icon={<List />} label="Output" value="output" />
        </Switch>
      </div>
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="reference-icons-large" size="large">
          <SwitchControl
            defaultChecked
            icon={<LayoutGrid />}
            label="Source"
            value="source"
          />
          <SwitchControl icon={<List />} label="Output" value="output" />
        </Switch>
      </div>
    </div>
  );
}
