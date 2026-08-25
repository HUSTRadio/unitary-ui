import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

import { auditDir, readJson } from "./fixtures/ledger-fixture";

describe("Geist audit manifest schema gate (Task 2: schema 基础门禁)", () => {
  const schemaPath = join(auditDir, "geist-audit-manifest.schema.json");
  const readSchema = () => JSON.parse(readFileSync(schemaPath, "utf8"));

  test("schema file exists, parses as JSON and is a draft-07 object schema", () => {
    const schema = readSchema();
    expect(schema.$schema).toBe("http://json-schema.org/draft-07/schema#");
    expect(schema.type).toBe("object");
    expect(schema.definitions.component).toBeTypeOf("object");
    expect(schema.required).toContain("components");
  });

  test("schema requires the capability matrix on live entries and blocks contracts on pending entries", () => {
    const componentSchema = readSchema().definitions.component;
    const inventoryBranch = componentSchema.allOf[0];

    expect(componentSchema.required).toContain("inventoryStatus");
    expect(inventoryBranch.if.properties.inventoryStatus.const).toBe("pending_live_enumeration");
    expect(inventoryBranch.then.properties.acceptanceContracts).toBe(false);
    for (const field of [
      "demos",
      "viewports",
      "themes",
      "interactionRecipes",
      "responsiveExpectations",
    ]) {
      expect(
        inventoryBranch.else.required,
        `live component schema must require "${field}"`,
      ).toContain(field);
    }

    expect(inventoryBranch.else.properties.selectors.$ref).toBe(
      "#/definitions/liveComponentSelectors",
    );
    expect(componentSchema.properties.demos.minItems).toBeGreaterThan(0);
    expect(componentSchema.properties.viewports.const).toEqual([
      "375x812",
      "768x1024",
      "1440x900",
      "1920x1080",
    ]);
    expect(componentSchema.properties.themes.const).toEqual(["light", "dark"]);
    expect(componentSchema.properties.interactionRecipes.minItems).toBeGreaterThan(0);
    expect(componentSchema.properties.responsiveExpectations.minItems).toBeGreaterThan(0);
  });

  test("Task 9 live components keep complete matrices; pending inventory cannot claim contracts", () => {
    const manifest = readJson("geist-audit-manifest.json");
    const designGate = readJson("geist-design-gate.json");

    // Task 9 门禁：只有证据支撑的组件允许回填；清单见 docs/audits/geist-component-and-responsive-remediation-design.md §2。
    const BACKFILLED = new Set([
      "button",
      "calendar",
      "checkbox",
      "choicebox",
      "clearable-input",
      "code-block",
      "collapse",
      "combobox",
      "command-menu",
      "context-card",
      "context-menu",
      "description",
      "dots-menu",
      "drawer",
      "empty-state",
      "entity",
      "fieldset",
      "input",
      "keyboard-input",
      "label",
      "modal",
      "multi-select",
      "radio",
      "search-input",
      "select",
      "separator",
      "sheet",
      "slider",
      "textarea",
      "toggle",
      "switch",
    ]);

    // 已回填组件必须保留完整能力矩阵与具体 selector。
    const backfilled = manifest.components.filter((component: { slug: string }) =>
      BACKFILLED.has(component.slug),
    );
    expect(backfilled).toHaveLength(31);
    for (const component of backfilled as Array<{
      slug: string;
      states: string[];
      demos: Array<{ id: string }>;
      viewports: string[];
      themes: string[];
      selectors: { official: string; local: string };
      interactionRecipes: string[];
      responsiveExpectations: string[];
      interaction: string;
    }>) {
      const ids = component.demos.map((demo) => demo.id);
      expect(new Set(ids).size, `${component.slug} demo ids must be unique`).toBe(ids.length);
      expect(component.viewports).toEqual(["375x812", "768x1024", "1440x900", "1920x1080"]);
      expect(component.themes).toEqual(["light", "dark"]);
      expect(component.interactionRecipes.length).toBeGreaterThan(0);
      expect(component.responsiveExpectations.length).toBeGreaterThan(0);
      for (const [side, selector] of Object.entries(component.selectors)) {
        expect(selector, `${component.slug}.${side} selector must be specific`).not.toBe("main");
      }
      const gateEntry = designGate.components.find(
        (entry: { slug: string }) => entry.slug === component.slug,
      );
      expect(gateEntry, `${component.slug} must have a machine gate entry`).toBeDefined();
      if (gateEntry.dimensions.states === "BLOCKED") {
        expect(component.interaction, `${component.slug} blocked states cannot be applicable`).toBe(
          "pending",
        );
        expect(
          component.interactionRecipes.every((recipe) => recipe.startsWith("blocked:")),
          `${component.slug} blocked recipes must be explicitly marked`,
        ).toBe(true);
        expect(
          component.states.some((state) => state.endsWith("-blocked")),
          `${component.slug} blocked states must be visible in the manifest`,
        ).toBe(true);
      }
    }

    // 其余组件可作为 pending inventory 保留，但不得携带 acceptance contract 或伪装成正式证据。
    const skeletons = manifest.components.filter(
      (component: { slug: string }) => !BACKFILLED.has(component.slug),
    );
    expect(skeletons.length).toBe(41);
    for (const skeleton of skeletons) {
      expect(skeleton.inventoryStatus).toBe("pending_live_enumeration");
      expect(skeleton).not.toHaveProperty("acceptanceContracts");
    }
  });
});
