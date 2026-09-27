import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { exampleSourcePlugin } from "./site/build/example-source-plugin.ts";

// docs 是文档站的 Vite 根：入口为 docs/index.html，应用源码在 docs/site/。
// 通过 alias 直接消费根仓库 src（shadcn/ui 元件、样式、lib），不复制代码；
// publicDir 指向根仓库 public（共享 HarmonyOS Sans SC woff2 等静态资源）。
export default defineConfig({
  root: path.resolve(import.meta.dirname),
  plugins: [exampleSourcePlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "../src"),
    },
  },
  publicDir: path.resolve(import.meta.dirname, "../public"),
});
