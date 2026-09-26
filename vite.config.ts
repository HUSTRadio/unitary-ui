import path from "node:path";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { exampleSourcePlugin } from "./docs/site/build/example-source-plugin.ts";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
const dependencies = Object.keys(pkg.dependencies ?? {});

export default defineConfig(({ mode }) => {
  const isLib = mode === "lib";

  return {
    plugins: [exampleSourcePlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    build: isLib
      ? {
          emptyOutDir: false,
          lib: {
            entry: path.resolve(import.meta.dirname, "src/lib/index.ts"),
            name: "GeistStyleFramework",
            fileName: (format) => (format === "cjs" ? "unitary-ui.cjs" : "unitary-ui.es.js"),
            formats: ["es", "cjs"],
          },
          rollupOptions: {
            // Extract dependency CSS into styles.css instead of leaving Node to load it.
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
        }
      : {
          // App build (dev/preview)
          outDir: "dist",
          sourcemap: true,
        },
  };
});
