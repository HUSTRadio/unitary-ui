import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const promptPath = path.join(root, "docs/llm/update-prompt.md");

describe("AI documentation update prompt contract", () => {
  it("starts with changelog-first freshness review and keeps deterministic checks authoritative", async () => {
    const prompt = await readFile(promptPath, "utf8");

    expect(prompt).toContain("Read `CHANGELOG.md` and `CHANGELOG.en.md` first");
    expect(prompt).toContain(
      "Use the changelog as a fast freshness signal, never as sufficient proof",
    );
    expect(prompt).toContain(
      "Run every deterministic generation and validation command supplied by the runner",
    );
    expect(prompt).toContain("A changelog entry never overrides a failing deterministic check");
  });

  it("limits the agent to bilingual documentation without inventing APIs or changing runtime behavior", async () => {
    const prompt = await readFile(promptPath, "utf8");

    expect(prompt).toContain("You update documentation only");
    expect(prompt).toContain("Do not change runtime behavior");
    expect(prompt).toContain("Never invent an API");
    expect(prompt).toContain("Simplified Chinese first");
    expect(prompt).toContain("equivalent English alternative");
    expect(prompt).toContain(
      "Modify only the allowlisted documentation paths supplied by the runner",
    );
  });

  it("forbids credentials, commits, and pushes", async () => {
    const prompt = await readFile(promptPath, "utf8");

    expect(prompt).toContain("Do not read or expose credentials");
    expect(prompt).toContain("Do not commit");
    expect(prompt).toContain("Do not push");
  });
});
