import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ThemeProvider } from "@/lib/theme";
import App from "./App";
import "./index.css";
import { LanguageProvider } from "./i18n/language";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 根边界：providers/路由/布局骨架的未预料崩溃兜底（页面级边界在 App 内，
        页面崩溃不会到这里；此层只接 layout 骨架本身的异常） */}
    <ErrorBoundary
      name="docs-root"
      fallback={
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
          <p style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>文档站遇到意外错误</p>
          <p style={{ fontSize: 14, opacity: 0.7, margin: 0 }}>
            应用初始化失败，刷新通常可以恢复。
          </p>
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
            刷新页面
          </button>
        </div>
      }
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
