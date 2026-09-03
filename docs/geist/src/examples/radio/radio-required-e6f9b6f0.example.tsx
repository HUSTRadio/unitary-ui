import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { useState } from "react";

export function RadioRadioRequiredE6F9B6F0Example() {
  const [value, setValue] = useState("");

  return (
    <form className="flex flex-col items-start justify-start gap-6">
      <RadioGroup label="Required Radio Example" onChange={setValue} required value={value}>
        <div className="flex flex-col items-stretch justify-start gap-4">
          <RadioGroupItem value="one">Option 1</RadioGroupItem>
          <RadioGroupItem value="two">Option 2</RadioGroupItem>
        </div>
      </RadioGroup>
      <Button size="small" typeName="submit">
        Submit
      </Button>
    </form>
  );
}
