import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ThemeProvider } from "./lib/theme";
import { I18nProvider } from "./lib/i18n";
import App from "./App";
import "./styleguide.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 根边界：providers/布局骨架的未预料崩溃兜底（页面级边界在 App 内） */}
    <ErrorBoundary name="styleguide-root">
      <ThemeProvider>
        <I18nProvider locale="zh-CN">
          <App />
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
