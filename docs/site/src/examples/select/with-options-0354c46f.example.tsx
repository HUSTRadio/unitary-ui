import { Select, SelectItem } from "@hustradio/unitary-ui";

export function SelectWithOptions0354C46FExample() {
  return (
    <>
    <Select aria-label="Fruit" placeholder="Select a fruit">
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="grape">Grape</SelectItem>
    </Select>
    <Select aria-label="Fruit with default value" defaultValue="banana" placeholder="With default value">
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="grape">Grape</SelectItem>
    </Select>
    </>
  );
}
