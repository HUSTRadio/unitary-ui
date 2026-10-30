import { useState } from "react";
import { Button, LogView, type LogEntry } from "@hustradio/unitary-ui";

const seed: LogEntry[] = Array.from({ length: 40 }, (_, index) => {
  const step = index + 1;
  const level = step % 7 === 0 ? "error" : step % 4 === 0 ? "warn" : step % 3 === 0 ? "debug" : "info";
  return {
    id: String(step),
    level,
    time: `10:00:${String(step).padStart(2, "0")}`,
    message: level === "error" ? `request ${step} failed: upstream timeout` : `request ${step} completed`,
  } as LogEntry;
});

export function LogViewFollowA17B53C9Example() {
  const [entries, setEntries] = useState(seed);

  const append = () =>
    setEntries((previous) => {
      const step = previous.length + 1;
      return [
        ...previous,
        {
          id: String(step),
          level: step % 5 === 0 ? "error" : "info",
          time: `10:00:${String(step).padStart(2, "0")}`,
          message: step % 5 === 0 ? `request ${step} failed: upstream timeout` : `request ${step} completed`,
        },
      ];
    });

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button type="secondary" size="small" onClick={append}>
          Append log
        </Button>
        <Button type="tertiary" size="small" onClick={() => setEntries(seed)}>
          Reset
        </Button>
      </div>
      <LogView
        entries={entries}
        title="Build log"
        height={200}
        emptyLabel="No build output yet"
        onExport={(text) => {
          void text;
        }}
      />
    </div>
  );
}
