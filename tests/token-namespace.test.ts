import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runtimeRoots = [path.join(root, "src"), path.join(root, "docs/geist/src")];

async function runtimeFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) return runtimeFiles(target);
      return /\.(?:css|ts|tsx)$/.test(entry.name) ? [target] : [];
    }),
  );
  return nested.flat();
}

describe("project token namespace", () => {
  test("runtime source does not reintroduce the retired --ds-* prefix", async () => {
    const files = (await Promise.all(runtimeRoots.map(runtimeFiles))).flat();
    const matches = await Promise.all(
      files.map(async (file) => ({
        file: path.relative(root, file),
        source: await readFile(file, "utf8"),
      })),
    );

    expect(matches.filter(({ source }) => source.includes("--ds-"))).toEqual([]);
  });
});
