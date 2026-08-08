import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// docs/geist 独立文档站：通过 alias 直接消费根仓库 src（shadcn/ui 元件、样式、lib），不复制代码。
// publicDir 指向根仓库 public（共享 HarmonyOS Sans SC woff2 等静态资源）。
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../../src"),
    },
  },
  publicDir: path.resolve(__dirname, "../../public"),
});
