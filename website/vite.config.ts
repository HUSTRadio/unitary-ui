import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const repository = path.resolve(import.meta.dirname, "..");

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: path.join(repository, "node_modules/.vite/website"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^@hustradio\/unitary-ui$/, replacement: path.join(repository, "src/lib/index.ts") },
      { find: /^@hustradio\/unitary-ui\/styles\.css$/, replacement: path.join(repository, "src/styles/index.css") },
      { find: /^@hustradio\/unitary-ui\/tailwind-reference\.css$/, replacement: path.join(repository, "docs/site/build/source-reference.css") },
      { find: "@", replacement: path.join(repository, "src") },
    ],
    dedupe: ["react", "react-dom"],
  },
  publicDir: path.join(repository, "public"),
  build: { outDir: path.join(import.meta.dirname, "dist") },
});
