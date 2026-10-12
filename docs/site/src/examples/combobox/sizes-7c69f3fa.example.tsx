import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@hustradio/unitary-ui";

export function ComboboxSizes7C69F3FAExample() {
  const options = [
    { value: "a", label: "One" },
    { value: "b", label: "Two" },
    { value: "c", label: "Three" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-start gap-4 flex-initial">
      <Combobox aria-label="Search" placeholder="Search..." size="small" className="w-[235px]">
        <ComboboxInput />
        <ComboboxList>
          {options.map((option) => (
            <ComboboxOption key={option.value} value={option.value}>
              {option.label}
            </ComboboxOption>
          ))}
        </ComboboxList>
      </Combobox>

      <Combobox aria-label="Search" placeholder="Search..." className="w-[235px]">
        <ComboboxInput />
        <ComboboxList>
          {options.map((option) => (
            <ComboboxOption key={option.value} value={option.value}>
              {option.label}
            </ComboboxOption>
          ))}
        </ComboboxList>
      </Combobox>

      <Combobox aria-label="Search" placeholder="Search..." size="large" className="w-[257px]">
        <ComboboxInput />
        <ComboboxList>
          {options.map((option) => (
            <ComboboxOption key={option.value} value={option.value}>
              {option.label}
            </ComboboxOption>
          ))}
        </ComboboxList>
      </Combobox>
    </div>
  );
}
