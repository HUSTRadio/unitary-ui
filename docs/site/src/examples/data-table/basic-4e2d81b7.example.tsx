import { useState } from "react";
import { Button, DataTable, type DataTableColumn } from "@hustradio/unitary-ui";

interface Artifact {
  id: string;
  name: string;
  size: string;
  updated: string;
}

const rows: Artifact[] = [
  { id: "a", name: "unitary-ui-0.1.0-beta.1.tgz", size: "1.2 MB", updated: "2 minutes ago" },
  { id: "b", name: "unitary-ui.css", size: "643 kB", updated: "2 minutes ago" },
  { id: "c", name: "types.tar.gz", size: "310 kB", updated: "5 minutes ago" },
  { id: "d", name: "fonts.zip", size: "25.2 MB", updated: "yesterday" },
];

const columns: DataTableColumn<Artifact>[] = [
  { id: "name", header: "Artifact", cell: (row) => row.name },
  { id: "size", header: "Size", cell: (row) => row.size, align: "right", width: 120 },
  { id: "updated", header: "Updated", cell: (row) => row.updated, align: "right", width: 160 },
];

type DemoState = "ready" | "loading" | "empty" | "error";

export function DataTableBasic4E2D81B7Example() {
  const [state, setState] = useState<DemoState>("ready");

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {(["ready", "loading", "empty", "error"] as DemoState[]).map((option) => (
          <Button
            key={option}
            type={state === option ? "default" : "tertiary"}
            size="tiny"
            onClick={() => setState(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <DataTable<Artifact>
        caption="Build artifacts"
        columns={columns}
        rows={state === "empty" ? [] : rows}
        getRowKey={(row) => row.id}
        colorScheme="striped"
        headerRow
        loading={state === "loading"}
        loadingRows={3}
        empty="No artifacts have been published yet."
        error={state === "error" ? "Could not load artifacts. Retry when the network recovers." : undefined}
      />
    </div>
  );
}
