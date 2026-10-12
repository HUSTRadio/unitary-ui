import { Combobox, ComboboxInput, ComboboxList } from "@hustradio/unitary-ui";

export function ComboboxCustomEmptyMessage1DAF4719Example() {
  return (
    <Combobox aria-label="Search" placeholder="Search..." width={256}>
      <ComboboxInput />
      <ComboboxList emptyMessage="Nothing to see here..." />
    </Combobox>
  );
}
