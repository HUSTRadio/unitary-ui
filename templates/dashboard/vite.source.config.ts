import path from "node:path";
import { mergeConfig } from "vite";
import config from "./vite.config.ts";

// Repository-only development. Application imports retain the public contract.
const repository = path.resolve(import.meta.dirname, "../..");
export default mergeConfig(config, {
  cacheDir: path.join(import.meta.dirname, "node_modules/.vite-source"),
  publicDir: path.join(repository, "public"),
  server: { port: 5222 },
  resolve: {
    alias: [
      { find: /^@hustradio\/unitary-ui$/, replacement: path.join(repository, "src/lib/index.ts") },
      {
        find: /^@hustradio\/unitary-ui\/styles\.css$/,
        replacement: path.join(repository, "src/styles/index.css"),
      },
      {
        find: /^@hustradio\/unitary-ui\/tailwind-reference\.css$/,
        replacement: path.join(import.meta.dirname, "source-reference.css"),
      },
      { find: "@", replacement: path.join(repository, "src") },
    ],
  },
});
