import { Switch, SwitchControl } from "@/components/ui/switch";

export function SwitchSizes74A3978DExample() {
  return (
    <div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="reference-sizes-small" size="small">
          <SwitchControl defaultChecked label="Source" value="source" />
          <SwitchControl label="Output" value="output" />
        </Switch>
      </div>
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="reference-sizes-default">
          <SwitchControl defaultChecked label="Source" value="source" />
          <SwitchControl label="Output" value="output" />
        </Switch>
      </div>
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="reference-sizes-large" size="large">
          <SwitchControl defaultChecked label="Source" value="source" />
          <SwitchControl label="Output" value="output" />
        </Switch>
      </div>
    </div>
  );
}
