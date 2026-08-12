import { describe, expect, test } from "vitest";
import { assertEvidenceCellV2 } from "./audit-schema-validator.mjs";
import { buildEvidenceCellV2 } from "./evidence-v2.mjs";

const resolved = {
  schemaVersion: 2,
  auditRunId: "audit-20260812-01",
  contractDigest: "a".repeat(64),
  effectiveEvidenceNotBefore: "2026-08-12T01:00:00.000Z",
  component: "drawer",
  demoId: "default",
  variant: "default",
  state: "open",
  theme: "dark",
  viewportText: "375x812",
  source: "official",
  rootSelector: "[data-root]",
  roleSelectors: { root: "[data-root]" },
  contract: {
    demoId: "default",
    variant: "default",
    state: "open",
    clipRole: "root",
    evidenceNotBefore: "2026-08-12T01:00:00.000Z",
    roles: {
      root: {
        selectors: {
          default: { official: "[data-root]", local: "[data-root]" },
          byViewport: {},
        },
        presence: "required",
        acceptanceProfile: "strict",
      },
    },
    semanticNodeInventory: [],
    transparentWrappers: [],
  },
};

describe("evidence cell v2 builder", () => {
  test("emits only the strict persisted contract fields", () => {
    const cell = buildEvidenceCellV2(
      {
        ...resolved,
        slug: "drawer",
        viewport: { width: 375, height: 812 },
        url: "https://vercel.com/geist/drawer",
        navigationStartedAt: "2026-08-12T02:00:00.000Z",
        stateStabilizedAt: "2026-08-12T02:00:01.000Z",
        localRevision: null,
        worktreeClean: null,
        localSourceDigest: null,
        localSourceFiles: [],
        cdpHttp: "http://127.0.0.1:9223",
        out: "C:/private-output",
        repoRoot: "C:/repo",
      },
      {
        capturedAt: "2026-08-12T02:00:02.000Z",
        observedTheme: { colorScheme: "dark" },
        collectorSha256: "b".repeat(64),
        browserVersion: "Chrome/139.0.0.0",
      },
    );

    expect(cell).toMatchObject({
      schemaVersion: 2,
      source: "official",
      slug: "drawer",
      artifacts: { screenshot: "screenshot.png", metrics: "metrics.json" },
      status: "captured",
    });
    expect(() => assertEvidenceCellV2(cell)).not.toThrow();
    for (const internal of ["cdpHttp", "out", "repoRoot", "runId", "selector"]) {
      expect(cell).not.toHaveProperty(internal);
    }
  });
});
