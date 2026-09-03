import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

export function ChoiceboxDisabled17EB3C01Example() {
  const [value, setValue] = useState("");

  const [value2, setValue2] = useState([] as string[]);

  return (
    <div className="flex flex-col items-stretch justify-start gap-6">
      <ChoiceboxGroup
        disabled
        label="Choicebox group disabled"
        listClassName="flex-row"
        onChange={setValue}
        showLabel
        type="radio"
        value={value}
      >
        <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
        <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
      </ChoiceboxGroup>

      <ChoiceboxGroup
        label="Single input disabled"
        listClassName="flex-row"
        onChange={setValue2}
        showLabel
        type="checkbox"
        value={value2}
      >
        <ChoiceboxGroupItem description="Free for two weeks" disabled title="Pro Trial" value="trial" />
        <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
      </ChoiceboxGroup>
    </div>
  );
}
