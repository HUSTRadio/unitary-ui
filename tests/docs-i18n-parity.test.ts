import { describe, expect, it } from "vitest";

import { applicabilitySignature } from "../docs/site/src/content/component-guide-schema";
import {
  COMPONENT_GUIDES,
  COMPONENT_GUIDES_EN,
  COMPONENT_GUIDES_ZH,
} from "../docs/site/src/content/component-guides";
import { COMPONENTS } from "../docs/site/src/data/components";
import { COMPONENT_API } from "../docs/site/src/data/component-api";
import { DEMO_COPY } from "../docs/site/src/i18n/components-demo";

const componentSlugs = COMPONENTS.map(({ name }) => name).sort();
const requiredSections = [
  "accessibility",
  "controlledBehavior",
  "responsiveBehavior",
  "themeBehavior",
] as const;

// 比较规格量；重复说明同一规格不算差异，API 标识符也不等同于尺寸。
// Compare measurements, allowing repeated mentions and excluding bare API identifiers.
function measurements(value: unknown): string[] {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  const values = [
    ...text.matchAll(/(-?\d+(?:\.\d+)?)\s*(px|rem|em|ms|s|dvh|vh|vw|%|像素|毫秒)(?![a-z])/g),
  ].map(
    ([, number, unit]) =>
      `${Number(number)}${unit === "像素" ? "px" : unit === "毫秒" ? "ms" : unit}`,
  );
  return [...new Set(values)].sort();
}

describe("component guide locale parity", () => {
  it("pairs every documented component in the bilingual registry", () => {
    expect(Object.keys(COMPONENT_GUIDES).sort()).toEqual(componentSlugs);
  });

  it("keeps Chinese and English guides structurally equivalent", () => {
    for (const slug of componentSlugs) {
      const zh = COMPONENT_GUIDES_ZH[slug];
      const en = COMPONENT_GUIDES_EN[slug];
      expect(zh, `${slug} is missing the Chinese guide`).toBeDefined();
      expect(en, `${slug} is missing the English guide`).toBeDefined();
      if (!zh || !en) continue;

      expect(zh.locale).toBe("zh-CN");
      expect(en.locale).toBe("en-US");
      expect(
        zh.examples.map(({ id, kind, demoKey, showDescriptionInDemo }) => ({
          id,
          kind,
          demoKey,
          showDescriptionInDemo,
        })),
      ).toEqual(
        en.examples.map(({ id, kind, demoKey, showDescriptionInDemo }) => ({
          id,
          kind,
          demoKey,
          showDescriptionInDemo,
        })),
      );

      for (const section of requiredSections) {
        expect(applicabilitySignature(zh[section]), `${slug}/${section}`).toBe(
          applicabilitySignature(en[section]),
        );
      }
    }
  });

  it("keeps numeric specifications equivalent in guide sections and examples", () => {
    for (const slug of componentSlugs) {
      const zh = COMPONENT_GUIDES_ZH[slug];
      const en = COMPONENT_GUIDES_EN[slug];
      for (const field of ["summary", "whenToUse", "whenNotToUse", ...requiredSections] as const) {
        expect.soft(measurements(zh[field]), `${slug}/${field}`).toEqual(measurements(en[field]));
      }
      for (const example of en.examples) {
        const localized = zh.examples.find(({ id }) => id === example.id)!;
        expect
          .soft(measurements(localized.description), `${slug}/${example.id}`)
          .toEqual(measurements(example.description));
      }
    }
  });

  it("keeps numeric specifications equivalent in API rows, metadata and demo copy", () => {
    for (const [slug, api] of Object.entries(COMPONENT_API)) {
      for (const row of api.rows) {
        expect
          .soft(measurements(row.descriptionZh), `${slug}/${row.name}`)
          .toEqual(measurements(row.description));
      }
      for (const note of api.notes ?? []) {
        expect.soft(measurements(note.zh), `${slug}/note`).toEqual(measurements(note.en));
      }
    }
    for (const component of COMPONENTS) {
      expect
        .soft(
          measurements(component.descriptionZh ?? component.description),
          `${component.name}/description`,
        )
        .toEqual(measurements(component.description));
      expect
        .soft(
          measurements(component.bestPracticesZh ?? component.bestPractices ?? []),
          `${component.name}/bestPractices`,
        )
        .toEqual(measurements(component.bestPractices ?? []));
    }
    for (const [en, zh] of Object.entries(DEMO_COPY["zh-CN"])) {
      expect.soft(measurements(zh), en).toEqual(measurements(en));
    }
  });
});
