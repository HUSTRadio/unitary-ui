import { Button } from "@/components/ui/button";
import {
  ErrorCard,
  ErrorCardAction,
  ErrorCardDescription,
  ErrorCardTitle,
} from "@/components/ui/error-card";
import { Trash2 } from "lucide-react";

export function ErrorCardDefault21B111CBExample() {
  return (
    <ErrorCard className="w-full max-w-md" icon={<Trash2 className="size-6" />}>
      <ErrorCardTitle>No Credits Left</ErrorCardTitle>
      <ErrorCardDescription>Add credits to continue deploying projects.</ErrorCardDescription>
      <ErrorCardAction>
        <Button>Add Credits</Button>
      </ErrorCardAction>
    </ErrorCard>
  );
}
