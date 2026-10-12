import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@hustradio/unitary-ui";
import { useState } from "react";

export function ComboboxControlled71AD7238Example() {
  const [value, setValue] = useState("b");

  return (
    <Combobox aria-label="Search" onValueChange={setValue} placeholder="Search..." value={value}>
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a">One</ComboboxOption>
        <ComboboxOption value="b">Two</ComboboxOption>
        <ComboboxOption value="c">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
