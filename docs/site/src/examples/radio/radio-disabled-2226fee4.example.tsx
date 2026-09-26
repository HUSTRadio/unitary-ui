import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

export function RadioRadioDisabled2226FEE4Example() {
  return (
    <RadioGroup disabled label="Disabled Radio Example" defaultValue="one">
      <div className="flex flex-col items-stretch justify-start gap-6">
        <RadioGroupItem value="one">Option 1</RadioGroupItem>
        <RadioGroupItem value="two">Option 2</RadioGroupItem>
      </div>
    </RadioGroup>
  );
}
