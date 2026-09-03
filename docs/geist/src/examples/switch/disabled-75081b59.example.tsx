import { Switch, SwitchControl } from "@/components/ui/switch";

export function SwitchDisabled75081B59Example() {
  return (
    <div className="flex w-full max-w-md flex-col items-start">
      <Switch name="reference-view-mode">
        <SwitchControl defaultChecked disabled label="Source" value="source" />
        <SwitchControl disabled label="Output" value="output" />
      </Switch>
    </div>
  );
}
