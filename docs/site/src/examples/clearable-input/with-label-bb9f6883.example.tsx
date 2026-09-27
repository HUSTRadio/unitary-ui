import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

export function ClearableInputWithLabelBB9F6883Example() {
  const [value, setValue] = useState("");

  return (
    <ClearableInput
      label="Email"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter your email..."
      value={value}
    />
  );
}
