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

export function FieldsetErrorType96E58B0DExample() {
  const [message, setMessage] = useState("");
  return (
    <Fieldset type="error">
      <FieldsetContent>
        <FieldsetTitle>Payment Failed</FieldsetTitle>
        <FieldsetSubtitle>
          Your payment method was declined. Please update your billing information to continue using
          the service.
        </FieldsetSubtitle>
      </FieldsetContent>
      <FieldsetFooter>
        <FieldsetFooterStatus>
          <span>Payment failed on February 10, 2026</span>
        </FieldsetFooterStatus>
        <FieldsetFooterActions>
          <FieldsetFooterAction type="secondary" onClick={() => setMessage("Support request opened")}>Contact Support</FieldsetFooterAction>
          <FieldsetFooterAction onClick={() => setMessage("Payment update requested")}>Update Payment Method</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
      <span role="status" aria-live="polite" className="sr-only">{message}</span>
    </Fieldset>
  );
}
