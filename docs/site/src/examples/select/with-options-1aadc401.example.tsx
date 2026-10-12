import { Select, SelectItem } from "@hustradio/unitary-ui";

export function SelectWithOptions1AADC401Example() {
  return (
    <Select className="w-56" defaultValue="banana" aria-label="Select fruit">
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="grape">Grape</SelectItem>
    </Select>
  );
}
