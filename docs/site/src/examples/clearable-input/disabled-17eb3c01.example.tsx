import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

export function ClearableInputDisabled17EB3C01Example() {
  const [value, setValue] = useState("Some text");

  return (
    <ClearableInput
      aria-label="Disabled clearable input"
      disabled
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
