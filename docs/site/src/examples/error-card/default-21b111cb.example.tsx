import { useState } from "react";
import { Button } from "@hustradio/unitary-ui";
import {
  ErrorCard,
  ErrorCardAction,
  ErrorCardDescription,
  ErrorCardTitle,
} from "@hustradio/unitary-ui";
import { Trash2 } from "lucide-react";

export function ErrorCardDefault21B111CBExample() {
  const [credits, setCredits] = useState(0);

  return (
    <ErrorCard className="w-full max-w-md" icon={<Trash2 className="size-6" />}>
      <ErrorCardTitle>{credits > 0 ? "Credits Added" : "No Credits Left"}</ErrorCardTitle>
      <ErrorCardDescription>
        {credits > 0 ? `${credits} credits are now available.` : "Add credits to continue deploying projects."}
      </ErrorCardDescription>
      <ErrorCardAction>
        <Button onClick={() => setCredits((current) => current + 100)}>Add Credits</Button>
      </ErrorCardAction>
      <span role="status" aria-live="polite" className="sr-only">
        {credits > 0 ? `${credits} credits added` : ""}
      </span>
    </ErrorCard>
  );
}
