import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { Triangle } from "lucide-react";

export function ComboboxWithSuffixIcons025A8424Example() {
  return (
    <Combobox aria-label="Search" className="w-fit" placeholder="Search...">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a" suffix={<Triangle className="size-4" aria-hidden />}>
          One
        </ComboboxOption>
        <ComboboxOption value="b" suffix={<Triangle className="size-4" aria-hidden />}>
          Two
        </ComboboxOption>
        <ComboboxOption value="c" suffix={<Triangle className="size-4" aria-hidden />}>
          Three
        </ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
