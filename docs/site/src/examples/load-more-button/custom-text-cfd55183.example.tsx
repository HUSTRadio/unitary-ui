import { useState } from "react";
import { LoadMoreButton } from "@hustradio/unitary-ui";

export function LoadMoreButtonCustomTextCFD55183Example() {
  const [count, setCount] = useState(3);

  return (
    <div className="flex w-full flex-col gap-3">
      <p role="status" className="text-copy-13 text-muted-foreground">{count} results loaded</p>
      <LoadMoreButton onClick={() => setCount((value) => value + 3)}>
        Show More Results
      </LoadMoreButton>
    </div>
  );
}
