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

export function FieldsetWithLongContent39C2ED17Example() {
  const [message, setMessage] = useState("");
  return (
    <Fieldset>
      <FieldsetContent>
        <FieldsetTitle>Privacy Policy</FieldsetTitle>
        <FieldsetSubtitle>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat, nunc vel
          ultrices sollicitudin, dolor eros volutpat ex, et sagittis sem enim in eros. Curabitur eu
          consequat neque, non finibus odio. Donec vitae tellus eu mauris feugiat efficitur.
          Maecenas blandit sit amet tellus vel blandit. Phasellus ultrices vulputate arcu, vel
          dictum erat facilisis et.
        </FieldsetSubtitle>
      </FieldsetContent>
      <FieldsetFooter>
        <FieldsetFooterStatus>
          <span>Last updated: March 10, 2025</span>
        </FieldsetFooterStatus>
        <FieldsetFooterActions>
          <FieldsetFooterAction type="secondary" onClick={() => setMessage("Privacy policy declined")}>Decline</FieldsetFooterAction>
          <FieldsetFooterAction onClick={() => setMessage("Privacy policy accepted")}>Accept</FieldsetFooterAction>
        </FieldsetFooterActions>
      </FieldsetFooter>
      <span role="status" aria-live="polite" className="sr-only">{message}</span>
    </Fieldset>
  );
}
