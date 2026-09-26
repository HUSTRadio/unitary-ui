import { SearchInput } from "@/components/ui/search-input";
import { useState } from "react";

export function SearchInputLoadingB4A070A2Example() {
  const [value, setValue] = useState("Project A");

  return (
    <SearchInput
      aria-label="Search"
      loading
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
