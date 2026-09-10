import type { ReactNode } from "react";

import type { Applicability, ComponentGuide, GuideLocale } from "../content/component-guide-schema";
import { DocsBlock, DocsList, DocsParagraph, DocsSection, DocsSectionTitle } from "./docs-typography";

const GUIDE_COPY = {
  "zh-CN": {
    whenToUse: "何时使用",
    whenNotToUse: "何时不应使用",
    examples: "示例",
    accessibility: "无障碍",
    controlled: "受控行为",
    responsive: "响应式行为",
    theme: "主题行为",
    notApplicable: "不适用",
  },
  "en-US": {
    whenToUse: "When to use",
    whenNotToUse: "When not to use",
    examples: "Examples",
    accessibility: "Accessibility",
    controlled: "Controlled behavior",
    responsive: "Responsive behavior",
    theme: "Theme behavior",
    notApplicable: "Not applicable",
  },
} as const satisfies Record<GuideLocale, Record<string, string>>;

interface GuideListSectionProps {
  id: string;
  title: string;
  items: string[];
}

function GuideListSection({ id, title, items }: GuideListSectionProps): ReactNode {
  return (
    <DocsSection id={`${id}-section`} aria-labelledby={id}>
      <DocsSectionTitle id={id}>{title}</DocsSectionTitle>
      <DocsList>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </DocsList>
    </DocsSection>
  );
}

interface ApplicabilitySectionProps {
  id: string;
  title: string;
  value: Applicability<string[]>;
  notApplicableLabel: string;
}

function ApplicabilitySection({
  id,
  title,
  value,
  notApplicableLabel,
}: ApplicabilitySectionProps): ReactNode {
  return (
    <DocsSection id={`${id}-section`} aria-labelledby={id}>
      <DocsSectionTitle id={id}>{title}</DocsSectionTitle>
      {value.status === "covered" ? (
        <DocsList>
          {value.content.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </DocsList>
      ) : (
        <DocsParagraph>
          <span className="font-medium text-foreground">{notApplicableLabel}: </span>
          {value.reason}
        </DocsParagraph>
      )}
    </DocsSection>
  );
}

export function ComponentGuideSections({ guide }: { guide: ComponentGuide }): ReactNode {
  const copy = GUIDE_COPY[guide.locale];

  return (
    <div data-slot="component-guide" data-component-guide={guide.slug}>
      <GuideListSection id="guide-when-to-use" title={copy.whenToUse} items={guide.whenToUse} />
      <GuideListSection
        id="guide-when-not-to-use"
        title={copy.whenNotToUse}
        items={guide.whenNotToUse}
      />

      <DocsSection id="guide-examples-section" aria-labelledby="guide-examples">
        <DocsSectionTitle id="guide-examples">{copy.examples}</DocsSectionTitle>
        <DocsBlock className="grid gap-3 sm:grid-cols-2">
          {guide.examples.map((example) => (
            <article
              key={example.id}
              data-guide-example={example.id}
              data-guide-demo-key={example.demoKey}
              className="min-w-0 [overflow-wrap:anywhere] rounded-lg border border-border p-4"
            >
              <h3 className="text-label-14 font-medium text-foreground">{example.title}</h3>
              <DocsParagraph className="mt-1">{example.description}</DocsParagraph>
            </article>
          ))}
        </DocsBlock>
      </DocsSection>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-x-8 [overflow-wrap:anywhere] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ApplicabilitySection
          id="guide-accessibility"
          title={copy.accessibility}
          value={guide.accessibility}
          notApplicableLabel={copy.notApplicable}
        />
        <ApplicabilitySection
          id="guide-controlled"
          title={copy.controlled}
          value={guide.controlledBehavior}
          notApplicableLabel={copy.notApplicable}
        />
        <ApplicabilitySection
          id="guide-responsive"
          title={copy.responsive}
          value={guide.responsiveBehavior}
          notApplicableLabel={copy.notApplicable}
        />
        <ApplicabilitySection
          id="guide-theme"
          title={copy.theme}
          value={guide.themeBehavior}
          notApplicableLabel={copy.notApplicable}
        />
      </div>
    </div>
  );
}
