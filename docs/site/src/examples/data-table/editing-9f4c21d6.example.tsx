import { useState } from "react";
import { DataTable, type DataTableCellChange, type DataTableColumn } from "@hustradio/unitary-ui";

interface Row {
  id: string;
  name: string;
  note: string;
}

const initial: Row[] = [
  { id: "a", name: "Import contacts", note: "ready" },
  { id: "b", name: "Sync repository", note: "waiting" },
  { id: "c", name: "Upload artifacts", note: "" },
  { id: "d", name: "Notify reviewers", note: "queued" },
];

export function DataTableEditing9F4C21D6Example() {
  const [rows, setRows] = useState<Row[]>(initial);
  const [saved, setSaved] = useState(0);

  const onCellChange = ({ rowKey, columnId, value }: DataTableCellChange<Row>) => {
    setRows((previous) =>
      previous.map((row) => (row.id === String(rowKey) ? { ...row, [columnId]: value } : row)),
    );
    setSaved((count) => count + 1);
  };

  const columns: DataTableColumn<Row>[] = [
    { id: "name", header: "Task", cell: (row) => row.name },
    {
      id: "note",
      header: "Note (double-click)",
      cell: (row) => row.note || "—",
      editable: true,
      getValue: (row) => row.note,
      validate: (value) => (value.trim().length === 0 ? "Note is required" : null),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-3">
      <DataTable<Row>
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        onCellChange={onCellChange}
        colorScheme="striped"
        headerRow
      />
      <p data-demo-status className="text-copy-13 text-gray-700">
        Saved {saved} {saved === 1 ? "change" : "changes"}.
      </p>
    </div>
  );
}
