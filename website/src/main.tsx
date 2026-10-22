import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary, ThemeProvider, MotionProvider } from "@hustradio/unitary-ui";
import { WebsiteLanguageProvider } from "./language";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary name="website-root">
      <ThemeProvider>
        <WebsiteLanguageProvider>
          <MotionProvider><App /></MotionProvider>
        </WebsiteLanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
