import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const repository = path.resolve(import.meta.dirname, "../..");

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: path.join(repository, "node_modules/.vite/dev-shell"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@hustradio/dev-shell-contract", replacement: path.join(repository, "packages/dev-shell-contract/src/index.ts") },
      { find: /^@hustradio\/unitary-ui$/, replacement: path.join(repository, "src/lib/index.ts") },
      { find: /^@hustradio\/unitary-ui\/styles\.css$/, replacement: path.join(repository, "src/styles/index.css") },
      { find: /^@hustradio\/unitary-ui\/tailwind-reference\.css$/, replacement: path.join(repository, "docs/site/build/source-reference.css") },
      { find: "@", replacement: path.join(repository, "src") },
      { find: "@shell", replacement: path.join(repository, "packages/dev-shell/src") },
    ],
    dedupe: ["react", "react-dom"],
  },
  publicDir: path.join(repository, "public"),
  server: {
    host: "127.0.0.1",
    port: 5273,
    strictPort: true,
    proxy: {
      "/api": { target: "http://127.0.0.1:5274", changeOrigin: false, ws: true },
      "/mcp": { target: "http://127.0.0.1:5274", changeOrigin: false },
      "/fixture": { target: "http://127.0.0.1:5274", changeOrigin: false },
    },
  },
  build: { outDir: path.join(import.meta.dirname, "dist") },
});
