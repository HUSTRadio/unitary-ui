import { readFile } from "node:fs/promises";
import type { Plugin } from "vite";

const QUERY = "example-source";

export function exampleSourcePlugin(): Plugin {
  return {
    name: "unitary-example-source",
    enforce: "pre",
    async load(id) {
      const queryIndex = id.indexOf("?");
      if (queryIndex < 0) return null;
      const query = new URLSearchParams(id.slice(queryIndex + 1));
      if (!query.has(QUERY)) return null;
      const fileName = id.slice(0, queryIndex);
      const source = await readFile(fileName, "utf8");
      return `export default ${JSON.stringify(source)};`;
    },
  };
}
