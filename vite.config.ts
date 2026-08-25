import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const isLib = mode === "lib";

  return {
    plugins: [react(), tailwindcss()],
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
            fileName: (format) =>
              format === "cjs"
                ? "unitary-ui.cjs"
                : "unitary-ui.es.js",
            formats: ["es", "cjs"],
          },
          rollupOptions: {
            external: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
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
          sourcemap: true,
        }
      : {
          // App build (dev/preview)
          outDir: "dist",
          sourcemap: true,
        },
  };
});