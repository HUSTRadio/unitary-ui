import { describe, expect, test } from "vitest";

import { auditDir } from "./fixtures/ledger-fixture";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("Geist design gate provenance contract (DD-001c: dual-modality provenance)", () => {
  interface GateEntry {
    slug: string;
    batch?: string;
    gate?: string;
    provenance?: string;
    notes?: string;
    modalityBaseline?: {
      touch?: { source?: string; status?: string };
      pointer?: { component?: string; source?: string; references?: unknown };
    };
    references?: unknown;
  }

  const readGateEntries = (): GateEntry[] => {
    const gate = JSON.parse(
      readFileSync(join(auditDir, "geist-design-gate.json"), "utf8"),
    ) as { components: GateEntry[] };
    return gate.components;
  };

  test("drawer entry evolves from conformance to DUAL_MODALITY_PROVENANCE without losing notes", () => {
    const drawer = readGateEntries().find((entry) => entry.slug === "drawer");
    expect(drawer).toBeDefined();
    expect(drawer!.gate).toBe("DUAL_MODALITY_PROVENANCE");
    // 既有 notes 字段不丢（brief DD-001c）
    expect(drawer!.notes).toBeTruthy();

    const baseline = drawer!.modalityBaseline!;
    expect(baseline.touch).toMatchObject({
      source: "geist_official_measured",
      status: "locked",
    });
    expect(baseline.pointer).toMatchObject({
      component: "side-panel",
      source: "unitary_owned",
    });
    expect(Array.isArray(baseline.pointer!.references)).toBe(true);
    expect(baseline.pointer!.references as string[]).toContain("tremor_floating_inset");
    expect(baseline.pointer!.references as string[]).toContain("internal_material_contract");
  });

  test("side-panel registers as unitary-owned shared-layer entry", () => {
    const entry = readGateEntries().find((component) => component.slug === "side-panel");
    expect(entry, "side-panel must have a machine gate entry").toBeDefined();
    expect(entry!.batch).toBe("B0_SHARED_LAYERS");
    expect(entry!.gate).toBe("TDD_READY");
    expect(entry!.provenance).toBe("unitary_owned");
    expect(Array.isArray(entry!.references)).toBe(true);
    expect((entry!.references as string[]).length).toBeGreaterThan(0);
  });

  test("every unitary_owned entry must cite non-empty string references", () => {
    for (const entry of readGateEntries()) {
      if (entry.provenance !== "unitary_owned" && entry.modalityBaseline?.pointer?.source !== "unitary_owned") {
        continue;
      }
      const cited =
        entry.provenance === "unitary_owned"
          ? entry.references
          : entry.modalityBaseline!.pointer!.references;
      expect(Array.isArray(cited), `${entry.slug} must cite references`).toBe(true);
      expect(
        (cited as unknown[]).length,
        `${entry.slug} must cite at least one reference`,
      ).toBeGreaterThan(0);
      for (const reference of cited as unknown[]) {
        expect(typeof reference, `${entry.slug} references must be strings`).toBe("string");
      }
    }
  });
});
