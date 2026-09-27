import { Combobox, ComboboxInput, ComboboxList } from "@/components/ui/combobox";

export function ComboboxCustomEmptyMessage1DAF4719Example() {
  return (
    <Combobox aria-label="Search" placeholder="Search..." width={256}>
      <ComboboxInput />
      <ComboboxList emptyMessage="Nothing to see here..." />
    </Combobox>
  );
}
