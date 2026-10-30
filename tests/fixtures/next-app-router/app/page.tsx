import { Badge, EmptyState, Separator } from "@hustradio/unitary-ui";

import ClientPanel from "./client-panel";

// Server component: no "use client". The root entry is a client boundary, so
// these display components are referenced (and hydrated) as client components
// while still being server-rendered into the initial HTML.
export default function Page() {
  return (
    <main style={{ display: "grid", gap: 24, padding: 24 }}>
      <h1 data-testid="next-page-title">Unitary Next.js App Router fixture</h1>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Badge data-testid="next-server-badge">server-badge</Badge>
        <span>server-rendered through the package root entry</span>
      </div>
      <Separator />
      <EmptyState
        data-testid="next-server-empty-state"
        title="Nothing here yet"
        description="This empty state is rendered by a server component."
      />
      <ClientPanel />
    </main>
  );
}
