import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { beforeAll, describe, expect, test } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const collector = resolve(root, "tests/audit/collect-replica-evidence.mjs");

const manifest = {
  schemaVersion: 2,
  status: "IN_PROGRESS_NO_COMPLETION_CLAIM",
  viewports: [
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ],
  themes: ["light", "dark"],
  allowedStatuses: ["PASS", "FAIL", "MISSING", "BLOCKED", "NOT_APPLICABLE"],
  acceptancePolicy: {
    evidenceEpochNotBefore: "2026-08-12T00:00:00.000Z",
    approvedFontMappings: [
      {
        officialPrimaryFamily: "Geist",
        localPrimaryFamily: "HarmonyOS Sans SC",
      },
      {
        officialPrimaryFamily: "Geist Mono",
        localPrimaryFamily: "JetBrains Maple Mono",
      },
    ],
    approvedIconMappings: [{ officialIconSet: "geist", localIconSet: "lucide" }],
    localSourceInputs: ["src/**", "package.json"],
    pixelAttribution: {
      foregroundColorDistanceMax: 0,
      edgeExpansionDevicePixels: 1,
    },
    systematicExemptions: ["TRANSITION_SHORTHAND", "FLEX_ITEM_MIN_SIZE", "HOST_CHROME"],
    hostChromeRoles: ["root"],
    acceptedBehaviorInfrastructure: [],
  },
  components: [
    {
      slug: "drawer",
      officialUrl: "https://vercel.com/geist/drawer",
      inventoryStatus: "live_enumeration_complete",
      demos: [{ id: "default" }],
      variants: ["default"],
      states: ["open"],
      themes: ["light", "dark"],
      viewports: ["375x812", "768x1024", "1440x900", "1920x1080"],
      interactionRecipes: ["click:trigger"],
      responsiveExpectations: ["drawer remains viewport-bound"],
      selectors: {
        official: "[data-official-root]",
        local: "[data-local-root]",
      },
      interaction: "applicable",
      acceptanceContracts: [
        {
          demoId: "default",
          variant: "default",
          state: "open",
          clipRole: "root",
          evidenceNotBefore: "2026-08-12T01:00:00.000Z",
          roles: {
            root: {
              selectors: {
                default: {
                  official: "[data-official-root]",
                  local: "[data-local-root]",
                },
                byViewport: {},
              },
              presence: "required",
              acceptanceProfile: "strict",
            },
          },
          semanticNodeInventory: [],
          transparentWrappers: [],
        },
      ],
    },
  ],
};

const runCollector = (args: string[]) => {
  try {
    const stdout = execFileSync(process.execPath, [collector, ...args], {
      cwd: root,
      encoding: "utf8",
    });
    return { ok: true as const, value: JSON.parse(stdout), error: "" };
  } catch (error) {
    const failure = error as { stderr?: string; message: string };
    return {
      ok: false as const,
      value: null,
      error: String(failure.stderr ?? failure.message),
    };
  }
};

describe("collector v2 exact-contract dry run", () => {
  let directory: string;
  let manifestPath: string;

  beforeAll(() => {
    directory = mkdtempSync(join(tmpdir(), "geist-collector-v2-"));
    manifestPath = join(directory, "manifest.json");
    writeFileSync(manifestPath, JSON.stringify(manifest));
    // Construct a dirty git repo so local source state detection is deterministic
    // regardless of the real checkout's cleanliness.
    execFileSync("git", ["init", "-q"], { cwd: directory });
    execFileSync("git", ["config", "user.email", "test@example.com"], { cwd: directory });
    execFileSync("git", ["config", "user.name", "Test"], { cwd: directory });
    writeFileSync(join(directory, "package.json"), "{}");
    mkdirSync(join(directory, "src"));
    writeFileSync(join(directory, "src", "index.ts"), "export {}");
    execFileSync("git", ["add", "-A"], { cwd: directory });
    execFileSync("git", ["-c", "commit.gpgsign=false", "commit", "-qm", "init"], {
      cwd: directory,
    });
    // Make the worktree dirty.
    writeFileSync(join(directory, "src", "index.ts"), "export const dirty = true;");
  });

  const args = (source: "official" | "local") => [
    "--dry-run",
    "--manifest",
    manifestPath,
    "--audit-run-id",
    "audit-20260812-01",
    "--repo-root",
    directory,
    "--source",
    source,
    "--slug",
    "drawer",
    "--demo-id",
    "default",
    "--variant",
    "default",
    "--state",
    "open",
    "--theme",
    "dark",
    "--viewport",
    "375x812",
    "--url",
    source === "official" ? "https://ignored.example" : "http://127.0.0.1:5201/drawer",
    "--out",
    directory,
  ];

  test("resolves the official URL, role selectors and contract digest from manifest", () => {
    const result = runCollector(args("official"));
    expect(result.ok, result.error).toBe(true);
    expect(result.value).toMatchObject({
      schemaVersion: 2,
      auditRunId: "audit-20260812-01",
      source: "official",
      slug: "drawer",
      demoId: "default",
      rootSelector: "[data-official-root]",
      roleSelectors: { root: "[data-official-root]" },
      url: "https://vercel.com/geist/drawer",
      effectiveEvidenceNotBefore: "2026-08-12T01:00:00.000Z",
    });
    expect(result.value.contractDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(result.value.navigationStartedAt).toBeNull();
    expect(result.value.stateStabilizedAt).toBeNull();
    expect(result.value.capturedAt).toBeNull();
  });

  test("keeps the local runtime URL but resolves local selectors and source state", () => {
    const result = runCollector(args("local"));
    expect(result.ok, result.error).toBe(true);
    expect(result.value.url).toBe("http://127.0.0.1:5201/drawer");
    expect(result.value.rootSelector).toBe("[data-local-root]");
    expect(result.value.roleSelectors).toEqual({ root: "[data-local-root]" });
    expect(result.value.localRevision).toMatch(/^[a-f0-9]{40}$/);
    expect(result.value.localSourceDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(result.value.localSourceFiles).toContain("package.json");
    expect(result.value.worktreeClean).toBe(false);
  });

  test("rejects CLI selector overrides and cells without an exact contract", () => {
    for (const override of [
      ["--selector", "main"],
      ["--root-selector", "main"],
      ["--role-selector", '{"root":"main"}'],
    ]) {
      const result = runCollector([...args("official"), ...override]);
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/manifest|selector|override/i);
    }

    const missing = args("official");
    missing[missing.indexOf("open")] = "closed";
    const result = runCollector(missing);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/exact acceptance contract/i);
  });
});
