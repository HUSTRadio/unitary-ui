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
} from "@hustradio/unitary-ui";

export function FieldsetDefault37A8EEC1Example() {
  const [message, setMessage] = useState("");
  return (
    <Fieldset>
      <FieldsetContent>
        <FieldsetTitle>Account Settings</FieldsetTitle>
        <FieldsetSubtitle>Manage your account preferences and settings</FieldsetSubtitle>
      </FieldsetContent>
      <FieldsetFooter>
        <FieldsetFooterStatus>
          <span>
            Need help?{" "}
            <a href="#/components/fieldset" className="cursor-pointer text-link hover:underline">
              View documentation
            </a>
          </span>
        </FieldsetFooterStatus>
        <FieldsetFooterActions>
          <FieldsetFooterAction onClick={() => setMessage("Changes saved")}>Save Changes</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
      <span role="status" aria-live="polite" className="sr-only">{message}</span>
    </Fieldset>
  );
}
