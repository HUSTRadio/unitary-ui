import { RadioGroup, RadioGroupItem } from "@hustradio/unitary-ui";
import { useState } from "react";

export function RadioDefault37A8EEC1Example() {
  const [value, setValue] = useState("one");

  return (
    <RadioGroup label="Default Radio Example" onChange={setValue} value={value}>
      <div className="flex flex-col items-stretch justify-start gap-6">
        <RadioGroupItem value="one">Option 1</RadioGroupItem>
        <RadioGroupItem value="two">Option 2</RadioGroupItem>
      </div>
    </RadioGroup>
  );
}
