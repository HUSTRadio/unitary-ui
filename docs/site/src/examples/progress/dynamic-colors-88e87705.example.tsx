import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function ProgressDynamicColors88E87705Example() {
  const [value, setValue] = useState(0);

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6">
      <Progress
        value={value}
        label={`${value}%`}
        labelPosition="right"
        aria-label="Dynamic colors progress"
        colors={{
          0: "var(--color-gray-1000)",
          25: "var(--color-destructive)",
          50: "var(--color-warning)",
          75: "#ff0080",
          100: "var(--color-progress)",
        }}
      />
      <div className="flex gap-2">
        <Button type="default" size="small" onClick={() => setValue((v) => Math.min(100, v + 10))}>
          Increase
        </Button>
        <Button type="secondary" size="small" onClick={() => setValue((v) => Math.max(0, v - 10))}>
          Decrease
        </Button>
      </div>
    </div>
  );
}
