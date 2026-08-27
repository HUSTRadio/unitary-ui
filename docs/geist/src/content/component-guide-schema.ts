export type GuideLocale = "zh-CN" | "en-US";

export type Applicability<T> =
  | { status: "covered"; content: T }
  | { status: "not-applicable"; reason: string };

export type ComponentGuideExampleKind =
  | "minimal"
  | "variant"
  | "stateful"
  | "advanced"
  | "anti-pattern";

export interface ComponentGuideExample {
  id: string;
  kind: ComponentGuideExampleKind;
  title: string;
  description: string;
  demoKey?: string;
}

export interface ComponentGuide {
  slug: string;
  locale: GuideLocale;
  summary: string;
  whenToUse: string[];
  whenNotToUse: string[];
  examples: ComponentGuideExample[];
  accessibility: Applicability<string[]>;
  controlledBehavior: Applicability<string[]>;
  responsiveBehavior: Applicability<string[]>;
  themeBehavior: Applicability<string[]>;
}

export interface ComponentGuidePair {
  "zh-CN": ComponentGuide;
  "en-US": ComponentGuide;
}

export type ComponentGuideRegistry = Record<string, ComponentGuidePair>;

export const GUIDE_LOCALES = ["zh-CN", "en-US"] as const satisfies readonly GuideLocale[];

export function applicabilitySignature(value: Applicability<unknown>): string {
  return value.status;
}
