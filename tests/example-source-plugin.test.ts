import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "vitest";

import { exampleSourcePlugin } from "../docs/site/build/example-source-plugin";

const tempDirs: string[] = [];
afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

/**
 * 该插件的 load 始终是函数实现；Vite 的 ObjectHook 联合类型需要先收窄才能调用。
 */
function callLoad(plugin: ReturnType<typeof exampleSourcePlugin>, id: string): Promise<unknown> {
  const { load } = plugin;
  if (typeof load !== "function") {
    throw new Error("expected example source plugin to expose a function load hook");
  }
  return Promise.resolve(load.call({} as never, id));
}

describe("example source Vite plugin", () => {
  test("exports the exact physical TSX file as a string", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "unitary-example-source-"));
    tempDirs.push(directory);
    const file = path.join(directory, "button.example.tsx");
    const source = 'import { Button } from "@/components/ui/button";\n\nexport function Demo() {\n  return <Button type="secondary">Save</Button>;\n}\n';
    await writeFile(file, source, "utf8");

    const plugin = exampleSourcePlugin();
    const loaded = await callLoad(plugin, `${file}?example-source`);

    expect(loaded).toBe(`export default ${JSON.stringify(source)};`);
  });

  test("accepts Vite query parameters after example-source", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "unitary-example-source-"));
    tempDirs.push(directory);
    const file = path.join(directory, "badge.example.tsx");
    const source = "export function BadgeExample() { return <div />; }\n";
    await writeFile(file, source, "utf8");

    const plugin = exampleSourcePlugin();
    const loaded = await callLoad(plugin, `${file}?example-source&import&v=123`);

    expect(loaded).toBe(`export default ${JSON.stringify(source)};`);
  });

  test("ignores normal module loads", async () => {
    const plugin = exampleSourcePlugin();
    const loaded = await callLoad(plugin, "button.example.tsx");
    expect(loaded).toBeNull();
  });

  test.each([
    ["empty source", "", /must not be empty/i],
    ["invalid TSX", "export function Demo( {", /invalid TSX/i],
    ["missing export", "const value = 1;\n", /exactly one exported function/i],
    [
      "duplicate exports",
      "export function First() { return <div />; }\nexport function Second() { return <div />; }\n",
      /exactly one exported function/i,
    ],
  ])("rejects %s", async (_caseName, source, message) => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "unitary-example-source-"));
    tempDirs.push(directory);
    const file = path.join(directory, "invalid.example.tsx");
    await writeFile(file, source, "utf8");

    const plugin = exampleSourcePlugin();
    await expect(callLoad(plugin, `${file}?example-source`)).rejects.toThrow(message);
  });

  test("rejects a non-empty example-source query value", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "unitary-example-source-"));
    tempDirs.push(directory);
    const file = path.join(directory, "button.example.tsx");
    await writeFile(file, "export function Demo() { return <div />; }\n", "utf8");

    const plugin = exampleSourcePlugin();
    await expect(callLoad(plugin, `${file}?example-source=false`)).rejects.toThrow(
      /invalid example-source query/i,
    );
  });
});
