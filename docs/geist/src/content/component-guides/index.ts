import type {
  ComponentGuide,
  ComponentGuidePair,
  ComponentGuideRegistry,
} from "../component-guide-schema";

export const COMPONENT_GUIDES_ZH: Record<string, ComponentGuide> = {};
export const COMPONENT_GUIDES_EN: Record<string, ComponentGuide> = {};

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
