import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { describe, expect, test } from "vitest";
import { collectManifestSemanticViolations } from "./manifest-v2-semantics.mjs";

const auditDir = resolve(import.meta.dirname);
const readJson = (name: string) => JSON.parse(readFileSync(resolve(auditDir, name), "utf8"));

const compileManifestSchema = () => {
  const ajv = new Ajv({ allErrors: true, strict: true });
  addFormats(ajv);
  return ajv.compile(readJson("geist-audit-manifest.schema.json"));
};

describe("Description live-discovery acceptance contract", () => {
  test("description carries a demo:default contract with five role-aware profiles", () => {
    const manifest = readJson("geist-audit-manifest.json");
    const validate = compileManifestSchema();

    expect(validate(manifest), JSON.stringify(validate.errors, null, 2)).toBe(true);
    expect(collectManifestSemanticViolations(manifest)).toEqual([]);

    const description = manifest.components.find(
      (component: { slug: string }) => component.slug === "description",
    );
    expect(description.acceptanceContracts).toBeInstanceOf(Array);
    expect(description.acceptanceContracts.length).toBeGreaterThan(0);

    const contract = description.acceptanceContracts.find(
      (entry: { demoId: string }) => entry.demoId === "default",
    );
    expect(contract).toBeTruthy();
    expect(contract.clipRole).toBe("root");
    expect(contract.variant).toBe("default");
    expect(contract.state).toBe("default");

    const roles = contract.roles;
    expect(Object.keys(roles).sort()).toEqual([
      "content",
      "root",
      "title",
      "tooltip-shell",
      "tooltip-trigger",
    ]);

    // root is the clip target and a strict container/surface
    expect(roles.root).toMatchObject({ presence: "required", acceptanceProfile: "strict" });
    expect(roles.root.selectors.default.local).toBe('[data-demo-id="default"]');

    // title and content carry text and are font-mapping profiles
    expect(roles.title).toMatchObject({ presence: "required", acceptanceProfile: "mapped-text" });
    expect(roles.title.selectors.default.official).toBe(
      'a[href="#default"] ~ * dt[data-geist-description-title]',
    );
    expect(roles.title.selectors.default.local).toBe(
      '[data-demo-id="default"] [data-slot="description-title"]',
    );
    expect(roles.content).toMatchObject({
      presence: "required",
      acceptanceProfile: "mapped-text",
    });
    expect(roles.content.selectors.default.official).toBe(
      'a[href="#default"] ~ * dd[data-geist-description-content]',
    );
    expect(roles.content.selectors.default.local).toBe(
      '[data-demo-id="default"] [data-slot="description-content"]',
    );

    // tooltip shell and trigger are anchored to the mapped title text's right edge
    for (const role of ["tooltip-shell", "tooltip-trigger"]) {
      expect(roles[role]).toMatchObject({
        presence: "required",
        acceptanceProfile: "text-adjacent-icon",
        textRole: "title",
        anchorEdge: "right",
      });
    }
    expect(roles["tooltip-shell"].selectors.default.local).toBe(
      '[data-demo-id="default"] [data-slot="description-tooltip-shell"]',
    );
    expect(roles["tooltip-trigger"].selectors.default.local).toBe(
      '[data-demo-id="default"] [data-slot="description-tooltip"]',
    );
    expect(roles["tooltip-trigger"].selectors.default.official).toBe(
      'a[href="#default"] ~ * [data-testid="legacy/tooltip-trigger"]',
    );
  });

  test("every contract selector is a concrete, non-main, non-sentinel string", () => {
    const manifest = readJson("geist-audit-manifest.json");
    const description = manifest.components.find(
      (component: { slug: string }) => component.slug === "description",
    );
    for (const contract of description.acceptanceContracts) {
      for (const [roleName, role] of Object.entries(contract.roles)) {
        for (const [source, selector] of Object.entries(role.selectors.default)) {
          expect(typeof selector, `${roleName}.${source} must be a string`).toBe("string");
          expect(selector, `${roleName}.${source} must be non-empty`).not.toBe("");
          expect(selector, `${roleName}.${source} must not be main`).not.toBe("main");
          expect(selector, `${roleName}.${source} must not be a sentinel`).not.toContain(
            "[LIVE_SELECTOR]",
          );
        }
      }
    }
  });
});
