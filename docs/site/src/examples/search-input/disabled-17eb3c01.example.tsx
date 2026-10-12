import { SearchInput } from "@hustradio/unitary-ui";
import { useState } from "react";

export function SearchInputDisabled17EB3C01Example() {
  const [value, setValue] = useState("");

  return (
    <SearchInput
      aria-label="Search"
      cmdk
      disabled
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
