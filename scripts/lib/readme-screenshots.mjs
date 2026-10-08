import fs from "node:fs/promises";
import path from "node:path";

import { PNG } from "pngjs";

// Chromium 的圆角抗锯齿实测有 9 个灰度像素、最大 10/255 的采样差。
// Observed Chromium corner antialiasing varies in 9 pixels by at most 10/255.
export const SCREENSHOT_TOLERANCE = Object.freeze({ maxDifferingPixels: 16, maxChannelDelta: 10 });

export function screenshotsMatch(expectedBuffer, actualBuffer) {
  if (expectedBuffer.equals(actualBuffer)) return true;
  try {
    const expected = PNG.sync.read(expectedBuffer);
    const actual = PNG.sync.read(actualBuffer);
    if (expected.width !== actual.width || expected.height !== actual.height) return false;
    let differingPixels = 0;
    for (let offset = 0; offset < expected.data.length; offset += 4) {
      if (expected.data[offset + 3] !== actual.data[offset + 3]) return false;
      let differs = false;
      for (let channel = 0; channel < 3; channel += 1) {
        const delta = Math.abs(expected.data[offset + channel] - actual.data[offset + channel]);
        if (delta > SCREENSHOT_TOLERANCE.maxChannelDelta) return false;
        if (delta > 0) differs = true;
      }
      if (differs && ++differingPixels > SCREENSHOT_TOLERANCE.maxDifferingPixels) return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function assertArtifactPath(root, target) {
  const scratch = path.join(root, ".scratch");
  const relative = path.relative(scratch, target);
  if (
    !relative ||
    relative.startsWith(`..${path.sep}`) ||
    relative === ".." ||
    path.isAbsolute(relative)
  ) {
    throw new Error("Screenshot --output-dir must be a child directory of the repository .scratch");
  }
  let current = root;
  for (const segment of path.relative(root, target).split(path.sep)) {
    current = path.join(current, segment);
    const stat = await fs.lstat(current).catch((error) => {
      if (error.code === "ENOENT") return null;
      throw error;
    });
    if (stat?.isSymbolicLink()) {
      throw new Error("Screenshot artifact paths must not contain symbolic links");
    }
  }
}

async function screenshotNames(directory) {
  if (!directory) return [];
  const entries = await fs.readdir(directory, { withFileTypes: true }).catch((error) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".png"))
    .map((entry) => entry.name)
    .sort();
}

// Diagnostics share the checked capture and never write generated README or image baselines.
export async function createScreenshotArtifacts(root, args) {
  const outputOptions = args.filter(
    (arg) => arg === "--output-dir" || arg.startsWith("--output-dir="),
  );
  if (outputOptions.length === 0) return null;
  if (outputOptions.length > 1)
    throw new Error("Screenshot --output-dir may only be specified once");
  if (!args.includes("--check") || args.includes("--update-on-drift")) {
    throw new Error("Screenshot --output-dir requires --check without --update-on-drift");
  }
  const option = outputOptions[0];
  const requested =
    option === "--output-dir"
      ? args[args.indexOf(option) + 1]
      : option.slice("--output-dir=".length);
  if (!requested || requested.startsWith("--") || requested.split(/[\\/]/).includes("..")) {
    throw new Error("Screenshot --output-dir requires a path without parent traversal");
  }
  const repoRoot = path.resolve(root);
  const outputDir = path.resolve(repoRoot, requested);
  await assertArtifactPath(repoRoot, outputDir);
  await fs.mkdir(outputDir, { recursive: true });
  // Remove prior diagnostics before writing running state so a failed retry cannot look successful.
  for (const name of ["report.json", "actual", "expected"]) {
    const target = path.join(outputDir, name);
    await assertArtifactPath(repoRoot, target);
    await fs.rm(target, { recursive: true, force: true });
  }

  /**
   * @param {{ status: string, pages?: string[], drift?: string[], error?: string | null }} report
   * @param {string} [stagingDir]
   */
  const write = async ({ status, pages = [], drift = [], error = null }, stagingDir) => {
    await assertArtifactPath(repoRoot, outputDir);
    const actualNames = await screenshotNames(stagingDir);
    if (status === "drift" || status === "error") {
      const expectedDir = path.join(repoRoot, "images", "styleguide");
      const expectedNames = await screenshotNames(expectedDir);
      for (const [kind, source, names] of [
        ["actual", stagingDir, actualNames],
        ["expected", expectedDir, expectedNames],
      ]) {
        const destination = path.join(outputDir, kind);
        await assertArtifactPath(repoRoot, destination);
        await fs.mkdir(destination, { recursive: true });
        for (const name of names) {
          const target = path.join(destination, name);
          await assertArtifactPath(repoRoot, target);
          await fs.copyFile(path.join(source, name), target);
        }
      }
    }
    const reportPath = path.join(outputDir, "report.json");
    await assertArtifactPath(repoRoot, reportPath);
    await fs.writeFile(
      reportPath,
      `${JSON.stringify({ status, pages, captured: actualNames.length, drift, error }, null, 2)}\n`,
      "utf8",
    );
  };
  await write({ status: "running" });
  return { write };
}
