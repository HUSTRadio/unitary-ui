import { Button } from "@hustradio/unitary-ui";
import { RadioGroup, RadioGroupItem } from "@hustradio/unitary-ui";

export function RadioRadioRequired0BCA93F0Example() {
  return (
    <form className="flex flex-col items-start justify-start gap-6">
      <RadioGroup label="Required Radio Example" required defaultValue="">
        <div className="flex flex-col items-stretch justify-start gap-4">
          <RadioGroupItem value="one">Option 1</RadioGroupItem>
          <RadioGroupItem value="two">Option 2</RadioGroupItem>
        </div>
      </RadioGroup>
      <Button size="small">Submit</Button>
    </form>
  );
}
