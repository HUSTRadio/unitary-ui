import { useState } from "react";
import { ImportMapper, type ImportField, type ImportMapping } from "@hustradio/unitary-ui";

const source = {
  columns: ["Full name", "Mail", "Remark"],
  records: [
    ["Ada Lovelace", "ada@example.com", "first batch"],
    ["Grace Hopper", "grace@example.com", "first batch"],
    ["Alan Turing", "alan@example.com", "second batch"],
    ["Barbara Liskov", "barbara@example.com", ""],
    ["Edsger Dijkstra", "edsger@example.com", "second batch"],
    ["Ken Thompson", "ken@example.com", ""],
  ],
};

const fields: ImportField[] = [
  { id: "name", label: "Name", required: true },
  { id: "email", label: "Email", required: true },
  { id: "note", label: "Note" },
];

export function ImportMapperMapping3C7F0A15Example() {
  const [mapping, setMapping] = useState<ImportMapping>({ name: 0, email: 1 });
  const [imported, setImported] = useState<number | null>(null);

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <ImportMapper
        title="Import contacts"
        source={source}
        fields={fields}
        mapping={mapping}
        onMappingChange={(next) => setMapping(next)}
        onSubmit={(rows) => setImported(rows.length)}
        previewLimit={4}
      />
      {imported !== null ? (
        <p data-demo-status className="text-copy-13 text-gray-700">
          Imported {imported} rows.
        </p>
      ) : null}
    </div>
  );
}
