import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "vitest";

import { exampleSourcePlugin } from "../docs/geist/build/example-source-plugin";

const tempDirs: string[] = [];
afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("example source Vite plugin", () => {
  test("exports the exact physical TSX file as a string", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "unitary-example-source-"));
    tempDirs.push(directory);
    const file = path.join(directory, "button.example.tsx");
    const source = 'import { Button } from "@/components/ui/button";\n\nexport function Demo() {\n  return <Button type="secondary">Save</Button>;\n}\n';
    await writeFile(file, source, "utf8");

    const plugin = exampleSourcePlugin();
    const loaded = await plugin.load?.call({} as never, `${file}?example-source`);
    const code = typeof loaded === "string" ? loaded : loaded?.code;

    expect(code).toBe(`export default ${JSON.stringify(source)};`);
  });

  test("accepts Vite query parameters after example-source", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "unitary-example-source-"));
    tempDirs.push(directory);
    const file = path.join(directory, "badge.example.tsx");
    const source = "export function BadgeExample() { return <div />; }\n";
    await writeFile(file, source, "utf8");

    const plugin = exampleSourcePlugin();
    const loaded = await plugin.load?.call(
      {} as never,
      `${file}?example-source&import&v=123`,
    );
    const code = typeof loaded === "string" ? loaded : loaded?.code;
    expect(code).toBe(`export default ${JSON.stringify(source)};`);
  });

  test("ignores normal module loads", async () => {
    const plugin = exampleSourcePlugin();
    const loaded = await plugin.load?.call({} as never, "button.example.tsx");
    expect(loaded).toBeNull();
  });
});
