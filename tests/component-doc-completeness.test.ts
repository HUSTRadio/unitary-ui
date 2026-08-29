import { describe, expect, it } from "vitest";

import {
  COMPONENT_GUIDES_EN,
  COMPONENT_GUIDES_ZH,
} from "../docs/geist/src/content/component-guides";
import { COMPONENTS } from "../docs/geist/src/data/components";

const componentSlugs = COMPONENTS.map(({ name }) => name).sort();
const requiredSections = [
  "accessibility",
  "controlledBehavior",
  "responsiveBehavior",
  "themeBehavior",
] as const;

describe("component guide completeness", () => {
  it("provides exactly one Chinese-primary and one English guide for every documented component", () => {
    expect(Object.keys(COMPONENT_GUIDES_ZH).sort()).toEqual(componentSlugs);
    expect(Object.keys(COMPONENT_GUIDES_EN).sort()).toEqual(componentSlugs);
  });

  it("keeps required prose and at least one concise example in both locales", () => {
    for (const slug of componentSlugs) {
      for (const guide of [COMPONENT_GUIDES_ZH[slug], COMPONENT_GUIDES_EN[slug]]) {
        expect(guide, `${slug} is missing a localized guide`).toBeDefined();
        if (!guide) continue;

        expect(guide.slug).toBe(slug);
        expect(guide.summary.trim().length, `${slug}/${guide.locale} summary`).toBeGreaterThan(0);
        expect(guide.whenToUse.length, `${slug}/${guide.locale} whenToUse`).toBeGreaterThan(0);
        expect(guide.whenNotToUse.length, `${slug}/${guide.locale} whenNotToUse`).toBeGreaterThan(
          0,
        );
        expect(guide.examples.length, `${slug}/${guide.locale} examples`).toBeGreaterThan(0);

        for (const section of requiredSections) {
          const value = guide[section];
          if (value.status === "covered") {
            expect(value.content.length, `${slug}/${guide.locale}/${section}`).toBeGreaterThan(0);
          } else {
            expect(
              value.reason.trim().length,
              `${slug}/${guide.locale}/${section}/reason`,
            ).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});
