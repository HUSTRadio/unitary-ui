import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

export function ChoiceboxMultiSelect294DCC0FExample() {
  const [value, setValue] = useState([] as string[]);

  return (
    <ChoiceboxGroup
      label="select a plan"
      listClassName="flex-row"
      onChange={setValue}
      type="checkbox"
      value={value}
    >
      <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
      <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
    </ChoiceboxGroup>
  );
}
