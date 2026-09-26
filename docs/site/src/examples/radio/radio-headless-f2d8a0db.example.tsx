import { useState } from "react";
import { RadioGroup, useRadio } from "@/components/ui/radio";

export function RadioRadioHeadlessF2D8A0DBExample() {
  const [value, setValue] = useState("one");

  const { component } = useRadio({ value: "one", disabled: false });

  const { component: component2 } = useRadio({ value: "two", disabled: false });

  return (
    <RadioGroup aria-label="Options" onChange={setValue} value={value}>
      <div className="flex w-full min-w-56 flex-col items-stretch justify-start gap-6">
        <label className="flex w-full items-center justify-between leading-6">
          <span className="text-copy-13 leading-6 text-foreground">Option 1</span>
          {component}
        </label>
        <label className="flex w-full items-center justify-between leading-6">
          <span className="text-copy-13 leading-6 text-foreground">Option 2</span>
          {component2}
        </label>
      </div>
    </RadioGroup>
  );
}
