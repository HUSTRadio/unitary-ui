import { describe, expect, it } from "vitest";

import { applicabilitySignature } from "../docs/site/src/content/component-guide-schema";
import {
  COMPONENT_GUIDES,
  COMPONENT_GUIDES_EN,
  COMPONENT_GUIDES_ZH,
} from "../docs/site/src/content/component-guides";
import { COMPONENTS } from "../docs/site/src/data/components";

const componentSlugs = COMPONENTS.map(({ name }) => name).sort();
const requiredSections = [
  "accessibility",
  "controlledBehavior",
  "responsiveBehavior",
  "themeBehavior",
] as const;

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
      expect(zh.examples.map(({ id, kind, demoKey, showDescriptionInDemo }) => ({ id, kind, demoKey, showDescriptionInDemo }))).toEqual(
        en.examples.map(({ id, kind, demoKey, showDescriptionInDemo }) => ({ id, kind, demoKey, showDescriptionInDemo })),
      );

      for (const section of requiredSections) {
        expect(applicabilitySignature(zh[section]), `${slug}/${section}`).toBe(
          applicabilitySignature(en[section]),
        );
      }
    }
  });
});
