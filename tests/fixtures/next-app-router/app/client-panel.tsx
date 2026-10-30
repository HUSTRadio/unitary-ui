"use client";

import { useState } from "react";

import { Button } from "@hustradio/unitary-ui";

// Client boundary: state and events must survive hydration from the tarball.
export default function ClientPanel() {
  const [count, setCount] = useState(0);

  return (
    <section data-testid="next-client-panel" style={{ display: "grid", gap: 8 }}>
      <p>Client panel hydrated from the packed package:</p>
      <output data-testid="next-client-count">{count}</output>
      <Button
        typeName="button"
        data-testid="next-client-button"
        onClick={() => setCount((value) => value + 1)}
      >
        Increment
      </Button>
    </section>
  );
}
