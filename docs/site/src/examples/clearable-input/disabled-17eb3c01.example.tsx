import { ClearableInput } from "@hustradio/unitary-ui";
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
