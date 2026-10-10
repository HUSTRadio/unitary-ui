// @vitest-environment node
import { ChildProcess } from "node:child_process";
import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startPreview } from "../scripts/capture-readme-screenshots.mjs";
import { buildReadmePreview, cleanupReadmePreview } from "../scripts/lib/readme-preview.mjs";

let fixture: string;
let root: string;
const previews: string[] = [];

beforeEach(async () => {
  fixture = await fs.mkdtemp(path.join(os.tmpdir(), "unitary-preview-test-"));
  root = path.join(fixture, "repo with spaces & $(literal)");
  const executableDirectory = path.join(root, "node_modules", "vite-plus");
  await fs.mkdir(executableDirectory, { recursive: true });
  await fs.writeFile(
    path.join(executableDirectory, "package.json"),
    JSON.stringify({ bin: { vp: "vp.mjs" } }),
  );
  await fs.writeFile(
    path.join(executableDirectory, "vp.mjs"),
    `import fs from "node:fs/promises";
import path from "node:path";
const args = process.argv.slice(2);
const outDir = args[args.indexOf("--outDir") + 1];
const settings = JSON.parse(await fs.readFile("scenario.json", "utf8"));
await fs.appendFile("invocations.jsonl", JSON.stringify({ args, cwd: process.cwd(), executable: process.execPath }) + "\\n");
if (settings.empty) process.exit(0);
await fs.writeFile(path.join(outDir, "index.html"), settings.content);
if (settings.fail) {
  console.log("build fixture reached output");
  console.error("build fixture failed deliberately");
  process.exit(23);
}
`,
  );
  await scenario({ content: "fresh preview" });
});

afterEach(async () => {
  vi.restoreAllMocks();
  for (const directory of previews.splice(0)) await cleanupReadmePreview(directory);
  if (
    !path.isAbsolute(fixture) ||
    path.dirname(path.resolve(fixture)) !== path.resolve(os.tmpdir()) ||
    !path.basename(fixture).startsWith("unitary-preview-test-")
  ) {
    throw new Error("Refusing to remove an unexpected test fixture directory");
  }
  await fs.rm(fixture, { recursive: true, force: true });
});

async function scenario(settings: { content?: string; fail?: boolean; empty?: boolean }) {
  await fs.writeFile(path.join(root, "scenario.json"), JSON.stringify(settings));
}

async function invocations(): Promise<{ args: string[]; cwd: string; executable: string }[]> {
  return (await fs.readFile(path.join(root, "invocations.jsonl"), "utf8"))
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
}

async function preview() {
  const directory = await buildReadmePreview(root);
  previews.push(directory);
  return directory;
}

describe("fresh production README previews", () => {
  it("runs the owned package executable with literal argv and preserves existing outputs", async () => {
    for (const name of ["dist", "lib", "package"]) {
      await fs.mkdir(path.join(root, name));
      await fs.writeFile(path.join(root, name, "sentinel"), "original output");
    }
    await fs.writeFile(path.join(root, ".env"), "original environment fixture");
    const directory = await preview();
    expect(path.isAbsolute(directory)).toBe(true);
    expect(path.dirname(directory)).toBe(await fs.realpath(os.tmpdir()));
    expect(await fs.readFile(path.join(directory, "index.html"), "utf8")).toBe("fresh preview");
    expect(await invocations()).toEqual([
      { args: ["build", "--outDir", directory], cwd: root, executable: process.execPath },
    ]);
    for (const name of ["dist", "lib", "package"]) {
      expect(await fs.readFile(path.join(root, name, "sentinel"), "utf8")).toBe("original output");
    }
    expect(await fs.readFile(path.join(root, ".env"), "utf8")).toBe("original environment fixture");
  });

  it("builds each request in a new directory and cleans only the selected successful preview", async () => {
    const first = await preview();
    await scenario({ content: "next preview" });
    const second = await preview();
    expect(first).not.toBe(second);
    expect(await fs.readFile(path.join(first, "index.html"), "utf8")).toBe("fresh preview");
    expect(await fs.readFile(path.join(second, "index.html"), "utf8")).toBe("next preview");
    await cleanupReadmePreview(second);
    await cleanupReadmePreview(second);
    await expect(fs.stat(second)).rejects.toMatchObject({ code: "ENOENT" });
    expect(await fs.readFile(path.join(first, "index.html"), "utf8")).toBe("fresh preview");
  });

  it("rejects failed builds with status and output, removes partial output, and never reuses a prior build", async () => {
    const first = await preview();
    await scenario({ content: "partial output", fail: true });
    await expect(buildReadmePreview(root)).rejects.toThrow(
      /README preview build failed \(exit 23\)[\s\S]*reached output[\s\S]*failed deliberately/,
    );
    const attempts = await invocations();
    const failed = attempts[1].args[2];
    expect(failed).not.toBe(first);
    await expect(fs.stat(failed)).rejects.toMatchObject({ code: "ENOENT" });
    expect(await fs.readFile(path.join(first, "index.html"), "utf8")).toBe("fresh preview");
    await scenario({ content: "successful retry" });
    const retry = await preview();
    expect(retry).not.toBe(failed);
    expect(retry).not.toBe(first);
    expect(await fs.readFile(path.join(retry, "index.html"), "utf8")).toBe("successful retry");
  });

  it("rejects a successful command without a generated entry and removes its empty output", async () => {
    await scenario({ empty: true });
    await expect(buildReadmePreview(root)).rejects.toMatchObject({ code: "ENOENT" });
    const [{ args }] = await invocations();
    await expect(fs.stat(args[2])).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("handles asynchronous preview spawn failures and cleans the completed build while preserving older output", async () => {
    const first = await preview();
    const originalOutput = path.join(root, "dist");
    await fs.mkdir(originalOutput);
    await fs.writeFile(path.join(originalOutput, "sentinel"), "original output");
    await scenario({ content: "completed build before spawn failure" });
    const startupError = Object.assign(new Error("spawn EAGAIN"), { code: "EAGAIN" });
    const child = new ChildProcess();
    const kill = vi.spyOn(child, "kill");
    let errorHandled = false;
    const spawnProcess = vi.fn().mockImplementation((_executable, args) => {
      const directory = args[args.indexOf("--outDir") + 1];
      expect(readFileSync(path.join(directory, "index.html"), "utf8")).toBe(
        "completed build before spawn failure",
      );
      queueMicrotask(() => {
        errorHandled = child.emit("error", startupError);
      });
      return child;
    });

    await expect(startPreview({ root, spawnProcess })).rejects.toBe(startupError);

    expect(spawnProcess).toHaveBeenCalledOnce();
    expect(errorHandled).toBe(true);
    expect(kill).not.toHaveBeenCalled();
    const attempts = await invocations();
    const failed = attempts[1].args[2];
    previews.push(failed);
    expect(failed).not.toBe(first);
    await expect(fs.stat(failed)).rejects.toMatchObject({ code: "ENOENT" });
    expect(await fs.readFile(path.join(first, "index.html"), "utf8")).toBe("fresh preview");
    expect(await fs.readFile(path.join(originalOutput, "sentinel"), "utf8")).toBe(
      "original output",
    );
  });

  it("cleans the fresh directory when the package command cannot be resolved", async () => {
    await fs.rm(path.join(root, "node_modules", "vite-plus", "package.json"));
    const created = vi.spyOn(fs, "mkdtemp");
    await expect(buildReadmePreview(root)).rejects.toMatchObject({ code: "ENOENT" });
    expect(created).toHaveBeenCalledOnce();
    const directory = await created.mock.results[0].value;
    await expect(fs.stat(directory)).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("refuses arbitrary directories, prefix lookalikes, descendants and relative paths", async () => {
    const directory = await preview();
    const lookalike = path.join(fixture, "unitary-readme-preview-lookalike");
    const child = path.join(directory, "child");
    await fs.mkdir(lookalike);
    await fs.writeFile(path.join(lookalike, "sentinel"), "must survive");
    await fs.mkdir(child);
    for (const target of [os.tmpdir(), root, lookalike, child, path.basename(directory)]) {
      await expect(cleanupReadmePreview(target)).rejects.toThrow(/owned|unowned/);
    }
    expect(await fs.readFile(path.join(lookalike, "sentinel"), "utf8")).toBe("must survive");
    expect((await fs.stat(child)).isDirectory()).toBe(true);
  });

  it("refuses a symlink replacing an owned build directory without touching its target", async () => {
    const directory = await preview();
    const saved = path.join(fixture, "saved-preview");
    const outside = path.join(fixture, "outside");
    await fs.mkdir(outside);
    await fs.writeFile(path.join(outside, "sentinel"), "must survive");
    await fs.rename(directory, saved);
    try {
      await fs.symlink(outside, directory, process.platform === "win32" ? "junction" : "dir");
      await expect(cleanupReadmePreview(directory)).rejects.toThrow("replaced");
      expect(await fs.readFile(path.join(outside, "sentinel"), "utf8")).toBe("must survive");
    } finally {
      await fs.unlink(directory);
      await fs.rename(saved, directory);
    }
  });
});
