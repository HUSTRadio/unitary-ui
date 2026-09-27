import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { useState } from "react";

export function RadioRadioDisabled234336B0Example() {
  const [value, setValue] = useState("one");

  return (
    <RadioGroup disabled label="Disabled Radio Example" onChange={setValue} value={value}>
      <div className="flex flex-col items-stretch justify-start gap-6">
        <RadioGroupItem value="one">Option 1</RadioGroupItem>
        <RadioGroupItem value="two">Option 2</RadioGroupItem>
      </div>
    </RadioGroup>
  );
}
