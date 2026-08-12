import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { computeLocalSourceState, resolveEvidenceContract } from "./evidence-v2.mjs";

const selectorPair = (official: string, local: string) => ({ official, local });

const contract = {
  demoId: "default",
  variant: "default",
  state: "open",
  clipRole: "root",
  evidenceNotBefore: "2026-08-12T01:00:00.000Z",
  roles: {
    root: {
      selectors: {
        default: selectorPair("[data-official-root]", "[data-local-root]"),
        byViewport: {
          "375x812": selectorPair("[data-official-mobile]", "[data-local-mobile]"),
        },
      },
      presence: "required",
      acceptanceProfile: "strict",
    },
    absent: {
      selectors: {
        default: selectorPair("[data-official-absent]", "[data-local-absent]"),
        byViewport: {},
      },
      presence: "forbidden",
      acceptanceProfile: "strict",
    },
  },
  semanticNodeInventory: [],
  transparentWrappers: [],
};

const manifest = {
  schemaVersion: 2,
  acceptancePolicy: {
    evidenceEpochNotBefore: "2026-08-12T00:00:00.000Z",
    approvedFontMappings: [
      {
        officialPrimaryFamily: "Geist",
        localPrimaryFamily: "HarmonyOS Sans SC",
      },
    ],
    localSourceInputs: ["src/**", "package.json"],
    pixelAttribution: {
      foregroundColorDistanceMax: 0,
      edgeExpansionDevicePixels: 1,
    },
  },
  components: [
    {
      slug: "drawer",
      officialUrl: "https://vercel.com/geist/drawer",
      demos: [{ id: "default" }],
      variants: ["default"],
      states: ["open"],
      themes: ["light", "dark"],
      viewports: ["375x812", "1440x900"],
      acceptanceContracts: [contract],
    },
  ],
};

const resolve = (source: "official" | "local", viewportText = "375x812") =>
  resolveEvidenceContract(manifest, {
    source,
    slug: "drawer",
    demoId: "default",
    variant: "default",
    state: "open",
    theme: "dark",
    viewportText,
    auditRunId: "audit-20260812-01",
  });

describe("resolved evidence contract v2", () => {
  test("resolves exact source and viewport selectors without CLI inference", () => {
    const official = resolve("official");
    const local = resolve("local");

    expect(official.schemaVersion).toBe(2);
    expect(official.rootSelector).toBe("[data-official-mobile]");
    expect(local.rootSelector).toBe("[data-local-mobile]");
    expect(official.roleSelectors).toEqual({
      root: "[data-official-mobile]",
      absent: "[data-official-absent]",
    });
    expect(local.roleSelectors).toEqual({
      root: "[data-local-mobile]",
      absent: "[data-local-absent]",
    });
    expect(official.contract).toEqual(contract);
    expect(official.effectiveEvidenceNotBefore).toBe("2026-08-12T01:00:00.000Z");
    expect(official.contractDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(local.contractDigest).toBe(official.contractDigest);
    expect(official.auditRunId).toBe("audit-20260812-01");
  });

  test("uses default selectors outside an override and rejects cells without an exact contract", () => {
    expect(resolve("official", "1440x900").rootSelector).toBe("[data-official-root]");

    expect(() =>
      resolveEvidenceContract(manifest, {
        source: "official",
        slug: "drawer",
        demoId: "default",
        variant: "default",
        state: "closed",
        theme: "dark",
        viewportText: "375x812",
        auditRunId: "audit-20260812-01",
      }),
    ).toThrow(/exact acceptance contract/i);
  });

  test("canonical contract digest ignores object key order but changes with policy or contract", () => {
    const original = resolve("official").contractDigest;
    const reordered = {
      ...structuredClone(manifest),
      acceptancePolicy: {
        pixelAttribution: manifest.acceptancePolicy.pixelAttribution,
        localSourceInputs: manifest.acceptancePolicy.localSourceInputs,
        approvedFontMappings: manifest.acceptancePolicy.approvedFontMappings,
        evidenceEpochNotBefore: manifest.acceptancePolicy.evidenceEpochNotBefore,
      },
    };
    expect(
      resolveEvidenceContract(reordered, {
        source: "local",
        slug: "drawer",
        demoId: "default",
        variant: "default",
        state: "open",
        theme: "dark",
        viewportText: "375x812",
        auditRunId: "audit-20260812-01",
      }).contractDigest,
    ).toBe(original);

    const changed = structuredClone(manifest);
    changed.components[0].acceptanceContracts[0].roles.root.acceptanceProfile = "mapped-text";
    expect(
      resolveEvidenceContract(changed, {
        source: "official",
        slug: "drawer",
        demoId: "default",
        variant: "default",
        state: "open",
        theme: "dark",
        viewportText: "375x812",
        auditRunId: "audit-20260812-01",
      }).contractDigest,
    ).not.toBe(original);
  });
});

describe("local UI source state", () => {
  test("hashes only tracked policy matches and reports revision and cleanliness", () => {
    const repo = mkdtempSync(join(tmpdir(), "geist-evidence-v2-"));
    mkdirSync(join(repo, "src"));
    writeFileSync(join(repo, "src", "tracked.ts"), "export const value = 1;\n");
    writeFileSync(join(repo, "src", "ignored.ts"), "ignored\n");
    writeFileSync(join(repo, "package.json"), '{"name":"fixture"}\n');
    writeFileSync(join(repo, "README.md"), "not an input\n");
    execFileSync("git", ["init", "-q"], { cwd: repo });
    execFileSync("git", ["config", "user.email", "fixture@example.test"], { cwd: repo });
    execFileSync("git", ["config", "user.name", "Fixture"], { cwd: repo });
    execFileSync("git", ["add", "src/tracked.ts", "package.json", "README.md"], { cwd: repo });
    execFileSync("git", ["-c", "commit.gpgsign=false", "commit", "-q", "-m", "fixture"], {
      cwd: repo,
    });

    const clean = computeLocalSourceState(repo, ["src/**", "package.json"]);
    expect(clean.localRevision).toMatch(/^[a-f0-9]{40}$/);
    expect(clean.worktreeClean).toBe(false);
    expect(clean.localSourceFiles).toEqual(["package.json", "src/tracked.ts"]);
    expect(clean.localSourceDigest).toMatch(/^[a-f0-9]{64}$/);

    execFileSync("git", ["clean", "-f", "src/ignored.ts"], { cwd: repo });
    const afterClean = computeLocalSourceState(repo, ["src/**", "package.json"]);
    expect(afterClean.worktreeClean).toBe(true);
    expect(afterClean.localSourceDigest).toBe(clean.localSourceDigest);

    writeFileSync(join(repo, "src", "tracked.ts"), "export const value = 2;\n");
    const changed = computeLocalSourceState(repo, ["src/**", "package.json"]);
    expect(changed.worktreeClean).toBe(false);
    expect(changed.localSourceDigest).not.toBe(clean.localSourceDigest);
  });
});
