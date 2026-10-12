import { ClearableInput } from "@hustradio/unitary-ui";
import { useState } from "react";

export function ClearableInputDefault37A8EEC1Example() {
  const [value, setValue] = useState("");

  return (
    <ClearableInput
      aria-label="Demo clearable input"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
