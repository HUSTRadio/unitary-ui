import { Button } from "@hustradio/unitary-ui";
import { EmptyState, EmptyStateIcon } from "@hustradio/unitary-ui";
import { ArrowRight, ChartColumn } from "lucide-react";

export function EmptyStateInformationalBE8ED055Example() {
  return (
    <EmptyState
      description="This should detail the actions you can take on this screen, as well as why it’s valuable."
      icon={<EmptyStateIcon icon={<ChartColumn className="size-8" aria-hidden />} />}
      title="Title"
    >
      <Button type="default" typeName="button">
        Primary Action
      </Button>
      <a
        href="/"
        className="inline-flex cursor-pointer items-center gap-0.5 text-label-14 text-muted-foreground no-underline"
      >
        Learn more
        <ArrowRight className="size-4" aria-hidden />
      </a>
    </EmptyState>
  );
}
