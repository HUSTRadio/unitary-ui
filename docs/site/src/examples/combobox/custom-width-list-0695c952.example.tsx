import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

export function ComboboxCustomWidthList0695C952Example() {
  return (
    <Combobox aria-label="Search" placeholder="Search..." width={256}>
      <ComboboxInput />
      <ComboboxList maxWidth={500}>
        <ComboboxOption value="a">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua.
        </ComboboxOption>
        <ComboboxOption value="b">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur.
        </ComboboxOption>
        <ComboboxOption value="c">
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
          id est laborum.
        </ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
