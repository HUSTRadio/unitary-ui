import * as React from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";

function BrokenPreview(): never {
  throw new Error("Deployment preview failed to render");
}

export function ErrorBoundaryDefault37A8EEC1Example() {
  const [failed, setFailed] = React.useState(false);

  return (
    <ErrorBoundary
      key={failed ? "failed" : "ready"}
      name="Deployment Preview"
      fallback={
        <div role="alert" className="space-y-3 rounded-lg border p-4">
          <p className="font-medium">Deployment Preview Failed</p>
          <Button typeName="button" onClick={() => setFailed(false)}>
            Reload Deployment Preview
          </Button>
        </div>
      }
    >
      {failed ? (
        <BrokenPreview />
      ) : (
        <Button typeName="button" onClick={() => setFailed(true)}>
          Trigger Render Error
        </Button>
      )}
    </ErrorBoundary>
  );
}
