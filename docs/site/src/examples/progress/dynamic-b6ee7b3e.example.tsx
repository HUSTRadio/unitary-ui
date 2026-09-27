import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

export function ProgressDynamicB6EE7B3EExample() {
  const [value, setValue] = useState(40);

  const [animated, setAnimated] = useState(true);

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6">
      <Progress
        value={value}
        label={`${value}%`}
        labelPosition="right"
        animated={animated}
        aria-label="Dynamic progress"
      />
      <div className="flex gap-2">
        <Button type="default" size="small" onClick={() => setValue((v) => Math.min(100, v + 10))}>
          Increase
        </Button>
        <Button type="secondary" size="small" onClick={() => setValue((v) => Math.max(0, v - 10))}>
          Decrease
        </Button>
      </div>
      <label className="flex items-center gap-2">
        <Toggle checked={animated} onChange={() => setAnimated((v) => !v)} size="small" aria-label="Animated transition" />
        <span className="text-label-13 text-muted-foreground">Animated transition</span>
      </label>
    </div>
  );
}
