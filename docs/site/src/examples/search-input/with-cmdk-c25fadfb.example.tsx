import { SearchInput } from "@hustradio/unitary-ui";
import { useState } from "react";

export function SearchInputWithCmdkC25FADFBExample() {
  const [value, setValue] = useState("");

  return (
    <SearchInput
      aria-label="Search"
      cmdk
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
