import { Input } from "@hustradio/unitary-ui";
import { Label } from "@hustradio/unitary-ui";

export function LabelBypassCasingB8D7E5E0Example() {
  return (
    <div className="flex w-full max-w-sm flex-col">
      <Label bypassCasing id="label-input-bypass" value="Email address" />
      <Input
        aria-labelledby="label-input-bypass"
        id="label-input-bypass"
        placeholder="Enter email address..."
      />
    </div>
  );
}
