import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TemplateProviders } from "./locale";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TemplateProviders>
      <App />
    </TemplateProviders>
  </StrictMode>,
);
