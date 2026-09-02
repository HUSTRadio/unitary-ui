import type {
  ComponentGuide,
  ComponentGuidePair,
  ComponentGuideRegistry,
} from "../component-guide-schema";

import { GUIDES_01_ZH, GUIDES_01_EN } from "./guides-01";
import { GUIDES_02_ZH, GUIDES_02_EN } from "./guides-02";
import { GUIDES_03_ZH, GUIDES_03_EN } from "./guides-03";
import { GUIDES_04_ZH, GUIDES_04_EN } from "./guides-04";
import { GUIDES_05_ZH, GUIDES_05_EN } from "./guides-05";
import { GUIDES_06_ZH, GUIDES_06_EN } from "./guides-06";
import { GUIDES_07_ZH, GUIDES_07_EN } from "./guides-07";
import { GUIDES_08_ZH, GUIDES_08_EN } from "./guides-08";
import { GUIDES_09_ZH, GUIDES_09_EN } from "./guides-09";
import { GUIDES_10_ZH, GUIDES_10_EN } from "./guides-10";
import { GUIDES_11_ZH, GUIDES_11_EN } from "./guides-11";
import { GUIDES_12_ZH, GUIDES_12_EN } from "./guides-12";
import { GUIDES_13_ZH, GUIDES_13_EN } from "./guides-13";
import { GUIDES_14_ZH, GUIDES_14_EN } from "./guides-14";
import { GUIDES_15_ZH, GUIDES_15_EN } from "./guides-15";
import { GUIDES_16_ZH, GUIDES_16_EN } from "./guides-16";

const COMPONENT_GUIDES_ZH_PARTS: Record<string, ComponentGuide>[] = [
  GUIDES_01_ZH,
  GUIDES_02_ZH,
  GUIDES_03_ZH,
  GUIDES_04_ZH,
  GUIDES_05_ZH,
  GUIDES_06_ZH,
  GUIDES_07_ZH,
  GUIDES_08_ZH,
  GUIDES_09_ZH,
  GUIDES_10_ZH,
  GUIDES_11_ZH,
  GUIDES_12_ZH,
  GUIDES_13_ZH,
  GUIDES_14_ZH,
  GUIDES_15_ZH,
  GUIDES_16_ZH,
];

const COMPONENT_GUIDES_EN_PARTS: Record<string, ComponentGuide>[] = [
  GUIDES_01_EN,
  GUIDES_02_EN,
  GUIDES_03_EN,
  GUIDES_04_EN,
  GUIDES_05_EN,
  GUIDES_06_EN,
  GUIDES_07_EN,
  GUIDES_08_EN,
  GUIDES_09_EN,
  GUIDES_10_EN,
  GUIDES_11_EN,
  GUIDES_12_EN,
  GUIDES_13_EN,
  GUIDES_14_EN,
  GUIDES_15_EN,
  GUIDES_16_EN,
];

export const COMPONENT_GUIDES_ZH: Record<string, ComponentGuide> = Object.assign(
  {},
  ...COMPONENT_GUIDES_ZH_PARTS,
);

export const COMPONENT_GUIDES_EN: Record<string, ComponentGuide> = Object.assign(
  {},
  ...COMPONENT_GUIDES_EN_PARTS,
);

export const COMPONENT_GUIDES: ComponentGuideRegistry = Object.fromEntries(
  Object.keys(COMPONENT_GUIDES_ZH).map((slug) => [
    slug,
    {
      "zh-CN": COMPONENT_GUIDES_ZH[slug],
      "en-US": COMPONENT_GUIDES_EN[slug],
    } satisfies ComponentGuidePair,
  ]),
);

export function getComponentGuide(
  slug: string,
  locale: keyof ComponentGuidePair,
): ComponentGuide | undefined {
  return COMPONENT_GUIDES[slug]?.[locale];
}
