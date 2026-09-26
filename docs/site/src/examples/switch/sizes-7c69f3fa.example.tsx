import { Switch, SwitchControl } from "@/components/ui/switch";

export function SwitchSizes7C69F3FAExample() {
  return (
    <div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="sizes-small" size="small">
          <SwitchControl defaultChecked label="Source" value="source" />
          <SwitchControl label="Output" value="output" />
        </Switch>
      </div>
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="sizes-default">
          <SwitchControl defaultChecked label="Source" value="source" />
          <SwitchControl label="Output" value="output" />
        </Switch>
      </div>
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="sizes-large" size="large">
          <SwitchControl defaultChecked label="Source" value="source" />
          <SwitchControl label="Output" value="output" />
        </Switch>
      </div>
    </div>
  );
}
