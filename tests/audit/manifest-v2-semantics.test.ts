import { describe, expect, test } from "vitest";
import { collectManifestSemanticViolations } from "./manifest-v2-semantics.mjs";

type SelectorPair = {
  default: { official: string; local: string };
  byViewport: Record<string, { official: string; local: string }>;
};

type ContractRole = {
  selectors: SelectorPair;
  presence: string;
  acceptanceProfile: string;
  measurementAxes?: readonly string[];
  contextOwnerRole?: string;
  coordinateOwnerRole?: string;
  textRole?: string;
  anchorEdge?: string;
};

type TransparentWrapper = {
  id: string;
  source: string;
  selector: string;
  parentRole: string;
  constraints: Record<string, unknown>;
};

type ContractFixture = {
  demoId: string;
  variant: string;
  state: string;
  clipRole: string;
  evidenceNotBefore: string;
  roles: Record<string, ContractRole>;
  semanticNodeInventory: unknown[];
  transparentWrappers: TransparentWrapper[];
};

const selectors: SelectorPair = {
  default: { official: "[data-official]", local: "[data-local]" },
  byViewport: {},
};

const contract: ContractFixture = {
  demoId: "default",
  variant: "default",
  state: "default",
  clipRole: "root",
  evidenceNotBefore: "2026-08-12T00:00:00.000Z",
  roles: {
    context: {
      selectors,
      presence: "required",
      acceptanceProfile: "measurement-context",
      measurementAxes: ["x", "width", "right"],
    },
    root: {
      selectors,
      presence: "required",
      acceptanceProfile: "context-owned-fill",
      contextOwnerRole: "context",
    },
    label: {
      selectors,
      presence: "required",
      acceptanceProfile: "mapped-text",
    },
    icon: {
      selectors,
      presence: "required",
      acceptanceProfile: "text-adjacent-icon",
      textRole: "label",
      anchorEdge: "right",
    },
    trigger: {
      selectors,
      presence: "required",
      acceptanceProfile: "strict",
      coordinateOwnerRole: "icon",
    },
  },
  semanticNodeInventory: [],
  transparentWrappers: [],
};

const manifestWith = (...contracts: Array<Record<string, unknown>>) => ({
  acceptancePolicy: {
    evidenceEpochNotBefore: "2026-08-12T00:00:00.000Z",
  },
  components: [
    {
      slug: "description",
      demos: [{ id: "default" }],
      variants: ["default"],
      states: ["default"],
      viewports: ["375x812"],
      acceptanceContracts: contracts,
    },
  ],
});

const messagesFor = (manifest: unknown) =>
  collectManifestSemanticViolations(manifest).map(
    (violation: { path: string; reason: string }) => `${violation.path}: ${violation.reason}`,
  );

describe("manifest v2 semantic references", () => {
  test("accepts a closed, acyclic role graph", () => {
    expect(messagesFor(manifestWith(structuredClone(contract)))).toEqual([]);
  });

  test("rejects missing and measurement-context clip roles", () => {
    const missing = structuredClone(contract);
    missing.clipRole = "missing";
    expect(messagesFor(manifestWith(missing))).toContainEqual(
      expect.stringContaining("clipRole must reference an existing role"),
    );

    const contextClip = structuredClone(contract);
    contextClip.clipRole = "context";
    expect(messagesFor(manifestWith(contextClip))).toContainEqual(
      expect.stringContaining("clipRole cannot use measurement-context"),
    );

    const forbiddenClip = structuredClone(contract);
    forbiddenClip.roles.absent = {
      selectors,
      presence: "forbidden",
      acceptanceProfile: "strict",
    };
    forbiddenClip.clipRole = "absent";
    expect(messagesFor(manifestWith(forbiddenClip))).toContainEqual(
      expect.stringContaining("clipRole must reference a required role"),
    );
  });

  test("rejects dangling role references and dependency cycles", () => {
    const dangling = structuredClone(contract);
    dangling.roles.icon.textRole = "missing";
    expect(messagesFor(manifestWith(dangling))).toContainEqual(
      expect.stringContaining("textRole references unknown role missing"),
    );

    const cyclic = structuredClone(contract);
    cyclic.roles.label.coordinateOwnerRole = "trigger";
    expect(messagesFor(manifestWith(cyclic))).toContainEqual(
      expect.stringContaining("role dependency cycle"),
    );
  });

  test("requires every measurement context to own an accepted fill", () => {
    const orphan = structuredClone(contract);
    delete orphan.roles.root;
    orphan.clipRole = "label";
    expect(messagesFor(manifestWith(orphan))).toContainEqual(
      expect.stringContaining("measurement-context must be referenced by context-owned-fill"),
    );
  });

  test("rejects role references with incompatible semantic profiles", () => {
    const wrongText = structuredClone(contract);
    wrongText.roles.icon.textRole = "trigger";
    expect(messagesFor(manifestWith(wrongText))).toContainEqual(
      expect.stringContaining("textRole must reference a required mapped-text role"),
    );

    const wrongContext = structuredClone(contract);
    wrongContext.roles.root.contextOwnerRole = "label";
    expect(messagesFor(manifestWith(wrongContext))).toContainEqual(
      expect.stringContaining(
        "contextOwnerRole must reference a required measurement-context role",
      ),
    );

    const forbiddenOwner = structuredClone(contract);
    forbiddenOwner.roles.absent = {
      selectors,
      presence: "forbidden",
      acceptanceProfile: "strict",
    };
    forbiddenOwner.roles.trigger.coordinateOwnerRole = "absent";
    expect(messagesFor(manifestWith(forbiddenOwner))).toContainEqual(
      expect.stringContaining("coordinateOwnerRole must reference a required role"),
    );
  });

  test("rejects duplicate component cell contracts", () => {
    expect(messagesFor(manifestWith(contract, structuredClone(contract)))).toContainEqual(
      expect.stringContaining("duplicate acceptance contract"),
    );

    const slashManifest = manifestWith(
      { ...structuredClone(contract), demoId: "a/b", variant: "c" },
      { ...structuredClone(contract), demoId: "a", variant: "b/c" },
    );
    slashManifest.components[0].demos.push({ id: "a/b" }, { id: "a" });
    slashManifest.components[0].variants.push("c", "b/c");
    expect(messagesFor(slashManifest)).not.toContainEqual(
      expect.stringContaining("duplicate acceptance contract"),
    );
  });

  test("rejects contracts outside the component capability matrix", () => {
    for (const [field, value] of [
      ["demoId", "missing-demo"],
      ["variant", "missing-variant"],
      ["state", "missing-state"],
    ] as const) {
      const outside = structuredClone(contract);
      outside[field] = value;
      expect(messagesFor(manifestWith(outside))).toContainEqual(
        expect.stringContaining(`${field} is not declared by component`),
      );
    }

    const viewport = structuredClone(contract);
    viewport.roles.root.selectors.byViewport["1920x1080"] = {
      official: "[data-wide-official]",
      local: "[data-wide-local]",
    };
    expect(messagesFor(manifestWith(viewport))).toContainEqual(
      expect.stringContaining("selector viewport is not declared by component"),
    );
  });

  test("validates transparent-wrapper role references and unique ids", () => {
    const dangling = structuredClone(contract);
    dangling.transparentWrappers = [
      {
        id: "wrapper",
        source: "local",
        selector: "[data-wrapper]",
        parentRole: "missing",
        constraints: {},
      },
    ];
    expect(messagesFor(manifestWith(dangling))).toContainEqual(
      expect.stringContaining("parentRole must reference a required role"),
    );

    const duplicate = structuredClone(contract);
    duplicate.transparentWrappers = [
      {
        id: "wrapper",
        source: "local",
        selector: "[data-wrapper-one]",
        parentRole: "root",
        constraints: {},
      },
      {
        id: "wrapper",
        source: "official",
        selector: "[data-wrapper-two]",
        parentRole: "root",
        constraints: {},
      },
    ];
    expect(messagesFor(manifestWith(duplicate))).toContainEqual(
      expect.stringContaining("duplicate transparent wrapper id"),
    );
  });

  test("rejects contract evidence epochs older than the manifest policy", () => {
    const stale = structuredClone(contract);
    stale.evidenceNotBefore = "2026-08-11T23:59:59.999Z";
    expect(messagesFor(manifestWith(stale))).toContainEqual(
      expect.stringContaining("evidenceNotBefore precedes manifest acceptance epoch"),
    );
  });
});
