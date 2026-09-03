import { Sparkles } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { useState } from "react";

export function SearchInputCustomPrefix3441EADCExample() {
  const [value, setValue] = useState("");

  return (
    <SearchInput
      aria-label="Search"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      prefix={<Sparkles className="size-4" aria-hidden />}
      value={value}
    />
  );
}
