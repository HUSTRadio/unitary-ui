import { Input } from "@hustradio/unitary-ui";

export function InputStates2F6E9DAEExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Input aria-label="Default" placeholder="Default" />
      <Input aria-label="Disabled" disabled placeholder="Disabled" />
      <Input aria-label="With value" defaultValue="unitary-docs" placeholder="With value" />
    </div>
  );
}
