import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxDisabled17EB3C01Example() {
  return (
    <div className="flex flex-col items-stretch justify-start gap-4">
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox checked readOnly disabled>Disabled Checked</Checkbox>
      <Checkbox disabled indeterminate>Disabled Indeterminate</Checkbox>
    </div>
  );
}
