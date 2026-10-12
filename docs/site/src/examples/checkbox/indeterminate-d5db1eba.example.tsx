import { Checkbox } from "@hustradio/unitary-ui";

export function CheckboxIndeterminateD5DB1EBAExample() {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox indeterminate aria-label="Indeterminate" />
        <span className="text-copy-14 text-foreground">Indeterminate (partial selection)</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox checked readOnly aria-label="Checked" />
        <span className="text-copy-14 text-muted-foreground">Checked</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox aria-label="Unchecked" />
        <span className="text-copy-14 text-muted-foreground">Unchecked</span>
      </label>
    </div>
  );
}
