import { Slider } from "@hustradio/unitary-ui";
import { useState } from "react";

export function SliderRangeWithInputs16EAD947Example() {
  const [value, setValue] = useState([50, 75]);

  return (
    <Slider showStartInput showEndInput value={value} onValueChange={setValue} aria-label="Range" />
  );
}
