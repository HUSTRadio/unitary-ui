// @vitest-environment node
import path from "node:path";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadConfigFromFile } from "vite";
import { LOCKED_PACKAGE_SCRIPTS } from "../scripts/lib/locked-package-scripts.mjs";
import { verificationSteps } from "../scripts/lib/verification.mjs";

const root = process.cwd();
const config = async (file: string) => {
  const loaded = await loadConfigFromFile({ command: "build", mode: "production" }, path.join(root, file));
  if (!loaded) throw new Error(`Missing config: ${file}`);
  return loaded.config;
};
describe("website build contract", () => {
  it("isolates output and cache while preserving standalone docs defaults", async () => {
    const [website, jointDocs, docs] = await Promise.all([
      config("website/vite.config.ts"), config("website/docs.vite.config.ts"), config("docs/vite.config.ts"),
    ]);
    expect(jointDocs.root).toBe(docs.root);
    expect(jointDocs.base).toBe("/docs/");
    expect(docs.base).toBeUndefined();
    expect(docs.build?.outDir).toBeUndefined();
    expect(website.build?.outDir).toBe(path.join(root, "website/dist"));
    expect(jointDocs.build?.outDir).toBe(path.join(root, "website/dist/docs"));
    expect(new Set([docs.cacheDir, website.cacheDir, jointDocs.cacheDir]).size).toBe(3);
    expect(website.publicDir).toBe(docs.publicDir);
    expect(website.server?.proxy).toBeUndefined();
    expect(website.preview?.proxy).toBeUndefined();
    expect(website.resolve?.dedupe).toEqual(["react", "react-dom"]);
  });
  it("builds homepage before nested docs and deduplicates browser prerequisites", () => {
    const plan = verificationSteps([{ name: "build:website", reason: "artifact" }, { name: "test:website", reason: "browser" }]);
    const builds = plan.filter(step => step.command.includes("build") && step.command.includes("vite"));
    expect(builds.map(step => step.command.at(-1))).toEqual(["website/vite.config.ts", "website/docs.vite.config.ts"]);
    expect(plan.at(-1)?.command).toEqual(["bin", "@playwright/test", "playwright", "test", "-c", "website/playwright.config.ts"]);
    expect(LOCKED_PACKAGE_SCRIPTS["build:docs"].steps.at(-1)?.at(-1)).toBe("docs/vite.config.ts");
    const manifest = JSON.parse(readFileSync("website/package.json", "utf8"));
    expect(manifest.private).toBe(true);
    expect(manifest.dependencies["@hustradio/unitary-ui"]).toBe("workspace:*");
  });
});
