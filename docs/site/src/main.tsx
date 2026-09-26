import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ThemeProvider } from "@/lib/theme";
import App from "./App";
import "./index.css";
import { LanguageProvider, readDocsLanguage } from "./i18n/language";
import { SHELL_COPY } from "./i18n/catalog";

function RootErrorFallback() {
  const copy = SHELL_COPY[readDocsLanguage()];
  return (
    <div
      role="alert"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        fontFamily: "system-ui, sans-serif",
        background: "#0a0a0a",
        color: "#ededed",
      }}
    >
      <p style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{copy.rootErrorTitle}</p>
      <p style={{ fontSize: 14, opacity: 0.7, margin: 0 }}>{copy.rootErrorDescription}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          marginTop: 8,
          padding: "8px 20px",
          fontSize: 14,
          cursor: "pointer",
          borderRadius: 6,
          border: "1px solid rgba(128,128,128,0.45)",
          background: "transparent",
          color: "inherit",
        }}
      >
        {copy.refreshPage}
      </button>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 根边界：providers/路由/布局骨架的未预料崩溃兜底（页面级边界在 App 内，
        页面崩溃不会到这里；此层只接 layout 骨架本身的异常） */}
    <ErrorBoundary
      name="docs-root"
      fallback={<RootErrorFallback />}
    >
      <ThemeProvider>
        <LanguageProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
