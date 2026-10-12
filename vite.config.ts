import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { exampleSourcePlugin } from "./docs/site/build/example-source-plugin.ts";

// The living styleguide and its shared docs demos use the same source providers.
export default defineConfig({
  plugins: [exampleSourcePlugin(), react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: /^@hustradio\/unitary-ui\/styles\.css$/,
        replacement: path.resolve(import.meta.dirname, "src/styles/index.css"),
      },
      {
        find: /^@hustradio\/unitary-ui\/tailwind-reference\.css$/,
        replacement: path.resolve(import.meta.dirname, "src/styles/index.css"),
      },
      {
        find: /^@hustradio\/unitary-ui$/,
        replacement: path.resolve(import.meta.dirname, "src/lib/index.ts"),
      },
      { find: "@", replacement: path.resolve(import.meta.dirname, "src") },
    ],
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
