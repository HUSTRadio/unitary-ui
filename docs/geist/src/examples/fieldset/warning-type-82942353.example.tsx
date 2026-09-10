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
} from "@/components/ui/fieldset";

export function FieldsetWarningType82942353Example() {
  const [message, setMessage] = useState("");
  return (
    <Fieldset type="warning">
      <FieldsetContent>
        <FieldsetTitle>Trial Ending Soon</FieldsetTitle>
        <FieldsetSubtitle>
          Your trial period will end in 3 days. Add a payment method to continue accessing premium
          features without interruption.
        </FieldsetSubtitle>
      </FieldsetContent>
      <FieldsetFooter>
        <FieldsetFooterStatus>
          <span>Trial expires: February 13, 2026</span>
        </FieldsetFooterStatus>
        <FieldsetFooterActions>
          <FieldsetFooterAction type="secondary" onClick={() => setMessage("Reminder scheduled")}>Remind Me Later</FieldsetFooterAction>
          <FieldsetFooterAction onClick={() => setMessage("Payment method flow opened")}>Add Payment Method</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
      <span role="status" aria-live="polite" className="sr-only">{message}</span>
    </Fieldset>
  );
}
