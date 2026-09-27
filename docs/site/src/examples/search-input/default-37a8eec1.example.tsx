import { SearchInput } from "@/components/ui/search-input";
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
