"use client";

import { Button, ErrorCard, ErrorCardAction, ErrorCardDescription, ErrorCardTitle } from "@hustradio/unitary-ui";

// Global error boundary must render its own document, so it cannot rely on the root layout.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <div data-testid="next-global-error-card" style={{ padding: 24 }}>
          <ErrorCard>
            <ErrorCardTitle>Application error</ErrorCardTitle>
            <ErrorCardDescription>{error.message}</ErrorCardDescription>
            <ErrorCardAction>
              <Button typeName="button" onClick={() => reset()}>
                Reload
              </Button>
            </ErrorCardAction>
          </ErrorCard>
        </div>
      </body>
    </html>
  );
}
