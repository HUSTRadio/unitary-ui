import { useState } from "react";
import { Snippet } from "@hustradio/unitary-ui";

export function SnippetCallback32E8D276Example() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <Snippet onCopy={() => setMessage("Copied npm init next-app")} text="npm init next-app" width="300px" />
      <span role="status" className="text-copy-13 text-muted-foreground">
        {message}
      </span>
    </div>
  );
}
