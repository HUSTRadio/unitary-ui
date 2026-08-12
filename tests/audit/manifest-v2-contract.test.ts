import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { describe, expect, test } from "vitest";
import { collectManifestSemanticViolations } from "./manifest-v2-semantics.mjs";

const root = resolve(import.meta.dirname, "../..");
const auditDir = resolve(root, "tests/audit");
const readJson = (name: string) => JSON.parse(readFileSync(resolve(auditDir, name), "utf8"));

const compileManifestSchema = () => {
  const ajv = new Ajv({ allErrors: true, strict: true });
  addFormats(ajv);
  return ajv.compile(readJson("geist-audit-manifest.schema.json"));
};

const selectorPair = {
  default: {
    official: 'main [data-testid="component"]',
    local: 'main [data-slot="component"]',
  },
  byViewport: {},
};

const validContract = {
  demoId: "default",
  variant: "default",
  state: "default",
  clipRole: "root",
  evidenceNotBefore: "2026-08-12T00:00:00.000Z",
  roles: {
    root: {
      selectors: selectorPair,
      presence: "required",
      acceptanceProfile: "strict",
    },
  },
  semanticNodeInventory: [],
  transparentWrappers: [],
};

const candidateManifest = (contract: Record<string, unknown>) => {
  const manifest = structuredClone(readJson("geist-audit-manifest.json"));
  const description = manifest.components.find(
    (component: { slug: string }) => component.slug === "description",
  );
  description.acceptanceContracts = [contract];
  return manifest;
};

const expectRejected = (manifest: unknown) => {
  const validate = compileManifestSchema();
  expect(validate(manifest), JSON.stringify(validate.errors, null, 2)).toBe(false);
};

describe("Geist audit manifest v2 acceptance contracts", () => {
  test("the checked-in manifest is valid v2 and removes legacy manifest exclusions", () => {
    const manifest = readJson("geist-audit-manifest.json");
    const validate = compileManifestSchema();

    expect(validate(manifest), JSON.stringify(validate.errors, null, 2)).toBe(true);
    expect(collectManifestSemanticViolations(manifest)).toEqual([]);
    expect(manifest.schemaVersion).toBe(2);
    expect(manifest).not.toHaveProperty("globalExclusionPolicy");
    expect(manifest.acceptancePolicy.approvedFontMappings).toEqual([
      { officialPrimaryFamily: "Geist", localPrimaryFamily: "HarmonyOS Sans SC" },
      { officialPrimaryFamily: "Geist Mono", localPrimaryFamily: "JetBrains Maple Mono" },
    ]);
    expect(manifest.acceptancePolicy.localSourceInputs).toContain("src/**");
    expect(
      manifest.acceptancePolicy.pixelAttribution.foregroundColorDistanceMax,
    ).toBeGreaterThanOrEqual(0);
    expect(manifest.acceptancePolicy.pixelAttribution.edgeExpansionDevicePixels).toBe(1);
    expect(
      manifest.components.every(
        (component: Record<string, unknown>) => !("approvedExclusions" in component),
      ),
    ).toBe(true);
  });

  test("a complete strict role contract is accepted", () => {
    const validate = compileManifestSchema();
    const manifest = candidateManifest(validContract);

    expect(validate(manifest), JSON.stringify(validate.errors, null, 2)).toBe(true);
  });

  test("contracts reject missing explicit role fields and live-selector sentinels", () => {
    const missingPresence = structuredClone(validContract);
    delete (missingPresence.roles.root as Record<string, unknown>).presence;
    expectRejected(candidateManifest(missingPresence));

    const sentinel = structuredClone(validContract);
    sentinel.roles.root.selectors.default.official = "main [LIVE_SELECTOR]";
    expectRejected(candidateManifest(sentinel));

    const whitespace = structuredClone(validContract);
    whitespace.roles.root.selectors.default.local = "   ";
    expectRejected(candidateManifest(whitespace));
  });

  test("profile-specific proof fields are mandatory", () => {
    const adjacent = structuredClone(validContract);
    adjacent.roles.root.acceptanceProfile = "text-adjacent-icon";
    expectRejected(candidateManifest(adjacent));

    const contextFill = structuredClone(validContract);
    contextFill.roles.root.acceptanceProfile = "context-owned-fill";
    expectRejected(candidateManifest(contextFill));

    const measurement = structuredClone(validContract);
    measurement.roles.root.acceptanceProfile = "measurement-context";
    expectRejected(candidateManifest(measurement));
  });

  test("profiles reject proof fields outside their explicit whitelist", () => {
    const strict = structuredClone(validContract);
    strict.roles.root.measurementAxes = ["width"];
    expectRejected(candidateManifest(strict));

    const mappedText = structuredClone(validContract);
    mappedText.roles.root.acceptanceProfile = "mapped-text";
    mappedText.roles.root.anchorEdge = "right";
    expectRejected(candidateManifest(mappedText));

    const adjacent = structuredClone(validContract);
    adjacent.roles.root.acceptanceProfile = "text-adjacent-icon";
    adjacent.roles.root.textRole = "label";
    adjacent.roles.root.anchorEdge = "right";
    adjacent.roles.root.contextOwnerRole = "host";
    expectRejected(candidateManifest(adjacent));

    const forbidden = structuredClone(validContract);
    forbidden.roles.root.presence = "forbidden";
    forbidden.roles.root.acceptanceProfile = "mapped-text";
    expectRejected(candidateManifest(forbidden));
  });

  test("required roles allow coordinate owners independently of acceptance profile", () => {
    for (const [profile, proof] of [
      ["measurement-context", { measurementAxes: ["width"] }],
      ["context-owned-fill", { contextOwnerRole: "owner" }],
    ] as const) {
      const candidate = structuredClone(validContract);
      candidate.roles.root = {
        ...candidate.roles.root,
        acceptanceProfile: profile,
        coordinateOwnerRole: "owner",
        ...proof,
      };
      candidate.roles.owner = {
        selectors: selectorPair,
        presence: "required",
        acceptanceProfile: "strict",
      };
      const validate = compileManifestSchema();
      const manifest = candidateManifest(candidate);
      expect(validate(manifest), JSON.stringify(validate.errors, null, 2)).toBe(true);
    }
  });

  test("unknown profiles, unapproved mappings and cell-level exclusions are rejected", () => {
    const unknown = structuredClone(validContract);
    unknown.roles.root.acceptanceProfile = "font-ish";
    expectRejected(candidateManifest(unknown));

    const unapproved = candidateManifest(validContract);
    unapproved.acceptancePolicy.approvedFontMappings.push({
      officialPrimaryFamily: "Geist",
      localPrimaryFamily: "Comic Sans MS",
    });
    expectRejected(unapproved);

    const cellExclusion = structuredClone(validContract) as Record<string, unknown>;
    cellExclusion.approvedExclusions = [];
    expectRejected(candidateManifest(cellExclusion));
  });

  test("pending inventory entries cannot carry an acceptance contract", () => {
    const manifest = structuredClone(readJson("geist-audit-manifest.json"));
    const pending = manifest.components.find(
      (component: { inventoryStatus: string }) =>
        component.inventoryStatus === "pending_live_enumeration",
    );
    pending.acceptanceContracts = [validContract];

    expectRejected(manifest);
  });

  test("live component selectors reject fallbacks and live-discovery sentinels", () => {
    const manifest = structuredClone(readJson("geist-audit-manifest.json"));
    const description = manifest.components.find(
      (component: { slug: string }) => component.slug === "description",
    );
    description.selectors.official = "main [LIVE_SELECTOR]";

    expectRejected(manifest);

    const fallback = structuredClone(readJson("geist-audit-manifest.json"));
    fallback.components.find(
      (component: { slug: string }) => component.slug === "description",
    ).selectors.official = "main";
    expectRejected(fallback);

    for (const selector of [
      " main ",
      "MAIN",
      "main:hover",
      "main[data-x]",
      "div, main",
      "[data-x] main",
      "body > main:hover",
      ":is(main)",
      ":where(main, div)",
      ":is(.a main)",
      ":where(div main)",
      ":is(main > main)",
    ]) {
      const disguised = structuredClone(readJson("geist-audit-manifest.json"));
      disguised.components.find(
        (component: { slug: string }) => component.slug === "description",
      ).selectors.official = selector;
      expect(collectManifestSemanticViolations(disguised)).toContainEqual(
        expect.objectContaining({
          reason: "live component selector cannot target main as the acceptance root",
        }),
      );
    }

    const descendant = structuredClone(readJson("geist-audit-manifest.json"));
    descendant.components.find(
      (component: { slug: string }) => component.slug === "description",
    ).selectors.official = 'main [data-demo-id="default"]';
    const validate = compileManifestSchema();
    expect(validate(descendant), JSON.stringify(validate.errors, null, 2)).toBe(true);
    expect(collectManifestSemanticViolations(descendant)).toEqual([]);

    descendant.components.find(
      (component: { slug: string }) => component.slug === "description",
    ).selectors.official = ':is(main) [data-demo-id="default"]';
    expect(collectManifestSemanticViolations(descendant)).toEqual([]);

    descendant.components.find(
      (component: { slug: string }) => component.slug === "description",
    ).selectors.official = ":is(main [data-demo-id])";
    expect(collectManifestSemanticViolations(descendant)).toEqual([]);
  });
});
