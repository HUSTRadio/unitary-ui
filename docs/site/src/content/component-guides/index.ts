import { LAYER_GUIDES_ZH, LAYER_GUIDES_EN } from "./guides-25-layer";
import { PAGED_MEDIA_GUIDES_ZH, PAGED_MEDIA_GUIDES_EN } from "./guides-23-paged-media";
import { PREFETCH_GUIDES_ZH, PREFETCH_GUIDES_EN } from "./guides-24-prefetch";
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
import { GUIDES_17_ZH, GUIDES_17_EN } from "./guides-17";
import { GUIDES_18_ZH, GUIDES_18_EN } from "./guides-18";
import { CHARTS_GUIDES_ZH, CHARTS_GUIDES_EN } from "./guides-19-charts";
import {
  RESPONSIVE_DRAWER_GUIDES_ZH,
  RESPONSIVE_DRAWER_GUIDES_EN,
} from "./guides-20-responsive-drawer";
import { PUBLIC_NAVIGATION_GUIDES_ZH, PUBLIC_NAVIGATION_GUIDES_EN } from "./guides-21-public-navigation";
import { SUB_FRAME_GUIDES_ZH, SUB_FRAME_GUIDES_EN } from "./guides-22-sub-frame";

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
  GUIDES_17_ZH,
  GUIDES_18_ZH,
  CHARTS_GUIDES_ZH,
  RESPONSIVE_DRAWER_GUIDES_ZH,
  PUBLIC_NAVIGATION_GUIDES_ZH,
  SUB_FRAME_GUIDES_ZH,
  PAGED_MEDIA_GUIDES_ZH,
  PREFETCH_GUIDES_ZH,
  LAYER_GUIDES_ZH,
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
  GUIDES_17_EN,
  GUIDES_18_EN,
  CHARTS_GUIDES_EN,
  RESPONSIVE_DRAWER_GUIDES_EN,
  PUBLIC_NAVIGATION_GUIDES_EN,
  SUB_FRAME_GUIDES_EN,
  PAGED_MEDIA_GUIDES_EN,
  PREFETCH_GUIDES_EN,
  LAYER_GUIDES_EN,
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
