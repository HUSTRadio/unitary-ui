import { useState } from "react";
import { Field, Input } from "@hustradio/unitary-ui";

export function FieldBasic3F9A1C7EExample() {
  const [value, setValue] = useState("");
  const error = value.includes(" ") ? "Workspace names cannot contain spaces." : "";

  return (
    <div className="w-full max-w-sm">
      <Field
        label="Workspace name"
        htmlFor="field-basic-workspace"
        description="Used in URLs and mentions."
        error={error}
      >
        <Input
          id="field-basic-workspace"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="acme"
        />
      </Field>
    </div>
  );
}
