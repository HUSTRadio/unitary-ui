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

export function FieldsetMultipleFieldsets9DD2DFF4Example() {
  const [message, setMessage] = useState("");
  return (
    <div className="flex flex-col gap-6">
      <Fieldset>
        <FieldsetContent>
          <FieldsetTitle>Personal Information</FieldsetTitle>
          <FieldsetSubtitle>Update your name and contact details</FieldsetSubtitle>
        </FieldsetContent>
        <FieldsetFooter>
          <FieldsetFooterStatus>
            <span>This information will be publicly visible</span>
          </FieldsetFooterStatus>
          <FieldsetFooterActions>
            <FieldsetFooterAction onClick={() => setMessage("Profile updated")}>Update</FieldsetFooterAction>
          </FieldsetFooterActions>
        </FieldsetFooter>
      </Fieldset>

      <Fieldset>
        <FieldsetContent>
          <FieldsetTitle>Security</FieldsetTitle>
          <FieldsetSubtitle>Manage your password and authentication methods</FieldsetSubtitle>
        </FieldsetContent>
        <FieldsetFooter>
          <FieldsetFooterStatus>
            <span>Last password change: 30 days ago</span>
          </FieldsetFooterStatus>
          <FieldsetFooterActions>
            <FieldsetFooterAction onClick={() => setMessage("Password change requested")}>Change Password</FieldsetFooterAction>
          </FieldsetFooterActions>
        </FieldsetFooter>
      </Fieldset>

      <Fieldset>
        <FieldsetContent disabled>
          <FieldsetTitle>API Access</FieldsetTitle>
          <FieldsetSubtitle>
            Generate and manage API tokens for programmatic access
          </FieldsetSubtitle>
        </FieldsetContent>
        <FieldsetFooter highlight>
          <FieldsetFooterStatus>
            <span>You need a Pro account to access API features.</span>
          </FieldsetFooterStatus>
        </FieldsetFooter>
      </Fieldset>
      <span role="status" aria-live="polite" className="sr-only">{message}</span>
    </div>
  );
}
