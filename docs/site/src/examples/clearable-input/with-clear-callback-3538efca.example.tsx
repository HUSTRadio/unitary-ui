import { ClearableInput } from "@hustradio/unitary-ui";
import { useState } from "react";

export function ClearableInputWithClearCallback3538EFCAExample() {
  const [value, setValue] = useState("");

  const [clearCount, setClearCount] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <ClearableInput
        aria-label="Clearable input with callback"
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onClear={() => {
          setClearCount((prev) => prev + 1);
        }}
        placeholder="Enter some text and clear..."
        value={value}
      />
      <p className="text-copy-14 text-muted-foreground">Cleared {clearCount} times</p>
    </div>
  );
}
