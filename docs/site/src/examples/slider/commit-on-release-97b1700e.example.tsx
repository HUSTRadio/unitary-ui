import { Slider } from "@hustradio/unitary-ui";
import { useState } from "react";

export function SliderCommitOnRelease97B1700EExample() {
  const [committed, setCommitted] = useState<number | null>(null);

  return (
    <>
    <Slider
      label="Drag then release"
      defaultValue={[50]}
      onValueCommit={(value) => setCommitted(value[0] ?? null)}
    />
    <p className="mt-2 text-copy-13 text-muted-foreground">
      Last committed: {committed === null ? "—" : committed}
    </p>
    </>
  );
}
