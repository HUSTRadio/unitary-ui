import path from "node:path";
import { mergeConfig } from "vite";
import docs from "../docs/vite.config.ts";

// Only the joint website target changes the docs base and destination.
export default mergeConfig(docs, {
  base: "/docs/",
  cacheDir: path.resolve(import.meta.dirname, "../node_modules/.vite/website-docs"),
  build: { outDir: path.join(import.meta.dirname, "dist/docs"), emptyOutDir: true },
});
