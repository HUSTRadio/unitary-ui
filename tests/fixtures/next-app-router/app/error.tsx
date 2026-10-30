"use client";

import { Button, ErrorCard, ErrorCardAction, ErrorCardDescription, ErrorCardTitle } from "@hustradio/unitary-ui";

// Route error boundary for the whole app segment.
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div data-testid="next-error-card" style={{ padding: 24 }}>
      <ErrorCard>
        <ErrorCardTitle>Something went wrong</ErrorCardTitle>
        <ErrorCardDescription data-testid="next-error-message">{error.message}</ErrorCardDescription>
        <ErrorCardAction>
          <Button typeName="button" data-testid="next-error-reset" onClick={() => reset()}>
            Try again
          </Button>
        </ErrorCardAction>
      </ErrorCard>
    </div>
  );
}
