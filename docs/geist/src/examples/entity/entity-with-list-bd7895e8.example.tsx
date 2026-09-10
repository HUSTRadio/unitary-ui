import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Entity, EntityAction, EntityContent, EntityDescription, EntityTitle } from "@/components/ui/entity";

const INITIAL_SESSIONS = [
  { id: "github", title: "GitHub Desktop on MacBook Pro", description: "Last used just now" },
  { id: "vscode", title: "VS Code on Windows 11", description: "Last used 10min ago" },
  { id: "terminal", title: "Terminal on Ubuntu 24.04", description: "Last used 25min ago" },
] as const;

export function EntityEntityWithListBD7895E8Example() {
  const [sessions, setSessions] = useState<ReadonlyArray<(typeof INITIAL_SESSIONS)[number]>>(INITIAL_SESSIONS);
  const [message, setMessage] = useState("");

  const decline = (id: string, title: string) => {
    setSessions((current) => current.filter((session) => session.id !== id));
    setMessage(`${title} declined`);
  };

  return (
    <div>
      <ul className="flex flex-col">
        {sessions.map((session) => (
          <Entity key={session.id}>
            <EntityContent>
              <EntityTitle>{session.title}</EntityTitle>
              <EntityDescription>{session.description}</EntityDescription>
            </EntityContent>
            <EntityAction>
              <Button size="small" type="secondary" onClick={() => decline(session.id, session.title)}>
                Decline
              </Button>
            </EntityAction>
          </Entity>
        ))}
      </ul>
      <span role="status" aria-live="polite" className="sr-only">{message}</span>
    </div>
  );
}
