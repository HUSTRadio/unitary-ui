import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LabelWithInput854C60EDExample() {
  return (
    <>
      <Label id="test-input" value="Email Address" />
      <Input aria-labelledby="test-input" id="test-input" />
    </>
  );
}
