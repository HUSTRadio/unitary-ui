import { Radio } from "@/components/ui/radio";
import { useState } from "react";

export function RadioRadioStandalone6B4C2AB0Example() {
  const [value, setValue] = useState("one");

  return (
    <li className="flex w-full items-center gap-2">
      <span className="text-base leading-6 text-foreground">Option 1</span>
      <Radio
        aria-label="Option 1"
        checked={value === "one"}
        onChange={() => setValue("one")}
        value="one"
      />
    </li>
  );
}
