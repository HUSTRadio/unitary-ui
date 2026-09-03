import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

export function ComboboxDisabled17EB3C01Example() {
  return (
    <Combobox aria-label="Search" disabled placeholder="Search...">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a">One</ComboboxOption>
        <ComboboxOption value="b">Two</ComboboxOption>
        <ComboboxOption value="c">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
