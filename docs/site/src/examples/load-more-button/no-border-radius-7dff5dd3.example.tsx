import { useState } from "react";
import { LoadMoreButton } from "@/components/ui/load-more-button";

export function LoadMoreButtonNoBorderRadius7DFF5DD3Example() {
  const [count, setCount] = useState(3);

  return (
    <div className="flex w-full flex-col gap-3">
      <p role="status" className="text-copy-13 text-muted-foreground">{count} results loaded</p>
      <LoadMoreButton noBorderRadius onClick={() => setCount((value) => value + 3)}>
        Load More
      </LoadMoreButton>
    </div>
  );
}
