import { useState } from "react";
import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
  WarningText,
} from "@/components/ui/fieldset";

export function FieldsetWithWarningText16633F67Example() {
  const [message, setMessage] = useState("");
  return (
    <Fieldset>
      <FieldsetContent>
        <FieldsetTitle>Database Settings</FieldsetTitle>
        <FieldsetSubtitle>Configure your database connection parameters</FieldsetSubtitle>
        <div className="mt-4">
          <WarningText>
            Changing these settings will require a restart of your application. Make sure to save
            any pending work.
          </WarningText>
        </div>
      </FieldsetContent>
      <FieldsetFooter>
        <FieldsetFooterStatus>
          <span>Current status: Connected</span>
        </FieldsetFooterStatus>
        <FieldsetFooterActions>
          <FieldsetFooterAction type="secondary" onClick={() => setMessage("Changes canceled")}>Cancel</FieldsetFooterAction>
          <FieldsetFooterAction onClick={() => setMessage("Changes applied")}>Apply Changes</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
      <span role="status" aria-live="polite" className="sr-only">{message}</span>
    </Fieldset>
  );
}
