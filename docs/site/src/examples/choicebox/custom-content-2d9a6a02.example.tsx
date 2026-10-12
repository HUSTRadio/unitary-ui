import { Badge } from "@hustradio/unitary-ui";
import { ChoiceboxGroup, ChoiceboxGroupItem } from "@hustradio/unitary-ui";
import { useState } from "react";

export function ChoiceboxCustomContent2D9A6A02Example() {
  const [value, setValue] = useState("trial");

  return (
    <ChoiceboxGroup
      label="select a plan"
      listClassName="flex-row"
      onChange={setValue}
      type="radio"
      value={value}
    >
      <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial">
        <div className="flex justify-center p-2">
          <Badge variant="trial">Trial</Badge>
        </div>
      </ChoiceboxGroupItem>
      <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro">
        <div className="flex justify-center p-2">
          <Badge variant="blue">Pro</Badge>
        </div>
      </ChoiceboxGroupItem>
    </ChoiceboxGroup>
  );
}
