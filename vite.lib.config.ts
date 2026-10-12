import path from "node:path";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
const dependencies = Object.keys(pkg.dependencies ?? {});

// Library builds do not load documentation or living-styleguide plugins.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: path.resolve(import.meta.dirname, "src/lib/bundle.ts"),
      name: "UnitaryStyleFramework",
      fileName: (format) => (format === "cjs" ? "unitary-ui.cjs" : "unitary-ui.es.js"),
      cssFileName: "unitary-ui",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      // Dependency CSS is extracted into styles.css for Node and browser consumers.
      external: (id) =>
        !id.endsWith(".css") &&
        (["react", "react-dom"].some((name) => id === name || id.startsWith(`${name}/`)) ||
          dependencies.some((name) => id === name || id.startsWith(`${name}/`))),
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOM",
          "react/jsx-runtime": "ReactJSXRuntime",
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: false,
  },
});
