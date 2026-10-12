import { Checkbox } from "@hustradio/unitary-ui";
import { useState } from "react";

export function CheckboxDefault37A8EEC1Example() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox checked={checked} onChange={(): void => setChecked((b) => !b)}>
      Option 1
    </Checkbox>
  );
}
