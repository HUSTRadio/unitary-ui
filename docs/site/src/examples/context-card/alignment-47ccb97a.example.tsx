import { Button } from "@/components/ui/button";
import {
  ContextCard,
  ContextCardBody,
  ContextCardDescription,
  ContextCardFooter,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardTrigger,
} from "@/components/ui/context-card";

export function ContextCardAlignment47CCB97AExample() {
  const card = (
    <ContextCard>
      <ContextCardHeader>
        <div className="size-8 shrink-0 rounded-full bg-gray-400" aria-hidden />
        <div>
          <ContextCardTitle>Acme Inc.</ContextCardTitle>
          <ContextCardDescription>@acme · San Francisco</ContextCardDescription>
        </div>
      </ContextCardHeader>
      <ContextCardBody>
        <p className="text-copy-13 text-muted-foreground">Last Active: 2h ago</p>
        <p className="text-copy-13 text-muted-foreground">Plan: Pro</p>
      </ContextCardBody>
      <ContextCardFooter>
        <Button type="secondary" typeName="button" size="small">
          View Project
        </Button>
      </ContextCardFooter>
    </ContextCard>
  );

  return (
    <div className="flex gap-4 items-center justify-center">
      {(["Start", "Center", "End"] as const).map((label) => (
        <ContextCardTrigger
          key={label}
          content={card}
          align={label.toLowerCase() as "start" | "center" | "end"}
          side="bottom"
          render={
            <Button type="default" typeName="button">
              {label}
            </Button>
          }
        />
      ))}
    </div>
  );
}
