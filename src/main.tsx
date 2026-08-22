import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./lib/theme";
import { I18nProvider } from "./lib/i18n";
import App from "./App";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider locale="zh-CN">
        <App />
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
