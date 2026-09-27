import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

export function ComboboxCustomWidthInputC898F7ADExample() {
  return (
    <Combobox aria-label="Search" placeholder="Search..." width={256}>
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a">One</ComboboxOption>
        <ComboboxOption value="b">Two</ComboboxOption>
        <ComboboxOption value="c">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
