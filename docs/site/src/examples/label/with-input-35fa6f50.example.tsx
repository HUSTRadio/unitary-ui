import { Input } from "@hustradio/unitary-ui";
import { Label } from "@hustradio/unitary-ui";

export function LabelWithInput35FA6F50Example() {
  return (
    <div className="flex w-full max-w-sm flex-col">
      <Label id="label-input" value="Email Address" />
      <Input
        aria-labelledby="label-input"
        id="label-input"
        placeholder="Enter email address..."
      />
    </div>
  );
}
