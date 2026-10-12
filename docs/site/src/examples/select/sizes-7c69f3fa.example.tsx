import { Select, SelectItem } from "@hustradio/unitary-ui";

export function SelectSizes7C69F3FAExample() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
      <Select aria-label="Small" placeholder="Small" size="small">
        <SelectItem value="option-1">Option 1</SelectItem>
        <SelectItem value="option-2">Option 2</SelectItem>
        <SelectItem value="option-3">Option 3</SelectItem>
      </Select>
      <Select aria-label="Default" placeholder="Default">
        <SelectItem value="option-1">Option 1</SelectItem>
        <SelectItem value="option-2">Option 2</SelectItem>
        <SelectItem value="option-3">Option 3</SelectItem>
      </Select>
      <Select aria-label="Large" placeholder="Large" size="large">
        <SelectItem value="option-1">Option 1</SelectItem>
        <SelectItem value="option-2">Option 2</SelectItem>
        <SelectItem value="option-3">Option 3</SelectItem>
      </Select>
    </div>
  );
}
