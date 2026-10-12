import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@hustradio/unitary-ui";

export function ComboboxErrored138BB025Example() {
  return (
    <Combobox aria-label="Search" errored placeholder="Search...">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a">One</ComboboxOption>
        <ComboboxOption value="b">Two</ComboboxOption>
        <ComboboxOption value="c">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
