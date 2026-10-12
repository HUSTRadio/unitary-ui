import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@hustradio/unitary-ui";
import { Triangle } from "lucide-react";

export function ComboboxWithPrefixIcons033AD1CBExample() {
  return (
    <Combobox aria-label="Search" className="w-fit" placeholder="Search...">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a" prefix={<Triangle className="size-4" aria-hidden />}>
          One
        </ComboboxOption>
        <ComboboxOption value="b" prefix={<Triangle className="size-4" aria-hidden />}>
          Two
        </ComboboxOption>
        <ComboboxOption value="c" prefix={<Triangle className="size-4" aria-hidden />}>
          Three
        </ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
