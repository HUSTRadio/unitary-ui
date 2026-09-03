import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { useState } from "react";

export function ComboboxClearable258DDE0FExample() {
  const [value, setValue] = useState("two");

  return (
    <Combobox aria-label="Search" clearable onValueChange={setValue} placeholder="Search..." value={value}>
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="one">One</ComboboxOption>
        <ComboboxOption value="two">Two</ComboboxOption>
        <ComboboxOption value="three">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
