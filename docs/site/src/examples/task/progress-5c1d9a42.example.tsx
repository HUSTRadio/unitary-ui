import { useState } from "react";
import { Button, Task, createTaskState, taskReducer } from "@hustradio/unitary-ui";

export function TaskProgress5C1D9A42Example() {
  const [state, setState] = useState(createTaskState({ status: "running", progress: 0.35, attempts: 1 }));

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Task
        status={state.status}
        progress={state.progress}
        title="Import contacts"
        description={
          state.status === "failed"
            ? (state.error ?? "Upload failed.")
            : state.status === "succeeded"
              ? "12 contacts imported."
              : "Reads a CSV from your device and uploads it in batches."
        }
        stage={state.status === "running" ? `Uploading ${Math.round(state.progress * 12)} of 12` : undefined}
        onCancel={state.status === "running" ? () => setState((current) => taskReducer(current, { type: "fail", error: "Canceled." })) : undefined}
        onRetry={
          state.status === "failed" || state.status === "partial"
            ? () => setState((current) => taskReducer(current, { type: "start" }))
            : undefined
        }
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="secondary"
          size="small"
          disabled={state.status !== "running"}
          onClick={() => setState((current) => taskReducer(current, { type: "progress", value: current.progress + 0.2 }))}
        >
          Advance
        </Button>
        <Button
          type="tertiary"
          size="small"
          disabled={state.status !== "running"}
          onClick={() => setState((current) => taskReducer(current, { type: "succeed" }))}
        >
          Finish
        </Button>
        <Button type="tertiary" size="small" onClick={() => setState(createTaskState({ status: "running", progress: 0, attempts: 1 }))}>
          Restart
        </Button>
      </div>
    </div>
  );
}
