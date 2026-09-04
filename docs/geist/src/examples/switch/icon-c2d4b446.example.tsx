import { Switch, SwitchControl } from "@/components/ui/switch";
import { LayoutGrid, List } from "lucide-react";

export function SwitchIconC2D4B446Example() {
  return (
    <div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="icons-small" size="small">
          <SwitchControl
            defaultChecked
            icon={<LayoutGrid aria-hidden />}
            label="Source"
            value="source"
          />
          <SwitchControl icon={<List aria-hidden />} label="Output" value="output" />
        </Switch>
      </div>
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="icons-default">
          <SwitchControl
            defaultChecked
            icon={<LayoutGrid aria-hidden />}
            label="Source"
            value="source"
          />
          <SwitchControl icon={<List aria-hidden />} label="Output" value="output" />
        </Switch>
      </div>
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="icons-large" size="large">
          <SwitchControl
            defaultChecked
            icon={<LayoutGrid aria-hidden />}
            label="Source"
            value="source"
          />
          <SwitchControl icon={<List aria-hidden />} label="Output" value="output" />
        </Switch>
      </div>
    </div>
  );
}
