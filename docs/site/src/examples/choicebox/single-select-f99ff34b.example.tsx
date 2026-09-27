import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

export function ChoiceboxSingleSelectF99FF34BExample() {
  const [value, setValue] = useState("trial");

  return (
    <ChoiceboxGroup
      label="select a plan"
      listClassName="flex-row"
      onChange={setValue}
      type="radio"
      value={value}
    >
      <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
      <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
    </ChoiceboxGroup>
  );
}
