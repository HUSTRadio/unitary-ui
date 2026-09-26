import { describe, expect, test } from "vitest";
import { collectMetricsContractViolations } from "./evidence-v2.mjs";

const config = {
  contract: {
    roles: {
      root: { presence: "required", acceptanceProfile: "strict" },
      label: { presence: "required", acceptanceProfile: "mapped-text" },
      absent: { presence: "forbidden", acceptanceProfile: "strict" },
    },
  },
};

const validMetrics = {
  roles: {
    root: {
      present: true,
      textEvidence: { fontLoadStatus: true },
    },
    label: {
      present: true,
      textEvidence: {
        fontLoadStatus: true,
        clientRects: [{ x: 0, y: 0, width: 20, height: 16 }],
        clientWidth: 20,
        scrollWidth: 20,
        whiteSpace: "normal",
        overflow: "visible",
        textOverflow: "clip",
      },
    },
    absent: {
      present: false,
      textEvidence: null,
    },
  },
};

describe("collector v2 metrics contract", () => {
  test("accepts exact presence and loaded fonts", () => {
    expect(collectMetricsContractViolations(config, validMetrics)).toEqual([]);
  });

  test("rejects missing required and present forbidden roles", () => {
    const metrics = structuredClone(validMetrics);
    metrics.roles.root.present = false;
    metrics.roles.absent.present = true;
    expect(collectMetricsContractViolations(config, metrics)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ reason: expect.stringContaining("required role is missing") }),
        expect.objectContaining({ reason: expect.stringContaining("forbidden role is present") }),
      ]),
    );
  });

  test("rejects incomplete mapped-text evidence", () => {
    const incomplete = structuredClone(validMetrics);
    delete (incomplete.roles.label.textEvidence as Partial<typeof incomplete.roles.label.textEvidence>)
      .clientRects;
    expect(collectMetricsContractViolations(config, incomplete)).toContainEqual(
      expect.objectContaining({ reason: expect.stringContaining("text evidence is incomplete") }),
    );
  });
});
