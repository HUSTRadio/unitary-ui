import { EmptyState, EmptyStateIcon } from "@hustradio/unitary-ui";
import { ChartColumn } from "lucide-react";

export function EmptyStateBlankSlateE6F82752Example() {
  return (
    <EmptyState
      description="A message conveying the state of the product."
      icon={<EmptyStateIcon icon={<ChartColumn className="size-8" aria-hidden />} />}
      title="Title"
    />
  );
}
