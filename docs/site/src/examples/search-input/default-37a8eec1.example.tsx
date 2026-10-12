import { SearchInput } from "@hustradio/unitary-ui";
import { useState } from "react";

export function SearchInputDefault37A8EEC1Example() {
  const [value, setValue] = useState("");

  return (
    <SearchInput
      aria-label="Search"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
