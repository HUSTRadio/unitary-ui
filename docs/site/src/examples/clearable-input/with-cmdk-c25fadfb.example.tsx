import { ClearableInput } from "@hustradio/unitary-ui";
import { useState } from "react";

export function ClearableInputWithCmdkC25FADFBExample() {
  const [value, setValue] = useState("");

  return (
    <ClearableInput
      aria-label="Search with cmdk"
      cmdk
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Search..."
      value={value}
    />
  );
}
