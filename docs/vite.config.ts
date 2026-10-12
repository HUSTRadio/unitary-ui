import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { exampleSourcePlugin } from "./site/build/example-source-plugin.ts";
import { componentExamplesPlugin } from "./site/build/component-examples-plugin.ts";

// docs 是文档站的 Vite 根：入口为 docs/index.html，应用源码在 docs/site/。
// 本地开发将公共包入口映射到源码，独立消费者使用已安装的 npm 包。
// publicDir 是共享媒体资源的唯一来源；字体由库的公开 CSS 提供。
const repository = path.resolve(import.meta.dirname, "..");
const packageMode = process.env.UNITARY_DOCS_MODE === "package";

export default defineConfig({
  root: path.resolve(import.meta.dirname),
  // The root styleguide has a different dependency graph. Keep its optimizer
  // from replacing docs dependencies while both dev servers are running.
  cacheDir: path.resolve(import.meta.dirname, "../node_modules/.vite/docs"),
  plugins: [componentExamplesPlugin(), exampleSourcePlugin(), react(), tailwindcss()],
  resolve: {
    // Source mode preserves the public import contract during local development.
    alias: packageMode ? [] : [
      { find: /^@hustradio\/unitary-ui$/, replacement: path.join(repository, "src/lib/index.ts") },
      { find: /^@hustradio\/unitary-ui\/styles\.css$/, replacement: path.join(repository, "src/styles/index.css") },
      // The normal source stylesheet already defines the theme. Referencing the
      // same file again makes Tailwind suppress its runtime theme variables.
      { find: /^@hustradio\/unitary-ui\/tailwind-reference\.css$/, replacement: path.join(import.meta.dirname, "site/build/source-reference.css") },
      { find: "@", replacement: path.join(repository, "src") },
    ],
    dedupe: ["react", "react-dom"],
  },
  publicDir: path.resolve(import.meta.dirname, "../public"),
  build: {
    manifest: true,
    ...(process.env.UNITARY_DOCS_TEST_FIXTURES === "1" ? {
      rollupOptions: {
        input: {
          index: path.join(import.meta.dirname, "index.html"),
          "browser-fixtures": path.join(import.meta.dirname, "site/build/browser-fixtures.ts"),
        },
        preserveEntrySignatures: "strict" as const,
      },
    } : {}),
  },
});
