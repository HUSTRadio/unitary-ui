import { useState } from "react";
import { LoadMoreButton } from "@/components/ui/load-more-button";

export function LoadMoreButtonNoGap7BF8EBE8Example() {
  const [count, setCount] = useState(3);

  return (
    <div className="flex w-full flex-col">
      <p role="status" className="text-copy-13 text-gray-900">{count} results loaded</p>
      <LoadMoreButton noGap onClick={() => setCount((value) => value + 3)}>Load More</LoadMoreButton>
    </div>
  );
}
