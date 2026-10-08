// @vitest-environment node
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createScreenshotArtifacts } from "../scripts/lib/readme-screenshots.mjs";

let root: string;
let staging: string;
const output = ".scratch/readme-screenshots";

async function report() {
  return JSON.parse(await fs.readFile(path.join(root, output, "report.json"), "utf8"));
}

beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), "unitary-shot-artifacts-test-"));
  staging = path.join(root, "capture");
  await fs.mkdir(staging);
  await fs.mkdir(path.join(root, "images", "styleguide"), { recursive: true });
  await fs.writeFile(path.join(root, "README.md"), "original README");
  await fs.writeFile(path.join(root, "images", "styleguide", "button-light.png"), "baseline");
});

afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true });
});

describe("README screenshot diagnostic artifacts", () => {
  it("preserves the existing behavior when no output directory is requested", async () => {
    expect(await createScreenshotArtifacts(root, ["--check", "--update-on-drift"])).toBeNull();
    await expect(fs.stat(path.join(root, ".scratch"))).rejects.toMatchObject({ code: "ENOENT" });
  });

  it.each([
    ["--output-dir", output],
    ["--check", "--update-on-drift", "--output-dir", output],
    ["--check", "--output-dir"],
    ["--check", "--output-dir="],
    ["--check", "--output-dir", "--other"],
    ["--check", "--output-dir", output, "--output-dir=another"],
  ])("rejects incompatible or incomplete arguments: %j", async (...args: string[]) => {
    await expect(createScreenshotArtifacts(root, args)).rejects.toThrow("--output-dir");
    await expect(fs.stat(path.join(root, ".scratch"))).rejects.toMatchObject({ code: "ENOENT" });
  });

  it.each([
    ".scratch",
    ".scratch/.",
    "images/styleguide",
    "README.md",
    "docs/artifacts",
    ".scratch-other/artifacts",
    ".scratch/../docs/artifacts",
    ".scratch/nested/../artifacts",
    "..\\outside",
  ])("rejects managed paths and parent traversal: %s", async (requested) => {
    await expect(
      createScreenshotArtifacts(root, ["--check", "--output-dir", requested]),
    ).rejects.toThrow();
    expect(await fs.readFile(path.join(root, "README.md"), "utf8")).toBe("original README");
    expect(
      await fs.readFile(path.join(root, "images", "styleguide", "button-light.png"), "utf8"),
    ).toBe("baseline");
    await expect(fs.stat(path.join(root, ".scratch"))).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("rejects an absolute directory outside the repository scratch boundary", async () => {
    await expect(
      createScreenshotArtifacts(root, ["--check", "--output-dir", os.tmpdir()]),
    ).rejects.toThrow(".scratch");
  });

  it("writes a fresh pending report and clears old images before recording a successful retry", async () => {
    const dir = path.join(root, output);
    await fs.mkdir(path.join(dir, "actual"), { recursive: true });
    await fs.mkdir(path.join(dir, "expected"));
    await fs.writeFile(path.join(dir, "actual", "old.png"), "old actual");
    await fs.writeFile(path.join(dir, "expected", "old.png"), "old expected");
    await fs.writeFile(path.join(dir, "report.json"), JSON.stringify({ status: "passed" }));
    const artifacts = await createScreenshotArtifacts(root, ["--check", `--output-dir=${output}`]);
    expect(await report()).toEqual({
      status: "running",
      pages: [],
      captured: 0,
      drift: [],
      error: null,
    });
    await fs.writeFile(path.join(staging, "button-light.png"), "same capture");
    await artifacts!.write({ status: "passed", pages: ["button"] }, staging);
    expect(await report()).toEqual({
      status: "passed",
      pages: ["button"],
      captured: 1,
      drift: [],
      error: null,
    });
    expect(await fs.readdir(dir)).toEqual(["report.json"]);
  });

  it("keeps the checked capture and baselines as separate artifacts without changing managed files", async () => {
    await fs.writeFile(path.join(staging, "button-light.png"), "checked capture");
    await fs.writeFile(path.join(staging, "button-dark.png"), "new capture");
    await fs.writeFile(path.join(staging, "screenshots.zh.md"), "temporary formatting fixture");
    await fs.writeFile(path.join(root, "images", "styleguide", "stale-dark.png"), "stale baseline");
    const artifacts = await createScreenshotArtifacts(root, [
      "--check",
      "--output-dir",
      path.join(root, output),
    ]);
    const drift = [
      "images/styleguide/button-light.png",
      "images/styleguide/button-dark.png",
      "images/styleguide/stale-dark.png (stale)",
      "README.md",
    ];
    await artifacts!.write({ status: "drift", pages: ["button"], drift }, staging);
    expect(await report()).toEqual({
      status: "drift",
      pages: ["button"],
      captured: 2,
      drift,
      error: null,
    });
    expect(await fs.readFile(path.join(root, output, "actual", "button-light.png"), "utf8")).toBe(
      "checked capture",
    );
    expect(await fs.readFile(path.join(root, output, "actual", "button-dark.png"), "utf8")).toBe(
      "new capture",
    );
    expect(await fs.readFile(path.join(root, output, "expected", "button-light.png"), "utf8")).toBe(
      "baseline",
    );
    expect(await fs.readFile(path.join(root, output, "expected", "stale-dark.png"), "utf8")).toBe(
      "stale baseline",
    );
    expect(await fs.readdir(path.join(root, output, "actual"))).toEqual([
      "button-dark.png",
      "button-light.png",
    ]);
    expect(await fs.readFile(path.join(root, "README.md"), "utf8")).toBe("original README");
    expect(
      await fs.readFile(path.join(root, "images", "styleguide", "button-light.png"), "utf8"),
    ).toBe("baseline");
    expect(await fs.readFile(path.join(staging, "button-light.png"), "utf8")).toBe(
      "checked capture",
    );
  });

  it("records an early capture failure even when no staging directory exists", async () => {
    const artifacts = await createScreenshotArtifacts(root, ["--check", "--output-dir", output]);
    await artifacts!.write({ status: "error", error: "Preview exited early" });
    expect(await report()).toEqual({
      status: "error",
      pages: [],
      captured: 0,
      drift: [],
      error: "Preview exited early",
    });
  });

  it("retains a partial capture and discovered pages when capture fails", async () => {
    await fs.writeFile(path.join(staging, "button-light.png"), "partial capture");
    const artifacts = await createScreenshotArtifacts(root, ["--check", "--output-dir", output]);
    await artifacts!.write(
      { status: "error", pages: ["button"], error: "Browser disconnected" },
      staging,
    );
    expect(await report()).toMatchObject({
      status: "error",
      pages: ["button"],
      captured: 1,
      error: "Browser disconnected",
    });
    expect(await fs.readFile(path.join(root, output, "actual", "button-light.png"), "utf8")).toBe(
      "partial capture",
    );
  });

  it.each([
    ".scratch",
    ".scratch/linked",
    `${output}/actual`,
    `${output}/expected`,
    `${output}/report.json`,
  ])("rejects a symbolic link in the output path: %s", async (linked) => {
    const outside = path.join(root, "outside");
    const link = path.join(root, linked);
    await fs.mkdir(outside);
    await fs.writeFile(path.join(outside, "sentinel"), "must survive");
    await fs.mkdir(path.dirname(link), { recursive: true });
    await fs.symlink(outside, link, "junction");
    const requested =
      linked === ".scratch"
        ? output
        : linked === ".scratch/linked"
          ? `${linked}/artifacts`
          : output;
    await expect(
      createScreenshotArtifacts(root, ["--check", "--output-dir", requested]),
    ).rejects.toThrow("symbolic links");
    expect(await fs.readdir(outside)).toEqual(["sentinel"]);
  });

  it("rechecks paths before copying so a newly introduced symlink cannot redirect artifacts", async () => {
    const artifacts = await createScreenshotArtifacts(root, ["--check", "--output-dir", output]);
    const outside = path.join(root, "outside");
    await fs.mkdir(outside);
    await fs.symlink(outside, path.join(root, output, "actual"), "junction");
    await fs.writeFile(path.join(staging, "button-light.png"), "capture");
    await expect(artifacts!.write({ status: "drift" }, staging)).rejects.toThrow("symbolic links");
    expect(await fs.readdir(outside)).toEqual([]);
    expect((await report()).status).toBe("running");
  });
});
