import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@hustradio/unitary-ui";

export function ComboboxWithLabelBB9F6883Example() {
  return (
    <Combobox label="Select your country" aria-label="Select your country" placeholder="Search countries…">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="us">United States</ComboboxOption>
        <ComboboxOption value="ca">Canada</ComboboxOption>
        <ComboboxOption value="uk">United Kingdom</ComboboxOption>
        <ComboboxOption value="de">Germany</ComboboxOption>
        <ComboboxOption value="fr">France</ComboboxOption>
        <ComboboxOption value="jp">Japan</ComboboxOption>
        <ComboboxOption value="au">Australia</ComboboxOption>
        <ComboboxOption value="br">Brazil</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
